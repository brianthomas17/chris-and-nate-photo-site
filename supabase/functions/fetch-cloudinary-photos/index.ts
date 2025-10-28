import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface CloudinaryResource {
  public_id: string;
  secure_url: string;
  width: number;
  height: number;
  created_at: string;
}

interface CloudinaryResponse {
  resources: CloudinaryResource[];
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { folder } = await req.json();
    
    if (!folder) {
      return new Response(
        JSON.stringify({ error: 'Folder parameter is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const cloudName = Deno.env.get('CLOUDINARY_CLOUD_NAME');
    const apiKey = Deno.env.get('CLOUDINARY_API_KEY');
    const apiSecret = Deno.env.get('CLOUDINARY_API_SECRET');

    if (!cloudName || !apiKey || !apiSecret) {
      console.error('Missing Cloudinary credentials');
      return new Response(
        JSON.stringify({ error: 'Cloudinary credentials not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create basic auth header
    const auth = btoa(`${apiKey}:${apiSecret}`);
    
    // Fetch images from Cloudinary Admin API
    const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${cloudName}/resources/image?type=upload&prefix=${folder}&max_results=500`;
    
    console.log(`Fetching images from folder: ${folder}`);
    
    const response = await fetch(cloudinaryUrl, {
      headers: {
        'Authorization': `Basic ${auth}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Cloudinary API error:', response.status, errorText);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch images from Cloudinary', details: errorText }),
        { status: response.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data: CloudinaryResponse = await response.json();
    
    console.log(`Found ${data.resources.length} images in folder: ${folder}`);

    // Transform the response to include public URLs
    const images = data.resources.map((resource) => ({
      id: resource.public_id,
      url: resource.secure_url,
      width: resource.width,
      height: resource.height,
      created_at: resource.created_at,
    }));

    return new Response(
      JSON.stringify({ images }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in fetch-cloudinary-photos function:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
