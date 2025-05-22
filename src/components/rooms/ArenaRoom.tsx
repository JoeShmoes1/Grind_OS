import { useState } from "react";
import { Trophy, Users, Flame, Award, Target, Zap, Medal, Crown, Swords, Shield, Flag, Timer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const ArenaRoom = () => {
  const [activeTab, setActiveTab] = useState("challenges");
  
  // Mock data for arena content
  const activeChallenges = [
    { 
      id: 1, 
      title: "30-Day Meditation Streak", 
      participants: 128, 
      daysLeft: 18, 
      progress: 40,
      category: "Wellness",
      joined: true,
      leaderPosition: 5
    },
    { 
      id: 2, 
      title: "Code Every Day Challenge", 
      participants: 256, 
      daysLeft: 24, 
      progress: 20,
      category: "Skill Building",
      joined: true,
      leaderPosition: 12
    },
    { 
      id: 3, 
      title: "5K Steps Daily", 
      participants: 512, 
      daysLeft: 7, 
      progress: 70,
      category: "Fitness",
      joined: false,
      leaderPosition: null
    },
  ];
  
  const leaderboard = [
    { id: 1, name: "Alex Chen", points: 1250, rank: 1, avatar: "AC", streak: 45 },
    { id: 2, name: "Jordan Smith", points: 980, rank: 2, avatar: "JS", streak: 32 },
    { id: 3, name: "Taylor Kim", points: 875, rank: 3, avatar: "TK", streak: 28 },
    { id: 4, name: "Morgan Lee", points: 820, rank: 4, avatar: "ML", streak: 25 },
    { id: 5, name: "You", points: 790, rank: 5, avatar: "JD", streak: 21, isCurrentUser: true },
    { id: 6, name: "Casey Jones", points: 760, rank: 6, avatar: "CJ", streak: 19 },
  ];
  
  const achievements = [
    { id: 1, name: "Early Riser", description: "Complete morning routine for 7 days straight", progress: 100, icon: Flame, earned: true },
    { id: 2, name: "Focus Master", description: "Complete 10 Pomodoro sessions in a day", progress: 70, icon: Target, earned: false },
    { id: 3, name: "Bookworm", description: "Read for 30 minutes daily for 14 days", progress: 50, icon: Award, earned: false },
    { id: 4, name: "Fitness Fanatic", description: "Exercise 5 times a week for a month", progress: 25, icon: Zap, earned: false },
  ];
  
  const upcomingChallenges = [
    { id: 1, title: "Writing Challenge", startDate: "Starts in 3 days", participants: 64, category: "Creativity" },
    { id: 2, title: "No Social Media Week", startDate: "Starts in 5 days", participants: 128, category: "Digital Wellness" },
    { id: 3, title: "Learn a New Language", startDate: "Starts in 7 days", participants: 96, category: "Education" },
  ];
  
  // Helper function to get category color
  const getCategoryColor = (category) => {
    const colorMap = {
      Wellness: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
      "Skill Building": "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
      Fitness: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
      Creativity: "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300",
      "Digital Wellness": "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300",
      Education: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300",
    };
    
    return colorMap[category] || "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
  };
  
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <Swords className="h-6 w-6 text-grindos-purple" />
        Arena Room
      </h1>
      
      <p className="text-muted-foreground mb-6">
        Challenge yourself and grow with a community.
      </p>
      
      <Tabs defaultValue="challenges" className="space-y-4" onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 w-full max-w-md">
          <TabsTrigger value="challenges">
            <Flag className="h-4 w-4 mr-2" />
            Challenges
          </TabsTrigger>
          <TabsTrigger value="leaderboard">
            <Trophy className="h-4 w-4 mr-2" />
            Leaderboard
          </TabsTrigger>
          <TabsTrigger value="achievements">
            <Medal className="h-4 w-4 mr-2" />
            Achievements
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="challenges" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Active Challenges</CardTitle>
                <CardDescription>Challenges you're currently participating in</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {activeChallenges.filter(c => c.joined).map(challenge => (
                  <div key={challenge.id} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-semibold">{challenge.title}</h3>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Users className="h-4 w-4" />
                          <span>{challenge.participants} participants</span>
                        </div>
                      </div>
                      <Badge variant="outline" className={getCategoryColor(challenge.category)}>
                        {challenge.category}
                      </Badge>
                    </div>
                    
                    <div className="space-y-2 mt-4">
                      <div className="flex justify-between text-sm">
                        <span>Your progress</span>
                        <span>{challenge.progress}%</span>
                      </div>
                      <Progress value={challenge.progress} className="h-2" />
                      <div className="flex justify-between text-xs">
                        <span>{challenge.daysLeft} days left</span>
                        <span className="flex items-center gap-1">
                          <Trophy className="h-3 w-3 text-amber-500" />
                          Rank #{challenge.leaderPosition}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
              <CardFooter>
                <Button className="w-full bg-grindos-purple hover:bg-grindos-purple/90">
                  <Flag className="mr-2 h-4 w-4" />
                  Find More Challenges
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Challenges</CardTitle>
                <CardDescription>Join these challenges before they begin</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {upcomingChallenges.map(challenge => (
                  <div key={challenge.id} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-semibold">{challenge.title}</h3>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Timer className="h-4 w-4" />
                          <span>{challenge.startDate}</span>
                        </div>
                      </div>
                      <Badge variant="outline" className={getCategoryColor(challenge.category)}>
                        {challenge.category}
                      </Badge>
                    </div>
                    
                    <div className="flex justify-between items-center mt-4">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Users className="h-4 w-4" />
                        <span>{challenge.participants} joined</span>
                      </div>
                      <Button variant="outline" size="sm">
                        Join Challenge
                      </Button>
                    </div>
                  </div>
                ))}
                
                <div className="p-4 border border-dashed rounded-lg text-center">
                  <Button variant="ghost" className="w-full">
                    <Zap className="mr-2 h-4 w-4" />
                    Create Your Own Challenge
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="leaderboard" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Global Leaderboard</CardTitle>
              <CardDescription>Top performers across all challenges</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {leaderboard.map((user, index) => (
                  <div 
                    key={user.id} 
                    className={`flex items-center justify-between p-4 rounded-lg ${
                      user.isCurrentUser ? 'bg-primary/10 border border-primary/20' : 'border'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted-foreground/10">
                        {index < 3 ? (
                          <Crown className={`h-4 w-4 ${
                            index === 0 ? 'text-yellow-500' : index === 1 ? 'text-gray-400' : 'text-amber-700'
                          }`} />
                        ) : (
                          <span className="text-sm font-medium">{user.rank}</span>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarFallback>{user.avatar}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {user.streak} day streak
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Trophy className="h-4 w-4 text-amber-500" />
                      <span className="font-bold">{user.points}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full bg-grindos-purple hover:bg-grindos-purple/90">
                <Users className="mr-2 h-4 w-4" />
                View Full Leaderboard
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="achievements" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Your Achievements</CardTitle>
              <CardDescription>Badges and milestones you've earned</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2">
                {achievements.map(achievement => (
                  <div 
                    key={achievement.id} 
                    className={`p-4 border rounded-lg ${
                      achievement.earned ? 'bg-primary/10 border-primary/20' : ''
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-full ${
                        achievement.earned ? 'bg-primary/20' : 'bg-muted'
                      }`}>
                        <achievement.icon className={`h-5 w-5 ${
                          achievement.earned ? 'text-primary' : 'text-muted-foreground'
                        }`} />
                      </div>
                      <div>
                        <h3 className="font-semibold">{achievement.name}</h3>
                        <p className="text-xs text-muted-foreground mb-2">
                          {achievement.description}
                        </p>
                        {!achievement.earned && (
                          <div className="space-y-1">
                            <div className="flex justify-between text-xs">
                              <span>Progress</span>
                              <span>{achievement.progress}%</span>
                            </div>
                            <Progress value={achievement.progress} className="h-1.5" />
                          </div>
                        )}
                        {achievement.earned && (
                          <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                            Earned
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full bg-grindos-purple hover:bg-grindos-purple/90">
                <Shield className="mr-2 h-4 w-4" />
                View All Achievements
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ArenaRoom;
