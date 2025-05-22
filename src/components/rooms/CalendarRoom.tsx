import { useState } from "react";
import { Calendar, Clock, Timer, ListTodo, Zap, CalendarDays, CalendarClock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

export const CalendarRoom = () => {
  const [activeTab, setActiveTab] = useState("daily");
  const [pomodoroActive, setPomodoroActive] = useState(false);
  const [pomodoroTime, setPomodoroTime] = useState(25 * 60); // 25 minutes in seconds
  
  // Mock data for calendar events
  const today = new Date();
  const dateString = today.toLocaleDateString('en-US', { 
    weekday: 'long', 
    month: 'long', 
    day: 'numeric' 
  });
  
  const timeBlocks = [
    { id: 1, time: "8:00 AM - 9:00 AM", title: "Morning Routine", category: "Personal", energy: "high" },
    { id: 2, time: "9:00 AM - 11:30 AM", title: "Deep Work: Project Alpha", category: "Work", energy: "high" },
    { id: 3, time: "11:30 AM - 12:00 PM", title: "Email Processing", category: "Work", energy: "medium" },
    { id: 4, time: "12:00 PM - 1:00 PM", title: "Lunch Break", category: "Personal", energy: "low" },
    { id: 5, time: "1:00 PM - 3:00 PM", title: "Team Meeting & Collaboration", category: "Work", energy: "medium" },
    { id: 6, time: "3:00 PM - 4:30 PM", title: "Deep Work: Project Beta", category: "Work", energy: "medium" },
    { id: 7, time: "4:30 PM - 5:00 PM", title: "Daily Review", category: "Work", energy: "low" },
    { id: 8, time: "5:00 PM - 6:00 PM", title: "Exercise", category: "Personal", energy: "high" },
  ];
  
  const weeklyEvents = [
    { id: 1, day: "Monday", events: 5, progress: 80 },
    { id: 2, day: "Tuesday", events: 4, progress: 75 },
    { id: 3, day: "Wednesday", events: 6, progress: 50 },
    { id: 4, day: "Thursday", events: 3, progress: 0 },
    { id: 5, day: "Friday", events: 4, progress: 0 },
    { id: 6, day: "Saturday", events: 2, progress: 0 },
    { id: 7, day: "Sunday", events: 1, progress: 0 },
  ];
  
  const monthlyGoals = [
    { id: 1, title: "Complete Project Alpha", progress: 65, category: "Work" },
    { id: 2, title: "Read 4 Books", progress: 50, category: "Personal" },
    { id: 3, title: "Exercise 20 Days", progress: 40, category: "Health" },
    { id: 4, title: "Launch New Website", progress: 25, category: "Business" },
  ];
  
  // Helper function to format time for pomodoro timer
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Energy level color mapping
  const energyColorMap = {
    high: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    medium: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
    low: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
  };
  
  // Category color mapping
  const categoryColorMap = {
    Work: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
    Personal: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
    Health: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    Business: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300",
  };
  
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <Calendar className="h-6 w-6 text-grindos-purple" />
        Calendar Room
      </h1>
      
      <p className="text-muted-foreground mb-6">
        Turn your schedule into a productivity powerhouse.
      </p>
      
      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <Tabs defaultValue="daily" className="space-y-4" onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-3 w-full max-w-md">
              <TabsTrigger value="daily">
                <CalendarClock className="h-4 w-4 mr-2" />
                Daily
              </TabsTrigger>
              <TabsTrigger value="weekly">
                <CalendarDays className="h-4 w-4 mr-2" />
                Weekly
              </TabsTrigger>
              <TabsTrigger value="monthly">
                <Calendar className="h-4 w-4 mr-2" />
                Monthly
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="daily" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Today's Schedule</CardTitle>
                  <CardDescription>{dateString}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {timeBlocks.map(block => (
                    <div key={block.id} className="flex items-start gap-4 p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                      <div className="w-24 text-sm text-muted-foreground">
                        {block.time}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium">{block.title}</h3>
                        <div className="flex gap-2 mt-1">
                          <Badge variant="outline" className={categoryColorMap[block.category]}>
                            {block.category}
                          </Badge>
                          <Badge variant="outline" className={energyColorMap[block.energy]}>
                            {block.energy.charAt(0).toUpperCase() + block.energy.slice(1)} Energy
                          </Badge>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon">
                        <ListTodo className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </CardContent>
                <CardFooter>
                  <Button className="w-full bg-grindos-purple hover:bg-grindos-purple/90">
                    <Zap className="mr-2 h-4 w-4" />
                    Add Time Block
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="weekly" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Weekly Overview</CardTitle>
                  <CardDescription>This Week's Progress</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {weeklyEvents.map(day => (
                    <div key={day.id} className="space-y-1">
                      <div className="flex justify-between">
                        <span className="font-medium">{day.day}</span>
                        <span className="text-sm text-muted-foreground">
                          {day.events} events
                        </span>
                      </div>
                      <Progress value={day.progress} className="h-2" />
                    </div>
                  ))}
                </CardContent>
                <CardFooter>
                  <Button className="w-full bg-grindos-purple hover:bg-grindos-purple/90">
                    <CalendarDays className="mr-2 h-4 w-4" />
                    Plan Next Week
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="monthly" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Monthly Goals</CardTitle>
                  <CardDescription>Track your progress</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {monthlyGoals.map(goal => (
                    <div key={goal.id} className="space-y-2">
                      <div className="flex justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{goal.title}</span>
                          <Badge variant="outline" className={categoryColorMap[goal.category]}>
                            {goal.category}
                          </Badge>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {goal.progress}%
                        </span>
                      </div>
                      <Progress value={goal.progress} className="h-2" />
                    </div>
                  ))}
                </CardContent>
                <CardFooter>
                  <Button className="w-full bg-grindos-purple hover:bg-grindos-purple/90">
                    <Calendar className="mr-2 h-4 w-4" />
                    Add Monthly Goal
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Pomodoro Timer</CardTitle>
              <CardDescription>Focus with time blocks</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <div className="text-5xl font-bold mb-6">{formatTime(pomodoroTime)}</div>
              <div className="flex gap-2 justify-center">
                <Button 
                  variant={pomodoroActive ? "destructive" : "default"}
                  className={!pomodoroActive ? "bg-grindos-purple hover:bg-grindos-purple/90" : ""}
                  onClick={() => setPomodoroActive(!pomodoroActive)}
                >
                  {pomodoroActive ? (
                    <>
                      <Timer className="mr-2 h-4 w-4" />
                      Stop
                    </>
                  ) : (
                    <>
                      <Timer className="mr-2 h-4 w-4" />
                      Start
                    </>
                  )}
                </Button>
                <Button variant="outline" onClick={() => setPomodoroTime(25 * 60)}>
                  <Clock className="mr-2 h-4 w-4" />
                  Reset
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                <Zap className="mr-2 h-4 w-4" />
                Block Distractions
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <ListTodo className="mr-2 h-4 w-4" />
                Import Tasks
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <CalendarDays className="mr-2 h-4 w-4" />
                Apply Template
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CalendarRoom;
