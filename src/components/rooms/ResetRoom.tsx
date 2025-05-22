import { useState } from "react";
import { RefreshCw, Wind, Waves, Music, Moon, Timer, Heart, Sparkles, Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";

export const ResetRoom = () => {
  const [activeTab, setActiveTab] = useState("breathing");
  const [breathCount, setBreathCount] = useState(0);
  const [breathPhase, setBreathPhase] = useState("inhale"); // inhale, hold, exhale, rest
  const [breathingActive, setBreathingActive] = useState(false);
  const [volume, setVolume] = useState(70);
  const [currentMood, setCurrentMood] = useState("neutral");
  const [currentEnergy, setCurrentEnergy] = useState(50);
  
  // Mock data for reset activities
  const soundscapes = [
    { id: 1, name: "Gentle Rain", icon: Waves, duration: "∞", popular: true },
    { id: 2, name: "Forest Ambience", icon: Leaf, duration: "∞", popular: false },
    { id: 3, name: "Ocean Waves", icon: Waves, duration: "∞", popular: true },
    { id: 4, name: "Meditation Music", icon: Music, duration: "15:00", popular: false },
    { id: 5, name: "Night Sounds", icon: Moon, duration: "∞", popular: false },
    { id: 6, name: "White Noise", icon: Wind, duration: "∞", popular: true },
  ];
  
  const quickResets = [
    { id: 1, name: "Box Breathing", icon: Wind, duration: "2 min", category: "Breathing" },
    { id: 2, name: "Power Nap", icon: Moon, duration: "20 min", category: "Rest" },
    { id: 3, name: "Desk Stretches", icon: Sparkles, duration: "5 min", category: "Movement" },
    { id: 4, name: "Gratitude Journal", icon: Heart, duration: "3 min", category: "Mindfulness" },
    { id: 5, name: "Body Scan", icon: Sparkles, duration: "5 min", category: "Mindfulness" },
    { id: 6, name: "Eye Rest", icon: RefreshCw, duration: "1 min", category: "Rest" },
  ];
  
  const breathingExercises = [
    { id: 1, name: "Box Breathing", inhale: 4, hold: 4, exhale: 4, rest: 4, description: "Inhale, hold, exhale, and rest for equal counts" },
    { id: 2, name: "4-7-8 Breathing", inhale: 4, hold: 7, exhale: 8, rest: 0, description: "Calming breath to reduce anxiety and help with sleep" },
    { id: 3, name: "Energizing Breath", inhale: 1, hold: 0, exhale: 1, rest: 0, description: "Quick, rhythmic breathing to increase energy" },
    { id: 4, name: "Relaxing Breath", inhale: 4, hold: 0, exhale: 6, rest: 2, description: "Longer exhales to activate the parasympathetic system" },
  ];
  
  // Helper function to get mood emoji
  const getMoodEmoji = (mood) => {
    switch (mood) {
      case "great": return "😁";
      case "good": return "🙂";
      case "neutral": return "😐";
      case "tired": return "😴";
      case "stressed": return "😓";
      case "anxious": return "😰";
      default: return "😐";
    }
  };
  
  // Helper function to get energy color
  const getEnergyColor = (energy) => {
    if (energy < 30) return "text-red-500";
    if (energy < 70) return "text-yellow-500";
    return "text-green-500";
  };
  
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <RefreshCw className="h-6 w-6 text-grindos-purple" />
        Reset Room
      </h1>
      
      <p className="text-muted-foreground mb-6">
        Recharge your mind and body — anytime, anywhere.
      </p>
      
      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <Tabs defaultValue="breathing" className="space-y-4" onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-3 w-full max-w-md">
              <TabsTrigger value="breathing">
                <Wind className="h-4 w-4 mr-2" />
                Breathing
              </TabsTrigger>
              <TabsTrigger value="soundscapes">
                <Music className="h-4 w-4 mr-2" />
                Soundscapes
              </TabsTrigger>
              <TabsTrigger value="quick-resets">
                <Sparkles className="h-4 w-4 mr-2" />
                Quick Resets
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="breathing" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Breathing Exercises</CardTitle>
                  <CardDescription>Calm your mind with guided breathing</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {breathingExercises.map(exercise => (
                    <div key={exercise.id} className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-medium">{exercise.name}</h3>
                        <Button variant="ghost" size="sm">
                          <Timer className="h-4 w-4 mr-2" />
                          Start
                        </Button>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{exercise.description}</p>
                      <div className="flex gap-4 text-xs text-muted-foreground">
                        <div>Inhale: {exercise.inhale}s</div>
                        <div>Hold: {exercise.hold}s</div>
                        <div>Exhale: {exercise.exhale}s</div>
                        <div>Rest: {exercise.rest}s</div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="soundscapes" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Calming Soundscapes</CardTitle>
                  <CardDescription>Ambient sounds to help you focus or relax</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {soundscapes.map(sound => (
                      <div 
                        key={sound.id} 
                        className={`p-4 border rounded-lg hover:bg-muted/50 transition-colors ${
                          sound.popular ? 'border-grindos-purple/50' : ''
                        }`}
                      >
                        <div className="flex justify-between items-center mb-3">
                          <div className="flex items-center gap-2">
                            <sound.icon className="h-5 w-5 text-grindos-purple" />
                            <h3 className="font-medium">{sound.name}</h3>
                          </div>
                          <span className="text-xs text-muted-foreground">{sound.duration}</span>
                        </div>
                        <Button variant="outline" size="sm" className="w-full">
                          <Music className="h-4 w-4 mr-2" />
                          Play
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="flex-col space-y-2">
                  <div className="flex justify-between w-full">
                    <span className="text-sm">Volume</span>
                    <span className="text-sm">{volume}%</span>
                  </div>
                  <Slider
                    value={[volume]}
                    min={0}
                    max={100}
                    step={1}
                    onValueChange={(value) => setVolume(value[0])}
                  />
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="quick-resets" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Quick Reset Activities</CardTitle>
                  <CardDescription>Short activities to refresh your mind and body</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {quickResets.map(reset => (
                      <div key={reset.id} className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                        <div className="flex justify-between items-center mb-3">
                          <div className="flex items-center gap-2">
                            <reset.icon className="h-5 w-5 text-grindos-purple" />
                            <h3 className="font-medium">{reset.name}</h3>
                          </div>
                          <span className="text-xs text-muted-foreground">{reset.duration}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-muted-foreground">{reset.category}</span>
                          <Button variant="outline" size="sm">
                            <Timer className="h-4 w-4 mr-2" />
                            Start
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Current State</CardTitle>
              <CardDescription>Track your mood and energy</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Mood</span>
                  <span className="text-2xl">{getMoodEmoji(currentMood)}</span>
                </div>
                <div className="flex gap-2 justify-between">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className={currentMood === "great" ? "border-green-500" : ""}
                    onClick={() => setCurrentMood("great")}
                  >
                    😁
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className={currentMood === "good" ? "border-green-500" : ""}
                    onClick={() => setCurrentMood("good")}
                  >
                    🙂
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className={currentMood === "neutral" ? "border-yellow-500" : ""}
                    onClick={() => setCurrentMood("neutral")}
                  >
                    😐
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className={currentMood === "tired" ? "border-yellow-500" : ""}
                    onClick={() => setCurrentMood("tired")}
                  >
                    😴
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className={currentMood === "stressed" ? "border-red-500" : ""}
                    onClick={() => setCurrentMood("stressed")}
                  >
                    😓
                  </Button>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Energy Level</span>
                  <span className={`font-medium ${getEnergyColor(currentEnergy)}`}>
                    {currentEnergy}%
                  </span>
                </div>
                <Slider
                  value={[currentEnergy]}
                  min={0}
                  max={100}
                  step={5}
                  onValueChange={(value) => setCurrentEnergy(value[0])}
                  className="mb-2"
                />
                <Progress value={currentEnergy} className="h-2" />
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full bg-grindos-purple hover:bg-grindos-purple/90">
                <Heart className="mr-2 h-4 w-4" />
                Log Current State
              </Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Recommended Resets</CardTitle>
              <CardDescription>Based on your current state</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                <Wind className="mr-2 h-4 w-4 text-grindos-purple" />
                4-7-8 Breathing
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Waves className="mr-2 h-4 w-4 text-grindos-purple" />
                Ocean Waves Soundscape
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Sparkles className="mr-2 h-4 w-4 text-grindos-purple" />
                Desk Stretches
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ResetRoom;
