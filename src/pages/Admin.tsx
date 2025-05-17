
import AdminLayout from "@/components/admin/AdminLayout";
import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";

const Admin = () => {
  const { currentGuest, isLoading } = useAuth();
  const navigate = useNavigate();

  // Use useEffect for navigation to prevent issues with multiple renders
  useEffect(() => {
    // Make sure auth is loaded before checking
    if (!isLoading) {
      // Redirect if not logged in
      if (!currentGuest) {
        navigate('/', {
          replace: true
        });
        return;
      }

      // Redirect if not admin
      if (currentGuest.invitation_type !== 'admin') {
        navigate('/', {
          replace: true
        });
        return;
      }
    }
  }, [currentGuest, isLoading, navigate]);

  // If still loading auth, show nothing
  if (isLoading) {
    return null;
  }

  // If not admin or not logged in (before redirect happens), don't render
  if (!currentGuest || currentGuest.invitation_type !== 'admin') {
    return null;
  }

  return (
    <AdminLayout />
  );
};

export default Admin;
