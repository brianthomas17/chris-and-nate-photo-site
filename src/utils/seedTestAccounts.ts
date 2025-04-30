
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

  console.log("Checking for test accounts...");
  
  for (const account of testAccounts) {
    // Check if account exists
    const { data: existingGuests } = await supabase
      .from('guests')
      .select('id, email')
      .ilike('email', account.email);
      
    if (!existingGuests || existingGuests.length === 0) {
      console.log(`Creating test account: ${account.email}`);
      
      // Insert the account if it doesn't exist
      const { data, error } = await supabase
        .from('guests')
        .insert(account)
        .select();
        
      if (error) {
        console.error(`Error creating test account ${account.email}:`, error);
      } else {
        console.log(`Created test account: ${account.email}`);
      }
    } else {
      console.log(`Test account ${account.email} already exists`);
    }
  }
  
  console.log("Test account check complete");
  return true;
};

// Add this to the window object so it can be called from the console
if (typeof window !== 'undefined') {
  (window as any).seedTestAccounts = seedTestAccounts;
}
