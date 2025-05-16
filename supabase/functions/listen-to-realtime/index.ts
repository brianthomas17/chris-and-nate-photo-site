
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Environment variables
const supabaseUrl = Deno.env.get('SUPABASE_URL');
const supabaseServiceRole = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

// Create a Supabase client
const supabase = createClient(supabaseUrl!, supabaseServiceRole!);

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Test the Airtable connection
    console.log("[INFO] Testing the Airtable sync system");
    
    // First, test the Airtable connection
    const airtableResponse = await fetch(`${Deno.env.get('SUPABASE_FUNCTIONS_URL')}/sync-to-airtable`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    if (!airtableResponse.ok) {
      const errorText = await airtableResponse.text();
      throw new Error(`Failed to connect to Airtable: ${airtableResponse.status} - ${errorText}`);
    }
    
    const airtableResult = await airtableResponse.json();
    console.log("[INFO] Airtable connection result:", JSON.stringify(airtableResult));
    
    // Create a test guest to trigger a sync
    console.log("[INFO] Creating a test guest to trigger sync");
    
    const { data: guestData, error: guestError } = await supabase
      .from('guests')
      .insert({
        first_name: `Test Guest ${new Date().toISOString()}`,
        email: `test-${Date.now()}@example.com`,
        invitation_type: 'main event'
      })
      .select();
    
    if (guestError) {
      throw new Error(`Error creating test guest: ${guestError.message}`);
    }
    
    console.log("[SUCCESS] Created test guest:", guestData);
    
    // Manually trigger a sync to make sure it works
    console.log("[INFO] Manually syncing the test guest to Airtable");
    
    const syncResponse = await fetch(`${Deno.env.get('SUPABASE_FUNCTIONS_URL')}/sync-to-airtable`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: 'INSERT',
        table: 'guests',
        record: guestData[0]
      })
    });
    
    if (!syncResponse.ok) {
      const errorText = await syncResponse.text();
      throw new Error(`Failed to sync test guest: ${syncResponse.status} - ${errorText}`);
    }
    
    const syncResult = await syncResponse.json();
    console.log("[INFO] Manual sync result:", JSON.stringify(syncResult));
    
    return new Response(JSON.stringify({
      success: true,
      message: "Airtable sync test complete. Created a test guest and synced it to Airtable.",
      airtableConnectionStatus: airtableResult,
      testGuestCreated: guestData[0],
      manualSyncResult: syncResult
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200
    });
  } catch (error) {
    console.error("[ERROR] Error testing Airtable sync:", error);
    return new Response(JSON.stringify({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500
    });
  }
});
