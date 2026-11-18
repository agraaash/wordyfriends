export interface FeedbackItem {
  id: string;
  type: 'grammar' | 'spelling' | 'simplicity' | 'punctuation' | 'word_choice';
  title: string;
  original: string;
  replacement: string;
  explanation: string;
  startIndex?: number;
  endIndex?: number;
  sentenceIndex?: number;
  severity: 'error' | 'warning' | 'suggestion';
}

export interface SentenceRecommendation {
  sentenceIndex: number;
  originalSentence: string;
  improvedSentence: string;
  wordCount: number;
  isTooVerbose: boolean;
  hasRunOn: boolean;
  reasons: string[];
}

export interface WritingAnalysisResult {
  totalWords: number;
  totalSentences: number;
  avgSentenceLength: number;
  grammarScore: number;
  spellingScore: number;
  simplicityScore: number;
  overallScore: number;
  starCount: number;
  readabilityLabel: string;
  feedbackItems: FeedbackItem[];
  sentenceRecommendations: SentenceRecommendation[];
  encouragement: string;
}

// Common kid misspellings dictionary
const SPELLING_DICTIONARY: Record<string, string> = {
  becuase: 'because',
  beacuse: 'because',
  becuse: 'because',
  becouse: 'because',
  freind: 'friend',
  freinds: 'friends',
  foward: 'forward',
  definately: 'definitely',
  definetly: 'definitely',
  difinitely: 'definitely',
  tommorow: 'tomorrow',
  tommorrow: 'tomorrow',
  tomorow: 'tomorrow',
  untill: 'until',
  until: 'until',
  beleive: 'believe',
  belive: 'believe',
  beleve: 'believe',
  recieved: 'received',
  recieve: 'receive',
  favrite: 'favorite',
  favrit: 'favorite',
  favourit: 'favorite',
  suprise: 'surprise',
  supprise: 'surprise',
  suprised: 'surprised',
  beautifull: 'beautiful',
  beautful: 'beautiful',
  buetiful: 'beautiful',
  wierd: 'weird',
  happend: 'happened',
  hapened: 'happened',
  suddenly: 'suddenly',
  sudenly: 'suddenly',
  suddanly: 'suddenly',
  allways: 'always',
  alway: 'always',
  littel: 'little',
  litel: 'little',
  diferent: 'different',
  diffrent: 'different',
  writting: 'writing',
  writted: 'wrote',
  completly: 'completely',
  togather: 'together',
  togethr: 'together',
  grammer: 'grammar',
  embarass: 'embarrass',
  embarassed: 'embarrassed',
  embarasing: 'embarrassing',
  finaly: 'finally',
  finnaly: 'finally',
  runned: 'ran',
  goed: 'went',
  comed: 'came',
  eated: 'ate',
  catched: 'caught',
  teached: 'taught',
  drawed: 'drew',
  sleeped: 'slept',
  falled: 'fell',
  bringed: 'brought',
  feeled: 'felt',
  buyed: 'bought',
  thinked: 'thought',
  maked: 'made',
  alot: 'a lot',
  everytime: 'every time',
  noone: 'no one',
  incase: 'in case',
};

// Verbose phrase replacements for simpler writing
const VERBOSE_PHRASES: Array<{ pattern: RegExp; replacement: string; explanation: string }> = [
  {
    pattern: /\bin order to\b/gi,
    replacement: 'to',
    explanation: 'Using "to" instead of "in order to" keeps your sentence clean and crisp!',
  },
  {
    pattern: /\bdue to the fact that\b/gi,
    replacement: 'because',
    explanation: '"Because" is simpler and easier to read than "due to the fact that".',
  },
  {
    pattern: /\bat this point in time\b/gi,
    replacement: 'now',
    explanation: '"Now" is short, energetic, and avoids extra clutter.',
  },
  {
    pattern: /\bat the present moment\b/gi,
    replacement: 'now',
    explanation: 'Try using "now" for a punchier sentence!',
  },
  {
    pattern: /\bfor the purpose of\b/gi,
    replacement: 'for',
    explanation: 'Using "for" is much simpler and faster to read.',
  },
  {
    pattern: /\ba large number of\b/gi,
    replacement: 'many',
    explanation: '"Many" says the exact same thing in a single neat word!',
  },
  {
    pattern: /\ba small number of\b/gi,
    replacement: 'a few',
    explanation: '"A few" is direct and easy for your reader to understand.',
  },
  {
    pattern: /\bin the event that\b/gi,
    replacement: 'if',
    explanation: '"If" is clean, simple, and avoids wordiness.',
  },
  {
    pattern: /\bmake a decision\b/gi,
    replacement: 'decide',
    explanation: '"Decide" is an active verb that sounds strong and clear.',
  },
  {
    pattern: /\bgive an explanation\b/gi,
    replacement: 'explain',
    explanation: '"Explain" makes your writing sound confident and direct.',
  },
  {
    pattern: /\btake into consideration\b/gi,
    replacement: 'consider',
    explanation: '"Consider" is cleaner than four long words.',
  },
  {
    pattern: /\bhas the ability to\b/gi,
    replacement: 'can',
    explanation: 'Replace "has the ability to" with "can" to make your sentence fly!',
  },
  {
    pattern: /\bis able to\b/gi,
    replacement: 'can',
    explanation: '"Can" keeps your sentence short and simple.',
  },
  {
    pattern: /\bin a quick manner\b/gi,
    replacement: 'quickly',
    explanation: 'Use the adverb "quickly" instead of the wordy phrase.',
  },
  {
    pattern: /\bin a sudden way\b/gi,
    replacement: 'suddenly',
    explanation: '"Suddenly" creates instant excitement for the reader!',
  },
];

/**
 * Main Writing Feedback & Grammar Analysis Engine
 */
export function analyzeWriting(text: string): WritingAnalysisResult {
  const trimmed = text.trim();
  const feedbackItems: FeedbackItem[] = [];

  if (!trimmed) {
    return {
      totalWords: 0,
      totalSentences: 0,
      avgSentenceLength: 0,
      grammarScore: 100,
      spellingScore: 100,
      simplicityScore: 100,
      overallScore: 100,
      starCount: 5,
      readabilityLabel: 'Ready to write!',
      feedbackItems: [],
      sentenceRecommendations: [],
      encouragement: 'Start writing your story or photo description, and I will give you helpful suggestions!',
    };
  }

  // 1. Word and sentence extraction
  const rawWords = trimmed.split(/\s+/).filter(Boolean);
  const totalWords = rawWords.length;

  // Split into sentences by punctuation or newlines
  const rawSentences = trimmed
    .split(/(?<=[.?!])\s+|\n+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  const totalSentences = Math.max(1, rawSentences.length);
  const avgSentenceLength = Math.round((totalWords / totalSentences) * 10) / 10;

  // 2. Grammar Check: Subject-Verb Agreement & Mechanics
  const grammarRules: Array<{
    pattern: RegExp;
    replacement: (match: string, ...args: string[]) => string;
    title: string;
    explanation: string;
  }> = [
    // Lowercase standalone "i"
    {
      pattern: /(^|[\s"'(])i([\s"',.?!)]|$)/g,
      replacement: (m, p1, p2) => `${p1}I${p2}`,
      title: 'Capitalize "I"',
      explanation: 'When talking about yourself, "I" is always capitalized in English.',
    },
    // Subject verb: "he/she/it have" -> "has"
    {
      pattern: /\b(he|she|it)\s+have\b/gi,
      replacement: (m, subj) => `${subj} has`,
      title: 'Subject-Verb Agreement ("has")',
      explanation: 'Singular subjects (he, she, it) pair with "has" instead of "have".',
    },
    // Subject verb: "he/she/it are" -> "is"
    {
      pattern: /\b(he|she|it)\s+are\b/gi,
      replacement: (m, subj) => `${subj} is`,
      title: 'Subject-Verb Agreement ("is")',
      explanation: 'Use "is" with singular subjects (he, she, it).',
    },
    // Subject verb: "they is" -> "they are"
    {
      pattern: /\bthey\s+is\b/gi,
      replacement: () => `they are`,
      title: 'Subject-Verb Agreement ("are")',
      explanation: '"They" is plural, so it pairs with "are" instead of "is".',
    },
    // Subject verb: "we is" -> "we are"
    {
      pattern: /\bwe\s+is\b/gi,
      replacement: () => `we are`,
      title: 'Subject-Verb Agreement ("are")',
      explanation: '"We" is plural, so it pairs with "are".',
    },
    // Subject verb: "they was" -> "they were"
    {
      pattern: /\bthey\s+was\b/gi,
      replacement: () => `they were`,
      title: 'Past Tense Plural ("were")',
      explanation: 'Use "were" when talking about multiple people in the past ("they were").',
    },
    // Subject verb: "we was" -> "we were"
    {
      pattern: /\bwe\s+was\b/gi,
      replacement: () => `we were`,
      title: 'Past Tense Plural ("were")',
      explanation: 'Use "were" with "we" in the past tense ("we were").',
    },
    // Subject verb: "you was" -> "you were"
    {
      pattern: /\byou\s+was\b/gi,
      replacement: () => `you were`,
      title: 'Subject Agreement ("you were")',
      explanation: 'In English, "you" always pairs with "were" ("you were").',
    },
    // "should of" -> "should have"
    {
      pattern: /\b(should|could|would|must)\s+of\b/gi,
      replacement: (m, modal) => `${modal} have`,
      title: 'Modal Verb Phrase ("have")',
      explanation: 'Write "have" instead of "of" after should, could, would, or must.',
    },
    // "a" vs "an" before vowels
    {
      pattern: /\ba\s+([aeiou][a-z]+)\b/gi,
      replacement: (m, noun) => {
        // Exclude some edge cases if needed
        return `an ${noun}`;
      },
      title: 'Article Rule ("a" vs "an")',
      explanation: 'Use "an" before words that start with a vowel sound (a, e, i, o, u).',
    },
    // "an" before consonant
    {
      pattern: /\ban\s+([bcdfghjklmnpqrstvwxyz][a-z]+)\b/gi,
      replacement: (m, noun) => {
        // exception for "hour", "honest", "honor"
        if (/^(hour|honest|honor)/i.test(noun)) return m;
        return `a ${noun}`;
      },
      title: 'Article Rule ("a" vs "an")',
      explanation: 'Use "a" before words that start with a consonant sound.',
    },
    // Repeated words: "the the", "to to"
    {
      pattern: /\b(the|to|in|is|and|that|for|with)\s+\1\b/gi,
      replacement: (m, word) => `${word}`,
      title: 'Repeated Word',
      explanation: 'This word was accidentally repeated twice in a row.',
    },
    // Common homophone: "they're" vs "their"
    {
      pattern: /\bthey['’]re\s+(house|dog|car|book|mother|father|friend|toys|room|school|bags)\b/gi,
      replacement: (m, noun) => `their ${noun}`,
      title: 'Possessive "their"',
      explanation: 'Use "their" to show ownership (e.g., "their house"), not "they\'re" (they are).',
    },
    // Common homophone: "your" vs "you're"
    {
      pattern: /\byour\s+(welcome|going|very|so|happy|sad|excited|beautiful|kind)\b/gi,
      replacement: (m, word) => `you're ${word}`,
      title: 'Contraction "you\'re"',
      explanation: 'Use "you\'re" when you mean "you are" (e.g. "you\'re welcome").',
    },
    // Common homophone: "then" vs "than"
    {
      pattern: /\b(better|bigger|smaller|faster|taller|more|less|colder|warmer)\s+then\b/gi,
      replacement: (m, adj) => `${adj} than`,
      title: 'Comparison "than"',
      explanation: 'Use "than" for comparing things (e.g., "bigger than"), and "then" for time.',
    },
  ];

  grammarRules.forEach((rule, idx) => {
    let match: RegExpExecArray | null;
    const regex = new RegExp(rule.pattern.source, rule.pattern.flags);
    while ((match = regex.exec(trimmed)) !== null) {
      const original = match[0];
      const replacement = rule.replacement(original, match[1], match[2]);
      if (original !== replacement) {
        feedbackItems.push({
          id: `grammar-${idx}-${match.index}`,
          type: 'grammar',
          title: rule.title,
          original,
          replacement,
          explanation: rule.explanation,
          startIndex: match.index,
          endIndex: match.index + original.length,
          severity: 'error',
        });
      }
    }
  });

  // 3. Spelling Check
  rawWords.forEach((wordWithPunct, idx) => {
    const cleanWord = wordWithPunct.replace(/^[^\w]+|[^\w]+$/g, '').toLowerCase();
    if (SPELLING_DICTIONARY[cleanWord]) {
      const correctWord = SPELLING_DICTIONARY[cleanWord];
      feedbackItems.push({
        id: `spelling-${idx}`,
        type: 'spelling',
        title: `Spelling: "${correctWord}"`,
        original: wordWithPunct.replace(/^[^\w]+|[^\w]+$/g, ''),
        replacement: correctWord,
        explanation: `"${cleanWord}" is usually spelled "${correctWord}".`,
        severity: 'warning',
      });
    }
  });

  // 4. Mechanics Check: Capitalization at start of sentences
  rawSentences.forEach((sentence, sIdx) => {
    if (sentence.length > 0 && /^[a-z]/.test(sentence)) {
      const firstChar = sentence.charAt(0);
      const capitalized = firstChar.toUpperCase() + sentence.slice(1);
      feedbackItems.push({
        id: `cap-${sIdx}`,
        type: 'punctuation',
        title: 'Capitalize Sentence Start',
        original: sentence.slice(0, Math.min(15, sentence.length)) + '...',
        replacement: capitalized.slice(0, Math.min(15, capitalized.length)) + '...',
        explanation: 'Every sentence should begin with a capital letter.',
        sentenceIndex: sIdx,
        severity: 'warning',
      });
    }
  });

  // 5. Verbose Phrases Check (Simplicity / Shorter Sentences)
  VERBOSE_PHRASES.forEach((vRule, vIdx) => {
    let match: RegExpExecArray | null;
    const regex = new RegExp(vRule.pattern.source, vRule.pattern.flags);
    while ((match = regex.exec(trimmed)) !== null) {
      feedbackItems.push({
        id: `simplicity-phrase-${vIdx}-${match.index}`,
        type: 'simplicity',
        title: `Simpler Word: "${vRule.replacement}"`,
        original: match[0],
        replacement: vRule.replacement,
        explanation: vRule.explanation,
        startIndex: match.index,
        endIndex: match.index + match[0].length,
        severity: 'suggestion',
      });
    }
  });

  // 6. Sentence-by-Sentence Simplicity & Verbosity Analysis (Major user requirement!)
  const sentenceRecommendations: SentenceRecommendation[] = rawSentences.map((sentence, sIdx) => {
    const sWords = sentence.split(/\s+/).filter(Boolean);
    const wordCount = sWords.length;
    const reasons: string[] = [];

    const isTooVerbose = wordCount >= 18;
    
    // Check for run-on conjunction chains ("and... and then... and also...")
    const conjunctionMatches = sentence.match(/\b(and then|and also|and so|and but|and)\b/gi) || [];
    const hasRunOn = conjunctionMatches.length >= 3 || (wordCount >= 15 && conjunctionMatches.length >= 2);

    if (isTooVerbose) {
      reasons.push(`This sentence is ${wordCount} words long. Shorter sentences (under 14 words) are easier and more exciting to read!`);
    }

    if (hasRunOn) {
      reasons.push('Contains several connecting "and" words. Splitting it into two smaller sentences will give each idea more punch.');
    }

    // Generate improved, simplified sentence version
    let improved = sentence;

    // Apply phrase simplifications
    VERBOSE_PHRASES.forEach((v) => {
      improved = improved.replace(v.pattern, v.replacement);
    });

    // If run-on or too long, suggest breaking at "and then" or second "and"
    if (hasRunOn || isTooVerbose) {
      // Look for "and then", "and also", "and so", or ", and"
      if (/\b,\s*and\s+then\b/i.test(improved)) {
        improved = improved.replace(/\b,\s*and\s+then\s+/i, '. Then, ');
      } else if (/\band\s+then\b/i.test(improved)) {
        improved = improved.replace(/\band\s+then\s+/i, '. Then, ');
      } else if (/\b,\s*and\s+so\b/i.test(improved)) {
        improved = improved.replace(/\b,\s*and\s+so\s+/i, '. So, ');
      } else if (/\b,\s*and\s+/i.test(improved)) {
        improved = improved.replace(/\b,\s*and\s+/i, '. ');
      } else if (/\band\s+after\s+that\b/i.test(improved)) {
        improved = improved.replace(/\band\s+after\s+that\s+/i, '. After that, ');
      }
      
      // Ensure capitalization after newly added periods
      improved = improved.replace(/\.\s+([a-z])/g, (m, char) => `. ${char.toUpperCase()}`);
    }

    // Ensure ending punctuation
    if (!/[.?!]$/.test(improved.trim())) {
      improved = improved.trim() + '.';
    }

    // Ensure start capitalization
    if (/^[a-z]/.test(improved)) {
      improved = improved.charAt(0).toUpperCase() + improved.slice(1);
    }

    return {
      sentenceIndex: sIdx,
      originalSentence: sentence,
      improvedSentence: improved,
      wordCount,
      isTooVerbose,
      hasRunOn,
      reasons,
    };
  });

  // Calculate scores
  const grammarErrorsCount = feedbackItems.filter((f) => f.type === 'grammar').length;
  const spellingErrorsCount = feedbackItems.filter((f) => f.type === 'spelling').length;
  const verbosityCount = sentenceRecommendations.filter((s) => s.isTooVerbose || s.hasRunOn).length;

  const grammarScore = Math.max(40, Math.round(100 - grammarErrorsCount * 12));
  const spellingScore = Math.max(40, Math.round(100 - spellingErrorsCount * 10));
  const simplicityScore = Math.max(50, Math.round(100 - verbosityCount * 15));
  const overallScore = Math.round((grammarScore * 0.4) + (spellingScore * 0.3) + (simplicityScore * 0.3));

  let starCount = 5;
  if (overallScore < 60) starCount = 2;
  else if (overallScore < 75) starCount = 3;
  else if (overallScore < 90) starCount = 4;

  let readabilityLabel = 'Crisp & Wonderfully Clear! 🌟';
  if (avgSentenceLength > 20 || verbosityCount >= 2) {
    readabilityLabel = 'A Little Verbose (Try Shorter Sentences)';
  } else if (avgSentenceLength > 15) {
    readabilityLabel = 'Good Flow & Clear Ideas';
  }

  // Child-friendly encouragement
  let encouragement = 'Great job expressing your ideas! Review the suggestions below to make your writing sparkle even brighter.';
  if (feedbackItems.length === 0 && verbosityCount === 0) {
    encouragement = '🌟 Outstanding writing! Your sentences are clean, clear, and grammatically spot on!';
  } else if (verbosityCount > 0 && grammarErrorsCount === 0) {
    encouragement = 'Your grammar is strong! You can make your story even more enjoyable by breaking long sentences into shorter, simpler ones.';
  }

  return {
    totalWords,
    totalSentences,
    avgSentenceLength,
    grammarScore,
    spellingScore,
    simplicityScore,
    overallScore,
    starCount,
    readabilityLabel,
    feedbackItems,
    sentenceRecommendations,
    encouragement,
  };
}

/**
 * Applies a specific feedback replacement to the text.
 */
export function applyFeedbackFix(text: string, item: FeedbackItem): string {
  if (item.type === 'grammar' || item.type === 'simplicity' || item.type === 'spelling') {
    // Regex replace first instance of original
    const escaped = item.original.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`\\b${escaped}\\b`, 'i');
    if (regex.test(text)) {
      return text.replace(regex, item.replacement);
    }
    // Fallback simple string replace
    return text.replace(item.original, item.replacement);
  }
  if (item.type === 'punctuation') {
    return text.replace(/^[a-z]/, (c) => c.toUpperCase());
  }
  return text;
}

/**
 * Applies a full sentence simplification to the story text.
 */
export function applySentenceSimplification(
  fullText: string,
  recommendation: SentenceRecommendation
): string {
  if (!recommendation.originalSentence || !recommendation.improvedSentence) {
    return fullText;
  }
  return fullText.replace(recommendation.originalSentence, recommendation.improvedSentence);
}
