// Define knowledge base types
export interface KnowledgeEntry {
  topics: string[];
  question: string;
  answer: string;
  tags?: string[];
}

// Knowledge base entries
export const knowledgeBase: KnowledgeEntry[] = [
  // Productivity
  {
    topics: ['productivity', 'time management'],
    question: 'How can I improve my productivity?',
    answer: `To improve your productivity, consider these evidence-based strategies:

1. **Time Blocking**: Dedicate specific time blocks for different tasks to maintain focus.
2. **Pomodoro Technique**: Work in focused 25-minute intervals with short breaks.
3. **Task Batching**: Group similar tasks together to reduce context switching.
4. **Priority Matrix**: Categorize tasks by urgency and importance.
5. **Environment Optimization**: Create a distraction-free workspace.
6. **Energy Management**: Schedule demanding tasks during your peak energy hours.
7. **Regular Breaks**: Take short breaks to prevent burnout and maintain focus.
8. **Digital Minimalism**: Reduce notifications and digital distractions.

The most effective approach combines multiple strategies tailored to your personal work style and preferences.`,
    tags: ['productivity', 'time management', 'focus', 'efficiency']
  },
  {
    topics: ['productivity', 'procrastination'],
    question: 'How do I stop procrastinating?',
    answer: `Overcoming procrastination requires understanding its root causes and implementing targeted strategies:

1. **Break Tasks Down**: Divide large tasks into smaller, manageable steps.
2. **Two-Minute Rule**: If a task takes less than two minutes, do it immediately.
3. **Implementation Intentions**: Create specific "if-then" plans for when and where you'll complete tasks.
4. **Temptation Bundling**: Pair unpleasant tasks with activities you enjoy.
5. **Accountability Partner**: Share your goals with someone who will hold you accountable.
6. **Eliminate Distractions**: Use website blockers or put your phone in another room.
7. **Address Perfectionism**: Recognize that perfect is the enemy of done.
8. **Forgive Yourself**: Self-compassion after procrastinating leads to better outcomes than self-criticism.

Remember that procrastination is often emotional, not logical - it's about avoiding negative feelings associated with tasks.`,
    tags: ['procrastination', 'productivity', 'psychology', 'habits']
  },
  
  // Goal Setting
  {
    topics: ['goals', 'goal setting'],
    question: 'How do I set effective goals?',
    answer: `Effective goal setting follows the SMART framework and incorporates psychological principles:

1. **Specific**: Define exactly what you want to accomplish.
2. **Measurable**: Include concrete criteria to measure progress.
3. **Achievable**: Goals should stretch you but remain possible.
4. **Relevant**: Align with your broader objectives and values.
5. **Time-bound**: Set a deadline to create urgency.

Additional principles:
- **Write Goals Down**: Increases commitment and clarity.
- **Process vs. Outcome**: Focus on the actions within your control.
- **Implementation Intentions**: Plan when, where, and how you'll take action.
- **Visualization**: Mentally rehearse achieving your goals.
- **Regular Review**: Schedule weekly check-ins to assess progress.
- **Adjust As Needed**: Be flexible and modify goals based on feedback.

Research shows that challenging but attainable goals lead to higher performance than easy or vague goals.`,
    tags: ['goals', 'planning', 'achievement', 'SMART goals']
  },
  
  // Habits
  {
    topics: ['habits', 'habit formation'],
    question: 'How do I build new habits?',
    answer: `Building lasting habits requires understanding the habit loop and applying evidence-based strategies:

1. **Start Tiny**: Begin with a habit so small it's almost impossible to fail (e.g., one pushup).
2. **Habit Stacking**: Attach new habits to existing ones (e.g., "After I brush my teeth, I will meditate for 2 minutes").
3. **Environment Design**: Make good habits obvious and easy; make bad habits invisible and difficult.
4. **Implementation Intentions**: Specify when and where you'll perform the habit.
5. **Reward System**: Create immediate rewards for completing your habit.
6. **Habit Tracking**: Use a visual system to maintain a streak.
7. **Accountability**: Share your habit goals with others.
8. **Identity-Based Habits**: Focus on becoming the type of person who performs the habit.

Remember that consistency matters more than intensity. Research shows it takes anywhere from 18 to 254 days to form a habit, with an average of 66 days.`,
    tags: ['habits', 'behavior change', 'routine', 'consistency']
  },
  
  // Mental Health
  {
    topics: ['mental health', 'stress', 'anxiety'],
    question: 'How can I reduce stress and anxiety?',
    answer: `Managing stress and anxiety effectively combines immediate relief techniques with long-term lifestyle changes:

**Immediate Relief Techniques:**
1. **Deep Breathing**: Practice 4-7-8 breathing (inhale for 4, hold for 7, exhale for 8).
2. **Progressive Muscle Relaxation**: Tense and release muscle groups sequentially.
3. **Grounding Exercises**: Use the 5-4-3-2-1 technique (notice 5 things you see, 4 things you feel, etc.).
4. **Mindfulness Meditation**: Focus on the present moment without judgment.

**Long-Term Strategies:**
1. **Regular Exercise**: Even 30 minutes of moderate activity reduces stress hormones.
2. **Adequate Sleep**: Prioritize 7-9 hours of quality sleep.
3. **Balanced Nutrition**: Reduce caffeine, alcohol, and processed foods.
4. **Social Connection**: Maintain supportive relationships.
5. **Time in Nature**: Spend at least 20 minutes outdoors daily.
6. **Cognitive Restructuring**: Challenge negative thought patterns.
7. **Boundaries**: Learn to say no and protect your time.

If anxiety significantly impacts your daily functioning, consider professional support from a therapist or counselor.`,
    tags: ['mental health', 'stress management', 'anxiety', 'wellbeing']
  },
  
  // Relationships
  {
    topics: ['relationships', 'communication'],
    question: 'How can I improve my communication skills?',
    answer: `Effective communication combines several key skills that can be developed with practice:

**Active Listening:**
1. Give full attention without planning your response
2. Ask clarifying questions
3. Paraphrase to confirm understanding
4. Avoid interrupting

**Clear Expression:**
1. Be specific and concrete
2. Use "I" statements for feelings ("I feel..." instead of "You make me feel...")
3. Match your nonverbal cues with your message
4. Consider your audience and adapt accordingly

**Conflict Resolution:**
1. Address issues promptly but calmly
2. Focus on the problem, not the person
3. Seek to understand before being understood
4. Look for mutually beneficial solutions

**Digital Communication:**
1. Choose the appropriate medium for your message
2. Be concise but complete
3. Re-read before sending important messages
4. Be mindful of tone, which can be easily misinterpreted

Regular practice in various contexts will help these skills become second nature.`,
    tags: ['communication', 'relationships', 'social skills', 'conflict resolution']
  },
  
  // Career Development
  {
    topics: ['career', 'professional development'],
    question: 'How do I advance in my career?',
    answer: `Career advancement requires a strategic approach combining skill development, relationship building, and personal branding:

**Skill Development:**
1. Master your current role before seeking advancement
2. Identify skills needed for your target position
3. Pursue continuous learning through courses, certifications, and projects
4. Develop both technical and soft skills

**Relationship Building:**
1. Find mentors who can provide guidance and feedback
2. Build a diverse professional network
3. Contribute to team success and help others
4. Maintain relationships with former colleagues

**Strategic Visibility:**
1. Document your achievements with measurable results
2. Volunteer for high-visibility projects
3. Share your expertise through presentations or writing
4. Participate in industry events and professional organizations

**Career Management:**
1. Set clear, specific career goals with timelines
2. Regularly reassess your path and adjust as needed
3. Seek feedback and act on it constructively
4. Be prepared to create or recognize opportunities

Remember that career advancement isn't always linear—sometimes lateral moves or specialized experience can position you better for long-term growth.`,
    tags: ['career', 'professional development', 'leadership', 'networking']
  },
  
  // Finance
  {
    topics: ['finance', 'money management'],
    question: 'How do I manage my personal finances?',
    answer: `Effective personal finance management follows a structured approach:

**Foundation (First Priority):**
1. **Emergency Fund**: Save 3-6 months of essential expenses
2. **Budgeting**: Track income and expenses using the 50/30/20 rule (50% needs, 30% wants, 20% savings/debt)
3. **Debt Management**: Prioritize high-interest debt while making minimum payments on all debts

**Growth (Second Priority):**
1. **Retirement Savings**: Contribute to employer-matched plans first, then IRAs
2. **Tax Efficiency**: Utilize tax-advantaged accounts and deductions
3. **Insurance**: Secure appropriate health, life, disability, and property insurance

**Optimization (Third Priority):**
1. **Investment Strategy**: Develop a diversified portfolio aligned with your time horizon and risk tolerance
2. **Estate Planning**: Create a will and designate beneficiaries
3. **Tax Planning**: Implement strategies to minimize tax burden

**Continuous Improvement:**
1. **Financial Education**: Regularly update your knowledge
2. **Periodic Review**: Reassess your plan quarterly and after major life events
3. **Lifestyle Management**: Practice intentional spending aligned with your values

The most important factor in financial success is consistently applying these principles over time.`,
    tags: ['personal finance', 'budgeting', 'investing', 'money management']
  },
  
  // Health and Fitness
  {
    topics: ['health', 'fitness', 'exercise'],
    question: 'How can I start a fitness routine?',
    answer: `Starting a sustainable fitness routine involves thoughtful planning and gradual progression:

**Getting Started:**
1. **Consult a Professional**: Check with your doctor if you have health concerns
2. **Set Specific Goals**: Define what you want to achieve (strength, endurance, flexibility, etc.)
3. **Start Small**: Begin with manageable workouts (even 10-15 minutes)
4. **Choose Enjoyable Activities**: You're more likely to stick with exercises you like

**Balanced Program Components:**
1. **Cardiovascular Exercise**: 150 minutes of moderate activity weekly
2. **Strength Training**: 2-3 sessions weekly targeting major muscle groups
3. **Flexibility Work**: Regular stretching or yoga
4. **Rest Days**: Allow for recovery between intense workouts

**Implementation Strategies:**
1. **Schedule Workouts**: Block time on your calendar
2. **Track Progress**: Keep a workout journal or use a fitness app
3. **Find Accountability**: Exercise with a friend or join a class
4. **Prepare Environment**: Keep workout clothes and equipment ready

**Progression Principles:**
1. **Gradual Overload**: Slowly increase intensity, duration, or frequency
2. **Variety**: Change routines every 4-6 weeks to prevent plateaus
3. **Consistency Over Perfection**: A sustainable routine beats occasional intense workouts
4. **Listen to Your Body**: Adjust based on energy levels and recovery needs

Remember that the best fitness routine is one you can maintain consistently over time.`,
    tags: ['fitness', 'exercise', 'health', 'workout']
  },
  
  // Nutrition
  {
    topics: ['nutrition', 'diet', 'healthy eating'],
    question: 'What are the basics of healthy eating?',
    answer: `Healthy eating is built on core principles that can be adapted to different preferences:

**Foundational Guidelines:**
1. **Whole Foods**: Emphasize minimally processed foods
2. **Plant Focus**: Make fruits and vegetables half your plate
3. **Protein Quality**: Include varied protein sources (plant and/or animal)
4. **Healthy Fats**: Incorporate sources of omega-3s and monounsaturated fats
5. **Complex Carbohydrates**: Choose whole grains over refined options
6. **Hydration**: Drink primarily water, herbal tea, and other non-caloric beverages

**Practical Implementation:**
1. **Meal Planning**: Prepare balanced meals in advance
2. **Portion Awareness**: Use visual cues rather than strict measuring
3. **Mindful Eating**: Pay attention to hunger and fullness cues
4. **80/20 Approach**: Aim for nutritious choices 80% of the time
5. **Cooking Skills**: Learn basic techniques to prepare simple, healthy meals
6. **Gradual Changes**: Modify one eating habit at a time

**Personalization Factors:**
1. **Individual Needs**: Consider your age, activity level, and health conditions
2. **Cultural Preferences**: Adapt principles to your food traditions
3. **Sustainability**: Choose an approach you can maintain long-term
4. **Enjoyment**: Include foods you genuinely like

Remember that healthy eating is about consistent patterns rather than perfect adherence to rules.`,
    tags: ['nutrition', 'diet', 'healthy eating', 'food']
  },
  
  // Sleep
  {
    topics: ['sleep', 'rest'],
    question: 'How can I improve my sleep quality?',
    answer: `Optimizing sleep quality involves addressing both daytime habits and creating an effective bedtime routine:

**Daytime Habits:**
1. **Consistent Schedule**: Wake up and go to bed at the same times daily
2. **Light Exposure**: Get morning sunlight within an hour of waking
3. **Physical Activity**: Exercise regularly, but not within 1-2 hours of bedtime
4. **Caffeine Management**: Avoid caffeine 8-10 hours before bed
5. **Nap Wisely**: Keep naps under 30 minutes and before 3pm

**Evening Routine:**
1. **Wind-Down Period**: Begin relaxing 30-60 minutes before bed
2. **Blue Light Reduction**: Use night mode on devices or wear blue-blocking glasses
3. **Temperature Control**: Keep bedroom cool (65-68°F/18-20°C)
4. **Darkness**: Use blackout curtains or an eye mask
5. **Noise Management**: Use white noise or earplugs if needed

**Behavioral Strategies:**
1. **Worry Time**: Schedule time earlier in the day to address concerns
2. **Bed-Sleep Connection**: Use bed only for sleep and intimacy
3. **Relaxation Techniques**: Practice deep breathing or progressive muscle relaxation
4. **Consistency**: Maintain your routine even on weekends
5. **75-Minute Rule**: If you can't fall asleep after 20 minutes, get up and do something relaxing until sleepy

If sleep problems persist despite these measures, consider consulting a healthcare provider to rule out sleep disorders.`,
    tags: ['sleep', 'rest', 'health', 'circadian rhythm']
  },
  
  // Learning
  {
    topics: ['learning', 'study', 'education'],
    question: 'What are the most effective ways to learn new skills?',
    answer: `Effective learning combines evidence-based techniques with strategic practice:

**Core Learning Principles:**
1. **Spaced Repetition**: Spread study sessions over time rather than cramming
2. **Active Recall**: Test yourself rather than passively reviewing
3. **Interleaving**: Mix different but related topics or skills
4. **Elaboration**: Connect new information to what you already know
5. **Concrete Examples**: Apply abstract concepts to specific scenarios

**Skill Acquisition Framework:**
1. **Deconstruction**: Break the skill into sub-skills
2. **Selection**: Identify the 20% of sub-skills that deliver 80% of results
3. **Sequencing**: Determine the optimal learning order
4. **Stakes**: Create consequences for practice (accountability)
5. **Feedback**: Seek rapid, specific input on performance

**Practice Optimization:**
1. **Deliberate Practice**: Focus on specific aspects just beyond your current ability
2. **Distributed Practice**: Short, frequent sessions outperform marathon sessions
3. **Varied Conditions**: Practice in different contexts and situations
4. **Error-Focused**: Target weaknesses rather than reinforcing strengths
5. **Reflection**: Regularly assess what's working and what isn't

**Environmental Factors:**
1. **Distraction Management**: Create a focused learning environment
2. **Sleep Quality**: Prioritize sleep for memory consolidation
3. **Teaching**: Explain concepts to others to solidify understanding
4. **Community**: Join groups of fellow learners for motivation and insights

The most effective approach combines multiple techniques tailored to your learning style and the specific skill.`,
    tags: ['learning', 'education', 'skill acquisition', 'study techniques']
  }
];

// Function to find relevant knowledge entries based on a query
export const findRelevantKnowledge = (
  query: string,
  maxResults: number = 3
): KnowledgeEntry[] => {
  // Convert query to lowercase for case-insensitive matching
  const normalizedQuery = query.toLowerCase();
  
  // Score each knowledge entry based on relevance to the query
  const scoredEntries = knowledgeBase.map(entry => {
    let score = 0;
    
    // Check if query contains any topics from the entry
    entry.topics.forEach(topic => {
      if (normalizedQuery.includes(topic.toLowerCase())) {
        score += 5;
      }
    });
    
    // Check if query is similar to the question
    const questionWords = entry.question.toLowerCase().split(/\s+/);
    const queryWords = normalizedQuery.split(/\s+/);
    
    queryWords.forEach(word => {
      if (word.length > 3 && questionWords.includes(word)) {
        score += 2;
      }
    });
    
    // Check for tags if available
    if (entry.tags) {
      entry.tags.forEach(tag => {
        if (normalizedQuery.includes(tag.toLowerCase())) {
          score += 3;
        }
      });
    }
    
    return { entry, score };
  });
  
  // Sort by score and return top results
  return scoredEntries
    .sort((a, b) => b.score - a.score)
    .filter(item => item.score > 0)
    .slice(0, maxResults)
    .map(item => item.entry);
};
