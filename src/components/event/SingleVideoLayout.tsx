import VideoPlayer from "./VideoPlayer";

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
        <div className="max-w-[700px] mx-auto">
          <VideoPlayer 
            publicId="Nate_Chris_Anniversary_Sizzle_V6_1_qkmhrb"
            title="Special Video"
            forceStreamingOptimization
          />
        </div>
      </div>
    </div>
  );
}
