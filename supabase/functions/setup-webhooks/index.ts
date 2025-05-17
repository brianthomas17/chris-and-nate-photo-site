
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

// This function will set up webhooks for our guests and rsvps tables
serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
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

    // Execute the SQL
    const { error } = await supabase.rpc('system_query', { query: setupSQL });

    if (error) {
      console.error("[ERROR] Error setting up webhooks:", error);
      throw new Error(`Failed to set up webhook triggers: ${error.message}`);
    }

    console.log("[SUCCESS] Database webhooks successfully set up");

    return new Response(
      JSON.stringify({
        success: true,
        message: "Database webhook triggers have been set up successfully. Records in guests and rsvps tables will now be automatically synced to Airtable."
      }), 
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
        status: 200 
      }
    );
  } catch (error) {
    console.error("[ERROR] Error setting up webhooks:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }), 
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
        status: 500 
      }
    );
  }
});
