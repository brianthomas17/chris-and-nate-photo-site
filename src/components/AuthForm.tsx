import { useState, useEffect } from "react";
import { usePasswordAuth } from "@/context/PasswordAuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AlertCircle } from "lucide-react";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { useImageLoader } from "@/hooks/useImageLoader";

export default function AuthForm() {
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState('');
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [showHeroImage, setShowHeroImage] = useState(false);
  const { login } = usePasswordAuth();

  // Define the hero image URL
  const heroImageUrl = "/lovable-uploads/6395beab-ec13-4211-85d9-c76cbd98073b.png";

  // Use the image loader hook to detect when the image is loaded
  const { allImagesLoaded } = useImageLoader({ 
    imageUrls: [heroImageUrl],
    onAllLoaded: () => {
      // Start the fade-in animation once the image is loaded
      setShowHeroImage(true);
    }
  });

  // Show login form after the hero image starts fading in
  useEffect(() => {
    if (showHeroImage) {
      const timer = setTimeout(() => {
        setShowLoginForm(true);
      }, 400); // Start login form animation shortly after hero image starts
      return () => clearTimeout(timer);
    }
  }, [showHeroImage]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    
    if (!password.trim()) {
      setFormError('Please enter a password');
      return;
    }
    
    const success = login(password);
    if (!success) {
      setFormError('Invalid password. Please try again.');
      setPassword('');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-anniversary-purple relative overflow-hidden">
      {/* Background logo image with fade-in animation after loading */}
      <div className="fixed inset-0 z-0 pointer-events-none flex items-center justify-center overflow-visible">
        <div className={`absolute mx-8 transition-opacity duration-1000 ease-out ${
          showHeroImage ? 'opacity-80' : 'opacity-0'
        }`} style={{ minWidth: '500px', width: 'calc(100% - 64px)', maxWidth: '900px' }}>
          <AspectRatio ratio={1 / 1}>
            <img 
              src={heroImageUrl}
              alt="Anniversary Masks" 
              className="w-full h-full object-contain" 
            />
          </AspectRatio>
        </div>
      </div>
      
      {/* Login form with delayed fade-in animation */}
      <div className="w-full max-w-md relative z-10 px-4 flex flex-col items-center" style={{ marginTop: "35vh" }}>
        <div className={`w-full opacity-0 ${showLoginForm ? "animate-[fade-in_1.5s_ease-out_forwards]" : ""}`}>
          <form onSubmit={handleSubmit} className="w-full flex flex-col items-center">
            <div className="w-full max-w-[300px] mx-auto">
              <div className="space-y-2">
                <Input 
                  id="password" 
                  type="password" 
                  placeholder="Enter Password" 
                  value={password} 
                  onChange={e => setPassword(e.target.value)} 
                  className={`w-full text-center border-anniversary-gold bg-white/80 text-black placeholder:text-gray-600 rounded-md ${formError ? 'border-red-500' : ''}`} 
                />
                {formError && (
                  <div className="flex items-center gap-2 text-sm text-red-500 mt-1">
                    <AlertCircle size={16} />
                    <span>{formError}</span>
                  </div>
                )}
              </div>
            </div>
            <div className="mt-6 w-full max-w-[300px] mx-auto">
              {password.length > 0 && (
                <Button 
                  type="submit" 
                  className="w-full bg-[#C9A95B] hover:bg-[#C9A95B]/90 text-black transition-all duration-300 animate-[fade-in_0.3s_ease-out] rounded-md h-10"
                >
                  Continue
                </Button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
