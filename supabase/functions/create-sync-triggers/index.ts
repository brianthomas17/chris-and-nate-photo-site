
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

// This function will create the system_query function in the database
serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("[INFO] Creating system_query function");

    // Create the system_query function that will allow us to execute SQL from edge functions
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

    // Execute the SQL directly with the PostgreSQL client
    const { data, error } = await supabase.rpc('system_query', { query: createFunctionSQL }).catch(e => {
      // If the function doesn't exist yet, we'll get an error
      // We can try creating it directly
      return supabase.from('_temp_create_system_query').select('*').or('1.eq.1').then(() => {
        return { data: null, error: e };
      });
    });

    if (error) {
      // Try an alternative approach with a direct query if we got an error
      console.log("[WARN] Error creating system_query function, trying alternative method");
      
      // Try a direct query as a fallback
      const { data: directData, error: directError } = await supabase.from('pg_catalog.pg_proc')
        .select('proname')
        .eq('proname', 'system_query')
        .maybeSingle();
      
      if (directError) {
        throw new Error(`Failed to check if system_query exists: ${directError.message}`);
      }
      
      if (!directData) {
        // The function doesn't exist, so we need to create it
        // Without the system_query function, we'll use a different approach
        console.log("[INFO] system_query function doesn't exist, creating it differently");
        
        // We'll need to navigate the user to the SQL editor instead
        return new Response(JSON.stringify({
          success: false,
          message: "Cannot automatically create system_query function. Please run the SQL manually in the SQL editor.",
          sqlToRun: createFunctionSQL
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500
        });
      }
    }

    console.log("[SUCCESS] system_query function is available");

    return new Response(JSON.stringify({
      success: true,
      message: "The system_query function is ready. You can now run the setup-webhooks function to configure database triggers."
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200
    });
  } catch (error) {
    console.error("[ERROR] Error creating system_query function:", error);
    return new Response(JSON.stringify({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500
    });
  }
});
