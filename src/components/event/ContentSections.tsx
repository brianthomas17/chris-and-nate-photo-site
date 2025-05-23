
import { useContent } from "@/context/ContentContext";
import { InvitationType } from "@/types";
import { useAuth } from "@/context/AuthContext";

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

  // Simplified approach: Directly determine which content sections to show
  const visibleSections = contentSections.filter(section => {
    // Admin users see all content
    if (invitationType === 'admin') {
      return true;
    }
    
    // For non-admin users, check permissions directly from the current guest object
    let hasAccess = true;
    
    // Only check conditions where the section has a restriction
    if (section.visible_to_main_event === true && currentGuest.main_event !== true) {
      hasAccess = false;
      console.log(`Section "${section.title}" requires main_event access, guest has: ${currentGuest.main_event}`);
    }
    
    if (section.visible_to_afterparty === true && currentGuest.afterparty !== true) {
      hasAccess = false;
      console.log(`Section "${section.title}" requires afterparty access, guest has: ${currentGuest.afterparty}`);
    }
    
    if (section.visible_to_friday_dinner === true && currentGuest.friday_dinner !== true) {
      hasAccess = false;
      console.log(`Section "${section.title}" requires friday_dinner access, guest has: ${currentGuest.friday_dinner}`);
    }
    
    if (section.visible_to_sunday_brunch === true && currentGuest.sunday_brunch !== true) {
      hasAccess = false;
      console.log(`Section "${section.title}" requires sunday_brunch access, guest has: ${currentGuest.sunday_brunch}`);
    }
    
    console.log(`Section "${section.title}" ${hasAccess ? 'is' : 'is not'} visible to ${currentGuest.first_name}`);
    return hasAccess;
  }).sort((a, b) => a.order_index - b.order_index);

  console.log("Content sections visibility:", {
    guestName: currentGuest.first_name,
    invitationType: currentGuest.invitation_type,
    main_event: currentGuest.main_event,
    afterparty: currentGuest.afterparty,
    friday_dinner: currentGuest.friday_dinner,
    sunday_brunch: currentGuest.sunday_brunch,
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
    <div className="space-y-12">
      {visibleSections.map((section) => (
        <div key={section.id} className="text-center">
          <div
            className="prose prose-headings:font-din prose-headings:text-anniversary-gold prose-p:text-white prose-li:text-white prose-strong:text-white prose-p:text-lg prose-li:text-lg max-w-[450px] mx-auto text-white"
            dangerouslySetInnerHTML={{ __html: processContent(section.content) }}
          />
        </div>
      ))}
    </div>
  );
}
