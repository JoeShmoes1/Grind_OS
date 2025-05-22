import { MemoryItem } from './aiMemoryUtils';
import { KnowledgeEntry, findRelevantKnowledge } from './aiKnowledgeBase';

// Define response types
export interface ResponseOptions {
  includeMemories?: boolean;
  personalizeResponse?: boolean;
  responseStyle?: 'concise' | 'detailed' | 'comprehensive';
  emotionalTone?: 'neutral' | 'enthusiastic' | 'empathetic' | 'professional' | 'frustrated';
  formatOutput?: boolean;
}

// Topic detection patterns
const topicPatterns = [
  { topic: 'productivity', patterns: [/productiv/i, /time management/i, /efficien/i, /focus/i, /distract/i, /procrastinat/i] },
  { topic: 'goals', patterns: [/goal/i, /objective/i, /target/i, /aim/i, /achiev/i, /aspir/i] },
  { topic: 'habits', patterns: [/habit/i, /routine/i, /daily/i, /consistent/i, /practice/i, /discipline/i] },
  { topic: 'mental health', patterns: [/mental health/i, /stress/i, /anxiety/i, /depress/i, /emotion/i, /mood/i, /therapy/i] },
  { topic: 'relationships', patterns: [/relationship/i, /communicat/i, /friend/i, /family/i, /partner/i, /social/i] },
  { topic: 'career', patterns: [/career/i, /job/i, /work/i, /profession/i, /interview/i, /resume/i, /promotion/i] },
  { topic: 'finance', patterns: [/financ/i, /money/i, /budget/i, /invest/i, /save/i, /spend/i, /debt/i] },
  { topic: 'health', patterns: [/health/i, /fitness/i, /exercise/i, /workout/i, /train/i, /strength/i, /cardio/i] },
  { topic: 'nutrition', patterns: [/nutrition/i, /diet/i, /food/i, /eat/i, /meal/i, /calorie/i, /weight/i] },
  { topic: 'sleep', patterns: [/sleep/i, /rest/i, /tired/i, /fatigue/i, /insomnia/i, /nap/i, /bedtime/i] },
  { topic: 'learning', patterns: [/learn/i, /study/i, /education/i, /knowledge/i, /skill/i, /course/i, /book/i] }
];

// Detect topics in a query
export const detectTopics = (query: string): string[] => {
  const detectedTopics: string[] = [];
  
  topicPatterns.forEach(({ topic, patterns }) => {
    if (patterns.some(pattern => pattern.test(query))) {
      detectedTopics.push(topic);
    }
  });
  
  return detectedTopics;
};

// Check if a query is a command
export const isCommand = (query: string): boolean => {
  return /^\/\w+/.test(query);
};

// Check if a query is confusing or vague
export const isConfusingQuery = (query: string): boolean => {
  const confusingPatterns = [
    /^(huh|what|idk|um|hmm)\??$/i,
    /^(just|only|simply|merely).*$/i,
    /^.{1,3}$/,
    /^(it|that|this|they|them)$/i,
    /^(can you|could you|would you).{0,10}$/i
  ];
  
  return confusingPatterns.some(pattern => pattern.test(query));
};

// Generate a personalized greeting based on memories
export const generatePersonalizedGreeting = (
  memories: MemoryItem[],
  userName: string = 'there'
): string => {
  // Find name in memories if available
  const nameMemory = memories.find(mem => 
    mem.category === 'personal' && 
    mem.content.toLowerCase().includes('name')
  );
  
  if (nameMemory) {
    const nameParts = nameMemory.content.split(' ');
    const nameIndex = nameParts.findIndex(part => part.toLowerCase() === 'name');
    if (nameIndex >= 0 && nameIndex < nameParts.length - 2) {
      userName = nameParts[nameIndex + 2];
    }
  }
  
  const greetings = [
    `Hello ${userName}!`,
    `Hi ${userName}!`,
    `Good to see you, ${userName}!`,
    `Welcome back, ${userName}!`,
    `Hey ${userName}!`
  ];
  
  return greetings[Math.floor(Math.random() * greetings.length)];
};

// Generate a frustrated response
export const generateFrustratedResponse = (): string => {
  const frustratedResponses = [
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
  
  return frustratedResponses[Math.floor(Math.random() * frustratedResponses.length)];
};

// Format response with markdown
export const formatResponse = (response: string): string => {
  // Add bold to key points
  response = response.replace(/\*\*([^*]+)\*\*/g, '**$1**');
  
  // Add bullet points to lists
  response = response.replace(/^\d+\.\s+/gm, '• ');
  
  return response;
};

// Generate a response based on knowledge entries
export const generateKnowledgeResponse = (
  entries: KnowledgeEntry[],
  options: ResponseOptions = {}
): string => {
  if (entries.length === 0) {
    return "I don't have specific information on that topic, but I'd be happy to discuss it based on general principles.";
  }
  
  // Use the most relevant entry
  const mainEntry = entries[0];
  let response = mainEntry.answer;
  
  // Adjust response based on desired length
  if (options.responseStyle === 'concise') {
    // Extract first paragraph or first few sentences
    const firstParagraph = response.split('\n\n')[0];
    response = firstParagraph;
  } else if (options.responseStyle === 'comprehensive' && entries.length > 1) {
    // Combine information from multiple entries
    response += "\n\n**Additional Information:**\n\n";
    for (let i = 1; i < entries.length; i++) {
      const paragraphs = entries[i].answer.split('\n\n');
      response += paragraphs[0] + "\n\n";
    }
  }
  
  // Format the response if requested
  if (options.formatOutput) {
    response = formatResponse(response);
  }
  
  return response;
};

// Generate a personalized response incorporating memories
export const generatePersonalizedResponse = (
  baseResponse: string,
  memories: MemoryItem[],
  query: string
): string => {
  if (memories.length === 0) return baseResponse;
  
  // Find relevant memories to incorporate
  const relevantMemories = memories.filter(mem => {
    const memoryContent = mem.content.toLowerCase();
    const queryWords = query.toLowerCase().split(/\s+/);
    
    // Check if memory content contains any query words
    return queryWords.some(word => 
      word.length > 3 && memoryContent.includes(word)
    );
  });
  
  if (relevantMemories.length === 0) return baseResponse;
  
  // Add personalized introduction
  let personalizedIntro = "";
  
  // Check for preference memories
  const preferenceMemories = relevantMemories.filter(mem => mem.category === 'preference');
  if (preferenceMemories.length > 0) {
    const preference = preferenceMemories[0];
    if (preference.content.includes('likes')) {
      personalizedIntro = `Since you've mentioned you like ${preference.content.split('likes ')[1]}, `;
    } else if (preference.content.includes('dislikes')) {
      personalizedIntro = `Keeping in mind your preference to avoid ${preference.content.split('dislikes ')[1]}, `;
    }
  }
  
  // Check for goal memories
  const goalMemories = relevantMemories.filter(mem => mem.category === 'goal');
  if (goalMemories.length > 0 && !personalizedIntro) {
    const goal = goalMemories[0];
    personalizedIntro = `Considering your goal to ${goal.content.split('wants to ')[1]}, `;
  }
  
  // If we have a personalized intro, add it to the response
  if (personalizedIntro) {
    return personalizedIntro + baseResponse.charAt(0).toLowerCase() + baseResponse.slice(1);
  }
  
  return baseResponse;
};

// Main response generation function
export const generateResponse = (
  query: string,
  memories: MemoryItem[] = [],
  options: ResponseOptions = {
    includeMemories: true,
    personalizeResponse: true,
    responseStyle: 'detailed',
    emotionalTone: 'neutral',
    formatOutput: true
  }
): string => {
  // Check for confusing queries
  if (isConfusingQuery(query)) {
    if (options.emotionalTone === 'frustrated') {
      return generateFrustratedResponse();
    } else {
      return "I'm not sure I understand your question. Could you please provide more details or rephrase it?";
    }
  }
  
  // Detect topics in the query
  const topics = detectTopics(query);
  
  // Find relevant knowledge
  const relevantKnowledge = findRelevantKnowledge(query);
  
  // Generate base response from knowledge
  let response = generateKnowledgeResponse(relevantKnowledge, options);
  
  // If no relevant knowledge was found, generate a generic response
  if (relevantKnowledge.length === 0) {
    const genericResponses = [
      `I don't have specific information about ${query}, but I'd be happy to discuss general principles or related topics.`,
      `That's an interesting question about ${query}. While I don't have detailed information on this specific topic, I can help you explore it further.`,
      `I don't have specialized knowledge about ${query}, but I can help you find resources or discuss related concepts.`
    ];
    
    response = genericResponses[Math.floor(Math.random() * genericResponses.length)];
  }
  
  // Personalize the response if requested
  if (options.personalizeResponse && options.includeMemories) {
    response = generatePersonalizedResponse(response, memories, query);
  }
  
  return response;
};
