
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

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

interface WebhookPayload {
  type: string;
  table: string;
  record: GuestRecord | RSVPRecord;
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

// Function to sync a guest to Airtable
async function syncGuestToAirtable(guest: GuestRecord): Promise<void> {
  try {
    console.log(`[DEBUG] Syncing guest with Supabase ID: ${guest.id}`);
    
    if (!airtableApiKey || !airtableBaseId || !airtableGuestsTableId) {
      throw new Error("Missing required environment variables for Airtable");
    }
    
    // Build a filter formula to find records with matching Supabase ID
    const filterFormula = `{id}="${guest.id}"`;
    const encodedFilterFormula = encodeURIComponent(filterFormula);
    
    // Check if the record exists in Airtable
    const checkResponse = await fetch(
      `https://api.airtable.com/v0/${airtableBaseId}/${airtableGuestsTableId}?filterByFormula=${encodedFilterFormula}`,
      {
        headers: {
          'Authorization': `Bearer ${airtableApiKey}`,
          'Content-Type': 'application/json',
        },
      }
    );
    
    if (!checkResponse.ok) {
      const errorData = await checkResponse.text();
      throw new Error(`Airtable check failed with status ${checkResponse.status}: ${errorData}`);
    }
    
    const checkData = await checkResponse.json();
    
    // Prepare the record for Airtable
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
    
    // If record exists, update it
    if (checkData.records && checkData.records.length > 0) {
      const airtableId = checkData.records[0].id;
      
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
      
      if (!updateResponse.ok) {
        const errorData = await updateResponse.text();
        throw new Error(`Airtable update failed with status ${updateResponse.status}: ${errorData}`);
      }
      
      console.log(`[SUCCESS] Updated guest record in Airtable with ID: ${guest.id}`);
    } 
    // If record doesn't exist, create it
    else {
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
      
      if (!createResponse.ok) {
        const errorData = await createResponse.text();
        throw new Error(`Airtable create failed with status ${createResponse.status}: ${errorData}`);
      }
      
      console.log(`[SUCCESS] Created new guest record in Airtable with ID: ${guest.id}`);
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
    
    if (!airtableApiKey || !airtableBaseId || !airtableRsvpsTableId) {
      throw new Error("Missing required environment variables for Airtable");
    }
    
    // Build a filter formula to find records with matching Supabase ID
    const filterFormula = `{id}="${rsvp.id}"`;
    const encodedFilterFormula = encodeURIComponent(filterFormula);
    
    // Check if the record exists in Airtable
    const checkResponse = await fetch(
      `https://api.airtable.com/v0/${airtableBaseId}/${airtableRsvpsTableId}?filterByFormula=${encodedFilterFormula}`,
      {
        headers: {
          'Authorization': `Bearer ${airtableApiKey}`,
          'Content-Type': 'application/json',
        },
      }
    );
    
    if (!checkResponse.ok) {
      const errorData = await checkResponse.text();
      throw new Error(`Airtable check failed with status ${checkResponse.status}: ${errorData}`);
    }
    
    const checkData = await checkResponse.json();
    
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
    
    // If record exists, update it
    if (checkData.records && checkData.records.length > 0) {
      const airtableId = checkData.records[0].id;
      
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
      
      if (!updateResponse.ok) {
        const errorData = await updateResponse.text();
        throw new Error(`Airtable update failed with status ${updateResponse.status}: ${errorData}`);
      }
      
      console.log(`[SUCCESS] Updated RSVP record in Airtable with ID: ${rsvp.id}`);
    } 
    // If record doesn't exist, create it
    else {
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
      
      if (!createResponse.ok) {
        const errorData = await createResponse.text();
        throw new Error(`Airtable create failed with status ${createResponse.status}: ${errorData}`);
      }
      
      console.log(`[SUCCESS] Created new RSVP record in Airtable with ID: ${rsvp.id}`);
    }
  } catch (error) {
    console.error(`[ERROR] Error syncing RSVP with ID ${rsvp.id} to Airtable:`, error);
    throw error;
  }
}

// Function to test Airtable connection
async function testAirtableConnection(): Promise<{success: boolean, message: string}> {
  try {
    console.log("Testing Airtable API connection...");
    
    if (!airtableApiKey || !airtableBaseId || !airtableGuestsTableId) {
      return { 
        success: false, 
        message: "Missing required environment variables for Airtable" 
      };
    }
    
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
        airtableGuestsTableId: !!airtableGuestsTableId
      };
      
      return new Response(JSON.stringify({ 
        success: true, 
        message: "Airtable sync is ready to process webhook payloads",
        environmentVarsSet: envVars,
        airtableConnection: connectionTest
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      });
    }
    
    // For POST requests, process the webhook payload or manual sync request
    if (req.method === 'POST') {
      // Process the webhook payload
      const payload = await req.json() as WebhookPayload;
      console.log("[DEBUG] Received payload:", JSON.stringify(payload));
      
      // Use waitUntil for background processing to prevent timeouts
      if (typeof EdgeRuntime !== 'undefined') {
        console.log("[DEBUG] Using EdgeRuntime.waitUntil for background processing");
        EdgeRuntime.waitUntil(processPayload(payload));
        
        return new Response(JSON.stringify({ 
          success: true,
          message: "Sync request received and processing in background"
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        });
      } else {
        // Process synchronously if EdgeRuntime is not available
        console.log("[DEBUG] EdgeRuntime not available, processing synchronously");
        await processPayload(payload);
        
        return new Response(JSON.stringify({ 
          success: true,
          message: "Sync completed successfully"
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        });
      }
    }
    
    // If not GET or POST, return method not allowed
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

// Process the webhook payload in the background
async function processPayload(payload: WebhookPayload): Promise<void> {
  try {
    const { type, table, record } = payload;
    console.log(`[DEBUG] Processing ${type} event for table ${table}`);
    
    if (!record || !record.id) {
      console.error("[ERROR] Invalid payload: missing record or record ID");
      throw new Error(`Invalid payload: missing record or record ID`);
    }
    
    // Add retry logic with exponential backoff
    let retries = 3;
    let success = false;
    
    while (retries > 0 && !success) {
      try {
        if (table === 'guests') {
          await syncGuestToAirtable(record as GuestRecord);
        } else if (table === 'rsvps') {
          await syncRsvpToAirtable(record as RSVPRecord);
        } else {
          console.log(`[INFO] Ignoring change to table ${table}`);
        }
        success = true;
      } catch (error) {
        retries--;
        if (retries > 0) {
          const delay = Math.pow(2, 3 - retries) * 1000; // Exponential backoff: 2s, 4s, 8s
          console.log(`[WARN] Sync attempt failed, retrying in ${delay}ms. Retries left: ${retries}`);
          await new Promise(resolve => setTimeout(resolve, delay));
        } else {
          throw error;
        }
      }
    }
    
    console.log(`[SUCCESS] Successfully processed ${table} record with ID ${record.id}`);
  } catch (error) {
    console.error("[ERROR] Failed to process payload:", error);
    throw error;
  }
}
