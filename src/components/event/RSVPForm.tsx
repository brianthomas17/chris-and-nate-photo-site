import { useState } from "react";
import { useGuests } from "@/context/GuestContext";
import { Guest } from "@/types";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
interface RSVPFormProps {
  guest: Guest;
}
export default function RSVPForm({
  guest
}: RSVPFormProps) {
  const {
    updateRSVP
  } = useGuests();
  const {
    toast
  } = useToast();
  const [attending, setAttending] = useState<boolean>(guest.rsvp?.attending || false);
  const [plusOne, setPlusOne] = useState<boolean>(guest.rsvp?.plus_one || false);
  const [dietaryRestrictions, setDietaryRestrictions] = useState<string>(guest.rsvp?.dietary_restrictions || "");
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [hasResponded, setHasResponded] = useState<boolean>(!!guest.rsvp);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await updateRSVP(guest.id, attending, plusOne, dietaryRestrictions);
      setHasResponded(true);
    } catch (error) {
      console.error("Error submitting RSVP:", error);
      toast({
        title: "RSVP Error",
        description: "There was a problem submitting your RSVP. Please try again.",
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };
  return <div className="max-w-xl mx-auto text-center">
      <div className="bg-transparent text-white">
        <div className="text-center mb-6">
          
          
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-6 pt-4">
            <div className="space-y-2">
              <Label className="text-white">Will Your Join Us?</Label>
              <RadioGroup value={attending ? "yes" : "no"} onValueChange={v => setAttending(v === "yes")} className="flex flex-col items-center space-y-2">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="attending-yes" />
                  <Label htmlFor="attending-yes" className="text-white">Yes, I'll be there!</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="attending-no" />
                  <Label htmlFor="attending-no" className="text-white">No, I can't make it</Label>
                </div>
              </RadioGroup>
            </div>

            {attending && <>
                <div className="space-y-2">
                  <div className="flex items-center justify-center space-x-4">
                    <Label htmlFor="plus-one" className="text-white">Will you bring a plus one?</Label>
                    <Switch id="plus-one" checked={plusOne} onCheckedChange={setPlusOne} />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dietary" className="text-white">Dietary Restrictions or Special Requirements</Label>
                  <Textarea id="dietary" placeholder="Please let us know if you have any dietary restrictions or special requirements" value={dietaryRestrictions} onChange={e => setDietaryRestrictions(e.target.value)} className="min-h-[100px] bg-white/10 text-white placeholder:text-white/50" />
                </div>
              </>}
          </div>
          
          <div className="flex justify-center pt-4">
            <div className="flex flex-col items-center space-y-4">
              <div className="text-sm text-white/70">
                {hasResponded ? "You can update your response until the deadline." : ""}
              </div>
              <Button type="submit" className="bg-anniversary-gold hover:bg-anniversary-gold/90 text-black" disabled={submitting}>
                {submitting ? "Submitting..." : hasResponded ? "Update Response" : "Submit RSVP"}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>;
}