
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Environment variables
const airtableApiKey = Deno.env.get('AIRTABLE_API_KEY');
const airtableBaseId = Deno.env.get('AIRTABLE_BASE_ID');
const airtableGuestsTableId = Deno.env.get('AIRTABLE_GUESTS_TABLE_ID');
const airtableRsvpsTableId = Deno.env.get('AIRTABLE_RSVPS_TABLE_ID');

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("[INFO] Testing Airtable API connection");
    
    // Check environment variables
    if (!airtableApiKey) {
      return new Response(JSON.stringify({ 
        success: false, 
        message: "Missing AIRTABLE_API_KEY environment variable" 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400
      });
    }
    
    if (!airtableBaseId) {
      return new Response(JSON.stringify({ 
        success: false, 
        message: "Missing AIRTABLE_BASE_ID environment variable" 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400
      });
    }
    
    if (!airtableGuestsTableId) {
      return new Response(JSON.stringify({ 
        success: false, 
        message: "Missing AIRTABLE_GUESTS_TABLE_ID environment variable" 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400
      });
    }
    
    if (!airtableRsvpsTableId) {
      return new Response(JSON.stringify({ 
        success: false, 
        message: "Missing AIRTABLE_RSVPS_TABLE_ID environment variable" 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400
      });
    }
    
    // Test connection to guests table
    const guestsResponse = await fetch(
      `https://api.airtable.com/v0/${airtableBaseId}/${airtableGuestsTableId}?maxRecords=1`,
      {
        headers: {
          'Authorization': `Bearer ${airtableApiKey}`,
          'Content-Type': 'application/json',
        },
      }
    );
    
    if (!guestsResponse.ok) {
      const errorText = await guestsResponse.text();
      return new Response(JSON.stringify({ 
        success: false, 
        message: `Failed to connect to Airtable guests table: ${guestsResponse.status} - ${errorText}`
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      });
    }
    
    // Test connection to RSVPs table
    const rsvpsResponse = await fetch(
      `https://api.airtable.com/v0/${airtableBaseId}/${airtableRsvpsTableId}?maxRecords=1`,
      {
        headers: {
          'Authorization': `Bearer ${airtableApiKey}`,
          'Content-Type': 'application/json',
        },
      }
    );
    
    if (!rsvpsResponse.ok) {
      const errorText = await rsvpsResponse.text();
      return new Response(JSON.stringify({ 
        success: false, 
        message: `Failed to connect to Airtable RSVPs table: ${rsvpsResponse.status} - ${errorText}`
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      });
    }
    
    // Both connections successful
    const guestsData = await guestsResponse.json();
    const rsvpsData = await rsvpsResponse.json();
    
    return new Response(JSON.stringify({ 
      success: true, 
      message: "Successfully connected to Airtable API",
      details: {
        guests: {
          recordCount: guestsData.records?.length || 0
        },
        rsvps: {
          recordCount: rsvpsData.records?.length || 0
        }
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200
    });
  } catch (error) {
    console.error("[ERROR] Error testing Airtable connection:", error);
    return new Response(JSON.stringify({ 
      success: false, 
      message: `Error connecting to Airtable: ${error instanceof Error ? error.message : String(error)}`
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500
    });
  }
});
