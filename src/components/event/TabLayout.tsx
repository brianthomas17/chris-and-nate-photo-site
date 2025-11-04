import { usePasswordAuth } from "@/context/PasswordAuthContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EventDetailsTab from "./EventDetailsTab";
import PhotoGalleryTab from "./PhotoGalleryTab";

export default function TabLayout() {
  const { accessType } = usePasswordAuth();

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

      {/* Main content */}
      <div className="container mx-auto px-4 pt-16 pb-8">
        <Tabs defaultValue="event" className="w-full">
          <TabsList className="w-full max-w-md mx-auto mb-8">
            <TabsTrigger value="event" className="flex-1 font-bicyclette uppercase">
              {eventTabLabel}
            </TabsTrigger>
            <TabsTrigger value="photos" className="flex-1 font-bicyclette uppercase">
              Photo Gallery
            </TabsTrigger>
          </TabsList>

          <TabsContent value="event">
            <EventDetailsTab accessType={accessType} />
          </TabsContent>

          <TabsContent value="photos">
            <PhotoGalleryTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
