
import { useState } from 'react';
import { Guest } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useGuests } from '@/context/GuestContext';
import { useToast } from '@/hooks/use-toast';
import { Check, UserCheck, UserX } from 'lucide-react';

interface PartyMemberCardProps {
  guest: Guest;
  currentUserId: string;
}

export default function PartyMemberCard({ guest, currentUserId }: PartyMemberCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [attending, setAttending] = useState<string | null>(guest.attending || null);
  const [isSubmitting, setIsSubmitting] = useState(false);
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
      await updateRSVP(guest.id, attending);
      toast({
        title: "RSVP Updated",
        description: `${guest.first_name}'s RSVP has been updated.`,
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
    if (guest.attending === 'Yes') {
      return 'border-green-500/30 bg-green-500/10';
    } else if (guest.attending === 'No') {
      return 'border-red-500/30 bg-red-500/10';
    }
    return 'border-anniversary-gold/30 bg-white/10';
  };

  // RSVP status icon
  const StatusIcon = () => {
    if (guest.attending === 'Yes') {
      return <UserCheck className="h-5 w-5 text-green-500" />;
    } else if (guest.attending === 'No') {
      return <UserX className="h-5 w-5 text-red-500" />;
    }
    return null;
  };

  return (
    <>
      <Card 
        className={`cursor-pointer hover:shadow-md transition-all ${getCardStyles()}`}
        onClick={() => setIsModalOpen(true)}
      >
        <CardContent className="p-4">
          <div className="flex justify-between items-center">
            <div className="flex flex-col">
              <h3 className="text-lg font-medium text-anniversary-gold">
                {guest.first_name} {guest.last_name || ''}
                {isSelf && <span className="ml-2 text-xs text-gray-400">(you)</span>}
              </h3>
              <p className="text-sm text-gray-300">
                {guest.attending 
                  ? (guest.attending === 'Yes' ? 'Attending' : 'Not Attending') 
                  : 'No Response Yet'}
              </p>
            </div>
            <div className="flex items-center">
              <StatusIcon />
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="bg-anniversary-purple border border-anniversary-gold/30 text-white">
          <DialogHeader>
            <DialogTitle className="text-anniversary-gold">
              Update RSVP for {guest.first_name}
            </DialogTitle>
            <DialogDescription className="text-gray-300">
              {isSelf 
                ? "Update your own attendance status."
                : "Update the attendance status for this guest."}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            <RadioGroup 
              value={attending || undefined} 
              onValueChange={v => setAttending(v)} 
              className="flex flex-col space-y-3"
            >
              <div className="flex items-center space-x-3">
                <RadioGroupItem value="Yes" id={`attending-yes-${guest.id}`} className="border-anniversary-gold" />
                <Label htmlFor={`attending-yes-${guest.id}`} className="text-white">Will Attend</Label>
              </div>
              <div className="flex items-center space-x-3">
                <RadioGroupItem value="No" id={`attending-no-${guest.id}`} className="border-anniversary-gold" />
                <Label htmlFor={`attending-no-${guest.id}`} className="text-white">Will Not Attend</Label>
              </div>
            </RadioGroup>
            
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
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
