
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
    console.log("[INFO] Starting complete Airtable sync setup");
    
    // STEP 1: Create the system_query function first
    console.log("[INFO] Creating system_query function...");
    
    const createFunctionSQL = `
      CREATE OR REPLACE FUNCTION system_query(query text)
      RETURNS json
      LANGUAGE plpgsql
      SECURITY DEFINER
      AS $$
      DECLARE
        result json;
      BEGIN
        EXECUTE query;
        result := json_build_object('success', true);
        RETURN result;
      EXCEPTION WHEN OTHERS THEN
        result := json_build_object('success', false, 'error', SQLERRM);
        RETURN result;
      END;
      $$;
    `;
    
    // Execute SQL directly using rpc
    const { data: systemQueryResult, error: systemQueryError } = await supabase
      .rpc('system_query', { query: createFunctionSQL })
      .catch(e => {
        // If the system_query function doesn't exist yet, we need a direct query
        console.log("[INFO] Creating system_query function via direct SQL execution...");
        return supabase.sql(createFunctionSQL);
      });
    
    if (systemQueryError) {
      console.log("[INFO] Alternative approach to create system_query function...");
      // Try direct SQL as a last resort
      const { error: directError } = await supabase.sql(createFunctionSQL);
      if (directError) {
        throw new Error(`Failed to create system_query function: ${directError.message}`);
      }
    }
    
    console.log("[SUCCESS] Created system_query function");
    
    // STEP 2: Set up the database triggers using our new system_query function
    console.log("[INFO] Setting up database webhooks");

    // Create SQL for setting up webhooks that call our sync-to-airtable function
    const setupSQL = `
      -- First, enable the necessary extensions (these might already be enabled)
      CREATE EXTENSION IF NOT EXISTS pg_net;
      CREATE EXTENSION IF NOT EXISTS http;

      -- Drop existing triggers if they exist to prevent duplicates
      DROP TRIGGER IF EXISTS guests_webhook_trigger ON public.guests;
      DROP TRIGGER IF EXISTS rsvps_webhook_trigger ON public.rsvps;
      
      -- Drop existing functions if they exist 
      DROP FUNCTION IF EXISTS public.guests_webhook_function();
      DROP FUNCTION IF EXISTS public.rsvps_webhook_function();

      -- Create a webhook function for the guests table
      CREATE OR REPLACE FUNCTION public.guests_webhook_function()
      RETURNS trigger AS $$
      DECLARE
        r record;
        payload json;
        endpoint text;
      BEGIN
        -- Create a payload for the webhook
        payload = json_build_object(
          'type', TG_OP,
          'table', 'guests',
          'record', row_to_json(NEW)
        );
        
        -- Define the endpoint URL for our sync-to-airtable edge function
        endpoint = '${Deno.env.get('SUPABASE_FUNCTIONS_URL')}/sync-to-airtable';
        
        -- Make the HTTP call to our edge function
        PERFORM http((
          'POST',
          endpoint,
          ARRAY[('Content-Type', 'application/json')],
          payload::text,
          5
        )::http_request);

        -- Log the webhook call
        RAISE NOTICE 'Called webhook with payload: %', payload;
        
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql SECURITY DEFINER;

      -- Create a webhook function for the rsvps table
      CREATE OR REPLACE FUNCTION public.rsvps_webhook_function()
      RETURNS trigger AS $$
      DECLARE
        r record;
        payload json;
        endpoint text;
      BEGIN
        -- Create a payload for the webhook
        payload = json_build_object(
          'type', TG_OP,
          'table', 'rsvps',
          'record', row_to_json(NEW)
        );
        
        -- Define the endpoint URL for our sync-to-airtable edge function
        endpoint = '${Deno.env.get('SUPABASE_FUNCTIONS_URL')}/sync-to-airtable';
        
        -- Make the HTTP call to our edge function
        PERFORM http((
          'POST',
          endpoint,
          ARRAY[('Content-Type', 'application/json')],
          payload::text,
          5
        )::http_request);

        -- Log the webhook call
        RAISE NOTICE 'Called webhook with payload: %', payload;
        
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql SECURITY DEFINER;

      -- Create triggers that call the webhook functions
      CREATE TRIGGER guests_webhook_trigger
      AFTER INSERT OR UPDATE
      ON public.guests
      FOR EACH ROW
      EXECUTE FUNCTION public.guests_webhook_function();

      CREATE TRIGGER rsvps_webhook_trigger
      AFTER INSERT OR UPDATE
      ON public.rsvps
      FOR EACH ROW
      EXECUTE FUNCTION public.rsvps_webhook_function();
    `;

    // Execute the SQL using our newly created system_query function
    console.log("[INFO] Setting up webhook triggers...");
    const { data: setupResult, error: setupError } = await supabase.rpc('system_query', { query: setupSQL });

    if (setupError) {
      throw new Error(`Failed to set up webhook triggers: ${setupError.message}`);
    }

    console.log("[SUCCESS] Database webhooks successfully set up");
    
    // STEP 3: Test the Airtable connection
    console.log("[INFO] Testing the Airtable sync system");
    
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
    
    // STEP 4: Create a test guest to trigger a sync
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
    
    return new Response(JSON.stringify({
      success: true,
      message: "Complete Airtable sync setup successful!",
      steps: {
        systemQueryFunction: {
          success: true,
          message: "System query function created successfully"
        },
        webhookTriggers: {
          success: true,
          message: "Database webhook triggers set up successfully"
        },
        airtableConnection: airtableResult,
        testGuestCreated: guestData[0]
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200
    });
  } catch (error) {
    console.error("[ERROR] Error setting up Airtable sync:", error);
    return new Response(JSON.stringify({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500
    });
  }
});
