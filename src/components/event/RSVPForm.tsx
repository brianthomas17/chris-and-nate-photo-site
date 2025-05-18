
import { useState, useEffect } from "react";
import { useGuests } from "@/context/GuestContext";
import { Guest } from "@/types";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

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
  
  // Ensure we correctly initialize the state from the guest prop
  const [attending, setAttending] = useState<string | null>(guest?.attending || null);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [hasResponded, setHasResponded] = useState<boolean>(guest?.attending !== null);
  const [formError, setFormError] = useState<string | null>(null);

  // Update local state whenever the guest prop changes
  useEffect(() => {
    if (guest) {
      console.log("Guest data updated:", guest);
      console.log("Guest attending status:", guest.attending);
      setAttending(guest.attending || null);
      setHasResponded(guest.attending !== null);
    }
  }, [guest]);

  // Log guest info for debugging
  useEffect(() => {
    console.log("RSVPForm mounted with guest:", guest);
    console.log("Guest ID:", guest.id);
    console.log("Guest has RSVP:", guest.attending !== null);
    console.log("Current attending state:", attending);
    console.log("Current hasResponded state:", hasResponded);
    
    if (guest.attending !== null) {
      console.log("RSVP details:", { 
        attending: guest.attending
      });
    }
  }, [guest, attending, hasResponded]);

  // Validate if the guest ID is a valid UUID format
  const isValidUUID = (id: string): boolean => {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return uuidRegex.test(id);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    
    console.log("RSVP form submitted with values:", { attending });
    
    // Ensure a selection has been made before submitting
    if (attending === null) {
      const errorMessage = "Please select whether you will attend or not.";
      console.error(errorMessage);
      setFormError(errorMessage);
      toast({
        title: "Selection Required",
        description: errorMessage,
        variant: "destructive"
      });
      return;
    }
    
    setSubmitting(true);
    
    try {
      // Check if the guest ID is a valid UUID before submitting
      if (!isValidUUID(guest.id)) {
        const errorMessage = "Invalid guest ID format. Please contact support.";
        console.error(errorMessage, guest.id);
        setFormError(errorMessage);
        throw new Error(errorMessage);
      }
      
      console.log("Calling updateRSVP with:", {
        guestId: guest.id,
        attending
      });
      
      // Call updateRSVP function with direct connection to Supabase
      const result = await updateRSVP(guest.id, attending);
      console.log("RSVP update result:", result);
      
      setHasResponded(true);
      
      toast({
        title: "RSVP Updated",
        description: `Thank you, ${guest.first_name}! Your RSVP has been recorded.`
      });
    } catch (error) {
      console.error("Error submitting RSVP:", error);
      setFormError(error instanceof Error ? error.message : "Unknown error occurred");
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
          <CardTitle className="text-3xl text-center text-anniversary-gold font-din">
            WILL YOU JOIN US, {guest.first_name}?
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-6 pt-4">
              <div className="space-y-4">
                
                <RadioGroup 
                  value={attending === null ? undefined : attending} 
                  onValueChange={v => setAttending(v)} 
                  className="flex flex-col items-center space-y-4"
                >
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem value="Yes" id="attending-yes" className="border-anniversary-gold" />
                    <Label htmlFor="attending-yes" className="text-white text-lg">Yes, I'll be there!</Label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem value="No" id="attending-no" className="border-anniversary-gold" />
                    <Label htmlFor="attending-no" className="text-white text-lg">No, I can't make it</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
            
            {formError && (
              <div className="text-red-500 text-sm text-center bg-red-100/20 p-2 rounded-md flex items-center gap-2 justify-center">
                <AlertCircle className="w-4 h-4" />
                <span>Error: {formError}</span>
              </div>
            )}
            
            <CardFooter className="flex justify-center px-0">
              <div className="flex flex-col items-center space-y-4">
                <div className="text-sm text-white/70">
                  {hasResponded ? "You can update your response until the deadline." : ""}
                </div>
                <Button 
                  type="submit" 
                  className="bg-anniversary-gold hover:bg-anniversary-gold/90 text-black text-lg px-8 py-2 font-medium" 
                  disabled={submitting}
                >
                  {submitting ? "Submitting..." : hasResponded ? "Update Response" : "Submit RSVP"}
                </Button>
              </div>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </div>;
}
