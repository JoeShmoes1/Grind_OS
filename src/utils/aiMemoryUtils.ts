import { useAuth } from "@/contexts/AuthContext";

// Define memory types
export interface AIMemory {
  userId: string;
  memories: MemoryItem[];
  lastInteraction: Date;
  preferences: UserPreferences;
}

export interface MemoryItem {
  id: string;
  content: string;
  category: MemoryCategory;
  timestamp: Date;
  importance: number; // 1-10 scale
}

export interface UserPreferences {
  communicationStyle?: 'formal' | 'casual' | 'technical' | 'friendly';
  topics?: string[]; // Topics the user is interested in
  avoidTopics?: string[]; // Topics to avoid
  preferredResponseLength?: 'concise' | 'detailed' | 'comprehensive';
}

export type MemoryCategory = 
  | 'personal' 
  | 'preference' 
  | 'fact' 
  | 'interest' 
  | 'goal' 
  | 'interaction';

// Initialize memory for a user
export const initializeMemory = (userId: string): AIMemory => {
  return {
    userId,
    memories: [],
    lastInteraction: new Date(),
    preferences: {
      communicationStyle: 'friendly',
      topics: [],
      avoidTopics: [],
      preferredResponseLength: 'detailed'
    }
  };
};

// Get memory from localStorage
export const getMemory = (userId: string): AIMemory | null => {
  try {
    const memoryKey = `ai_memory_${userId}`;
    const storedMemory = localStorage.getItem(memoryKey);
    
    if (storedMemory) {
      const memory = JSON.parse(storedMemory) as AIMemory;
      // Convert string dates back to Date objects
      memory.lastInteraction = new Date(memory.lastInteraction);
      memory.memories = memory.memories.map(m => ({
        ...m,
        timestamp: new Date(m.timestamp)
      }));
      return memory;
    }
    
    return null;
  } catch (error) {
    console.error('Error retrieving AI memory:', error);
    return null;
  }
};

// Save memory to localStorage
export const saveMemory = (memory: AIMemory): void => {
  try {
    const memoryKey = `ai_memory_${memory.userId}`;
    localStorage.setItem(memoryKey, JSON.stringify(memory));
  } catch (error) {
    console.error('Error saving AI memory:', error);
  }
};

// Add a new memory
export const addMemory = (
  userId: string, 
  content: string, 
  category: MemoryCategory,
  importance: number = 5
): AIMemory => {
  const memory = getMemory(userId) || initializeMemory(userId);
  
  const newMemory: MemoryItem = {
    id: Date.now().toString(),
    content,
    category,
    timestamp: new Date(),
    importance
  };
  
  memory.memories.push(newMemory);
  memory.lastInteraction = new Date();
  
  // Limit memory size (keep most important and recent memories)
  if (memory.memories.length > 50) {
    memory.memories.sort((a, b) => {
      // Sort by importance first, then by recency
      if (a.importance !== b.importance) {
        return b.importance - a.importance;
      }
      return b.timestamp.getTime() - a.timestamp.getTime();
    });
    
    // Keep only the top 50 memories
    memory.memories = memory.memories.slice(0, 50);
  }
  
  saveMemory(memory);
  return memory;
};

// Update user preferences
export const updatePreferences = (
  userId: string,
  preferences: Partial<UserPreferences>
): AIMemory => {
  const memory = getMemory(userId) || initializeMemory(userId);
  
  memory.preferences = {
    ...memory.preferences,
    ...preferences
  };
  
  saveMemory(memory);
  return memory;
};

// Get relevant memories for a query
export const getRelevantMemories = (
  userId: string,
  query: string,
  maxResults: number = 5
): MemoryItem[] => {
  const memory = getMemory(userId);
  if (!memory) return [];
  
  // Simple keyword matching for now
  // In a real implementation, this would use embeddings or more sophisticated matching
  const keywords = query.toLowerCase().split(/\s+/);
  
  const scoredMemories = memory.memories.map(mem => {
    const content = mem.content.toLowerCase();
    let score = 0;
    
    // Score based on keyword matches
    keywords.forEach(keyword => {
      if (content.includes(keyword)) {
        score += 1;
      }
    });
    
    // Boost score based on importance
    score *= (mem.importance / 5);
    
    // Boost score for more recent memories
    const ageInDays = (new Date().getTime() - mem.timestamp.getTime()) / (1000 * 60 * 60 * 24);
    const recencyBoost = Math.max(0, 1 - (ageInDays / 30)); // Boost for memories less than 30 days old
    score *= (1 + recencyBoost);
    
    return { memory: mem, score };
  });
  
  // Sort by score and return top results
  return scoredMemories
    .sort((a, b) => b.score - a.score)
    .filter(item => item.score > 0)
    .slice(0, maxResults)
    .map(item => item.memory);
};

// Extract potential memories from user input
export const extractMemoriesFromInput = (
  userId: string,
  input: string
): void => {
  // Personal information patterns
  const personalPatterns = [
    { regex: /my name is (\w+)/i, category: 'personal', importance: 9 },
    { regex: /i am (\d+) years old/i, category: 'personal', importance: 7 },
    { regex: /i work as an? ([^.,]+)/i, category: 'personal', importance: 8 },
    { regex: /i live in ([^.,]+)/i, category: 'personal', importance: 7 }
  ];
  
  // Preference patterns
  const preferencePatterns = [
    { regex: /i (like|love|enjoy) ([^.,]+)/i, category: 'preference', importance: 6 },
    { regex: /i (hate|dislike|don't like) ([^.,]+)/i, category: 'preference', importance: 6 },
    { regex: /my favorite ([^.]+) is ([^.,]+)/i, category: 'preference', importance: 7 }
  ];
  
  // Goal patterns
  const goalPatterns = [
    { regex: /i want to ([^.,]+)/i, category: 'goal', importance: 8 },
    { regex: /i'm trying to ([^.,]+)/i, category: 'goal', importance: 7 },
    { regex: /my goal is to ([^.,]+)/i, category: 'goal', importance: 9 }
  ];
  
  // Check for personal information
  personalPatterns.forEach(pattern => {
    const match = input.match(pattern.regex);
    if (match && match[1]) {
      addMemory(
        userId, 
        `User's ${match[0].split(' ')[1]} is ${match[1]}`, 
        'personal' as MemoryCategory,
        pattern.importance
      );
    }
  });
  
  // Check for preferences
  preferencePatterns.forEach(pattern => {
    const match = input.match(pattern.regex);
    if (match && match[2]) {
      const sentiment = match[1].toLowerCase();
      const isPositive = ['like', 'love', 'enjoy', 'favorite'].includes(sentiment);
      
      addMemory(
        userId,
        `User ${isPositive ? 'likes' : 'dislikes'} ${match[2]}`,
        'preference' as MemoryCategory,
        pattern.importance
      );
    }
  });
  
  // Check for goals
  goalPatterns.forEach(pattern => {
    const match = input.match(pattern.regex);
    if (match && match[1]) {
      addMemory(
        userId,
        `User wants to ${match[1]}`,
        'goal' as MemoryCategory,
        pattern.importance
      );
    }
  });
};

// Custom hook to use AI memory
export const useAIMemory = () => {
  const { user } = useAuth();
  
  const getUserMemory = (): AIMemory | null => {
    if (!user?.email) return null;
    return getMemory(user.email) || initializeMemory(user.email);
  };
  
  const addUserMemory = (
    content: string,
    category: MemoryCategory,
    importance: number = 5
  ): void => {
    if (!user?.email) return;
    addMemory(user.email, content, category, importance);
  };
  
  const updateUserPreferences = (
    preferences: Partial<UserPreferences>
  ): void => {
    if (!user?.email) return;
    updatePreferences(user.email, preferences);
  };
  
  const getRelevantUserMemories = (
    query: string,
    maxResults: number = 5
  ): MemoryItem[] => {
    if (!user?.email) return [];
    return getRelevantMemories(user.email, query, maxResults);
  };
  
  const extractMemoriesFromUserInput = (
    input: string
  ): void => {
    if (!user?.email) return;
    extractMemoriesFromInput(user.email, input);
  };
  
  return {
    getUserMemory,
    addUserMemory,
    updateUserPreferences,
    getRelevantUserMemories,
    extractMemoriesFromUserInput
  };
};
