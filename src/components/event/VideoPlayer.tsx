import { useEffect, useRef } from 'react';
import { getCloudinaryVideoUrl, getCloudinaryVideoPoster } from "@/services/cloudinary";

interface VideoPlayerProps {
  publicId: string;
  title?: string;
  className?: string;
  deferredLoad?: boolean;
  forceStreamingOptimization?: boolean;
}

export default function VideoPlayer({ 
  publicId, 
  title, 
  className = '', 
  deferredLoad = false,
  forceStreamingOptimization = false 
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!deferredLoad || !containerRef.current) return;
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && videoRef.current) {
            videoRef.current.preload = 'auto';
            observer.disconnect();
          }
        });
      },
      {
        rootMargin: '200px',
        threshold: 0
      }
    );
    
    observer.observe(containerRef.current);
    
    return () => observer.disconnect();
  }, [deferredLoad]);

  const videoUrl = getCloudinaryVideoUrl(publicId, 'q_auto:best', 'mp4', forceStreamingOptimization);
  const posterUrl = getCloudinaryVideoPoster(publicId);
  
  return (
    <div ref={containerRef} className={`w-full ${className}`}>
      {title && (
        <p className="text-anniversary-gold text-lg mb-3 text-center font-light">
          {title}
        </p>
      )}
      <div className="relative rounded-xl shadow-lg border-4 border-anniversary-gold/40 bg-anniversary-darkPurple/50 backdrop-blur-sm overflow-hidden">
        <video
          ref={videoRef}
          controls
          className="w-full"
          poster={posterUrl}
          preload={deferredLoad ? "none" : "metadata"}
          playsInline
          controlsList="nodownload"
        >
          <source src={videoUrl} type="video/mp4" />
          Your browser doesn't support video playback.
        </video>
      </div>
    </div>
  );
}
