export type TabType = 'home' | 'writing' | 'stories' | 'talk' | 'vocabulary' | 'speaking' | 'feedback' | 'about';

export interface StudentProfile {
  id: string;
  name: string;
  organization: string;
  firstUsed: string;
  lastActive: string;
  totalActiveSeconds: number;
  sessionCount: number;
  storiesCount: number;
  evaluationsCount: number;
  avatarEmoji: string;
}

export interface StudentSession {
  id: string;
  studentId: string;
  studentName: string;
  organization: string;
  startTime: string;
  endTime?: string;
  durationSeconds: number;
  activeSeconds: number;
  featuresUsed: string[];
  device: string;
}

export interface TrackingEvent {
  id: string;
  studentId: string;
  studentName: string;
  organization: string;
  eventName: string;
  timestamp: string;
  formattedTime?: string;
  sessionId: string;
  feature?: string;
  storyId?: string;
  imageId?: string;
  metadata?: Record<string, any>;
}

export interface TalkToAashnaSubmission {
  id: string;
  studentId: string;
  studentName: string;
  organization: string;
  type: 'story_share' | 'session_request' | 'idea_chat';
  storyTitle?: string;
  storyContent?: string;
  message?: string;
  topic?: string;
  preferredAvailability?: string;
  submittedAt: string;
  status: 'New' | 'Reviewed' | 'Session Requested' | 'Scheduled' | 'Completed';
  adminNotes?: string;
}

export interface StoryImage {
  id: string;
  title: string;
  prompt: string;
  category: string;
  categoryLabel: string;
  imageUrl: string;
  tag: string;
  starterSentence: string;
  suggestedWords: string[];
  emoji: string;
  guidedQuestions?: string[];
  suggestedEmotions?: string[];
  shortDescription?: string;
  isFeatured?: boolean;
  timesSelected?: number;
  uniqueStudentsCount?: number;
  approvedStatus?: 'approved' | 'pending' | 'draft';
}

export interface InlineCorrection {
  id: string;
  type: 'grammar' | 'spelling' | 'simplicity' | 'punctuation' | 'word_choice' | 'sentence_split';
  title: string;
  original: string;
  replacement: string;
  explanation: string;
  startIndex: number;
  endIndex: number;
  sentenceIndex?: number;
  applied: boolean;
  dismissed?: boolean;
}

export interface SentenceSuggestion {
  sentenceIndex: number;
  originalSentence: string;
  simplifiedSentence: string;
  explanation: string;
  wordCount: number;
  applied: boolean;
}

export interface StudentEvaluation {
  id: string;
  studentId: string;
  storyId?: string;
  correctionsCount: number;
  appliedCount: number;
  positiveNotes: string[];
  improvementTips: string[];
  timestamp: string;
}

export interface WordOption {
  id: string;
  word: string;
  definition: string;
  simpleExplanation: string;
  example: string;
  partOfSpeech?: 'adjective' | 'noun' | 'verb' | 'adverb';
  phonetic?: string;
  emoji?: string;
}

export interface SentenceChallenge {
  id: string;
  category: string;
  sentenceWithBlank: string;
  fullSentence: string;
  options: WordOption[];
  correctWordId: string;
  explanation: string;
  illustrationEmoji: string;
  difficulty: 'easy' | 'medium';
}

export interface DiaryWord {
  id: string;
  word: string;
  definition: string;
  simpleExplanation?: string;
  example: string;
  partOfSpeech?: string;
  phonetic?: string;
  emoji?: string;
  addedReason: 'wrong_answer' | 'user_saved';
  dateAdded: string;
  masteryStatus: 'learning' | 'mastered';
  timesPracticed: number;
  lastPracticedDate?: string;
}

export interface WritingPrompt {
  id: string;
  title: string;
  prompt: string;
  starterSentence: string;
  suggestedWords: string[];
  emoji: string;
  theme: string;
}

export interface SavedStory {
  id: string;
  title: string;
  content: string;
  promptTitle: string;
  date: string;
  wordsUsed: string[];
  emoji: string;
  type?: 'text' | 'photo' | 'magical_prompt';
  imageSrc?: string;
  imageUrl?: string;
  feelings?: string;
  studentId?: string;
  studentName?: string;
  organization?: string;
}

export interface PhotoStory {
  id: string;
  imageSrc?: string;
  imageUrl?: string;
  title: string;
  content?: string;
  reflectionText?: string;
  feelings?: string;
  promptUsed?: string;
  promptsAnswered?: string[];
  date?: string;
  dateCreated?: string;
  tags?: string[];
}

export interface ReadingParagraph {
  id: string;
  category: string;
  categoryName: string;
  categoryEmoji: string;
  title: string;
  paragraph: string;
  vocabularySparks: string[];
  difficulty: 'gentle' | 'explorer' | 'master';
  themeColor: string;
}

export interface SituationCard {
  id: string;
  title: string;
  emoji: string;
  sceneDescription: string;
  cartoonType: 'rabbit_garden' | 'treasure_can' | 'puppy_bakery' | 'dragon_kite' | 'bear_tea_party';
  guidedQuestions: string[];
  sampleKeywords: string[];
  starterPrompt: string;
}

export interface SpeakingCard {
  id: string;
  title: string;
  textToSpeak: string;
  category: 'rhyme' | 'tongue_twister' | 'daily_dialogue' | 'word_focus';
  difficulty: 'easy' | 'medium';
  focusWords: string[];
  emoji: string;
}

export interface CategoryInfo {
  id: string;
  name: string;
  description: string;
  emoji: string;
  badgeColor: string;
}

export interface UserStats {
  streak: number;
  stars: number;
  solvedCount: number;
  totalCorrect: number;
  storiesCreated: number;
  speakingPracticed: number;
}

export interface EmailModalData {
  isOpen: boolean;
  type: 'story' | 'photo_story' | 'situation' | 'question' | 'general';
  title?: string;
  content?: string;
  imageSrc?: string;
}

export interface FeedbackSubmission {
  id: string;
  studentId: string;
  studentName: string;
  organization: string;
  userRole: 'student' | 'teacher' | 'parent' | 'guest';
  category: 'complaint' | 'concern' | 'suggestion' | 'praise' | 'general';
  rating: number; // 1 to 5 stars
  title: string;
  feedbackText: string;
  featureArea: string; // 'Speaking Studio' | 'Writing Studio' | 'Vocab Detective' | 'Talk to Aashna' | 'General UI' | 'Other'
  submittedAt: string;
  status: 'New' | 'Under Review' | 'Resolved' | 'Planned';
  adminNotes?: string;
  contactEmail?: string;
}

