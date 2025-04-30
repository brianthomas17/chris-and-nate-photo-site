
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

export default function AuthForm() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const success = await login(email);
      if (!success) {
        toast({
          title: "Access Denied",
          description: "Sorry, we couldn't find your email on our guest list.",
          variant: "destructive",
        });
      }
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
                    required
                    className="border-anniversary-navy"
                  />
                </div>
              </div>
              <div className="mt-6">
                <Button 
                  type="submit" 
                  className="w-full bg-anniversary-gold hover:bg-anniversary-gold/90 text-black"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Checking..." : "Continue"}
                </Button>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center border-t border-anniversary-gold/20 pt-4">
            <p className="text-sm text-gray-500">Not invited? Contact the event organizers.</p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
