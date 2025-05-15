
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, Loader2 } from "lucide-react";
import { seedTestAccounts } from "@/utils/seedTestAccounts";
import { AspectRatio } from "@/components/ui/aspect-ratio";

export default function AuthForm() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [seedStatus, setSeedStatus] = useState<'idle' | 'seeding' | 'seeded' | 'error'>('idle');
  const [showLoginForm, setShowLoginForm] = useState(false);
  const {
    login
  } = useAuth();

  // Show login form after a small delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoginForm(true);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const handleSeedTestAccounts = async () => {
    setSeedStatus('seeding');
    try {
      await seedTestAccounts();
      setSeedStatus('seeded');
    } catch (error) {
      console.error("Error seeding test accounts:", error);
      setSeedStatus('error');
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
      }
    } catch (error) {
      console.error('Login error:', error);
      setFormError('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-anniversary-purple relative overflow-hidden">
      {/* Background logo image */}
      <div className="fixed inset-0 z-0 pointer-events-none flex items-center justify-center">
        <div className="w-4/5 mx-auto">
          <AspectRatio ratio={1 / 1}>
            <img src="/lovable-uploads/0bd6c2ac-82dc-4943-b35c-d640385e3fff.png" alt="Circuit Board Logo" className="w-full h-full object-contain" />
          </AspectRatio>
        </div>
      </div>
      
      <div className="w-full max-w-md relative z-10 px-4 flex flex-col items-center" style={{ marginTop: "45vh" }}>
        {/* Login form with a delayed fade-in animation */}
        <div className={`w-full opacity-0 ${showLoginForm ? "animate-[fade-in_1.5s_ease-out_forwards]" : ""}`}>
          <form onSubmit={handleSubmit} className="w-full">
            <div className="grid w-full items-center gap-4">
              <div className="space-y-2">
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="your.email@example.com" 
                  value={email} 
                  onChange={e => setEmail(e.target.value)} 
                  className={`border-anniversary-gold bg-white text-black placeholder:text-gray-400 ${formError ? 'border-red-500' : ''}`} 
                />
                {formError && (
                  <div className="flex items-center gap-2 text-sm text-red-500 mt-1">
                    <AlertCircle size={16} />
                    <span>{formError}</span>
                  </div>
                )}
              </div>
            </div>
            {email.length > 0 && (
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
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
