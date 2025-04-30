
import { useAuth } from "@/context/AuthContext";
import AuthForm from "@/components/AuthForm";
import EventLayout from "@/components/event/EventLayout";

const Index = () => {
  const { currentGuest, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-anniversary-cream">
        <div className="text-center">
          <div className="w-16 h-16 border-t-4 border-anniversary-gold rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return currentGuest ? <EventLayout /> : <AuthForm />;
};

export default Index;
