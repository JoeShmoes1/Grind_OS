import { useState } from "react";
import { Network, Lightbulb, Share2, Layers, Plus, Minus, Image, Link2, FileText, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

export const MindmapRoom = () => {
  const [activeTab, setActiveTab] = useState("workspace");
  const [zoomLevel, setZoomLevel] = useState(100);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Mock data for mindmaps
  const recentMindmaps = [
    { id: 1, title: "Project Roadmap", nodes: 24, lastEdited: "2 hours ago", tags: ["Work", "Planning"] },
    { id: 2, title: "Content Strategy", nodes: 18, lastEdited: "Yesterday", tags: ["Marketing", "Ideas"] },
    { id: 3, title: "Personal Goals", nodes: 15, lastEdited: "3 days ago", tags: ["Personal", "Goals"] },
    { id: 4, title: "Book Notes: Atomic Habits", nodes: 32, lastEdited: "1 week ago", tags: ["Learning", "Books"] },
  ];
  
  const templates = [
    { id: 1, title: "Project Planning", description: "Organize project phases, tasks, and resources", nodes: 12, category: "Work" },
    { id: 2, title: "SWOT Analysis", description: "Strengths, Weaknesses, Opportunities, Threats", nodes: 8, category: "Strategy" },
    { id: 3, title: "Content Brainstorm", description: "Generate and organize content ideas", nodes: 10, category: "Creative" },
    { id: 4, title: "Decision Tree", description: "Map out decision points and outcomes", nodes: 14, category: "Problem Solving" },
    { id: 5, title: "Learning Map", description: "Organize concepts and connections for learning", nodes: 16, category: "Education" },
    { id: 6, title: "Goal Setting", description: "Map your goals, actions, and milestones", nodes: 9, category: "Personal" },
  ];
  
  // Mock data for current mindmap nodes
  const currentMindmap = {
    title: "Project Roadmap",
    centralNode: { id: 1, text: "New Product Launch", color: "#8b5cf6" },
    nodes: [
      { id: 2, text: "Research Phase", color: "#3b82f6", parentId: 1 },
      { id: 3, text: "Market Analysis", color: "#3b82f6", parentId: 2 },
      { id: 4, text: "Competitor Research", color: "#3b82f6", parentId: 2 },
      { id: 5, text: "User Interviews", color: "#3b82f6", parentId: 2 },
      { id: 6, text: "Design Phase", color: "#10b981", parentId: 1 },
      { id: 7, text: "Wireframes", color: "#10b981", parentId: 6 },
      { id: 8, text: "Prototyping", color: "#10b981", parentId: 6 },
      { id: 9, text: "User Testing", color: "#10b981", parentId: 6 },
      { id: 10, text: "Development Phase", color: "#f59e0b", parentId: 1 },
      { id: 11, text: "Frontend", color: "#f59e0b", parentId: 10 },
      { id: 12, text: "Backend", color: "#f59e0b", parentId: 10 },
      { id: 13, text: "QA Testing", color: "#f59e0b", parentId: 10 },
      { id: 14, text: "Launch Phase", color: "#ef4444", parentId: 1 },
      { id: 15, text: "Marketing", color: "#ef4444", parentId: 14 },
      { id: 16, text: "PR Campaign", color: "#ef4444", parentId: 14 },
      { id: 17, text: "Social Media", color: "#ef4444", parentId: 14 },
    ]
  };
  
  // Helper function to get category color
  const getCategoryColor = (category) => {
    const colorMap = {
      Work: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
      Strategy: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
      Creative: "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300",
      "Problem Solving": "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300",
      Education: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
      Personal: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300",
    };
    
    return colorMap[category] || "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
  };
  
  // Helper function to get tag color
  const getTagColor = (tag) => {
    const colorMap = {
      Work: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
      Planning: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
      Marketing: "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300",
      Ideas: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300",
      Personal: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300",
      Goals: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
      Learning: "bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-300",
      Books: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
    };
    
    return colorMap[tag] || "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
  };
  
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <Network className="h-6 w-6 text-grindos-purple" />
        Mindmap Room
      </h1>
      
      <p className="text-muted-foreground mb-6">
        Unlock your creativity and strategic thinking.
      </p>
      
      <Tabs defaultValue="workspace" className="space-y-4" onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 w-full max-w-md">
          <TabsTrigger value="workspace">
            <Network className="h-4 w-4 mr-2" />
            Workspace
          </TabsTrigger>
          <TabsTrigger value="recent">
            <Layers className="h-4 w-4 mr-2" />
            Recent Maps
          </TabsTrigger>
          <TabsTrigger value="templates">
            <Lightbulb className="h-4 w-4 mr-2" />
            Templates
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="workspace" className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-semibold">{currentMindmap.title}</h2>
              <Button variant="ghost" size="icon">
                <FileText className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" onClick={() => setZoomLevel(Math.max(50, zoomLevel - 10))}>
                <Minus className="h-4 w-4" />
              </Button>
              <span className="text-sm w-16 text-center">{zoomLevel}%</span>
              <Button variant="outline" size="icon" onClick={() => setZoomLevel(Math.min(200, zoomLevel + 10))}>
                <Plus className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon">
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <Card className="min-h-[500px] relative">
            <CardContent className="p-6">
              <div className="flex justify-center items-center h-full">
                <div className="text-center p-8 border-2 border-dashed border-muted-foreground/20 rounded-lg">
                  <Network className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
                  <h3 className="text-lg font-medium mb-2">Mindmap Visualization</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    This is where the interactive mindmap would be displayed.
                    <br />
                    In a real implementation, this would be a canvas with nodes and connections.
                  </p>
                  <Button className="bg-grindos-purple hover:bg-grindos-purple/90">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Node
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Node Properties</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="space-y-1">
                  <label className="text-xs font-medium">Node Text</label>
                  <Input placeholder="Enter node text..." />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium">Node Color</label>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="w-6 h-6 p-0 bg-blue-500" />
                    <Button variant="outline" size="sm" className="w-6 h-6 p-0 bg-green-500" />
                    <Button variant="outline" size="sm" className="w-6 h-6 p-0 bg-yellow-500" />
                    <Button variant="outline" size="sm" className="w-6 h-6 p-0 bg-red-500" />
                    <Button variant="outline" size="sm" className="w-6 h-6 p-0 bg-purple-500" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Attachments</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Image className="mr-2 h-4 w-4" />
                  Add Image
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Link2 className="mr-2 h-4 w-4" />
                  Add Link
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <FileText className="mr-2 h-4 w-4" />
                  Add Note
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Child Node
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Share2 className="mr-2 h-4 w-4" />
                  Connect Nodes
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start text-red-500 hover:text-red-500">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Node
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="recent" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Recent Mindmaps</h2>
            <Input 
              placeholder="Search mindmaps..." 
              className="max-w-xs" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="grid gap-4 md:grid-cols-2">
            {recentMindmaps.map(mindmap => (
              <Card key={mindmap.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle>{mindmap.title}</CardTitle>
                  <CardDescription>Last edited {mindmap.lastEdited}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 mb-4">
                    <Network className="h-5 w-5 text-grindos-purple" />
                    <span className="text-sm text-muted-foreground">{mindmap.nodes} nodes</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {mindmap.tags.map((tag, index) => (
                      <Badge key={index} variant="outline" className={getTagColor(tag)}>
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full bg-grindos-purple hover:bg-grindos-purple/90">
                    Open Mindmap
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
          
          <div className="flex justify-center">
            <Button variant="outline" className="w-full max-w-xs">
              <Plus className="mr-2 h-4 w-4" />
              Create New Mindmap
            </Button>
          </div>
        </TabsContent>
        
        <TabsContent value="templates" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Mindmap Templates</h2>
            <Input 
              placeholder="Search templates..." 
              className="max-w-xs" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {templates.map(template => (
              <Card key={template.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle>{template.title}</CardTitle>
                    <Badge variant="outline" className={getCategoryColor(template.category)}>
                      {template.category}
                    </Badge>
                  </div>
                  <CardDescription>{template.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <Network className="h-5 w-5 text-grindos-purple" />
                    <span className="text-sm text-muted-foreground">{template.nodes} pre-built nodes</span>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full bg-grindos-purple hover:bg-grindos-purple/90">
                    Use Template
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MindmapRoom;
