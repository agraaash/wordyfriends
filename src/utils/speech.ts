// Web Speech API for Text-to-Speech and Speech Recognition for kids

export function speakWordOrSentence(
  text: string,
  slowMode: boolean = false,
  onEnd?: () => void,
  onWordBoundary?: (charIndex: number, charLength?: number) => void
): boolean {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return false;
  }

  try {
    window.speechSynthesis.cancel(); // Stop any ongoing speech

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = slowMode ? 0.70 : 0.88; // Gentle pacing for children
    utterance.pitch = 1.05; // Slightly warmer/friendly pitch

    // Try to pick an English voice if available
    const voices = window.speechSynthesis.getVoices();
    const friendlyVoice = voices.find(
      (v) =>
        v.lang.startsWith('en') &&
        (v.name.includes('Samantha') ||
          v.name.includes('Victoria') ||
          v.name.includes('Karen') ||
          v.name.includes('Google US English') ||
          v.name.includes('Natural') ||
          v.name.includes('English'))
    );
    if (friendlyVoice) {
      utterance.voice = friendlyVoice;
    }

    if (onWordBoundary) {
      utterance.onboundary = (event) => {
        if (event.name === 'word') {
          onWordBoundary(event.charIndex, event.charLength || 0);
        }
      };
    }

    if (onEnd) {
      utterance.onend = onEnd;
      utterance.onerror = onEnd;
    }

    window.speechSynthesis.speak(utterance);
    return true;
  } catch (err) {
    console.warn('Speech synthesis error:', err);
    if (onEnd) onEnd();
    return false;
  }
}

export function speakSingleWord(
  word: string,
  slowMode: boolean = true,
  onEnd?: () => void
): boolean {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return false;
  }

  try {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = 'en-US';
    utterance.rate = slowMode ? 0.75 : 0.9;
    utterance.pitch = 1.05;

    const voices = window.speechSynthesis.getVoices();
    const friendlyVoice = voices.find((v) => v.lang.startsWith('en'));
    if (friendlyVoice) utterance.voice = friendlyVoice;

    if (onEnd) {
      utterance.onend = onEnd;
      utterance.onerror = onEnd;
    }

    window.speechSynthesis.speak(utterance);
    return true;
  } catch {
    if (onEnd) onEnd();
    return false;
  }
}

export function stopSpeaking() {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}

// Browser Speech Recognition Helper
export interface SpeechRecognitionResultState {
  transcript: string;
  isFinal: boolean;
  confidence: number;
}

export class SpeechRecognizer {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private recognition: any = null;
  private isListening: boolean = false;

  constructor() {
    if (typeof window !== 'undefined') {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const SpeechRecognitionClass = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognitionClass) {
        this.recognition = new SpeechRecognitionClass();
        this.recognition.continuous = false;
        this.recognition.interimResults = true;
        this.recognition.lang = 'en-US';
      }
    }
  }

  public isSupported(): boolean {
    return this.recognition !== null;
  }

  public start(
    onResult: (result: SpeechRecognitionResultState) => void,
    onError: (error: string) => void,
    onEnd: () => void
  ) {
    if (!this.recognition) {
      onError('Microphone speech recognition is not supported in this browser.');
      return;
    }

    try {
      this.isListening = true;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      this.recognition.onresult = (event: any) => {
        let transcript = '';
        let isFinal = false;
        let confidence = 0.9;

        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            isFinal = true;
            confidence = event.results[i][0].confidence || 0.9;
          }
        }

        onResult({
          transcript: transcript.trim(),
          isFinal,
          confidence,
        });
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      this.recognition.onerror = (event: any) => {
        this.isListening = false;
        onError(event.error || 'Could not understand audio. Try again!');
      };

      this.recognition.onend = () => {
        this.isListening = false;
        onEnd();
      };

      this.recognition.start();
    } catch {
      this.isListening = false;
      onError('Could not start microphone.');
    }
  }

  public stop() {
    if (this.recognition && this.isListening) {
      try {
        this.recognition.stop();
      } catch {
        // Ignore
      }
      this.isListening = false;
    }
  }
}

// Calculate similarity between spoken words and target text for kid star rating
export function calculateKidSpeechMatch(target: string, spoken: string): {
  score: number;
  matchedWords: string[];
  missedWords: string[];
  stars: number;
} {
  const cleanTargetWords = target
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .filter(Boolean);

  const cleanSpokenWords = spoken
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .filter(Boolean);

  const matchedWords: string[] = [];
  const missedWords: string[] = [];

  cleanTargetWords.forEach((word) => {
    // Check direct or partial match
    const found = cleanSpokenWords.some(
      (sp) => sp === word || sp.includes(word) || word.includes(sp)
    );
    if (found) {
      matchedWords.push(word);
    } else {
      missedWords.push(word);
    }
  });

  const score = cleanTargetWords.length > 0
    ? Math.round((matchedWords.length / cleanTargetWords.length) * 100)
    : 100;

  let stars = 1;
  if (score >= 80) stars = 3;
  else if (score >= 45) stars = 2;

  return { score, matchedWords, missedWords, stars };
}
