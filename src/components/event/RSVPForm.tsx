
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGuests } from "@/context/GuestContext";
import { useAuth } from "@/context/AuthContext";
import { Guest } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";

interface RSVPFormProps {
  guest: Guest;
}

export default function RSVPForm({ guest }: RSVPFormProps) {
  const { updateRSVP } = useGuests();
  const { refreshSession } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Initialize state from guest props
  const [attending, setAttending] = useState<string | null>(guest.attending || null);
  const [fridayDinner, setFridayDinner] = useState<boolean>(guest.friday_dinner || false);
  const [sundayBrunch, setSundayBrunch] = useState<boolean>(guest.sunday_brunch || false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!attending) {
      toast({
        title: "Selection Required",
        description: "Please indicate if you will be attending.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // Update RSVP with attendance status and optional events
      // Only send fridayDinner and sundayBrunch if attending is "Yes"
      const fridayDinnerValue = attending === "Yes" ? fridayDinner : false;
      const sundayBrunchValue = attending === "Yes" ? sundayBrunch : false;
      
      console.log("RSVP form submitting with:", { 
        guestId: guest.id, 
        attending, 
        fridayDinner: fridayDinnerValue, 
        sundayBrunch: sundayBrunchValue 
      });
      
      const result = await updateRSVP(guest.id, attending, fridayDinnerValue, sundayBrunchValue);
      console.log("RSVP update result:", result);
      
      // Show success message
      toast({
        title: "Thank You!",
        description: `Your RSVP has been ${attending === "Yes" ? "confirmed" : "declined"}.`,
      });
      
      // Refresh the session to update currentGuest
      await refreshSession();

      // Redirect to main event page
      navigate('/');
    } catch (error) {
      console.error("Error updating RSVP:", error);
      toast({
        title: "Error",
        description: "There was a problem submitting your RSVP. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="max-w-md mx-auto bg-black/50 border border-anniversary-gold text-white">
      <CardHeader>
        <CardTitle className="text-anniversary-gold text-center">RSVP</CardTitle>
        <CardDescription className="text-white text-center">
          Let us know if you can join us for our celebration
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="text-center text-lg font-semibold text-anniversary-gold">Will you be attending?</div>
          <div className="flex justify-center space-x-6">
            <Button
              variant={attending === "Yes" ? "default" : "outline"}
              onClick={() => setAttending("Yes")}
              className={attending === "Yes" ? "bg-anniversary-gold hover:bg-anniversary-gold/90 text-black" : "text-white"}
            >
              Yes
            </Button>
            <Button
              variant={attending === "No" ? "default" : "outline"}
              onClick={() => setAttending("No")}
              className={attending === "No" ? "bg-anniversary-gold hover:bg-anniversary-gold/90 text-black" : "text-white"}
            >
              No
            </Button>
          </div>
        </div>

        {attending === "Yes" && guest.invitation_type === "main event" && (
          <div className="space-y-4 border-t border-gray-700 pt-4">
            <div className="text-center text-lg font-semibold text-anniversary-gold">Additional Events</div>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="friday-dinner" 
                  checked={fridayDinner} 
                  onCheckedChange={(checked) => setFridayDinner(checked === true)}
                  className="border-anniversary-gold data-[state=checked]:bg-anniversary-gold data-[state=checked]:text-black"
                />
                <label htmlFor="friday-dinner" className="text-white cursor-pointer">
                  Friday Family Dinner
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="sunday-brunch" 
                  checked={sundayBrunch}
                  onCheckedChange={(checked) => setSundayBrunch(checked === true)}
                  className="border-anniversary-gold data-[state=checked]:bg-anniversary-gold data-[state=checked]:text-black"
                />
                <label htmlFor="sunday-brunch" className="text-white cursor-pointer">
                  Sunday Brunch
                </label>
              </div>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-center">
        <Button 
          disabled={isSubmitting || !attending}
          onClick={handleSubmit}
          className="bg-anniversary-gold hover:bg-anniversary-gold/90 text-black"
        >
          {isSubmitting ? "Submitting..." : "Submit RSVP"}
        </Button>
      </CardFooter>
    </Card>
  );
}
