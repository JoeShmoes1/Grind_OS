import { useXP } from "@/contexts/XPContext";

// XP values for different actions
export const XP_VALUES = {
  // Daily actions
  DAILY_LOGIN: 10,
  SEND_GM_MESSAGE: 5,
  COMPLETE_DAILY_RITUAL: 15,
  
  // Task related
  CREATE_TASK: 2,
  COMPLETE_TASK: 10,
  CREATE_TASK_GROUP: 5,
  
  // Content creation
  CREATE_NOTE: 3,
  CREATE_JOURNAL_ENTRY: 8,
  CREATE_VISION_BOARD: 20,
  
  // Engagement
  VISIT_NEW_ROOM: 5,
  USE_AI_ASSISTANT: 5,
  UPDATE_PROFILE: 5,
  
  // Achievements
  COMPLETE_ONBOARDING: 50,
  FIRST_TASK_COMPLETION: 25,
  FIRST_JOURNAL_ENTRY: 25,
  FIRST_VISION_BOARD: 25,
  
  // Streaks
  THREE_DAY_STREAK: 30,
  SEVEN_DAY_STREAK: 100,
  THIRTY_DAY_STREAK: 500,
};

// Hook to add XP for various actions
export const useAddXP = () => {
  const { addXP } = useXP();
  
  // Function to award XP for completing a task
  const awardTaskCompletionXP = (isFirstCompletion = false) => {
    if (isFirstCompletion) {
      addXP(XP_VALUES.FIRST_TASK_COMPLETION, "First task completion achievement");
    }
    addXP(XP_VALUES.COMPLETE_TASK, "Completed a task");
  };
  
  // Function to award XP for creating content
  const awardContentCreationXP = (contentType: 'note' | 'journal' | 'vision', isFirst = false) => {
    switch (contentType) {
      case 'note':
        addXP(XP_VALUES.CREATE_NOTE, "Created a note");
        break;
      case 'journal':
        addXP(XP_VALUES.CREATE_JOURNAL_ENTRY, "Created a journal entry");
        if (isFirst) {
          addXP(XP_VALUES.FIRST_JOURNAL_ENTRY, "First journal entry achievement");
        }
        break;
      case 'vision':
        addXP(XP_VALUES.CREATE_VISION_BOARD, "Created a vision board");
        if (isFirst) {
          addXP(XP_VALUES.FIRST_VISION_BOARD, "First vision board achievement");
        }
        break;
    }
  };
  
  // Function to award XP for daily actions
  const awardDailyActionXP = (actionType: 'login' | 'gm' | 'ritual') => {
    switch (actionType) {
      case 'login':
        addXP(XP_VALUES.DAILY_LOGIN, "Daily login");
        break;
      case 'gm':
        addXP(XP_VALUES.SEND_GM_MESSAGE, "Sent a GM message");
        break;
      case 'ritual':
        addXP(XP_VALUES.COMPLETE_DAILY_RITUAL, "Completed a daily ritual");
        break;
    }
  };
  
  // Function to award XP for streaks
  const awardStreakXP = (days: number) => {
    if (days === 3) {
      addXP(XP_VALUES.THREE_DAY_STREAK, "3-day streak achievement");
    } else if (days === 7) {
      addXP(XP_VALUES.SEVEN_DAY_STREAK, "7-day streak achievement");
    } else if (days === 30) {
      addXP(XP_VALUES.THIRTY_DAY_STREAK, "30-day streak achievement");
    }
  };
  
  // Function to award XP for onboarding completion
  const awardOnboardingXP = () => {
    addXP(XP_VALUES.COMPLETE_ONBOARDING, "Completed onboarding");
  };
  
  // Function to award XP for visiting a new room
  const awardRoomVisitXP = (roomName: string) => {
    // Check if this room has been visited before
    const visitedRooms = localStorage.getItem('visitedRooms') || '[]';
    const rooms = JSON.parse(visitedRooms) as string[];
    
    if (!rooms.includes(roomName)) {
      addXP(XP_VALUES.VISIT_NEW_ROOM, `First visit to ${roomName}`);
      
      // Update visited rooms
      rooms.push(roomName);
      localStorage.setItem('visitedRooms', JSON.stringify(rooms));
    }
  };
  
  return {
    awardTaskCompletionXP,
    awardContentCreationXP,
    awardDailyActionXP,
    awardStreakXP,
    awardOnboardingXP,
    awardRoomVisitXP,
  };
};
