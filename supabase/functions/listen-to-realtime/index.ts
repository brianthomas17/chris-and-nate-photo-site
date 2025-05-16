
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

// Create supabase admin client
const supabase = createClient(
  supabaseUrl!,
  supabaseServiceRole!,
  {
    auth: {
      persistSession: false
    }
  }
);

// Enable database triggers via the REST API
async function enableDatabaseTriggers() {
  try {
    console.log('[INFO] Setting up database triggers for guests and rsvps tables');
    
    // Enable realtime for guests table
    const { error: guestsError } = await supabase.rpc('supabase_functions.http_request', {
      method: 'POST',
      url: `${supabaseUrl}/rest/v1/guests?on_conflict=id`,
      headers: { 'Content-Type': 'application/json', 'Prefer': 'return=minimal' },
      body: {}
    });

    if (guestsError) {
      console.error('[ERROR] Failed to enable realtime for guests table:', guestsError);
      throw guestsError;
    }
    
    // Enable realtime for rsvps table
    const { error: rsvpsError } = await supabase.rpc('supabase_functions.http_request', {
      method: 'POST',
      url: `${supabaseUrl}/rest/v1/rsvps?on_conflict=id`,
      headers: { 'Content-Type': 'application/json', 'Prefer': 'return=minimal' },
      body: {}
    });

    if (rsvpsError) {
      console.error('[ERROR] Failed to enable realtime for rsvps table:', rsvpsError);
      throw rsvpsError;
    }
    
    console.log('[SUCCESS] Successfully set up database triggers');
    return true;
  } catch (error) {
    console.error('[ERROR] Failed to set up database triggers:', error);
    return false;
  }
}

// Create database triggers for the tables
async function setupDBTriggers() {
  try {
    console.log('[INFO] Setting up database triggers via direct SQL');
    
    // Using supabase admin client to execute SQL that creates database triggers
    const { error: createTriggersError } = await supabase.rpc('supabase_functions.http_request', {
      method: 'POST',
      url: `${supabaseUrl}/rest/v1/rpc/create_sync_triggers`,
      headers: { 'Content-Type': 'application/json' },
      body: {}
    });

    if (createTriggersError) {
      console.error('[ERROR] Failed to create database triggers:', createTriggersError);
      throw createTriggersError;
    }
    
    console.log('[SUCCESS] Successfully created database triggers');
    return true;
  } catch (error) {
    console.error('[ERROR] Failed to create database triggers:', error);
    return false;
  }
}

// Verify that the sync-to-airtable function is working
async function testSyncFunction() {
  try {
    console.log('[INFO] Testing sync-to-airtable function');
    
    const response = await fetch(`${supabaseUrl}/functions/v1/sync-to-airtable`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${supabaseServiceRole}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[ERROR] Sync function test failed with status ${response.status}: ${errorText}`);
      return {
        success: false,
        status: response.status,
        message: errorText
      };
    }
    
    const result = await response.json();
    console.log('[SUCCESS] Sync function test successful:', result);
    return {
      success: true,
      status: response.status,
      result
    };
  } catch (error) {
    console.error('[ERROR] Failed to test sync function:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

// Add a record to check the sync is working
async function testAddRecord() {
  try {
    console.log('[INFO] Testing sync by adding a test record');
    
    const testGuest = {
      first_name: 'Test User',
      email: `test-${new Date().getTime()}@example.com`,
      invitation_type: 'main event'
    };
    
    const { data, error } = await supabase.from('guests').insert(testGuest).select();
    
    if (error) {
      console.error('[ERROR] Failed to insert test record:', error);
      return {
        success: false,
        message: error.message
      };
    }
    
    console.log('[SUCCESS] Test record added:', data);
    return {
      success: true,
      record: data
    };
  } catch (error) {
    console.error('[ERROR] Failed to add test record:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("[INFO] Starting database sync setup process");
    
    // Check if required environment variables are set
    if (!supabaseUrl || !supabaseServiceRole) {
      throw new Error("Missing required environment variables: SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
    }
    
    // First test if the sync-to-airtable function is working
    const syncTest = await testSyncFunction();
    
    // Set up database triggers
    const triggersEnabled = await enableDatabaseTriggers();
    
    // If enabled via API fails, try with SQL
    let triggerSetupResults = { success: triggersEnabled };
    if (!triggersEnabled) {
      triggerSetupResults = await setupDBTriggers();
    }
    
    // Optional: Add a test record to verify the sync works
    const testResults = req.url.includes('test=true') 
      ? await testAddRecord() 
      : { executed: false, message: 'Test not requested' };
    
    // Return a success response
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Database sync setup complete',
        syncFunctionTest: syncTest,
        triggerSetup: triggerSetupResults,
        testRecordResults: testResults
      }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('[ERROR] Error setting up database sync:', error);
    
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
