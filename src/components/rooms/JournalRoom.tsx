
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarIcon, Save } from "lucide-react";
import { format } from "date-fns";

export const JournalRoom = () => {
  const [entry, setEntry] = useState("");
  const [mood, setMood] = useState("neutral");
  const [savedEntries, setSavedEntries] = useState<any[]>([]);
  
  // Daily prompt ideas
  const prompts = [
    "What are you grateful for today?",
    "What's one thing you'd like to improve tomorrow?",
    "Describe a moment that made you smile today.",
    "What was your biggest challenge today and how did you handle it?",
    "What are you looking forward to tomorrow?",
  ];
  
  const [currentPrompt] = useState(() => {
    // Randomly select a prompt
    const randomIndex = Math.floor(Math.random() * prompts.length);
    return prompts[randomIndex];
  });
  
  const saveEntry = () => {
    if (!entry.trim()) return;
    
    const newEntry = {
      id: Date.now(),
      date: new Date(),
      content: entry,
      mood,
    };
    
    setSavedEntries([newEntry, ...savedEntries]);
    setEntry("");
    // In a real app, this would be saved to a database
  };
  
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Journal Room</h1>
      
      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Today's Entry</CardTitle>
              <CardDescription>{currentPrompt}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Textarea 
                  placeholder="Write your thoughts here..."
                  className="min-h-[200px] resize-none"
                  value={entry}
                  onChange={(e) => setEntry(e.target.value)}
                />
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium">Mood:</span>
                    <Select value={mood} onValueChange={setMood}>
                      <SelectTrigger className="w-[130px]">
                        <SelectValue placeholder="Select mood" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="happy">😊 Happy</SelectItem>
                        <SelectItem value="excited">🤩 Excited</SelectItem>
                        <SelectItem value="neutral">😐 Neutral</SelectItem>
                        <SelectItem value="anxious">😟 Anxious</SelectItem>
                        <SelectItem value="sad">😢 Sad</SelectItem>
                        <SelectItem value="angry">😠 Angry</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <Button onClick={saveEntry} disabled={!entry.trim()}>
                    <Save className="mr-2 h-4 w-4" /> Save Entry
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {savedEntries.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Recent Entries</h2>
              {savedEntries.map((savedEntry) => (
                <Card key={savedEntry.id}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">
                          {format(savedEntry.date, 'PPP')}
                        </p>
                      </div>
                      <div className="text-lg">
                        {savedEntry.mood === 'happy' && '😊'}
                        {savedEntry.mood === 'excited' && '🤩'}
                        {savedEntry.mood === 'neutral' && '😐'}
                        {savedEntry.mood === 'anxious' && '😟'}
                        {savedEntry.mood === 'sad' && '😢'}
                        {savedEntry.mood === 'angry' && '😠'}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="whitespace-pre-wrap">{savedEntry.content}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
        
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Journal Analytics</CardTitle>
              <CardDescription>Tracking your journaling habits</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium mb-1">Entries this week</h3>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-grindos-purple" 
                      style={{ width: `${Math.min(savedEntries.length * 20, 100)}%` }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {savedEntries.length}/5 entries
                  </p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium mb-1">Mood distribution</h3>
                  <div className="grid grid-cols-6 gap-1">
                    {['happy', 'excited', 'neutral', 'anxious', 'sad', 'angry'].map(m => (
                      <div 
                        key={m}
                        className={`h-10 rounded-md flex items-center justify-center text-xs ${
                          savedEntries.some(e => e.mood === m) 
                            ? 'bg-grindos-purple/20' 
                            : 'bg-muted'
                        }`}
                      >
                        {m === 'happy' && '😊'}
                        {m === 'excited' && '🤩'}
                        {m === 'neutral' && '😐'}
                        {m === 'anxious' && '😟'}
                        {m === 'sad' && '😢'}
                        {m === 'angry' && '😠'}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">View All Analytics</Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default JournalRoom;
