
import { useContent } from "@/context/ContentContext";
import { InvitationType } from "@/types";

interface ContentSectionsProps {
  invitationType: InvitationType;
  fridayDinner?: boolean;
  sundayBrunch?: boolean;
  mainEvent?: boolean;
  afterparty?: boolean;
}

export default function ContentSections({ 
  invitationType,
  fridayDinner = false,
  sundayBrunch = false,
  mainEvent = false,
  afterparty = false
}: ContentSectionsProps) {
  const { getVisibleSections, contentSections } = useContent();
  
  // Convert all values to proper booleans using strict equality
  // For database values, only true is true, everything else is false
  const hasFridayDinner = fridayDinner === true;
  const hasSundayBrunch = sundayBrunch === true;
  const hasMainEvent = mainEvent === true;
  const hasAfterparty = afterparty === true;
  
  // Pass all the event access parameters as proper booleans
  const visibleSections = getVisibleSections(
    invitationType, 
    hasFridayDinner, 
    hasSundayBrunch, 
    hasMainEvent, 
    hasAfterparty
  );

  console.log("Content sections rendering with:", {
    invitationType,
    fridayDinner,
    sundayBrunch,
    mainEvent,
    afterparty,
    hasFridayDinner,
    hasSundayBrunch,
    hasMainEvent,
    hasAfterparty,
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
