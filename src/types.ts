export interface DominantEmotion {
  name: string;
  category: 'Joy' | 'Calm' | 'Anxiety' | 'Sadness' | 'Anger' | 'Overwhelm' | 'Hope' | 'Gratitude' | 'Fatigue' | 'Resolve';
  intensity: number; // 1 to 10
  underlyingNeed: string;
  color: string;
}

export interface LifeTheme {
  theme: string;
  description: string;
  category: 'Career & Ambition' | 'Relationships' | 'Self-Worth' | 'Health & Energy' | 'Creativity' | 'Mindset' | 'Life Transitions' | 'Other';
  impact: 'positive' | 'neutral' | 'tension';
}

export interface CognitiveReframing {
  detectedDistortion: string; // e.g. "Catastrophizing", "All-or-Nothing Thinking", "Mind Reading", "Disqualifying the Positive", "Should Statements", "Emotional Reasoning", "None / Balanced Mindset"
  originalThoughtPattern: string;
  reframedPerspective: string;
  behavioralMicroStep: string;
}

export interface CoachAnalysis {
  dominantEmotion: DominantEmotion;
  executiveSynthesis: string; // Exactly two sentences
  recurringThemes: LifeTheme[]; // 3 to 5 themes
  cognitiveReframing: CognitiveReframing;
  tomorrowReflectionPrompt: string;
  empathyNote: string;
  growthScore: number; // 1-100
  analyzedAt: string;
}

export interface JournalEntry {
  id: string;
  date: string; // ISO string
  title: string;
  content: string;
  rawMood?: string;
  energyLevel?: number; // 1 to 5
  tags: string[];
  wordCount: number;
  analysis?: CoachAnalysis;
  isFavorite?: boolean;
  reflectionAnswer?: string;
}

export interface CoachChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  suggestedActions?: string[];
}

export interface WeeklySynthesis {
  timeframe: string;
  dominantTrend: string;
  overallSynthesis: string;
  topThemes: { theme: string; occurrences: number }[];
  cbtGrowthInsight: string;
  recommendedFocusArea: string;
  celebrationNote: string;
}
