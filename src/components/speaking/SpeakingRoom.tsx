import React, { useState, useEffect, useRef, useMemo } from 'react';
import { DiaryWord, SavedStory, SituationCard } from '../../types';
import { SPEAKING_LIBRARY, SITUATION_CARDS, SpeakingItem } from '../../data/speakingData';
import { CartoonSceneCard } from './CartoonSceneCard';
import {
  Mic,
  MicOff,
  Volume2,
  Sparkles,
  Award,
  RotateCcw,
  Star,
  BookOpen,
  Image as ImageIcon,
  CheckCircle2,
  Mail,
  Play,
  Pause,
  Sliders,
  Flame,
  Wand2,
  ChevronRight,
  HelpCircle,
  Eye,
  Smile,
  RefreshCw,
  Send,
  VolumeX,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import {
  speakWordOrSentence,
  speakSingleWord,
  SpeechRecognizer,
  stopSpeaking,
} from '../../utils/speech';
import { sounds } from '../../utils/sound';
import { generateSpeakingFeedback, SpeakingFeedback } from '../../utils/speakingFeedback';

interface SpeakingRoomProps {
  diaryWords: DiaryWord[];
  savedStories?: SavedStory[];
  onAddStar: (count: number) => void;
  onOpenEmailModal?: (title: string, content: string) => void;
}

export const SpeakingRoom: React.FC<SpeakingRoomProps> = ({
  diaryWords,
  savedStories = [],
  onAddStar,
  onOpenEmailModal,
}) => {
  // Main Mode: Teleprompter Scroll vs Cartoon Situations
  const [activeTab, setActiveTab] = useState<'teleprompter' | 'situations'>('teleprompter');

  // Library Type Filter: 'all' | 'story' | 'poem' | 'twister' | 'my_stories'
  const [libraryFilter, setLibraryFilter] = useState<'all' | 'story' | 'poem' | 'twister' | 'my_stories'>('all');
  const [selectedItemId, setSelectedItemId] = useState<string>(SPEAKING_LIBRARY[0].id);

  // Selected My Story ID (if in my_stories tab)
  const [selectedMyStoryId, setSelectedMyStoryId] = useState<string | null>(
    savedStories.length > 0 ? savedStories[0].id : null
  );

  // Teleprompter & Scroll State
  const [isScrolling, setIsScrolling] = useState<boolean>(false);
  const [scrollSpeedMultiplier, setScrollSpeedMultiplier] = useState<number>(1.0); // 0.5x to 2.5x
  const [textSize, setTextSize] = useState<'normal' | 'large' | 'xlarge'>('large');
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const [showReadingRuler, setShowReadingRuler] = useState<boolean>(false);

  // Word Highlighting & TTS Tracking
  const [highlightedWord, setHighlightedWord] = useState<string | null>(null);
  const [ttsCharIndex, setTtsCharIndex] = useState<number | null>(null);

  // Recording & Audio State
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordingSeconds, setRecordingSeconds] = useState<number>(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [recordedTranscript, setRecordedTranscript] = useState<string>('');
  const [isGuideSpeaking, setIsGuideSpeaking] = useState<boolean>(false);
  const [micError, setMicError] = useState<string | null>(null);

  // AI Feedback State
  const [aiFeedback, setAiFeedback] = useState<SpeakingFeedback | null>(null);
  const [isAiEvaluating, setIsAiEvaluating] = useState<boolean>(false);

  // Situation Mode State
  const [selectedSituationIdx, setSelectedSituationIdx] = useState<number>(0);
  const [isSituationRecording, setIsSituationRecording] = useState<boolean>(false);
  const [situationTranscript, setSituationTranscript] = useState<string>('');

  // Refs
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recognizerRef = useRef<SpeechRecognizer | null>(null);
  const timerIntervalRef = useRef<any>(null);
  const scrollIntervalRef = useRef<any>(null);

  // Derive Current Item to Read
  let currentItem: SpeakingItem;
  if (libraryFilter === 'my_stories' && selectedMyStoryId) {
    const foundMyStory = savedStories.find((s) => s.id === selectedMyStoryId) || savedStories[0];
    if (foundMyStory) {
      const paragraphs = foundMyStory.content
        .split('\n\n')
        .map((p) => p.trim())
        .filter(Boolean);

      currentItem = {
        id: `my-${foundMyStory.id}`,
        type: 'story',
        category: 'animals',
        categoryName: 'My Creation',
        categoryEmoji: foundMyStory.emoji || '📖',
        title: foundMyStory.title,
        content: foundMyStory.content,
        paragraphs: paragraphs.length > 0 ? paragraphs : [foundMyStory.content],
        vocabularySparks: foundMyStory.wordsUsed || [],
        difficulty: 'gentle',
        themeColor: 'rose',
        estimatedWpm: 90,
      };
    } else {
      currentItem = SPEAKING_LIBRARY[0];
    }
  } else {
    currentItem = SPEAKING_LIBRARY.find((i) => i.id === selectedItemId) || SPEAKING_LIBRARY[0];
  }

  const currentSituation = SITUATION_CARDS[selectedSituationIdx] || SITUATION_CARDS[0];

  // Set of words spoken by the student in real-time
  const spokenWordsSet = useMemo(() => {
    if (!recordedTranscript) return new Set<string>();
    const words = recordedTranscript
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, ' ')
      .split(/\s+/)
      .filter(Boolean);
    return new Set(words);
  }, [recordedTranscript]);

  // Set of vocab spark words for special accenting
  const vocabSparksSet = useMemo(() => {
    return new Set((currentItem.vocabularySparks || []).map((w) => w.toLowerCase().replace(/[^a-z0-9]/g, '')));
  }, [currentItem]);

  // Passage words list & recognized count
  const passageWordsList = useMemo(() => {
    return currentItem.content
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, ' ')
      .split(/\s+/)
      .filter(Boolean);
  }, [currentItem]);

  const recognizedWordsCount = useMemo(() => {
    if (!recordedTranscript) return 0;
    return passageWordsList.filter((w) => spokenWordsSet.has(w)).length;
  }, [passageWordsList, spokenWordsSet]);

  // Initialize Speech Recognizer
  useEffect(() => {
    recognizerRef.current = new SpeechRecognizer();
    return () => {
      stopSpeaking();
      if (recognizerRef.current) recognizerRef.current.stop();
      clearInterval(timerIntervalRef.current);
      cancelAnimationFrame(scrollIntervalRef.current);
    };
  }, []);

  // Smooth Teleprompter Auto-Scroll Loop
  useEffect(() => {
    let animationFrameId: number;
    let lastTime: number | null = null;

    const performScroll = (time: number) => {
      if (!isScrolling || !scrollContainerRef.current) return;

      if (lastTime === null) {
        lastTime = time;
      }
      const delta = time - lastTime;
      lastTime = time;

      // Base speed: 28 pixels per second at 1.0x speed
      const pixelsPerSecond = 32 * scrollSpeedMultiplier;
      const moveBy = (pixelsPerSecond * delta) / 1000;

      const container = scrollContainerRef.current;
      const newScrollTop = container.scrollTop + moveBy;
      const maxScroll = container.scrollHeight - container.clientHeight;

      if (newScrollTop >= maxScroll - 2) {
        container.scrollTop = maxScroll;
        setIsScrolling(false); // Finished scroll
        sounds.playPop();
      } else {
        container.scrollTop = newScrollTop;
        const progress = maxScroll > 0 ? Math.round((newScrollTop / maxScroll) * 100) : 0;
        setScrollProgress(progress);
        animationFrameId = requestAnimationFrame(performScroll);
      }
    };

    if (isScrolling) {
      animationFrameId = requestAnimationFrame(performScroll);
    }

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isScrolling, scrollSpeedMultiplier]);

  // Reset scroll to top
  const handleResetScroll = () => {
    sounds.playPop();
    setIsScrolling(false);
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0;
    }
    setScrollProgress(0);
  };

  // Toggle Scroll Play/Pause
  const handleToggleScroll = () => {
    sounds.playPop();
    setIsScrolling(!isScrolling);
  };

  // Change Item Selection
  const handleSelectItem = (id: string) => {
    sounds.playPop();
    setSelectedItemId(id);
    handleResetScroll();
    setAiFeedback(null);
    setRecordedTranscript('');
    setAudioUrl(null);
    setMicError(null);
    setHighlightedWord(null);
    setTtsCharIndex(null);
    stopSpeaking();
  };

  // Listen to Guide Reader (Text to Speech) with Word Boundary Sync
  const handleListenGuide = (slowMode: boolean = false) => {
    sounds.playPop();
    setIsGuideSpeaking(true);
    setTtsCharIndex(0);
    speakWordOrSentence(
      currentItem.content,
      slowMode,
      () => {
        setIsGuideSpeaking(false);
        setTtsCharIndex(null);
      },
      (charIndex) => {
        setTtsCharIndex(charIndex);
      }
    );
  };

  // Click-to-hear pronunciation of a single word
  const handleSpeakSingleWord = (word: string) => {
    const clean = word.toLowerCase().replace(/[^a-z0-9]/g, '');
    if (!clean) return;
    sounds.playPop();
    setHighlightedWord(clean);
    speakSingleWord(clean, true, () => {
      setTimeout(() => {
        setHighlightedWord((prev) => (prev === clean ? null : prev));
      }, 1000);
    });
  };

  // Start Voice Recording & Auto-Scroll
  const handleStartRecording = async () => {
    sounds.playPop();
    setMicError(null);
    setAiFeedback(null);
    setRecordedTranscript('');
    setAudioUrl(null);
    setRecordingSeconds(0);

    // 1. Check browser media devices
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;
        audioChunksRef.current = [];

        mediaRecorder.ondataavailable = (e) => {
          if (e.data.size > 0) {
            audioChunksRef.current.push(e.data);
          }
        };

        mediaRecorder.onstop = () => {
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
          const url = URL.createObjectURL(audioBlob);
          setAudioUrl(url);
          stream.getTracks().forEach((track) => track.stop());
        };

        mediaRecorder.start();
      }
    } catch (err) {
      console.warn('MediaRecorder not available or permission denied:', err);
    }

    // 2. Start Speech Recognition
    if (recognizerRef.current && recognizerRef.current.isSupported()) {
      recognizerRef.current.start(
        (res) => {
          setRecordedTranscript(res.transcript);
        },
        (err) => {
          setMicError(err);
        },
        () => {
          // On speech end
        }
      );
    }

    // 3. Start Recording Timer & Auto-Scroll
    setIsRecording(true);
    setIsScrolling(true);
    timerIntervalRef.current = setInterval(() => {
      setRecordingSeconds((prev) => prev + 1);
    }, 1000);
  };

  // Stop Recording & Generate AI Coach Feedback
  const handleStopRecording = () => {
    sounds.playPop();
    setIsRecording(false);
    setIsScrolling(false);
    clearInterval(timerIntervalRef.current);

    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }

    if (recognizerRef.current) {
      recognizerRef.current.stop();
    }

    // Trigger AI Evaluation
    setIsAiEvaluating(true);
    setTimeout(() => {
      setIsAiEvaluating(false);
      const textToMatch = currentItem.content;
      const transcript = recordedTranscript || 'I loved reading this wonderful story with great rhythm and expression.';
      const feedback = generateSpeakingFeedback(
        textToMatch,
        transcript,
        currentItem.vocabularySparks,
        Math.max(5, recordingSeconds),
        scrollSpeedMultiplier
      );
      setAiFeedback(feedback);

      if (feedback.stars >= 2) {
        sounds.playCelebration();
        onAddStar(feedback.stars);
        try {
          confetti({
            particleCount: 50,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#FFD1DC', '#FF8DA1', '#60A5FA', '#34D399', '#FBBF24'],
          });
        } catch {
          // Ignore
        }
      } else {
        sounds.playGentleRetry();
      }
    }, 600);
  };

  // Toggle Situation Mic
  const handleToggleSituationMic = () => {
    sounds.playPop();
    setMicError(null);

    if (isSituationRecording) {
      if (recognizerRef.current) recognizerRef.current.stop();
      setIsSituationRecording(false);
      return;
    }

    if (!recognizerRef.current || !recognizerRef.current.isSupported()) {
      setMicError('Speech recognition is not supported in this browser. You can speak aloud or type!');
      return;
    }

    setIsSituationRecording(true);
    recognizerRef.current.start(
      (res) => {
        setSituationTranscript(res.transcript);
        if (res.isFinal) {
          setIsSituationRecording(false);
          sounds.playCorrect();
          onAddStar(3);
          try {
            confetti({
              particleCount: 45,
              spread: 60,
              origin: { y: 0.6 },
              colors: ['#FFD1DC', '#FF8DA1', '#FBBF24', '#34D399'],
            });
          } catch {
            // Ignore
          }
        }
      },
      (err) => {
        setIsSituationRecording(false);
        setMicError(err);
      },
      () => {
        setIsSituationRecording(false);
      }
    );
  };

  // Filtered Library Items
  const filteredLibrary = SPEAKING_LIBRARY.filter((item) => {
    if (libraryFilter === 'all') return true;
    if (libraryFilter === 'story') return item.type === 'story';
    if (libraryFilter === 'poem') return item.type === 'poem';
    if (libraryFilter === 'twister') return item.type === 'twister';
    return true;
  });

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fadeIn pb-12">
      {/* 1. Header Banner */}
      <div className="bg-gradient-to-r from-[#FFF0F3] via-white to-[#FFE4E9] rounded-3xl border-3 border-[#FFE4E9] p-6 sm:p-7 shadow-lg flex flex-col md:flex-row items-center justify-between gap-5">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-3xl bg-gradient-to-br from-[#FFD1DC] to-[#FF8DA1] flex items-center justify-center text-3xl shadow-sm">
            🎙️
          </div>
          <div className="space-y-1 text-center md:text-left">
            <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white border border-[#FFB6C1] text-[11px] font-bold text-[#7D5A61]">
              <span>✨ Voice & Teleprompter Studio</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-[#7D5A61] tracking-tight">
              Speaking Playground
            </h1>
            <p className="text-xs sm:text-sm text-[#A89094] font-medium">
              Read scrolling stories & poems aloud, record your voice, and receive friendly AI coach feedback!
            </p>
          </div>
        </div>

        {/* Mode Switcher Pills */}
        <div className="flex bg-white/90 rounded-2xl border border-[#FFE4E9] p-1.5 text-xs font-bold shadow-xs">
          <button
            onClick={() => {
              sounds.playPop();
              setActiveTab('teleprompter');
            }}
            className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'teleprompter'
                ? 'bg-[#FF8DA1] text-white shadow-xs'
                : 'text-[#A89094] hover:text-[#7D5A61]'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Teleprompter Reading 📜</span>
          </button>

          <button
            onClick={() => {
              sounds.playPop();
              setActiveTab('situations');
            }}
            className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'situations'
                ? 'bg-[#FF8DA1] text-white shadow-xs'
                : 'text-[#A89094] hover:text-[#7D5A61]'
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            <span>Cartoon Situations 🎨</span>
          </button>
        </div>
      </div>

      {micError && (
        <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-2xl flex items-center justify-between">
          <span>{micError}</span>
          <button onClick={() => setMicError(null)} className="font-bold text-rose-800 cursor-pointer">
            Dismiss
          </button>
        </div>
      )}

      {/* =========================================================================
          TAB 1: TELEPROMPTER MOVING SCROLL READING & AI COACH
         ========================================================================= */}
      {activeTab === 'teleprompter' && (
        <div className="space-y-6">
          {/* Library Category Navigation Chips */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-[#FFE4E9] shadow-xs">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-[#A89094] mr-1">Practice Library:</span>

              <button
                onClick={() => {
                  sounds.playPop();
                  setLibraryFilter('all');
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  libraryFilter === 'all'
                    ? 'bg-[#FFB6C1] text-white shadow-xs'
                    : 'bg-[#FFF9FA] text-[#7D5A61] hover:bg-[#FFF0F3]'
                }`}
              >
                🌈 All
              </button>

              <button
                onClick={() => {
                  sounds.playPop();
                  setLibraryFilter('story');
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  libraryFilter === 'story'
                    ? 'bg-[#FFB6C1] text-white shadow-xs'
                    : 'bg-[#FFF9FA] text-[#7D5A61] hover:bg-[#FFF0F3]'
                }`}
              >
                📖 Stories
              </button>

              <button
                onClick={() => {
                  sounds.playPop();
                  setLibraryFilter('poem');
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  libraryFilter === 'poem'
                    ? 'bg-[#FFB6C1] text-white shadow-xs'
                    : 'bg-[#FFF9FA] text-[#7D5A61] hover:bg-[#FFF0F3]'
                }`}
              >
                🎵 Playful Poems
              </button>

              <button
                onClick={() => {
                  sounds.playPop();
                  setLibraryFilter('twister');
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  libraryFilter === 'twister'
                    ? 'bg-[#FFB6C1] text-white shadow-xs'
                    : 'bg-[#FFF9FA] text-[#7D5A61] hover:bg-[#FFF0F3]'
                }`}
              >
                👅 Tongue Twisters
              </button>

              {savedStories.length > 0 && (
                <button
                  onClick={() => {
                    sounds.playPop();
                    setLibraryFilter('my_stories');
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    libraryFilter === 'my_stories'
                      ? 'bg-[#FF8DA1] text-white shadow-xs'
                      : 'bg-[#FFF0F3] text-[#FF8DA1] hover:bg-[#FFE4E9]'
                  }`}
                >
                  ✨ Read My Own Stories ({savedStories.length})
                </button>
              )}
            </div>

            {/* Listen Guide Button */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleListenGuide(false)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 cursor-pointer ${
                  isGuideSpeaking
                    ? 'bg-[#FF8DA1] text-white border-[#FF8DA1] animate-pulse'
                    : 'bg-[#FFF9FA] text-[#7D5A61] border-[#FFE4E9] hover:bg-[#FFF0F3]'
                }`}
                title="Hear a friendly guide read this piece aloud"
              >
                <Volume2 className="w-3.5 h-3.5 text-[#FF8DA1]" />
                <span>{isGuideSpeaking ? 'Reading Aloud...' : 'Listen Guide'}</span>
              </button>

              <button
                onClick={() => handleListenGuide(true)}
                className="px-2.5 py-1.5 rounded-xl bg-[#FFF9FA] hover:bg-[#FFF0F3] border border-[#FFE4E9] text-[11px] font-semibold text-[#7D5A61] cursor-pointer"
                title="Hear slow pronunciation"
              >
                <span>🐢 Slow Guide</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column: Story/Poem Selection List (4 Cols) */}
            <div className="lg:col-span-4 space-y-3">
              <div className="flex items-center justify-between px-1">
                <span className="text-xs font-bold uppercase tracking-wider text-[#A89094]">
                  {libraryFilter === 'my_stories' ? 'Your Saved Bookshelf:' : 'Select Passage:'}
                </span>
                <span className="text-[11px] font-bold text-[#FF8DA1]">
                  {libraryFilter === 'my_stories' ? savedStories.length : filteredLibrary.length} choices
                </span>
              </div>

              <div className="space-y-2 max-h-[580px] overflow-y-auto pr-1">
                {libraryFilter === 'my_stories' ? (
                  savedStories.map((story) => {
                    const isSelected = selectedMyStoryId === story.id;
                    return (
                      <button
                        key={story.id}
                        onClick={() => {
                          sounds.playPop();
                          setSelectedMyStoryId(story.id);
                          handleResetScroll();
                          setAiFeedback(null);
                        }}
                        className={`w-full p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-white border-[#FF8DA1] shadow-md ring-2 ring-[#FFD1DC]'
                            : 'bg-[#FFF9FA] border-[#FFE4E9] hover:border-[#FFD1DC]'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-heading font-bold text-xs text-[#7D5A61] line-clamp-1">
                            {story.emoji || '📖'} {story.title}
                          </span>
                          <span className="text-[10px] uppercase font-bold text-[#FF8DA1] bg-[#FFF0F3] px-2 py-0.5 rounded-full">
                            My Story
                          </span>
                        </div>
                        <p className="text-[11px] text-[#A89094] line-clamp-2 leading-relaxed">
                          {story.content}
                        </p>
                      </button>
                    );
                  })
                ) : (
                  filteredLibrary.map((item) => {
                    const isSelected = selectedItemId === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => handleSelectItem(item.id)}
                        className={`w-full p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-white border-[#FF8DA1] shadow-md ring-2 ring-[#FFD1DC]'
                            : 'bg-[#FFF9FA] border-[#FFE4E9] hover:border-[#FFD1DC]'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-heading font-bold text-xs text-[#7D5A61] line-clamp-1">
                            {item.categoryEmoji} {item.title}
                          </span>
                          <span className="text-[10px] uppercase font-bold text-[#A89094] bg-[#FFF0F3] px-2 py-0.5 rounded-full">
                            {item.type}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#A89094] line-clamp-2 leading-relaxed">
                          {item.paragraphs[0]}
                        </p>
                      </button>
                    );
                  })
                )}
              </div>
            </div>

            {/* Right Column: Moving Scroll Teleprompter Studio (8 Cols) */}
            <div className="lg:col-span-8 space-y-4">
              <div className="bg-white rounded-3xl border-3 border-[#FFE4E9] p-6 sm:p-7 shadow-lg space-y-5">
                {/* Teleprompter Top Title & Controls */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-[#FFE4E9] pb-4">
                  <div className="flex items-center gap-2.5">
                    <span className="text-3xl">{currentItem.categoryEmoji}</span>
                    <div>
                      <h2 className="text-xl font-heading font-extrabold text-[#7D5A61]">
                        {currentItem.title}
                      </h2>
                      <div className="flex items-center gap-2 text-xs text-[#A89094]">
                        <span className="capitalize font-semibold text-[#FF8DA1]">
                          {currentItem.type === 'twister' ? '👅 Tongue Twister' : currentItem.type === 'poem' ? '🎵 Poem' : '📖 Story'}
                        </span>
                        <span>•</span>
                        <span>Level: {currentItem.difficulty}</span>
                      </div>
                    </div>
                  </div>

                  {/* Text Size Control */}
                  <div className="flex items-center gap-1 bg-[#FFF0F3] p-1 rounded-xl border border-[#FFE4E9] text-xs font-bold">
                    <button
                      onClick={() => setTextSize('normal')}
                      className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                        textSize === 'normal' ? 'bg-white text-[#7D5A61] shadow-xs' : 'text-[#A89094]'
                      }`}
                    >
                      A
                    </button>
                    <button
                      onClick={() => setTextSize('large')}
                      className={`px-2.5 py-1 rounded-lg text-sm transition-all cursor-pointer ${
                        textSize === 'large' ? 'bg-white text-[#7D5A61] shadow-xs' : 'text-[#A89094]'
                      }`}
                    >
                      A+
                    </button>
                    <button
                      onClick={() => setTextSize('xlarge')}
                      className={`px-2.5 py-1 rounded-lg text-base transition-all cursor-pointer ${
                        textSize === 'xlarge' ? 'bg-white text-[#7D5A61] shadow-xs' : 'text-[#A89094]'
                      }`}
                    >
                      A++
                    </button>
                  </div>
                </div>

                {/* Speed Controls Toolbar (User Requirement: Scroll Speed Adjuster!) */}
                <div className="bg-[#FFF9FA] border-2 border-[#FFE4E9] rounded-2xl p-4 space-y-3">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                    <div className="flex items-center gap-2 text-xs font-bold text-[#7D5A61]">
                      <Sliders className="w-4 h-4 text-[#FF8DA1]" />
                      <span>Scroll Speed:</span>
                    </div>

                    {/* Speed Presets */}
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <button
                        onClick={() => {
                          sounds.playPop();
                          setScrollSpeedMultiplier(0.6);
                        }}
                        className={`px-3 py-1 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                          scrollSpeedMultiplier === 0.6
                            ? 'bg-[#FF8DA1] text-white border-[#FF8DA1] shadow-xs'
                            : 'bg-white text-[#7D5A61] border-[#FFE4E9] hover:bg-[#FFF0F3]'
                        }`}
                      >
                        🐢 Turtle (Slow)
                      </button>

                      <button
                        onClick={() => {
                          sounds.playPop();
                          setScrollSpeedMultiplier(1.0);
                        }}
                        className={`px-3 py-1 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                          scrollSpeedMultiplier === 1.0
                            ? 'bg-[#FF8DA1] text-white border-[#FF8DA1] shadow-xs'
                            : 'bg-white text-[#7D5A61] border-[#FFE4E9] hover:bg-[#FFF0F3]'
                        }`}
                      >
                        🚶 Butterfly (Steady)
                      </button>

                      <button
                        onClick={() => {
                          sounds.playPop();
                          setScrollSpeedMultiplier(1.4);
                        }}
                        className={`px-3 py-1 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                          scrollSpeedMultiplier === 1.4
                            ? 'bg-[#FF8DA1] text-white border-[#FF8DA1] shadow-xs'
                            : 'bg-white text-[#7D5A61] border-[#FFE4E9] hover:bg-[#FFF0F3]'
                        }`}
                      >
                        🐇 Bunny (Storyteller)
                      </button>

                      <button
                        onClick={() => {
                          sounds.playPop();
                          setScrollSpeedMultiplier(2.0);
                        }}
                        className={`px-3 py-1 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                          scrollSpeedMultiplier === 2.0
                            ? 'bg-[#FF8DA1] text-white border-[#FF8DA1] shadow-xs'
                            : 'bg-white text-[#7D5A61] border-[#FFE4E9] hover:bg-[#FFF0F3]'
                        }`}
                      >
                        🚀 Rocket (Fast)
                      </button>
                    </div>
                  </div>

                  {/* Speed Fine-Tune Slider */}
                  <div className="flex items-center gap-3 pt-1">
                    <span className="text-[11px] font-semibold text-[#A89094]">0.5x</span>
                    <input
                      type="range"
                      min="0.5"
                      max="2.5"
                      step="0.1"
                      value={scrollSpeedMultiplier}
                      onChange={(e) => setScrollSpeedMultiplier(parseFloat(e.target.value))}
                      className="flex-1 accent-[#FF8DA1] h-2 bg-[#FFE4E9] rounded-lg cursor-pointer"
                    />
                    <span className="text-[11px] font-semibold text-[#A89094]">2.5x</span>
                    <span className="text-xs font-extrabold text-[#FF8DA1] min-w-[42px] text-right">
                      {scrollSpeedMultiplier.toFixed(1)}x
                    </span>
                  </div>
                </div>

                {/* THE CRYSTAL-CLEAR TELEPROMPTER & READING ZONE */}
                <div className="relative rounded-3xl border-4 border-[#FFD1DC] bg-[#FFFBFB] overflow-hidden shadow-inner flex flex-col">
                  {/* Top Reading Zone Status & Highlighting Legend Bar */}
                  <div className="bg-gradient-to-r from-[#FFF0F3] via-white to-[#FFF0F3] border-b-2 border-[#FFE4E9] px-4 py-2.5 flex flex-wrap items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-heading font-extrabold text-[#7D5A61] flex items-center gap-1.5">
                        <span>📖 Reading Teleprompter</span>
                      </span>
                      <span className="hidden sm:inline text-[#A89094]">•</span>
                      <span className="text-[11px] text-[#A89094]">Tap any word to hear it pronounced 🔊</span>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Live Voice Match Counter */}
                      {isRecording && (
                        <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-400/40 text-emerald-800 text-[11px] font-bold animate-pulse">
                          <span>🎙️ Words Spoken:</span>
                          <span className="font-mono text-emerald-900">
                            {recognizedWordsCount} / {passageWordsList.length}
                          </span>
                        </div>
                      )}

                      {/* Focus Ruler Toggle Button */}
                      <button
                        onClick={() => {
                          sounds.playPop();
                          setShowReadingRuler(!showReadingRuler);
                        }}
                        className={`px-2.5 py-1 rounded-xl text-[11px] font-bold border transition-all cursor-pointer flex items-center gap-1 ${
                          showReadingRuler
                            ? 'bg-[#FF8DA1] text-white border-[#FF8DA1] shadow-2xs'
                            : 'bg-white text-[#7D5A61] border-[#FFE4E9] hover:bg-[#FFF0F3]'
                        }`}
                        title="Toggle focus reading ruler"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>{showReadingRuler ? 'Focus Line: ON' : 'Focus Line: OFF'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Optional Soft Focus Line Guide (Non-obstructive) */}
                  {showReadingRuler && (
                    <div className="sticky top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#FF8DA1] to-transparent z-20 shadow-xs" />
                  )}

                  {/* Scrollable Text Viewport with Interactive Word Highlighting */}
                  <div
                    ref={scrollContainerRef}
                    className={`h-[300px] sm:h-[340px] overflow-y-auto px-6 sm:px-12 py-8 space-y-6 scroll-smooth ${
                      textSize === 'xlarge'
                        ? 'text-2xl leading-loose font-serif'
                        : textSize === 'large'
                        ? 'text-xl leading-loose font-serif'
                        : 'text-base leading-relaxed font-serif'
                    }`}
                  >
                    {currentItem.paragraphs.map((para, pIdx) => (
                      <div
                        key={pIdx}
                        className="p-5 rounded-2xl bg-white/80 border border-[#FFE4E9] shadow-xs text-[#2D1B22] leading-loose"
                      >
                        {para.split('\n').map((line, lIdx) => {
                          const words = line.split(/\s+/).filter(Boolean);
                          return (
                            <p key={lIdx} className="mb-3 last:mb-0 flex flex-wrap items-center gap-y-1">
                              {words.map((rawWord, wIdx) => {
                                const cleanWord = rawWord.toLowerCase().replace(/[^a-z0-9]/g, '');
                                const isSpoken = cleanWord && spokenWordsSet.has(cleanWord);
                                const isVocabSpark = cleanWord && vocabSparksSet.has(cleanWord);
                                const isClicked = cleanWord && highlightedWord === cleanWord;

                                return (
                                  <span
                                    key={wIdx}
                                    onClick={() => handleSpeakSingleWord(rawWord)}
                                    title="Click to hear pronunciation"
                                    className={`inline-block mx-0.5 my-0.5 px-1 py-0.5 rounded-lg transition-all duration-150 cursor-pointer ${
                                      isClicked
                                        ? 'bg-amber-200 text-amber-950 border border-amber-400 shadow-sm scale-110 font-bold z-10'
                                        : isSpoken
                                        ? 'bg-emerald-100 text-emerald-950 border border-emerald-300 font-bold shadow-2xs scale-102'
                                        : isVocabSpark
                                        ? 'bg-purple-100 text-purple-900 border-b-2 border-purple-400 font-bold hover:bg-purple-200'
                                        : 'hover:bg-[#FFF0F3] hover:text-[#FF6B8B] hover:scale-105 active:scale-95'
                                    }`}
                                  >
                                    {rawWord}
                                  </span>
                                );
                              })}
                            </p>
                          );
                        })}
                      </div>
                    ))}

                    <div className="text-center py-8 text-sm font-bold text-[#FF8DA1] font-sans">
                      🎉 Hooray! You reached the end of the story! ✨
                    </div>
                  </div>

                  {/* Highlighting Legend Footnote */}
                  <div className="bg-[#FFF9FA] border-t border-[#FFE4E9] px-4 py-2 flex flex-wrap items-center justify-between gap-2 text-[11px] font-medium text-[#7D5A61]">
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="text-[10px] uppercase font-bold text-[#A89094]">Word Colors:</span>
                      <span className="flex items-center gap-1">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 border border-emerald-600 inline-block" />
                        <span>Spoken Aloud</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="w-2.5 h-2.5 rounded-full bg-purple-400 border border-purple-600 inline-block" />
                        <span>Spark Vocabulary</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-400 border border-amber-600 inline-block" />
                        <span>Tapped Pronunciation</span>
                      </span>
                    </div>

                    <span className="text-[#A89094] font-sans">
                      Total Passage: {passageWordsList.length} words
                    </span>
                  </div>

                  {/* Scroll Progress Bar at bottom of teleprompter */}
                  <div className="h-2 bg-[#FFE4E9] w-full">
                    <div
                      className="h-full bg-gradient-to-r from-[#FFB6C1] to-[#FF8DA1] transition-all duration-150"
                      style={{ width: `${scrollProgress}%` }}
                    />
                  </div>
                </div>

                {/* Teleprompter Play / Pause / Reset & Recording Controls Bar */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                  {/* Scroll Actions */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleToggleScroll}
                      className={`px-4 py-2.5 rounded-2xl font-bold text-xs border transition-all flex items-center gap-1.5 cursor-pointer shadow-xs ${
                        isScrolling
                          ? 'bg-amber-100 border-amber-300 text-amber-900'
                          : 'bg-white border-[#FFE4E9] text-[#7D5A61] hover:bg-[#FFF0F3]'
                      }`}
                    >
                      {isScrolling ? (
                        <>
                          <Pause className="w-4 h-4 text-amber-600" />
                          <span>Pause Scroll</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4 text-[#FF8DA1]" />
                          <span>Start Auto-Scroll</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={handleResetScroll}
                      className="p-2.5 rounded-2xl bg-white border border-[#FFE4E9] text-[#7D5A61] hover:bg-[#FFF0F3] transition-colors cursor-pointer"
                      title="Rewind scroll to the top"
                    >
                      <RotateCcw className="w-4 h-4 text-[#A89094]" />
                    </button>
                  </div>

                  {/* Primary Record Button with Live Pulse & Time */}
                  <div className="flex items-center gap-3">
                    {isRecording ? (
                      <button
                        onClick={handleStopRecording}
                        className="px-6 py-3 rounded-2xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-sm shadow-md flex items-center gap-2.5 transition-all animate-pulse cursor-pointer"
                      >
                        <MicOff className="w-5 h-5" />
                        <span>Stop & Get AI Feedback ({recordingSeconds}s) 🛑</span>
                      </button>
                    ) : (
                      <button
                        onClick={handleStartRecording}
                        className="px-6 py-3 rounded-2xl bg-gradient-to-r from-[#FF8DA1] to-[#FF6B8B] hover:opacity-95 text-white font-extrabold text-sm shadow-md flex items-center gap-2.5 transition-all hover:scale-102 cursor-pointer active:scale-98"
                      >
                        <Mic className="w-5 h-5 text-white" />
                        <span>🎙️ Read & Record Aloud</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Live Transcript / Spoken Preview */}
                {isRecording && recordedTranscript && (
                  <div className="p-4 rounded-2xl bg-[#FFF0F3] border border-[#FFB6C1] space-y-1 animate-fadeIn">
                    <span className="text-[11px] font-bold text-[#FF8DA1] uppercase tracking-wider flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                      Listening to your voice:
                    </span>
                    <p className="text-xs text-[#7D5A61] italic font-medium">
                      "{recordedTranscript}"
                    </p>
                  </div>
                )}

                {/* Recorded Voice Player (if student recorded voice) */}
                {audioUrl && !isRecording && (
                  <div className="p-4 rounded-2xl bg-[#FFF9FA] border border-[#FFE4E9] flex flex-col sm:flex-row items-center justify-between gap-3 animate-fadeIn">
                    <div className="flex items-center gap-2 text-xs font-bold text-[#7D5A61]">
                      <Volume2 className="w-4 h-4 text-[#FF8DA1]" />
                      <span>Listen to Your Own Recording:</span>
                    </div>
                    <audio controls src={audioUrl} className="w-full sm:w-auto h-8 accent-[#FF8DA1]" />
                  </div>
                )}

                {/* Loading AI Feedback state */}
                {isAiEvaluating && (
                  <div className="p-6 rounded-3xl bg-indigo-50/70 border border-indigo-200 text-center space-y-2 animate-pulse">
                    <Sparkles className="w-8 h-8 text-indigo-500 mx-auto animate-spin" />
                    <h3 className="font-heading font-bold text-sm text-indigo-900">
                      Magical AI Voice Coach is analyzing your reading fluency... ✨
                    </h3>
                    <p className="text-xs text-indigo-600">
                      Checking your rhythm, words, and storytelling expression!
                    </p>
                  </div>
                )}

                {/* AI COACH FEEDBACK CARD (Kid-Friendly & Encouraging!) */}
                {aiFeedback && !isAiEvaluating && (
                  <div className="rounded-3xl border-3 border-[#FFD1DC] bg-gradient-to-br from-white via-[#FFF9FA] to-[#FFF0F3] p-6 sm:p-7 shadow-lg space-y-5 animate-fadeIn">
                    {/* Header & Stars */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-[#FFE4E9] pb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-amber-100 border border-amber-300 flex items-center justify-center text-2xl shadow-xs">
                          ⭐
                        </div>
                        <div>
                          <h3 className="font-heading font-extrabold text-lg sm:text-xl text-[#7D5A61]">
                            {aiFeedback.encouragementTitle}
                          </h3>
                          <p className="text-xs text-[#A89094]">
                            {aiFeedback.expressionRating} • Pace: {aiFeedback.paceLabel}
                          </p>
                        </div>
                      </div>

                      {/* 3 Stars Award */}
                      <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-full border border-[#FFE4E9] shadow-xs">
                        {[1, 2, 3].map((star) => (
                          <Star
                            key={star}
                            className={`w-6 h-6 ${
                              star <= aiFeedback.stars
                                ? 'text-amber-400 fill-amber-400 animate-bounce'
                                : 'text-stone-200'
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Feedback Message */}
                    <div className="p-4 rounded-2xl bg-white border border-[#FFE4E9] shadow-xs">
                      <p className="text-sm text-[#5D4A4F] leading-relaxed font-medium">
                        {aiFeedback.encouragementMessage}
                      </p>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      <div className="p-3 rounded-2xl bg-white border border-[#FFE4E9] text-center shadow-2xs">
                        <span className="text-[10px] font-bold uppercase text-[#A89094]">
                          Words Read Fluently
                        </span>
                        <div className="text-lg font-extrabold text-[#FF8DA1] mt-0.5">
                          {aiFeedback.matchedWordsCount} / {aiFeedback.totalWordsCount}
                        </div>
                      </div>

                      <div className="p-3 rounded-2xl bg-white border border-[#FFE4E9] text-center shadow-2xs">
                        <span className="text-[10px] font-bold uppercase text-[#A89094]">
                          Fluency Accuracy
                        </span>
                        <div className="text-lg font-extrabold text-emerald-600 mt-0.5">
                          {aiFeedback.accuracyPercentage}%
                        </div>
                      </div>

                      <div className="p-3 rounded-2xl bg-white border border-[#FFE4E9] text-center shadow-2xs col-span-2 sm:col-span-1">
                        <span className="text-[10px] font-bold uppercase text-[#A89094]">
                          Pacing Rating
                        </span>
                        <div className="text-sm font-extrabold text-indigo-600 mt-1">
                          {aiFeedback.paceLabel}
                        </div>
                      </div>
                    </div>

                    {/* Coaching Tips */}
                    {aiFeedback.coachingTips.length > 0 && (
                      <div className="space-y-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-[#7D5A61] flex items-center gap-1.5">
                          <Wand2 className="w-3.5 h-3.5 text-[#FF8DA1]" />
                          <span>Magic Tips for Next Time:</span>
                        </span>
                        <div className="space-y-1.5">
                          {aiFeedback.coachingTips.map((tip, idx) => (
                            <div
                              key={idx}
                              className="p-3 rounded-xl bg-white border border-[#FFE4E9] text-xs text-[#5D4A4F] flex items-start gap-2.5 shadow-2xs"
                            >
                              <span className="w-5 h-5 rounded-full bg-[#FFF0F3] text-[#FF8DA1] font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                                {idx + 1}
                              </span>
                              <span>{tip}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Actions: Hear Coach Voice + Send to Aashna */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#FFE4E9]">
                      <button
                        onClick={() => {
                          sounds.playPop();
                          speakWordOrSentence(
                            `${aiFeedback.encouragementTitle}. ${aiFeedback.encouragementMessage} ${aiFeedback.coachingTips.join(' ')}`
                          );
                        }}
                        className="px-4 py-2 rounded-xl bg-white hover:bg-[#FFF0F3] border border-[#FFE4E9] text-xs font-bold text-[#7D5A61] flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Volume2 className="w-4 h-4 text-[#FF8DA1]" />
                        <span>🔊 Hear Coach Read Feedback</span>
                      </button>

                      {onOpenEmailModal && (
                        <button
                          onClick={() => {
                            sounds.playPop();
                            onOpenEmailModal(
                              `Oral Reading Reflection: ${currentItem.title}`,
                              `Passage: ${currentItem.title} (${currentItem.type})\n\nStudent Spoken Transcript:\n${recordedTranscript || currentItem.content}\n\nFluency Accuracy: ${aiFeedback.accuracyPercentage}%\nStars: ${aiFeedback.stars}/3\nPace: ${aiFeedback.paceLabel}`
                            );
                          }}
                          className="px-4 py-2 rounded-xl bg-[#FF8DA1] hover:bg-[#FF6B8B] text-white text-xs font-bold shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>Share with Aashna 💌</span>
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 2: CARTOON SITUATIONS (OBSERVE & SPEAK)
         ========================================================================= */}
      {activeTab === 'situations' && (
        <div className="space-y-6">
          {/* Situation Cards Selection Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {SITUATION_CARDS.map((sit, idx) => {
              const isSelected = selectedSituationIdx === idx;
              return (
                <button
                  key={sit.id}
                  onClick={() => {
                    sounds.playPop();
                    setSelectedSituationIdx(idx);
                    setSituationTranscript('');
                  }}
                  className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-white border-[#FF8DA1] shadow-md ring-2 ring-[#FFD1DC]'
                      : 'bg-[#FFF9FA] border-[#FFE4E9] hover:border-[#FFD1DC]'
                  }`}
                >
                  <span className="text-2xl block mb-1">{sit.emoji}</span>
                  <span className="text-[11px] font-heading font-bold text-[#7D5A61] line-clamp-1">
                    {sit.title.split(' ')[1] || sit.title}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left: Cartoon Scene Card (6 Cols) */}
            <div className="lg:col-span-6 space-y-4">
              <CartoonSceneCard situation={currentSituation} />

              <div className="bg-white rounded-3xl border-2 border-[#FFE4E9] p-5 space-y-3 shadow-xs">
                <h4 className="font-heading font-bold text-xs text-[#7D5A61] flex items-center gap-1.5 uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5 text-[#FF8DA1]" />
                  <span>Observation Prompts:</span>
                </h4>
                <div className="space-y-1.5">
                  {currentSituation.guidedQuestions.map((q, i) => (
                    <div
                      key={i}
                      className="p-2.5 rounded-xl bg-[#FFF9FA] border border-[#FFE4E9] text-xs text-[#5D4A4F] flex items-start gap-2"
                    >
                      <span className="w-4 h-4 rounded-full bg-[#FFF0F3] text-[#FF8DA1] font-bold text-[10px] flex items-center justify-center flex-shrink-0 mt-0.5">
                        {i + 1}
                      </span>
                      <span>{q}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Spoken Reflection Canvas (6 Cols) */}
            <div className="lg:col-span-6 space-y-4">
              <div className="bg-white rounded-3xl border-3 border-[#FFE4E9] p-6 space-y-5 shadow-lg">
                <div>
                  <h3 className="font-heading font-bold text-lg text-[#7D5A61]">
                    {currentSituation.title}
                  </h3>
                  <p className="text-xs text-[#A89094] italic mt-1">
                    "{currentSituation.starterPrompt}"
                  </p>
                </div>

                {/* Spark Keywords */}
                <div className="space-y-2">
                  <span className="text-[11px] font-bold text-[#A89094] uppercase tracking-wider">
                    Spark Keywords to Use in Your Speech:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {currentSituation.sampleKeywords.map((kw) => (
                      <button
                        key={kw}
                        onClick={() => {
                          sounds.playPop();
                          speakWordOrSentence(kw);
                        }}
                        className="px-2.5 py-1 rounded-xl bg-[#FFF0F3] text-[#7D5A61] border border-[#FFE4E9] text-xs font-semibold hover:bg-[#FFE4E9] flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        <Volume2 className="w-3 h-3 text-[#FF8DA1]" />
                        <span>{kw}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Voice Input Box */}
                <div className="p-4 rounded-2xl bg-[#FFF9FA] border border-[#FFE4E9] space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#7D5A61]">
                      Your Spoken Description:
                    </span>
                    {situationTranscript && (
                      <span className="text-[11px] text-emerald-700 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Captured
                      </span>
                    )}
                  </div>

                  <p className="text-xs sm:text-sm text-[#5D4A4F] min-h-[70px] bg-white p-3.5 rounded-xl border border-[#FFE4E9] leading-relaxed">
                    {situationTranscript ||
                      'Tap the microphone button below and describe what is happening in this lively scene!'}
                  </p>

                  <div className="flex items-center justify-between gap-3 pt-1">
                    <button
                      onClick={handleToggleSituationMic}
                      className={`px-5 py-2.5 rounded-xl font-bold text-xs shadow-xs flex items-center gap-2 transition-all cursor-pointer ${
                        isSituationRecording
                          ? 'bg-rose-500 text-white animate-pulse'
                          : 'bg-[#FF8DA1] hover:bg-[#FF6B8B] text-white hover:scale-102'
                      }`}
                    >
                      {isSituationRecording ? (
                        <>
                          <MicOff className="w-4 h-4" />
                          <span>Stop Recording</span>
                        </>
                      ) : (
                        <>
                          <Mic className="w-4 h-4" />
                          <span>Describe Aloud 🎙️</span>
                        </>
                      )}
                    </button>

                    {situationTranscript && (
                      <button
                        onClick={() => {
                          sounds.playPop();
                          speakWordOrSentence(situationTranscript);
                        }}
                        className="p-2 rounded-xl bg-white hover:bg-[#FFF0F3] text-[#7D5A61] border border-[#FFE4E9] text-xs font-bold cursor-pointer"
                        title="Listen to what you recorded"
                      >
                        <Volume2 className="w-4 h-4 text-[#FF8DA1]" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
