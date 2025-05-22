import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';

// Define the shape of our settings
interface Settings {
  // Appearance settings
  theme: 'light' | 'dark' | 'system';
  accentColor: string;
  fontSize: number;
  layoutDensity: 'cozy' | 'compact';
  backgroundStyle: 'minimal' | 'animated' | 'static';
  reduceAnimations: boolean;

  // Notification settings
  enableNotifications: boolean;
  dailyReminders: boolean;
  reminderTime: string;
  pushNotifications: boolean;
  emailNotifications: boolean;
  soundEnabled: boolean;
  smartNudges: boolean;
  taskReminders: boolean;
  gmNotifications: boolean;
  achievementNotifications: boolean;

  // Privacy settings
  twoFactorAuth: boolean;
  dataCollection: boolean;
  activityStatus: boolean;

  // App behavior settings
  defaultView: string;
  autoSave: boolean;
  confirmDelete: boolean;
  aiResponseStyle: 'concise' | 'detailed' | 'comprehensive';
  aiAllowProfanity: boolean;
  enableTours: boolean;
}

// Default settings
const defaultSettings: Settings = {
  // Appearance defaults
  theme: 'light',
  accentColor: 'purple',
  fontSize: 16,
  layoutDensity: 'cozy',
  backgroundStyle: 'minimal',
  reduceAnimations: false,

  // Notification defaults
  enableNotifications: true,
  dailyReminders: true,
  reminderTime: '08:00',
  pushNotifications: true,
  emailNotifications: true,
  soundEnabled: true,
  smartNudges: true,
  taskReminders: true,
  gmNotifications: true,
  achievementNotifications: true,

  // Privacy defaults
  twoFactorAuth: false,
  dataCollection: true,
  activityStatus: true,

  // App behavior defaults
  defaultView: 'gm',
  autoSave: true,
  confirmDelete: true,
  aiResponseStyle: 'detailed',
  aiAllowProfanity: true,
  enableTours: true,
};

// Create the context
interface SettingsContextType {
  settings: Settings;
  updateSettings: (newSettings: Partial<Settings>) => void;
  resetSettings: () => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

// Provider component
interface SettingsProviderProps {
  children: ReactNode;
}

export const SettingsProvider: React.FC<SettingsProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load settings from localStorage on mount or when user changes
  useEffect(() => {
    const loadSettings = () => {
      try {
        // Create user-specific keys for settings
        const userKey = user?.email ? `_${user.email}` : '';

        // Load all settings categories
        const savedAppearance = localStorage.getItem(`appearanceSettings${userKey}`);
        const savedNotifications = localStorage.getItem(`notificationSettings${userKey}`);
        const savedPrivacy = localStorage.getItem(`privacySettings${userKey}`);
        const savedBehavior = localStorage.getItem(`behaviorSettings${userKey}`);

        // Start with default settings
        let loadedSettings = { ...defaultSettings };

        // Apply saved settings if they exist
        if (savedAppearance) {
          loadedSettings = { ...loadedSettings, ...JSON.parse(savedAppearance) };
        }

        if (savedNotifications) {
          loadedSettings = { ...loadedSettings, ...JSON.parse(savedNotifications) };
        }

        if (savedPrivacy) {
          loadedSettings = { ...loadedSettings, ...JSON.parse(savedPrivacy) };
        }

        if (savedBehavior) {
          loadedSettings = { ...loadedSettings, ...JSON.parse(savedBehavior) };
        }

        setSettings(loadedSettings);

        // Apply theme immediately
        applyTheme(loadedSettings.theme);

        // Apply font size
        document.documentElement.style.fontSize = `${loadedSettings.fontSize}px`;

        // Apply animation reduction setting
        if (loadedSettings.reduceAnimations) {
          document.documentElement.classList.add('reduce-motion');
        } else {
          document.documentElement.classList.remove('reduce-motion');
        }
      } catch (error) {
        console.error('Error loading settings:', error);
        // If there's an error, use default settings
        setSettings(defaultSettings);
      }

      setIsInitialized(true);
    };

    loadSettings();
  }, [user?.email]);

  // Apply theme based on setting
  const applyTheme = (theme: 'light' | 'dark' | 'system') => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else if (theme === 'light') {
      document.documentElement.classList.remove('dark');
    } else if (theme === 'system') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  };

  // Update settings
  const updateSettings = (newSettings: Partial<Settings>) => {
    setSettings(prevSettings => {
      const updatedSettings = { ...prevSettings, ...newSettings };

      // Create user-specific keys for settings
      const userKey = user?.email ? `_${user.email}` : '';

      // Save settings to localStorage based on what was updated
      if ('theme' in newSettings || 'accentColor' in newSettings ||
          'fontSize' in newSettings || 'layoutDensity' in newSettings ||
          'backgroundStyle' in newSettings || 'reduceAnimations' in newSettings) {
        const appearanceSettings = {
          theme: updatedSettings.theme,
          accentColor: updatedSettings.accentColor,
          fontSize: updatedSettings.fontSize,
          layoutDensity: updatedSettings.layoutDensity,
          backgroundStyle: updatedSettings.backgroundStyle,
          reduceAnimations: updatedSettings.reduceAnimations
        };
        localStorage.setItem(`appearanceSettings${userKey}`, JSON.stringify(appearanceSettings));

        // Apply theme if it was updated
        if ('theme' in newSettings) {
          applyTheme(updatedSettings.theme);
        }

        // Apply font size if it was updated
        if ('fontSize' in newSettings) {
          document.documentElement.style.fontSize = `${updatedSettings.fontSize}px`;
        }

        // Apply animation reduction if it was updated
        if ('reduceAnimations' in newSettings) {
          if (updatedSettings.reduceAnimations) {
            document.documentElement.classList.add('reduce-motion');
          } else {
            document.documentElement.classList.remove('reduce-motion');
          }
        }
      }

      if ('enableNotifications' in newSettings || 'dailyReminders' in newSettings ||
          'reminderTime' in newSettings || 'pushNotifications' in newSettings ||
          'emailNotifications' in newSettings || 'soundEnabled' in newSettings ||
          'smartNudges' in newSettings || 'taskReminders' in newSettings ||
          'gmNotifications' in newSettings || 'achievementNotifications' in newSettings) {
        const notificationSettings = {
          enableNotifications: updatedSettings.enableNotifications,
          dailyReminders: updatedSettings.dailyReminders,
          reminderTime: updatedSettings.reminderTime,
          pushNotifications: updatedSettings.pushNotifications,
          emailNotifications: updatedSettings.emailNotifications,
          soundEnabled: updatedSettings.soundEnabled,
          smartNudges: updatedSettings.smartNudges,
          taskReminders: updatedSettings.taskReminders,
          gmNotifications: updatedSettings.gmNotifications,
          achievementNotifications: updatedSettings.achievementNotifications
        };
        localStorage.setItem(`notificationSettings${userKey}`, JSON.stringify(notificationSettings));
      }

      if ('twoFactorAuth' in newSettings || 'dataCollection' in newSettings ||
          'activityStatus' in newSettings) {
        const privacySettings = {
          twoFactorAuth: updatedSettings.twoFactorAuth,
          dataCollection: updatedSettings.dataCollection,
          activityStatus: updatedSettings.activityStatus
        };
        localStorage.setItem(`privacySettings${userKey}`, JSON.stringify(privacySettings));
      }

      if ('defaultView' in newSettings || 'autoSave' in newSettings ||
          'confirmDelete' in newSettings || 'aiResponseStyle' in newSettings ||
          'aiAllowProfanity' in newSettings || 'enableTours' in newSettings) {
        const behaviorSettings = {
          defaultView: updatedSettings.defaultView,
          autoSave: updatedSettings.autoSave,
          confirmDelete: updatedSettings.confirmDelete,
          aiResponseStyle: updatedSettings.aiResponseStyle,
          aiAllowProfanity: updatedSettings.aiAllowProfanity,
          enableTours: updatedSettings.enableTours
        };
        localStorage.setItem(`behaviorSettings${userKey}`, JSON.stringify(behaviorSettings));
      }

      return updatedSettings;
    });
  };

  // Reset all settings to defaults
  const resetSettings = () => {
    setSettings(defaultSettings);

    // Create user-specific keys for settings
    const userKey = user?.email ? `_${user.email}` : '';

    // Clear all settings from localStorage
    localStorage.removeItem(`appearanceSettings${userKey}`);
    localStorage.removeItem(`notificationSettings${userKey}`);
    localStorage.removeItem(`privacySettings${userKey}`);
    localStorage.removeItem(`behaviorSettings${userKey}`);

    // Apply default theme
    applyTheme(defaultSettings.theme);

    // Apply default font size
    document.documentElement.style.fontSize = `${defaultSettings.fontSize}px`;
  };

  // Only render children once settings are loaded
  if (!isInitialized) {
    return null; // Or a loading spinner
  }

  return (
    <SettingsContext.Provider value={{ settings, updateSettings, resetSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};

// Custom hook for using the settings context
export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
