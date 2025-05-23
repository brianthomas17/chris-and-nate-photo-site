
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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

const App = () => (
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

export default App;
