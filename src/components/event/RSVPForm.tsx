
import { useState, useEffect } from "react";
import { useGuests } from "@/context/GuestContext";
import { Guest } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

interface RSVPFormProps {
  guest: Guest;
}

export default function RSVPForm({ guest }: RSVPFormProps) {
  const { updateRSVP } = useGuests();
  const { toast } = useToast();
  
  const [attending, setAttending] = useState<boolean>(guest.rsvp?.attending || false);
  const [plusOne, setPlusOne] = useState<boolean>(guest.rsvp?.plusOne || false);
  const [dietaryRestrictions, setDietaryRestrictions] = useState<string>(
    guest.rsvp?.dietaryRestrictions || ""
  );
  const [hasResponded, setHasResponded] = useState<boolean>(!!guest.rsvp);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateRSVP(guest.id, attending, plusOne, dietaryRestrictions);
    setHasResponded(true);
    toast({
      title: "RSVP Submitted",
      description: "Thank you for your response!",
    });
  };

  return (
    <div className="max-w-xl mx-auto">
      <Card className="shadow-lg border-anniversary-gold/30">
        <CardHeader className="bg-anniversary-navy text-white">
          <CardTitle className="text-2xl">RSVP</CardTitle>
          <CardDescription className="text-white/80">
            {hasResponded ? "Update your response" : "Let us know if you can make it"}
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6 pt-6">
            <div className="space-y-2">
              <Label>Will you be attending?</Label>
              <RadioGroup value={attending ? "yes" : "no"} onValueChange={(v) => setAttending(v === "yes")}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="attending-yes" />
                  <Label htmlFor="attending-yes">Yes, I'll be there!</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="attending-no" />
                  <Label htmlFor="attending-no">No, I can't make it</Label>
                </div>
              </RadioGroup>
            </div>

            {attending && (
              <>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="plus-one">Will you bring a plus one?</Label>
                    <Switch
                      id="plus-one"
                      checked={plusOne}
                      onCheckedChange={setPlusOne}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dietary">Dietary Restrictions or Special Requirements</Label>
                  <Textarea
                    id="dietary"
                    placeholder="Please let us know if you have any dietary restrictions or special requirements"
                    value={dietaryRestrictions}
                    onChange={(e) => setDietaryRestrictions(e.target.value)}
                    className="min-h-[100px]"
                  />
                </div>
              </>
            )}
          </CardContent>
          <CardFooter className="bg-gray-50 flex justify-between">
            <div className="text-sm text-muted-foreground">
              {hasResponded ? "You can update your response until the deadline." : ""}
            </div>
            <Button type="submit" className="bg-anniversary-gold hover:bg-anniversary-gold/90 text-black">
              {hasResponded ? "Update Response" : "Submit RSVP"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
