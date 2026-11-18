import React, { useState } from 'react';
import { DiaryWord } from '../../types';
import {
  X,
  BookMarked,
  Volume2,
  CheckCircle2,
  Trash2,
  Sparkles,
  Search,
  BookOpen,
  Filter,
  Flame,
  ArrowRight,
  RotateCw,
  HelpCircle
} from 'lucide-react';
import { speakWordOrSentence } from '../../utils/speech';
import { sounds } from '../../utils/sound';

interface VocabularyDiaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  diaryWords: DiaryWord[];
  onToggleMastery: (id: string) => void;
  onRemoveWord: (id: string) => void;
  onClearMastered: () => void;
}

export const VocabularyDiaryModal: React.FC<VocabularyDiaryModalProps> = ({
  isOpen,
  onClose,
  diaryWords,
  onToggleMastery,
  onRemoveWord,
  onClearMastered,
}) => {
  const [filter, setFilter] = useState<'all' | 'needs_practice' | 'user_saved' | 'mastered'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeViewMode, setActiveViewMode] = useState<'list' | 'flashcards'>('list');
  const [flashcardIndex, setFlashcardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [speakingWordId, setSpeakingWordId] = useState<string | null>(null);

  if (!isOpen) return null;

  const filteredWords = diaryWords.filter((item) => {
    const matchesSearch =
      item.word.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.definition.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (filter === 'needs_practice') {
      return item.addedReason === 'wrong_answer' && item.masteryStatus !== 'mastered';
    }
    if (filter === 'user_saved') {
      return item.addedReason === 'user_saved';
    }
    if (filter === 'mastered') {
      return item.masteryStatus === 'mastered';
    }
    return true;
  });

  const handleSpeak = (word: string, id: string) => {
    sounds.playPop();
    setSpeakingWordId(id);
    speakWordOrSentence(word, true, () => {
      setSpeakingWordId(null);
    });
  };

  const currentFlashcard = filteredWords[flashcardIndex] || filteredWords[0];

  const handleNextFlashcard = () => {
    sounds.playPop();
    setIsFlipped(false);
    setFlashcardIndex((prev) => (prev + 1) % filteredWords.length);
  };

  const handlePrevFlashcard = () => {
    sounds.playPop();
    setIsFlipped(false);
    setFlashcardIndex((prev) => (prev - 1 + filteredWords.length) % filteredWords.length);
  };

  const wrongCount = diaryWords.filter((w) => w.addedReason === 'wrong_answer' && w.masteryStatus !== 'mastered').length;
  const savedCount = diaryWords.filter((w) => w.addedReason === 'user_saved').length;
  const masteredCount = diaryWords.filter((w) => w.masteryStatus === 'mastered').length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/25 backdrop-blur-xs animate-fadeIn">
      <div
        className="bg-white rounded-[32px] border-4 border-[#FFD1DC] shadow-xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-scaleUp"
        style={{ animationDuration: '200ms' }}
      >
        {/* Modal Header */}
        <div className="bg-[#FFF9FA] px-6 py-4 border-b border-[#FFE4E9] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#FFF0F3] border border-[#FFE4E9] text-[#7D5A61] flex items-center justify-center text-xl shadow-xs">
              📓
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-heading font-bold text-xl text-[#7D5A61]">
                  My Vocabulary Diary
                </h2>
                <span className="bg-[#FFF0F3] text-[#FF8DA1] border border-[#FFE4E9] text-xs px-2.5 py-0.5 rounded-full font-bold">
                  {diaryWords.length} words
                </span>
              </div>
              <p className="text-xs text-[#A89094]">
                Automatic collection of words needing practice + your saved words!
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* View Mode Toggle */}
            <div className="flex bg-[#FFF0F3] rounded-xl border border-[#FFE4E9] p-1 text-xs">
              <button
                onClick={() => {
                  sounds.playPop();
                  setActiveViewMode('list');
                }}
                className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                  activeViewMode === 'list'
                    ? 'bg-[#FFB6C1] text-white shadow-xs'
                    : 'text-[#7D5A61] hover:text-[#FF8DA1]'
                }`}
              >
                List View
              </button>
              <button
                onClick={() => {
                  sounds.playPop();
                  setActiveViewMode('flashcards');
                  setFlashcardIndex(0);
                  setIsFlipped(false);
                }}
                className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                  activeViewMode === 'flashcards'
                    ? 'bg-[#FFB6C1] text-white shadow-xs'
                    : 'text-[#7D5A61] hover:text-[#FF8DA1]'
                }`}
              >
                Flashcards 🎴
              </button>
            </div>

            <button
              onClick={() => {
                sounds.playPop();
                onClose();
              }}
              className="p-2 rounded-xl text-[#7D5A61] hover:text-[#FF8DA1] hover:bg-[#FFF0F3] transition-colors cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="p-4 bg-white border-b border-[#FFE4E9] space-y-3">
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-[#C4B5B8] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search words or meanings in diary..."
                className="w-full pl-10 pr-4 py-2 text-sm bg-[#FFF9FA] rounded-xl border border-[#FFE4E9] focus:outline-none focus:border-[#FFB6C1] text-[#7D5A61] placeholder:text-[#C4B5B8]"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#A89094] hover:text-[#7D5A61]"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Quick Action: Clear Mastered */}
            {masteredCount > 0 && (
              <button
                onClick={() => {
                  sounds.playPop();
                  onClearMastered();
                }}
                className="px-3 py-2 text-xs font-semibold text-[#7D5A61] hover:text-rose-600 bg-white border border-[#FFE4E9] rounded-xl hover:bg-[#FFF0F3] transition-colors flex items-center justify-center gap-1.5 whitespace-nowrap cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Clear Mastered ({masteredCount})
              </button>
            )}
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
            <span className="text-[#A89094] flex items-center gap-1">
              <Filter className="w-3 h-3" /> Filter:
            </span>

            <button
              onClick={() => {
                sounds.playPop();
                setFilter('all');
                setFlashcardIndex(0);
              }}
              className={`px-3 py-1.5 rounded-full transition-all cursor-pointer ${
                filter === 'all'
                  ? 'bg-[#FFB6C1] text-white shadow-xs'
                  : 'bg-[#FFF9FA] text-[#7D5A61] border border-[#FFE4E9] hover:bg-[#FFF0F3]'
              }`}
            >
              All Words ({diaryWords.length})
            </button>

            <button
              onClick={() => {
                sounds.playPop();
                setFilter('needs_practice');
                setFlashcardIndex(0);
              }}
              className={`px-3 py-1.5 rounded-full transition-all flex items-center gap-1 cursor-pointer ${
                filter === 'needs_practice'
                  ? 'bg-[#FF5F7E] text-white shadow-xs'
                  : 'bg-[#FFF9FA] text-[#FF5F7E] border border-[#FFE4E9] hover:bg-[#FFF0F3]'
              }`}
            >
              <Flame className="w-3 h-3" />
              Practice Needed ({wrongCount})
            </button>

            <button
              onClick={() => {
                sounds.playPop();
                setFilter('user_saved');
                setFlashcardIndex(0);
              }}
              className={`px-3 py-1.5 rounded-full transition-all flex items-center gap-1 cursor-pointer ${
                filter === 'user_saved'
                  ? 'bg-[#FF8DA1] text-white shadow-xs'
                  : 'bg-[#FFF9FA] text-[#FF8DA1] border border-[#FFE4E9] hover:bg-[#FFF0F3]'
              }`}
            >
              <BookMarked className="w-3 h-3" />
              Saved by You ({savedCount})
            </button>

            <button
              onClick={() => {
                sounds.playPop();
                setFilter('mastered');
                setFlashcardIndex(0);
              }}
              className={`px-3 py-1.5 rounded-full transition-all flex items-center gap-1 cursor-pointer ${
                filter === 'mastered'
                  ? 'bg-[#16A34A] text-white shadow-xs'
                  : 'bg-[#FFF9FA] text-[#16A34A] border border-[#FFE4E9] hover:bg-[#FFF0F3]'
              }`}
            >
              <CheckCircle2 className="w-3 h-3" />
              Mastered ({masteredCount})
            </button>
          </div>
        </div>

        {/* Modal Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[#FFF9FA]">
          {filteredWords.length === 0 ? (
            <div className="text-center py-12 px-4 max-w-sm mx-auto">
              <div className="w-16 h-16 rounded-3xl bg-[#FFF0F3] border-2 border-[#FFE4E9] flex items-center justify-center text-3xl mx-auto mb-3">
                🌸
              </div>
              <h3 className="font-heading font-bold text-lg text-[#7D5A61] mb-1">
                Your Diary is Clear!
              </h3>
              <p className="text-xs text-[#A89094] leading-relaxed mb-4">
                Play the <strong>Word Detective</strong> game! If you miss a word or tap "Save Word", it will automatically be saved here so you can master it anytime.
              </p>
              <button
                onClick={() => {
                  sounds.playPop();
                  onClose();
                }}
                className="px-4 py-2 rounded-xl bg-[#FFB6C1] hover:bg-[#FF8DA1] text-white font-bold text-xs shadow-xs cursor-pointer"
              >
                Play Word Detective Now
              </button>
            </div>
          ) : activeViewMode === 'flashcards' ? (
            /* Flashcard Practice View */
            <div className="max-w-md mx-auto py-2 space-y-4">
              <div className="flex items-center justify-between text-xs text-[#A89094] px-2 font-semibold">
                <span>
                  Card {flashcardIndex + 1} of {filteredWords.length}
                </span>
                <span className="flex items-center gap-1 text-[#7D5A61]">
                  <RotateCw className="w-3.5 h-3.5" /> Tap card to flip
                </span>
              </div>

              {/* Flip Card */}
              {currentFlashcard && (
                <div
                  onClick={() => {
                    sounds.playPop();
                    setIsFlipped(!isFlipped);
                  }}
                  className={`cursor-pointer rounded-3xl p-6 border-3 transition-all duration-300 min-h-[260px] flex flex-col justify-between shadow-sm relative ${
                    isFlipped
                      ? 'bg-[#FFF9FA] border-[#FFB6C1]'
                      : 'bg-white border-[#FFE4E9] hover:border-[#FFB6C1]'
                  }`}
                >
                  {/* Card Status Pill */}
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-[11px] px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1 ${
                        currentFlashcard.addedReason === 'wrong_answer'
                          ? 'bg-[#FFF0F3] text-[#FF5F7E]'
                          : 'bg-[#FFF0F3] text-[#FF8DA1]'
                      }`}
                    >
                      {currentFlashcard.addedReason === 'wrong_answer'
                        ? 'Needs Practice'
                        : 'Saved Word'}
                    </span>

                    <span className="text-2xl">{currentFlashcard.emoji || '✨'}</span>
                  </div>

                  {!isFlipped ? (
                    /* Front of card: The Word */
                    <div className="text-center py-6">
                      <h2 className="font-heading text-3xl sm:text-4xl font-bold text-[#7D5A61] mb-2 tracking-wide">
                        {currentFlashcard.word}
                      </h2>
                      {currentFlashcard.phonetic && (
                        <p className="text-xs text-[#A89094] font-medium mb-4">
                          {currentFlashcard.phonetic}
                        </p>
                      )}
                      <p className="text-xs text-[#A89094] bg-[#FFF0F3] inline-block px-3 py-1 rounded-full font-medium">
                        Tap anywhere to see meaning 🪄
                      </p>
                    </div>
                  ) : (
                    /* Back of card: The Meaning */
                    <div className="py-2 space-y-3 animate-fadeIn">
                      <div>
                        <span className="text-[10px] uppercase font-bold tracking-wider text-[#FF8DA1] bg-[#FFF0F3] px-2 py-0.5 rounded">
                          Definition
                        </span>
                        <p className="text-sm font-semibold text-[#5D4A4F] mt-1">
                          {currentFlashcard.definition}
                        </p>
                      </div>

                      {currentFlashcard.simpleExplanation && (
                        <div className="bg-[#FFF9FA] p-2.5 rounded-xl border border-[#FFE4E9] text-xs text-[#7D5A61]">
                          <span className="font-bold">Kid Meaning:</span> {currentFlashcard.simpleExplanation}
                        </div>
                      )}

                      {currentFlashcard.example && (
                        <p className="text-xs text-[#A89094] italic">
                          "{currentFlashcard.example}"
                        </p>
                      )}
                    </div>
                  )}

                  {/* Card Bottom Controls */}
                  <div className="flex items-center justify-between pt-2 border-t border-[#FFE4E9]" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => handleSpeak(currentFlashcard.word, currentFlashcard.id)}
                      className="p-2 rounded-xl bg-[#FFF0F3] text-[#7D5A61] hover:bg-[#FFE4E9] transition-colors flex items-center gap-1.5 text-xs font-bold"
                    >
                      <Volume2 className="w-4 h-4 text-[#FF8DA1]" />
                      Listen
                    </button>

                    <button
                      onClick={() => {
                        sounds.playBookmark();
                        onToggleMastery(currentFlashcard.id);
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 transition-all ${
                        currentFlashcard.masteryStatus === 'mastered'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : 'bg-white text-[#7D5A61] border border-[#FFE4E9] hover:text-emerald-700'
                      }`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      {currentFlashcard.masteryStatus === 'mastered' ? 'Mastered ⭐' : 'Mark Mastered'}
                    </button>
                  </div>
                </div>
              )}

              {/* Next/Prev Navigation */}
              <div className="flex items-center justify-between gap-3 pt-2">
                <button
                  onClick={handlePrevFlashcard}
                  className="flex-1 py-2.5 rounded-xl bg-white border border-[#FFE4E9] text-[#7D5A61] font-bold text-xs hover:bg-[#FFF0F3] transition-colors shadow-xs cursor-pointer"
                >
                  ← Previous Card
                </button>
                <button
                  onClick={handleNextFlashcard}
                  className="flex-1 py-2.5 rounded-xl bg-[#FFB6C1] hover:bg-[#FF8DA1] text-white font-bold text-xs transition-colors shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  Next Card <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ) : (
            /* List Mode of Diary Words */
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {filteredWords.map((item) => {
                const isSpeaking = speakingWordId === item.id;
                const isMastered = item.masteryStatus === 'mastered';

                return (
                  <div
                    key={item.id}
                    className={`rounded-2xl p-4 border-2 transition-all shadow-xs flex flex-col justify-between gap-3 ${
                      isMastered
                        ? 'bg-emerald-50/50 border-emerald-200'
                        : item.addedReason === 'wrong_answer'
                        ? 'bg-white border-[#FFE4E9] hover:border-[#FFB6C1]'
                        : 'bg-white border-[#FFE4E9] hover:border-[#FFB6C1]'
                    }`}
                  >
                    <div>
                      {/* Top Header of Card */}
                      <div className="flex items-start justify-between gap-2 mb-1.5">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{item.emoji || '✨'}</span>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-heading font-bold text-lg text-[#7D5A61] capitalize">
                                {item.word}
                              </h3>
                              {item.partOfSpeech && (
                                <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#FFF0F3] text-[#FF8DA1] font-medium">
                                  {item.partOfSpeech}
                                </span>
                              )}
                            </div>
                            {item.phonetic && (
                              <span className="text-[11px] text-[#A89094]">
                                {item.phonetic}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleSpeak(item.word, item.id)}
                            className={`p-1.5 rounded-lg transition-colors ${
                              isSpeaking
                                ? 'bg-[#FF8DA1] text-white'
                                : 'bg-[#FFF0F3] text-[#7D5A61] hover:bg-[#FFE4E9]'
                            }`}
                            title="Pronounce word"
                          >
                            <Volume2 className="w-4 h-4 text-[#FF8DA1]" />
                          </button>

                          <button
                            onClick={() => {
                              sounds.playPop();
                              onRemoveWord(item.id);
                            }}
                            className="p-1.5 rounded-lg text-[#C4B5B8] hover:text-rose-600 hover:bg-rose-50 transition-colors"
                            title="Remove from diary"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Tag badges */}
                      <div className="flex flex-wrap items-center gap-1.5 mb-2.5">
                        {item.addedReason === 'wrong_answer' && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#FFF0F3] text-[#FF5F7E] font-semibold border border-[#FFE4E9]">
                            Needs Practice
                          </span>
                        )}
                        {item.addedReason === 'user_saved' && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#FFF0F3] text-[#FF8DA1] font-semibold border border-[#FFE4E9]">
                            Saved Word
                          </span>
                        )}
                        {isMastered && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold border border-emerald-200 flex items-center gap-0.5">
                            <Sparkles className="w-2.5 h-2.5" /> Mastered
                          </span>
                        )}
                      </div>

                      {/* Definition text */}
                      <p className="text-xs font-semibold text-[#5D4A4F] mb-1.5 leading-snug">
                        {item.definition}
                      </p>

                      {/* Example sentence */}
                      {item.example && (
                        <p className="text-[11px] text-[#A89094] italic bg-[#FFF9FA] p-2 rounded-xl border border-[#FFE4E9]">
                          "{item.example}"
                        </p>
                      )}
                    </div>

                    {/* Bottom Mastery Toggle */}
                    <div className="pt-2 border-t border-[#FFE4E9] flex items-center justify-between">
                      <span className="text-[10px] text-[#C4B5B8]">
                        Added {item.dateAdded || 'today'}
                      </span>

                      <button
                        onClick={() => {
                          sounds.playBookmark();
                          onToggleMastery(item.id);
                        }}
                        className={`text-xs px-3 py-1 rounded-xl font-bold flex items-center gap-1 transition-all cursor-pointer ${
                          isMastered
                            ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                            : 'bg-[#FFF0F3] text-[#7D5A61] hover:bg-[#FFE4E9] border border-[#FFE4E9]'
                        }`}
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        {isMastered ? 'Mastered ⭐' : 'Mark as Mastered'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-[#FFF9FA] px-6 py-3 border-t border-[#FFE4E9] flex items-center justify-between text-xs text-[#A89094]">
          <span className="flex items-center gap-1">
            <HelpCircle className="w-3.5 h-3.5 text-[#FF8DA1]" />
            Wrong words in Word Detective are automatically collected here.
          </span>
          <button
            onClick={() => {
              sounds.playPop();
              onClose();
            }}
            className="px-4 py-1.5 rounded-xl bg-white border border-[#FFE4E9] text-[#7D5A61] font-bold hover:bg-[#FFF0F3] transition-colors cursor-pointer"
          >
            Close Diary
          </button>
        </div>
      </div>
    </div>
  );
};
