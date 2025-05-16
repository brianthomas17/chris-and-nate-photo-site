
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

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("[INFO] Setting up connection to sync changes to Airtable");
    
    if (!supabaseUrl || !supabaseServiceRole) {
      throw new Error("Missing required environment variables: SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
    }

    // Create a test guest to verify the sync works
    console.log("[INFO] Creating a test guest to verify sync");
    const supabase = createClient(supabaseUrl, supabaseServiceRole);
    
    const testGuest = {
      first_name: `Test Guest ${new Date().toISOString()}`,
      email: `test-${Date.now()}@example.com`,
      invitation_type: 'main event'
    };
    
    const { data: guestData, error: guestError } = await supabase
      .from('guests')
      .insert(testGuest)
      .select();
    
    if (guestError) {
      throw new Error(`Failed to create test guest: ${guestError.message}`);
    }
    
    console.log("[INFO] Test guest created:", guestData);
    
    // Now directly call the sync-to-airtable function to add this guest to Airtable
    if (guestData && guestData.length > 0) {
      console.log("[INFO] Directly calling sync-to-airtable for test guest");
      
      const syncResponse = await fetch(`${supabaseUrl}/functions/v1/sync-to-airtable`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${supabaseServiceRole}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          type: 'INSERT',
          table: 'guests',
          record: guestData[0]
        })
      });
      
      const syncResult = await syncResponse.text();
      console.log("[INFO] Sync result:", syncResult);
      
      if (!syncResponse.ok) {
        throw new Error(`Failed to sync test guest: ${syncResponse.status} - ${syncResult}`);
      }
    }
    
    // Return success response
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Airtable sync system has been tested successfully',
        testGuest: guestData,
        note: 'Check your Airtable to confirm the test guest was synchronized'
      }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('[ERROR] Error in sync test:', error);
    
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
