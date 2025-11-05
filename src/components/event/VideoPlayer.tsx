import { getCloudinaryVideoUrl, getCloudinaryVideoPoster } from "@/services/cloudinary";

interface VideoPlayerProps {
  publicId: string;
  title?: string;
  className?: string;
  lazy?: boolean;
}

export default function VideoPlayer({ publicId, title, className = '', lazy = false }: VideoPlayerProps) {
  const videoUrl = getCloudinaryVideoUrl(publicId, 'q_auto');
  const posterUrl = getCloudinaryVideoPoster(publicId);
  
  return (
    <div className={`w-full ${className}`}>
      <div className="relative rounded-xl shadow-lg border border-anniversary-gold/20 bg-anniversary-darkPurple/50 backdrop-blur-sm overflow-hidden">
        <video
          controls
          className="w-full"
          poster={posterUrl}
          preload={lazy ? "none" : "metadata"}
          playsInline
          controlsList="nodownload"
        >
          <source src={videoUrl} type="video/mp4" />
          Your browser doesn't support video playback.
        </video>
      </div>
      {title && (
        <p className="text-anniversary-gold text-sm mt-3 text-center font-light">
          {title}
        </p>
      )}
    </div>
  );
}
