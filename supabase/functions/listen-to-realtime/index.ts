
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Environment variables
const supabaseUrl = Deno.env.get('SUPABASE_URL');
const supabaseServiceRole = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

// Create a Supabase client with service role key for admin access
const supabase = createClient(supabaseUrl!, supabaseServiceRole!);

serve(async (req) => {
  // Set up CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  };

  // Handle OPTIONS request for CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers });
  }

  try {
    console.log("Starting realtime listener service...");
    
    // Set up the realtime channel to listen for changes
    const channel = supabase
      .channel('schema-db-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'guests' }, async (payload) => {
        console.log('Change received for guests table:', payload);
        
        try {
          // Call the sync-to-airtable function
          const response = await fetch(`${supabaseUrl}/functions/v1/sync-to-airtable`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${supabaseServiceRole}`,
            },
            body: JSON.stringify({
              type: payload.eventType,
              table: 'guests',
              record: payload.new,
            }),
          });
          
          if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Error calling sync-to-airtable: ${response.status} - ${errorText}`);
          }
          
          console.log('Successfully triggered sync for guest change');
        } catch (error) {
          console.error('Error processing guest change:', error);
        }
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'rsvps' }, async (payload) => {
        console.log('Change received for rsvps table:', payload);
        
        try {
          // Call the sync-to-airtable function
          const response = await fetch(`${supabaseUrl}/functions/v1/sync-to-airtable`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${supabaseServiceRole}`,
            },
            body: JSON.stringify({
              type: payload.eventType,
              table: 'rsvps',
              record: payload.new,
            }),
          });
          
          if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Error calling sync-to-airtable: ${response.status} - ${errorText}`);
          }
          
          console.log('Successfully triggered sync for rsvp change');
        } catch (error) {
          console.error('Error processing rsvp change:', error);
        }
      })
      .subscribe((status) => {
        console.log('Subscription status:', status);
      });

    // Wait for a few seconds to allow the subscription to be established
    await new Promise(resolve => setTimeout(resolve, 5000));

    // Return a success response
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Realtime listener has been started and is now monitoring guests and rsvps tables' 
      }),
      {
        headers: {
          ...headers,
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('Error starting realtime listener:', error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      {
        status: 500,
        headers: {
          ...headers,
          'Content-Type': 'application/json',
        },
      }
    );
  }
});
