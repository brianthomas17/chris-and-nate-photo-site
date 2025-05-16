
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Photo } from '../types';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from './AuthContext';
import { supabase } from "@/integrations/supabase/client";

interface PhotoContextType {
  photos: Photo[];
  addPhoto: (url: string) => Promise<void>;
  deletePhoto: (id: string) => Promise<void>;
}

const PhotoContext = createContext<PhotoContextType | undefined>(undefined);

export const usePhotos = () => {
  const context = useContext(PhotoContext);
  if (!context) {
    throw new Error('usePhotos must be used within a PhotoProvider');
  }
  return context;
};

export const PhotoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const { toast } = useToast();
  const { currentGuest } = useAuth(); // This should now work with our updated AuthContext

  useEffect(() => {
    fetchPhotos();
  }, []);

  const fetchPhotos = async () => {
    try {
      const { data, error } = await supabase
        .from('photos')
        .select(`
          id,
          url,
          uploaded_by,
          created_at,
          guests!inner(first_name)
        `);

      if (error) {
        console.error('Error fetching photos:', error);
        return;
      }

      const transformedPhotos: Photo[] = data.map((photo: any) => ({
        id: photo.id,
        url: photo.url,
        uploaded_by: photo.guests.first_name,
        created_at: photo.created_at
      }));

      setPhotos(transformedPhotos);
    } catch (error) {
      console.error('Error fetching photos:', error);
    }
  };

  const addPhoto = async (url: string) => {
    if (!currentGuest) return;

    try {
      const { error } = await supabase
        .from('photos')
        .insert({
          url,
          uploaded_by: currentGuest.id
        });

      if (error) {
        console.error('Error adding photo:', error);
        toast({
          title: "Error",
          description: `Could not add photo: ${error.message}`,
          variant: "destructive"
        });
        return;
      }

      await fetchPhotos();
      
      toast({
        title: "Photo Uploaded",
        description: "Your photo has been added to the gallery.",
      });
    } catch (error) {
      console.error('Error adding photo:', error);
    }
  };

  const deletePhoto = async (id: string) => {
    try {
      const { error } = await supabase
        .from('photos')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting photo:', error);
        toast({
          title: "Error",
          description: `Could not delete photo: ${error.message}`,
          variant: "destructive"
        });
        return;
      }

      await fetchPhotos();
      
      toast({
        title: "Photo Removed",
        description: "The photo has been removed from the gallery.",
      });
    } catch (error) {
      console.error('Error deleting photo:', error);
    }
  };

  return (
    <PhotoContext.Provider value={{ photos, addPhoto, deletePhoto }}>
      {children}
    </PhotoContext.Provider>
  );
};
