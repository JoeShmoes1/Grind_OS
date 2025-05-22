
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRoomState } from "@/contexts/RoomStateContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  PlusCircle,
  MoreHorizontal,
  Trash2,
  Edit,
  GripVertical,
  CheckCircle2,
  Bell,
  BellOff,
  Calendar,
  ArrowUp,
  ArrowDown
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { Switch } from "@/components/ui/switch";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";

interface Task {
  id: string;
  title: string;
  priority: "low" | "medium" | "high";
  completed: boolean;
  groupId: string;
  dueDate?: Date;
  repeatDays?: string[]; // "monday", "tuesday", etc., or "daily"
  notifications?: boolean;
}

interface TaskGroup {
  id: string;
  name: string;
  order: number;
}

export const TaskRoom = () => {
  const { roomState, updateRoomState } = useRoomState();

  // Default empty state
  const defaultTasks: Task[] = [];
  const defaultGroups: TaskGroup[] = [
    { id: "default", name: "Default", order: 0 },
  ];

  // State for tasks and groups - initialize from room state or use empty state
  const [tasks, setTasks] = useState<Task[]>(() => {
    // If we have saved tasks in room state, use those
    if (roomState.tasks?.tasks) {
      return roomState.tasks.tasks;
    }

    // Otherwise, use empty state
    return defaultTasks;
  });

  const [groups, setGroups] = useState<TaskGroup[]>(() => {
    // If we have saved groups in room state, use those
    if (roomState.tasks?.groups) {
      return roomState.tasks.groups;
    }

    // Otherwise, use empty state
    return defaultGroups;
  });

  // State for new task and group
  const [newTask, setNewTask] = useState("");
  const [priority, setPriority] = useState<"low" | "medium" | "high">("medium");
  const [newGroupName, setNewGroupName] = useState("");
  const [isAddingGroup, setIsAddingGroup] = useState(false);

  // State for editing task
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isEditingTask, setIsEditingTask] = useState(false);
  const [editTaskTitle, setEditTaskTitle] = useState("");
  const [editTaskPriority, setEditTaskPriority] = useState<"low" | "medium" | "high">("medium");
  const [editTaskDueDate, setEditTaskDueDate] = useState<Date | undefined>(undefined);
  const [editTaskRepeatDays, setEditTaskRepeatDays] = useState<string[]>([]);
  const [editTaskNotifications, setEditTaskNotifications] = useState(false);

  // State for editing group
  const [editingGroup, setEditingGroup] = useState<TaskGroup | null>(null);
  const [isEditingGroup, setIsEditingGroup] = useState(false);
  const [editGroupName, setEditGroupName] = useState("");

  // State for drag and drop
  const [draggedTask, setDraggedTask] = useState<string | null>(null);
  const [dragOverGroup, setDragOverGroup] = useState<string | null>(null);

  // Add a new task
  const handleAddTask = () => {
    if (!newTask.trim()) return;

    const task: Task = {
      id: Date.now().toString(),
      title: newTask,
      priority: priority,
      completed: false,
      groupId: "default", // All new tasks go to the default group
      repeatDays: [],
      notifications: false
    };

    setTasks([...tasks, task]);
    setNewTask("");

    toast({
      title: "Task added",
      description: "New task has been added to the Default group",
    });
  };

  // Add a new group
  const handleAddGroup = () => {
    if (!newGroupName.trim()) return;

    // Get the highest order value and add 1
    const maxOrder = Math.max(...groups.map(g => g.order), 0);

    const group: TaskGroup = {
      id: Date.now().toString(),
      name: newGroupName,
      order: maxOrder + 1
    };

    setGroups([...groups, group]);
    setNewGroupName("");
    setIsAddingGroup(false);

    toast({
      title: "Group created",
      description: `New group "${newGroupName}" has been created`,
    });
  };

  // Open task edit dialog
  const openTaskEditDialog = (task: Task) => {
    setEditingTask(task);
    setEditTaskTitle(task.title);
    setEditTaskPriority(task.priority);
    setEditTaskDueDate(task.dueDate);
    setEditTaskRepeatDays(task.repeatDays || []);
    setEditTaskNotifications(task.notifications || false);
    setIsEditingTask(true);
  };

  // Save edited task
  const saveEditedTask = () => {
    if (!editingTask || !editTaskTitle.trim()) return;

    setTasks(tasks.map(task =>
      task.id === editingTask.id
        ? {
            ...task,
            title: editTaskTitle,
            priority: editTaskPriority,
            dueDate: editTaskDueDate,
            repeatDays: editTaskRepeatDays,
            notifications: editTaskNotifications
          }
        : task
    ));

    setIsEditingTask(false);

    toast({
      title: "Task updated",
      description: `"${editTaskTitle}" has been updated`,
    });
  };

  // Open group edit dialog
  const openGroupEditDialog = (group: TaskGroup) => {
    setEditingGroup(group);
    setEditGroupName(group.name);
    setIsEditingGroup(true);
  };

  // Save edited group
  const saveEditedGroup = () => {
    if (!editingGroup || !editGroupName.trim()) return;

    setGroups(groups.map(group =>
      group.id === editingGroup.id
        ? { ...group, name: editGroupName }
        : group
    ));

    setIsEditingGroup(false);

    toast({
      title: "Group updated",
      description: `Group renamed to "${editGroupName}"`,
    });
  };

  // Move group up in order
  const moveGroupUp = (id: string) => {
    const group = groups.find(g => g.id === id);
    if (!group || group.order === 0) return;

    const groupAbove = groups.find(g => g.order === group.order - 1);
    if (!groupAbove) return;

    setGroups(groups.map(g => {
      if (g.id === id) {
        return { ...g, order: g.order - 1 };
      } else if (g.id === groupAbove.id) {
        return { ...g, order: g.order + 1 };
      }
      return g;
    }));
  };

  // Move group down in order
  const moveGroupDown = (id: string) => {
    const group = groups.find(g => g.id === id);
    if (!group) return;

    const maxOrder = Math.max(...groups.map(g => g.order));
    if (group.order === maxOrder) return;

    const groupBelow = groups.find(g => g.order === group.order + 1);
    if (!groupBelow) return;

    setGroups(groups.map(g => {
      if (g.id === id) {
        return { ...g, order: g.order + 1 };
      } else if (g.id === groupBelow.id) {
        return { ...g, order: g.order - 1 };
      }
      return g;
    }));
  };

  // Complete a task
  const completeTask = (id: string) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, completed: true } : task
    ));

    const taskTitle = tasks.find(task => task.id === id)?.title;

    toast({
      title: "Task completed",
      description: `"${taskTitle}" has been marked as complete`,
    });
  };

  // Toggle task completion
  const toggleTaskCompletion = (id: string) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  // Toggle repeat day for task
  const toggleRepeatDay = (day: string) => {
    if (editTaskRepeatDays.includes(day)) {
      // If "daily" is being removed, remove it
      if (day === "daily") {
        setEditTaskRepeatDays(editTaskRepeatDays.filter(d => d !== day));
      }
      // If a specific day is being removed, remove it
      else {
        setEditTaskRepeatDays(editTaskRepeatDays.filter(d => d !== day));
      }
    } else {
      // If "daily" is being added, remove all other days and add only "daily"
      if (day === "daily") {
        setEditTaskRepeatDays(["daily"]);
      }
      // If a specific day is being added and "daily" is already selected, remove "daily" and add the specific day
      else if (editTaskRepeatDays.includes("daily")) {
        setEditTaskRepeatDays([day]);
      }
      // Otherwise just add the day
      else {
        setEditTaskRepeatDays([...editTaskRepeatDays, day]);
      }
    }
  };

  // Delete a task
  const deleteTask = (id: string) => {
    const taskTitle = tasks.find(task => task.id === id)?.title;

    setTasks(tasks.filter(task => task.id !== id));

    toast({
      title: "Task deleted",
      description: `"${taskTitle}" has been deleted`,
      variant: "destructive",
    });
  };

  // Delete a group and its tasks
  const deleteGroup = (id: string) => {
    // Don't allow deleting the default group
    if (id === "default") return;

    const groupName = groups.find(group => group.id === id)?.name;
    const groupTasksCount = tasks.filter(task => task.groupId === id).length;

    // Move all tasks from this group to the default group
    setTasks(tasks.map(task =>
      task.groupId === id ? { ...task, groupId: "default" } : task
    ));

    // Remove the group
    setGroups(groups.filter(group => group.id !== id));

    // Reorder remaining groups
    const remainingGroups = groups.filter(group => group.id !== id);
    const updatedGroups = remainingGroups.map((group, index) => ({
      ...group,
      order: index
    }));

    setGroups(updatedGroups);

    toast({
      title: "Group deleted",
      description: `"${groupName}" has been deleted. ${groupTasksCount} tasks moved to Default group.`,
    });
  };

  // Handle drag start
  const handleDragStart = (taskId: string) => {
    setDraggedTask(taskId);
  };

  // Handle drag over
  const handleDragOver = (e: React.DragEvent, groupId: string) => {
    e.preventDefault();
    setDragOverGroup(groupId);
  };

  // Handle drop
  const handleDrop = (e: React.DragEvent, groupId: string) => {
    e.preventDefault();

    if (draggedTask) {
      const task = tasks.find(t => t.id === draggedTask);
      const targetGroup = groups.find(g => g.id === groupId);

      if (task && targetGroup && task.groupId !== groupId) {
        // Move the task to the new group
        setTasks(tasks.map(t =>
          t.id === draggedTask ? { ...t, groupId: groupId } : t
        ));

        toast({
          title: "Task moved",
          description: `"${task.title}" moved to "${targetGroup.name}" group`,
        });
      }

      // Reset drag state
      setDraggedTask(null);
      setDragOverGroup(null);
    }
  };

  // Handle drag end
  const handleDragEnd = () => {
    setDraggedTask(null);
    setDragOverGroup(null);
  };

  // Get priority badge class
  const getPriorityBadgeClass = (priority: string) => {
    switch(priority) {
      case "high":
        return "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300";
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-300";
      case "low":
        return "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  // Save tasks and groups to room state when they change
  useEffect(() => {
    updateRoomState('tasks', {
      tasks,
      groups
    });
  }, [tasks, groups, updateRoomState]);

  // Sort groups by order
  const sortedGroups = [...groups].sort((a, b) => a.order - b.order);

  return (
    <div className="space-y-6 animate-fade-in">
      <header>
        <h1 className="text-3xl font-semibold">Task Room</h1>
        <p className="text-muted-foreground">Manage your tasks and priorities</p>
      </header>

      {/* Task Input */}
      <div className="bg-card rounded-xl border border-border p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-2">
          <Input
            className="flex-1"
            placeholder="Add a new task..."
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAddTask()}
            data-tour="task-input"
          />
          <Select value={priority} onValueChange={(val: "low" | "medium" | "high") => setPriority(val)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Low Priority</SelectItem>
              <SelectItem value="medium">Medium Priority</SelectItem>
              <SelectItem value="high">High Priority</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={handleAddTask} data-tour="add-button">Add Task</Button>
        </div>
      </div>

      {/* Group Management */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex space-x-4">
          <h2 className="text-xl font-semibold">Task Groups</h2>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" data-tour="tasks-button">Tasks</Button>
            <Button variant="outline" size="sm" data-tour="groups-button">Groups</Button>
          </div>
        </div>
        <Button onClick={() => setIsAddingGroup(true)} data-tour="add-button">
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Group
        </Button>
      </div>

      {/* All Groups - Vertical Layout */}
      <div className="space-y-4">
        {sortedGroups.map(group => {
          const groupTasks = tasks.filter(task => task.groupId === group.id);

          return (
            <div
              key={group.id}
              className="border rounded-lg p-4 bg-card"
              onDragOver={(e) => handleDragOver(e, group.id)}
              onDrop={(e) => handleDrop(e, group.id)}
              style={{
                backgroundColor: dragOverGroup === group.id ? 'rgba(147, 51, 234, 0.1)' : undefined,
                borderColor: dragOverGroup === group.id ? 'rgb(147, 51, 234)' : undefined
              }}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-medium text-lg">{group.name}</h3>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">{groupTasks.length} tasks</span>

                  {/* Group position controls */}
                  {group.id !== "default" && (
                    <>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => moveGroupUp(group.id)}
                        disabled={group.order === 0}
                        className="h-8 w-8 p-0"
                      >
                        <ArrowUp className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => moveGroupDown(group.id)}
                        disabled={group.order === Math.max(...groups.map(g => g.order))}
                        className="h-8 w-8 p-0"
                      >
                        <ArrowDown className="h-4 w-4" />
                      </Button>
                    </>
                  )}

                  {/* Group edit menu */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => openGroupEditDialog(group)}>
                        <Edit className="mr-2 h-4 w-4" />
                        <span>Edit Group</span>
                      </DropdownMenuItem>
                      {group.id !== "default" && (
                        <DropdownMenuItem
                          onClick={() => deleteGroup(group.id)}
                          className="text-red-500 focus:text-red-500"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          <span>Delete Group</span>
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              <div className="space-y-2 max-h-[300px] overflow-y-auto">
                {groupTasks.length === 0 ? (
                  <div className="text-center py-4 text-muted-foreground text-sm border border-dashed rounded-lg">
                    No tasks in this group
                  </div>
                ) : (
                  groupTasks.map(task => (
                    <div
                      key={task.id}
                      className={`flex items-center gap-2 p-3 rounded-lg border ${
                        task.completed ? "bg-muted/50" : "bg-card"
                      }`}
                      draggable
                      onDragStart={() => handleDragStart(task.id)}
                      onDragEnd={handleDragEnd}
                    >
                      <div className="cursor-move text-muted-foreground">
                        <GripVertical size={16} />
                      </div>
                      <div
                        className={`h-5 w-5 rounded-full border-2 cursor-pointer flex items-center justify-center ${
                          task.completed
                            ? "border-grindos-purple bg-grindos-purple/20"
                            : "border-muted"
                        }`}
                        onClick={() => toggleTaskCompletion(task.id)}
                      >
                        {task.completed && (
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        )}
                      </div>
                      <div className="flex-1">
                        <span className={`text-sm ${task.completed ? "line-through text-muted-foreground" : ""}`}>
                          {task.title}
                        </span>

                        {/* Show task details if available */}
                        {(task.dueDate || (task.repeatDays && task.repeatDays.length > 0)) && (
                          <div className="flex gap-2 mt-1 text-xs text-muted-foreground">
                            {task.dueDate && (
                              <div className="flex items-center">
                                <Calendar className="h-3 w-3 mr-1" />
                                {format(task.dueDate, "MMM d, yyyy")}
                              </div>
                            )}
                            {task.repeatDays && task.repeatDays.length > 0 && (
                              <div className="flex items-center">
                                {task.repeatDays.includes("daily") ? "Daily" : task.repeatDays.map(day => day.slice(0, 3)).join(", ")}
                              </div>
                            )}
                            {task.notifications && (
                              <Bell className="h-3 w-3" />
                            )}
                          </div>
                        )}
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-xs ${getPriorityBadgeClass(task.priority)}`}>
                        {task.priority}
                      </span>

                      {!task.completed && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 px-2 text-green-600 border-green-200 hover:bg-green-50 hover:text-green-700"
                          onClick={() => completeTask(task.id)}
                        >
                          <CheckCircle2 className="h-4 w-4 mr-1" />
                          <span className="text-xs">Done</span>
                        </Button>
                      )}

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => openTaskEditDialog(task)}>
                            <Edit className="mr-2 h-4 w-4" />
                            <span>Edit Task</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => deleteTask(task.id)}
                            className="text-red-500 focus:text-red-500"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            <span>Delete</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Group Dialog */}
      <Dialog open={isAddingGroup} onOpenChange={setIsAddingGroup}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Group</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="group-name" className="mb-2 block">Group Name</Label>
            <Input
              id="group-name"
              value={newGroupName}
              onChange={(e) => setNewGroupName(e.target.value)}
              placeholder="Enter group name..."
              className="w-full"
              onKeyDown={(e) => e.key === "Enter" && handleAddGroup()}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddingGroup(false)}>Cancel</Button>
            <Button onClick={handleAddGroup}>Add Group</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Task Dialog */}
      <Dialog open={isEditingTask} onOpenChange={setIsEditingTask}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-4">
            {/* Task Title */}
            <div>
              <Label htmlFor="task-title" className="mb-2 block">Task Title</Label>
              <Input
                id="task-title"
                value={editTaskTitle}
                onChange={(e) => setEditTaskTitle(e.target.value)}
                placeholder="Enter task title..."
                className="w-full"
              />
            </div>

            {/* Task Priority */}
            <div>
              <Label htmlFor="task-priority" className="mb-2 block">Priority</Label>
              <Select value={editTaskPriority} onValueChange={(val: "low" | "medium" | "high") => setEditTaskPriority(val)}>
                <SelectTrigger id="task-priority" className="w-full">
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low Priority</SelectItem>
                  <SelectItem value="medium">Medium Priority</SelectItem>
                  <SelectItem value="high">High Priority</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Due Date */}
            <div>
              <Label className="mb-2 block">Due Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    {editTaskDueDate ? format(editTaskDueDate, "PPP") : "Select a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <CalendarComponent
                    mode="single"
                    selected={editTaskDueDate}
                    onSelect={setEditTaskDueDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              {editTaskDueDate && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="mt-2"
                  onClick={() => setEditTaskDueDate(undefined)}
                >
                  Clear date
                </Button>
              )}
            </div>

            {/* Repeat Days */}
            <div>
              <Label className="mb-2 block">Repeat</Label>
              <div className="grid grid-cols-4 gap-2">
                <Button
                  type="button"
                  variant={editTaskRepeatDays.includes("daily") ? "default" : "outline"}
                  size="sm"
                  onClick={() => toggleRepeatDay("daily")}
                  className="w-full"
                >
                  Daily
                </Button>
                {["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"].map((day) => (
                  <Button
                    key={day}
                    type="button"
                    variant={editTaskRepeatDays.includes(day) ? "default" : "outline"}
                    size="sm"
                    onClick={() => toggleRepeatDay(day)}
                    className="w-full"
                    disabled={editTaskRepeatDays.includes("daily")}
                  >
                    {day.slice(0, 3)}
                  </Button>
                ))}
              </div>
            </div>

            {/* Notifications */}
            <div className="flex items-center justify-between">
              <Label htmlFor="notifications" className="mb-0">Notifications</Label>
              <Switch
                id="notifications"
                checked={editTaskNotifications}
                onCheckedChange={setEditTaskNotifications}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditingTask(false)}>Cancel</Button>
            <Button onClick={saveEditedTask}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Group Dialog */}
      <Dialog open={isEditingGroup} onOpenChange={setIsEditingGroup}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Group</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="edit-group-name" className="mb-2 block">Group Name</Label>
            <Input
              id="edit-group-name"
              value={editGroupName}
              onChange={(e) => setEditGroupName(e.target.value)}
              placeholder="Enter group name..."
              className="w-full"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditingGroup(false)}>Cancel</Button>
            <Button onClick={saveEditedGroup}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
