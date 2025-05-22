
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface Habit {
  id: string;
  name: string;
  streak: number;
  category: string;
  lastCompleted: Date | null;
  daysCompleted: string[];
}

export const RitualRoom = () => {
  const today = new Date().toISOString().split('T')[0];
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  const [habits, setHabits] = useState<Habit[]>([
    { 
      id: '1', 
      name: 'Morning Meditation', 
      streak: 5, 
      category: 'wellness',
      lastCompleted: new Date(), 
      daysCompleted: [
        '2025-05-15', 
        '2025-05-16', 
        '2025-05-17', 
        '2025-05-18', 
        today
      ] 
    },
    { 
      id: '2', 
      name: 'Read for 30 minutes', 
      streak: 3, 
      category: 'learning',
      lastCompleted: new Date(), 
      daysCompleted: [
        '2025-05-17', 
        '2025-05-18', 
        today
      ] 
    },
    { 
      id: '3', 
      name: 'Workout', 
      streak: 0, 
      category: 'fitness',
      lastCompleted: null, 
      daysCompleted: ['2025-05-15', '2025-05-16'] 
    },
  ]);
  
  const [newHabit, setNewHabit] = useState('');
  const [newCategory, setNewCategory] = useState('wellness');
  
  const handleAddHabit = () => {
    if (!newHabit.trim()) return;
    
    const habit: Habit = {
      id: Date.now().toString(),
      name: newHabit,
      streak: 0,
      category: newCategory,
      lastCompleted: null,
      daysCompleted: []
    };
    
    setHabits([...habits, habit]);
    setNewHabit('');
  };
  
  const toggleHabitCompletion = (id: string) => {
    setHabits(habits.map(habit => {
      if (habit.id === id) {
        // Check if already completed today
        const completedToday = habit.daysCompleted.includes(today);
        
        if (completedToday) {
          // Remove today from completed days
          return {
            ...habit,
            daysCompleted: habit.daysCompleted.filter(day => day !== today),
            lastCompleted: habit.daysCompleted.length > 1 
              ? new Date(habit.daysCompleted[habit.daysCompleted.length - 2]) 
              : null,
            streak: Math.max(0, habit.streak - 1)
          };
        } else {
          // Add today to completed days
          const newDaysCompleted = [...habit.daysCompleted, today].sort();
          
          // Check if this continues a streak
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          const yesterdayString = yesterday.toISOString().split('T')[0];
          
          const isStreak = habit.daysCompleted.includes(yesterdayString);
          
          return {
            ...habit,
            daysCompleted: newDaysCompleted,
            lastCompleted: new Date(),
            streak: isStreak ? habit.streak + 1 : 1
          };
        }
      }
      return habit;
    }));
  };
  
  const getCategoryColor = (category: string) => {
    switch(category) {
      case 'wellness':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300';
      case 'learning':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300';
      case 'fitness':
        return 'bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <header>
        <h1 className="text-3xl font-semibold">Ritual Room</h1>
        <p className="text-muted-foreground">Build lasting habits through consistency</p>
      </header>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <span>Your Rituals</span>
              <Badge variant="outline" className="bg-grindos-purple/10 text-grindos-purple border-grindos-purple/20">
                {habits.reduce((total, habit) => total + habit.streak, 0)} Total Streaks
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {habits.map(habit => (
              <div
                key={habit.id}
                className="p-4 rounded-lg border border-border bg-card"
              >
                <div className="flex flex-wrap gap-4 items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`h-6 w-6 rounded-full border-2 cursor-pointer flex items-center justify-center ${
                        habit.daysCompleted.includes(today)
                          ? "border-grindos-purple bg-grindos-purple/20"
                          : "border-muted"
                      }`}
                      onClick={() => toggleHabitCompletion(habit.id)}
                    >
                      {habit.daysCompleted.includes(today) && (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </div>
                    <span className="font-medium">{habit.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getCategoryColor(habit.category)}>
                      {habit.category}
                    </Badge>
                    <div className="flex items-center gap-1 bg-secondary px-2 py-1 rounded-full text-xs">
                      <span className="font-medium">{habit.streak}</span>
                      <span>streak</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-between">
                  {daysOfWeek.map((day, i) => {
                    const date = new Date();
                    date.setDate(date.getDate() - date.getDay() + i);
                    const dateStr = date.toISOString().split('T')[0];
                    const isCompleted = habit.daysCompleted.includes(dateStr);
                    const isToday = dateStr === today;
                    
                    return (
                      <div key={i} className="flex flex-col items-center">
                        <div className="text-xs text-muted-foreground mb-1">{day}</div>
                        <div 
                          className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            isCompleted 
                              ? "bg-grindos-purple text-white" 
                              : isToday 
                                ? "border-2 border-dashed border-grindos-purple" 
                                : "bg-secondary"
                          }`}
                        >
                          {isCompleted && (
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Add New Ritual</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Habit Name</label>
                  <Input
                    placeholder="E.g., Morning Meditation"
                    value={newHabit}
                    onChange={(e) => setNewHabit(e.target.value)}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Category</label>
                  <div className="flex flex-wrap gap-2">
                    {['wellness', 'learning', 'fitness'].map(category => (
                      <Badge 
                        key={category}
                        variant={newCategory === category ? "default" : "outline"}
                        className={`cursor-pointer ${
                          newCategory === category 
                            ? "bg-grindos-purple" 
                            : "hover:bg-secondary"
                        }`}
                        onClick={() => setNewCategory(category)}
                      >
                        {category}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <Button 
                  className="w-full" 
                  onClick={handleAddHabit}
                  disabled={!newHabit.trim()}
                >
                  Create Ritual
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Streak Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Current Longest Streak</span>
                  <span className="font-medium">{Math.max(...habits.map(h => h.streak), 0)} days</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Completion Rate</span>
                  <span className="font-medium">
                    {habits.length > 0
                      ? Math.round(habits.filter(h => h.daysCompleted.includes(today)).length / habits.length * 100)
                      : 0}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Rituals This Week</span>
                  <span className="font-medium">{habits.length}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
