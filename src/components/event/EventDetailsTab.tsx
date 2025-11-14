import ContentSections from "./ContentSections";
import ConfirmedAttendees from "./ConfirmedAttendees";
import SectionSeparator from "./SectionSeparator";
import VideoPlayer from "./VideoPlayer";

type AccessType = 'main_event' | 'afterparty';

interface EventDetailsTabProps {
  accessType: AccessType;
}

export default function EventDetailsTab({ accessType }: EventDetailsTabProps) {
  const isMainEvent = accessType === 'main_event';

  return (
    <div className="space-y-12">
      {/* Video Section - First thing you see */}
      <div className="px-4 space-y-6">
        {isMainEvent ? (
          // Main Event: 2 videos stacked
          <div className="max-w-[700px] mx-auto space-y-6">
            <VideoPlayer 
              publicId="Nate_Chris_Anniversary_Sizzle_V6_1_qkmhrb"
              title="Thank you video from Chris & Nate"
              forceStreamingOptimization
            />
            <VideoPlayer 
              publicId="Market_Dessert_Garden_Sizzle_qm6lyu"
              title="Japanese Market & Dessert Garden Sizzle Reel"
              deferredLoad
              forceStreamingOptimization
            />
          </div>
        ) : (
          // Afterparty: 1 video
          <div className="max-w-[700px] mx-auto">
            <VideoPlayer 
              publicId="After_Party_Sizzle_V3_1_op8iip"
              title="Thank you video from Chris & Nate"
              forceStreamingOptimization
            />
          </div>
        )}
      </div>

      {/* Hero Image Section */}
      <div className="px-4 flex justify-center">
        <header className="relative rounded-xl shadow-lg border border-anniversary-gold/20 bg-anniversary-darkPurple/50 backdrop-blur-sm overflow-hidden w-fit">
          <div className="w-full max-w-[700px] aspect-square">
            <img 
              src="/lovable-uploads/55aeeccb-f695-402f-bdbd-a0dc52edc692.png" 
              alt="Chris & Nate Anniversary Celebration"
              className="w-full h-full object-cover"
              loading="eager"
              sizes="(max-width: 768px) 100vw, 700px"
            />
          </div>
        </header>
      </div>

      {/* Main Intro Content */}
      <div className="max-w-[500px] mx-auto text-left px-4">
        <h2 className="text-anniversary-gold text-2xl md:text-3xl font-light leading-relaxed">
          There are parties, and then there are nights that define a decade…
        </h2>
    
        <p className="text-[#C2C2C2] text-base md:text-lg font-light leading-relaxed mt-6">
          Join us for an evening you'll never forget as we celebrate ten years of Chris and Nate.
        </p>
    
        <p className="text-[#C2C2C2] text-base md:text-lg font-light leading-relaxed mt-6">
          Ten years ago Chris and Nate married at San Francisco City Hall with only family in attendance. At the time, Nate was busy building Lever and Chris was re-entering the tech world. They didn't have the time or money to throw the wedding they wanted, so they decided if they made it to ten years of marriage, they would throw the most epic party.
        </p>
    
        <p className="text-[#C2C2C2] text-base md:text-lg font-light leading-relaxed mt-6">
          This is that party. You are invited. It will be like nothing anyone has ever seen.
        </p>

        <p className="text-anniversary-gold text-2xl md:text-3xl font-fino font-light leading-relaxed mt-6">
          More than an event... It's a moment.
        </p>
      </div>


      {/* Event Details Header */}
      <div className="text-center px-4">
        <div className="flex justify-center mb-8">
          <img 
            src="/separator_top.svg" 
            alt="" 
            className="w-full max-w-[600px]"
            aria-hidden="true"
          />
        </div>
        
        <h2 className="text-2xl md:text-3xl font-din text-anniversary-gold mb-8">
          EVENT DETAILS
        </h2>
        
        <div className="flex justify-center">
          <img 
            src="/separator_bottom.svg" 
            alt="" 
            className="w-full max-w-[600px]"
            aria-hidden="true"
          />
        </div>
      </div>

      {/* Content Sections - conditional based on access type */}
      {isMainEvent ? (
        <div className="max-w-[450px] mx-auto">
          <ContentSections accessType={accessType} />
        </div>
      ) : (
        /* Hardcoded Afterparty Content */
        <div className="max-w-[500px] mx-auto text-center px-4 space-y-6">
          <h2 className="text-anniversary-gold text-2xl md:text-3xl font-din mb-4">
            AFTERPARTY
          </h2>
          
          <p className="text-anniversary-gold text-xl md:text-2xl font-haboro leading-relaxed">
            DRESS TO IMPRESS. ARRIVE CURIOUS. STAY LATE.
          </p>
          
          <div className="text-[#C2C2C2] text-base md:text-lg font-light leading-relaxed space-y-2">
            <p className="font-semibold">Saturday, August 16, 2025</p>
            <p>St Joseph's Arts Society</p>
            <p>1401 Howard Street, San Francisco CA</p>
            <p className="font-semibold">9:00PM UNTIL 1:00AM</p>
          </div>
          
          <p className="text-[#C2C2C2] text-base md:text-lg font-light leading-relaxed">
            Lose yourself on the dance floor as Bootie SF brings the mashup madness into the morning hours.
          </p>
          
          <p className="text-[#C2C2C2] text-base md:text-lg font-light leading-relaxed">
            <span className="font-semibold">Dress code:</span> Elevated Club Vibes
          </p>
        </div>
      )}

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
      
      {/* Bottom separator graphic */}
      <SectionSeparator />
    </div>
  );
}
