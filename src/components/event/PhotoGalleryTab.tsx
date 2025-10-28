import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, X, ZoomIn, ZoomOut } from 'lucide-react';
import Lightbox from 'yet-another-react-lightbox';
import Zoom from 'yet-another-react-lightbox/plugins/zoom';
import 'yet-another-react-lightbox/styles.css';
import { toast } from 'sonner';

interface CloudinaryImage {
  id: string;
  url: string;
  width: number;
  height: number;
  created_at: string;
}

const FOLDERS = [
  'Home/Chris and Nate/Highlights',
  'Home/Chris and Nate/Setup',
  'Home/Chris and Nate/Arrivals and Cocktail Hour',
  'Home/Chris and Nate/Chris and Nate Portraits',
  'Home/Chris and Nate/Family Photos',
  'Home/Chris and Nate/Doggos',
  'Home/Chris and Nate/Sean Evans Meet and Greet',
  'Home/Chris and Nate/Hot Ones',
  'Home/Chris and Nate/Dinner and Dessert Forest',
  'Home/Chris and Nate/Japanese Market',
  'Home/Chris and Nate/Afterparty',
  'Home/Chris and Nate/Film',
];

// Helper to display folder name without parent path
const getFolderDisplayName = (folder: string) => {
  return folder.replace('Home/Chris and Nate/', '');
};

export default function PhotoGalleryTab() {
  const [selectedFolder, setSelectedFolder] = useState(FOLDERS[0]);
  const [images, setImages] = useState<CloudinaryImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [showMoreFolders, setShowMoreFolders] = useState(false);

  // Determine how many tabs to show based on screen size
  const [visibleTabCount, setVisibleTabCount] = useState(6);

  useEffect(() => {
    const updateVisibleTabs = () => {
      if (window.innerWidth < 640) {
        setVisibleTabCount(2);
      } else if (window.innerWidth < 768) {
        setVisibleTabCount(3);
      } else if (window.innerWidth < 1024) {
        setVisibleTabCount(4);
      } else if (window.innerWidth < 1280) {
        setVisibleTabCount(6);
      } else {
        setVisibleTabCount(8);
      }
    };

    updateVisibleTabs();
    window.addEventListener('resize', updateVisibleTabs);
    return () => window.removeEventListener('resize', updateVisibleTabs);
  }, []);

  useEffect(() => {
    fetchImages(selectedFolder);
  }, [selectedFolder]);

  const fetchImages = async (folder: string) => {
    setLoading(true);
    console.log('Fetching images for folder:', folder);
    try {
      const { data, error } = await supabase.functions.invoke('fetch-cloudinary-photos', {
        body: { folder },
      });

      console.log('Response from edge function:', { data, error });

      if (error) {
        console.error('Edge function error:', error);
        throw error;
      }

      if (!data) {
        console.error('No data received from edge function');
        throw new Error('No data received');
      }

      console.log('Images received:', data.images?.length || 0);
      setImages(data.images || []);
    } catch (error) {
      console.error('Error fetching images:', error);
      toast.error('Failed to load photos. Please try again.');
      setImages([]);
    } finally {
      setLoading(false);
    }
  };

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const visibleFolders = FOLDERS.slice(0, visibleTabCount);
  const hiddenFolders = FOLDERS.slice(visibleTabCount);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Folder Tabs */}
      <div className="mb-8">
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {visibleFolders.map((folder) => (
            <Button
              key={folder}
              onClick={() => setSelectedFolder(folder)}
              variant="ghost"
              className={`whitespace-nowrap font-bicyclette transition-all ${
                selectedFolder === folder
                  ? 'text-anniversary-gold border-b-2 border-anniversary-gold rounded-none'
                  : 'text-white/70 hover:text-white border-b-2 border-transparent rounded-none'
              }`}
            >
              {getFolderDisplayName(folder)}
            </Button>
          ))}
          
          {hiddenFolders.length > 0 && (
            <div className="relative">
              <Button
                onClick={() => setShowMoreFolders(!showMoreFolders)}
                variant="ghost"
                className="whitespace-nowrap font-bicyclette text-white/70 hover:text-white"
              >
                More...
              </Button>
              
              {showMoreFolders && (
                <div className="absolute top-full left-0 mt-2 bg-black/90 border border-white/20 rounded-md shadow-lg z-10 min-w-[200px]">
                  {hiddenFolders.map((folder) => (
                    <Button
                      key={folder}
                      onClick={() => {
                        setSelectedFolder(folder);
                        setShowMoreFolders(false);
                      }}
                      variant="ghost"
                      className={`w-full justify-start font-bicyclette ${
                        selectedFolder === folder
                          ? 'text-anniversary-gold'
                          : 'text-white/70 hover:text-white'
                      }`}
                    >
                      {getFolderDisplayName(folder)}
                    </Button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-anniversary-gold"></div>
        </div>
      )}

      {/* Empty State */}
      {!loading && images.length === 0 && (
        <div className="text-center py-20">
          <p className="text-lg text-[#C2C2C2] font-bicyclette">
            No photos in this folder yet
          </p>
        </div>
      )}

      {/* Image Grid */}
      {!loading && images.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {images.map((image, index) => (
            <div
              key={image.id}
              className="relative aspect-square overflow-hidden rounded-lg bg-black/50 cursor-pointer group"
              onClick={() => openLightbox(index)}
            >
              <img
                src={image.url}
                alt={`${selectedFolder} photo ${index + 1}`}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                <ZoomIn className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" size={32} />
              </div>
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
        }))}
        plugins={[Zoom]}
        carousel={{ finite: false }}
        render={{
          buttonPrev: images.length > 1 ? () => (
            <button
              type="button"
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-colors z-10"
              onClick={() => setLightboxIndex((lightboxIndex - 1 + images.length) % images.length)}
            >
              <ChevronLeft size={24} />
            </button>
          ) : undefined,
          buttonNext: images.length > 1 ? () => (
            <button
              type="button"
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-colors z-10"
              onClick={() => setLightboxIndex((lightboxIndex + 1) % images.length)}
            >
              <ChevronRight size={24} />
            </button>
          ) : undefined,
          buttonClose: () => (
            <button
              type="button"
              className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-colors z-10"
              onClick={() => setLightboxOpen(false)}
            >
              <X size={24} />
            </button>
          ),
        }}
        styles={{
          container: { backgroundColor: 'rgba(0, 0, 0, 0.95)' },
        }}
        zoom={{
          maxZoomPixelRatio: 3,
          scrollToZoom: true,
        }}
      />
    </div>
  );
}
