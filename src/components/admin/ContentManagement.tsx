
import { useState } from "react";
import { useContent } from "@/context/ContentContext";
import { ContentSection, InvitationType } from "@/types";
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
  const [visibleToFullDay, setVisibleToFullDay] = useState(true);
  const [visibleToEvening, setVisibleToEvening] = useState(true);
  const [visibleToAdmin, setVisibleToAdmin] = useState(true);
  const [order, setOrder] = useState(0);
  
  const [currentSection, setCurrentSection] = useState<ContentSection | null>(null);

  const resetForm = () => {
    setTitle("");
    setContent("");
    setVisibleToFullDay(true);
    setVisibleToEvening(true);
    setVisibleToAdmin(true);
    setOrder(0);
    setCurrentSection(null);
  };

  const handleAddContent = () => {
    const visibleTo: InvitationType[] = [];
    if (visibleToFullDay) visibleTo.push("full day");
    if (visibleToEvening) visibleTo.push("evening");
    if (visibleToAdmin) visibleTo.push("admin");

    addContentSection({
      title,
      content,
      visibleTo,
      order: order || contentSections.length + 1,
    });
    
    setIsAddDialogOpen(false);
    resetForm();
  };

  const handleUpdateContent = () => {
    if (!currentSection) return;

    const visibleTo: InvitationType[] = [];
    if (visibleToFullDay) visibleTo.push("full day");
    if (visibleToEvening) visibleTo.push("evening");
    if (visibleToAdmin) visibleTo.push("admin");

    updateContentSection({
      ...currentSection,
      title,
      content,
      visibleTo,
      order: order || currentSection.order,
    });
    
    setIsEditDialogOpen(false);
    resetForm();
  };

  const handleEditClick = (section: ContentSection) => {
    setCurrentSection(section);
    setTitle(section.title);
    setContent(section.content);
    setVisibleToFullDay(section.visibleTo.includes("full day"));
    setVisibleToEvening(section.visibleTo.includes("evening"));
    setVisibleToAdmin(section.visibleTo.includes("admin"));
    setOrder(section.order);
    setIsEditDialogOpen(true);
  };

  const handleDeleteContent = (id: string) => {
    if (confirm("Are you sure you want to delete this content section?")) {
      deleteContentSection(id);
    }
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
                <Label htmlFor="order">Display Order</Label>
                <Input
                  id="order"
                  type="number"
                  value={order}
                  onChange={(e) => setOrder(parseInt(e.target.value))}
                  placeholder="1"
                />
              </div>
              <div className="space-y-2">
                <Label>Visible To:</Label>
                <div className="flex flex-col gap-2 mt-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="fullday" 
                      checked={visibleToFullDay} 
                      onCheckedChange={(checked) => setVisibleToFullDay(!!checked)} 
                    />
                    <label htmlFor="fullday" className="text-sm font-medium leading-none cursor-pointer">
                      Full Day Guests
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="evening" 
                      checked={visibleToEvening} 
                      onCheckedChange={(checked) => setVisibleToEvening(!!checked)} 
                    />
                    <label htmlFor="evening" className="text-sm font-medium leading-none cursor-pointer">
                      Evening Only Guests
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="admin" 
                      checked={visibleToAdmin} 
                      onCheckedChange={(checked) => setVisibleToAdmin(!!checked)} 
                    />
                    <label htmlFor="admin" className="text-sm font-medium leading-none cursor-pointer">
                      Admins
                    </label>
                  </div>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddContent}>Add Section</Button>
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
            {contentSections.sort((a, b) => a.order - b.order).map((section) => (
              <TableRow key={section.id}>
                <TableCell>{section.order}</TableCell>
                <TableCell>{section.title}</TableCell>
                <TableCell>{section.visibleTo.join(", ")}</TableCell>
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
                <Label htmlFor="edit-order">Display Order</Label>
                <Input
                  id="edit-order"
                  type="number"
                  value={order}
                  onChange={(e) => setOrder(parseInt(e.target.value))}
                />
              </div>
              <div className="space-y-2">
                <Label>Visible To:</Label>
                <div className="flex flex-col gap-2 mt-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="edit-fullday" 
                      checked={visibleToFullDay} 
                      onCheckedChange={(checked) => setVisibleToFullDay(!!checked)} 
                    />
                    <label htmlFor="edit-fullday" className="text-sm font-medium leading-none cursor-pointer">
                      Full Day Guests
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="edit-evening" 
                      checked={visibleToEvening} 
                      onCheckedChange={(checked) => setVisibleToEvening(!!checked)} 
                    />
                    <label htmlFor="edit-evening" className="text-sm font-medium leading-none cursor-pointer">
                      Evening Only Guests
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="edit-admin" 
                      checked={visibleToAdmin} 
                      onCheckedChange={(checked) => setVisibleToAdmin(!!checked)} 
                    />
                    <label htmlFor="edit-admin" className="text-sm font-medium leading-none cursor-pointer">
                      Admins
                    </label>
                  </div>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleUpdateContent}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
