
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/context/AuthContext";
import AdminLayout from "@/components/admin/AdminLayout";
import GuestManagement from "@/components/admin/GuestManagement";
import RSVPOverview from "@/components/admin/RSVPOverview";
import ContentManagement from "@/components/admin/ContentManagement";
import CommunicationsManagement from "@/components/admin/CommunicationsManagement";

const Admin = () => {
  const [activeTab, setActiveTab] = useState<string>("guests");
  const navigate = useNavigate();
  const { currentGuest } = useAuth();
  
  useEffect(() => {
    if (!currentGuest) {
      navigate("/login");
    }
  }, [currentGuest, navigate]);

  return (
    <AdminLayout>
      <div className="flex flex-col flex-1 overflow-hidden">
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="guests">Guests</TabsTrigger>
            <TabsTrigger value="rsvps">RSVPs</TabsTrigger>
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="communications">Communications</TabsTrigger>
          </TabsList>
          <TabsContent value="guests">
            <GuestManagement />
          </TabsContent>
          <TabsContent value="rsvps">
            <RSVPOverview />
          </TabsContent>
          <TabsContent value="content">
            <ContentManagement />
          </TabsContent>
          <TabsContent value="communications">
            <CommunicationsManagement />
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default Admin;
