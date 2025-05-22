
import { useState } from "react";
import { FileText, Save, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

export const NoteRoom = () => {
  const [notes, setNotes] = useState([
    { id: 1, title: "Meeting Notes", content: "Discuss project timeline with team", date: "2025-05-15" },
    { id: 2, title: "Book Recommendations", content: "1. Atomic Habits\n2. Deep Work\n3. The Psychology of Money", date: "2025-05-14" },
    { id: 3, title: "Weekly Goals", content: "- Complete project proposal\n- Start research on new feature\n- Schedule team meeting", date: "2025-05-13" },
  ]);
  
  const [activeNote, setActiveNote] = useState(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const { toast } = useToast();
  
  const handleNewNote = () => {
    setActiveNote(null);
    setTitle("");
    setContent("");
  };
  
  const handleSaveNote = () => {
    if (!title.trim()) {
      toast({
        title: "Missing title",
        description: "Please enter a title for your note",
        variant: "destructive",
      });
      return;
    }
    
    const date = new Date().toISOString().split("T")[0];
    
    if (activeNote) {
      // Update existing note
      setNotes(notes.map(note => 
        note.id === activeNote.id 
          ? { ...note, title, content, date } 
          : note
      ));
      toast({
        title: "Note updated",
        description: "Your note has been updated successfully",
      });
    } else {
      // Create new note
      const newNote = {
        id: Date.now(),
        title,
        content,
        date,
      };
      setNotes([newNote, ...notes]);
      toast({
        title: "Note created",
        description: "Your new note has been created",
      });
    }
    
    setActiveNote(null);
    setTitle("");
    setContent("");
  };
  
  const handleEditNote = (note) => {
    setActiveNote(note);
    setTitle(note.title);
    setContent(note.content);
  };
  
  const handleDeleteNote = (id) => {
    setNotes(notes.filter(note => note.id !== id));
    
    if (activeNote && activeNote.id === id) {
      setActiveNote(null);
      setTitle("");
      setContent("");
    }
    
    toast({
      title: "Note deleted",
      description: "Your note has been deleted",
      variant: "destructive",
    });
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <FileText className="h-6 w-6 text-grindos-purple" />
        Note Room
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <div className="space-y-4">
            <Button 
              onClick={handleNewNote}
              className="w-full bg-grindos-purple hover:bg-grindos-purple/90"
            >
              Create New Note
            </Button>
            
            <div className="space-y-2">
              {notes.map((note) => (
                <Card 
                  key={note.id} 
                  className={`cursor-pointer hover:border-grindos-purple/50 transition-all ${activeNote?.id === note.id ? 'border-grindos-purple' : ''}`}
                  onClick={() => handleEditNote(note)}
                >
                  <CardContent className="py-3 px-4 flex justify-between items-center">
                    <div>
                      <h3 className="font-medium truncate">{note.title}</h3>
                      <p className="text-xs text-muted-foreground">{note.date}</p>
                    </div>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteNote(note.id);
                      }}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
        
        <div className="md:col-span-2">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>{activeNote ? "Edit Note" : "New Note"}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium mb-1">Title</label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Note title"
                  />
                </div>
                
                <div>
                  <label htmlFor="content" className="block text-sm font-medium mb-1">Content</label>
                  <Textarea
                    id="content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Write your note here..."
                    className="min-h-[300px]"
                  />
                </div>
                
                <Button 
                  onClick={handleSaveNote}
                  className="bg-grindos-purple hover:bg-grindos-purple/90"
                >
                  <Save className="mr-2 h-4 w-4" />
                  Save Note
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default NoteRoom;
