import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { PlusCircle, Pencil, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { Communication } from "@/types";
const CommunicationsManagement = () => {
  const [communications, setCommunications] = useState<Communication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentCommunication, setCurrentCommunication] = useState<Communication | null>(null);
  const {
    toast
  } = useToast();

  // Form state
  const [title, setTitle] = useState("");
  const [trigger, setTrigger] = useState("");
  const [sendDate, setSendDate] = useState("");
  const [prompt, setPrompt] = useState("");
  const [copy, setCopy] = useState("");
  const [code, setCode] = useState("");
  useEffect(() => {
    fetchCommunications();
  }, []);
  const fetchCommunications = async () => {
    try {
      setIsLoading(true);
      const {
        data,
        error
      } = await supabase.from("communications").select("*").order("send_date", {
        ascending: true
      });
      if (error) throw error;
      setCommunications(data || []);
    } catch (error) {
      console.error("Error fetching communications:", error);
      toast({
        title: "Error",
        description: "Failed to load communications",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  const resetForm = () => {
    setTitle("");
    setTrigger("");
    setSendDate("");
    setPrompt("");
    setCopy("");
    setCode("");
    setCurrentCommunication(null);
  };
  const openCreateDialog = () => {
    resetForm();
    setIsDialogOpen(true);
  };
  const openEditDialog = (communication: Communication) => {
    setCurrentCommunication(communication);
    setTitle(communication.title);
    setTrigger(communication.trigger);
    setSendDate(communication.send_date.split("T")[0]); // Format date for input
    setPrompt(communication.prompt || "");
    setCopy(communication.copy || "");
    setCode(communication.code || "");
    setIsDialogOpen(true);
  };
  const handleSubmit = async () => {
    try {
      if (!title || !trigger || !sendDate) {
        toast({
          title: "Missing fields",
          description: "Please fill in all required fields",
          variant: "destructive"
        });
        return;
      }
      if (currentCommunication) {
        // Update existing communication
        const {
          error
        } = await supabase.from("communications").update({
          title,
          trigger,
          send_date: sendDate,
          prompt,
          copy,
          code
        }).eq("id", currentCommunication.id);
        if (error) throw error;
        toast({
          title: "Success",
          description: "Communication updated successfully"
        });
      } else {
        // Create new communication
        const {
          error
        } = await supabase.from("communications").insert({
          title,
          trigger,
          send_date: sendDate,
          prompt,
          copy,
          code
        });
        if (error) throw error;
        toast({
          title: "Success",
          description: "Communication created successfully"
        });
      }
      setIsDialogOpen(false);
      resetForm();
      fetchCommunications();
    } catch (error) {
      console.error("Error saving communication:", error);
      toast({
        title: "Error",
        description: "Failed to save communication",
        variant: "destructive"
      });
    }
  };
  const handleDelete = async (id: string) => {
    try {
      const {
        error
      } = await supabase.from("communications").delete().eq("id", id);
      if (error) throw error;
      toast({
        title: "Success",
        description: "Communication deleted successfully"
      });
      fetchCommunications();
    } catch (error) {
      console.error("Error deleting communication:", error);
      toast({
        title: "Error",
        description: "Failed to delete communication",
        variant: "destructive"
      });
    }
  };
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy');
    } catch (e) {
      return dateString;
    }
  };
  return <div className="space-y-6 text-[#C9A95B]">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-din uppercase tracking-wide">Communications Management</h2>
        <Button onClick={openCreateDialog} className="bg-[#C9A95B] text-anniversary-purple hover:bg-[#C9A95B]/90">
          <PlusCircle className="mr-2" size={16} />
          New Communication
        </Button>
      </div>

      {isLoading ? <div className="flex justify-center py-8">
          <p>Loading communications...</p>
        </div> : communications.length === 0 ? <div className="text-center py-8">
          <p>No communications found. Create your first communication.</p>
        </div> : <div className="rounded-md border border-[#C9A95B]/30 overflow-hidden">
          <Table>
            <TableHeader className="bg-[#C9A95B]/10">
              <TableRow className="hover:bg-transparent border-b border-[#C9A95B]/30">
                <TableHead className="text-[#C9A95B] font-din uppercase">Title</TableHead>
                <TableHead className="text-[#C9A95B] font-din uppercase">Trigger</TableHead>
                <TableHead className="text-[#C9A95B] font-din uppercase">SEND AFTER</TableHead>
                <TableHead className="text-[#C9A95B] font-din uppercase text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {communications.map(communication => <TableRow key={communication.id} className="hover:bg-[#C9A95B]/5 border-b border-[#C9A95B]/20">
                  <TableCell className="text-white">{communication.title}</TableCell>
                  <TableCell className="text-white">{communication.trigger}</TableCell>
                  <TableCell className="text-white">{formatDate(communication.send_date)}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="ghost" size="sm" onClick={() => openEditDialog(communication)} className="text-[#C9A95B] hover:text-[#C9A95B]/80 hover:bg-[#C9A95B]/20">
                      <Pencil size={16} />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="sm" className="text-red-400 hover:text-red-500 hover:bg-red-500/10">
                          <Trash2 size={16} />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="bg-anniversary-purple border border-[#C9A95B]/30">
                        <AlertDialogHeader>
                          <AlertDialogTitle className="text-[#C9A95B]">Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription className="text-white">
                            This will permanently delete this communication.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel className="bg-transparent text-white border border-[#C9A95B]/30 hover:bg-[#C9A95B]/10">
                            Cancel
                          </AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(communication.id)} className="bg-red-500 text-white hover:bg-red-600">
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>)}
            </TableBody>
          </Table>
        </div>}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-anniversary-purple border border-[#C9A95B]/30 text-white max-w-3xl">
          <DialogHeader>
            <DialogTitle className="text-[#C9A95B] text-xl font-din uppercase">
              {currentCommunication ? "Edit Communication" : "Create Communication"}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-6 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="title" className="text-[#C9A95B]">Title*</label>
                <Input id="title" value={title} onChange={e => setTitle(e.target.value)} placeholder="Title" className="bg-anniversary-purple/50 border border-[#C9A95B]/30 text-white" />
              </div>
              <div className="space-y-2">
                <label htmlFor="trigger" className="text-[#C9A95B]">Trigger*</label>
                <Input id="trigger" value={trigger} onChange={e => setTrigger(e.target.value)} placeholder="E.g., 'One week before'" className="bg-anniversary-purple/50 border border-[#C9A95B]/30 text-white" />
              </div>
            </div>
            <div className="space-y-2">
              <label htmlFor="send-date" className="text-[#C9A95B]">Send After*</label>
              <Input id="send-date" type="date" value={sendDate} onChange={e => setSendDate(e.target.value)} className="bg-anniversary-purple/50 border border-[#C9A95B]/30 text-white" />
            </div>
            <div className="space-y-2">
              <label htmlFor="prompt" className="text-[#C9A95B]">Prompt</label>
              <Textarea id="prompt" value={prompt} onChange={e => setPrompt(e.target.value)} placeholder="Enter prompt for AI generation..." className="bg-anniversary-purple/50 border border-[#C9A95B]/30 text-white min-h-[100px]" />
            </div>
            <div className="space-y-2">
              <label htmlFor="copy" className="text-[#C9A95B]">Copy</label>
              <Textarea id="copy" value={copy} onChange={e => setCopy(e.target.value)} placeholder="Enter communication copy..." className="bg-anniversary-purple/50 border border-[#C9A95B]/30 text-white min-h-[100px]" />
            </div>
            <div className="space-y-2">
              <label htmlFor="code" className="text-[#C9A95B]">Code</label>
              <Textarea id="code" value={code} onChange={e => setCode(e.target.value)} placeholder="Enter any code for this communication..." className="bg-anniversary-purple/50 border border-[#C9A95B]/30 text-white min-h-[100px] font-mono" />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setIsDialogOpen(false)} variant="outline" className="bg-transparent text-white border border-[#C9A95B]/30 hover:bg-[#C9A95B]/10">
              Cancel
            </Button>
            <Button onClick={handleSubmit} className="bg-[#C9A95B] text-anniversary-purple hover:bg-[#C9A95B]/90">
              {currentCommunication ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>;
};
export default CommunicationsManagement;