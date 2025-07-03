import { useState, useEffect } from "react";
import { useGuests } from "@/context/GuestContext";
import { Guest } from "@/types";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { AlertCircle } from "lucide-react";
interface RSVPFormProps {
  guest: Guest;
  onComplete?: () => void;
}
export default function RSVPForm({
  guest,
  onComplete
}: RSVPFormProps) {
  const {
    updateRSVP
  } = useGuests();
  const {
    toast
  } = useToast();

  // Initialize state from guest data
  const [attending, setAttending] = useState<string | null>(guest?.attending || null);
  const [fridayDinner, setFridayDinner] = useState<boolean>(guest?.friday_dinner || false);
  const [sundayBrunch, setSundayBrunch] = useState<boolean>(guest?.sunday_brunch || false);

  // New state for event confirmations
  const [fridayDinnerRsvp, setFridayDinnerRsvp] = useState<boolean>(guest?.friday_dinner_rsvp || false);
  const [sundayBrunchRsvp, setSundayBrunchRsvp] = useState<boolean>(guest?.sunday_brunch_rsvp || false);
  const [mainEventRsvp, setMainEventRsvp] = useState<boolean>(guest?.main_event_rsvp || false);
  const [afterpartyRsvp, setAfterpartyRsvp] = useState<boolean>(guest?.afterparty_rsvp || false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [hasResponded, setHasResponded] = useState<boolean>(guest?.attending !== null);
  const [formError, setFormError] = useState<string | null>(null);

  // Update local state whenever the guest prop changes
  useEffect(() => {
    if (guest) {
      console.log("Guest data updated:", guest);
      setAttending(guest.attending || null);
      setFridayDinner(guest.friday_dinner || false);
      setSundayBrunch(guest.sunday_brunch || false);
      setFridayDinnerRsvp(guest.friday_dinner_rsvp || false);
      setSundayBrunchRsvp(guest.sunday_brunch_rsvp || false);
      setMainEventRsvp(guest.main_event_rsvp || false);
      setAfterpartyRsvp(guest.afterparty_rsvp || false);
      setHasResponded(guest.attending !== null);
    }
  }, [guest]);

  // Log guest info for debugging
  useEffect(() => {
    console.log("RSVPForm mounted with guest:", guest);
    console.log("Current state:", {
      attending,
      fridayDinner,
      sundayBrunch,
      fridayDinnerRsvp,
      sundayBrunchRsvp,
      mainEventRsvp,
      afterpartyRsvp
    });
  }, [guest, attending, fridayDinner, sundayBrunch, fridayDinnerRsvp, sundayBrunchRsvp, mainEventRsvp, afterpartyRsvp]);

  // Validate if the guest ID is a valid UUID format
  const isValidUUID = (id: string): boolean => {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return uuidRegex.test(id);
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    console.log("RSVP form submitted with values:", {
      attending,
      fridayDinner,
      sundayBrunch,
      fridayDinnerRsvp,
      sundayBrunchRsvp,
      mainEventRsvp,
      afterpartyRsvp
    });

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
        attending,
        fridayDinner,
        sundayBrunch,
        fridayDinnerRsvp,
        sundayBrunchRsvp,
        mainEventRsvp,
        afterpartyRsvp
      });

      // Call updateRSVP function with event confirmations
      const result = await updateRSVP(guest.id, attending, fridayDinner, sundayBrunch, fridayDinnerRsvp, sundayBrunchRsvp, mainEventRsvp, afterpartyRsvp);
      console.log("RSVP update result:", result);
      setHasResponded(true);
      toast({
        title: "RSVP Updated",
        description: `Thank you, ${guest.first_name}! Your RSVP has been recorded.`
      });

      // Call the onComplete callback if provided
      if (onComplete) {
        onComplete();
      }
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
      <div className="px-4 py-6">
        <h2 className="text-2xl md:text-3xl font-din text-anniversary-gold text-center mb-6 md:mb-8">
          WILL YOU JOIN US, {guest.first_name}?
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-6 pt-4">
            <div className="space-y-4">
              <RadioGroup value={attending === null ? undefined : attending} onValueChange={v => setAttending(v)} className="flex flex-col items-center space-y-4">
                <div className="flex items-center space-x-3">
                  <RadioGroupItem value="Yes" id="attending-yes" className="border-anniversary-gold" />
                  <Label htmlFor="attending-yes" className="text-white text-lg">Yes, I'll be there!</Label>
                </div>
                <div className="flex items-center space-x-3">
                  <RadioGroupItem value="No" id="attending-no" className="border-anniversary-gold" />
                  <Label htmlFor="attending-no" className="text-white text-lg">No, I can't make it</Label>
                </div>
              </RadioGroup>

              {/* Event Confirmation Section - only show if attending "Yes" */}
              {attending === "Yes" && <div className="space-y-6 pt-6 border-t border-anniversary-gold/30">
                  <h3 className="text-xl font-din text-anniversary-gold text-center">WHICH EVENTS Will YOU ATTEND:</h3>
                  
                  <div className="space-y-4">
                    {/* Main Event - always show for attending guests */}
                    {guest.main_event && <div className="flex items-center space-x-3 justify-center">
                        <Checkbox id="main-event-rsvp" checked={mainEventRsvp} onCheckedChange={checked => setMainEventRsvp(checked === true)} className="border-anniversary-gold data-[state=checked]:bg-anniversary-gold data-[state=checked]:border-anniversary-gold" />
                        <Label htmlFor="main-event-rsvp" className="text-white text-lg">
                          Main Event
                        </Label>
                      </div>}

                    {/* Friday Dinner - only show if guest is invited */}
                    {guest.friday_dinner && <div className="flex items-center space-x-3 justify-center">
                        <Checkbox id="friday-dinner-rsvp" checked={fridayDinnerRsvp} onCheckedChange={checked => setFridayDinnerRsvp(checked === true)} className="border-anniversary-gold data-[state=checked]:bg-anniversary-gold data-[state=checked]:border-anniversary-gold" />
                        <Label htmlFor="friday-dinner-rsvp" className="text-white text-lg">
                          Friday Dinner
                        </Label>
                      </div>}

                    {/* Sunday Brunch - only show if guest is invited */}
                    {guest.sunday_brunch && <div className="flex items-center space-x-3 justify-center">
                        <Checkbox id="sunday-brunch-rsvp" checked={sundayBrunchRsvp} onCheckedChange={checked => setSundayBrunchRsvp(checked === true)} className="border-anniversary-gold data-[state=checked]:bg-anniversary-gold data-[state=checked]:border-anniversary-gold" />
                        <Label htmlFor="sunday-brunch-rsvp" className="text-white text-lg">
                          Sunday Brunch
                        </Label>
                      </div>}

                    {/* Afterparty - only show if guest is invited */}
                    {guest.afterparty && <div className="flex items-center space-x-3 justify-center">
                        <Checkbox id="afterparty-rsvp" checked={afterpartyRsvp} onCheckedChange={checked => setAfterpartyRsvp(checked === true)} className="border-anniversary-gold data-[state=checked]:bg-anniversary-gold data-[state=checked]:border-anniversary-gold" />
                        <Label htmlFor="afterparty-rsvp" className="text-white text-lg">
                          Afterparty
                        </Label>
                      </div>}
                  </div>
                </div>}
            </div>
          </div>
          
          {formError && <div className="text-red-500 text-sm text-center bg-red-100/20 p-2 rounded-md flex items-center gap-2 justify-center">
              <AlertCircle className="w-4 h-4" />
              <span>Error: {formError}</span>
            </div>}
          
          <div className="flex justify-center px-0">
            <div className="flex flex-col items-center space-y-4">
              <Button type="submit" className="bg-anniversary-gold hover:bg-anniversary-gold/90 text-black text-lg px-8 py-2 font-medium" disabled={submitting}>
                {submitting ? "Submitting..." : hasResponded ? "Update Response" : "Submit RSVP"}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>;
}