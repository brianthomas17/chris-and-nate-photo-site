import { useContent } from "@/context/ContentContext";
import ContentSections from "./ContentSections";
import ConfirmedAttendees from "./ConfirmedAttendees";
import SectionSeparator from "./SectionSeparator";

type AccessType = 'main_event' | 'afterparty';

interface EventDetailsTabProps {
  accessType: AccessType;
}

export default function EventDetailsTab({ accessType }: EventDetailsTabProps) {
  const isMainEvent = accessType === 'main_event';

  return (
    <div className="space-y-12">
      {/* Content Sections - filtered by access type */}
      <ContentSections accessType={accessType} />

      {/* Confirmed Attendees - only for main event */}
      {isMainEvent && (
        <>
          <SectionSeparator />
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-haboro text-center text-anniversary-gold mb-8 uppercase">
              Confirmed Attendees
            </h2>
            <ConfirmedAttendees />
          </div>
        </>
      )}
    </div>
  );
}
