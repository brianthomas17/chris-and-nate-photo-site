
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

interface GuestRecord {
  id: string;
  first_name: string;
  email: string;
  phone_number?: string | null;
  invitation_type: string;
  party_id?: string | null;
  created_at?: string;
  updated_at?: string;
}

interface RSVPRecord {
  id: string;
  guest_id: string;
  attending: boolean;
  plus_one: boolean;
  dietary_restrictions?: string | null;
  created_at?: string;
  updated_at?: string;
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Environment variables
const airtableApiKey = Deno.env.get('AIRTABLE_API_KEY');
const airtableBaseId = Deno.env.get('AIRTABLE_BASE_ID');
const airtableRsvpsTableId = Deno.env.get('AIRTABLE_RSVPS_TABLE_ID');
const airtableGuestsTableId = Deno.env.get('AIRTABLE_GUESTS_TABLE_ID');
const supabaseUrl = Deno.env.get('SUPABASE_URL');
const supabaseServiceRole = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

// Create a Supabase client
const supabase = createClient(supabaseUrl!, supabaseServiceRole!);

// Function to test Airtable API connection
async function testAirtableConnection(): Promise<{success: boolean, message: string}> {
  try {
    console.log("Testing Airtable API connection...");
    
    // Check if all required env variables are set
    if (!airtableApiKey || !airtableBaseId || !airtableGuestsTableId) {
      return { 
        success: false, 
        message: "Missing required environment variables for Airtable" 
      };
    }
    
    // Try to fetch a single record from the guests table
    const response = await fetch(
      `https://api.airtable.com/v0/${airtableBaseId}/${airtableGuestsTableId}?maxRecords=1`,
      {
        headers: {
          'Authorization': `Bearer ${airtableApiKey}`,
          'Content-Type': 'application/json',
        },
      }
    );
    
    if (!response.ok) {
      const errorText = await response.text();
      return { 
        success: false, 
        message: `Failed to connect to Airtable API: ${response.status} - ${errorText}`
      };
    }
    
    const data = await response.json();
    return { 
      success: true, 
      message: `Successfully connected to Airtable API. Found ${data.records?.length || 0} records in test query.`
    };
  } catch (error) {
    return { 
      success: false, 
      message: `Error connecting to Airtable: ${error instanceof Error ? error.message : String(error)}`
    };
  }
}

// Function to sync a guest to Airtable
async function syncGuestToAirtable(guest: GuestRecord): Promise<void> {
  try {
    console.log(`[DEBUG] Syncing guest with Supabase ID: ${guest.id}`);
    console.log(`[DEBUG] Guest details: ${JSON.stringify(guest)}`);
    
    if (!airtableApiKey || !airtableBaseId || !airtableGuestsTableId) {
      throw new Error("Missing required environment variables for Airtable");
    }
    
    // Build a filter formula to find records with matching Supabase ID in the id field
    const filterFormula = `{id}="${guest.id}"`;
    console.log(`[DEBUG] Searching in Airtable with filter formula: ${filterFormula}`);
    
    // First check if the record exists in Airtable by looking for the Supabase ID
    const encodedFilterFormula = encodeURIComponent(filterFormula);
    const checkUrl = `https://api.airtable.com/v0/${airtableBaseId}/${airtableGuestsTableId}?filterByFormula=${encodedFilterFormula}`;
    console.log(`[DEBUG] Checking Airtable with URL: ${checkUrl}`);
    
    const checkResponse = await fetch(checkUrl, {
      headers: {
        'Authorization': `Bearer ${airtableApiKey}`,
        'Content-Type': 'application/json',
      },
    });
    
    console.log(`[DEBUG] Airtable check response status: ${checkResponse.status}`);
    
    if (!checkResponse.ok) {
      const errorData = await checkResponse.text();
      console.error(`[ERROR] Airtable check failed with status ${checkResponse.status}: ${errorData}`);
      throw new Error(`Airtable check failed with status ${checkResponse.status}: ${errorData}`);
    }
    
    const checkData = await checkResponse.json();
    console.log(`[DEBUG] Airtable check results: ${JSON.stringify(checkData)}`);
    console.log(`[DEBUG] Found ${checkData.records ? checkData.records.length : 0} records matching ID ${guest.id}`);
    
    // Prepare the record for Airtable
    // Map the fields to match Airtable's column structure
    const fields = {
      id: guest.id,
      first_name: guest.first_name,
      email: guest.email,
      phone_number: guest.phone_number || '',
      invitation_type: guest.invitation_type,
      party_id: guest.party_id || '',
      created_at: guest.created_at,
      updated_at: guest.updated_at || new Date().toISOString(),
    };
    
    console.log(`[DEBUG] Prepared fields for Airtable: ${JSON.stringify(fields)}`);
    
    // If record exists, update it
    if (checkData.records && checkData.records.length > 0) {
      const airtableId = checkData.records[0].id;
      console.log(`[DEBUG] Found existing Airtable record with ID: ${airtableId} for Supabase ID: ${guest.id}`);
      
      console.log(`[DEBUG] Updating Airtable record at URL: https://api.airtable.com/v0/${airtableBaseId}/${airtableGuestsTableId}/${airtableId}`);
      console.log(`[DEBUG] Update payload: ${JSON.stringify({ fields })}`);
      
      const updateResponse = await fetch(
        `https://api.airtable.com/v0/${airtableBaseId}/${airtableGuestsTableId}/${airtableId}`,
        {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${airtableApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ fields }),
        }
      );
      
      console.log(`[DEBUG] Airtable update response status: ${updateResponse.status}`);
      
      if (!updateResponse.ok) {
        const errorData = await updateResponse.text();
        console.error(`[ERROR] Airtable update failed with status ${updateResponse.status}: ${errorData}`);
        throw new Error(`Airtable update failed with status ${updateResponse.status}: ${errorData}`);
      }
      
      const updateResult = await updateResponse.json();
      console.log(`[SUCCESS] Updated guest record in Airtable with ID: ${guest.id}, result: ${JSON.stringify(updateResult)}`);
    } 
    // If record doesn't exist, create it
    else {
      console.log(`[DEBUG] No existing record found in Airtable for Supabase ID: ${guest.id}, creating new record`);
      
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
      
      console.log(`[DEBUG] Airtable create response status: ${createResponse.status}`);
      
      if (!createResponse.ok) {
        const errorData = await createResponse.text();
        console.error(`[ERROR] Airtable create failed with status ${createResponse.status}: ${errorData}`);
        throw new Error(`Airtable create failed with status ${createResponse.status}: ${errorData}`);
      }
      
      const createResult = await createResponse.json();
      console.log(`[SUCCESS] Created new guest record in Airtable with ID: ${guest.id}, result: ${JSON.stringify(createResult)}`);
    }
  } catch (error) {
    console.error(`[ERROR] Error syncing guest with ID ${guest.id} to Airtable:`, error);
    throw error;
  }
}

// Function to sync an RSVP to Airtable
async function syncRsvpToAirtable(rsvp: RSVPRecord): Promise<void> {
  try {
    console.log(`[DEBUG] Syncing RSVP with Supabase ID: ${rsvp.id}`);
    console.log(`[DEBUG] RSVP details: ${JSON.stringify(rsvp)}`);
    
    if (!airtableApiKey || !airtableBaseId || !airtableRsvpsTableId) {
      throw new Error("Missing required environment variables for Airtable");
    }
    
    // Build a filter formula to find records with matching Supabase ID in the id field
    const filterFormula = `{id}="${rsvp.id}"`;
    console.log(`[DEBUG] Searching in Airtable with filter formula: ${filterFormula}`);
    
    // First check if the record exists in Airtable
    const encodedFilterFormula = encodeURIComponent(filterFormula);
    const checkUrl = `https://api.airtable.com/v0/${airtableBaseId}/${airtableRsvpsTableId}?filterByFormula=${encodedFilterFormula}`;
    console.log(`[DEBUG] Checking Airtable with URL: ${checkUrl}`);
    
    const checkResponse = await fetch(checkUrl, {
      headers: {
        'Authorization': `Bearer ${airtableApiKey}`,
        'Content-Type': 'application/json',
      },
    });
    
    console.log(`[DEBUG] Airtable check response status: ${checkResponse.status}`);
    
    if (!checkResponse.ok) {
      const errorData = await checkResponse.text();
      console.error(`[ERROR] Airtable check failed with status ${checkResponse.status}: ${errorData}`);
      throw new Error(`Airtable check failed with status ${checkResponse.status}: ${errorData}`);
    }
    
    const checkData = await checkResponse.json();
    console.log(`[DEBUG] Airtable check results: ${JSON.stringify(checkData)}`);
    console.log(`[DEBUG] Found ${checkData.records ? checkData.records.length : 0} records matching ID ${rsvp.id}`);
    
    // Prepare the record for Airtable
    const fields = {
      id: rsvp.id,
      guest_id: rsvp.guest_id,
      attending: rsvp.attending,
      plus_one: rsvp.plus_one,
      dietary_restrictions: rsvp.dietary_restrictions || '',
      created_at: rsvp.created_at,
      updated_at: rsvp.updated_at || new Date().toISOString(),
    };
    
    console.log(`[DEBUG] Prepared fields for Airtable: ${JSON.stringify(fields)}`);
    
    // If record exists, update it
    if (checkData.records && checkData.records.length > 0) {
      const airtableId = checkData.records[0].id;
      console.log(`[DEBUG] Found existing Airtable record with ID: ${airtableId} for Supabase ID: ${rsvp.id}`);
      
      console.log(`[DEBUG] Updating Airtable record at URL: https://api.airtable.com/v0/${airtableBaseId}/${airtableRsvpsTableId}/${airtableId}`);
      console.log(`[DEBUG] Update payload: ${JSON.stringify({ fields })}`);
      
      const updateResponse = await fetch(
        `https://api.airtable.com/v0/${airtableBaseId}/${airtableRsvpsTableId}/${airtableId}`,
        {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${airtableApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ fields }),
        }
      );
      
      console.log(`[DEBUG] Airtable update response status: ${updateResponse.status}`);
      
      if (!updateResponse.ok) {
        const errorData = await updateResponse.text();
        console.error(`[ERROR] Airtable update failed with status ${updateResponse.status}: ${errorData}`);
        throw new Error(`Airtable update failed with status ${updateResponse.status}: ${errorData}`);
      }
      
      const updateResult = await updateResponse.json();
      console.log(`[SUCCESS] Updated RSVP record in Airtable with ID: ${rsvp.id}, result: ${JSON.stringify(updateResult)}`);
    } 
    // If record doesn't exist, create it
    else {
      console.log(`[DEBUG] No existing record found in Airtable for Supabase ID: ${rsvp.id}, creating new record`);
      
      console.log(`[DEBUG] Creating Airtable record at URL: https://api.airtable.com/v0/${airtableBaseId}/${airtableRsvpsTableId}`);
      console.log(`[DEBUG] Create payload: ${JSON.stringify({ records: [{ fields }] })}`);
      
      const createResponse = await fetch(
        `https://api.airtable.com/v0/${airtableBaseId}/${airtableRsvpsTableId}`,
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
      
      console.log(`[DEBUG] Airtable create response status: ${createResponse.status}`);
      
      if (!createResponse.ok) {
        const errorData = await createResponse.text();
        console.error(`[ERROR] Airtable create failed with status ${createResponse.status}: ${errorData}`);
        throw new Error(`Airtable create failed with status ${createResponse.status}: ${errorData}`);
      }
      
      const createResult = await createResponse.json();
      console.log(`[SUCCESS] Created new RSVP record in Airtable with ID: ${rsvp.id}, result: ${JSON.stringify(createResult)}`);
    }
  } catch (error) {
    console.error(`[ERROR] Error syncing RSVP with ID ${rsvp.id} to Airtable:`, error);
    throw error;
  }
}

// Main handler function for the Edge Function
serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Handle GET requests (status check/debugging)
    if (req.method === 'GET') {
      console.log("[DEBUG] Received GET request to sync-to-airtable function");
      
      // Test the Airtable connection
      const connectionTest = await testAirtableConnection();
      
      // Check if all required environment variables are set
      const envVars = {
        airtableApiKey: !!airtableApiKey,
        airtableBaseId: !!airtableBaseId,
        airtableRsvpsTableId: !!airtableRsvpsTableId,
        airtableGuestsTableId: !!airtableGuestsTableId,
        supabaseUrl: !!supabaseUrl,
        supabaseServiceRole: !!supabaseServiceRole
      };
      
      return new Response(JSON.stringify({ 
        success: true, 
        message: "This endpoint is working and expects POST requests with payload data",
        environmentVarsSet: envVars,
        airtableConnection: connectionTest
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      });
    }
    
    // For POST requests, process the webhook payload
    if (req.method === 'POST') {
      // Process the webhook payload
      const payload = await req.json();
      console.log("[DEBUG] Received webhook payload:", JSON.stringify(payload));
      
      // Handle database changes
      const { type, table, record } = payload;
      console.log(`[DEBUG] Processing ${type} event for table ${table}`);
      
      if (!record || !record.id) {
        console.error("[ERROR] Invalid payload: missing record or record ID");
        throw new Error(`Invalid payload: missing record or record ID`);
      }
      
      if (table === 'guests') {
        await syncGuestToAirtable(record as GuestRecord);
        console.log(`[SUCCESS] Successfully synced guest with ID ${record.id} to Airtable`);
      } else if (table === 'rsvps') {
        await syncRsvpToAirtable(record as RSVPRecord);
        console.log(`[SUCCESS] Successfully synced RSVP with ID ${record.id} to Airtable`);
      } else {
        console.log(`[INFO] Ignoring change to table ${table}`);
      }

      return new Response(JSON.stringify({ 
        success: true,
        message: `Successfully processed ${type} event for ${table} with ID ${record.id}`
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      });
    }
    
    // If not GET or POST, return method not allowed
    console.warn(`[WARN] Received unsupported HTTP method: ${req.method}`);
    return new Response(JSON.stringify({ 
      error: "Method not allowed. Only GET and POST are supported." 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 405,
    });
  } catch (error) {
    console.error("[ERROR] Error processing request:", error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
