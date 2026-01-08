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
  thumbnailUrl?: string;
  placeholderUrl?: string;
}

// Replace with your actual Cloudinary cloud name
const CLOUDINARY_CLOUD_NAME = 'dvrmpfclj';

/**
 * Generate an optimized thumbnail URL for grid display
 * Uses Cloudinary's automatic format and quality optimization
 */
export const getCloudinaryThumbnailUrl = (
  publicId: string,
  version: number,
  format: string,
  width: number = 500
): string => {
  // Transformations:
  // - w_500: resize to 500px width (suitable for grid)
  // - q_auto:good: automatic quality optimization (70-80% quality)
  // - f_auto: automatic format (WebP for supported browsers, fallback to original)
  // - c_fill: fill the space with smart cropping
  // - ar_1:1: square aspect ratio for grid
  const transformations = `w_${width},h_${width},c_fill,ar_1:1,q_auto:good,f_auto`;
  
  return `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload/${transformations}/v${version}/${publicId}.${format}`;
};

/**
 * Generate a low-quality placeholder URL (blur-up technique)
 */
export const getCloudinaryPlaceholderUrl = (
  publicId: string,
  version: number,
  format: string
): string => {
  // Very small, highly compressed, blurred version for instant loading
  const transformations = 'w_50,q_auto:low,e_blur:1000,f_auto';
  
  return `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload/${transformations}/v${version}/${publicId}.${format}`;
};

/**
 * Fetch images from a Cloudinary tag using the public list API
 * @param tag - The tag name in Cloudinary (e.g., "Highlights")
 * @param forDownload - If true, adds CORS-friendly transformations for downloading
 * @returns Array of image objects with URLs
 */
export const fetchCloudinaryPhotos = async (tag: string, forDownload: boolean = false): Promise<CloudinaryImage[]> => {
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
    const images: CloudinaryImage[] = data.resources.map((resource: any) => {
      // Add CORS-friendly transformations for downloads
      const transformations = forDownload ? 'fl_attachment,fl_force_strip/' : '';
      
      return {
        public_id: resource.public_id,
        version: resource.version,
        format: resource.format,
        width: resource.width,
        height: resource.height,
        created_at: resource.created_at,
        // Optimized URL for lightbox viewing (maintains excellent quality but loads 3-5x faster)
        url: `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload/${transformations}w_2000,q_auto:best,f_auto,fl_progressive/v${resource.version}/${resource.public_id}.${resource.format}`,
        // Add optimized thumbnail URL for grid display
        thumbnailUrl: getCloudinaryThumbnailUrl(resource.public_id, resource.version, resource.format),
        // Add tiny placeholder for blur-up effect
        placeholderUrl: getCloudinaryPlaceholderUrl(resource.public_id, resource.version, resource.format),
      };
    });
    
    // Sort Photo Booth images by filename numbers
    if (tag === 'Photo Booth') {
      images.sort((a, b) => {
        // Extract filename from public_id (e.g., "folder/123_image.jpg" -> "123_image.jpg")
        const filenameA = a.public_id.split('/').pop() || '';
        const filenameB = b.public_id.split('/').pop() || '';
        
        // Extract numbers from RG_XX_... format (e.g., "RG_01_abc" -> 1, "RG_100_xyz" -> 100)
        const numA = parseInt(filenameA.match(/RG_(\d+)/)?.[1] || '0');
        const numB = parseInt(filenameB.match(/RG_(\d+)/)?.[1] || '0');
        
        return numA - numB;
      });
    }
    
    // Sort Robyn's Dog Cafe images by the timestamp number in filename
    // Format: Chris_Nate_10Y_Anniversary2025_0816_145821-0069_CBP.jpg
    if (tag === "Robyn's Dog Cafe") {
      images.sort((a, b) => {
        const filenameA = a.public_id.split('/').pop() || '';
        const filenameB = b.public_id.split('/').pop() || '';
        
        // Extract the 6-digit number after "0816_" (e.g., "145821")
        const numA = parseInt(filenameA.match(/0816_(\d+)/)?.[1] || '0');
        const numB = parseInt(filenameB.match(/0816_(\d+)/)?.[1] || '0');
        
        return numA - numB;
      });
    }
    
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
 * @param forceStreamingOptimization - Force H.264 baseline codec for proper streaming
 * @returns Full Cloudinary video URL
 */
export const getCloudinaryVideoUrl = (
  publicId: string,
  transformations?: string,
  format: string = 'mp4',
  forceStreamingOptimization: boolean = false
): string => {
  const baseUrl = `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/video/upload`;
  
  let finalTransformations = transformations || '';
  
  // Add streaming optimization if requested (fixes duration metadata issues)
  if (forceStreamingOptimization) {
    const streamingCodec = 'vc_h264:baseline:3.1';
    finalTransformations = finalTransformations 
      ? `${finalTransformations},${streamingCodec}`
      : streamingCodec;
  }
  
  if (finalTransformations) {
    return `${baseUrl}/${finalTransformations}/${publicId}.${format}`;
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
  // Use so_2 to grab a frame at 2 seconds instead of 0
  // This avoids black/loading frames at the very start
  // Add q_auto:good for optimized quality/size balance
  return `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/video/upload/so_2,q_auto:good/${publicId}.jpg`;
};

/**
 * Generate a Cloudinary video download URL for the original, uncompressed file
 * @param publicId - The public ID of the video
 * @param format - Video format (default: mp4)
 * @returns Cloudinary URL with download attachment flag
 */
export const getCloudinaryVideoDownloadUrl = (
  publicId: string,
  format: string = 'mp4',
  customFilename?: string
): string => {
  // If custom filename provided, use Cloudinary's fl_attachment with filename
  // This sets the Content-Disposition header server-side, which browsers always respect
  if (customFilename) {
    // Sanitize filename for Cloudinary fl_attachment parameter
    // Replace spaces with underscores and remove/replace special characters
    const sanitizedFilename = customFilename
      .replace(/\s+/g, '_')           // spaces → underscores
      .replace(/&/g, 'and')            // & → "and"
      .replace(/[<>:"/\\|?*]/g, '')    // Remove invalid filename chars
      .replace(/[^\w\s.-]/g, '');      // Remove any remaining special chars except word chars, dots, hyphens
    
    return `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/video/upload/fl_attachment:${sanitizedFilename}/${publicId}.${format}`;
  }
  
  // Default: just use fl_attachment flag (downloads with publicId as filename)
  // No quality transformations = original file
  return `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/video/upload/fl_attachment/${publicId}.${format}`;
};
