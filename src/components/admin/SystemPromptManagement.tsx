
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "@/components/ui/sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

// Define the SystemPrompt type
interface SystemPrompt {
  id: string;
  name: string;
  prompt_text: string;
  created_at: string;
  updated_at: string;
}

// Schema for form validation
const promptSchema = z.object({
  name: z.string().min(1, "Name is required"),
  prompt_text: z.string().min(10, "Prompt text should be at least 10 characters"),
});

type PromptFormValues = z.infer<typeof promptSchema>;

const SystemPromptManagement = () => {
  const [prompts, setPrompts] = useState<SystemPrompt[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPrompt, setCurrentPrompt] = useState<SystemPrompt | null>(null);

  const form = useForm<PromptFormValues>({
    resolver: zodResolver(promptSchema),
    defaultValues: {
      name: "",
      prompt_text: "",
    },
  });

  const fetchPrompts = async () => {
    try {
      const { data, error } = await supabase
        .from("system_prompts")
        .select("*")
        .order("name");
      
      if (error) throw error;
      setPrompts(data || []);
    } catch (error) {
      console.error("Error fetching system prompts:", error);
      toast.error("Failed to load system prompts");
    }
  };

  useEffect(() => {
    fetchPrompts();
  }, []);

  const handleOpenDialog = (prompt?: SystemPrompt) => {
    if (prompt) {
      setCurrentPrompt(prompt);
      form.reset({
        name: prompt.name,
        prompt_text: prompt.prompt_text,
      });
    } else {
      setCurrentPrompt(null);
      form.reset({
        name: "",
        prompt_text: "",
      });
    }
    setIsOpen(true);
  };

  const onSubmit = async (values: PromptFormValues) => {
    setIsLoading(true);

    try {
      if (currentPrompt) {
        // Update existing prompt
        const { error } = await supabase
          .from("system_prompts")
          .update({
            name: values.name,
            prompt_text: values.prompt_text,
          })
          .eq("id", currentPrompt.id);
        
        if (error) throw error;
        toast.success("System prompt updated successfully");
      } else {
        // Create new prompt
        const { error } = await supabase
          .from("system_prompts")
          .insert({
            name: values.name,
            prompt_text: values.prompt_text,
          });
        
        if (error) throw error;
        toast.success("System prompt created successfully");
      }

      setIsOpen(false);
      fetchPrompts();
    } catch (error) {
      console.error("Error saving system prompt:", error);
      toast.error("Failed to save system prompt");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeletePrompt = async (id: string) => {
    if (!confirm("Are you sure you want to delete this system prompt?")) return;

    try {
      const { error } = await supabase
        .from("system_prompts")
        .delete()
        .eq("id", id);
      
      if (error) throw error;
      toast.success("System prompt deleted successfully");
      fetchPrompts();
    } catch (error) {
      console.error("Error deleting system prompt:", error);
      toast.error("Failed to delete system prompt");
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>System Prompts</CardTitle>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenDialog()}>
              <Plus className="mr-2 h-4 w-4" />
              Add New Prompt
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {currentPrompt ? "Edit System Prompt" : "Create New System Prompt"}
              </DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter prompt name..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="prompt_text"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Prompt Text</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Enter the prompt instructions..." 
                          className="min-h-[200px]" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Saving..." : currentPrompt ? "Update" : "Create"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {prompts.length === 0 ? (
          <p className="text-center py-4 text-muted-foreground">No system prompts found.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Prompt Text</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {prompts.map((prompt) => (
                <TableRow key={prompt.id}>
                  <TableCell className="font-medium">{prompt.name}</TableCell>
                  <TableCell className="max-w-md truncate">
                    {prompt.prompt_text.length > 100 
                      ? prompt.prompt_text.substring(0, 100) + "..." 
                      : prompt.prompt_text}
                  </TableCell>
                  <TableCell>{format(new Date(prompt.updated_at), "MMM d, yyyy")}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleOpenDialog(prompt)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeletePrompt(prompt.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

export default SystemPromptManagement;
