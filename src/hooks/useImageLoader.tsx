
import { useState, useEffect } from 'react';

interface UseImageLoaderProps {
  imageUrls: string[];
  onAllLoaded?: () => void;
}

export const useImageLoader = ({ imageUrls, onAllLoaded }: UseImageLoaderProps) => {
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());
  const [allImagesLoaded, setAllImagesLoaded] = useState(false);

  useEffect(() => {
    if (imageUrls.length === 0) {
      setAllImagesLoaded(true);
      onAllLoaded?.();
      return;
    }

    const imagePromises = imageUrls.map((url) => {
      return new Promise<void>((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
          setLoadedImages(prev => new Set([...prev, url]));
          resolve();
        };
        img.onerror = () => {
          // Still resolve to prevent blocking other images
          console.warn(`Failed to load image: ${url}`);
          setLoadedImages(prev => new Set([...prev, url]));
          resolve();
        };
        img.src = url;
      });
    });

    Promise.all(imagePromises).then(() => {
      setAllImagesLoaded(true);
      onAllLoaded?.();
    });
  }, [imageUrls, onAllLoaded]);

  return {
    loadedImages,
    allImagesLoaded,
    loadProgress: imageUrls.length > 0 ? loadedImages.size / imageUrls.length : 1
  };
};
