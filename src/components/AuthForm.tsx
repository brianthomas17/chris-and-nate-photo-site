
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { AlertCircle, Loader2 } from "lucide-react";
import { seedTestAccounts } from "@/utils/seedTestAccounts";

export default function AuthForm() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [seedStatus, setSeedStatus] = useState<'idle' | 'seeding' | 'seeded' | 'error'>('idle');
  const [showLoginForm, setShowLoginForm] = useState(false);
  const { login } = useAuth();
  const { toast } = useToast();

  // Show login form after logo animation completes
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoginForm(true);
    }, 800); // Wait for logo animation to almost complete
    
    return () => clearTimeout(timer);
  }, []);

  const handleSeedTestAccounts = async () => {
    setSeedStatus('seeding');
    try {
      await seedTestAccounts();
      setSeedStatus('seeded');
      toast({
        title: "Test Accounts Ready",
        description: "Test accounts have been created. Try logging in with admin@example.com"
      });
    } catch (error) {
      console.error("Error seeding test accounts:", error);
      setSeedStatus('error');
      toast({
        title: "Error",
        description: "Could not create test accounts. Please try again.",
        variant: "destructive"
      });
    }
  };

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
          variant: "destructive"
        });
      } else {
        toast({
          title: "Welcome!",
          description: "You've successfully logged in."
        });
      }
    } catch (error) {
      console.error('Login error:', error);
      setFormError('An error occurred. Please try again.');
      toast({
        title: "Error",
        description: "An error occurred while trying to log in. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return <div className="flex items-center justify-center min-h-screen bg-anniversary-purple relative overflow-hidden">
      {/* Top circuit frame */}
      <div className="absolute top-0 left-0 right-0 w-full h-[150px] bg-no-repeat bg-contain bg-center" style={{
      backgroundImage: "url('/lovable-uploads/f1b5eb4b-16d9-413b-9947-8c73368a63d0.png')"
    }}></div>
      
      {/* Bottom circuit frame */}
      <div className="absolute bottom-0 left-0 right-0 w-full h-[150px] bg-no-repeat bg-contain bg-center" style={{
      backgroundImage: "url('/lovable-uploads/12cc45f0-9dd0-4cdf-aebd-ad9001c74e51.png')"
    }}></div>
      
      <div className="w-full max-w-md relative z-10 px-4 flex flex-col items-center">
        {/* Logo with a fade-in animation */}
        <div className="text-center mb-8 opacity-0 animate-[fade-in_1.2s_ease-out_forwards]">
          <img 
            src="/lovable-uploads/0bd6c2ac-82dc-4943-b35c-d640385e3fff.png" 
            alt="Circuit Board Logo" 
            className="w-64 h-64 mx-auto mb-6"
          />
        </div>
        
        {/* Login form with a delayed fade-in animation */}
        <div className={`w-full opacity-0 ${
          showLoginForm 
            ? "animate-[fade-in_1.5s_ease-out_forwards]" 
            : ""
        }`}>
          <Card className="border-anniversary-gold border-2 bg-anniversary-purple/90 backdrop-blur-md">
            <CardContent className="pt-6">
              <form onSubmit={handleSubmit}>
                <div className="grid w-full items-center gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-anniversary-gold">Enter Your Email For Access</Label>
                    <Input id="email" type="email" placeholder="your.email@example.com" value={email} onChange={e => setEmail(e.target.value)} className={`border-anniversary-gold/50 bg-anniversary-purple/50 text-white placeholder:text-anniversary-gold/50 ${formError ? 'border-red-500' : ''}`} />
                    {formError && <div className="flex items-center gap-2 text-sm text-red-500 mt-1">
                        <AlertCircle size={16} />
                        <span>{formError}</span>
                      </div>}
                  </div>
                </div>
                <div className="mt-6">
                  <Button type="submit" className="w-full bg-anniversary-gold hover:bg-anniversary-gold/90 text-black" disabled={isSubmitting}>
                    {isSubmitting ? <span className="flex items-center">
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Checking...
                      </span> : "Continue"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>;
}
