
import { useState } from "react";
import { usePhotos } from "@/context/PhotoContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function PhotoGallery() {
  const { photos, addPhoto, deletePhoto } = usePhotos();
  const { currentGuest } = useAuth();
  const [imageUrl, setImageUrl] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleAddPhoto = () => {
    if (!imageUrl.trim()) return;
    
    addPhoto(imageUrl);
    setImageUrl("");
    setIsDialogOpen(false);
  };

  const handleDeletePhoto = (id: string) => {
    if (confirm("Are you sure you want to remove this photo?")) {
      deletePhoto(id);
    }
  };

  const isAdmin = currentGuest?.invitationType === 'admin';

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-playfair">Photo Gallery</h2>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-anniversary-gold hover:bg-anniversary-gold/90 text-black">
              Upload Photo
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add a Photo</DialogTitle>
              <DialogDescription>
                Share a photo from the event by providing an image URL.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <Label htmlFor="image-url">Image URL</Label>
              <Input
                id="image-url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://example.com/your-image.jpg"
                className="mt-2"
              />
              <p className="text-xs text-muted-foreground mt-2">
                Note: For this demo, we're using image URLs. A production app would include file uploads.
              </p>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddPhoto}>Add Photo</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {photos.length === 0 ? (
        <div className="text-center p-12 border rounded-md bg-gray-50">
          <p className="text-muted-foreground">No photos have been uploaded yet.</p>
          <p className="text-sm mt-2">Be the first to share a photo from the event!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {photos.map((photo) => (
            <Card key={photo.id} className="overflow-hidden">
              <div className="aspect-square overflow-hidden bg-gray-100">
                <img 
                  src={photo.url} 
                  alt={`Photo by ${photo.uploadedBy}`} 
                  className="object-cover w-full h-full transition-transform hover:scale-105"
                />
              </div>
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm">Uploaded by {photo.uploadedBy}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(photo.uploadedAt).toLocaleDateString()}
                    </p>
                  </div>
                  {(isAdmin || currentGuest?.firstName === photo.uploadedBy) && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleDeletePhoto(photo.id)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      Remove
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
