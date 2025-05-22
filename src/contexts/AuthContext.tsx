
import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface User {
  name: string;
  email: string;
  age: number;
  phoneNumber?: string;
}

interface UserProfile {
  name: string;
  phoneNumber?: string;
  age: number;
  role: "student" | "professional" | "other";
  onboardingCompleted?: boolean;
  isPremium?: boolean;
  packageSelected?: boolean;
}

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  isAuthenticated: boolean;
  isPremium: boolean;
  hasCompletedOnboarding: boolean;
  hasSelectedPackage: boolean;
  isFirstLogin: boolean;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<void>;
  signup: (name: string, email: string, password: string, age: number, phoneNumber: string, rememberMe?: boolean) => Promise<void>;
  logout: () => void;
  updateUserProfile: (profileData: Partial<UserProfile>) => Promise<void>;
  selectPackage: (isPremium: boolean) => Promise<void>;
  checkEmailExists: (email: string) => boolean;
  setFirstLoginComplete: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [registeredUsers, setRegisteredUsers] = useState<{[email: string]: {password: string, user: User}}>({});
  const [isFirstLogin, setIsFirstLogin] = useState<boolean>(false);

  // Check for existing user and profile in localStorage or sessionStorage on mount
  useEffect(() => {
    // Check if user has "remember me" enabled
    const rememberMe = localStorage.getItem("rememberMe") === "true";

    // Get user from appropriate storage based on remember me setting
    const savedUser = rememberMe
      ? localStorage.getItem("user")
      : sessionStorage.getItem("user");

    const savedProfile = localStorage.getItem("userProfile");
    const isPremium = localStorage.getItem("isPremium") === "true";
    const savedRegisteredUsers = localStorage.getItem("registeredUsers");

    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }

    if (savedProfile) {
      setUserProfile(JSON.parse(savedProfile));
    }

    if (savedRegisteredUsers) {
      setRegisteredUsers(JSON.parse(savedRegisteredUsers));
    }
  }, []);

  // Authentication functions
  const login = async (email: string, password: string, rememberMe: boolean = false) => {
    // Check if the email exists in our registered users
    if (!registeredUsers[email]) {
      throw new Error("Account not registered. Please sign up first.");
    }

    // Check if the password is correct
    if (registeredUsers[email].password !== password) {
      throw new Error("Incorrect password. Please try again.");
    }

    // Get the user data from registered users
    const user = registeredUsers[email].user;
    setUser(user);

    // Check if this is the first login for this session
    const hasLoggedInBefore = localStorage.getItem(`hasLoggedIn_${email}`);
    if (!hasLoggedInBefore) {
      setIsFirstLogin(true);
      // We don't set the localStorage flag yet - we'll do that when setFirstLoginComplete is called
    }

    // Store user data based on remember me preference
    if (rememberMe) {
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("rememberMe", "true");
    } else {
      // Use sessionStorage instead of localStorage for non-persistent sessions
      sessionStorage.setItem("user", JSON.stringify(user));
      localStorage.removeItem("rememberMe");
    }

    // Check if user has completed onboarding
    const savedProfile = localStorage.getItem(`userProfile_${email}`);
    if (savedProfile) {
      const profile = JSON.parse(savedProfile);
      setUserProfile(profile);
    } else {
      // Create a default profile for users
      const defaultProfile = {
        name: user.name,
        age: user.age,
        phoneNumber: user.phoneNumber,
        role: "professional" as "student" | "professional" | "other",
        onboardingCompleted: false,
        isPremium: false,
        packageSelected: false
      };
      setUserProfile(defaultProfile);
      localStorage.setItem(`userProfile_${email}`, JSON.stringify(defaultProfile));
      localStorage.setItem("isPremium", "false");
    }
  };

  const signup = async (name: string, email: string, password: string, age: number, phoneNumber: string, rememberMe: boolean = false) => {
    // Check if email already exists
    if (registeredUsers[email]) {
      throw new Error("Account already registered. Please sign in instead.");
    }

    // Create new user
    const user = { name, email, age, phoneNumber };
    setUser(user);

    // This is definitely a first login for new users
    setIsFirstLogin(true);

    // Store user in registered users
    const updatedUsers = {
      ...registeredUsers,
      [email]: { password, user }
    };
    setRegisteredUsers(updatedUsers);
    localStorage.setItem("registeredUsers", JSON.stringify(updatedUsers));

    // Store user data based on remember me preference
    if (rememberMe) {
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("rememberMe", "true");
    } else {
      // Use sessionStorage instead of localStorage for non-persistent sessions
      sessionStorage.setItem("user", JSON.stringify(user));
      localStorage.removeItem("rememberMe");
    }

    // Create a default profile for new users
    const defaultProfile = {
      name: name,
      age: age,
      phoneNumber: phoneNumber,
      role: "professional" as "student" | "professional" | "other",
      onboardingCompleted: false,
      isPremium: false,
      packageSelected: false
    };
    setUserProfile(defaultProfile);
    localStorage.setItem(`userProfile_${email}`, JSON.stringify(defaultProfile));
    localStorage.setItem("isPremium", "false");
  };

  const logout = () => {
    setUser(null);
    // Clear user profile state to prevent onboarding loop
    setUserProfile(null);

    // Clear user data from storage
    localStorage.removeItem("user");
    sessionStorage.removeItem("user");
    localStorage.removeItem("rememberMe");

    // We don't remove the profile from localStorage so it persists for returning users
    // But we do clear the state to ensure a clean logout

    // Redirect to auth page
    window.location.href = "/auth";
  };

  const updateUserProfile = async (profileData: Partial<UserProfile>) => {
    if (!userProfile || !user) return Promise.resolve();

    const updatedProfile = { ...userProfile, ...profileData };
    setUserProfile(updatedProfile);

    if (user.email) {
      localStorage.setItem(`userProfile_${user.email}`, JSON.stringify(updatedProfile));
    }

    if (profileData.isPremium !== undefined) {
      localStorage.setItem("isPremium", String(profileData.isPremium));
    }

    return Promise.resolve();
  };

  // Function to select a package (free or premium)
  const selectPackage = async (isPremium: boolean) => {
    if (!userProfile || !user) return Promise.resolve();

    const updatedProfile = {
      ...userProfile,
      isPremium,
      packageSelected: true
    };

    setUserProfile(updatedProfile);

    if (user.email) {
      localStorage.setItem(`userProfile_${user.email}`, JSON.stringify(updatedProfile));
    }

    localStorage.setItem("isPremium", String(isPremium));
    return Promise.resolve();
  };

  // Function to check if an email already exists
  const checkEmailExists = (email: string) => {
    return !!registeredUsers[email];
  };

  const hasCompletedOnboarding = Boolean(userProfile?.onboardingCompleted || userProfile?.name);
  // Default to non-premium unless explicitly set to true
  const isPremium = Boolean(localStorage.getItem("isPremium") === "true");

  // Check if user has selected a package
  const hasSelectedPackage = Boolean(userProfile?.packageSelected);

  // Function to mark first login as complete
  const setFirstLoginComplete = () => {
    if (user?.email) {
      localStorage.setItem(`hasLoggedIn_${user.email}`, "true");
      setIsFirstLogin(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        userProfile,
        isAuthenticated: !!user,
        isPremium,
        hasCompletedOnboarding,
        hasSelectedPackage,
        isFirstLogin,
        login,
        signup,
        logout,
        updateUserProfile,
        selectPackage,
        checkEmailExists,
        setFirstLoginComplete
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
