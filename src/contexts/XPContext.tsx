import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';

// Define the reward item interface
export interface RewardItem {
  id: string;
  name: string;
  description: string;
  cost: number;
  category: 'avatar' | 'badge' | 'theme' | 'feature';
  image?: string;
  unlocked: boolean;
}

// Define the user XP data interface
export interface UserXPData {
  currentXP: number;
  level: number;
  totalXPEarned: number;
  purchasedRewards: string[]; // Array of reward IDs
}

// Define the leaderboard entry interface
export interface LeaderboardEntry {
  userId: string;
  name: string;
  email: string;
  level: number;
  xp: number;
  avatar?: string;
}

// Define the XP context interface
interface XPContextType {
  userXP: UserXPData;
  availableRewards: RewardItem[];
  leaderboard: LeaderboardEntry[];
  addXP: (amount: number, reason?: string) => void;
  purchaseReward: (rewardId: string) => boolean;
  getXPForNextLevel: () => number;
  getXPProgress: () => number;
  refreshLeaderboard: () => void;
}

// Create the context
const XPContext = createContext<XPContextType | undefined>(undefined);

// Available rewards data
const REWARDS: RewardItem[] = [
  {
    id: 'avatar_1',
    name: 'Golden Avatar Border',
    description: 'A shiny golden border for your avatar',
    cost: 500,
    category: 'avatar',
    image: '✨',
    unlocked: false,
  },
  {
    id: 'badge_1',
    name: 'Early Adopter Badge',
    description: 'Show off that you were here from the beginning',
    cost: 300,
    category: 'badge',
    image: '🏆',
    unlocked: false,
  },
  {
    id: 'theme_1',
    name: 'Dark Mode Pro',
    description: 'Enhanced dark mode with custom accent colors',
    cost: 800,
    category: 'theme',
    image: '🌙',
    unlocked: false,
  },
  {
    id: 'feature_1',
    name: 'Custom Task Categories',
    description: 'Create your own task categories with custom colors',
    cost: 1000,
    category: 'feature',
    image: '🔧',
    unlocked: false,
  },
  {
    id: 'avatar_2',
    name: 'Animated Avatar',
    description: 'Your avatar now has subtle animations',
    cost: 1500,
    category: 'avatar',
    image: '🎭',
    unlocked: false,
  },
  {
    id: 'badge_2',
    name: 'Productivity Master',
    description: 'Badge showing your productivity expertise',
    cost: 2000,
    category: 'badge',
    image: '⚡',
    unlocked: false,
  },
];

// XP required for each level (index is level - 1)
const XP_REQUIREMENTS = [
  0,      // Level 1 (starting level)
  100,    // Level 2
  250,    // Level 3
  500,    // Level 4
  1000,   // Level 5
  1750,   // Level 6
  2750,   // Level 7
  4000,   // Level 8
  5500,   // Level 9
  7500,   // Level 10
];

// Provider component
export const XPProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [userXP, setUserXP] = useState<UserXPData>({
    currentXP: 0,
    level: 1,
    totalXPEarned: 0,
    purchasedRewards: [],
  });
  const [availableRewards, setAvailableRewards] = useState<RewardItem[]>(REWARDS);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);

  // Load user XP data from localStorage on mount
  useEffect(() => {
    if (user?.email) {
      const savedXPData = localStorage.getItem(`userXP_${user.email}`);
      if (savedXPData) {
        setUserXP(JSON.parse(savedXPData));
      } else {
        // Initialize with default values for new users
        const defaultXPData: UserXPData = {
          currentXP: 0,
          level: 1,
          totalXPEarned: 0,
          purchasedRewards: [],
        };
        setUserXP(defaultXPData);
        localStorage.setItem(`userXP_${user.email}`, JSON.stringify(defaultXPData));
      }

      // Update rewards based on purchased items
      updateRewardsStatus();
      
      // Load leaderboard data
      refreshLeaderboard();
    }
  }, [user?.email]);

  // Update rewards status based on purchased items
  const updateRewardsStatus = () => {
    const savedXPData = localStorage.getItem(`userXP_${user?.email}`);
    if (savedXPData) {
      const { purchasedRewards } = JSON.parse(savedXPData);
      
      const updatedRewards = REWARDS.map(reward => ({
        ...reward,
        unlocked: purchasedRewards.includes(reward.id),
      }));
      
      setAvailableRewards(updatedRewards);
    }
  };

  // Calculate level based on XP
  const calculateLevel = (xp: number): number => {
    for (let i = XP_REQUIREMENTS.length - 1; i >= 0; i--) {
      if (xp >= XP_REQUIREMENTS[i]) {
        return i + 1;
      }
    }
    return 1; // Default to level 1
  };

  // Add XP to the user
  const addXP = (amount: number, reason?: string) => {
    if (!user?.email || amount <= 0) return;

    setUserXP(prev => {
      const newTotalXP = prev.totalXPEarned + amount;
      const newLevel = calculateLevel(newTotalXP);
      const newXPData = {
        currentXP: newTotalXP - XP_REQUIREMENTS[newLevel - 1],
        level: newLevel,
        totalXPEarned: newTotalXP,
        purchasedRewards: prev.purchasedRewards,
      };
      
      // Save to localStorage
      localStorage.setItem(`userXP_${user.email}`, JSON.stringify(newXPData));
      
      // Update global leaderboard
      updateLeaderboardEntry(newXPData);
      
      return newXPData;
    });
  };

  // Purchase a reward with XP
  const purchaseReward = (rewardId: string): boolean => {
    if (!user?.email) return false;
    
    const reward = availableRewards.find(r => r.id === rewardId);
    if (!reward || reward.unlocked) return false;
    
    if (userXP.totalXPEarned < reward.cost) return false;
    
    setUserXP(prev => {
      const newPurchasedRewards = [...prev.purchasedRewards, rewardId];
      const newXPData = {
        ...prev,
        purchasedRewards: newPurchasedRewards,
      };
      
      // Save to localStorage
      localStorage.setItem(`userXP_${user.email}`, JSON.stringify(newXPData));
      
      return newXPData;
    });
    
    // Update reward status
    setAvailableRewards(prev => 
      prev.map(r => r.id === rewardId ? { ...r, unlocked: true } : r)
    );
    
    return true;
  };

  // Get XP required for next level
  const getXPForNextLevel = (): number => {
    if (userXP.level >= XP_REQUIREMENTS.length) {
      return XP_REQUIREMENTS[XP_REQUIREMENTS.length - 1] * 1.5; // For levels beyond our defined table
    }
    return XP_REQUIREMENTS[userXP.level];
  };

  // Get XP progress as percentage
  const getXPProgress = (): number => {
    const nextLevelXP = getXPForNextLevel();
    const currentLevelXP = XP_REQUIREMENTS[userXP.level - 1];
    const xpForCurrentLevel = userXP.totalXPEarned - currentLevelXP;
    const xpNeededForNextLevel = nextLevelXP - currentLevelXP;
    
    return Math.min(100, Math.round((xpForCurrentLevel / xpNeededForNextLevel) * 100));
  };

  // Update leaderboard entry for current user
  const updateLeaderboardEntry = (xpData: UserXPData) => {
    if (!user?.email) return;
    
    // Get existing leaderboard
    const leaderboardData = localStorage.getItem('xpLeaderboard') || '[]';
    let leaderboard: LeaderboardEntry[] = JSON.parse(leaderboardData);
    
    // Find if user already exists in leaderboard
    const existingEntryIndex = leaderboard.findIndex(entry => entry.email === user.email);
    
    const updatedEntry: LeaderboardEntry = {
      userId: user.email,
      name: user.name,
      email: user.email,
      level: xpData.level,
      xp: xpData.totalXPEarned,
      avatar: user.name.substring(0, 2).toUpperCase(),
    };
    
    if (existingEntryIndex >= 0) {
      // Update existing entry
      leaderboard[existingEntryIndex] = updatedEntry;
    } else {
      // Add new entry
      leaderboard.push(updatedEntry);
    }
    
    // Sort leaderboard by XP (descending)
    leaderboard.sort((a, b) => b.xp - a.xp);
    
    // Save updated leaderboard
    localStorage.setItem('xpLeaderboard', JSON.stringify(leaderboard));
    
    // Update state
    setLeaderboard(leaderboard);
  };

  // Refresh leaderboard data
  const refreshLeaderboard = () => {
    const leaderboardData = localStorage.getItem('xpLeaderboard') || '[]';
    const leaderboard: LeaderboardEntry[] = JSON.parse(leaderboardData);
    setLeaderboard(leaderboard);
  };

  return (
    <XPContext.Provider
      value={{
        userXP,
        availableRewards,
        leaderboard,
        addXP,
        purchaseReward,
        getXPForNextLevel,
        getXPProgress,
        refreshLeaderboard,
      }}
    >
      {children}
    </XPContext.Provider>
  );
};

// Custom hook to use the XP context
export const useXP = () => {
  const context = useContext(XPContext);
  if (context === undefined) {
    throw new Error('useXP must be used within an XPProvider');
  }
  return context;
};
