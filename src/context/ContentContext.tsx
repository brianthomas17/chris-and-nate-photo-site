
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
      const { data, error } = await supabase
        .from('content_sections')
        .select('*');

      if (error) {
        console.error('Error fetching content sections:', error);
        return;
      }

      const transformedSections: ContentSection[] = data.map((section: any) => ({
        id: section.id,
        title: section.title,
        content: section.content,
        visible_to: section.visible_to,
        order_index: section.order_index,
        created_at: section.created_at,
        updated_at: section.updated_at,
        visible_to_friday_dinner: section.visible_to_friday_dinner,
        visible_to_sunday_brunch: section.visible_to_sunday_brunch,
        visible_to_main_event: section.visible_to_main_event,
        visible_to_afterparty: section.visible_to_afterparty
      }));

      setContentSections(transformedSections);
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
          visible_to_friday_dinner: section.visible_to_friday_dinner,
          visible_to_sunday_brunch: section.visible_to_sunday_brunch,
          visible_to_main_event: section.visible_to_main_event,
          visible_to_afterparty: section.visible_to_afterparty
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
        visible_to_friday_dinner: section.visible_to_friday_dinner,
        visible_to_sunday_brunch: section.visible_to_sunday_brunch,
        visible_to_main_event: section.visible_to_main_event,
        visible_to_afterparty: section.visible_to_afterparty
      });
      
      const { error } = await supabase
        .from('content_sections')
        .update({
          title: section.title,
          content: section.content,
          visible_to: section.visible_to,
          order_index: section.order_index,
          updated_at: new Date().toISOString(),
          visible_to_friday_dinner: section.visible_to_friday_dinner,
          visible_to_sunday_brunch: section.visible_to_sunday_brunch,
          visible_to_main_event: section.visible_to_main_event,
          visible_to_afterparty: section.visible_to_afterparty
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

  const getVisibleSections = (
    invitationType: InvitationType, 
    fridayDinner: boolean = false, 
    sundayBrunch: boolean = false,
    mainEvent: boolean = false, 
    afterparty: boolean = false
  ) => {
    console.log("getVisibleSections called with:", { 
      invitationType, 
      fridayDinner: Boolean(fridayDinner), 
      sundayBrunch: Boolean(sundayBrunch), 
      mainEvent: Boolean(mainEvent), 
      afterparty: Boolean(afterparty) 
    });
    console.log("Total content sections:", contentSections.length);
    
    // Convert inputs to proper boolean values
    const hasFridayDinner = Boolean(fridayDinner);
    const hasSundayBrunch = Boolean(sundayBrunch);
    const hasMainEvent = Boolean(mainEvent);
    const hasAfterparty = Boolean(afterparty);
    
    const filteredSections = contentSections.filter(section => {
      // For admin users: show all content they have permission for
      if (invitationType === 'admin') {
        // For admin users, we check each event type separately and show content
        // if it's either not restricted to that event type OR the admin has access to it
        
        // If content requires main event access
        if (section.visible_to_main_event && !hasMainEvent) {
          console.log(`Admin: Section "${section.title}" filtered out - requires main event but admin has mainEvent=${hasMainEvent}`);
          return false;
        }
        
        // If content requires afterparty access
        if (section.visible_to_afterparty && !hasAfterparty) {
          console.log(`Admin: Section "${section.title}" filtered out - requires afterparty but admin has afterparty=${hasAfterparty}`);
          return false;
        }
        
        // If content requires Friday dinner access
        if (section.visible_to_friday_dinner && !hasFridayDinner) {
          console.log(`Admin: Section "${section.title}" filtered out - requires Friday dinner but admin has fridayDinner=${hasFridayDinner}`);
          return false;
        }
        
        // If content requires Sunday brunch access
        if (section.visible_to_sunday_brunch && !hasSundayBrunch) {
          console.log(`Admin: Section "${section.title}" filtered out - requires Sunday brunch but admin has sundayBrunch=${hasSundayBrunch}`);
          return false;
        }
        
        // If we got here, the admin has the necessary permissions
        console.log(`Admin: Section "${section.title}" is visible`);
        return true;
      }
      
      // Non-admin users - use strict filtering
      let shouldShow = false;
      
      // First check if user has main event access and content is for main event
      if (hasMainEvent && section.visible_to_main_event) {
        shouldShow = true;
      } else if (section.visible_to_main_event) {
        // Content requires main event but user doesn't have access
        return false;
      }
      
      // Then check if content requires special access that the user doesn't have
      if (section.visible_to_afterparty && !hasAfterparty) {
        return false;
      }
      
      if (section.visible_to_friday_dinner && !hasFridayDinner) {
        return false;
      }
      
      if (section.visible_to_sunday_brunch && !hasSundayBrunch) {
        return false;
      }
      
      return shouldShow;
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
