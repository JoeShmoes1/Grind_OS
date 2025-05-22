import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useXP, RewardItem, LeaderboardEntry } from '@/contexts/XPContext';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { 
  ShoppingBag, 
  Trophy, 
  Star, 
  Award, 
  Palette, 
  Settings, 
  Lock, 
  CheckCircle,
  Medal,
  Crown,
  User
} from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';

interface XPModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const XPModal: React.FC<XPModalProps> = ({ isOpen, onClose }) => {
  const { userXP, availableRewards, leaderboard, purchaseReward, getXPProgress } = useXP();
  const { user } = useAuth();
  const { toast } = useToast();
  
  // Handle reward purchase
  const handlePurchase = (reward: RewardItem) => {
    if (reward.unlocked) {
      toast({
        title: "Already Unlocked",
        description: `You've already unlocked ${reward.name}!`,
      });
      return;
    }
    
    if (userXP.totalXPEarned < reward.cost) {
      toast({
        title: "Not Enough XP",
        description: `You need ${reward.cost - userXP.totalXPEarned} more XP to unlock this reward.`,
        variant: "destructive",
      });
      return;
    }
    
    const success = purchaseReward(reward.id);
    if (success) {
      toast({
        title: "Reward Unlocked!",
        description: `You've successfully unlocked ${reward.name}!`,
      });
    } else {
      toast({
        title: "Purchase Failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  // Get category icon
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'avatar':
        return <User className="h-4 w-4" />;
      case 'badge':
        return <Award className="h-4 w-4" />;
      case 'theme':
        return <Palette className="h-4 w-4" />;
      case 'feature':
        return <Settings className="h-4 w-4" />;
      default:
        return <Star className="h-4 w-4" />;
    }
  };
  
  // Get medal for top 3 leaderboard positions
  const getPositionMedal = (position: number) => {
    switch (position) {
      case 0:
        return <Crown className="h-5 w-5 text-yellow-500" />;
      case 1:
        return <Medal className="h-5 w-5 text-gray-400" />;
      case 2:
        return <Medal className="h-5 w-5 text-amber-700" />;
      default:
        return null;
    }
  };
  
  // Find current user's position in leaderboard
  const getCurrentUserPosition = () => {
    if (!user?.email) return -1;
    return leaderboard.findIndex(entry => entry.email === user.email);
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Star className="h-5 w-5 text-yellow-500" />
            Experience Points
          </DialogTitle>
          <DialogDescription>
            Level up and earn rewards by completing tasks and engaging with the app.
          </DialogDescription>
        </DialogHeader>
        
        <div className="mb-4 p-4 bg-muted/50 rounded-lg">
          <div className="flex justify-between items-center mb-2">
            <span className="font-medium">Level {userXP.level}</span>
            <span className="text-sm text-muted-foreground">{userXP.totalXPEarned} XP Total</span>
          </div>
          <Progress value={getXPProgress()} className="h-2 mb-1" />
          <div className="text-xs text-right text-muted-foreground">
            {getXPProgress()}% to Level {userXP.level + 1}
          </div>
        </div>
        
        <Tabs defaultValue="shop" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="shop" className="flex items-center gap-2">
              <ShoppingBag className="h-4 w-4" />
              <span>XP Shop</span>
            </TabsTrigger>
            <TabsTrigger value="leaderboard" className="flex items-center gap-2">
              <Trophy className="h-4 w-4" />
              <span>Leaderboard</span>
            </TabsTrigger>
          </TabsList>
          
          {/* XP Shop Tab */}
          <TabsContent value="shop" className="space-y-4 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {availableRewards.map((reward) => (
                <div 
                  key={reward.id} 
                  className={`border rounded-lg p-4 transition-all ${
                    reward.unlocked 
                      ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-900' 
                      : userXP.totalXPEarned >= reward.cost 
                        ? 'bg-card hover:border-primary cursor-pointer' 
                        : 'bg-muted/30 border-muted'
                  }`}
                  onClick={() => !reward.unlocked && handlePurchase(reward)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                        {reward.image || getCategoryIcon(reward.category)}
                      </div>
                      <div>
                        <h3 className="font-medium text-sm">{reward.name}</h3>
                        <p className="text-xs text-muted-foreground">{reward.category}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      {reward.unlocked ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : userXP.totalXPEarned >= reward.cost ? (
                        <Button size="sm" variant="outline" className="h-7 text-xs">
                          Unlock
                        </Button>
                      ) : (
                        <Lock className="h-4 w-4 text-muted-foreground" />
                      )}
                    </div>
                  </div>
                  <p className="text-sm mb-2">{reward.description}</p>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-1 text-amber-500">
                      <Star className="h-4 w-4 fill-amber-500" />
                      <span className="font-medium">{reward.cost} XP</span>
                    </div>
                    {!reward.unlocked && userXP.totalXPEarned < reward.cost && (
                      <span className="text-xs text-muted-foreground">
                        Need {reward.cost - userXP.totalXPEarned} more XP
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
          
          {/* Leaderboard Tab */}
          <TabsContent value="leaderboard" className="space-y-4 mt-4">
            <div className="space-y-2">
              {leaderboard.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Trophy className="h-12 w-12 mx-auto mb-2 opacity-20" />
                  <p>No leaderboard data available yet.</p>
                  <p className="text-sm">Start earning XP to appear on the leaderboard!</p>
                </div>
              ) : (
                leaderboard.map((entry, index) => {
                  const isCurrentUser = entry.email === user?.email;
                  return (
                    <div 
                      key={entry.userId}
                      className={`flex items-center justify-between p-3 rounded-lg ${
                        isCurrentUser 
                          ? 'bg-primary/10 border border-primary/20' 
                          : index % 2 === 0 
                            ? 'bg-muted/30' 
                            : 'bg-background'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-8 text-center font-medium">
                          {index < 3 ? (
                            getPositionMedal(index)
                          ) : (
                            <span className="text-muted-foreground">{index + 1}</span>
                          )}
                        </div>
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className={isCurrentUser ? "bg-primary text-primary-foreground" : ""}>
                            {entry.avatar || entry.name.substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-sm">
                            {entry.name}
                            {isCurrentUser && <span className="ml-2 text-xs text-muted-foreground">(You)</span>}
                          </p>
                          <p className="text-xs text-muted-foreground">Level {entry.level}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-amber-500">
                        <Star className="h-4 w-4 fill-amber-500" />
                        <span className="font-medium">{entry.xp} XP</span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
            
            {getCurrentUserPosition() > 5 && (
              <div className="mt-4 pt-4 border-t">
                <p className="text-sm text-center text-muted-foreground mb-2">Your Position</p>
                <div className="flex items-center justify-between p-3 rounded-lg bg-primary/10 border border-primary/20">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-8 text-center font-medium">
                      <span>{getCurrentUserPosition() + 1}</span>
                    </div>
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {user?.name?.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-sm">
                        {user?.name}
                        <span className="ml-2 text-xs text-muted-foreground">(You)</span>
                      </p>
                      <p className="text-xs text-muted-foreground">Level {userXP.level}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-amber-500">
                    <Star className="h-4 w-4 fill-amber-500" />
                    <span className="font-medium">{userXP.totalXPEarned} XP</span>
                  </div>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
