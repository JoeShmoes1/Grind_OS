import { useState } from "react";
import { Lock, Shield, FileText, Star, Clock, Heart, Fingerprint, Key, Eye, EyeOff, Calendar, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

export const VaultRoom = () => {
  const [activeTab, setActiveTab] = useState("core-values");
  const [isLocked, setIsLocked] = useState(false);
  const [newValue, setNewValue] = useState("");
  const [newValueDescription, setNewValueDescription] = useState("");
  
  // Mock data for vault content
  const coreValues = [
    { id: 1, value: "Integrity", description: "Always doing the right thing, even when no one is watching." },
    { id: 2, value: "Growth", description: "Continuously learning and improving myself every day." },
    { id: 3, value: "Courage", description: "Facing challenges and fears with determination." },
    { id: 4, value: "Compassion", description: "Showing kindness and empathy to others and myself." },
    { id: 5, value: "Freedom", description: "Living life on my own terms and respecting others' autonomy." },
  ];
  
  const lifeVision = {
    personal: "To live authentically and joyfully, nurturing deep connections with loved ones while maintaining balance and personal growth.",
    career: "To create work that makes a meaningful impact, using my unique skills to solve important problems while achieving financial freedom.",
    health: "To maintain vibrant physical and mental health through consistent habits, enabling me to fully experience life's adventures.",
    legacy: "To leave behind wisdom, positive influence, and resources that benefit future generations and make the world better.",
  };
  
  const futureLetters = [
    { id: 1, date: "December 31, 2025", title: "End of Year Reflection", locked: false },
    { id: 2, date: "May 15, 2026", title: "Career Milestone Check-in", locked: true },
    { id: 3, date: "January 1, 2030", title: "Decade Vision Review", locked: true },
  ];
  
  const inspirations = [
    { id: 1, quote: "We are what we repeatedly do. Excellence, then, is not an act, but a habit.", author: "Aristotle", category: "Excellence" },
    { id: 2, quote: "The only way to do great work is to love what you do.", author: "Steve Jobs", category: "Passion" },
    { id: 3, quote: "It is our choices that show what we truly are, far more than our abilities.", author: "J.K. Rowling", category: "Character" },
    { id: 4, quote: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt", category: "Vision" },
  ];
  
  // Helper function to toggle lock state
  const toggleLock = () => {
    setIsLocked(!isLocked);
  };
  
  // Helper function to add a new core value
  const addCoreValue = () => {
    if (!newValue.trim()) return;
    
    // In a real app, this would save to a database
    console.log("Adding new core value:", { value: newValue, description: newValueDescription });
    
    // Reset form
    setNewValue("");
    setNewValueDescription("");
  };
  
  // Helper function to get category color
  const getCategoryColor = (category) => {
    const colorMap = {
      Excellence: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
      Passion: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
      Character: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
      Vision: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300",
    };
    
    return colorMap[category] || "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
  };
  
  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Shield className="h-6 w-6 text-grindos-purple" />
          Vault Room
        </h1>
        
        <Button variant="outline" size="sm" onClick={toggleLock}>
          {isLocked ? (
            <>
              <Key className="mr-2 h-4 w-4" />
              Unlock Vault
            </>
          ) : (
            <>
              <Lock className="mr-2 h-4 w-4" />
              Lock Vault
            </>
          )}
        </Button>
      </div>
      
      <p className="text-muted-foreground mb-6">
        Guard your deepest aspirations and life's legacy.
      </p>
      
      {isLocked ? (
        <Card className="border-dashed border-2 p-12">
          <div className="flex flex-col items-center justify-center text-center">
            <Lock className="h-16 w-16 text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">Vault is Locked</h2>
            <p className="text-muted-foreground mb-6">
              Your personal vault is currently locked for privacy.
            </p>
            <Button onClick={toggleLock} className="bg-grindos-purple hover:bg-grindos-purple/90">
              <Key className="mr-2 h-4 w-4" />
              Unlock Vault
            </Button>
          </div>
        </Card>
      ) : (
        <Tabs defaultValue="core-values" className="space-y-4" onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-4 w-full max-w-2xl">
            <TabsTrigger value="core-values">
              <Heart className="h-4 w-4 mr-2" />
              Core Values
            </TabsTrigger>
            <TabsTrigger value="life-vision">
              <Star className="h-4 w-4 mr-2" />
              Life Vision
            </TabsTrigger>
            <TabsTrigger value="future-letters">
              <FileText className="h-4 w-4 mr-2" />
              Future Letters
            </TabsTrigger>
            <TabsTrigger value="inspiration">
              <Fingerprint className="h-4 w-4 mr-2" />
              Inspiration
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="core-values" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>My Core Values</CardTitle>
                <CardDescription>The principles that guide your decisions and actions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {coreValues.map(value => (
                  <div key={value.id} className="p-4 border rounded-lg">
                    <h3 className="text-lg font-semibold mb-1">{value.value}</h3>
                    <p className="text-muted-foreground">{value.description}</p>
                  </div>
                ))}
              </CardContent>
              <CardFooter className="flex-col space-y-4">
                <div className="w-full space-y-2">
                  <Input 
                    placeholder="New core value..." 
                    value={newValue}
                    onChange={(e) => setNewValue(e.target.value)}
                  />
                  <Textarea 
                    placeholder="Description of this value and why it matters to you..." 
                    value={newValueDescription}
                    onChange={(e) => setNewValueDescription(e.target.value)}
                  />
                </div>
                <Button 
                  onClick={addCoreValue} 
                  className="w-full bg-grindos-purple hover:bg-grindos-purple/90"
                  disabled={!newValue.trim()}
                >
                  Add Core Value
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="life-vision" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Life Vision</CardTitle>
                <CardDescription>Your ideal future across different life domains</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Heart className="h-4 w-4 text-red-500" />
                    Personal Life
                  </h3>
                  <p className="text-muted-foreground">{lifeVision.personal}</p>
                  <Button variant="outline" size="sm">
                    <FileText className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Star className="h-4 w-4 text-amber-500" />
                    Career & Purpose
                  </h3>
                  <p className="text-muted-foreground">{lifeVision.career}</p>
                  <Button variant="outline" size="sm">
                    <FileText className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Heart className="h-4 w-4 text-green-500" />
                    Health & Wellbeing
                  </h3>
                  <p className="text-muted-foreground">{lifeVision.health}</p>
                  <Button variant="outline" size="sm">
                    <FileText className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Fingerprint className="h-4 w-4 text-blue-500" />
                    Legacy & Impact
                  </h3>
                  <p className="text-muted-foreground">{lifeVision.legacy}</p>
                  <Button variant="outline" size="sm">
                    <FileText className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full bg-grindos-purple hover:bg-grindos-purple/90">
                  <ImageIcon className="mr-2 h-4 w-4" />
                  Create Vision Board
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="future-letters" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Letters to Future Self</CardTitle>
                <CardDescription>Messages to your future self for reflection and guidance</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {futureLetters.map(letter => (
                  <div key={letter.id} className="p-4 border rounded-lg flex justify-between items-center">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{letter.title}</h3>
                        {letter.locked && <Lock className="h-4 w-4 text-muted-foreground" />}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>Open on: {letter.date}</span>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" disabled={letter.locked}>
                      {letter.locked ? (
                        <>
                          <Clock className="mr-2 h-4 w-4" />
                          Waiting
                        </>
                      ) : (
                        <>
                          <Eye className="mr-2 h-4 w-4" />
                          View
                        </>
                      )}
                    </Button>
                  </div>
                ))}
              </CardContent>
              <CardFooter>
                <Button className="w-full bg-grindos-purple hover:bg-grindos-purple/90">
                  <FileText className="mr-2 h-4 w-4" />
                  Write New Letter
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="inspiration" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Inspirational Collection</CardTitle>
                <CardDescription>Quotes, ideas, and wisdom that inspire you</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {inspirations.map(quote => (
                  <div key={quote.id} className="p-4 border rounded-lg">
                    <p className="italic mb-2">"{quote.quote}"</p>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">— {quote.author}</span>
                      <Badge variant="outline" className={getCategoryColor(quote.category)}>
                        {quote.category}
                      </Badge>
                    </div>
                  </div>
                ))}
              </CardContent>
              <CardFooter>
                <Button className="w-full bg-grindos-purple hover:bg-grindos-purple/90">
                  <Star className="mr-2 h-4 w-4" />
                  Add Inspiration
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default VaultRoom;
