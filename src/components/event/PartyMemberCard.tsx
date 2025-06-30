
import { useState } from 'react';
import { Guest } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useGuests } from '@/context/GuestContext';
import { useToast } from '@/hooks/use-toast';
import { Check, UserCheck, UserX } from 'lucide-react';

interface PartyMemberCardProps {
  guest: Guest;
  currentUserId: string;
}

export default function PartyMemberCard({
  guest,
  currentUserId
}: PartyMemberCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [attending, setAttending] = useState<string | null>(guest.attending || null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // New state for event confirmations
  const [fridayDinnerRsvp, setFridayDinnerRsvp] = useState<boolean>(guest?.friday_dinner_rsvp || false);
  const [sundayBrunchRsvp, setSundayBrunchRsvp] = useState<boolean>(guest?.sunday_brunch_rsvp || false);
  const [mainEventRsvp, setMainEventRsvp] = useState<boolean>(guest?.main_event_rsvp || false);
  const [afterpartyRsvp, setAfterpartyRsvp] = useState<boolean>(guest?.afterparty_rsvp || false);
  
  const { updateRSVP } = useGuests();
  const { toast } = useToast();
  
  const isSelf = guest.id === currentUserId;

  const handleRSVPUpdate = async () => {
    if (!attending) {
      toast({
        title: "Selection Required",
        description: "Please select an attendance option.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // Call updateRSVP with event confirmations
      await updateRSVP(
        guest.id, 
        attending,
        guest.friday_dinner, // Keep existing invitation status
        guest.sunday_brunch, // Keep existing invitation status
        attending === "Yes" ? fridayDinnerRsvp : false,
        attending === "Yes" ? sundayBrunchRsvp : false,
        attending === "Yes" ? mainEventRsvp : false,
        attending === "Yes" ? afterpartyRsvp : false
      );
      
      toast({
        title: "RSVP Updated",
        description: `${guest.first_name}'s RSVP has been updated.`
      });
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error updating RSVP:", error);
      toast({
        title: "Error",
        description: "Failed to update RSVP. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Determine card background based on RSVP status
  const getCardStyles = () => {
    if (guest.attending === 'No') {
      return 'opacity-60';
    }
    return 'border-anniversary-gold/30 bg-white/10';
  };

  // RSVP status icon
  const StatusIcon = () => {
    if (guest.attending === 'Yes') {
      return <UserCheck className="h-5 w-5 text-anniversary-gold" />;
    } else if (guest.attending === 'No') {
      return <UserX className="h-5 w-5 text-anniversary-gold" />;
    }
    return null;
  };

  return (
    <>
      <Card className={`cursor-pointer hover:shadow-md transition-all border-anniversary-gold/30 bg-white/10 ${getCardStyles()}`} onClick={() => setIsModalOpen(true)}>
        <CardContent className="p-4">
          <div className="flex justify-between items-center">
            <div className="flex flex-col">
              <h3 className="text-lg font-medium text-anniversary-gold">
                {guest.first_name} {guest.last_name || ''}
                {isSelf && <span className="ml-2 text-xs text-gray-400">(you)</span>}
              </h3>
              <p className="text-sm text-gray-300">
                {guest.attending ? guest.attending === 'Yes' ? 'Attending' : 'Not Attending' : 'No Response Yet'}
              </p>
            </div>
            <div className="flex items-center">
              <StatusIcon />
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="bg-anniversary-purple border border-anniversary-gold/30 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="text-anniversary-gold mb-4">
              Update RSVP for {guest.first_name}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            <RadioGroup value={attending || undefined} onValueChange={v => setAttending(v)} className="flex flex-col space-y-3">
              <div className="flex items-center space-x-3">
                <RadioGroupItem value="Yes" id={`attending-yes-${guest.id}`} className="border-anniversary-gold" />
                <Label htmlFor={`attending-yes-${guest.id}`} className="text-white">Will Attend</Label>
              </div>
              <div className="flex items-center space-x-3">
                <RadioGroupItem value="No" id={`attending-no-${guest.id}`} className="border-anniversary-gold" />
                <Label htmlFor={`attending-no-${guest.id}`} className="text-white">Will Not Attend</Label>
              </div>
            </RadioGroup>

            {/* Event Confirmation Section - only show if attending "Yes" */}
            {attending === "Yes" && (
              <div className="space-y-4 pt-4 border-t border-anniversary-gold/30">
                <h4 className="text-sm font-medium text-anniversary-gold">
                  Which events will {guest.first_name} attend?
                </h4>
                
                <div className="space-y-3">
                  {/* Main Event - always show for attending guests */}
                  {guest.main_event && (
                    <div className="flex items-center space-x-3">
                      <Checkbox 
                        id={`main-event-rsvp-${guest.id}`}
                        checked={mainEventRsvp}
                        onCheckedChange={(checked) => setMainEventRsvp(checked === true)}
                        className="border-anniversary-gold data-[state=checked]:bg-anniversary-gold data-[state=checked]:border-anniversary-gold"
                      />
                      <Label htmlFor={`main-event-rsvp-${guest.id}`} className="text-white text-sm">
                        Main Event
                      </Label>
                    </div>
                  )}

                  {/* Friday Dinner - only show if guest is invited */}
                  {guest.friday_dinner && (
                    <div className="flex items-center space-x-3">
                      <Checkbox 
                        id={`friday-dinner-rsvp-${guest.id}`}
                        checked={fridayDinnerRsvp}
                        onCheckedChange={(checked) => setFridayDinnerRsvp(checked === true)}
                        className="border-anniversary-gold data-[state=checked]:bg-anniversary-gold data-[state=checked]:border-anniversary-gold"
                      />
                      <Label htmlFor={`friday-dinner-rsvp-${guest.id}`} className="text-white text-sm">
                        Friday Dinner
                      </Label>
                    </div>
                  )}

                  {/* Sunday Brunch - only show if guest is invited */}
                  {guest.sunday_brunch && (
                    <div className="flex items-center space-x-3">
                      <Checkbox 
                        id={`sunday-brunch-rsvp-${guest.id}`}
                        checked={sundayBrunchRsvp}
                        onCheckedChange={(checked) => setSundayBrunchRsvp(checked === true)}
                        className="border-anniversary-gold data-[state=checked]:bg-anniversary-gold data-[state=checked]:border-anniversary-gold"
                      />
                      <Label htmlFor={`sunday-brunch-rsvp-${guest.id}`} className="text-white text-sm">
                        Sunday Brunch
                      </Label>
                    </div>
                  )}

                  {/* Afterparty - only show if guest is invited */}
                  {guest.afterparty && (
                    <div className="flex items-center space-x-3">
                      <Checkbox 
                        id={`afterparty-rsvp-${guest.id}`}
                        checked={afterpartyRsvp}
                        onCheckedChange={(checked) => setAfterpartyRsvp(checked === true)}
                        className="border-anniversary-gold data-[state=checked]:bg-anniversary-gold data-[state=checked]:border-anniversary-gold"
                      />
                      <Label htmlFor={`afterparty-rsvp-${guest.id}`} className="text-white text-sm">
                        Afterparty
                      </Label>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            <div className="flex justify-end">
              <Button 
                className="bg-anniversary-gold hover:bg-anniversary-gold/90 text-black" 
                onClick={handleRSVPUpdate} 
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span className="flex items-center">Saving...</span>
                ) : (
                  <span className="flex items-center gap-1">
                    <Check className="w-4 h-4" /> Save
                  </span>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
