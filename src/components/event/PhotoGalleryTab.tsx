import { useState, useEffect } from 'react';
import Lightbox from 'yet-another-react-lightbox';
import Zoom from 'yet-another-react-lightbox/plugins/zoom';
import 'yet-another-react-lightbox/styles.css';
import { fetchCloudinaryPhotos } from '@/services/cloudinary';
import { Loader2 } from 'lucide-react';

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
    try {
      setLoading(true);
      console.log(`Fetching images for folder: ${folder}`);
      
      const cloudinaryImages = await fetchCloudinaryPhotos(folder);
      
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

  const visibleFolders = showMoreFolders ? FOLDERS : FOLDERS.slice(0, visibleTabCount);
  const hasMoreFolders = FOLDERS.length > visibleTabCount;

  return (
    <div className="space-y-8">
      {/* Folder Tabs */}
      <div className="flex flex-wrap justify-center gap-2 px-4">
        {visibleFolders.map((folder) => (
          <button
            key={folder}
            onClick={() => setSelectedFolder(folder)}
            className={`px-4 py-2 rounded-lg font-bicyclette uppercase text-sm transition-all ${
              selectedFolder === folder
                ? 'bg-anniversary-gold text-anniversary-purple'
                : 'bg-anniversary-darkPurple/50 text-anniversary-gold hover:bg-anniversary-darkPurple'
            }`}
          >
            {getFolderDisplayName(folder)}
          </button>
        ))}
        {hasMoreFolders && !showMoreFolders && (
          <button
            onClick={() => setShowMoreFolders(true)}
            className="px-4 py-2 rounded-lg font-bicyclette uppercase text-sm bg-anniversary-darkPurple/50 text-anniversary-gold hover:bg-anniversary-darkPurple transition-all"
          >
            More...
          </button>
        )}
        {showMoreFolders && (
          <button
            onClick={() => setShowMoreFolders(false)}
            className="px-4 py-2 rounded-lg font-bicyclette uppercase text-sm bg-anniversary-darkPurple/50 text-anniversary-gold hover:bg-anniversary-darkPurple transition-all"
          >
            Less
          </button>
        )}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-anniversary-gold" />
        </div>
      )}

      {/* Empty State */}
      {!loading && images.length === 0 && (
        <div className="text-center py-20">
          <p className="text-anniversary-gold/70 text-lg">No photos available in this folder.</p>
        </div>
      )}

      {/* Image Grid */}
      {!loading && images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 px-4">
          {images.map((image, index) => (
            <div
              key={image.id}
              className="relative aspect-square cursor-pointer group overflow-hidden rounded-lg"
              onClick={() => openLightbox(index)}
            >
              <img
                src={image.url}
                alt={`Photo ${index + 1}`}
                className="w-full h-full object-cover transition-transform group-hover:scale-110"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
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
        zoom={{
          maxZoomPixelRatio: 3,
          scrollToZoom: true,
        }}
      />
    </div>
  );
}
