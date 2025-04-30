
import React, { createContext, useContext, useState } from 'react';
import { Photo } from '../types';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from './AuthContext';

interface PhotoContextType {
  photos: Photo[];
  addPhoto: (url: string) => void;
  deletePhoto: (id: string) => void;
}

const PhotoContext = createContext<PhotoContextType | undefined>(undefined);

export const usePhotos = () => {
  const context = useContext(PhotoContext);
  if (!context) {
    throw new Error('usePhotos must be used within a PhotoProvider');
  }
  return context;
};

// Mock photos - in a real app, this would come from a database
const INITIAL_PHOTOS: Photo[] = [
  {
    id: '1',
    url: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30',
    uploadedBy: 'John',
    uploadedAt: new Date('2023-01-15')
  },
  {
    id: '2',
    url: 'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf',
    uploadedBy: 'Jane',
    uploadedAt: new Date('2023-02-20')
  },
  {
    id: '3',
    url: 'https://images.unsplash.com/photo-1496024840928-4c417adf211d',
    uploadedBy: 'Admin',
    uploadedAt: new Date('2023-03-10')
  },
];

export const PhotoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [photos, setPhotos] = useState<Photo[]>(INITIAL_PHOTOS);
  const { toast } = useToast();
  const { currentGuest } = useAuth();

  const addPhoto = (url: string) => {
    if (!currentGuest) return;

    const newPhoto = {
      id: Date.now().toString(),
      url,
      uploadedBy: currentGuest.firstName,
      uploadedAt: new Date()
    };
    
    setPhotos(prev => [...prev, newPhoto]);
    
    toast({
      title: "Photo Uploaded",
      description: "Your photo has been added to the gallery.",
    });
  };

  const deletePhoto = (id: string) => {
    setPhotos(prev => prev.filter(p => p.id !== id));
    
    toast({
      title: "Photo Removed",
      description: "The photo has been removed from the gallery.",
    });
  };

  return (
    <PhotoContext.Provider value={{ photos, addPhoto, deletePhoto }}>
      {children}
    </PhotoContext.Provider>
  );
};
