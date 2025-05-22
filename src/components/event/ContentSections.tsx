
import { useContent } from "@/context/ContentContext";
import { InvitationType } from "@/types";

interface ContentSectionsProps {
  invitationType: InvitationType;
  fridayDinner?: boolean;
  sundayBrunch?: boolean;
}

export default function ContentSections({ 
  invitationType,
  fridayDinner = false,
  sundayBrunch = false
}: ContentSectionsProps) {
  const { getVisibleSections } = useContent();
  const visibleSections = getVisibleSections(invitationType, fridayDinner, sundayBrunch);

  console.log("Content sections rendering with:", {
    invitationType,
    fridayDinner,
    sundayBrunch,
    visibleSectionsCount: visibleSections.length
  });

  if (visibleSections.length === 0) {
    return (
      <div className="text-center p-8">
        <p className="text-white text-xl">No content sections available yet.</p>
      </div>
    );
  }

  // Function to process HTML content to modify heading tags
  const processContent = (html: string): string => {
    // Add font-bicyclette and uppercase classes to all h1, h2, h3, h4, h5, h6 tags
    return html
      .replace(/<h([1-6])(.*?)>/g, '<h$1$2 class="font-bicyclette uppercase">');
  };

  return (
    <div className="space-y-12">
      {visibleSections.map((section) => (
        <div key={section.id} className="text-center">
          <div
            className="prose prose-headings:text-anniversary-gold prose-headings:text-xl prose-p:text-white prose-li:text-white prose-strong:text-white prose-p:text-lg prose-li:text-lg max-w-[450px] mx-auto text-white"
            dangerouslySetInnerHTML={{ __html: processContent(section.content) }}
          />
        </div>
      ))}
    </div>
  );
}
