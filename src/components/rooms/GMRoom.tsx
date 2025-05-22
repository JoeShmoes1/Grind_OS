
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Send, Sun, User } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { SpinningGearLogo } from "@/components/ui/SpinningGearLogo";
import { useToast } from "@/components/ui/use-toast";
import { useAddXP } from "@/utils/xpUtils";

interface Message {
  id: string;
  text: string;
  sender: string;
  senderEmail: string;
  timestamp: Date;
  isGM: boolean;
}

// Helper function to format message time
const formatMessageTime = (date: Date) => {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

export const GMRoom = () => {
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [hasGreetedToday, setHasGreetedToday] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  const { toast } = useToast();
  const { awardDailyActionXP } = useAddXP();

  // Current date
  const today = new Date();
  const formattedDate = today.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  });

  // Load messages from shared storage on mount
  useEffect(() => {
    // Get shared messages from localStorage
    const sharedMessages = localStorage.getItem("sharedGMMessages");
    if (sharedMessages) {
      try {
        const parsedMessages = JSON.parse(sharedMessages);
        // Convert string timestamps back to Date objects
        const messagesWithDates = parsedMessages.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }));
        setMessages(messagesWithDates);
      } catch (error) {
        console.error("Error parsing shared GM messages:", error);
        // Initialize with empty array if there's an error
        setMessages([]);
      }
    }

    // Check if current user has greeted today
    if (user?.email) {
      const userGreetingKey = `lastGMGreeting_${user.email}`;
      const lastGreeting = localStorage.getItem(userGreetingKey);

      if (lastGreeting) {
        const lastGreetingDate = new Date(lastGreeting);
        const isSameDay =
          lastGreetingDate.getDate() === today.getDate() &&
          lastGreetingDate.getMonth() === today.getMonth() &&
          lastGreetingDate.getFullYear() === today.getFullYear();

        setHasGreetedToday(isSameDay);
      }
    }
  }, [user?.email]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Format time for messages
  const formatMessageTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Handle sending a new message
  const handleSendMessage = () => {
    if (!newMessage.trim() || !user?.email) return;

    const isGMMessage =
      newMessage.toLowerCase().includes("gm") ||
      newMessage.toLowerCase().includes("good morning");

    const newMsg: Message = {
      id: `msg-${Date.now()}-${user.email}`,
      text: newMessage,
      sender: user?.name || "You",
      senderEmail: user.email,
      timestamp: new Date(),
      isGM: isGMMessage
    };

    // Add new message to the messages array
    const updatedMessages = [...messages, newMsg];
    setMessages(updatedMessages);

    // Save to shared storage for all users
    localStorage.setItem("sharedGMMessages", JSON.stringify(updatedMessages));
    setNewMessage("");

    // If this is a GM message, update the last greeting timestamp for this user
    if (isGMMessage && !hasGreetedToday) {
      const userGreetingKey = `lastGMGreeting_${user.email}`;
      localStorage.setItem(userGreetingKey, new Date().toISOString());
      setHasGreetedToday(true);

      // Award XP for sending a GM message
      awardDailyActionXP('gm');

      toast({
        title: "GM sent! +5 XP",
        description: "Your daily greeting has been shared with the community.",
      });
    }
  };

  // Handle pressing Enter to send message
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)]">
      <header className="pb-4 border-b">
        <div className="flex items-center gap-2">
          <Sun className="h-6 w-6 text-amber-500" />
          <h1 className="text-2xl font-semibold">GM Room</h1>
        </div>
        <p className="text-muted-foreground">{formattedDate}</p>
      </header>

      <Card className="flex-1 mt-4 flex flex-col overflow-hidden">
        <CardHeader className="py-3 px-4 border-b">
          <CardTitle className="text-lg flex items-center gap-2">
            <SpinningGearLogo size={18} />
            Daily GM Messages
          </CardTitle>
        </CardHeader>

        <CardContent className="flex-1 overflow-y-auto p-4">
          <div className="space-y-4">
            {messages.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>No GM messages yet today. Be the first to greet the community!</p>
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.senderEmail === user?.email ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.senderEmail === user?.email
                        ? "bg-grindos-purple text-white"
                        : "bg-muted"
                    }`}
                  >
                    {message.senderEmail !== user?.email && (
                      <div className="font-medium text-sm mb-1">{message.sender}</div>
                    )}
                    <div>{message.text}</div>
                    <div className="text-xs mt-1 opacity-70 text-right">
                      {formatMessageTime(message.timestamp)}
                    </div>
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>
        </CardContent>

        <div className="p-4 border-t">
          <div className="flex gap-2">
            <Input
              placeholder={hasGreetedToday ? "Send a message..." : "Send your GM for today..."}
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1"
            />
            <Button
              onClick={handleSendMessage}
              className="bg-grindos-purple hover:bg-grindos-purple/90"
              disabled={!newMessage.trim()}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
          {!hasGreetedToday && (
            <p className="text-xs text-muted-foreground mt-2">
              You haven't sent your GM message today. Start your day right by greeting the community!
            </p>
          )}
        </div>
      </Card>
    </div>
  );
};
