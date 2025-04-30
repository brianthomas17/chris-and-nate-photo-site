
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { AlertCircle, Loader2 } from "lucide-react";

export default function AuthForm() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const { login } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormError('');

    if (!email.trim()) {
      setFormError('Please enter your email address');
      setIsSubmitting(false);
      return;
    }

    try {
      console.log("Submitting login form with email:", email);
      const success = await login(email);
      
      if (!success) {
        setFormError('Sorry, we couldn\'t find your email on our guest list.');
        toast({
          title: "Access Denied",
          description: "Sorry, we couldn't find your email on our guest list.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Welcome!",
          description: "You've successfully logged in.",
        });
      }
    } catch (error) {
      console.error('Login error:', error);
      setFormError('An error occurred. Please try again.');
      toast({
        title: "Error",
        description: "An error occurred while trying to log in. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-anniversary-cream">
      <div className="w-full max-w-md animate-fade-in">
        <Card className="border-anniversary-gold border-2">
          <CardHeader className="text-center bg-anniversary-navy text-white">
            <CardTitle className="text-3xl font-playfair">10-Year Anniversary</CardTitle>
            <CardDescription className="text-gray-200">Please enter your email to access the event details</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit}>
              <div className="grid w-full items-center gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`border-anniversary-navy ${formError ? 'border-red-500' : ''}`}
                  />
                  {formError && (
                    <div className="flex items-center gap-2 text-sm text-red-500 mt-1">
                      <AlertCircle size={16} />
                      <span>{formError}</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="mt-6">
                <Button 
                  type="submit" 
                  className="w-full bg-anniversary-gold hover:bg-anniversary-gold/90 text-black"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <span className="flex items-center">
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Checking...
                    </span>
                  ) : "Continue"}
                </Button>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col justify-center border-t border-anniversary-gold/20 pt-4">
            <p className="text-sm text-gray-500">Not invited? Contact the event organizers.</p>
            <div className="mt-4 text-xs text-gray-400">
              <p>Test accounts: john@example.com, jane@example.com, admin@example.com</p>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
