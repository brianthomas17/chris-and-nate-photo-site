
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
    console.log("[INFO] Creating database triggers for Airtable sync");
    
    if (!supabaseUrl || !supabaseServiceRole) {
      throw new Error("Missing required environment variables");
    }
    
    const supabase = createClient(supabaseUrl, supabaseServiceRole);
    
    // Create functions to notify on changes
    const createFunctions = await supabase.rpc('supabase_functions.http_request', {
      method: 'POST',
      url: `${supabaseUrl}/rest/v1/rpc/exec_sql`,
      headers: { 'Content-Type': 'application/json' },
      body: {
        sql: `
          -- Function for guests table
          CREATE OR REPLACE FUNCTION public.notify_guest_change()
          RETURNS trigger AS $$
          DECLARE
            payload JSONB;
            sync_url TEXT;
          BEGIN
            sync_url := '${supabaseUrl}/functions/v1/sync-to-airtable';
            
            payload := jsonb_build_object(
              'type', TG_OP,
              'table', 'guests',
              'record', row_to_json(NEW)
            );
            
            -- Log payload for debugging
            RAISE LOG 'Sending guest change to sync function: %', payload;
            
            -- Call the sync-to-airtable function via HTTP
            PERFORM net.http_post(
              url := sync_url,
              body := payload,
              headers := '{"Content-Type": "application/json", "Authorization": "Bearer ${supabaseServiceRole}"}'::JSONB
            );
            
            RETURN NEW;
          END;
          $$ LANGUAGE plpgsql SECURITY DEFINER;
          
          -- Function for rsvps table
          CREATE OR REPLACE FUNCTION public.notify_rsvp_change()
          RETURNS trigger AS $$
          DECLARE
            payload JSONB;
            sync_url TEXT;
          BEGIN
            sync_url := '${supabaseUrl}/functions/v1/sync-to-airtable';
            
            payload := jsonb_build_object(
              'type', TG_OP,
              'table', 'rsvps',
              'record', row_to_json(NEW)
            );
            
            -- Log payload for debugging
            RAISE LOG 'Sending rsvp change to sync function: %', payload;
            
            -- Call the sync-to-airtable function via HTTP
            PERFORM net.http_post(
              url := sync_url,
              body := payload,
              headers := '{"Content-Type": "application/json", "Authorization": "Bearer ${supabaseServiceRole}"}'::JSONB
            );
            
            RETURN NEW;
          END;
          $$ LANGUAGE plpgsql SECURITY DEFINER;
        `
      }
    });
    
    if (createFunctions.error) {
      throw new Error(`Failed to create functions: ${createFunctions.error.message}`);
    }
    
    // Create triggers that will call our functions
    const createTriggers = await supabase.rpc('supabase_functions.http_request', {
      method: 'POST',
      url: `${supabaseUrl}/rest/v1/rpc/exec_sql`,
      headers: { 'Content-Type': 'application/json' },
      body: {
        sql: `
          -- First drop any existing triggers to prevent errors on recreation
          DROP TRIGGER IF EXISTS guests_sync_trigger ON public.guests;
          DROP TRIGGER IF EXISTS rsvps_sync_trigger ON public.rsvps;
          
          -- Create triggers for guests table
          CREATE TRIGGER guests_sync_trigger
          AFTER INSERT OR UPDATE
          ON public.guests
          FOR EACH ROW
          EXECUTE FUNCTION public.notify_guest_change();
          
          -- Create triggers for rsvps table
          CREATE TRIGGER rsvps_sync_trigger
          AFTER INSERT OR UPDATE
          ON public.rsvps
          FOR EACH ROW
          EXECUTE FUNCTION public.notify_rsvp_change();
          
          -- Enable realtime for these tables
          ALTER TABLE public.guests REPLICA IDENTITY FULL;
          ALTER TABLE public.rsvps REPLICA IDENTITY FULL;
          
          -- Make sure the tables are in the publication
          ALTER PUBLICATION supabase_realtime ADD TABLE public.guests;
          ALTER PUBLICATION supabase_realtime ADD TABLE public.rsvps;
        `
      }
    });
    
    if (createTriggers.error) {
      throw new Error(`Failed to create triggers: ${createTriggers.error.message}`);
    }
    
    // Return a success response
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Database triggers for Airtable sync created successfully'
      }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('[ERROR] Error creating database triggers:', error);
    
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
