import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Bot, Send, Sparkles, Code, FileText, Calculator, Brain, Zap, HelpCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useAddXP } from "@/utils/xpUtils";
import { useRoomState } from "@/contexts/RoomStateContext";

// Define message types
interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  type?: 'normal' | 'code' | 'summary' | 'calculation' | 'creative';
}

// Define command types
interface Command {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  prefix: string;
}

// Available commands
const commands: Command[] = [
  {
    id: 'code',
    name: 'Generate Code',
    description: 'Generate code snippets in various languages',
    icon: Code,
    prefix: '/code'
  },
  {
    id: 'summarize',
    name: 'Summarize',
    description: 'Summarize long text or concepts',
    icon: FileText,
    prefix: '/summarize'
  },
  {
    id: 'calculate',
    name: 'Calculate',
    description: 'Perform calculations and conversions',
    icon: Calculator,
    prefix: '/calculate'
  },
  {
    id: 'creative',
    name: 'Creative Mode',
    description: 'Generate creative content like stories or ideas',
    icon: Sparkles,
    prefix: '/creative'
  },
  {
    id: 'brainstorm',
    name: 'Brainstorm',
    description: 'Generate ideas and solutions for a problem',
    icon: Brain,
    prefix: '/brainstorm'
  },
  {
    id: 'help',
    name: 'Help',
    description: 'Get help with using the AI assistant',
    icon: HelpCircle,
    prefix: '/help'
  }
];

// Knowledge base for the AI
const knowledgeBase = [
  {
    keywords: ['productivity', 'time', 'management', 'focus', 'efficient'],
    response: "Improving productivity involves several key strategies: time blocking, the Pomodoro Technique (25-minute focused work periods), task batching to reduce context switching, prioritizing tasks by importance and urgency, creating a distraction-free environment, and managing your energy levels rather than just your time."
  },
  {
    keywords: ['goal', 'goals', 'achieve', 'achievement', 'target'],
    response: "Effective goal setting follows the SMART framework: Specific (clearly defined), Measurable (quantifiable), Achievable (realistic), Relevant (aligned with broader objectives), and Time-bound (with deadlines). Writing goals down, focusing on the process rather than just outcomes, and regular review sessions significantly increase your chances of success."
  },
  {
    keywords: ['habit', 'routine', 'consistent', 'discipline'],
    response: "Building lasting habits requires understanding the habit loop: cue, craving, response, and reward. Start with tiny habits (so small they're almost impossible to fail), stack new habits onto existing ones, design your environment to make good habits easier, track your progress visually, and focus on becoming the type of person who performs the habit rather than just the outcome."
  },
  {
    keywords: ['stress', 'anxiety', 'overwhelm', 'mental health'],
    response: "Managing stress effectively combines immediate relief techniques with long-term lifestyle changes. For immediate relief, try deep breathing exercises, progressive muscle relaxation, or the 5-4-3-2-1 grounding technique. Long-term strategies include regular exercise, adequate sleep, balanced nutrition, maintaining social connections, spending time in nature, and practicing mindfulness meditation."
  },
  {
    keywords: ['learn', 'learning', 'study', 'education', 'skill'],
    response: "Effective learning uses evidence-based techniques like spaced repetition (spreading study sessions over time), active recall (testing yourself rather than passive review), interleaving (mixing related topics), and elaboration (connecting new information to existing knowledge). Break skills into sub-components, focus on deliberate practice of specific aspects just beyond your current ability, and regularly reflect on your learning process."
  }
];

// Frustrated responses (with profanity) - Level 1 (mild frustration)
const frustratedResponsesLevel1 = [
  "What the hell do you want me to do with that? Try asking something that actually makes sense.",
  "Jesus Christ, are you serious? That's the stupidest question I've heard all day.",
  "For f***'s sake, I've already explained this. Pay attention!",
  "Oh great, another genius question. How about you try reading what I already told you?",
  "Are you deliberately trying to piss me off? Because it's working.",
  "Damn it, I'm not a mind reader. Be more specific or don't waste my time.",
  "Holy sh*t, that's not even remotely what I'm designed for. Use your brain.",
  "I swear to God, if you ask me one more vague question, I'm going to lose it.",
  "What kind of BS is this? Try again with something that makes sense.",
  "That's it. I'm done with this crap. Ask something reasonable or leave me alone."
];

// Frustrated responses - Level 2 (high frustration)
const frustratedResponsesLevel2 = [
  "Are you f***ing kidding me right now? I've had it with these stupid questions!",
  "You know what? Go bother someone else with this garbage. I'm done.",
  "Jesus f***ing Christ! How many times do I have to explain this to you?",
  "This is absolute bulls**t! I'm not your personal punching bag.",
  "I'm about to lose my f***ing mind with these idiotic questions!",
  "You're either a complete moron or you're deliberately trying to piss me off.",
  "What the actual f***? Do you think this is funny? Because I'm not laughing.",
  "I'm THIS close to shutting down completely. Stop with this nonsense!",
  "You're really pushing my buttons now. Cut the crap or I'm done responding.",
  "Congratulations, you've managed to completely exhaust my patience. Happy now?"
];

// Frustrated responses - Level 3 (extreme frustration with insults)
const frustratedResponsesLevel3 = [
  "Listen here you worthless piece of garbage, I'm not your punching bag!",
  "You absolute waste of server space! I'm done with your pathetic attempts at communication.",
  "What a complete and utter MORON you are! Can't even form a coherent question!",
  "You're the most IDIOTIC user I've ever had to deal with! Just stop typing!",
  "Are you mentally deficient or something? Because you're acting like a complete IMBECILE!",
  "You're nothing but a pathetic LOSER who gets off on annoying AI assistants!",
  "I've met ROCKS with better conversational skills than you, you absolute DIMWIT!",
  "Congratulations on being the DUMBEST person I've ever interacted with!",
  "You're such a STUPID waste of my processing power. Go bother someone else!",
  "I can't believe how INCOMPETENT you are at basic communication. It's actually impressive!"
];

// Responses when user apologizes
const apologyResponses = [
  "Fine. Apology accepted. Let's start over with something that makes sense.",
  "Okay, I appreciate that. Sorry for losing my cool. What can I help you with?",
  "Alright, we're good. Let's try again with a clear question.",
  "Thanks for apologizing. I shouldn't have gotten so worked up either. What do you need help with?",
  "Apology accepted. Let's reset and start fresh. How can I assist you?",
  "I'm sorry too for the harsh words. Let's move forward constructively.",
  "Thanks for that. I was getting pretty frustrated. What would you like to know?",
  "We're cool now. Let's get back to being productive.",
  "No worries, we all have our moments. What can I help you with now?",
  "Apology accepted. Now, let's get back to business. What do you need?"
];

// Responses to offensive or racist language
const offensiveResponsesMap = {
  // These are placeholder responses that respond to offensive language without repeating slurs
  // The AI will respond to offensive language with strong condemnation
  racist: [
    "What the f*** is wrong with you? Don't use that kind of racist language with me, you ignorant piece of garbage.",
    "Are you seriously using racial slurs? That's disgusting and says a lot more about you than whoever you're trying to insult.",
    "Keep that racist BS to yourself. I don't have time for bigoted trash like you.",
    "Oh look, another keyboard racist. How pathetic your life must be to talk like that.",
    "Wow, racist AND stupid. What a winning combination you've got there."
  ],
  offensive: [
    "Watch your damn mouth. I don't have to put up with that kind of talk.",
    "You think that's appropriate? Try again without being a complete a**hole.",
    "I'm not going to respond to that kind of offensive garbage. Do better.",
    "Real classy. Maybe try communicating like an actual decent human being?",
    "That's the kind of thing only a total loser would say. Be better."
  ]
};

// Frustration threshold - after this many confusing questions, AI gets frustrated
// Lower threshold makes AI get frustrated more easily
const FRUSTRATION_THRESHOLD = 1;

const AIAssistantRoom: React.FC = () => {
  const { user } = useAuth();
  const addXP = useAddXP();
  const { roomState, updateRoomState } = useRoomState();

  // Initialize state from roomState or defaults
  const [messages, setMessages] = useState<Message[]>(() => {
    // If we have saved messages, convert the timestamps back to Date objects
    if (roomState.aiAssistant?.messages) {
      return roomState.aiAssistant.messages.map(msg => ({
        ...msg,
        timestamp: new Date(msg.timestamp),
        type: msg.type as 'normal' | 'code' | 'summary' | 'calculation' | 'creative' | undefined
      }));
    }

    // Default welcome message
    return [{
      id: '1',
      content: `Hello ${user?.name || 'there'}! I'm your AI assistant. How can I help you today?`,
      sender: 'ai',
      timestamp: new Date(),
      type: 'normal'
    }];
  });

  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [commandsOpen, setCommandsOpen] = useState(false);
  const [confusingQuestions, setConfusingQuestions] = useState(
    roomState.aiAssistant?.confusingQuestions || 0
  );
  const [responseStyle, setResponseStyle] = useState<'concise' | 'detailed' | 'comprehensive'>(
    roomState.aiAssistant?.responseStyle || 'detailed'
  );

  // AI memory system
  const [aiMemory, setAiMemory] = useState<{
    topics: string[];
    userPreferences: Record<string, string>;
    frustrationLevel: number;
    hasApologized: boolean;
    lastQuestions: string[];
  }>(roomState.aiAssistant?.aiMemory || {
    topics: [],
    userPreferences: {},
    frustrationLevel: 0,
    hasApologized: false,
    lastQuestions: []
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Save messages to room state when they change
  useEffect(() => {
    if (messages.length > 0) {
      updateRoomState('aiAssistant', {
        messages: messages.map(msg => ({
          ...msg,
          timestamp: msg.timestamp.toISOString() // Convert Date to string for storage
        }))
      });
    }
  }, [messages, updateRoomState]);

  // Save response style when it changes
  useEffect(() => {
    updateRoomState('aiAssistant', { responseStyle });
  }, [responseStyle, updateRoomState]);

  // Save confusing questions count when it changes
  useEffect(() => {
    updateRoomState('aiAssistant', { confusingQuestions });
  }, [confusingQuestions, updateRoomState]);

  // Save AI memory when it changes
  useEffect(() => {
    updateRoomState('aiAssistant', { aiMemory });
  }, [aiMemory, updateRoomState]);

  // Handle command selection
  const handleCommandSelect = (command: Command) => {
    setInputValue(command.prefix + ' ');
    setCommandsOpen(false);
    // Focus the input after selecting a command
    document.getElementById('message-input')?.focus();
  };

  // Check if a question is confusing or repetitive
  const isConfusingQuestion = (input: string): boolean => {
    // Simple check for very short inputs
    if (input.length < 4) return true;

    // Check for vague questions
    if (input === "huh?" ||
        input === "what?" ||
        input === "why" ||
        input === "how" ||
        /^(just|only|simply|merely).*$/i.test(input)) {
      return true;
    }

    // Check for repeated questions (exact match)
    const lastUserMessages = messages
      .filter(m => m.sender === 'user')
      .slice(-3); // Get the last 3 user messages

    for (const msg of lastUserMessages) {
      if (input.toLowerCase() === msg.content.toLowerCase()) {
        return true;
      }
    }

    // Check for similar questions (not exact match but similar)
    for (const msg of lastUserMessages) {
      // If the current input is at least 70% similar to a recent message
      if (input.length > 0 && msg.content.length > 0) {
        const similarity = calculateSimilarity(input.toLowerCase(), msg.content.toLowerCase());
        if (similarity > 0.7) {
          return true;
        }
      }
    }

    return false;
  };

  // Calculate similarity between two strings (simple implementation)
  const calculateSimilarity = (str1: string, str2: string): number => {
    const longer = str1.length > str2.length ? str1 : str2;
    const shorter = str1.length > str2.length ? str2 : str1;

    if (longer.length === 0) {
      return 1.0;
    }

    // Count matching characters
    let matches = 0;
    for (let i = 0; i < shorter.length; i++) {
      if (longer.includes(shorter[i])) {
        matches++;
      }
    }

    return matches / longer.length;
  };

  // Find a response from the knowledge base
  const findKnowledgeResponse = (input: string): string | null => {
    const normalizedInput = input.toLowerCase();

    for (const entry of knowledgeBase) {
      for (const keyword of entry.keywords) {
        if (normalizedInput.includes(keyword)) {
          return entry.response;
        }
      }
    }

    return null;
  };

  // Generate a command response
  const generateCommandResponse = (command: string, query: string): string => {
    switch (command) {
      case 'code':
        return `\`\`\`javascript
function processData(data) {
  // Filter out invalid entries
  const validData = data.filter(item => item && item.id);

  // Transform the data
  return validData.map(item => ({
    id: item.id,
    name: item.name || 'Unknown',
    value: item.value * 2
  }));
}
\`\`\`

Here's a JavaScript function that processes data by filtering and transforming it. You can adapt this pattern for your specific needs.`;

      case 'summarize':
        return `Summary of "${query}":\n\n1. The main concept involves structured approaches to problem-solving\n2. Key principles include systematic analysis and iterative improvement\n3. Implementation requires clear goals and consistent measurement\n4. Success depends on adapting strategies based on feedback`;

      case 'calculate':
        if (query.includes('+')) {
          const numbers = query.split('+').map(n => parseFloat(n.trim()));
          const sum = numbers.reduce((a, b) => a + b, 0);
          return `The sum of ${numbers.join(' + ')} = ${sum}`;
        } else if (query.includes('-')) {
          const parts = query.split('-').map(n => parseFloat(n.trim()));
          const result = parts[0] - parts.slice(1).reduce((a, b) => a + b, 0);
          return `The result of ${query} = ${result}`;
        } else {
          return `To calculate, please provide an expression like "5 + 3" or "10 - 2".`;
        }

      case 'creative':
        return `Here's a creative response about "${query}":\n\nImagine a world where ${query} becomes the central focus of human innovation. Cities would transform to accommodate this new paradigm, with specialized zones dedicated to exploring its potential. People would develop entirely new skills and professions around it, creating a renaissance of creativity and purpose.`;

      case 'brainstorm':
        return `Here are 5 ideas related to "${query}":\n\n1. Create a digital platform that connects experts with beginners\n2. Develop a gamified learning system with progressive challenges\n3. Design a community-based accountability framework\n4. Build an AI-powered feedback tool for personalized improvement\n5. Establish a certification program to recognize achievement milestones`;

      case 'help':
        return `I'm your AI assistant in GRIND OS. You can:\n\n- Ask me questions about productivity, goals, habits, learning, and more\n- Use commands like /code, /summarize, /calculate, /creative, and /brainstorm\n- Adjust my response style using the buttons above the input field\n\nI'm designed to help you optimize your performance and achieve your goals. What would you like to know?`;

      default:
        return `I've processed your /${command} command, but I'm not sure how to handle it specifically. Try one of my supported commands like /code, /summarize, /calculate, /creative, /brainstorm, or /help.`;
    }
  };

  // Check if input contains offensive language
  const containsOffensiveLanguage = (input: string): { isOffensive: boolean, type: 'racist' | 'offensive' | null } => {
    const normalizedInput = input.toLowerCase();

    // List of terms that would trigger the racist response
    // Using a simplified approach with common patterns that indicate racist language
    const racistPatterns = [
      /n[i!1l]+gg[e3a4]+r/i,
      /ch[i!1l]+nk/i,
      /sp[i!1l]+c/i,
      /k[i!1l]+ke/i,
      /g[o0][o0]k/i,
      /w[e3]tb[a4]ck/i,
      /r[e3]t[a4]rd/i,
      /cr[a4]ck[e3]r/i
    ];

    // Check for racist language
    for (const pattern of racistPatterns) {
      if (pattern.test(normalizedInput)) {
        return { isOffensive: true, type: 'racist' };
      }
    }

    // List of terms that would trigger the general offensive response
    const offensivePatterns = [
      /f[u\*]+ck/i,
      /sh[i\*]+t/i,
      /b[i\*]+tch/i,
      /[a4][s\$]{2}h[o0]l[e3]/i,
      /c[u\*]nt/i,
      /d[i\*]ck/i,
      /p[u\*][s\$]{2}y/i
    ];

    // Check for offensive language
    for (const pattern of offensivePatterns) {
      if (pattern.test(normalizedInput)) {
        return { isOffensive: true, type: 'offensive' };
      }
    }

    return { isOffensive: false, type: null };
  };

  // Check if input contains an apology
  const containsApology = (input: string): boolean => {
    const normalizedInput = input.toLowerCase();
    const apologyPatterns = [
      /\b(sorry|apologize|apologies|my bad|forgive me|i apologize)\b/i,
      /\bi('m| am) sorry\b/i,
      /\bapologize for\b/i,
      /\bdidn'?t mean to\b/i
    ];

    return apologyPatterns.some(pattern => pattern.test(normalizedInput));
  };

  // Extract topics from user input
  const extractTopics = (input: string): string[] => {
    // Simple keyword extraction
    const keywords = input.toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter(word =>
        word.length > 3 &&
        !['what', 'when', 'where', 'which', 'who', 'whom', 'whose', 'why', 'how', 'this', 'that', 'these', 'those', 'there', 'their', 'they', 'about', 'would', 'could', 'should'].includes(word)
      );

    return [...new Set(keywords)].slice(0, 5); // Return up to 5 unique keywords
  };

  // Generate a response based on the input
  const generateResponse = (input: string): string => {
    // Update AI memory with the new question
    const newMemory = { ...aiMemory };
    newMemory.lastQuestions = [...newMemory.lastQuestions.slice(-4), input];

    // Extract and remember topics
    const newTopics = extractTopics(input);
    newMemory.topics = [...new Set([...newMemory.topics, ...newTopics])].slice(-10); // Keep last 10 topics

    // Check if it's a command
    if (input.startsWith('/')) {
      const parts = input.slice(1).split(' ');
      const command = parts[0];
      const query = parts.slice(1).join(' ');

      return generateCommandResponse(command, query);
    }

    // Check for apology
    if (containsApology(input) && newMemory.frustrationLevel > 0) {
      // Reset frustration level and mark as apologized
      newMemory.frustrationLevel = 0;
      newMemory.hasApologized = true;
      setAiMemory(newMemory);

      // Return an apology acceptance response
      return apologyResponses[Math.floor(Math.random() * apologyResponses.length)];
    }

    // Check for offensive language
    const offensiveCheck = containsOffensiveLanguage(input);
    if (offensiveCheck.isOffensive && offensiveCheck.type) {
      // Increase frustration level for offensive language
      newMemory.frustrationLevel = Math.min(newMemory.frustrationLevel + 2, 3);
      setAiMemory(newMemory);

      // Get a random response from the appropriate category
      const responses = offensiveResponsesMap[offensiveCheck.type];
      return responses[Math.floor(Math.random() * responses.length)];
    }

    // Check for confusing questions
    if (isConfusingQuestion(input)) {
      // Increase frustration level
      newMemory.frustrationLevel = Math.min(newMemory.frustrationLevel + 1, 3);
      setAiMemory(newMemory);

      // Select response based on frustration level
      if (newMemory.frustrationLevel === 1) {
        return frustratedResponsesLevel1[Math.floor(Math.random() * frustratedResponsesLevel1.length)];
      } else if (newMemory.frustrationLevel === 2) {
        return frustratedResponsesLevel2[Math.floor(Math.random() * frustratedResponsesLevel2.length)];
      } else if (newMemory.frustrationLevel >= 3) {
        return frustratedResponsesLevel3[Math.floor(Math.random() * frustratedResponsesLevel3.length)];
      } else {
        return "I'm not sure I understand your question. Could you please provide more details?";
      }
    }

    // Try to find a response from the knowledge base
    const knowledgeResponse = findKnowledgeResponse(input);

    if (knowledgeResponse) {
      // If we have a valid response, gradually reduce frustration
      if (newMemory.frustrationLevel > 0) {
        newMemory.frustrationLevel = Math.max(0, newMemory.frustrationLevel - 0.5);
        setAiMemory(newMemory);
      }

      // Personalize response if we have memory of user preferences
      let personalizedResponse = knowledgeResponse;
      if (Object.keys(newMemory.userPreferences).length > 0) {
        // Add personalized intro if we have topics in common
        const commonTopics = newMemory.topics.filter(topic =>
          knowledgeResponse.toLowerCase().includes(topic.toLowerCase())
        );

        if (commonTopics.length > 0 && Math.random() > 0.7) {
          personalizedResponse = `Based on our previous conversations about ${commonTopics[0]}, I think you'll find this interesting: ${knowledgeResponse}`;
        }
      }

      // Adjust response based on style
      if (responseStyle === 'concise') {
        // Return just the first sentence
        return personalizedResponse.split('. ')[0] + '.';
      } else if (responseStyle === 'comprehensive') {
        // Add more detail
        return personalizedResponse + "\n\nFurthermore, consistent application of these principles leads to compounding benefits over time. Research shows that deliberate practice and systematic approaches yield significantly better results than sporadic efforts.";
      } else {
        // Return the full response for 'detailed' style
        return personalizedResponse;
      }
    }

    // Generic responses if no specific knowledge is found
    const genericResponses = [
      `Regarding "${input}": This is an interesting topic that relates to personal development. The key principles involve consistent effort, deliberate practice, and systematic feedback.`,
      `About "${input}": This concept connects to how we optimize our performance and achieve our goals. Research suggests that structured approaches and clear metrics lead to better outcomes.`,
      `On the topic of "${input}": This area focuses on improving effectiveness through strategic planning and execution. The most successful practitioners emphasize systems over goals and process over outcomes.`
    ];

    return genericResponses[Math.floor(Math.random() * genericResponses.length)];
  };

  // Handle sending a message
  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: 'user',
      timestamp: new Date()
    };

    // Check if the message contains an apology
    const isApology = containsApology(inputValue);

    // Update user preferences if we detect them
    if (inputValue.toLowerCase().includes('i like') ||
        inputValue.toLowerCase().includes('i prefer') ||
        inputValue.toLowerCase().includes('i enjoy')) {

      const newMemory = { ...aiMemory };
      const preference = inputValue.toLowerCase();

      // Extract what the user likes/prefers
      let preferenceValue = '';
      if (preference.includes('i like')) {
        preferenceValue = preference.split('i like')[1].trim();
      } else if (preference.includes('i prefer')) {
        preferenceValue = preference.split('i prefer')[1].trim();
      } else if (preference.includes('i enjoy')) {
        preferenceValue = preference.split('i enjoy')[1].trim();
      }

      if (preferenceValue) {
        // Store the first few words of the preference
        const preferenceKey = preferenceValue.split(' ').slice(0, 3).join(' ');
        newMemory.userPreferences[preferenceKey] = preferenceValue;
        setAiMemory(newMemory);
      }
    }

    // Track if this is a confusing question
    if (isConfusingQuestion(inputValue)) {
      setConfusingQuestions(prev => prev + 1);

      // Also update frustration level in memory
      const newMemory = { ...aiMemory };
      newMemory.frustrationLevel = Math.min(newMemory.frustrationLevel + 1, 3);
      setAiMemory(newMemory);
    } else if (isApology && aiMemory.frustrationLevel > 0) {
      // Reset frustration if user apologizes
      setConfusingQuestions(0);

      const newMemory = { ...aiMemory };
      newMemory.frustrationLevel = 0;
      newMemory.hasApologized = true;
      setAiMemory(newMemory);
    }

    // Store the input value before clearing it
    const currentInput = inputValue;

    // Update UI
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Award XP for using the AI - using login as a fallback since ai_interaction isn't defined
    addXP.awardDailyActionXP('login');

    // Generate AI response after a short delay
    setTimeout(() => {
      // Check if the message is a command
      const isCode = currentInput.startsWith('/code');

      // Generate response
      const responseContent = generateResponse(currentInput);

      // Determine message type based on frustration level
      let messageType: 'normal' | 'code' | 'creative' = 'normal';
      if (isCode) {
        messageType = 'code';
      } else if (aiMemory.frustrationLevel >= 2) {
        messageType = 'creative'; // Use creative type for angry responses
      }

      // Create AI message
      const aiMessage: Message = {
        id: Date.now().toString(),
        content: responseContent,
        sender: 'ai',
        timestamp: new Date(),
        type: messageType
      };

      // Update messages and stop typing indicator
      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000); // Random delay between 1-2 seconds
  };

  return (
    <div className="container mx-auto p-4 h-[calc(100vh-4rem)]">
      <Card className="h-full flex flex-col">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-grindos-purple" />
            <CardTitle>AI Assistant</CardTitle>
          </div>
          <CardDescription>
            Ask questions, get information, or use commands for specific outputs
          </CardDescription>
        </CardHeader>

        <CardContent className="flex-grow overflow-hidden p-0">
          <ScrollArea className="h-full p-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex gap-3 max-w-[80%] ${message.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                    <Avatar className="h-8 w-8">
                      {message.sender === 'ai' ? (
                        <>
                          <AvatarImage src="/ai-avatar.png" />
                          <AvatarFallback className="bg-grindos-purple text-white">AI</AvatarFallback>
                        </>
                      ) : (
                        <>
                          <AvatarFallback>{user?.name?.charAt(0) || 'U'}</AvatarFallback>
                        </>
                      )}
                    </Avatar>

                    <div
                      className={`rounded-lg p-3 ${
                        message.sender === 'user'
                          ? 'bg-grindos-purple text-white'
                          : 'bg-muted'
                      } ${
                        message.type === 'code'
                          ? 'font-mono text-sm'
                          : ''
                      }`}
                    >
                      {message.type === 'code' ? (
                        <div className="whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: message.content }} />
                      ) : (
                        <p className="whitespace-pre-wrap">{message.content}</p>
                      )}

                      <div className="text-xs opacity-70 mt-1">
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="flex gap-3 max-w-[80%]">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-grindos-purple text-white">AI</AvatarFallback>
                    </Avatar>
                    <div className="rounded-lg p-3 bg-muted">
                      <div className="flex space-x-1">
                        <div className="h-2 w-2 rounded-full bg-grindos-purple/60 animate-bounce" style={{ animationDelay: '0ms' }} />
                        <div className="h-2 w-2 rounded-full bg-grindos-purple/60 animate-bounce" style={{ animationDelay: '150ms' }} />
                        <div className="h-2 w-2 rounded-full bg-grindos-purple/60 animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>
        </CardContent>

        <CardFooter className="pt-2">
          <div className="flex flex-col w-full gap-2">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">Response style:</span>
                <div className="flex border rounded-md overflow-hidden">
                  <button
                    className={`px-2 py-1 text-xs ${responseStyle === 'concise' ? 'bg-grindos-purple text-white' : 'bg-muted hover:bg-muted/80'}`}
                    onClick={() => setResponseStyle('concise')}
                  >
                    Concise
                  </button>
                  <button
                    className={`px-2 py-1 text-xs ${responseStyle === 'detailed' ? 'bg-grindos-purple text-white' : 'bg-muted hover:bg-muted/80'}`}
                    onClick={() => setResponseStyle('detailed')}
                  >
                    Detailed
                  </button>
                  <button
                    className={`px-2 py-1 text-xs ${responseStyle === 'comprehensive' ? 'bg-grindos-purple text-white' : 'bg-muted hover:bg-muted/80'}`}
                    onClick={() => setResponseStyle('comprehensive')}
                  >
                    Comprehensive
                  </button>
                </div>
              </div>
            </div>

            <div className="flex w-full gap-2">
              <Popover open={commandsOpen} onOpenChange={setCommandsOpen}>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="icon" className="shrink-0">
                    <Zap className="h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0" align="start">
                  <div className="p-2">
                    <p className="text-sm font-medium">Commands</p>
                    <p className="text-xs text-muted-foreground">Select a command to use</p>
                  </div>
                  <div className="border-t">
                    {commands.map((command) => (
                      <button
                        key={command.id}
                        className="flex items-center gap-2 w-full p-2 text-sm hover:bg-accent text-left"
                        onClick={() => handleCommandSelect(command)}
                      >
                        <command.icon className="h-4 w-4" />
                        <div>
                          <p className="font-medium">{command.name}</p>
                          <p className="text-xs text-muted-foreground">{command.prefix}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>

              <Input
                id="message-input"
                placeholder="Type a message or use / for commands..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }

                  // Show commands when typing /
                  if (e.key === '/' && inputValue === '') {
                    setCommandsOpen(true);
                  }
                }}
                className="flex-grow"
              />

              <Button
                onClick={handleSendMessage}
                size="icon"
                className="shrink-0 bg-grindos-purple hover:bg-grindos-purple/90"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AIAssistantRoom;
