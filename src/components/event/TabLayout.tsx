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
        <div className={`relative md:sticky top-0 z-50 bg-anniversary-purple border-b border-anniversary-gold/20 transition-all duration-500 ease-in-out ${
          isScrolled ? 'py-3' : 'py-6'
        }`}>
          <div className="container mx-auto px-4">
            <div className="flex flex-col items-center justify-center gap-4">
              
              <h1 className={`font-fino text-anniversary-gold uppercase tracking-wide text-3xl md:text-4xl text-center transition-opacity duration-300 ${
                isScrolled ? 'opacity-0 h-0 overflow-hidden' : 'opacity-100'
              }`}>
                Chris & Nate
              </h1>

              <TabsList className={`${
                isScrolled 
                  ? 'w-auto gap-12 bg-transparent border-0 p-0' 
                  : 'w-full max-w-md'
              }`}>
                <TabsTrigger 
                  value="event" 
                  className={`font-bicyclette uppercase ${
                    isScrolled ? '' : 'flex-1'
                  }`}
                >
                  {eventTabLabel}
                </TabsTrigger>
                <TabsTrigger 
                  value="photos" 
                  className={`font-bicyclette uppercase ${
                    isScrolled ? '' : 'flex-1'
                  }`}
                >
                  Photo Gallery
                </TabsTrigger>
              </TabsList>

            </div>
          </div>
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
