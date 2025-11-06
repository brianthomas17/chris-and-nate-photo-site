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
        <div className={`sticky top-0 z-50 bg-anniversary-purple border-b border-anniversary-gold/20 transition-all duration-500 ease-in-out ${
          isScrolled ? 'py-3' : 'py-6'
        }`}>
          <div className="container mx-auto px-4">
            {/* Single structure that transitions smoothly */}
            <div className={`transition-all duration-500 ease-in-out ${
              isScrolled 
                ? 'grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] gap-4 items-center max-w-4xl mx-auto' 
                : 'flex flex-col items-center gap-4'
            }`}>
              {/* Tab 1 - Transitions position and opacity */}
              <div className={`transition-all duration-500 ease-in-out ${
                isScrolled 
                  ? 'opacity-100 translate-x-0 justify-self-end' 
                  : 'opacity-0 absolute pointer-events-none -translate-x-full'
              }`}>
                <TabsList className="bg-transparent border-0 p-0">
                  <TabsTrigger value="event" className="font-bicyclette uppercase">
                    {eventTabLabel}
                  </TabsTrigger>
                </TabsList>
              </div>

              {/* Page Title - Transitions size and position */}
              <h1 className={`font-fino text-anniversary-gold uppercase tracking-wide transition-all duration-500 ease-in-out whitespace-nowrap ${
                isScrolled ? 'text-xl md:text-2xl' : 'text-3xl md:text-4xl text-center'
              }`}>
                Chris & Nate
              </h1>

              {/* Tab 2 - Transitions position and opacity */}
              <div className={`transition-all duration-500 ease-in-out ${
                isScrolled 
                  ? 'opacity-100 translate-x-0 justify-self-start' 
                  : 'opacity-0 absolute pointer-events-none translate-x-full'
              }`}>
                <TabsList className="bg-transparent border-0 p-0">
                  <TabsTrigger value="photos" className="font-bicyclette uppercase">
                    Photo Gallery
                  </TabsTrigger>
                </TabsList>
              </div>

              {/* Default Tabs - Transitions opacity and scale */}
              <div className={`transition-all duration-500 ease-in-out w-full max-w-md ${
                isScrolled 
                  ? 'opacity-0 scale-95 absolute pointer-events-none' 
                  : 'opacity-100 scale-100'
              }`}>
                <TabsList className="w-full mb-4">
                  <TabsTrigger value="event" className="flex-1 font-bicyclette uppercase">
                    {eventTabLabel}
                  </TabsTrigger>
                  <TabsTrigger value="photos" className="flex-1 font-bicyclette uppercase">
                    Photo Gallery
                  </TabsTrigger>
                </TabsList>
              </div>
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
