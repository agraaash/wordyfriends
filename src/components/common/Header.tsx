import React from 'react';
import { TabType, UserStats, StudentProfile } from '../../types';
import { BookOpen, PenTool, Mic, Volume2, VolumeX, Search, Mail, Home, Sparkles, MessageSquareHeart } from 'lucide-react';
import { sounds } from '../../utils/sound';

interface HeaderProps {
  currentTab: TabType;
  onSelectTab: (tab: TabType) => void;
  stats: UserStats;
  diaryCount: number;
  onOpenDiary: () => void;
  onOpenEmailModal: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
  student: StudentProfile | null;
  onSwitchStudent: () => void;
  savedStoriesCount?: number;
  onOpenAdmin?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onSelectTab,
  stats,
  diaryCount,
  onOpenDiary,
  onOpenEmailModal,
  isMuted,
  onToggleMute,
  student,
  onSwitchStudent,
  savedStoriesCount = 0,
  onOpenAdmin,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b-2 border-[#FFE4E9] px-4 sm:px-8 py-3 transition-all shadow-xs">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        {/* App Logo & Title */}
        <div className="flex items-center justify-between w-full md:w-auto">
          <div
            onClick={() => onSelectTab('home')}
            className="flex items-center gap-2.5 cursor-pointer select-none group"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-[#FFD1DC] to-[#FF8DA1] rounded-2xl flex items-center justify-center shadow-xs text-white font-heading font-bold text-xl group-hover:scale-105 transition-transform">
              ✨
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-heading font-extrabold text-[#7D5A61] tracking-tight">
                  The Write Magic
                </h1>
              </div>
            </div>
          </div>

          {/* Mobile Right Controls */}
          <div className="flex items-center gap-2 md:hidden">
            {student && (
              <button
                onClick={onSwitchStudent}
                className="px-2.5 py-1.5 rounded-xl bg-[#FFF0F3] border border-[#FFE4E9] text-[11px] font-bold text-[#7D5A61] flex items-center gap-1"
                title="Switch student author"
              >
                <span>{student.avatarEmoji || '🌸'}</span>
                <span>{student.name.split(' ')[0]}</span>
              </button>
            )}

            <button
              onClick={onToggleMute}
              className="p-2 rounded-xl bg-[#FFF0F3] border border-[#FFE4E9] text-[#7D5A61]"
              title={isMuted ? 'Unmute audio' : 'Mute audio'}
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-[#C4B5B8]" /> : <Volume2 className="w-4 h-4 text-[#FF8DA1]" />}
            </button>
          </div>
        </div>

        {/* Navigation Tabs - Exact requested order:
            home, vocab detective, write, speaking, talk to aashna, my stories */}
        <nav className="flex items-center gap-1.5 sm:gap-2.5 overflow-x-auto max-w-full pb-1 sm:pb-0 scrollbar-none">
          {/* 1. Home */}
          <button
            onClick={() => {
              sounds.playPop();
              onSelectTab('home');
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-2xl text-xs sm:text-sm font-heading font-bold transition-all whitespace-nowrap cursor-pointer ${
              currentTab === 'home'
                ? 'bg-[#FFF0F3] text-[#FF6B8B] border border-[#FFB6C1] shadow-2xs'
                : 'text-[#A89094] hover:text-[#7D5A61] hover:bg-[#FFF9FA]'
            }`}
          >
            <Home className="w-4 h-4" />
            <span>Home</span>
          </button>

          {/* 2. Vocab Detective */}
          <button
            onClick={() => {
              sounds.playPop();
              onSelectTab('vocabulary');
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-2xl text-xs sm:text-sm font-heading font-bold transition-all whitespace-nowrap cursor-pointer ${
              currentTab === 'vocabulary'
                ? 'bg-amber-100 text-amber-900 border border-amber-300 shadow-2xs'
                : 'text-[#A89094] hover:text-[#7D5A61] hover:bg-[#FFF9FA]'
            }`}
          >
            <Search className="w-4 h-4 text-amber-600" />
            <span>Vocab Detective 🔍</span>
          </button>

          {/* 3. Write */}
          <button
            onClick={() => {
              sounds.playPop();
              onSelectTab('writing');
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-2xl text-xs sm:text-sm font-heading font-bold transition-all whitespace-nowrap cursor-pointer ${
              currentTab === 'writing'
                ? 'bg-[#FFF0F3] text-[#FF6B8B] border border-[#FFB6C1] shadow-2xs'
                : 'text-[#A89094] hover:text-[#7D5A61] hover:bg-[#FFF9FA]'
            }`}
          >
            <PenTool className="w-4 h-4" />
            <span>Write ✨</span>
          </button>

          {/* 4. Speaking */}
          <button
            onClick={() => {
              sounds.playPop();
              onSelectTab('speaking');
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-2xl text-xs sm:text-sm font-heading font-bold transition-all whitespace-nowrap cursor-pointer ${
              currentTab === 'speaking'
                ? 'bg-[#FFF0F3] text-[#FF6B8B] border border-[#FFB6C1] shadow-2xs'
                : 'text-[#A89094] hover:text-[#7D5A61] hover:bg-[#FFF9FA]'
            }`}
          >
            <Mic className="w-4 h-4" />
            <span>Speaking 🎙️</span>
          </button>

          {/* 5. Talk to Aashna */}
          <button
            onClick={() => {
              sounds.playPop();
              onSelectTab('talk');
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-2xl text-xs sm:text-sm font-heading font-bold transition-all whitespace-nowrap cursor-pointer ${
              currentTab === 'talk'
                ? 'bg-[#FFF0F3] text-[#FF6B8B] border border-[#FFB6C1] shadow-2xs'
                : 'text-[#A89094] hover:text-[#7D5A61] hover:bg-[#FFF9FA]'
            }`}
          >
            <Mail className="w-4 h-4" />
            <span>Talk to Aashna 💌</span>
          </button>

          {/* 6. My Stories */}
          <button
            onClick={() => {
              sounds.playPop();
              onSelectTab('stories');
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-2xl text-xs sm:text-sm font-heading font-bold transition-all whitespace-nowrap cursor-pointer ${
              currentTab === 'stories'
                ? 'bg-[#FFF0F3] text-[#FF6B8B] border border-[#FFB6C1] shadow-2xs'
                : 'text-[#A89094] hover:text-[#7D5A61] hover:bg-[#FFF9FA]'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>My Stories</span>
            {savedStoriesCount > 0 && (
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-[#FF8DA1] text-white font-bold">
                {savedStoriesCount}
              </span>
            )}
          </button>

          {/* 7. Feedback Tab */}
          <button
            onClick={() => {
              sounds.playPop();
              onSelectTab('feedback');
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-2xl text-xs sm:text-sm font-heading font-bold transition-all whitespace-nowrap cursor-pointer ${
              currentTab === 'feedback'
                ? 'bg-rose-100 text-rose-800 border border-rose-300 shadow-2xs'
                : 'text-[#A89094] hover:text-[#7D5A61] hover:bg-[#FFF9FA]'
            }`}
          >
            <MessageSquareHeart className="w-4 h-4 text-rose-500" />
            <span>Feedback 💬</span>
          </button>
        </nav>

        {/* Header Right Badges & Student Badge (Desktop) */}
        <div className="hidden md:flex items-center gap-2.5">
          {/* Active Student Pill with Switch */}
          {student && (
            <div
              onClick={onSwitchStudent}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFF0F3] border border-[#FFE4E9] hover:border-[#FFB6C1] text-xs font-bold text-[#7D5A61] transition-all cursor-pointer shadow-2xs group"
              title="Click to switch author or profile"
            >
              <span className="text-base">{student.avatarEmoji || '🌸'}</span>
              <span>{student.name.split(' ')[0]}</span>
              <span className="text-[10px] text-[#A89094] font-normal">
                ({student.organization.split(' ')[0]})
              </span>
            </div>
          )}

          {/* Sound Mute Toggle */}
          <button
            onClick={onToggleMute}
            className="p-2 rounded-full bg-white border border-[#FFE4E9] text-[#7D5A61] hover:text-[#FF8DA1] hover:bg-[#FFF0F3] transition-colors cursor-pointer"
            title={isMuted ? 'Unmute sounds' : 'Mute sounds'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-[#C4B5B8]" /> : <Volume2 className="w-4 h-4 text-[#FF8DA1]" />}
          </button>
        </div>
      </div>
    </header>
  );
};
