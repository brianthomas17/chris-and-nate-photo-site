
import { useContent } from "@/context/ContentContext";
import { InvitationType } from "@/types";
import { Card, CardContent } from "@/components/ui/card";

interface ContentSectionsProps {
  invitationType: InvitationType;
}

export default function ContentSections({ invitationType }: ContentSectionsProps) {
  const { getVisibleSections } = useContent();
  const visibleSections = getVisibleSections(invitationType);

  if (visibleSections.length === 0) {
    return (
      <div className="text-center p-8">
        <p className="text-muted-foreground">No content sections available yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {visibleSections.map((section) => (
        <Card key={section.id} className="overflow-hidden border-anniversary-gold/30">
          <CardContent className="p-6">
            <div
              className="prose max-w-none"
              dangerouslySetInnerHTML={{ __html: section.content }}
            />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
