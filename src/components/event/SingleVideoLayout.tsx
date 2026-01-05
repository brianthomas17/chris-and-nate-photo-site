import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";

// TODO: Replace with actual Google Drive download link
const GOOGLE_DRIVE_DOWNLOAD_URL = "https://drive.google.com/PLACEHOLDER";

export default function SingleVideoLayout() {
  return (
    <div className="min-h-screen bg-anniversary-purple text-white relative">
      {/* Background SVG */}
      <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-0">
        <img src="/masks.svg" alt="" className="max-w-[50vw] w-auto h-auto" aria-hidden="true" />
      </div>

      {/* Header */}
      <div className="relative z-50 bg-anniversary-purple border-b border-anniversary-gold/20 py-4">
        <div className="container mx-auto px-4">
          <h1 className="font-fino text-anniversary-gold uppercase tracking-wide text-2xl md:text-3xl text-center">
            Chris & Nate's 10 Year Wedding Anniversary Party
          </h1>
        </div>
      </div>

      {/* Video Content */}
      <div className="container mx-auto px-4 relative z-10 py-12">
        <div className="max-w-[700px] mx-auto space-y-4">
          {/* YouTube Embed */}
          <div className="relative rounded-xl shadow-lg border-4 border-anniversary-gold/40 bg-anniversary-darkPurple/50 backdrop-blur-sm overflow-hidden">
            <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
              <iframe
                className="absolute top-0 left-0 w-full h-full"
                src="https://www.youtube.com/embed/TOK6baCN2vY"
                title="Chris & Nate's Anniversary Video"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>

          {/* Download Button */}
          <div className="flex justify-center">
            <Button
              asChild
              className="bg-anniversary-gold hover:bg-anniversary-gold/90 text-anniversary-purple font-semibold"
            >
              <a href={GOOGLE_DRIVE_DOWNLOAD_URL} target="_blank" rel="noopener noreferrer">
                <Download className="w-4 h-4 mr-2" />
                Download Video
              </a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
