
import React, { createContext, useContext, useState } from 'react';
import { ContentSection, InvitationType } from '../types';

interface ContentContextType {
  contentSections: ContentSection[];
  addContentSection: (section: Omit<ContentSection, 'id'>) => void;
  updateContentSection: (section: ContentSection) => void;
  deleteContentSection: (id: string) => void;
  getVisibleSections: (invitationType: InvitationType) => ContentSection[];
}

const ContentContext = createContext<ContentContextType | undefined>(undefined);

export const useContent = () => {
  const context = useContext(ContentContext);
  if (!context) {
    throw new Error('useContent must be used within a ContentProvider');
  }
  return context;
};

// Mock content - in a real app, this would come from a database
const INITIAL_CONTENT: ContentSection[] = [
  {
    id: '1',
    title: 'Welcome',
    content: '<h1>Welcome to Our 10-Year Anniversary Celebration!</h1><p>We are thrilled to have you join us for this special occasion.</p>',
    visibleTo: ['full day', 'evening', 'admin'],
    order: 1
  },
  {
    id: '2',
    title: 'Day Event Schedule',
    content: '<h2>Day Event</h2><p>Join us from 10:00 AM for a day of fun activities including:</p><ul><li>Brunch at 11:00 AM</li><li>Group activities at 1:00 PM</li><li>Afternoon tea at 3:00 PM</li></ul>',
    visibleTo: ['full day', 'admin'],
    order: 2
  },
  {
    id: '3',
    title: 'Evening Event Schedule',
    content: '<h2>Evening Gala</h2><p>The evening celebration begins at 6:00 PM with:</p><ul><li>Cocktail reception</li><li>Dinner at 7:30 PM</li><li>Dancing from 9:00 PM</li></ul>',
    visibleTo: ['full day', 'evening', 'admin'],
    order: 3
  }
];

export const ContentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [contentSections, setContentSections] = useState<ContentSection[]>(INITIAL_CONTENT);

  const addContentSection = (section: Omit<ContentSection, 'id'>) => {
    const newSection = {
      ...section,
      id: Date.now().toString()
    };
    setContentSections(prev => [...prev, newSection]);
  };

  const updateContentSection = (section: ContentSection) => {
    setContentSections(prev => 
      prev.map(s => s.id === section.id ? section : s)
    );
  };

  const deleteContentSection = (id: string) => {
    setContentSections(prev => prev.filter(s => s.id !== id));
  };

  const getVisibleSections = (invitationType: InvitationType) => {
    return contentSections
      .filter(section => section.visibleTo.includes(invitationType))
      .sort((a, b) => a.order - b.order);
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
