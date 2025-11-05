import { useState, useEffect } from 'react';
import Lightbox from 'yet-another-react-lightbox';
import Zoom from 'yet-another-react-lightbox/plugins/zoom';
import Download from 'yet-another-react-lightbox/plugins/download';
import 'yet-another-react-lightbox/styles.css';
import { fetchCloudinaryPhotos } from '@/services/cloudinary';
import { Loader2, Download as DownloadIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CloudinaryImage {
  id: string;
  url: string;
  width: number;
  height: number;
  created_at: string;
}

const TAGS = [
  'Highlights',
  'Setup',
  'Arrivals and Cocktail Hour',
  'Chris and Nate Portraits',
  'Family Photos',
  'Doggos',
  'Sean Evans Meet and Greet',
  'Hot Ones',
  'Dinner and Dessert Forest',
  'Japanese Market',
  'Afterparty',
  'Photo Booth',
  'Film',
];

export default function PhotoGalleryTab() {
  const { toast } = useToast();
  const [selectedTag, setSelectedTag] = useState(TAGS[0]);
  const [images, setImages] = useState<CloudinaryImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [isDownloadingAll, setIsDownloadingAll] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);

  useEffect(() => {
    fetchImages(selectedTag);
  }, [selectedTag]);

  const fetchImages = async (tag: string) => {
    try {
      setLoading(true);
      console.log(`Fetching images for tag: ${tag}`);
      
      const cloudinaryImages = await fetchCloudinaryPhotos(tag);
      
      console.log('Received images:', cloudinaryImages);
      
      // Transform Cloudinary data to match our interface
      const transformedImages: CloudinaryImage[] = cloudinaryImages.map((img) => ({
        id: img.public_id,
        url: img.url,
        width: img.width,
        height: img.height,
        created_at: img.created_at,
      }));
      
      setImages(transformedImages);
    } catch (error) {
      console.error('Error fetching images:', error);
      setImages([]);
    } finally {
      setLoading(false);
    }
  };

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const downloadAllPhotos = async () => {
    if (images.length === 0) return;
    
    setIsDownloadingAll(true);
    setDownloadProgress(0);
    
    toast({
      title: "Downloading...",
      description: "Please wait while we prepare your photos",
    });
    
    try {
      // Fetch download-optimized URLs with CORS headers
      const downloadImages = await fetchCloudinaryPhotos(selectedTag, true);
      
      // Import JSZip dynamically
      const JSZip = (await import('jszip')).default;
      const zip = new JSZip();
      
      // Create a folder in the ZIP with the tag name
      const folder = zip.folder(selectedTag.replace(/\s+/g, '_'));
      
      const failedDownloads: string[] = [];
      let successCount = 0;
      
      // Download each image and add to ZIP
      for (let i = 0; i < downloadImages.length; i++) {
        const image = downloadImages[i];
        
        try {
          // Fetch image as blob using CORS-friendly URL
          const response = await fetch(image.url);
          
          if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
          }
          
          const blob = await response.blob();
          
          // Add to ZIP with a clean filename
          const fileName = `${String(i + 1).padStart(3, '0')}_${image.public_id.split('/').pop()}.${image.format}`;
          folder?.file(fileName, blob);
          
          successCount++;
          
          // Update progress
          setDownloadProgress(Math.round(((i + 1) / downloadImages.length) * 100));
        } catch (error) {
          console.error(`Failed to download image ${image.public_id}:`, error);
          failedDownloads.push(image.public_id);
        }
      }
      
      if (successCount === 0) {
        throw new Error('No images could be downloaded');
      }
      
      // Generate ZIP file
      const zipBlob = await zip.generateAsync({ type: 'blob' });
      
      // Create download link
      const zipUrl = window.URL.createObjectURL(zipBlob);
      const link = document.createElement('a');
      link.href = zipUrl;
      link.download = `${selectedTag.replace(/\s+/g, '_')}_Photos.zip`;
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(zipUrl);
      
      // Show success/partial success message
      if (failedDownloads.length === 0) {
        toast({
          title: "Download complete!",
          description: `Successfully downloaded all ${successCount} photos`,
        });
      } else {
        toast({
          title: "Partial download",
          description: `Downloaded ${successCount} of ${downloadImages.length} photos. ${failedDownloads.length} failed.`,
          variant: "destructive",
        });
      }
      
    } catch (error) {
      console.error('Failed to create ZIP file:', error);
      toast({
        title: "Download failed",
        description: "Please check your connection and try again.",
        variant: "destructive",
      });
    } finally {
      setIsDownloadingAll(false);
      setDownloadProgress(0);
    }
  };

  return (
    <div className="space-y-8">
      {/* Tag Tabs */}
      <div className="flex flex-wrap justify-center gap-2 px-4">
        {TAGS.map((tag) => (
          <button
            key={tag}
            onClick={() => setSelectedTag(tag)}
            className={`px-4 py-2 rounded-lg font-bicyclette uppercase text-sm transition-all ${
              selectedTag === tag
                ? 'bg-anniversary-gold text-anniversary-purple'
                : 'bg-anniversary-darkPurple/50 text-anniversary-gold hover:bg-anniversary-darkPurple'
            }`}
          >
            {tag}
          </button>
        ))}
      </div>

      {/* Download All Button */}
      {!loading && images.length > 0 && (
        <div className="flex justify-center px-4 pt-4">
          <button
            onClick={downloadAllPhotos}
            disabled={isDownloadingAll}
            className="px-4 py-2 bg-anniversary-gold text-anniversary-purple rounded-lg font-bicyclette uppercase text-sm hover:brightness-110 transition-all disabled:brightness-75 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isDownloadingAll ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Downloading {downloadProgress}%
              </>
            ) : (
              <>
                <DownloadIcon className="h-4 w-4" />
                Download All {selectedTag} Photos ({images.length})
              </>
            )}
          </button>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-anniversary-gold" />
        </div>
      )}

      {/* Empty State */}
      {!loading && images.length === 0 && (
        <div className="text-center py-20">
          <p className="text-anniversary-gold/70 text-lg">No photos available for this tag.</p>
        </div>
      )}

      {/* Image Grid */}
      {!loading && images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 px-4">
          {images.map((image, index) => (
            <div
              key={image.id}
              className="relative aspect-square group overflow-hidden rounded-lg cursor-pointer"
              onClick={() => openLightbox(index)}
            >
              <img
                src={image.url}
                alt={`Photo ${index + 1}`}
                className="w-full h-full object-cover transition-transform group-hover:scale-110"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors pointer-events-none" />
              
              <button
                onClick={async (e) => {
                  e.stopPropagation();
                  try {
                    const response = await fetch(image.url);
                    const blob = await response.blob();
                    const blobUrl = window.URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.href = blobUrl;
                    link.download = `photo-${image.id.split('/').pop()}.jpg`;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    window.URL.revokeObjectURL(blobUrl);
                  } catch (error) {
                    console.error('Download failed:', error);
                    window.open(image.url, '_blank');
                  }
                }}
                className="absolute top-2 right-2 p-2 bg-anniversary-gold/90 hover:bg-anniversary-gold text-anniversary-purple rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-auto"
                aria-label="Download photo"
              >
                <DownloadIcon className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Lightbox */}
      <Lightbox
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        index={lightboxIndex}
        slides={images.map((img) => ({
          src: img.url,
          width: img.width,
          height: img.height,
          download: img.url,
        }))}
        plugins={[Zoom, Download]}
        zoom={{
          maxZoomPixelRatio: 3,
          scrollToZoom: true,
        }}
      />
    </div>
  );
}
