
import { useContent } from "@/context/ContentContext";
import { InvitationType } from "@/types";

interface ContentSectionsProps {
  invitationType: InvitationType;
}

export default function ContentSections({ invitationType }: ContentSectionsProps) {
  const { getVisibleSections } = useContent();
  const visibleSections = getVisibleSections(invitationType);

  if (visibleSections.length === 0) {
    return (
      <div className="text-center p-8">
        <p className="text-white">No content sections available yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {visibleSections.map((section) => (
        <div key={section.id} className="text-center">
          <div
            className="prose prose-headings:text-anniversary-gold prose-p:text-white prose-li:text-white prose-strong:text-white prose-p:text-lg prose-li:text-lg max-w-none text-white"
            dangerouslySetInnerHTML={{ __html: section.content }}
          />
        </div>
      ))}
    </div>
  );
}
