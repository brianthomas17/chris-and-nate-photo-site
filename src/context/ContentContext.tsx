import React, { createContext, useContext, useState, useEffect } from 'react';
import { ContentSection, InvitationType } from '../types';
import { supabase } from "@/integrations/supabase/client";

interface ContentContextType {
  contentSections: ContentSection[];
  addContentSection: (section: Omit<ContentSection, 'id'>) => Promise<void>;
  updateContentSection: (section: ContentSection) => Promise<void>;
  deleteContentSection: (id: string) => Promise<void>;
  getVisibleSections: (
    invitationType: InvitationType, 
    fridayDinner?: boolean, 
    sundayBrunch?: boolean,
    mainEvent?: boolean,
    afterparty?: boolean
  ) => ContentSection[];
}

const ContentContext = createContext<ContentContextType | undefined>(undefined);

export const useContent = () => {
  const context = useContext(ContentContext);
  if (!context) {
    throw new Error('useContent must be used within a ContentProvider');
  }
  return context;
};

export const ContentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [contentSections, setContentSections] = useState<ContentSection[]>([]);

  useEffect(() => {
    fetchContentSections();
  }, []);

  const fetchContentSections = async () => {
    try {
      console.log("Fetching content sections from database...");
      const { data, error } = await supabase
        .from('content_sections')
        .select('*');

      if (error) {
        console.error('Error fetching content sections:', error);
        return;
      }

      if (!data || data.length === 0) {
        console.log('No content sections found in database');
        setContentSections([]);
        return;
      }

      console.log("Raw content sections data:", data);
      
      const transformedSections: ContentSection[] = data.map((section: any) => ({
        id: section.id,
        title: section.title,
        content: section.content,
        visible_to: section.visible_to,
        order_index: section.order_index,
        created_at: section.created_at,
        updated_at: section.updated_at,
        // Ensure boolean values are properly handled
        visible_to_friday_dinner: section.visible_to_friday_dinner === true,
        visible_to_sunday_brunch: section.visible_to_sunday_brunch === true,
        visible_to_main_event: section.visible_to_main_event === true,
        visible_to_afterparty: section.visible_to_afterparty === true
      }));

      setContentSections(transformedSections);
      console.log("Transformed content sections:", transformedSections);
    } catch (error) {
      console.error('Error fetching content sections:', error);
    }
  };

  const addContentSection = async (section: Omit<ContentSection, 'id'>) => {
    try {
      const { error } = await supabase
        .from('content_sections')
        .insert({
          title: section.title,
          content: section.content,
          visible_to: section.visible_to,
          order_index: section.order_index,
          visible_to_friday_dinner: section.visible_to_friday_dinner === true,
          visible_to_sunday_brunch: section.visible_to_sunday_brunch === true,
          visible_to_main_event: section.visible_to_main_event === true,
          visible_to_afterparty: section.visible_to_afterparty === true
        });

      if (error) {
        console.error('Error adding content section:', error);
        return;
      }

      await fetchContentSections();
    } catch (error) {
      console.error('Error adding content section:', error);
    }
  };

  const updateContentSection = async (section: ContentSection) => {
    try {
      console.log('Updating section with data:', {
        title: section.title,
        content: section.content,
        visible_to: section.visible_to,
        order_index: section.order_index,
        updated_at: new Date().toISOString(),
        visible_to_friday_dinner: section.visible_to_friday_dinner === true,
        visible_to_sunday_brunch: section.visible_to_sunday_brunch === true,
        visible_to_main_event: section.visible_to_main_event === true,
        visible_to_afterparty: section.visible_to_afterparty === true
      });
      
      const { error } = await supabase
        .from('content_sections')
        .update({
          title: section.title,
          content: section.content,
          visible_to: section.visible_to,
          order_index: section.order_index,
          updated_at: new Date().toISOString(),
          visible_to_friday_dinner: section.visible_to_friday_dinner === true,
          visible_to_sunday_brunch: section.visible_to_sunday_brunch === true,
          visible_to_main_event: section.visible_to_main_event === true,
          visible_to_afterparty: section.visible_to_afterparty === true
        })
        .eq('id', section.id);

      if (error) {
        console.error('Error updating content section:', error);
        return;
      }

      await fetchContentSections();
    } catch (error) {
      console.error('Error updating content section:', error);
    }
  };

  const deleteContentSection = async (id: string) => {
    try {
      const { error } = await supabase
        .from('content_sections')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting content section:', error);
        return;
      }

      await fetchContentSections();
    } catch (error) {
      console.error('Error deleting content section:', error);
    }
  };

  // Keep this method for backward compatibility, but our primary approach now uses the ContentSections component directly
  const getVisibleSections = (
    invitationType: InvitationType, 
    fridayDinner: boolean = false, 
    sundayBrunch: boolean = false,
    mainEvent: boolean = false, 
    afterparty: boolean = false
  ) => {
    // Log input values exactly as received
    console.log("getVisibleSections input values:", { 
      invitationType, 
      fridayDinner, 
      sundayBrunch, 
      mainEvent, 
      afterparty 
    });
    
    // Ensure strict boolean values (true is true only)
    const hasFridayDinner = fridayDinner === true;
    const hasSundayBrunch = sundayBrunch === true;
    const hasMainEvent = mainEvent === true;
    const hasAfterparty = afterparty === true;
    
    console.log("getVisibleSections processed booleans:", {
      hasFridayDinner,
      hasSundayBrunch,
      hasMainEvent,
      hasAfterparty
    });
    
    console.log("Total content sections:", contentSections.length);
    
    // For debugging
    contentSections.forEach(section => {
      console.log(`Content section "${section.title}":`, {
        fridayDinner: section.visible_to_friday_dinner,
        sundayBrunch: section.visible_to_sunday_brunch,
        mainEvent: section.visible_to_main_event,
        afterparty: section.visible_to_afterparty
      });
    });
    
    // 1. For admin users: Show all content sections
    // 2. For regular users: Show content that matches their access permissions
    const filteredSections = contentSections.filter(section => {
      // Admin users see all content
      if (invitationType === 'admin') {
        console.log(`Admin: Section "${section.title}" is visible`);
        return true;
      }
      
      // For non-admin users, check event access permissions
      let hasAccess = true;
      
      // Only check conditions where the section has a restriction
      if (section.visible_to_main_event === true && !hasMainEvent) {
        hasAccess = false;
        console.log(`Section "${section.title}" requires main_event access, user has: ${hasMainEvent}`);
      }
      
      if (section.visible_to_afterparty === true && !hasAfterparty) {
        hasAccess = false;
        console.log(`Section "${section.title}" requires afterparty access, user has: ${hasAfterparty}`);
      }
      
      if (section.visible_to_friday_dinner === true && !hasFridayDinner) {
        hasAccess = false;
        console.log(`Section "${section.title}" requires friday_dinner access, user has: ${hasFridayDinner}`);
      }
      
      if (section.visible_to_sunday_brunch === true && !hasSundayBrunch) {
        hasAccess = false;
        console.log(`Section "${section.title}" requires sunday_brunch access, user has: ${hasSundayBrunch}`);
      }
      
      console.log(`Regular user: Section "${section.title}" ${hasAccess ? 'is' : 'is not'} visible`);
      return hasAccess;
    });
    
    console.log("Filtered sections:", filteredSections.map(s => s.title));
    
    return filteredSections.sort((a, b) => a.order_index - b.order_index);
  };

  return (
    <ContentContext.Provider value={{ 
      contentSections, 
      addContentSection, 
      updateContentSection, 
      deleteContentSection,
      getVisibleSections
    }}>
      {children}
    </ContentContext.Provider>
  );
};
