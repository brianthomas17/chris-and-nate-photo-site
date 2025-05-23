import { useState } from "react";
import { useContent } from "@/context/ContentContext";
import { ContentSection } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function ContentManagement() {
  const { contentSections, addContentSection, updateContentSection, deleteContentSection } = useContent();
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [visibleToMainEvent, setVisibleToMainEvent] = useState(true);
  const [visibleToAfterparty, setVisibleToAfterparty] = useState(false);
  const [visibleToFridayDinner, setVisibleToFridayDinner] = useState(false);
  const [visibleToSundayBrunch, setVisibleToSundayBrunch] = useState(false);
  const [orderIndex, setOrderIndex] = useState(0);
  
  const [currentSection, setCurrentSection] = useState<ContentSection | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetForm = () => {
    setTitle("");
    setContent("");
    setVisibleToMainEvent(true);
    setVisibleToAfterparty(false);
    setVisibleToFridayDinner(false);
    setVisibleToSundayBrunch(false);
    setOrderIndex(0);
    setCurrentSection(null);
  };

  const handleAddContent = async () => {
    setIsSubmitting(true);
    
    // We're now ignoring the old visible_to array and focusing on the specific boolean fields
    // But keeping the array for backward compatibility (set it based on the checkboxes)
    const visibleTo = [];
    if (visibleToMainEvent) visibleTo.push("main event");
    if (visibleToAfterparty) visibleTo.push("afterparty");
    visibleTo.push("admin"); // Always visible to admin

    await addContentSection({
      title,
      content,
      visible_to: visibleTo,
      order_index: orderIndex || contentSections.length + 1,
      visible_to_friday_dinner: visibleToFridayDinner,
      visible_to_sunday_brunch: visibleToSundayBrunch,
      visible_to_main_event: visibleToMainEvent,
      visible_to_afterparty: visibleToAfterparty
    });
    
    setIsSubmitting(false);
    setIsAddDialogOpen(false);
    resetForm();
  };

  const handleUpdateContent = async () => {
    if (!currentSection) return;
    
    setIsSubmitting(true);
    
    // Build visible_to array based on the checkboxes (for backward compatibility)
    const visibleTo = [];
    if (visibleToMainEvent) visibleTo.push("main event");
    if (visibleToAfterparty) visibleTo.push("afterparty");
    visibleTo.push("admin"); // Always visible to admin

    await updateContentSection({
      ...currentSection,
      title,
      content,
      visible_to: visibleTo,
      order_index: orderIndex || currentSection.order_index,
      visible_to_friday_dinner: visibleToFridayDinner,
      visible_to_sunday_brunch: visibleToSundayBrunch,
      visible_to_main_event: visibleToMainEvent,
      visible_to_afterparty: visibleToAfterparty
    });
    
    setIsSubmitting(false);
    setIsEditDialogOpen(false);
    resetForm();
  };

  const handleEditClick = (section: ContentSection) => {
    setCurrentSection(section);
    setTitle(section.title);
    setContent(section.content);
    setVisibleToMainEvent(section.visible_to_main_event);
    setVisibleToAfterparty(section.visible_to_afterparty);
    setVisibleToFridayDinner(section.visible_to_friday_dinner || false);
    setVisibleToSundayBrunch(section.visible_to_sunday_brunch || false);
    setOrderIndex(section.order_index);
    setIsEditDialogOpen(true);
  };

  const handleDeleteContent = async (id: string) => {
    if (confirm("Are you sure you want to delete this content section?")) {
      await deleteContentSection(id);
    }
  };

  // Helper function to format section visibility for display
  const formatVisibility = (section: ContentSection) => {
    const parts = [];
    
    if (section.visible_to_main_event) {
      parts.push("Main Event");
    }
    
    if (section.visible_to_afterparty) {
      parts.push("Afterparty");
    }
    
    if (section.visible_to_friday_dinner) {
      parts.push("Friday Dinner");
    }
    
    if (section.visible_to_sunday_brunch) {
      parts.push("Sunday Brunch");
    }
    
    return parts.length > 0 ? parts.join(", ") : "None";
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Content Sections</CardTitle>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-anniversary-gold hover:bg-anniversary-gold/90 text-black">
              Add Content Section
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add Content Section</DialogTitle>
              <DialogDescription>
                Create a new content section for the event page.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">Section Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Welcome Header"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="content">Content (HTML allowed)</Label>
                <Textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="<h1>Welcome to our celebration!</h1>"
                  className="min-h-[200px]"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="order_index">Display Order</Label>
                <Input
                  id="order_index"
                  type="number"
                  value={orderIndex}
                  onChange={(e) => setOrderIndex(parseInt(e.target.value))}
                  placeholder="1"
                />
              </div>
              <div className="space-y-2 pt-4 border-t">
                <Label>Visible To:</Label>
                <div className="flex flex-col gap-2 mt-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="main-event" 
                      checked={visibleToMainEvent} 
                      onCheckedChange={(checked) => setVisibleToMainEvent(!!checked)} 
                    />
                    <label htmlFor="main-event" className="text-sm font-medium leading-none cursor-pointer">
                      Main Event
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="afterparty" 
                      checked={visibleToAfterparty} 
                      onCheckedChange={(checked) => setVisibleToAfterparty(!!checked)} 
                    />
                    <label htmlFor="afterparty" className="text-sm font-medium leading-none cursor-pointer">
                      Afterparty
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="friday-dinner" 
                      checked={visibleToFridayDinner} 
                      onCheckedChange={(checked) => setVisibleToFridayDinner(!!checked)} 
                    />
                    <label htmlFor="friday-dinner" className="text-sm font-medium leading-none cursor-pointer">
                      Friday Dinner
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="sunday-brunch" 
                      checked={visibleToSundayBrunch} 
                      onCheckedChange={(checked) => setVisibleToSundayBrunch(!!checked)} 
                    />
                    <label htmlFor="sunday-brunch" className="text-sm font-medium leading-none cursor-pointer">
                      Sunday Brunch
                    </label>
                  </div>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button onClick={handleAddContent} disabled={isSubmitting}>
                {isSubmitting ? "Adding..." : "Add Section"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <Table>
          <TableCaption>Content sections for the event page.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Order</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Visible To</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {contentSections.sort((a, b) => a.order_index - b.order_index).map((section) => (
              <TableRow key={section.id}>
                <TableCell>{section.order_index}</TableCell>
                <TableCell>{section.title}</TableCell>
                <TableCell>{formatVisibility(section)}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleEditClick(section)}>
                      Edit
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="sm" 
                      onClick={() => handleDeleteContent(section.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Content Section</DialogTitle>
              <DialogDescription>
                Update this content section.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-title">Section Title</Label>
                <Input
                  id="edit-title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-content">Content (HTML allowed)</Label>
                <Textarea
                  id="edit-content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="min-h-[200px]"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-order_index">Display Order</Label>
                <Input
                  id="edit-order_index"
                  type="number"
                  value={orderIndex}
                  onChange={(e) => setOrderIndex(parseInt(e.target.value))}
                />
              </div>
              <div className="space-y-2 pt-4 border-t">
                <Label>Visible To:</Label>
                <div className="flex flex-col gap-2 mt-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="edit-main-event" 
                      checked={visibleToMainEvent} 
                      onCheckedChange={(checked) => setVisibleToMainEvent(!!checked)} 
                    />
                    <label htmlFor="edit-main-event" className="text-sm font-medium leading-none cursor-pointer">
                      Main Event
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="edit-afterparty" 
                      checked={visibleToAfterparty} 
                      onCheckedChange={(checked) => setVisibleToAfterparty(!!checked)} 
                    />
                    <label htmlFor="edit-afterparty" className="text-sm font-medium leading-none cursor-pointer">
                      Afterparty
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="edit-friday-dinner" 
                      checked={visibleToFridayDinner} 
                      onCheckedChange={(checked) => setVisibleToFridayDinner(!!checked)} 
                    />
                    <label htmlFor="edit-friday-dinner" className="text-sm font-medium leading-none cursor-pointer">
                      Friday Dinner
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="edit-sunday-brunch" 
                      checked={visibleToSundayBrunch} 
                      onCheckedChange={(checked) => setVisibleToSundayBrunch(!!checked)} 
                    />
                    <label htmlFor="edit-sunday-brunch" className="text-sm font-medium leading-none cursor-pointer">
                      Sunday Brunch
                    </label>
                  </div>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button onClick={handleUpdateContent} disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
