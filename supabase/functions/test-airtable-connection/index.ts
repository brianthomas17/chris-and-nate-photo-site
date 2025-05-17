
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// Set up CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Environment variables
const airtableApiKey = Deno.env.get('AIRTABLE_API_KEY');
const airtableBaseId = Deno.env.get('AIRTABLE_BASE_ID');
const airtableGuestsTableId = Deno.env.get('AIRTABLE_GUESTS_TABLE_ID');
const airtableRsvpsTableId = Deno.env.get('AIRTABLE_RSVPS_TABLE_ID');

// Main handler function
serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // First check if we have all required environment variables
    if (!airtableApiKey || !airtableBaseId || !airtableGuestsTableId) {
      throw new Error("Missing required environment variables for Airtable");
    }

    // Generate a test record with timestamp to make it unique
    const testTimestamp = new Date().toISOString();
    const testId = crypto.randomUUID();
    const testRecord = {
      id: testId,
      first_name: `Test User ${testTimestamp}`,
      email: `test-${Date.now()}@example.com`,
      invitation_type: "main event",
      phone_number: "555-123-4567",
      created_at: testTimestamp,
      updated_at: testTimestamp
    };

    console.log("[DEBUG] Attempting to create test record in Airtable:", JSON.stringify(testRecord));

    // Prepare the record for Airtable
    const fields = {
      id: testRecord.id,
      first_name: testRecord.first_name,
      email: testRecord.email,
      phone_number: testRecord.phone_number,
      invitation_type: testRecord.invitation_type,
      created_at: testRecord.created_at,
      updated_at: testRecord.updated_at
    };

    // Try to create the record in Airtable
    console.log(`[DEBUG] Creating Airtable record at URL: https://api.airtable.com/v0/${airtableBaseId}/${airtableGuestsTableId}`);
    console.log(`[DEBUG] Create payload: ${JSON.stringify({ records: [{ fields }] })}`);
    
    const createResponse = await fetch(
      `https://api.airtable.com/v0/${airtableBaseId}/${airtableGuestsTableId}`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${airtableApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          records: [{ fields }]
        }),
      }
    );
    
    // Parse the response
    const responseText = await createResponse.text();
    console.log(`[DEBUG] Airtable create response status: ${createResponse.status}`);
    console.log(`[DEBUG] Airtable create response body: ${responseText}`);
    
    // Return detailed information about the connection test
    const result = {
      success: createResponse.ok,
      statusCode: createResponse.status,
      statusText: createResponse.statusText,
      airtableEnvironmentVars: {
        apiKeyPresent: !!airtableApiKey,
        baseIdPresent: !!airtableBaseId,
        guestsTableIdPresent: !!airtableGuestsTableId,
        rsvpsTableIdPresent: !!airtableRsvpsTableId
      },
      testRecord: testRecord,
      response: createResponse.ok ? JSON.parse(responseText) : responseText
    };

    return new Response(
      JSON.stringify(result, null, 2),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error("[ERROR] Error testing Airtable connection:", error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      }, null, 2),
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
