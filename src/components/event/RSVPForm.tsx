
import { useState } from "react";
import { useGuests } from "@/context/GuestContext";
import { Guest } from "@/types";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

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

  // Validate if the guest ID is a valid UUID format
  const isValidUUID = (id: string): boolean => {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return uuidRegex.test(id);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      // Check if the guest ID is a valid UUID before submitting
      if (!isValidUUID(guest.id)) {
        throw new Error("Invalid guest ID format. Please contact support.");
      }
      
      // Call updateRSVP function with the suppressToast flag set to true
      await updateRSVP(guest.id, attending, plusOne, dietaryRestrictions);
      setHasResponded(true);
      
      // Show the toast only here, not in the context
      toast({
        title: "RSVP Updated",
        description: `Thank you, ${guest.first_name}! Your RSVP has been recorded.`
      });
    } catch (error) {
      console.error("Error submitting RSVP:", error);
      toast({
        title: "RSVP Error",
        description: error instanceof Error ? error.message : "There was a problem submitting your RSVP. Please try again.",
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  return <div className="max-w-2xl mx-auto">
      <Card className="backdrop-blur-sm bg-white/10 border border-anniversary-gold/30 shadow-[0_8px_30px_rgb(0,0,0,0.12)] overflow-hidden">
        <CardHeader className="pb-2">
          <CardTitle className="text-3xl text-center text-anniversary-gold font-din">WILL YOU JOIN US?</CardTitle>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-6 pt-4">
              <div className="space-y-4">
                
                <RadioGroup value={attending ? "yes" : "no"} onValueChange={v => setAttending(v === "yes")} className="flex flex-col items-center space-y-4">
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem value="yes" id="attending-yes" className="border-anniversary-gold" />
                    <Label htmlFor="attending-yes" className="text-white text-lg">Yes, I'll be there!</Label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem value="no" id="attending-no" className="border-anniversary-gold" />
                    <Label htmlFor="attending-no" className="text-white text-lg">No, I can't make it</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
            
            <CardFooter className="flex justify-center px-0">
              <div className="flex flex-col items-center space-y-4">
                <div className="text-sm text-white/70">
                  {hasResponded ? "You can update your response until the deadline." : ""}
                </div>
                <Button type="submit" className="bg-anniversary-gold hover:bg-anniversary-gold/90 text-black text-lg px-8 py-2 font-medium" disabled={submitting}>
                  {submitting ? "Submitting..." : hasResponded ? "Update Response" : "Submit RSVP"}
                </Button>
              </div>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </div>;
}
