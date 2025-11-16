import { useEffect, useRef, useState } from 'react';
import { getCloudinaryVideoUrl, getCloudinaryVideoPoster, getCloudinaryVideoDownloadUrl } from "@/services/cloudinary";
import { Download } from 'lucide-react';
import { Button } from "@/components/ui/button";

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
  const hideControlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const [showControls, setShowControls] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
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

  useEffect(() => {
    return () => {
      if (hideControlsTimeoutRef.current) {
        clearTimeout(hideControlsTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);
    
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
    };
  }, []);

  const handleDownload = () => {
    const downloadUrl = getCloudinaryVideoDownloadUrl(publicId, 'mp4');
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = `${title || publicId}.mp4`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleMouseMove = () => {
    setShowControls(true);
    
    // Clear existing timeout
    if (hideControlsTimeoutRef.current) {
      clearTimeout(hideControlsTimeoutRef.current);
    }
    
    // Hide controls after 3 seconds of inactivity (only when playing)
    if (isPlaying) {
      hideControlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, 3000);
    }
  };

  const handleMouseLeave = () => {
    if (isPlaying) {
      setShowControls(false);
    }
  };

  const handlePlay = () => {
    setIsPlaying(true);
  };

  const handlePause = () => {
    setIsPlaying(false);
    setShowControls(true); // Always show controls when paused
  };

  const videoUrl = getCloudinaryVideoUrl(publicId, 'q_auto:best', 'mp4', forceStreamingOptimization);
  const posterUrl = getCloudinaryVideoPoster(publicId);
  
  return (
    <div ref={containerRef} className={`w-full ${className}`}>
      {title && (
        <p className="text-anniversary-gold text-lg mb-3 text-center font-light">
          {title}
        </p>
      )}
      <div 
        className="relative rounded-xl shadow-lg border-4 border-anniversary-gold/40 bg-anniversary-darkPurple/50 backdrop-blur-sm overflow-hidden"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <video
          ref={videoRef}
          controls
          className="w-full"
          poster={posterUrl}
          preload={deferredLoad ? "none" : "metadata"}
          playsInline
          onPlay={handlePlay}
          onPause={handlePause}
        >
          <source src={videoUrl} type="video/mp4" />
          Your browser doesn't support video playback.
        </video>
        
        {/* Overlay Download Button */}
        <div 
          className={`absolute top-4 right-4 transition-opacity duration-300 ${
            showControls || !isPlaying ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        >
          <Button
            onClick={handleDownload}
            size="sm"
            className="bg-anniversary-darkPurple/90 hover:bg-anniversary-darkPurple border-2 border-anniversary-gold/60 text-anniversary-gold hover:text-anniversary-gold shadow-lg backdrop-blur-sm"
          >
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
        </div>
        
        {/* Fullscreen Tooltip */}
        {isFullscreen && (
          <div className="absolute top-4 left-4 bg-anniversary-darkPurple/90 text-anniversary-gold text-sm px-4 py-2 rounded-md border border-anniversary-gold/40 shadow-lg backdrop-blur-sm">
            Exit fullscreen to download
          </div>
        )}
      </div>
    </div>
  );
}
