
import { useState } from "react";
import { Compass, PenLine } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

export const VisionRoom = () => {
  const [visions, setVisions] = useState([
    { id: 1, title: "Travel the world", description: "Visit at least 30 countries by 35" },
    { id: 2, title: "Master programming", description: "Become proficient in 5 programming languages" },
    { id: 3, title: "Financial freedom", description: "Build passive income streams that cover living expenses" },
  ]);
  const [newVision, setNewVision] = useState("");
  const [newVisionTitle, setNewVisionTitle] = useState("");
  const { toast } = useToast();

  const handleAddVision = () => {
    if (!newVisionTitle.trim()) {
      toast({
        title: "Missing title",
        description: "Please provide a title for your vision",
        variant: "destructive",
      });
      return;
    }

    if (!newVision.trim()) {
      toast({
        title: "Missing description",
        description: "Please provide a description for your vision",
        variant: "destructive",
      });
      return;
    }

    const newVisionObj = {
      id: Date.now(),
      title: newVisionTitle,
      description: newVision,
    };

    setVisions([...visions, newVisionObj]);
    setNewVision("");
    setNewVisionTitle("");
    
    toast({
      title: "Vision added",
      description: "Your vision has been added successfully",
    });
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <Compass className="h-6 w-6 text-grindos-purple" />
        Vision Room
      </h1>
      
      <div className="mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Create New Vision</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label htmlFor="vision-title" className="block text-sm font-medium mb-1">Vision Title</label>
                <input
                  id="vision-title"
                  type="text"
                  value={newVisionTitle}
                  onChange={(e) => setNewVisionTitle(e.target.value)}
                  placeholder="Enter a title for your vision"
                  className="w-full border rounded-md p-2"
                />
              </div>
              
              <div>
                <label htmlFor="vision" className="block text-sm font-medium mb-1">Vision Description</label>
                <Textarea
                  id="vision"
                  value={newVision}
                  onChange={(e) => setNewVision(e.target.value)}
                  placeholder="Describe your vision in detail..."
                  className="min-h-[100px]"
                />
              </div>
              
              <Button 
                onClick={handleAddVision}
                className="bg-grindos-purple hover:bg-grindos-purple/90 w-full"
              >
                <PenLine className="mr-2 h-4 w-4" />
                Add Vision
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {visions.map((vision) => (
          <Card key={vision.id}>
            <CardHeader>
              <CardTitle>{vision.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{vision.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default VisionRoom;
