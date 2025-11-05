// Cloudinary client-side service for fetching photos
// Uses public Cloudinary API - no authentication required

export interface CloudinaryImage {
  public_id: string;
  version: number;
  format: string;
  width: number;
  height: number;
  created_at: string;
  url: string;
}

// Replace with your actual Cloudinary cloud name
const CLOUDINARY_CLOUD_NAME = 'dvrmpfclj';

/**
 * Fetch images from a Cloudinary tag using the public list API
 * @param tag - The tag name in Cloudinary (e.g., "Highlights")
 * @returns Array of image objects with URLs
 */
export const fetchCloudinaryPhotos = async (tag: string): Promise<CloudinaryImage[]> => {
  try {
    // Cloudinary's image list endpoint (tag-based)
    // This endpoint is public and doesn't require authentication
    const encodedTag = encodeURIComponent(tag);
    const url = `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/list/${encodedTag}.json`;
    
    console.log('Fetching photos from:', url);
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch images: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // Transform the response to include full URLs
    const images: CloudinaryImage[] = data.resources.map((resource: any) => ({
      public_id: resource.public_id,
      version: resource.version,
      format: resource.format,
      width: resource.width,
      height: resource.height,
      created_at: resource.created_at,
      // Construct the full image URL
      url: `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload/v${resource.version}/${resource.public_id}.${resource.format}`
    }));
    
    return images;
  } catch (error) {
    console.error('Error fetching Cloudinary photos:', error);
    throw error;
  }
};

/**
 * Generate a Cloudinary URL with transformations
 * @param publicId - The public ID of the image
 * @param transformations - Optional transformations (e.g., "w_500,h_500,c_fill")
 * @returns Full Cloudinary URL
 */
export const getCloudinaryUrl = (
  publicId: string,
  transformations?: string
): string => {
  const baseUrl = `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload`;
  
  if (transformations) {
    return `${baseUrl}/${transformations}/${publicId}`;
  }
  
  return `${baseUrl}/${publicId}`;
};

/**
 * Generate a Cloudinary video URL
 * @param publicId - The public ID of the video (from Cloudinary's "Display Name")
 * @param transformations - Optional transformations (e.g., "q_auto,w_1280")
 * @param format - Video format (default: mp4)
 * @returns Full Cloudinary video URL
 */
export const getCloudinaryVideoUrl = (
  publicId: string,
  transformations?: string,
  format: string = 'mp4'
): string => {
  const baseUrl = `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/video/upload`;
  
  if (transformations) {
    return `${baseUrl}/${transformations}/${publicId}.${format}`;
  }
  
  return `${baseUrl}/${publicId}.${format}`;
};

/**
 * Generate a video poster/thumbnail URL from Cloudinary
 * @param publicId - The public ID of the video
 * @returns Cloudinary URL for video thumbnail (first frame)
 */
export const getCloudinaryVideoPoster = (
  publicId: string
): string => {
  return `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/video/upload/so_0/${publicId}.jpg`;
};
