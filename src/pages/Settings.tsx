import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { useAuth } from "@/contexts/AuthContext";
import { useSettings } from "@/contexts/SettingsContext";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  User,
  Palette,
  Bell,
  Lock,
  Settings2,
  Moon,
  Sun,
  Laptop,
  Key,
  Settings as SettingsIcon,
  Globe,
  Languages,
  Headphones,
  MessageSquare,
  HelpCircle,
  CreditCard,
  Smartphone,
  Wifi,
  Zap,
  Brain,
  Clock,
  Home
} from "lucide-react";

const Settings = () => {
  const { user, userProfile, updateUserProfile } = useAuth();
  const { settings, updateSettings, resetSettings } = useSettings();
  const { toast } = useToast();

  // Account Settings
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber || "");
  const [age, setAge] = useState(user?.age || 0);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Function to save user profile settings
  const handleSaveProfile = async () => {
    try {
      // Update user profile in the context
      await updateUserProfile({
        ...userProfile,
        name,
        age,
        phoneNumber,
      });

      toast({
        title: "Profile updated",
        description: "Your profile information has been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save profile settings. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Function to update appearance settings
  const handleUpdateAppearance = (updates: Partial<typeof settings>) => {
    updateSettings(updates);
    toast({
      title: "Appearance settings saved",
      description: "Your theme preferences have been updated.",
    });
  };

  // Function to update notification settings
  const handleUpdateNotifications = (updates: Partial<typeof settings>) => {
    updateSettings(updates);
    toast({
      title: "Notification settings saved",
      description: "Your notification preferences have been updated.",
    });
  };

  // Function to update privacy settings
  const handleUpdatePrivacy = (updates: Partial<typeof settings>) => {
    updateSettings(updates);
    toast({
      title: "Privacy settings saved",
      description: "Your privacy and security preferences have been updated.",
    });
  };

  // Function to update app behavior settings
  const handleUpdateBehavior = (updates: Partial<typeof settings>) => {
    updateSettings(updates);
    toast({
      title: "App behavior settings saved",
      description: "Your app behavior preferences have been updated.",
    });
  };

  return (
    <MainLayout>
      <div className="container mx-auto pb-12">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Settings</h1>
          <Button
            variant="outline"
            className="gap-2"
            onClick={() => {
              resetSettings();
              toast({
                title: "Settings reset",
                description: "All settings have been reset to default values.",
              });
            }}
          >
            <SettingsIcon className="h-4 w-4" />
            <span>Reset All Settings</span>
          </Button>
        </div>

        <Tabs defaultValue="account" className="w-full">
          <TabsList className="mb-6 flex flex-wrap gap-2">
            <TabsTrigger value="account" className="flex items-center gap-2">
              <User size={16} />
              <span>Account</span>
            </TabsTrigger>
            <TabsTrigger value="appearance" className="flex items-center gap-2">
              <Palette size={16} />
              <span>Appearance</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell size={16} />
              <span>Notifications</span>
            </TabsTrigger>
            <TabsTrigger value="privacy" className="flex items-center gap-2">
              <Lock size={16} />
              <span>Privacy</span>
            </TabsTrigger>
            <TabsTrigger value="behavior" className="flex items-center gap-2">
              <Settings2 size={16} />
              <span>App Behavior</span>
            </TabsTrigger>
          </TabsList>

          {/* Account Settings Tab */}
          <TabsContent value="account" className="space-y-6">
            <div className="p-6 bg-card rounded-lg border border-border">
              <div className="flex items-center gap-2 mb-4">
                <User className="h-5 w-5 text-grindos-purple" />
                <h2 className="text-xl font-semibold">Account Settings</h2>
              </div>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-1">Display Name</label>
                  <Input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full max-w-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Email Address</label>
                  <div className="flex gap-2 max-w-md">
                    <Input
                      type="email"
                      value={email}
                      className="flex-1"
                      readOnly
                    />
                    <Button variant="outline" size="sm">
                      Verify New
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Email changes require verification</p>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Age</label>
                  <Input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(parseInt(e.target.value) || 0)}
                    className="w-full max-w-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Phone Number (Optional)</label>
                  <Input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full max-w-md"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
                <div className="pt-2">
                  <Button
                    onClick={handleSaveProfile}
                    className="bg-grindos-purple hover:bg-grindos-purple/90"
                  >
                    Save Changes
                  </Button>
                </div>
              </div>
            </div>

            <div className="p-6 bg-card rounded-lg border border-border">
              <div className="flex items-center gap-2 mb-4">
                <Key className="h-5 w-5 text-grindos-purple" />
                <h2 className="text-xl font-semibold">Password Management</h2>
              </div>
              <div className="space-y-4 max-w-md">
                <div>
                  <label className="block text-sm font-medium mb-1">Current Password</label>
                  <Input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="••••••••"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">New Password</label>
                  <Input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Confirm New Password</label>
                  <Input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                  />
                </div>
                <div className="pt-2 flex gap-3">
                  <Button
                    onClick={() => {
                      toast({
                        title: "Password updated",
                        description: "Your password has been changed successfully."
                      });
                      setCurrentPassword("");
                      setNewPassword("");
                      setConfirmPassword("");
                    }}
                    className="bg-grindos-purple hover:bg-grindos-purple/90"
                  >
                    Update Password
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      toast({
                        title: "Password reset email sent",
                        description: "Check your email for instructions to reset your password."
                      });
                    }}
                  >
                    Reset Password
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Appearance & Theme Tab */}
          <TabsContent value="appearance" className="space-y-6">
            <div className="p-6 bg-card rounded-lg border border-border">
              <div className="flex items-center gap-2 mb-4">
                <Palette className="h-5 w-5 text-grindos-purple" />
                <h2 className="text-xl font-semibold">Appearance & Theme</h2>
              </div>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Theme</label>
                  <div className="flex flex-wrap gap-3">
                    <Button
                      variant={settings.theme === 'light' ? 'default' : 'outline'}
                      className={settings.theme === 'light' ? 'bg-grindos-purple hover:bg-grindos-purple/90' : ''}
                      onClick={() => handleUpdateAppearance({ theme: 'light' })}
                    >
                      <Sun className="mr-2 h-4 w-4" />
                      Light
                    </Button>
                    <Button
                      variant={settings.theme === 'dark' ? 'default' : 'outline'}
                      className={settings.theme === 'dark' ? 'bg-grindos-purple hover:bg-grindos-purple/90' : ''}
                      onClick={() => handleUpdateAppearance({ theme: 'dark' })}
                    >
                      <Moon className="mr-2 h-4 w-4" />
                      Dark
                    </Button>
                    <Button
                      variant={settings.theme === 'system' ? 'default' : 'outline'}
                      className={settings.theme === 'system' ? 'bg-grindos-purple hover:bg-grindos-purple/90' : ''}
                      onClick={() => handleUpdateAppearance({ theme: 'system' })}
                    >
                      <Laptop className="mr-2 h-4 w-4" />
                      System
                    </Button>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <label className="block text-sm font-medium mb-2">Font Size</label>
                  <div className="flex items-center gap-4">
                    <Slider
                      value={[settings.fontSize]}
                      min={12}
                      max={20}
                      step={1}
                      onValueChange={(value) => handleUpdateAppearance({ fontSize: value[0] })}
                      className="w-64"
                    />
                    <span className="ml-2 text-sm">{settings.fontSize}px</span>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <label className="block text-sm font-medium mb-2">Layout Density</label>
                  <div className="flex flex-wrap gap-3">
                    <Button
                      variant={settings.layoutDensity === 'cozy' ? 'default' : 'outline'}
                      className={settings.layoutDensity === 'cozy' ? 'bg-grindos-purple hover:bg-grindos-purple/90' : ''}
                      onClick={() => handleUpdateAppearance({ layoutDensity: 'cozy' })}
                    >
                      Cozy
                    </Button>
                    <Button
                      variant={settings.layoutDensity === 'compact' ? 'default' : 'outline'}
                      className={settings.layoutDensity === 'compact' ? 'bg-grindos-purple hover:bg-grindos-purple/90' : ''}
                      onClick={() => handleUpdateAppearance({ layoutDensity: 'compact' })}
                    >
                      Compact
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="space-y-6">
            <div className="p-6 bg-card rounded-lg border border-border">
              <div className="flex items-center gap-2 mb-4">
                <Bell className="h-5 w-5 text-grindos-purple" />
                <h2 className="text-xl font-semibold">Notification Settings</h2>
              </div>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium">Enable Notifications</label>
                    <p className="text-xs text-muted-foreground">Receive notifications about important updates</p>
                  </div>
                  <Switch
                    checked={settings.enableNotifications}
                    onCheckedChange={(checked) => handleUpdateNotifications({ enableNotifications: checked })}
                  />
                </div>

                <div className="border-t pt-4 flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium">Daily Reminders</label>
                    <p className="text-xs text-muted-foreground">Get daily reminders for your tasks</p>
                  </div>
                  <Switch
                    checked={settings.dailyReminders}
                    onCheckedChange={(checked) => handleUpdateNotifications({ dailyReminders: checked })}
                    disabled={!settings.enableNotifications}
                  />
                </div>

                <div className="border-t pt-4 flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium">Push Notifications</label>
                    <p className="text-xs text-muted-foreground">Receive push notifications in your browser</p>
                  </div>
                  <Switch
                    checked={settings.pushNotifications}
                    onCheckedChange={(checked) => handleUpdateNotifications({ pushNotifications: checked })}
                    disabled={!settings.enableNotifications}
                  />
                </div>

                <div className="border-t pt-4 flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium">Email Notifications</label>
                    <p className="text-xs text-muted-foreground">Receive important updates via email</p>
                  </div>
                  <Switch
                    checked={settings.emailNotifications}
                    onCheckedChange={(checked) => handleUpdateNotifications({ emailNotifications: checked })}
                    disabled={!settings.enableNotifications}
                  />
                </div>

                <div className="border-t pt-4 flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium">Sound Enabled</label>
                    <p className="text-xs text-muted-foreground">Play sounds for notifications</p>
                  </div>
                  <Switch
                    checked={settings.soundEnabled}
                    onCheckedChange={(checked) => handleUpdateNotifications({ soundEnabled: checked })}
                    disabled={!settings.enableNotifications}
                  />
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Privacy Tab */}
          <TabsContent value="privacy" className="space-y-6">
            <div className="p-6 bg-card rounded-lg border border-border">
              <div className="flex items-center gap-2 mb-4">
                <Lock className="h-5 w-5 text-grindos-purple" />
                <h2 className="text-xl font-semibold">Privacy & Security</h2>
              </div>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium">Two-Factor Authentication</label>
                    <p className="text-xs text-muted-foreground">Add an extra layer of security to your account</p>
                  </div>
                  <Switch
                    checked={settings.twoFactorAuth}
                    onCheckedChange={(checked) => handleUpdatePrivacy({ twoFactorAuth: checked })}
                  />
                </div>

                <div className="border-t pt-4 flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium">Data Collection</label>
                    <p className="text-xs text-muted-foreground">Allow us to collect usage data to improve your experience</p>
                  </div>
                  <Switch
                    checked={settings.dataCollection}
                    onCheckedChange={(checked) => handleUpdatePrivacy({ dataCollection: checked })}
                  />
                </div>

                <div className="border-t pt-4 flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium">Activity Status</label>
                    <p className="text-xs text-muted-foreground">Show when you're active to other users</p>
                  </div>
                  <Switch
                    checked={settings.activityStatus}
                    onCheckedChange={(checked) => handleUpdatePrivacy({ activityStatus: checked })}
                  />
                </div>
              </div>
            </div>
          </TabsContent>

          {/* App Behavior Tab */}
          <TabsContent value="behavior" className="space-y-6">
            <div className="p-6 bg-card rounded-lg border border-border">
              <div className="flex items-center gap-2 mb-4">
                <Settings2 className="h-5 w-5 text-grindos-purple" />
                <h2 className="text-xl font-semibold">App Behavior</h2>
              </div>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium">Auto Save</label>
                    <p className="text-xs text-muted-foreground">Automatically save your changes</p>
                  </div>
                  <Switch
                    checked={settings.autoSave}
                    onCheckedChange={(checked) => handleUpdateBehavior({ autoSave: checked })}
                  />
                </div>

                <div className="border-t pt-4 flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium">Confirm Delete</label>
                    <p className="text-xs text-muted-foreground">Show confirmation dialog before deleting items</p>
                  </div>
                  <Switch
                    checked={settings.confirmDelete}
                    onCheckedChange={(checked) => handleUpdateBehavior({ confirmDelete: checked })}
                  />
                </div>

                <div className="border-t pt-4 flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium">Enable Tours</label>
                    <p className="text-xs text-muted-foreground">Show interactive tours for new features and rooms</p>
                  </div>
                  <Switch
                    checked={settings.enableTours}
                    onCheckedChange={(checked) => handleUpdateBehavior({ enableTours: checked })}
                  />
                </div>

                <div className="border-t pt-4">
                  <label className="block text-sm font-medium mb-2">AI Response Style</label>
                  <div className="flex flex-wrap gap-3">
                    <Button
                      variant={settings.aiResponseStyle === 'concise' ? 'default' : 'outline'}
                      className={settings.aiResponseStyle === 'concise' ? 'bg-grindos-purple hover:bg-grindos-purple/90' : ''}
                      onClick={() => handleUpdateBehavior({ aiResponseStyle: 'concise' })}
                    >
                      <Zap className="mr-2 h-4 w-4" />
                      Concise
                    </Button>
                    <Button
                      variant={settings.aiResponseStyle === 'detailed' ? 'default' : 'outline'}
                      className={settings.aiResponseStyle === 'detailed' ? 'bg-grindos-purple hover:bg-grindos-purple/90' : ''}
                      onClick={() => handleUpdateBehavior({ aiResponseStyle: 'detailed' })}
                    >
                      <MessageSquare className="mr-2 h-4 w-4" />
                      Detailed
                    </Button>
                    <Button
                      variant={settings.aiResponseStyle === 'comprehensive' ? 'default' : 'outline'}
                      className={settings.aiResponseStyle === 'comprehensive' ? 'bg-grindos-purple hover:bg-grindos-purple/90' : ''}
                      onClick={() => handleUpdateBehavior({ aiResponseStyle: 'comprehensive' })}
                    >
                      <Brain className="mr-2 h-4 w-4" />
                      Comprehensive
                    </Button>
                  </div>
                </div>

                <div className="border-t pt-4 flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium">Allow Profanity in AI Responses</label>
                    <p className="text-xs text-muted-foreground">Allow AI to use casual language including mild profanity</p>
                  </div>
                  <Switch
                    checked={settings.aiAllowProfanity}
                    onCheckedChange={(checked) => handleUpdateBehavior({ aiAllowProfanity: checked })}
                  />
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Settings;
