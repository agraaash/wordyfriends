// AI Speaking and Reading Fluency Coach Engine

export interface SpeakingFeedback {
  score: number; // 0 - 100
  stars: number; // 1 - 3
  paceLabel: 'Too Fast' | 'Just Right & Fluent' | 'Gentle & Steady' | 'Needs Practice';
  expressionRating: string;
  matchedWordsCount: number;
  totalWordsCount: number;
  accuracyPercentage: number;
  sparkWordsPraised: string[];
  encouragementTitle: string;
  encouragementMessage: string;
  coachingTips: string[];
}

export function generateSpeakingFeedback(
  targetText: string,
  spokenTranscript: string,
  sparkWords: string[] = [],
  recordingDurationSeconds: number = 0,
  scrollSpeedFactor: number = 1.0
): SpeakingFeedback {
  const cleanTargetWords = targetText
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .filter(Boolean);

  const cleanSpokenWords = spokenTranscript
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .filter(Boolean);

  const totalWordsCount = cleanTargetWords.length;
  const matchedWords: string[] = [];
  const missedWords: string[] = [];

  cleanTargetWords.forEach((word) => {
    const isMatched = cleanSpokenWords.some(
      (sp) => sp === word || (word.length > 3 && (sp.includes(word) || word.includes(sp)))
    );
    if (isMatched) {
      matchedWords.push(word);
    } else {
      missedWords.push(word);
    }
  });

  const matchedWordsCount = matchedWords.length;
  const accuracyPercentage = totalWordsCount > 0
    ? Math.min(100, Math.round((matchedWordsCount / totalWordsCount) * 100))
    : 100;

  // Check spark words
  const sparkWordsPraised = sparkWords.filter((sw) =>
    cleanSpokenWords.some((sp) => sp.includes(sw.toLowerCase()) || sw.toLowerCase().includes(sp))
  );

  // Calculate words per minute if duration is provided
  const durationMin = Math.max(0.1, recordingDurationSeconds / 60);
  const calculatedWpm = Math.round(cleanSpokenWords.length / durationMin);

  let paceLabel: 'Too Fast' | 'Just Right & Fluent' | 'Gentle & Steady' | 'Needs Practice' = 'Just Right & Fluent';
  if (calculatedWpm > 170) {
    paceLabel = 'Too Fast';
  } else if (calculatedWpm >= 80 && calculatedWpm <= 160) {
    paceLabel = 'Just Right & Fluent';
  } else if (calculatedWpm >= 40) {
    paceLabel = 'Gentle & Steady';
  } else {
    paceLabel = 'Needs Practice';
  }

  // Calculate Star Rating
  let stars = 1;
  if (accuracyPercentage >= 75 || (matchedWordsCount >= 10 && accuracyPercentage >= 65)) {
    stars = 3;
  } else if (accuracyPercentage >= 40 || matchedWordsCount >= 5) {
    stars = 2;
  }

  // Expression rating
  let expressionRating = 'Lively & Expressive 🎭';
  if (stars === 3) {
    expressionRating = 'Superb Storyteller Cadence 🌟';
  } else if (stars === 2) {
    expressionRating = 'Clear Voice & Good Rhythm 🎵';
  } else {
    expressionRating = 'Brave & Growing Reader 🌱';
  }

  // Encouragement messages
  let encouragementTitle = 'Magical Reading Performance! ✨';
  let encouragementMessage = 'You read with delightful confidence and wonderful voice clarity!';
  const coachingTips: string[] = [];

  if (stars === 3) {
    encouragementTitle = '✨ Superstar Storyteller! 🌟';
    encouragementMessage = `Bravo! You captured ${matchedWordsCount} out of ${totalWordsCount} words with fantastic fluency and kept up smoothly with the moving scroll!`;
    coachingTips.push('Try adding extra mystery or excitement when reading dramatic sentences!');
    if (sparkWordsPraised.length > 0) {
      coachingTips.push(`You pronounced vocabulary sparks like "${sparkWordsPraised.slice(0, 2).join(', ')}" beautifully!`);
    }
  } else if (stars === 2) {
    encouragementTitle = '🌸 Wonderful Reading Journey! 👏';
    encouragementMessage = `Great effort! You read ${matchedWordsCount} words clearly and showed steady rhythm as the scroll moved.`;
    coachingTips.push('Take a gentle breath at every comma and period to give your storytelling extra polish.');
    if (missedWords.length > 0) {
      coachingTips.push(`Give "${missedWords.slice(0, 2).join(', ')}" another quick practice aloud.`);
    }
  } else {
    encouragementTitle = '🌱 Fantastic Practice! Keep Going! 💖';
    encouragementMessage = 'Reading aloud takes courage and practice! Every time you read along with the scroll, your voice becomes stronger and clearer.';
    coachingTips.push('Try setting the scroll speed to 🐢 Turtle Pace to give yourself plenty of time on each word.');
    coachingTips.push('Listen to the "Guide Reader" first to hear the melody of the words.');
  }

  return {
    score: accuracyPercentage,
    stars,
    paceLabel,
    expressionRating,
    matchedWordsCount,
    totalWordsCount,
    accuracyPercentage,
    sparkWordsPraised,
    encouragementTitle,
    encouragementMessage,
    coachingTips,
  };
}
