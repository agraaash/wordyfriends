import React, { useState } from 'react';
import { CategoryInfo, DiaryWord, SentenceChallenge } from '../../types';
import { VOCABULARY_CATEGORIES, DAILY_WORD_OF_DAY } from '../../data/vocabularyData';
import { DetectiveMascot } from './DetectiveMascot';
import {
  Search,
  BookMarked,
  Volume2,
  Sparkles,
  Play,
  Award,
  ChevronRight,
  Flame,
  CheckCircle2
} from 'lucide-react';
import { speakWordOrSentence } from '../../utils/speech';
import { sounds } from '../../utils/sound';

interface VocabularyHomeProps {
  onStartDetective: (category: string) => void;
  diaryWords: DiaryWord[];
  onOpenDiary: () => void;
  allChallenges: SentenceChallenge[];
  solvedCount: number;
}

export const VocabularyHome: React.FC<VocabularyHomeProps> = ({
  onStartDetective,
  diaryWords,
  onOpenDiary,
  allChallenges,
  solvedCount,
}) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isPlayingWordOfDay, setIsPlayingWordOfDay] = useState(false);

  const handleSpeakDailyWord = () => {
    sounds.playPop();
    setIsPlayingWordOfDay(true);
    speakWordOrSentence(
      `${DAILY_WORD_OF_DAY.word}. ${DAILY_WORD_OF_DAY.definition}. Example: ${DAILY_WORD_OF_DAY.example}`,
      false,
      () => {
        setIsPlayingWordOfDay(false);
      }
    );
  };

  const wrongCount = diaryWords.filter((w) => w.addedReason === 'wrong_answer' && w.masteryStatus !== 'mastered').length;
  const savedCount = diaryWords.filter((w) => w.addedReason === 'user_saved').length;
  const masteredCount = diaryWords.filter((w) => w.masteryStatus === 'mastered').length;

  return (
    <div className="space-y-6 animate-fadeIn max-w-5xl mx-auto">
      {/* Welcome Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#FFE4E9] shadow-xs flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFF0F3] border border-[#FFE4E9] text-xs font-bold text-[#FF8DA1]">
            <Sparkles className="w-3.5 h-3.5 text-[#FF8DA1]" />
            <span>Vocabulary Building Playground</span>
          </div>
          <h1 className="font-heading font-bold text-2xl sm:text-3xl text-[#7D5A61] tracking-tight">
            Learn Beautiful Words, Solve Clues & Grow!
          </h1>
          <p className="text-xs sm:text-sm text-[#A89094] max-w-xl leading-relaxed">
            Fill in the blank sentences with gentle kid words, reveal meanings, and save tricky words in your personal Vocabulary Diary.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-[#FFF9FA] p-4 rounded-2xl border border-[#FFE4E9] shadow-xs text-center min-w-[100px]">
            <span className="text-2xl font-bold font-heading text-[#7D5A61] block">
              {solvedCount}
            </span>
            <span className="text-[11px] text-[#A89094] font-medium">Clues Solved</span>
          </div>
          <div className="bg-[#FFF9FA] p-4 rounded-2xl border border-[#FFE4E9] shadow-xs text-center min-w-[100px]">
            <span className="text-2xl font-bold font-heading text-[#FF8DA1] block">
              {diaryWords.length}
            </span>
            <span className="text-[11px] text-[#A89094] font-medium">In Vocab Diary</span>
          </div>
        </div>
      </div>

      {/* FEATURED BLOCK: WORD DETECTIVE WITH CRAYON BOY MASCOT & COLOR POPS */}
      <div className="bg-gradient-to-r from-amber-50/60 via-pink-50/40 to-sky-50/50 rounded-[32px] p-6 sm:p-8 border-4 border-[#FED7AA] shadow-sm relative overflow-hidden">
        {/* Playful Crayon background decorative bubbles */}
        <div className="absolute top-2 right-12 w-24 h-24 rounded-full bg-yellow-200/40 blur-xl pointer-events-none"></div>
        <div className="absolute bottom-2 left-1/3 w-32 h-32 rounded-full bg-pink-200/40 blur-xl pointer-events-none"></div>

        <div className="relative z-10 space-y-6">
          {/* Crayon Detective Mascot Intro */}
          <DetectiveMascot
            size="md"
            message="Grab your magnifying glass! Read the mystery sentence, look at each clue word, and find the word that fits perfectly!"
          />

          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pt-2">
            <div className="space-y-3 flex-1">
              <div className="flex items-center gap-2">
                <span className="font-heading font-bold text-xs uppercase tracking-wider text-[#B45309] bg-[#FEF3C7] px-3 py-1 rounded-full border border-[#FDE68A]">
                  🕵️ Word Detective Adventure
                </span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-pink-100 text-[#9D174D] font-bold">
                  Pops of Colors 🎨
                </span>
              </div>

              <h2 className="font-heading font-bold text-2xl sm:text-3xl text-[#7D5A61]">
                Word Detective Game
              </h2>

              <p className="text-sm text-[#5D4A4F] leading-relaxed max-w-xl">
                Solve fill-in-the-blank mysteries like <em className="text-[#7D5A61] font-semibold">"Rahul was ____ because he left his bag at home"</em>. Click <strong>View Definition</strong> under each word to explore meanings, collect stars, and auto-save missed words!
              </p>

              <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
                <span className="px-3 py-1 rounded-full bg-amber-100/80 border border-amber-200 text-amber-900 font-bold">
                  🖍️ Crayon Detective Glass
                </span>
                <span className="px-3 py-1 rounded-full bg-pink-100/80 border border-pink-200 text-pink-900 font-bold">
                  📖 Auto Diary for Missed Words
                </span>
                <span className="px-3 py-1 rounded-full bg-sky-100/80 border border-sky-200 text-sky-900 font-bold">
                  🔊 Voice Pronunciation
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                sounds.playPop();
                onStartDetective(selectedCategory);
              }}
              className="w-full md:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-[#F59E0B] via-[#EC4899] to-[#3B82F6] hover:opacity-95 text-white font-bold text-base shadow-md flex items-center justify-center gap-2.5 transition-all hover:scale-102 active:scale-98 whitespace-nowrap cursor-pointer"
            >
              <Play className="w-5 h-5 fill-white" />
              <span>Start Mystery Case</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2-Column Section: Daily Word Spark & Vocabulary Diary Widget */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Daily Word Spark */}
        <div className="bg-white rounded-3xl p-6 border-2 border-[#FFE4E9] shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs px-3 py-1 rounded-full bg-[#FFF0F3] text-[#7D5A61] font-bold border border-[#FFE4E9] flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-[#FF8DA1]" />
                Daily Word Spark
              </span>
              <span className="text-2xl">{DAILY_WORD_OF_DAY.emoji}</span>
            </div>

            <div className="flex items-baseline gap-2 mb-1">
              <h3 className="font-heading font-bold text-2xl text-[#7D5A61]">
                {DAILY_WORD_OF_DAY.word}
              </h3>
              <span className="text-xs text-[#A89094]">
                {DAILY_WORD_OF_DAY.phonetic}
              </span>
            </div>

            <p className="text-xs font-bold text-[#FF8DA1] uppercase tracking-wider mb-2">
              {DAILY_WORD_OF_DAY.partOfSpeech}
            </p>

            <p className="text-sm font-semibold text-[#5D4A4F] mb-2 leading-relaxed">
              {DAILY_WORD_OF_DAY.definition}
            </p>

            <div className="bg-[#FFF9FA] p-3 rounded-2xl border border-[#FFE4E9] text-xs text-[#7D5A61] italic">
              "{DAILY_WORD_OF_DAY.example}"
            </div>
          </div>

          <div className="pt-3 border-t border-[#FFE4E9] flex items-center justify-between">
            <span className="text-xs text-[#A89094] font-medium">
              💡 {DAILY_WORD_OF_DAY.kidTip}
            </span>

            <button
              onClick={handleSpeakDailyWord}
              className={`p-2 px-3 rounded-full text-xs font-bold flex items-center gap-1.5 transition-colors ${
                isPlayingWordOfDay
                  ? 'bg-[#FF8DA1] text-white shadow-xs'
                  : 'bg-[#FFF0F3] text-[#7D5A61] hover:bg-[#FFE4E9]'
              }`}
            >
              <Volume2 className="w-4 h-4 text-[#FF8DA1]" />
              <span>Listen</span>
            </button>
          </div>
        </div>

        {/* Vocabulary Diary Quick Widget */}
        <div className="bg-white rounded-3xl p-6 border-2 border-[#FFE4E9] shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs px-3 py-1 rounded-full bg-[#FFF0F3] text-[#FF8DA1] font-bold border border-[#FFE4E9] flex items-center gap-1">
                <BookMarked className="w-3 h-3 text-[#FF8DA1]" />
                Vocabulary Diary
              </span>
              <span className="text-2xl">📓</span>
            </div>

            <h3 className="font-heading font-bold text-xl text-[#7D5A61] mb-1">
              Your Personal Word Treasury
            </h3>
            <p className="text-xs text-[#A89094] leading-relaxed mb-3">
              Keep track of words you got wrong in Word Detective or saved manually to review and master!
            </p>

            {/* Quick Stats Chips */}
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-[#FFF9FA] p-2.5 rounded-xl border border-[#FFE4E9] text-center">
                <span className="text-lg font-bold text-[#FF5F7E] block">
                  {wrongCount}
                </span>
                <span className="text-[10px] text-[#A89094] font-medium flex items-center justify-center gap-0.5">
                  <Flame className="w-2.5 h-2.5 text-[#FF5F7E]" /> Practice
                </span>
              </div>

              <div className="bg-[#FFF9FA] p-2.5 rounded-xl border border-[#FFE4E9] text-center">
                <span className="text-lg font-bold text-[#FF8DA1] block">
                  {savedCount}
                </span>
                <span className="text-[10px] text-[#A89094] font-medium flex items-center justify-center gap-0.5">
                  <BookMarked className="w-2.5 h-2.5 text-[#FF8DA1]" /> Saved
                </span>
              </div>

              <div className="bg-[#FFF9FA] p-2.5 rounded-xl border border-[#FFE4E9] text-center">
                <span className="text-lg font-bold text-[#16A34A] block">
                  {masteredCount}
                </span>
                <span className="text-[10px] text-[#A89094] font-medium flex items-center justify-center gap-0.5">
                  <CheckCircle2 className="w-2.5 h-2.5 text-[#16A34A]" /> Mastered
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              sounds.playPop();
              onOpenDiary();
            }}
            className="w-full py-3 rounded-2xl bg-[#FFF0F3] hover:bg-[#FFE4E9] border border-[#FFE4E9] text-[#7D5A61] font-bold text-xs transition-all flex items-center justify-center gap-1.5"
          >
            <span>Review Diary</span>
            <ChevronRight className="w-4 h-4 text-[#FF8DA1]" />
          </button>
        </div>
      </div>

      {/* Detective Categories Selector */}
      <div className="bg-white rounded-3xl p-6 border-2 border-[#FFE4E9] shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-heading font-bold text-lg text-[#7D5A61]">
              Choose Detective Category
            </h3>
            <p className="text-xs text-[#A89094]">
              Pick a theme to explore tailored sentence mysteries!
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {VOCABULARY_CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  sounds.playPop();
                  setSelectedCategory(cat.id);
                  onStartDetective(cat.id);
                }}
                className={`p-3.5 rounded-2xl border-2 transition-all flex flex-col items-center text-center gap-2 cursor-pointer ${
                  isSelected
                    ? 'bg-[#FFF0F3] border-[#FF8DA1] shadow-xs scale-102'
                    : 'bg-white border-[#FFE4E9] hover:border-[#FFB6C1] hover:bg-[#FFF9FA]'
                }`}
              >
                <span className="text-2xl">{cat.emoji}</span>
                <span className="font-heading font-bold text-xs text-[#7D5A61]">
                  {cat.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
