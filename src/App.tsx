
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ContentProvider } from "./context/ContentContext";
import { GuestProvider } from "./context/GuestContext";
import { PhotoProvider } from "./context/PhotoContext";

import Index from "./pages/Index";
import Admin from "./pages/Admin";
import RSVP from "./pages/RSVP";
import NotFound from "./pages/NotFound";
import EventLayout from "./components/event/EventLayout";

const queryClient = new QueryClient();

// Add a protected route component
const ProtectedRoute = ({ 
  element, 
  redirectPath = '/', 
  isAuthenticated,
  isAllowed = true,
  loading = false
}) => {
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-anniversary-purple">
      <div className="w-16 h-16 border-t-4 border-anniversary-gold rounded-full animate-spin mx-auto"></div>
    </div>;
  }
  
  if (!isAuthenticated || !isAllowed) {
    return <Navigate to={redirectPath} replace />;
  }

  return element;
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <BrowserRouter>
          <AuthProvider>
            <GuestProvider>
              <ContentProvider>
                <PhotoProvider>
                  {/* Only include one toaster component */}
                  <Toaster />
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/admin" element={<Admin />} />
                    <Route path="/rsvp" element={<RSVP />} />
                    <Route path="/event" element={<EventLayout />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </PhotoProvider>
              </ContentProvider>
            </GuestProvider>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
