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
  'Film',
];

export default function PhotoGalleryTab() {
  const [selectedTag, setSelectedTag] = useState(TAGS[0]);
  const [images, setImages] = useState<CloudinaryImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [showMoreTags, setShowMoreTags] = useState(false);

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

  const visibleTags = showMoreTags ? TAGS : TAGS.slice(0, visibleTabCount);
  const hasMoreTags = TAGS.length > visibleTabCount;

  return (
    <div className="space-y-8">
      {/* Tag Tabs */}
      <div className="flex flex-wrap justify-center gap-2 px-4">
        {visibleTags.map((tag) => (
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
        {hasMoreTags && !showMoreTags && (
          <button
            onClick={() => setShowMoreTags(true)}
            className="px-4 py-2 rounded-lg font-bicyclette uppercase text-sm bg-anniversary-darkPurple/50 text-anniversary-gold hover:bg-anniversary-darkPurple transition-all"
          >
            More...
          </button>
        )}
        {showMoreTags && (
          <button
            onClick={() => setShowMoreTags(false)}
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
          <p className="text-anniversary-gold/70 text-lg">No photos available for this tag.</p>
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
