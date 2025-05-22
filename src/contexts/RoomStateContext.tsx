import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';

// Define the shape of room state
export interface RoomState {
  // AI Assistant Room
  aiAssistant?: {
    messages: Array<{
      id: string;
      content: string;
      sender: 'user' | 'ai';
      timestamp: string; // Store as ISO string
      type?: string;
    }>;
    responseStyle: 'concise' | 'detailed' | 'comprehensive';
    confusingQuestions: number;
    aiMemory?: {
      topics: string[];
      userPreferences: Record<string, string>;
      frustrationLevel: number;
      hasApologized: boolean;
      lastQuestions: string[];
    };
  };

  // Task Room
  tasks?: {
    tasks: Array<{
      id: string;
      title: string;
      priority: "low" | "medium" | "high";
      completed: boolean;
      groupId: string;
      dueDate?: Date;
      repeatDays?: string[];
      notifications?: boolean;
    }>;
    groups: Array<{
      id: string;
      name: string;
      order: number;
    }>;
    activeGroup?: string;
    view?: 'tasks' | 'groups';
  };

  // Journal Room
  journal?: {
    entries: Array<{
      id: string;
      date: string;
      content: string;
      mood?: string;
      tags?: string[];
    }>;
    currentEntry?: string;
    filter?: string;
  };

  // Vision Room
  vision?: {
    boards: Array<{
      id: string;
      name: string;
      items: Array<{
        id: string;
        type: 'image' | 'text' | 'goal';
        content: string;
        position: { x: number; y: number };
      }>;
    }>;
    activeBoard: string;
  };

  // Note Room
  notes?: {
    notes: Array<{
      id: string;
      title: string;
      content: string;
      lastEdited: string;
      tags?: string[];
    }>;
    activeNote?: string;
    filter?: string;
  };

  // Calendar Room
  calendar?: {
    events: Array<{
      id: string;
      title: string;
      start: string;
      end: string;
      allDay: boolean;
      category?: string;
    }>;
    view: 'month' | 'week' | 'day' | 'agenda';
    selectedDate: string;
  };

  // Cashflow Room
  cashflow?: {
    transactions: Array<{
      id: string;
      date: string;
      amount: number;
      category: string;
      description: string;
      type: 'income' | 'expense';
    }>;
    view: 'transactions' | 'reports';
    filter?: string;
  };

  // Reset Room
  reset?: {
    routines: Array<{
      id: string;
      name: string;
      steps: string[];
      duration: number;
    }>;
    activeRoutine?: string;
  };

  // Mindmap Room
  mindmap?: {
    maps: Array<{
      id: string;
      name: string;
      nodes: Array<{
        id: string;
        text: string;
        position: { x: number; y: number };
        connections: string[];
      }>;
    }>;
    activeMap: string;
  };

  // Vault Room
  vault?: {
    items: Array<{
      id: string;
      title: string;
      content: string;
      category: string;
      tags?: string[];
    }>;
    activeCategory: string;
  };

  // GM Room
  gm?: {
    messages: Array<{
      id: string;
      content: string;
      sender: string;
      timestamp: string;
    }>;
    dailyGoals: string[];
    mood?: string;
  };

  // Arena Room
  arena?: {
    challenges: Array<{
      id: string;
      title: string;
      description: string;
      difficulty: 'easy' | 'medium' | 'hard';
      completed: boolean;
    }>;
    activeChallenge?: string;
  };
}

// Create the context
interface RoomStateContextType {
  roomState: RoomState;
  updateRoomState: <K extends keyof RoomState>(
    room: K,
    state: Partial<RoomState[K]>
  ) => void;
  resetRoomState: (room: keyof RoomState) => void;
}

const RoomStateContext = createContext<RoomStateContextType | undefined>(undefined);

// Provider component
interface RoomStateProviderProps {
  children: ReactNode;
}

export const RoomStateProvider: React.FC<RoomStateProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const [roomState, setRoomState] = useState<RoomState>({});
  const [isInitialized, setIsInitialized] = useState(false);

  // Load room state from localStorage on mount or when user changes
  useEffect(() => {
    if (user?.email) {
      try {
        const savedState = localStorage.getItem(`roomState_${user.email}`);
        if (savedState) {
          setRoomState(JSON.parse(savedState));
        }
      } catch (error) {
        console.error('Error loading room state:', error);
      }

      setIsInitialized(true);
    } else {
      // Reset state when user is logged out
      setRoomState({});
      setIsInitialized(true);
    }
  }, [user?.email]);

  // Update room state
  const updateRoomState = <K extends keyof RoomState>(
    room: K,
    state: Partial<RoomState[K]>
  ) => {
    setRoomState(prevState => {
      // Create a new state object with the updated room state
      const newState = {
        ...prevState,
        [room]: {
          ...prevState[room],
          ...state
        }
      };

      // Save to localStorage if user is logged in
      if (user?.email) {
        localStorage.setItem(`roomState_${user.email}`, JSON.stringify(newState));
      }

      return newState;
    });
  };

  // Reset a specific room's state to empty/default
  const resetRoomState = (room: keyof RoomState) => {
    setRoomState(prevState => {
      // Create a new state object without the specified room
      const { [room]: _, ...rest } = prevState;

      // Save to localStorage if user is logged in
      if (user?.email) {
        localStorage.setItem(`roomState_${user.email}`, JSON.stringify(rest));
      }

      return rest;
    });
  };

  // Only render children once state is loaded
  if (!isInitialized && user?.email) {
    return null; // Or a loading spinner
  }

  return (
    <RoomStateContext.Provider value={{ roomState, updateRoomState, resetRoomState, isInitialized }}>
      {children}
    </RoomStateContext.Provider>
  );
};

// Custom hook for using the room state context
export const useRoomState = () => {
  const context = useContext(RoomStateContext);
  if (context === undefined) {
    throw new Error('useRoomState must be used within a RoomStateProvider');
  }
  return context;
};
