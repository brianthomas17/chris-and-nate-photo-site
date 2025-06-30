
import { useState } from "react";
import { useContent } from "@/context/ContentContext";
import { Guest, InvitationType } from "@/types";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

interface EventDetailsTabsProps {
  guest: Guest;
}

export default function EventDetailsTabs({ guest }: EventDetailsTabsProps) {
  const { contentSections } = useContent();
  
  // Determine which events the user has access to
  const hasMainEvent = guest.main_event === true || guest.invitation_type === 'admin';
  const hasFridayDinner = guest.friday_dinner === true;
  const hasSundayBrunch = guest.sunday_brunch === true;
  const hasAfterparty = guest.afterparty === true;
  
  console.log("EventDetailsTabs - Guest permissions:", {
    hasMainEvent,
    hasFridayDinner,
    hasSundayBrunch,
    hasAfterparty
  });

  // Create tabs array with main event first, then other events
  const availableTabs = [];
  
  if (hasMainEvent) {
    availableTabs.push({
      id: 'main-event',
      label: 'Main Event',
      eventType: 'main_event'
    });
  }
  
  if (hasFridayDinner) {
    availableTabs.push({
      id: 'friday-dinner',
      label: 'Friday Dinner',
      eventType: 'friday_dinner'
    });
  }
  
  if (hasSundayBrunch) {
    availableTabs.push({
      id: 'sunday-brunch',
      label: 'Sunday Brunch', 
      eventType: 'sunday_brunch'
    });
  }
  
  if (hasAfterparty) {
    availableTabs.push({
      id: 'afterparty',
      label: 'Afterparty',
      eventType: 'afterparty'
    });
  }

  // If no tabs are available, don't render anything
  if (availableTabs.length === 0) {
    return null;
  }

  // Set default tab to the first available tab (main event when possible)
  const [activeTab, setActiveTab] = useState(availableTabs[0].id);

  // Filter content sections based on the current tab
  const getContentForTab = (eventType: string) => {
    return contentSections.filter(section => {
      // Admin users see all content
      if (guest.invitation_type === 'admin') {
        return true;
      }
      
      // Filter based on event type
      switch (eventType) {
        case 'main_event':
          return section.visible_to_main_event === true;
        case 'friday_dinner':
          return section.visible_to_friday_dinner === true;
        case 'sunday_brunch':
          return section.visible_to_sunday_brunch === true;
        case 'afterparty':
          return section.visible_to_afterparty === true;
        default:
          return false;
      }
    }).sort((a, b) => a.order_index - b.order_index);
  };

  return (
    <div className="max-w-[450px] mx-auto">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 h-auto p-1 bg-transparent">
          {availableTabs.map((tab) => (
            <TabsTrigger
              key={tab.id}
              value={tab.id}
              className="text-sm font-medium text-anniversary-gold/70 data-[state=active]:text-anniversary-gold data-[state=active]:bg-anniversary-gold/10 border border-anniversary-gold/20 data-[state=active]:border-anniversary-gold/50 rounded-md px-4 py-2"
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {availableTabs.map((tab) => {
          const tabContent = getContentForTab(tab.eventType);
          
          return (
            <TabsContent key={tab.id} value={tab.id} className="mt-6">
              {tabContent.length > 0 ? (
                <div className="space-y-8">
                  {tabContent.map((section) => (
                    <div key={section.id} className="space-y-4">
                      <h3 className="text-xl md:text-2xl font-din text-anniversary-gold text-center">
                        {section.title}
                      </h3>
                      <div 
                        className="text-anniversary-gold text-base md:text-lg font-bicyclette leading-relaxed text-center whitespace-pre-wrap"
                        dangerouslySetInnerHTML={{ __html: section.content }}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-anniversary-gold/70 text-base italic">
                  No details available for this event yet.
                </div>
              )}
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
}
