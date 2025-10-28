
import { useContent } from "@/context/ContentContext";
import { AccessType } from "@/types";
import SectionSeparator from "./SectionSeparator";

interface ContentSectionsProps {
  accessType: AccessType;
}

export default function ContentSections({ 
  accessType
}: ContentSectionsProps) {
  const { contentSections } = useContent();
  
  // Filter sections based on access type
  const visibleSections = contentSections.filter(section => {
    // Determine which visibility flag to check based on access type
    if (accessType === 'main_event') {
      return section.visible_to_main_event === true;
    } else if (accessType === 'afterparty') {
      return section.visible_to_afterparty === true;
    }
    return false;
  }).sort((a, b) => a.order_index - b.order_index);

  if (visibleSections.length === 0) {
    console.log("No visible sections found for this user");
    return (
      <div className="text-center p-8">
        <p className="text-[#C2C2C2] text-xl">No content sections available yet.</p>
      </div>
    );
  }

  // Function to process HTML content to enhance styling with responsive font sizes
  const processContent = (html: string): string => {
    return html
      .replace(/<h1(.*?)>/g, '<h1$1 class="font-din text-anniversary-gold text-2xl md:text-4xl mb-4 uppercase">')
      .replace(/<h2(.*?)>/g, '<h2$1 class="font-din text-anniversary-gold text-xl md:text-3xl mb-3 uppercase">')
      .replace(/<h3(.*?)>/g, '<h3$1 class="font-bicyclette text-anniversary-gold text-lg md:text-2xl mb-2 uppercase">')
      .replace(/<h4(.*?)>/g, '<h4$1 class="font-bicyclette text-anniversary-gold text-base md:text-xl mb-2 uppercase">')
      .replace(/<h5(.*?)>/g, '<h5$1 class="font-din text-anniversary-gold text-sm md:text-lg mb-1 uppercase">')
      .replace(/<h6(.*?)>/g, '<h6$1 class="font-din text-anniversary-gold text-xs md:text-base mb-1 uppercase">');
  };

  return (
    <div className="space-y-16">
      {visibleSections.map((section, index) => (
        <div key={section.id}>
          <div className="text-center">
            <div
              className="prose prose-headings:font-din prose-headings:text-anniversary-gold prose-p:text-[#C2C2C2] prose-li:text-[#C2C2C2] prose-strong:text-[#C2C2C2] prose-p:text-lg prose-li:text-lg max-w-[450px] mx-auto text-[#C2C2C2]"
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
