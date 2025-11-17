import { usePasswordAuth } from "@/context/PasswordAuthContext";
import AuthForm from "@/components/AuthForm";
import TabLayout from "@/components/event/TabLayout";
import SingleVideoLayout from "@/components/event/SingleVideoLayout";

const Index = () => {
  const { accessType, loading } = usePasswordAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-anniversary-purple">
        <div className="text-center">
          <div className="w-16 h-16 border-t-4 border-anniversary-gold rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-white/70">Loading...</p>
        </div>
      </div>
    );
  }

  // Render different layouts based on access type
  const renderContent = () => {
    if (!accessType) return <AuthForm />;
    if (accessType === 'brownie') return <SingleVideoLayout />;
    return <TabLayout />;
  };

  return (
    <div className="relative min-h-screen">
      {/* Background SVG - positioned in the center with max-width 50% */}
      <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-0">
        <img 
          src="/masks.svg" 
          alt="" 
          className="max-w-[50vw] w-auto h-auto"
          aria-hidden="true"
        />
      </div>

      <div className="relative z-10">
        {renderContent()}
      </div>
    </div>
  );
};

export default Index;
