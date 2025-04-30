
import { supabase } from "@/integrations/supabase/client";
import { InvitationType } from "@/types";

/**
 * This utility function ensures that test accounts exist in the database
 * It can be called from the console for testing purposes
 */
export const seedTestAccounts = async () => {
  const testAccounts = [
    { email: 'john@example.com', first_name: 'John', invitation_type: 'full day' as InvitationType },
    { email: 'jane@example.com', first_name: 'Jane', invitation_type: 'evening' as InvitationType },
    { email: 'admin@example.com', first_name: 'Admin', invitation_type: 'admin' as InvitationType }
  ];

  console.log("Starting to seed test accounts...");
  
  try {
    for (const account of testAccounts) {
      // First, check if account already exists using ilike for case-insensitive matching
      const { data: existingGuests } = await supabase
        .from('guests')
        .select('id, email')
        .ilike('email', account.email.trim().toLowerCase());
      
      if (!existingGuests || existingGuests.length === 0) {
        // Record doesn't exist, insert it directly (now that RLS allows it)
        const { data: insertData, error: insertError } = await supabase
          .from('guests')
          .insert({
            email: account.email.trim().toLowerCase(),
            first_name: account.first_name,
            invitation_type: account.invitation_type
          })
          .select();
          
        if (insertError) {
          console.error(`Error creating test account ${account.email}:`, insertError);
        } else {
          console.log(`Successfully created test account: ${account.email}`, insertData);
        }
      } else {
        console.log(`Test account ${account.email} already exists`);
      }
    }
    
    console.log("Test account seeding complete");
    return true;
  } catch (error) {
    console.error("Error seeding test accounts:", error);
    return false;
  }
};

// Add this to the window object so it can be called from the console
if (typeof window !== 'undefined') {
  (window as any).seedTestAccounts = seedTestAccounts;
}
