import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Environment variables
const supabaseUrl = Deno.env.get('SUPABASE_URL');
const supabaseServiceRole = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

// Set up CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Create a Supabase client with service role key for admin access
const createSupabaseClient = () => {
  if (!supabaseUrl || !supabaseServiceRole) {
    throw new Error("Missing required environment variables: SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  }
  return createClient(supabaseUrl, supabaseServiceRole);
};

// Keep track of connection status
let isConnected = false;
let heartbeatInterval: number | undefined;
let reconnectAttempts = 0;
const MAX_RECONNECT_ATTEMPTS = 10;
const RECONNECT_DELAY = 5000; // 5 seconds

// Process changes to tables and call the sync function
async function processTableChange(table: string, payload: any) {
  console.log(`[DEBUG] Processing ${payload.eventType} event for ${table} table`);
  console.log(`[DEBUG] Change received for ${table} table:`, JSON.stringify(payload));
  
  try {
    // Call the sync-to-airtable function
    console.log(`[DEBUG] Preparing to call sync-to-airtable function for ${table} change`);
    
    const webhookPayload = {
      type: payload.eventType,
      table: table,
      record: payload.new,
    };
    
    console.log(`[DEBUG] Webhook payload for ${table} change: ${JSON.stringify(webhookPayload)}`);
    console.log(`[DEBUG] Calling sync-to-airtable function at ${supabaseUrl}/functions/v1/sync-to-airtable`);
    
    const response = await fetch(`${supabaseUrl}/functions/v1/sync-to-airtable`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabaseServiceRole}`,
      },
      body: JSON.stringify(webhookPayload),
    });
    
    console.log(`[DEBUG] sync-to-airtable response status: ${response.status}`);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[ERROR] Error calling sync-to-airtable for ${table}: ${response.status} - ${errorText}`);
      throw new Error(`Error calling sync-to-airtable for ${table}: ${response.status} - ${errorText}`);
    }
    
    const result = await response.json();
    console.log(`[SUCCESS] Successfully triggered sync for ${table} change, response:`, JSON.stringify(result));
    return true;
  } catch (error) {
    console.error(`[ERROR] Error processing ${table} change:`, error);
    return false;
  }
}

// Set up the realtime subscription
async function setupRealtimeSubscription(supabase: any): Promise<boolean> {
  try {
    console.log("[DEBUG] Setting up realtime subscription...");
    
    const channel = supabase
      .channel('schema-db-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'guests' }, async (payload: any) => {
        await processTableChange('guests', payload);
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'rsvps' }, async (payload: any) => {
        await processTableChange('rsvps', payload);
      })
      .subscribe((status: string) => {
        console.log(`[DEBUG] Subscription status changed to: ${status}`);
        
        if (status === 'SUBSCRIBED') {
          console.log('[INFO] Successfully subscribed to database changes');
          isConnected = true;
          reconnectAttempts = 0;
          
          // Set up heartbeat to keep connection alive
          if (heartbeatInterval) clearInterval(heartbeatInterval);
          heartbeatInterval = setInterval(() => {
            console.log('[DEBUG] Sending heartbeat to keep connection alive');
            // The channel.send method is not needed as the subscription itself keeps the connection alive
          }, 30000); // Send a heartbeat every 30 seconds
        } else if (status === 'CLOSED' || status === 'CHANNEL_ERROR') {
          console.log(`[WARN] Subscription lost connection: ${status}`);
          isConnected = false;
          
          if (heartbeatInterval) clearInterval(heartbeatInterval);
          
          // Attempt to reconnect
          if (reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
            reconnectAttempts++;
            console.log(`[INFO] Attempting to reconnect (${reconnectAttempts}/${MAX_RECONNECT_ATTEMPTS})...`);
            setTimeout(() => {
              setupRealtimeSubscription(createSupabaseClient())
                .catch(err => console.error('[ERROR] Reconnection attempt failed:', err));
            }, RECONNECT_DELAY);
          } else {
            console.error('[ERROR] Max reconnection attempts reached. Giving up.');
          }
        }
      });
    
    // Return success if we get this far
    return true;
  } catch (error) {
    console.error('[ERROR] Error setting up realtime subscription:', error);
    isConnected = false;
    return false;
  }
}

// Main function to keep the subscription alive
async function maintainRealtimeConnection() {
  const checkInterval = 60000; // Check connection every minute
  
  // Initial setup
  let supabase = createSupabaseClient();
  let setupSuccess = await setupRealtimeSubscription(supabase);
  
  if (!setupSuccess) {
    console.error('[ERROR] Initial subscription setup failed');
  }
  
  // Set up periodic connection check
  setInterval(async () => {
    if (!isConnected) {
      console.log('[INFO] Connection check: Not connected. Attempting to reconnect...');
      supabase = createSupabaseClient();
      await setupRealtimeSubscription(supabase);
    } else {
      console.log('[INFO] Connection check: Connected');
    }
  }, checkInterval);
  
  return true;
}

// The server handler
serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("[DEBUG] Starting realtime listener service...");
    
    // Check if required environment variables are set
    if (!supabaseUrl || !supabaseServiceRole) {
      throw new Error("Missing required environment variables: SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
    }
    
    // Start the connection monitor
    const connectionStarted = await maintainRealtimeConnection();
    
    if (!connectionStarted) {
      throw new Error("Failed to start realtime connection");
    }
    
    // Keep the function alive by not resolving the response right away
    // Instead, wait for a while to ensure the subscription is established
    await new Promise(resolve => setTimeout(resolve, 10000));
    
    // Return a success response
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Realtime listener has been started with enhanced reliability and is now monitoring guests and rsvps tables',
        status: isConnected ? 'connected' : 'connecting'
      }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('[ERROR] Error starting realtime listener:', error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  }
});
