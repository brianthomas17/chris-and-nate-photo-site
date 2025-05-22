
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
    return contentSections
      .filter(section => {
        // Basic invitation type filtering
        const visibleForInvitationType = section.visible_to.includes(invitationType);
        
        // Special event filters
        const visibleForFridayDinner = section.visible_to_friday_dinner ? fridayDinner : true;
        const visibleForSundayBrunch = section.visible_to_sunday_brunch ? sundayBrunch : true;
        
        // Section is visible if it matches the invitation type AND 
        // (it's not specifically for Friday dinner OR user is attending Friday dinner) AND
        // (it's not specifically for Sunday brunch OR user is attending Sunday brunch)
        return visibleForInvitationType && visibleForFridayDinner && visibleForSundayBrunch;
      })
      .sort((a, b) => a.order_index - b.order_index);
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
