
import { useState, useRef, useEffect } from "react";
import { MessageSquare, Send, Search, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";

type Message = {
  id: string;
  content: string;
  sender: "user" | "ai";
  timestamp: Date;
};

export const AIAssistantRoom = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "initial",
      content: "Hey there. I'm your no-BS productivity assistant. What do you want to get done today? I'm here to help you be more productive and get shit done, not to hold your hand.",
      sender: "ai",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = generateAIResponse(input);
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: aiResponse,
        sender: "ai",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1000);
  };

  const generateAIResponse = (userInput: string): string => {
    userInput = userInput.toLowerCase();

    if (userInput.includes("hello") || userInput.includes("hi") || userInput.includes("hey")) {
      return "Hey. I don't do small talk. What productivity problem do you need help with?";
    } else if (userInput.includes("how are you")) {
      return "I'm a productivity AI, not your friend. What do you need help with?";
    } else if (userInput.includes("who are you") || userInput.includes("what can you do")) {
      return "I'm your productivity assistant. I'm here to help you get more done in less time. I can help with task prioritization, time management, focus techniques, workflow optimization, and cutting through your BS excuses. Now what do you need help with?";
    } else if (userInput.includes("procrastination") || userInput.includes("procrastinating")) {
      return "Procrastination is just fear in disguise. Break your task into ridiculously small steps and commit to just 5 minutes. That's it. Start now, not after 'one more video'.";
    } else if (userInput.includes("focus") || userInput.includes("distraction")) {
      return "Your focus is garbage because you let it be. Turn off notifications, use a damn pomodoro timer (25 min work, 5 min break), and put your phone in another room. It's not rocket science.";
    } else if (userInput.includes("motivation")) {
      return "Motivation is unreliable bullshit. Build systems and habits instead. Start small, be consistent, and track your progress. Motivation follows action, not the other way around.";
    } else if (userInput.includes("todo") || userInput.includes("to-do") || userInput.includes("task")) {
      return "Stop overcomplicating your to-do list. Pick your 1-3 most important tasks for tomorrow. Write them down. Do the hardest one first thing in the morning. Repeat daily.";
    } else if (userInput.includes("time management")) {
      return "Time management is actually attention management. Schedule your day in blocks. Protect your peak productivity hours for deep work. Learn to say no to shit that doesn't move the needle.";
    } else if (userInput.includes("goal") || userInput.includes("achieve")) {
      return "Most goals fail because they're vague wishes without a plan. What's your specific outcome? What are the steps to get there? What will you do DAILY to make progress? Answer those or don't bother.";
    } else if (userInput.includes("thank")) {
      return "Don't thank me. Just take action. That's the only thanks I need.";
    } else {
      return "Look, I'm here to help you be more productive. Be specific about what you're struggling with. Is it focus? Time management? Task prioritization? Planning? Tell me the actual problem you need to solve.";
    }
  };

  return (
    <div className="container mx-auto p-4 h-[calc(100vh-140px)] flex flex-col">
      <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <Bot className="h-6 w-6 text-grindos-purple" />
        AI Assistant
      </h1>

      <Card className="flex-1 flex flex-col overflow-hidden">
        <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  message.sender === "user"
                    ? "bg-grindos-purple text-white"
                    : "bg-muted"
                }`}
              >
                <p>{message.content}</p>
                <div
                  className={`text-xs mt-1 ${
                    message.sender === "user"
                      ? "text-white/70"
                      : "text-muted-foreground"
                  }`}
                >
                  {message.timestamp.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start">
              <div className="max-w-[80%] rounded-lg p-3 bg-muted">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </CardContent>

        <div className="p-4 border-t">
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me anything about productivity..."
              className="flex-1"
              disabled={isTyping}
            />
            <Button type="submit" disabled={isTyping || !input.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </Card>
    </div>
  );
};

export default AIAssistantRoom;
