import React, { useState } from 'react';
import { StudentProfile, SavedStory, TabType } from '../../types';
import { storySparksManager } from '../../utils/storySparksManager';
import { Sparkles, BookOpen, Send, Dice5, Search, Heart, ArrowRight, Star, Award, Wand2 } from 'lucide-react';
import { sounds } from '../../utils/sound';

interface StudentHomeProps {
  student: StudentProfile | null;
  onNavigateTab: (tab: TabType) => void;
  onSelectPromptAndWrite: (promptId: string) => void;
  savedStoriesCount: number;
}

export const StudentHome: React.FC<StudentHomeProps> = ({
  student,
  onNavigateTab,
  onSelectPromptAndWrite,
  savedStoriesCount,
}) => {
  const firstName = student?.name ? student.name.split(' ')[0] : 'Young Author';
  const [imgError, setImgError] = useState(false);

  // Grab a featured story spark
  const allSparks = storySparksManager.getAllSparks();
  const featuredPrompt1 = allSparks.find((s) => s.isFeatured) || allSparks[0];

  const handleSurpriseClick = () => {
    sounds.playCelebration();
    const randomImg = storySparksManager.getRandomSpark();
    onSelectPromptAndWrite(randomImg.id);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fadeIn pb-8">
      {/* Friendly Welcome Greeting Banner */}
      <div className="relative bg-gradient-to-r from-[#FFF0F3] via-white to-[#FFE4E9] rounded-[40px] border-4 border-[#FFE4E9] p-8 sm:p-10 shadow-xl overflow-hidden">
        {/* Floating Pastel Decors */}
        <div className="absolute top-4 right-8 text-3xl animate-bounce">✨</div>
        <div className="absolute bottom-6 right-16 text-3xl">🌸</div>
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-[#FFD1DC]/40 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 border border-[#FFB6C1] shadow-2xs text-xs font-bold text-[#7D5A61]">
            <span>{student?.avatarEmoji || '🌸'}</span>
            <span>Welcome to The Write Magic</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-heading font-extrabold text-[#7D5A61] tracking-tight leading-tight">
            Hi, {firstName}! 👋 <br />
            <span className="text-[#FF8DA1]">Ready to make some magic with words? ✨</span>
          </h1>

          <p className="text-sm sm:text-base text-[#A89094] font-medium leading-relaxed">
            Find an exciting story spark, bring your imagination to life, get friendly coach feedback, or share with Aashna!
          </p>
        </div>
      </div>

      {/* 4 Main Action Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* 1. Write a Story */}
        <div
          onClick={() => {
            sounds.playPop();
            onNavigateTab('writing');
          }}
          className="group relative bg-white rounded-[32px] border-3 border-[#FFE4E9] hover:border-[#FF8DA1] p-6 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1.5 cursor-pointer flex flex-col justify-between"
        >
          <div className="space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#FFE4E9] to-[#FFF0F3] border-2 border-[#FFB6C1] flex items-center justify-center text-2xl shadow-xs group-hover:scale-110 transition-transform">
              ✏️
            </div>
            <div>
              <h3 className="text-xl font-heading font-extrabold text-[#7D5A61] group-hover:text-[#FF6B8B] transition-colors">
                Write a Story
              </h3>
              <p className="text-xs text-[#A89094] mt-1 leading-relaxed font-medium">
                Photo sparks, story ideas, and instant coach help.
              </p>
            </div>
          </div>

          <div className="pt-4 flex items-center text-xs font-extrabold text-[#FF8DA1] group-hover:text-[#FF6B8B] gap-1">
            <span>Start Writing</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* 2. Speaking Playground */}
        <div
          onClick={() => {
            sounds.playPop();
            onNavigateTab('speaking');
          }}
          className="group relative bg-white rounded-[32px] border-3 border-[#FFE4E9] hover:border-[#FF8DA1] p-6 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1.5 cursor-pointer flex flex-col justify-between"
        >
          <div className="space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-pink-100 to-rose-100 border-2 border-[#FFB6C1] flex items-center justify-center text-2xl shadow-xs group-hover:scale-110 transition-transform">
              🎙️
            </div>
            <div>
              <h3 className="text-xl font-heading font-extrabold text-[#7D5A61] group-hover:text-[#FF6B8B] transition-colors">
                Speaking
              </h3>
              <p className="text-xs text-[#A89094] mt-1 leading-relaxed font-medium">
                Moving scroll teleprompter, poems, and voice AI feedback.
              </p>
            </div>
          </div>

          <div className="pt-4 flex items-center text-xs font-extrabold text-[#FF8DA1] group-hover:text-[#FF6B8B] gap-1">
            <span>Read & Record</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* 3. My Stories */}
        <div
          onClick={() => {
            sounds.playPop();
            onNavigateTab('stories');
          }}
          className="group relative bg-white rounded-[32px] border-3 border-[#FFE4E9] hover:border-[#FF8DA1] p-6 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1.5 cursor-pointer flex flex-col justify-between"
        >
          <div className="space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#FFE4E9] to-[#FFF0F3] border-2 border-[#FFB6C1] flex items-center justify-center text-2xl shadow-xs group-hover:scale-110 transition-transform">
              📚
            </div>
            <div>
              <h3 className="text-xl font-heading font-extrabold text-[#7D5A61] group-hover:text-[#FF6B8B] transition-colors">
                My Stories
              </h3>
              <p className="text-xs text-[#A89094] mt-1 leading-relaxed font-medium">
                Read, listen aloud, and revisit your creations ({savedStoriesCount}).
              </p>
            </div>
          </div>

          <div className="pt-4 flex items-center text-xs font-extrabold text-[#FF8DA1] group-hover:text-[#FF6B8B] gap-1">
            <span>Open Bookshelf</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* 4. Talk to Aashna */}
        <div
          onClick={() => {
            sounds.playPop();
            onNavigateTab('talk');
          }}
          className="group relative bg-white rounded-[32px] border-3 border-[#FFE4E9] hover:border-[#FF8DA1] p-6 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1.5 cursor-pointer flex flex-col justify-between"
        >
          <div className="space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#FFE4E9] to-[#FFF0F3] border-2 border-[#FFB6C1] flex items-center justify-center text-2xl shadow-xs group-hover:scale-110 transition-transform">
              💌
            </div>
            <div>
              <h3 className="text-xl font-heading font-extrabold text-[#7D5A61] group-hover:text-[#FF6B8B] transition-colors">
                Talk to Aashna
              </h3>
              <p className="text-xs text-[#A89094] mt-1 leading-relaxed font-medium">
                Share stories, chat about ideas, or request 1-on-1 sessions.
              </p>
            </div>
          </div>

          <div className="pt-4 flex items-center text-xs font-extrabold text-[#FF8DA1] group-hover:text-[#FF6B8B] gap-1">
            <span>Send a Note</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>

      {/* Interactive Quick Sparks Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Surprise Prompt Teaser */}
        <div className="bg-[#FFF9FA] rounded-[36px] border-3 border-[#FFE4E9] p-6 sm:p-7 flex flex-col sm:flex-row items-center gap-5 shadow-xs">
          <div className="relative w-28 h-28 rounded-2xl overflow-hidden border-2 border-[#FFB6C1] flex-shrink-0 shadow-xs bg-stone-100">
            {!imgError ? (
              <img
                src={featuredPrompt1.imageUrl}
                alt="Prompt"
                referrerPolicy="no-referrer"
                onError={() => setImgError(true)}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-pink-100 to-rose-200 flex items-center justify-center text-3xl">
                {featuredPrompt1.emoji || '✨'}
              </div>
            )}
            <span className="absolute bottom-1 right-1 text-sm bg-white/90 px-1.5 py-0.5 rounded-md shadow-xs">
              🎲
            </span>
          </div>

          <div className="space-y-2 flex-1 text-center sm:text-left">
            <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-[#FFE4E9] text-[#7D5A61]">
              Featured Story Spark ✨
            </span>
            <h4 className="text-base font-bold text-[#7D5A61]">
              {featuredPrompt1.title}
            </h4>
            <p className="text-xs text-[#A89094] line-clamp-2">
              {featuredPrompt1.prompt}
            </p>
            <button
              onClick={handleSurpriseClick}
              className="px-4 py-2 rounded-xl bg-[#FF8DA1] hover:bg-[#FF6B8B] text-white text-xs font-bold shadow-xs flex items-center gap-1.5 mx-auto sm:mx-0 cursor-pointer transition-all active:scale-95"
            >
              <Dice5 className="w-3.5 h-3.5" />
              <span>🎲 Surprise Me & Write!</span>
            </button>
          </div>
        </div>

        {/* Word Detective Learning Mini Banner */}
        <div className="bg-[#FFF9FA] rounded-[36px] border-3 border-[#FFE4E9] p-6 sm:p-7 flex flex-col sm:flex-row items-center gap-5 shadow-xs">
          <div className="w-20 h-20 rounded-3xl bg-amber-100 border-2 border-amber-200 flex items-center justify-center text-3xl flex-shrink-0 shadow-xs">
            🔍
          </div>

          <div className="space-y-2 flex-1 text-center sm:text-left">
            <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800">
              Vocabulary Game
            </span>
            <h4 className="text-base font-bold text-[#78350F]">
              Play Word Detective 🕵️‍♂️
            </h4>
            <p className="text-xs text-stone-500 line-clamp-2">
              Discover powerful descriptive words, solve sentence clues, and expand your writing vocabulary!
            </p>
            <button
              onClick={() => {
                sounds.playPop();
                onNavigateTab('vocabulary');
              }}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold shadow-xs flex items-center gap-1.5 mx-auto sm:mx-0 cursor-pointer"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Play Word Detective</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
