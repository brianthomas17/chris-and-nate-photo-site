
import React, { useState, useEffect } from 'react';
import { useGuests } from '@/context/GuestContext';
import { Guest } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { Checkbox } from '@/components/ui/checkbox';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

interface RSVPFormProps {
  guest: Guest;
  onComplete: () => void;
}

const formSchema = z.object({
  attending: z.enum(["Yes", "No", "Maybe"]),
  fridayDinner: z.boolean().optional(),
  sundayBrunch: z.boolean().optional(),
});

const RSVPForm: React.FC<RSVPFormProps> = ({ guest, onComplete }) => {
  const { updateRSVP } = useGuests();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Set up form with default values from guest data
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      attending: guest.attending as "Yes" | "No" | "Maybe" || "Maybe",
      fridayDinner: guest.friday_dinner || false,
      sundayBrunch: guest.sunday_brunch || false,
    },
  });
  
  // Handle form submission
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    try {
      await updateRSVP(
        guest.id, 
        values.attending, 
        values.fridayDinner, 
        values.sundayBrunch
      );
      
      toast({
        title: "RSVP Updated",
        description: `Thank you for your response, ${guest.first_name}!`,
      });
      
      onComplete();
    } catch (error) {
      console.error("Error updating RSVP:", error);
      toast({
        title: "Error",
        description: "There was a problem updating your RSVP. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-center">
          {guest.first_name}'s RSVP
        </CardTitle>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent>
            <div className="space-y-6">
              <FormField
                control={form.control}
                name="attending"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Will you be attending?</FormLabel>
                    <FormControl>
                      <RadioGroup 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                        className="flex flex-col space-y-1"
                      >
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="Yes" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            Yes, I will attend
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="No" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            No, I cannot attend
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="Maybe" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            I'm not sure yet
                          </FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                  </FormItem>
                )}
              />
              
              {/* Only show these options if attending is set to Yes */}
              {form.watch("attending") === "Yes" && (
                <div className="space-y-4 border-t pt-4">
                  <FormField
                    control={form.control}
                    name="fridayDinner"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>
                            I will attend the Friday dinner
                          </FormLabel>
                          <FormDescription>
                            Join us for a pre-event dinner on Friday evening
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="sundayBrunch"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>
                            I will attend the Sunday brunch
                          </FormLabel>
                          <FormDescription>
                            Join us for a farewell brunch on Sunday morning
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              className="w-full bg-anniversary-gold hover:bg-anniversary-gold/90 text-black" 
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving..." : "Save RSVP"}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
};

export default RSVPForm;
