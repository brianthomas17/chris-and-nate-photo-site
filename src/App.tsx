
import { Toaster } from "@/components/ui/toaster";
// Remove the Sonner import if it's causing the duplicate toasts
// import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { PasswordAuthProvider } from "./context/PasswordAuthContext";
import { ContentProvider } from "./context/ContentContext";
import { GuestProvider } from "./context/GuestContext";
import { PhotoProvider } from "./context/PhotoContext";

import Index from "./pages/Index";
import Admin from "./pages/Admin";
import RSVP from "./pages/RSVP";
import NotFound from "./pages/NotFound";
import EventLayout from "./components/event/EventLayout";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <PasswordAuthProvider>
        <GuestProvider>
          <ContentProvider>
            <PhotoProvider>
              {/* Only include one toaster component */}
              <Toaster />
              <BrowserRouter>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/admin" element={<Admin />} />
                  <Route path="/rsvp" element={<RSVP />} />
                  <Route path="/event" element={<EventLayout />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
            </PhotoProvider>
          </ContentProvider>
        </GuestProvider>
      </PasswordAuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
