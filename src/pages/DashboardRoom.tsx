import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  ResponsiveContainer, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend, 
  Cell 
} from 'recharts';
import { 
  Activity, 
  CheckSquare, 
  Book, 
  Compass, 
  Calendar, 
  DollarSign, 
  RefreshCw, 
  Network, 
  Shield, 
  Bot 
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useXP } from '@/contexts/XPContext';

// Mock data for room usage
const roomUsageData = [
  { name: 'GM', value: 85, color: '#8b5cf6' },
  { name: 'Tasks', value: 92, color: '#3b82f6' },
  { name: 'Journal', value: 65, color: '#10b981' },
  { name: 'Vision', value: 45, color: '#f59e0b' },
  { name: 'Calendar', value: 78, color: '#ef4444' },
  { name: 'Cashflow', value: 60, color: '#6366f1' },
  { name: 'Reset', value: 30, color: '#ec4899' },
  { name: 'Mindmap', value: 40, color: '#14b8a6' },
  { name: 'Vault', value: 25, color: '#f97316' },
];

// Mock data for XP growth
const xpGrowthData = [
  { day: 'Mon', xp: 120 },
  { day: 'Tue', xp: 180 },
  { day: 'Wed', xp: 150 },
  { day: 'Thu', xp: 220 },
  { day: 'Fri', xp: 300 },
  { day: 'Sat', xp: 250 },
  { day: 'Sun', xp: 280 },
];

// Mock data for task completion
const taskCompletionData = [
  { month: 'Jan', completed: 45, total: 60 },
  { month: 'Feb', completed: 52, total: 70 },
  { month: 'Mar', completed: 48, total: 65 },
  { month: 'Apr', completed: 61, total: 75 },
  { month: 'May', completed: 55, total: 68 },
  { month: 'Jun', completed: 67, total: 80 },
];

// Mock AI analysis for each room
const roomAnalysis = {
  overall: "Your productivity has increased by 23% in the last month. You're spending more time in the Task Room and Journal Room, which correlates with higher XP gains. Consider using the Vision Room more frequently to align your daily tasks with long-term goals.",
  gm: "You've been consistent with morning check-ins, which has improved your daily momentum. Your morning routine starts around 7:30 AM on weekdays and 8:45 AM on weekends.",
  tasks: "Task completion rate is 78%, which is above average. You tend to complete more tasks on Tuesdays and Wednesdays. Consider breaking down larger tasks into smaller ones for better progress tracking.",
  journal: "Your journaling has become more consistent, with entries averaging 250 words. Emotional sentiment analysis shows a positive trend in the last two weeks.",
  vision: "Your vision board hasn't been updated in 3 weeks. Users who regularly update their vision boards show 35% higher goal achievement rates.",
  calendar: "You have a well-structured calendar with good balance between work and personal events. Consider adding more buffer time between meetings.",
  cashflow: "Your expense tracking is consistent, but income entries are sporadic. Setting up recurring income entries would give you a more accurate financial overview.",
  reset: "You're using the Reset Room less frequently than recommended. Regular mental resets correlate with reduced stress levels and improved focus.",
  mindmap: "Your mind maps are well-structured but could benefit from more connections between different topic clusters. Try using color coding for better visual organization.",
  vault: "Your vault usage is minimal. Consider storing important information here for quick access across devices."
};

const DashboardRoom: React.FC = () => {
  const { user } = useAuth();
  const { userXP } = useXP();
  const [selectedRoom, setSelectedRoom] = useState('overall');
  
  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Analytics and insights for your GRIND OS usage
        </p>
      </div>
      
      {/* AI Analysis Card */}
      <Card className="border-grindos-purple/20">
        <CardHeader className="bg-gradient-to-r from-grindos-purple/10 to-grindos-blue/10 pb-2">
          <div className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-grindos-purple" />
            <CardTitle>AI Analysis</CardTitle>
          </div>
          <CardDescription>
            Personalized insights based on your usage patterns
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-4">
          <Tabs defaultValue="overall" onValueChange={setSelectedRoom}>
            <TabsList className="grid grid-cols-5 mb-4">
              <TabsTrigger value="overall">Overall</TabsTrigger>
              <TabsTrigger value="gm">GM</TabsTrigger>
              <TabsTrigger value="tasks">Tasks</TabsTrigger>
              <TabsTrigger value="journal">Journal</TabsTrigger>
              <TabsTrigger value="more">More...</TabsTrigger>
            </TabsList>
            
            {/* More rooms dropdown content */}
            {selectedRoom === 'more' && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-4">
                {['vision', 'calendar', 'cashflow', 'reset', 'mindmap', 'vault'].map(room => (
                  <button 
                    key={room}
                    className="px-3 py-2 rounded-md border hover:bg-accent text-left capitalize"
                    onClick={() => setSelectedRoom(room)}
                  >
                    {room}
                  </button>
                ))}
              </div>
            )}
            
            <div className="p-4 border rounded-md bg-muted/30">
              <p className="italic text-muted-foreground">"{roomAnalysis[selectedRoom as keyof typeof roomAnalysis]}"</p>
            </div>
          </Tabs>
        </CardContent>
      </Card>
      
      {/* Charts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Room Usage Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Room Usage</CardTitle>
            <CardDescription>
              Time spent in each room (last 30 days)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={roomUsageData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {roomUsageData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        {/* XP Growth Chart */}
        <Card>
          <CardHeader>
            <CardTitle>XP Growth</CardTitle>
            <CardDescription>
              Daily XP earned (last 7 days)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={xpGrowthData}>
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="xp" 
                    stroke="#8b5cf6" 
                    strokeWidth={2} 
                    activeDot={{ r: 8 }} 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        {/* Task Completion Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Task Completion</CardTitle>
            <CardDescription>
              Monthly task completion rate
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={taskCompletionData}>
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="completed" fill="#8b5cf6" name="Completed" />
                  <Bar dataKey="total" fill="#e4e4e7" name="Total" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        {/* User Stats Card */}
        <Card>
          <CardHeader>
            <CardTitle>User Stats</CardTitle>
            <CardDescription>
              Your current progress and achievements
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="font-medium">Current Level</span>
                <span className="text-xl font-bold">{userXP.level}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Total XP</span>
                <span className="text-xl font-bold">{userXP.totalXPEarned}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Tasks Completed</span>
                <span className="text-xl font-bold">247</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Journal Entries</span>
                <span className="text-xl font-bold">32</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Days Active</span>
                <span className="text-xl font-bold">78</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardRoom;
