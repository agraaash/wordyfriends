import React, { useState, useEffect } from 'react';
import { SentenceChallenge, WordOption, DiaryWord } from '../../types';
import { DetectiveMascot } from './DetectiveMascot';
import {
  Volume2,
  BookMarked,
  Sparkles,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  RotateCcw,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Bookmark,
  BookmarkCheck,
  Award,
  ArrowLeft,
  Shuffle,
  Search,
  Filter,
  Check
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { speakWordOrSentence, stopSpeaking } from '../../utils/speech';
import { sounds } from '../../utils/sound';

interface WordDetectiveGameProps {
  challenges: SentenceChallenge[];
  onBackToHub: () => void;
  diaryWords: DiaryWord[];
  onAddWordToDiary: (wordOption: WordOption, reason: 'wrong_answer' | 'user_saved') => void;
  onOpenDiary: () => void;
  onAnswerCorrect: () => void;
}

export const WordDetectiveGame: React.FC<WordDetectiveGameProps> = ({
  challenges,
  onBackToHub,
  diaryWords,
  onAddWordToDiary,
  onOpenDiary,
  onAnswerCorrect,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedWordId, setSelectedWordId] = useState<string | null>(null);
  const [isAnswerChecked, setIsAnswerChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [expandedDefinitions, setExpandedDefinitions] = useState<{ [key: string]: boolean }>({});
  const [isPlayingSentenceAudio, setIsPlayingSentenceAudio] = useState(false);
  const [playingWordId, setPlayingWordId] = useState<string | null>(null);
  const [savedStatus, setSavedStatus] = useState<{ [key: string]: boolean }>({});
  const [streakCount, setStreakCount] = useState(5);
  const [solvedIds, setSolvedIds] = useState<{ [key: string]: boolean }>({});
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isJumpSelectorOpen, setIsJumpSelectorOpen] = useState(false);

  const currentChallenge = challenges[currentIndex] || challenges[0];

  // Check which words in current challenge are in diary
  useEffect(() => {
    const statusMap: { [key: string]: boolean } = {};
    if (currentChallenge) {
      currentChallenge.options.forEach((opt) => {
        const inDiary = diaryWords.some(
          (w) => w.word.toLowerCase() === opt.word.toLowerCase()
        );
        statusMap[opt.id] = inDiary;
      });
    }
    setSavedStatus(statusMap);
  }, [currentChallenge, diaryWords]);

  const handleSelectOption = (option: WordOption) => {
    if (isAnswerChecked) return; // already answered this round

    sounds.playPop();
    setSelectedWordId(option.id);
    const correct = option.id === currentChallenge.correctWordId;
    setIsCorrect(correct);
    setIsAnswerChecked(true);

    if (correct) {
      sounds.playCorrect();
      setStreakCount((prev) => prev + 1);
      setSolvedIds((prev) => ({ ...prev, [currentChallenge.id]: true }));
      onAnswerCorrect();

      // Celebratory confetti with pops of colors
      try {
        confetti({
          particleCount: 50,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#F59E0B', '#EC4899', '#3B82F6', '#10B981', '#8B5CF6', '#F43F5E'],
        });
      } catch {
        // Ignore
      }
    } else {
      sounds.playGentleRetry();
      // Auto save to vocabulary diary
      onAddWordToDiary(option, 'wrong_answer');
      setSavedStatus((prev) => ({ ...prev, [option.id]: true }));
    }
  };

  const toggleDefinition = (optionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    sounds.playPop();
    setExpandedDefinitions((prev) => ({
      ...prev,
      [optionId]: !prev[optionId],
    }));
  };

  const handleSaveWordManually = (option: WordOption, e: React.MouseEvent) => {
    e.stopPropagation();
    sounds.playBookmark();
    onAddWordToDiary(option, 'user_saved');
    setSavedStatus((prev) => ({
      ...prev,
      [option.id]: true,
    }));
  };

  const resetPuzzleState = () => {
    stopSpeaking();
    setSelectedWordId(null);
    setIsAnswerChecked(false);
    setIsCorrect(false);
    setExpandedDefinitions({});
  };

  const handleNextPuzzle = () => {
    sounds.playPop();
    resetPuzzleState();
    setCurrentIndex((prev) => (prev + 1) % challenges.length);
  };

  const handlePrevPuzzle = () => {
    sounds.playPop();
    resetPuzzleState();
    setCurrentIndex((prev) => (prev - 1 + challenges.length) % challenges.length);
  };

  const handleRandomPuzzle = () => {
    sounds.playPop();
    resetPuzzleState();
    const rand = Math.floor(Math.random() * challenges.length);
    setCurrentIndex(rand);
  };

  const handleJumpToIndex = (idx: number) => {
    sounds.playPop();
    resetPuzzleState();
    setCurrentIndex(idx);
    setIsJumpSelectorOpen(false);
  };

  const handleSpeakSentence = () => {
    sounds.playPop();
    setIsPlayingSentenceAudio(true);
    const textToRead = isAnswerChecked && isCorrect
      ? currentChallenge.fullSentence
      : currentChallenge.sentenceWithBlank.replace('____', 'blank');
    speakWordOrSentence(textToRead, false, () => {
      setIsPlayingSentenceAudio(false);
    });
  };

  const handleSpeakOption = (word: string, optionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    sounds.playPop();
    setPlayingWordId(optionId);
    speakWordOrSentence(word, true, () => {
      setPlayingWordId(null);
    });
  };

  const selectedOption = currentChallenge.options.find((opt) => opt.id === selectedWordId);

  // Dynamic mascot speech message
  const getMascotMessage = () => {
    if (!isAnswerChecked) {
      return `Look closely through the detective glass! Which word completes the mystery sentence? (Clue #${currentIndex + 1} of ${challenges.length})`;
    }
    if (isCorrect) {
      return `Brilliant deduction, Detective! "${selectedOption?.word}" fits the clue wonderfully! ⭐`;
    }
    return `Good try! Don't worry, "${selectedOption?.word}" is saved into your Vocabulary Diary so we can practice it together! 📖`;
  };

  // Render sentence with blank
  const renderSentenceWithBlank = () => {
    const parts = currentChallenge.sentenceWithBlank.split('____');
    if (parts.length < 2) return currentChallenge.sentenceWithBlank;

    return (
      <span className="leading-relaxed">
        {parts[0]}
        <span
          className={`inline-block min-w-[140px] px-3 border-b-4 mx-2 align-bottom transition-all font-bold ${
            !isAnswerChecked
              ? 'border-[#F59E0B] text-[#D97706]'
              : isCorrect
              ? 'border-emerald-500 text-emerald-700 bg-emerald-50 rounded-lg pb-0.5'
              : 'border-rose-500 text-rose-700 bg-rose-50 rounded-lg pb-0.5'
          }`}
        >
          {isAnswerChecked && selectedOption ? selectedOption.word : ''}
        </span>
        {parts[1]}
      </span>
    );
  };

  const totalSolvedCount = Object.keys(solvedIds).length;

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn select-none">
      {/* Top Detective Header & Navigation */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <button
              onClick={() => {
                sounds.playPop();
                stopSpeaking();
                onBackToHub();
              }}
              className="p-1.5 rounded-xl text-[#7D5A61] hover:bg-[#FFF0F3] transition-colors mr-1 cursor-pointer"
              title="Back to topics"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h2 className="text-3xl font-bold text-[#7D5A61] flex items-center gap-2">
              <span>Word Detective</span>
              <span className="text-2xl">🔍</span>
            </h2>
          </div>
          <p className="text-[#A89094] text-sm">
            Case #{currentIndex + 1} of {challenges.length} • Find the missing word to solve the clue!
          </p>
        </div>

        <div className="flex items-center gap-3 self-end sm:self-auto flex-wrap">
          {/* Quick Jump Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                sounds.playPop();
                setIsJumpSelectorOpen(!isJumpSelectorOpen);
              }}
              className="px-3.5 py-2 rounded-2xl bg-white border-2 border-[#FED7AA] hover:border-amber-400 text-xs font-bold text-[#78350F] flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <span>Clue #{currentIndex + 1}</span>
              <ChevronDown className="w-3.5 h-3.5 text-amber-600" />
            </button>

            {isJumpSelectorOpen && (
              <div className="absolute right-0 mt-2 w-72 max-h-80 overflow-y-auto bg-white border-2 border-[#FED7AA] rounded-2xl shadow-xl z-30 p-2 space-y-1 animate-fadeIn">
                <div className="px-2 py-1.5 text-[11px] font-bold uppercase text-amber-800 border-b border-amber-100 flex items-center justify-between">
                  <span>Select Any Clue (1 to {challenges.length})</span>
                  <span>{totalSolvedCount} solved</span>
                </div>
                <div className="grid grid-cols-5 gap-1.5 p-1">
                  {challenges.map((c, idx) => {
                    const isCurrent = idx === currentIndex;
                    const isSolved = !!solvedIds[c.id];
                    return (
                      <button
                        key={c.id}
                        onClick={() => handleJumpToIndex(idx)}
                        className={`py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                          isCurrent
                            ? 'bg-amber-500 text-white shadow-xs'
                            : isSolved
                            ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                            : 'bg-stone-50 hover:bg-amber-100 text-stone-700'
                        }`}
                      >
                        #{idx + 1}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Random Clue Shuffle */}
          <button
            onClick={handleRandomPuzzle}
            className="p-2 rounded-2xl bg-white border border-[#FED7AA] hover:bg-amber-50 text-amber-700 transition-colors shadow-xs cursor-pointer"
            title="Random mystery clue"
          >
            <Shuffle className="w-4 h-4" />
          </button>

          {/* Audio Listen */}
          <button
            onClick={handleSpeakSentence}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-xs font-bold border transition-all cursor-pointer ${
              isPlayingSentenceAudio
                ? 'bg-[#FF8DA1] text-white border-[#FF8DA1] shadow-xs'
                : 'bg-white text-[#7D5A61] border-[#FFE4E9] hover:bg-[#FFF0F3]'
            }`}
          >
            <Volume2 className="w-4 h-4 text-[#FF8DA1]" />
            <span>{isPlayingSentenceAudio ? 'Reading...' : 'Listen'}</span>
          </button>

          {/* Streak Badge */}
          <div className="text-right pl-2 border-l border-[#FED7AA]">
            <span className="text-[10px] uppercase tracking-widest text-[#C4B5B8] font-bold block">
              Streak
            </span>
            <p className="text-base sm:text-lg font-bold text-[#FF8DA1] flex items-center gap-1">
              🔥 {streakCount}
            </p>
          </div>
        </div>
      </div>

      {/* Crayon Boy Detective Mascot Section */}
      <DetectiveMascot
        message={getMascotMessage()}
        isThinking={!isAnswerChecked}
        isCelebrating={isAnswerChecked && isCorrect}
        size="md"
      />

      {/* Sentence Display Card with Crayoned Pop Borders */}
      <div className="bg-white border-4 border-[#FED7AA] hover:border-[#FDBA74] rounded-[32px] p-8 sm:p-12 flex items-center justify-center shadow-sm relative transition-all">
        <div className="absolute top-3 left-4 text-xs font-bold text-amber-600/70 uppercase tracking-wider flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>Mystery Sentence #{currentIndex + 1}</span>
        </div>
        <p className="text-2xl sm:text-4xl text-[#5D4A4F] leading-relaxed text-center font-medium pt-2">
          {renderSentenceWithBlank()}
        </p>
      </div>

      {/* Options Grid with Childlike Colorful Accents */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {currentChallenge.options.map((option, idx) => {
          const isSelected = selectedWordId === option.id;
          const isThisCorrect = option.id === currentChallenge.correctWordId;
          const isExpanded = !!expandedDefinitions[option.id];
          const isSaved = !!savedStatus[option.id];
          const isPronouncing = playingWordId === option.id;

          // Cute pop badge color per option card
          const badgeColors = ['bg-amber-100 text-amber-800', 'bg-sky-100 text-sky-800', 'bg-emerald-100 text-emerald-800', 'bg-purple-100 text-purple-800'];
          const optionColor = badgeColors[idx % badgeColors.length];

          // Compute state classes matching Sleek Interface specification
          let containerClass =
            'group relative flex flex-col justify-between p-6 bg-white border-2 border-[#FFE4E9] rounded-2xl hover:border-[#F59E0B] hover:shadow-sm transition-all cursor-pointer shadow-xs';
          let wordClass = 'text-2xl font-bold text-[#7D5A61]';
          let isWrongSelected = false;
          let isCorrectSelected = false;

          if (isAnswerChecked) {
            if (isSelected) {
              if (isThisCorrect) {
                containerClass =
                  'relative flex flex-col justify-between p-6 bg-[#F0FDF4] border-3 border-[#22C55E] rounded-2xl shadow-xs';
                wordClass = 'text-2xl font-bold text-[#16A34A]';
                isCorrectSelected = true;
              } else {
                containerClass =
                  'relative flex flex-col justify-between p-6 bg-[#FFF2F4] border-3 border-[#FF5F7E] rounded-2xl shadow-xs';
                wordClass = 'text-2xl font-bold text-[#FF5F7E]';
                isWrongSelected = true;
              }
            } else if (isThisCorrect && !isCorrect) {
              containerClass =
                'relative flex flex-col justify-between p-6 bg-[#F0FDF4]/80 border-3 border-[#86EFAC] border-dashed rounded-2xl';
              wordClass = 'text-2xl font-bold text-[#16A34A]';
            }
          }

          return (
            <div
              key={option.id}
              onClick={() => handleSelectOption(option)}
              className={containerClass}
            >
              {/* Option Top: Word Title, Pronounce, and Bookmark */}
              <div className="flex justify-between items-start gap-2">
                <div className="flex items-center gap-2">
                  <span className={wordClass}>{option.word}</span>
                  {option.partOfSpeech && (
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${optionColor}`}>
                      {option.partOfSpeech}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                  {/* Pronounce Word Audio */}
                  <button
                    onClick={(e) => handleSpeakOption(option.word, option.id, e)}
                    className={`p-2 rounded-full transition-colors cursor-pointer ${
                      isPronouncing
                        ? 'bg-[#FF8DA1] text-white shadow-xs'
                        : 'text-[#FFB6C1] hover:bg-[#FFF0F3]'
                    }`}
                    title="Pronounce word"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>

                  {/* Bookmark Button */}
                  <button
                    onClick={(e) => handleSaveWordManually(option, e)}
                    className={`p-2 rounded-full transition-all cursor-pointer ${
                      isSaved
                        ? 'bg-white text-[#FF8DA1] shadow-xs'
                        : 'hover:bg-[#FFF0F3] text-[#FFB6C1]'
                    }`}
                    title={isSaved ? 'Word in diary' : 'Save word to diary'}
                  >
                    {isSaved ? '🔖' : '🔖'}
                  </button>
                </div>
              </div>

              {/* Middle/Bottom: Definition or State Feedback */}
              {isWrongSelected ? (
                /* Wrong State Display */
                <div className="mt-4 flex justify-between items-end">
                  <div className="pr-2">
                    <p className="text-xs text-[#FF5F7E] font-bold uppercase mb-1">
                      Meaning
                    </p>
                    <p className="text-sm text-[#7D5A61]">
                      {option.definition || option.simpleExplanation}
                    </p>
                  </div>
                  <span className="text-2xl flex-shrink-0">❌</span>
                </div>
              ) : isCorrectSelected ? (
                /* Correct State Display */
                <div className="mt-4 flex justify-between items-end">
                  <div className="pr-2">
                    <p className="text-xs text-[#16A34A] font-bold uppercase mb-1">
                      Correct Meaning
                    </p>
                    <p className="text-sm text-[#14532D]">
                      {option.definition}
                    </p>
                  </div>
                  <span className="text-2xl flex-shrink-0">🎉</span>
                </div>
              ) : (
                /* Standard Default Option Footer */
                <div className="mt-4">
                  <p className="text-xs text-[#C4B5B8] italic mb-1.5">
                    Click to view definition
                  </p>
                  <button
                    onClick={(e) => toggleDefinition(option.id, e)}
                    className="text-sm text-[#FF8DA1] font-semibold underline decoration-dotted hover:text-[#FF5F7E] cursor-pointer"
                  >
                    {isExpanded ? 'Hide Definition' : 'View Definition'}
                  </button>

                  {/* Expanded Definition Drawer */}
                  {isExpanded && (
                    <div
                      className="mt-2.5 p-3 rounded-xl bg-[#FFF9FA] border border-[#FFE4E9] space-y-1 text-xs text-[#7D5A61] animate-fadeIn"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <p className="font-semibold">{option.definition}</p>
                      {option.simpleExplanation && (
                        <p className="text-[#FF8DA1] font-medium">
                          💡 {option.simpleExplanation}
                        </p>
                      )}
                      {option.example && (
                        <p className="text-[#A89094] italic">
                          "{option.example}"
                        </p>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Answer Explanation & Next Mystery Bar */}
      {isAnswerChecked && (
        <div
          className={`p-5 rounded-2xl border-2 flex flex-col sm:flex-row items-center justify-between gap-4 animate-fadeIn ${
            isCorrect
              ? 'bg-[#F0FDF4] border-[#86EFAC] text-[#14532D]'
              : 'bg-[#FFF2F4] border-[#FF8DA1] text-[#7D5A61]'
          }`}
        >
          <div className="space-y-1">
            <h4 className="font-bold text-base flex items-center gap-1.5">
              <span>{isCorrect ? '🌟 Case Solved!' : '📖 Learning Case Note:'}</span>
            </h4>
            <p className="text-xs sm:text-sm font-medium leading-relaxed">
              {currentChallenge.explanation}
            </p>
          </div>

          <button
            onClick={handleNextPuzzle}
            className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-[#F59E0B] to-[#EC4899] hover:opacity-95 text-white font-bold rounded-2xl transition-all shadow-sm flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer"
          >
            <span>Next Detective Clue</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Bottom Game Navigation Controls */}
      <div className="pt-3 border-t border-[#FFE4E9] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrevPuzzle}
            className="px-4 py-2 rounded-xl bg-white border border-[#FFE4E9] text-[#7D5A61] font-semibold text-xs hover:bg-[#FFF0F3] transition-colors cursor-pointer"
          >
            ← Previous Clue
          </button>
          <button
            onClick={handleNextPuzzle}
            className="px-4 py-2 rounded-xl bg-white border border-[#FFE4E9] text-[#7D5A61] font-semibold text-xs hover:bg-[#FFF0F3] transition-colors cursor-pointer"
          >
            Next Clue →
          </button>
        </div>

        <button
          onClick={() => {
            sounds.playPop();
            setSelectedWordId(null);
            setIsAnswerChecked(false);
            setIsCorrect(false);
            setExpandedDefinitions({});
          }}
          className="px-3 py-2 text-xs font-semibold text-[#A89094] hover:text-[#7D5A61] flex items-center gap-1 transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset Clue
        </button>
      </div>
    </div>
  );
};
