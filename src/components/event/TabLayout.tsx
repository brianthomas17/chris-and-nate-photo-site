import { usePasswordAuth } from "@/context/PasswordAuthContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EventDetailsTab from "./EventDetailsTab";
import PhotoGalleryTab from "./PhotoGalleryTab";
import { useState, useEffect } from "react";

export default function TabLayout() {
  const { accessType } = usePasswordAuth();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!accessType) {
    return null;
  }

  const isMainEvent = accessType === 'main_event';
  const eventTabLabel = isMainEvent ? 'Main Event' : 'Afterparty';

  return (
    <div className="min-h-screen bg-anniversary-purple text-white relative">
      {/* Background SVG - positioned in the center with max-width 50% */}
      <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-0">
        <img src="/masks.svg" alt="" className="max-w-[50vw] w-auto h-auto" aria-hidden="true" />
      </div>

      <Tabs defaultValue="event" className="w-full">
        {/* Sticky Header + Tabs Container */}
        <div className={`sticky top-0 z-50 bg-anniversary-purple border-b border-anniversary-gold/20 transition-all duration-300 ease-in-out ${
          isScrolled ? 'py-3' : 'py-6'
        }`}>
          {!isScrolled ? (
            /* Vertical Layout - Default */
            <div className="flex flex-col items-center">
              <h1 className="text-3xl md:text-4xl font-fino text-anniversary-gold text-center uppercase tracking-wide transition-all duration-300 ease-in-out">
                Chris & Nate
              </h1>
              <div className="container mx-auto px-4 mt-4">
                <TabsList className="w-full max-w-md mx-auto mb-4">
                  <TabsTrigger value="event" className="flex-1 font-bicyclette uppercase">
                    {eventTabLabel}
                  </TabsTrigger>
                  <TabsTrigger value="photos" className="flex-1 font-bicyclette uppercase">
                    Photo Gallery
                  </TabsTrigger>
                </TabsList>
              </div>
            </div>
          ) : (
            /* Horizontal Layout - Scrolled */
            <div className="container mx-auto px-4 flex items-center justify-center gap-8 relative">
              <TabsList className="flex items-center justify-between w-full max-w-4xl gap-4 bg-transparent border-0 p-0">
                <TabsTrigger 
                  value="event" 
                  className="font-bicyclette uppercase flex-shrink-0 transition-all duration-300 ease-in-out"
                >
                  {eventTabLabel}
                </TabsTrigger>
                
                <h1 className="text-xl md:text-2xl font-fino text-anniversary-gold uppercase tracking-wide transition-all duration-300 ease-in-out flex-shrink-0">
                  Chris & Nate
                </h1>
                
                <TabsTrigger 
                  value="photos" 
                  className="font-bicyclette uppercase flex-shrink-0 transition-all duration-300 ease-in-out"
                >
                  Photo Gallery
                </TabsTrigger>
              </TabsList>
            </div>
          )}
        </div>

        {/* Scrollable content area - OUTSIDE sticky container */}
        <div className="container mx-auto px-4 relative z-10 pb-8">
          <TabsContent value="event" className="pt-4">
            <EventDetailsTab accessType={accessType} />
          </TabsContent>

          <TabsContent value="photos" className="pt-4">
            <PhotoGalleryTab />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
