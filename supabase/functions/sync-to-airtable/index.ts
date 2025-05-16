
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

// Function to sync a guest to Airtable
async function syncGuestToAirtable(guest: GuestRecord): Promise<void> {
  try {
    console.log(`Syncing guest with Supabase ID: ${guest.id}`);
    
    // Build a filter formula to find records with matching Supabase ID in the id field
    const filterFormula = `{id}="${guest.id}"`;
    console.log(`Searching in Airtable with filter formula: ${filterFormula}`);
    
    // First check if the record exists in Airtable by looking for the Supabase ID
    const checkUrl = `https://api.airtable.com/v0/${airtableBaseId}/${airtableGuestsTableId}?filterByFormula=${encodeURIComponent(filterFormula)}`;
    console.log(`Checking Airtable with URL: ${checkUrl}`);
    
    const checkResponse = await fetch(checkUrl, {
      headers: {
        'Authorization': `Bearer ${airtableApiKey}`,
        'Content-Type': 'application/json',
      },
    });
    
    if (!checkResponse.ok) {
      const errorData = await checkResponse.text();
      throw new Error(`Airtable check failed with status ${checkResponse.status}: ${errorData}`);
    }
    
    const checkData = await checkResponse.json();
    console.log(`Airtable check results: ${JSON.stringify(checkData)}`);
    console.log(`Found ${checkData.records ? checkData.records.length : 0} records matching ID ${guest.id}`);
    
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
    
    console.log(`Prepared fields for Airtable: ${JSON.stringify(fields)}`);
    
    // If record exists, update it
    if (checkData.records && checkData.records.length > 0) {
      const airtableId = checkData.records[0].id;
      console.log(`Found existing Airtable record with ID: ${airtableId} for Supabase ID: ${guest.id}`);
      
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
      
      const updateResult = await updateResponse.json();
      console.log(`Updated guest record in Airtable with ID: ${guest.id}, result: ${JSON.stringify(updateResult)}`);
    } 
    // If record doesn't exist, create it
    else {
      console.log(`No existing record found in Airtable for Supabase ID: ${guest.id}, creating new record`);
      
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
      
      const createResult = await createResponse.json();
      console.log(`Created new guest record in Airtable with ID: ${guest.id}, result: ${JSON.stringify(createResult)}`);
    }
  } catch (error) {
    console.error(`Error syncing guest with ID ${guest.id} to Airtable:`, error);
    throw error;
  }
}

// Function to sync an RSVP to Airtable
async function syncRsvpToAirtable(rsvp: RSVPRecord): Promise<void> {
  try {
    console.log(`Syncing RSVP with Supabase ID: ${rsvp.id}`);
    
    // Build a filter formula to find records with matching Supabase ID in the id field
    const filterFormula = `{id}="${rsvp.id}"`;
    console.log(`Searching in Airtable with filter formula: ${filterFormula}`);
    
    // First check if the record exists in Airtable
    const checkUrl = `https://api.airtable.com/v0/${airtableBaseId}/${airtableRsvpsTableId}?filterByFormula=${encodeURIComponent(filterFormula)}`;
    console.log(`Checking Airtable with URL: ${checkUrl}`);
    
    const checkResponse = await fetch(checkUrl, {
      headers: {
        'Authorization': `Bearer ${airtableApiKey}`,
        'Content-Type': 'application/json',
      },
    });
    
    if (!checkResponse.ok) {
      const errorData = await checkResponse.text();
      throw new Error(`Airtable check failed with status ${checkResponse.status}: ${errorData}`);
    }
    
    const checkData = await checkResponse.json();
    console.log(`Airtable check results: ${JSON.stringify(checkData)}`);
    console.log(`Found ${checkData.records ? checkData.records.length : 0} records matching ID ${rsvp.id}`);
    
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
    
    console.log(`Prepared fields for Airtable: ${JSON.stringify(fields)}`);
    
    // If record exists, update it
    if (checkData.records && checkData.records.length > 0) {
      const airtableId = checkData.records[0].id;
      console.log(`Found existing Airtable record with ID: ${airtableId} for Supabase ID: ${rsvp.id}`);
      
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
      
      const updateResult = await updateResponse.json();
      console.log(`Updated RSVP record in Airtable with ID: ${rsvp.id}, result: ${JSON.stringify(updateResult)}`);
    } 
    // If record doesn't exist, create it
    else {
      console.log(`No existing record found in Airtable for Supabase ID: ${rsvp.id}, creating new record`);
      
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
      
      const createResult = await createResponse.json();
      console.log(`Created new RSVP record in Airtable with ID: ${rsvp.id}, result: ${JSON.stringify(createResult)}`);
    }
  } catch (error) {
    console.error(`Error syncing RSVP with ID ${rsvp.id} to Airtable:`, error);
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
    // Process the webhook payload
    const payload = await req.json();
    console.log("Received webhook payload:", JSON.stringify(payload));
    
    // Handle database changes
    const { type, table, record } = payload;
    console.log(`Processing ${type} event for table ${table}`);
    
    if (!record || !record.id) {
      throw new Error(`Invalid payload: missing record or record ID`);
    }
    
    if (table === 'guests') {
      await syncGuestToAirtable(record as GuestRecord);
    } else if (table === 'rsvps') {
      await syncRsvpToAirtable(record as RSVPRecord);
    } else {
      console.log(`Ignoring change to table ${table}`);
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error("Error processing webhook:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
