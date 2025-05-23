
import { useContent } from "@/context/ContentContext";
import { InvitationType } from "@/types";
import { useAuth } from "@/context/AuthContext";
import SectionSeparator from "./SectionSeparator";

interface ContentSectionsProps {
  invitationType: InvitationType;
  fridayDinner?: boolean;
  sundayBrunch?: boolean;
  mainEvent?: boolean;
  afterparty?: boolean;
}

export default function ContentSections({ 
  invitationType
}: ContentSectionsProps) {
  const { contentSections } = useContent();
  const { currentGuest } = useAuth();
  
  console.log("Current guest in ContentSections:", currentGuest);
  
  if (!currentGuest) {
    console.log("No current guest found");
    return (
      <div className="text-center p-8">
        <p className="text-white text-xl">Please log in to view content.</p>
      </div>
    );
  }

  // Ensure boolean values are properly handled
  const mainEvent = currentGuest.main_event === true;
  const afterparty = currentGuest.afterparty === true;
  const fridayDinner = currentGuest.friday_dinner === true;
  const sundayBrunch = currentGuest.sunday_brunch === true;
  
  console.log("Explicitly converted boolean values:", {
    main_event: mainEvent,
    afterparty: afterparty,
    friday_dinner: fridayDinner,
    sunday_brunch: sundayBrunch,
    raw_main_event: currentGuest.main_event,
    raw_afterparty: currentGuest.afterparty,
    raw_friday_dinner: currentGuest.friday_dinner,
    raw_sunday_brunch: currentGuest.sunday_brunch
  });

  // Improved visibility logic: A section is visible if the user has access to ANY of the required events
  // OR if the section has no specific event restrictions (all visibility flags are false)
  const visibleSections = contentSections.filter(section => {
    // Admin users see all content
    if (invitationType === 'admin') {
      return true;
    }
    
    // Check if this section has any specific event restrictions
    const hasMainEventRestriction = section.visible_to_main_event === true;
    const hasAfterpartyRestriction = section.visible_to_afterparty === true;
    const hasFridayDinnerRestriction = section.visible_to_friday_dinner === true;
    const hasSundayBrunchRestriction = section.visible_to_sunday_brunch === true;
    
    // If the section has no specific restrictions, it's visible to everyone
    if (!hasMainEventRestriction && !hasAfterpartyRestriction && !hasFridayDinnerRestriction && !hasSundayBrunchRestriction) {
      console.log(`Section "${section.title}" has no restrictions, visible to all`);
      return true;
    }
    
    // If the section has restrictions, check if the user meets ANY of them
    let hasAccess = false;
    
    if (hasMainEventRestriction && mainEvent) {
      hasAccess = true;
      console.log(`Section "${section.title}" accessible via main_event`);
    }
    
    if (hasAfterpartyRestriction && afterparty) {
      hasAccess = true;
      console.log(`Section "${section.title}" accessible via afterparty`);
    }
    
    if (hasFridayDinnerRestriction && fridayDinner) {
      hasAccess = true;
      console.log(`Section "${section.title}" accessible via friday_dinner`);
    }
    
    if (hasSundayBrunchRestriction && sundayBrunch) {
      hasAccess = true;
      console.log(`Section "${section.title}" accessible via sunday_brunch`);
    }
    
    console.log(`Section "${section.title}" ${hasAccess ? 'is' : 'is not'} visible to ${currentGuest.first_name}`);
    return hasAccess;
  }).sort((a, b) => a.order_index - b.order_index);

  console.log("Content sections visibility:", {
    guestName: currentGuest.first_name,
    invitationType: currentGuest.invitation_type,
    mainEvent,
    afterparty,
    fridayDinner,
    sundayBrunch,
    visibleSectionsCount: visibleSections.length,
    allSectionsCount: contentSections.length,
    visibleSections: visibleSections.map(s => s.title)
  });

  if (visibleSections.length === 0) {
    console.log("No visible sections found for this user");
    return (
      <div className="text-center p-8">
        <p className="text-white text-xl">No content sections available yet.</p>
      </div>
    );
  }

  // Function to process HTML content to enhance styling
  const processContent = (html: string): string => {
    return html
      .replace(/<h1(.*?)>/g, '<h1$1 class="font-din text-anniversary-gold text-4xl mb-4 uppercase">')
      .replace(/<h2(.*?)>/g, '<h2$1 class="font-din text-anniversary-gold text-3xl mb-3 uppercase">')
      .replace(/<h3(.*?)>/g, '<h3$1 class="font-bicyclette text-anniversary-gold text-2xl mb-2 uppercase">')
      .replace(/<h4(.*?)>/g, '<h4$1 class="font-bicyclette text-anniversary-gold text-xl mb-2 uppercase">')
      .replace(/<h5(.*?)>/g, '<h5$1 class="font-din text-anniversary-gold text-lg mb-1 uppercase">')
      .replace(/<h6(.*?)>/g, '<h6$1 class="font-din text-anniversary-gold text-base mb-1 uppercase">');
  };

  return (
    <div className="space-y-16">
      {visibleSections.map((section, index) => (
        <div key={section.id}>
          <div className="text-center">
            <div
              className="prose prose-headings:font-din prose-headings:text-anniversary-gold prose-p:text-white prose-li:text-white prose-strong:text-white prose-p:text-lg prose-li:text-lg max-w-[450px] mx-auto text-white"
              dangerouslySetInnerHTML={{ __html: processContent(section.content) }}
            />
          </div>
          
          {/* Add SectionSeparator between sections, but not after the last one */}
          {index < visibleSections.length - 1 && (
            <div className="mt-16 mb-16">
              <SectionSeparator />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
