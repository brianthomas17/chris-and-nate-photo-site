
import React, { createContext, useContext, useState, useEffect } from 'react';
import { ContentSection, InvitationType } from '../types';
import { supabase } from "@/integrations/supabase/client";

interface ContentContextType {
  contentSections: ContentSection[];
  addContentSection: (section: Omit<ContentSection, 'id'>) => Promise<void>;
  updateContentSection: (section: ContentSection) => Promise<void>;
  deleteContentSection: (id: string) => Promise<void>;
  getVisibleSections: (invitationType: InvitationType, fridayDinner?: boolean, sundayBrunch?: boolean) => ContentSection[];
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
        visible_to_sunday_brunch: section.visible_to_sunday_brunch
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
          visible_to_sunday_brunch: section.visible_to_sunday_brunch
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
        visible_to_sunday_brunch: section.visible_to_sunday_brunch
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
          visible_to_sunday_brunch: section.visible_to_sunday_brunch
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

  const getVisibleSections = (invitationType: InvitationType, fridayDinner: boolean = false, sundayBrunch: boolean = false) => {
    console.log("getVisibleSections called with:", { invitationType, fridayDinner, sundayBrunch });
    console.log("Total content sections:", contentSections.length);
    
    const filteredSections = contentSections.filter(section => {
      // First check if the section matches the invitation type
      if (!section.visible_to.includes(invitationType)) {
        return false;
      }
      
      // For sections specific to Friday dinner
      if (section.visible_to_friday_dinner === true && !fridayDinner) {
        console.log(`Filtering out section ${section.title} because it requires Friday dinner but user has fridayDinner=${fridayDinner}`);
        return false;
      }
      
      // For sections specific to Sunday brunch
      if (section.visible_to_sunday_brunch === true && !sundayBrunch) {
        console.log(`Filtering out section ${section.title} because it requires Sunday brunch but user has sundayBrunch=${sundayBrunch}`);
        return false;
      }
      
      // If we've passed all checks, show the section
      return true;
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
