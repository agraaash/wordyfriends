import React, { useState, useEffect } from 'react';
import { DiaryWord, SavedStory, TabType, UserStats, WordOption, StudentProfile, StoryImage } from './types';
import { Header } from './components/common/Header';
import { StudentHome } from './components/home/StudentHome';
import { MagicalWritingStudio } from './components/writing/MagicalWritingStudio';
import { MyStoriesView } from './components/stories/MyStoriesView';
import { TalkToAashnaView } from './components/talk/TalkToAashnaView';
import { StudentOnboardingModal } from './components/auth/StudentOnboardingModal';
import { AdminLogin } from './components/admin/AdminLogin';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { VocabularyHome } from './components/vocabulary/VocabularyHome';
import { WordDetectiveGame } from './components/vocabulary/WordDetectiveGame';
import { VocabularyDiaryModal } from './components/vocabulary/VocabularyDiaryModal';
import { SpeakingRoom } from './components/speaking/SpeakingRoom';
import { FeedbackView } from './components/feedback/FeedbackView';
import { EmailModal } from './components/common/EmailModal';
import { INITIAL_CHALLENGES } from './data/vocabularyData';
import { STORY_IMAGES_REPOSITORY } from './data/storyImagesData';
import { sounds } from './utils/sound';
import { analytics } from './utils/analyticsTracker';

const STORAGE_DIARY_KEY = 'the_write_magic_diary_v2';
const STORAGE_STORIES_KEY = 'the_write_magic_stories_v2';
const STORAGE_STATS_KEY = 'the_write_magic_stats_v2';
const STORAGE_ADMIN_SESSION_KEY = 'the_write_magic_admin_session_v2';

export default function App() {
  // Check URL route for Admin Portal
  const [isAdminView, setIsAdminView] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return (
      window.location.pathname.includes('/admin') ||
      window.location.hash.includes('admin') ||
      window.location.search.includes('view=admin')
    );
  });

  const [adminUserEmail, setAdminUserEmail] = useState<string | null>(() => {
    try {
      return localStorage.getItem(STORAGE_ADMIN_SESSION_KEY);
    } catch {
      return null;
    }
  });

  // Current Student & Onboarding
  const [currentStudent, setCurrentStudent] = useState<StudentProfile | null>(() => {
    return analytics.getCurrentStudent();
  });
  const [isOnboardingOpen, setIsOnboardingOpen] = useState<boolean>(() => {
    return !analytics.getCurrentStudent();
  });

  // Navigation State
  const [currentTab, setCurrentTab] = useState<TabType>('home');
  const [activeWritingPrompt, setActiveWritingPrompt] = useState<StoryImage | null>(null);
  const [prefilledTalkStory, setPrefilledTalkStory] = useState<SavedStory | null>(null);

  // Vocabulary & Bonus Tools State
  const [isDetectiveActive, setIsDetectiveActive] = useState<boolean>(false);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [isDiaryOpen, setIsDiaryOpen] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  // Email Modal State
  const [isEmailModalOpen, setIsEmailModalOpen] = useState<boolean>(false);
  const [emailModalData, setEmailModalData] = useState<{
    type?: 'story' | 'photo_story' | 'situation' | 'question' | 'general';
    title?: string;
    content?: string;
  }>({
    type: 'general',
    title: '',
    content: '',
  });

  // Diary state
  const [diaryWords, setDiaryWords] = useState<DiaryWord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_DIARY_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // Ignore
    }
    return [
      {
        id: 'init-luminescence',
        word: 'luminescence',
        definition: 'Light produced by chemical, electrical, or physiological means rather than heat.',
        simpleExplanation: 'A cool, magical glow in the dark like fireflies or fairy dust.',
        example: 'The fairy wings gave off a soft blue luminescence in the twilight.',
        partOfSpeech: 'noun',
        phonetic: '[loo-muh-NES-uhns]',
        emoji: '✨',
        addedReason: 'user_saved',
        dateAdded: 'Today',
        masteryStatus: 'learning',
        timesPracticed: 1,
      },
    ];
  });

  // Saved Stories state
  const [savedStories, setSavedStories] = useState<SavedStory[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_STORIES_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // Ignore
    }
    return [
      {
        id: 'seed-story-1',
        title: 'The Little Robot Who Made Pancakes',
        content: 'Beep beep! Sprocket the friendly kitchen robot carefully flipped the sizzling blueberry pancake. Suddenly the spatula slipped, and the pancake landed on Dad’s head like a warm blueberry beret! Everyone burst out laughing while Sprocket whirred happily.',
        promptTitle: 'The Little Robot Who Made Pancakes',
        date: 'Aug 23, 2026',
        wordsUsed: ['spatula', 'blueberry', 'sizzling', 'beret', 'whirred'],
        emoji: '🤖',
        imageUrl: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80',
        type: 'magical_prompt',
        feelings: 'Giggling & Delighted 😂',
      },
    ];
  });

  // User Stats state
  const [stats, setStats] = useState<UserStats>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_STATS_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // Ignore
    }
    return {
      streak: 3,
      stars: 35,
      solvedCount: 5,
      totalCorrect: 5,
      storiesCreated: 1,
      speakingPracticed: 2,
    };
  });

  // Ensure browser tab title is always 'The Write Magic'
  useEffect(() => {
    document.title = 'The Write Magic';
  }, []);

  // Listen to hash / URL changes
  useEffect(() => {
    const handleLocationChange = () => {
      const isDevRoute =
        window.location.pathname.includes('/admin') ||
        window.location.hash.includes('admin') ||
        window.location.search.includes('view=admin');
      setIsAdminView(isDevRoute);
    };

    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, []);

  // Save diary
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_DIARY_KEY, JSON.stringify(diaryWords));
    } catch {
      // Ignore
    }
  }, [diaryWords]);

  // Save stories
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_STORIES_KEY, JSON.stringify(savedStories));
    } catch {
      // Ignore
    }
  }, [savedStories]);

  // Save stats
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_STATS_KEY, JSON.stringify(stats));
    } catch {
      // Ignore
    }
  }, [stats]);

  // Onboarding Complete
  const handleOnboardingComplete = (student: StudentProfile) => {
    setCurrentStudent(student);
    setIsOnboardingOpen(false);
    analytics.trackEvent('write_tab_opened', 'Home');
  };

  // Switch Student
  const handleSwitchStudent = () => {
    sounds.playPop();
    setIsOnboardingOpen(true);
  };

  const handleBackFromOnboarding = () => {
    sounds.playPop();
    setIsOnboardingOpen(false);
  };

  // Select Tab
  const handleSelectTab = (tab: TabType) => {
    setCurrentTab(tab);
    setIsDetectiveActive(false);

    if (tab === 'home') analytics.trackEvent('home_tab_opened', 'Home');
    if (tab === 'writing') analytics.trackEvent('write_tab_opened', 'Write');
    if (tab === 'stories') analytics.trackEvent('my_stories_opened', 'My Stories');
    if (tab === 'talk') analytics.trackEvent('talk_to_aashna_opened', 'Talk to Aashna');
    if (tab === 'vocabulary') analytics.trackEvent('vocabulary_opened', 'Vocabulary');
  };

  // Navigate to write with specific prompt
  const handleSelectPromptAndWrite = (promptId: string) => {
    const found = STORY_IMAGES_REPOSITORY.find((p) => p.id === promptId);
    if (found) {
      setActiveWritingPrompt(found);
    }
    setCurrentTab('writing');
    analytics.trackEvent('image_selected', 'Write', { promptId }, undefined, promptId);
  };

  // Share story to Aashna
  const handleShareStoryToAashna = (story: SavedStory) => {
    setPrefilledTalkStory(story);
    setCurrentTab('talk');
  };

  // Edit story in writing studio
  const handleEditStory = (story: SavedStory) => {
    sounds.playPop();
    const matchingPrompt = STORY_IMAGES_REPOSITORY.find((p) => p.imageUrl === story.imageUrl);
    if (matchingPrompt) {
      setActiveWritingPrompt(matchingPrompt);
    }
    setCurrentTab('writing');
  };

  // Save Story
  const handleSaveStory = (story: SavedStory) => {
    setSavedStories((prev) => [story, ...prev]);
    setStats((prev) => ({
      ...prev,
      stars: prev.stars + 10,
      storiesCreated: prev.storiesCreated + 1,
    }));
  };

  // Delete Story
  const handleDeleteStory = (id: string) => {
    setSavedStories((prev) => prev.filter((s) => s.id !== id));
  };

  // Diary operations
  const handleAddWordToDiary = (wordOption: WordOption, reason: 'wrong_answer' | 'user_saved') => {
    setDiaryWords((prev) => {
      const existingIdx = prev.findIndex((w) => w.word.toLowerCase() === wordOption.word.toLowerCase());
      if (existingIdx >= 0) {
        const updated = [...prev];
        updated[existingIdx] = {
          ...updated[existingIdx],
          timesPracticed: updated[existingIdx].timesPracticed + 1,
          addedReason: reason === 'wrong_answer' ? 'wrong_answer' : updated[existingIdx].addedReason,
        };
        return updated;
      }
      const newDiaryEntry: DiaryWord = {
        id: 'diary-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5),
        word: wordOption.word,
        definition: wordOption.definition,
        simpleExplanation: wordOption.simpleExplanation,
        example: wordOption.example,
        partOfSpeech: wordOption.partOfSpeech,
        phonetic: wordOption.phonetic,
        emoji: wordOption.emoji,
        addedReason: reason,
        dateAdded: 'Today',
        masteryStatus: 'learning',
        timesPracticed: 1,
      };
      return [newDiaryEntry, ...prev];
    });
  };

  const handleToggleMastery = (id: string) => {
    setDiaryWords((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              masteryStatus: item.masteryStatus === 'mastered' ? 'learning' : 'mastered',
            }
          : item
      )
    );
  };

  const handleRemoveWord = (id: string) => {
    setDiaryWords((prev) => prev.filter((item) => item.id !== id));
  };

  const handleClearMastered = () => {
    setDiaryWords((prev) => prev.filter((item) => item.masteryStatus !== 'mastered'));
  };

  const handleAnswerCorrect = () => {
    setStats((prev) => ({
      ...prev,
      stars: prev.stars + 5,
      solvedCount: prev.solvedCount + 1,
      totalCorrect: prev.totalCorrect + 1,
    }));
  };

  const handleAddStar = (count: number = 1) => {
    setStats((prev) => ({
      ...prev,
      stars: prev.stars + count,
      speakingPracticed: (prev.speakingPracticed || 0) + 1,
    }));
  };

  const handleToggleMute = () => {
    const nextState = !isMuted;
    setIsMuted(nextState);
    sounds.setMuted(nextState);
  };

  // Developer Login / Logout Handlers
  const handleAdminLoginSuccess = (email: string) => {
    setAdminUserEmail(email);
    localStorage.setItem(STORAGE_ADMIN_SESSION_KEY, email);
  };

  const handleAdminLogout = () => {
    sounds.playPop();
    setAdminUserEmail(null);
    localStorage.removeItem(STORAGE_ADMIN_SESSION_KEY);
    window.location.hash = '';
    setIsAdminView(false);
  };

  const handleBackToStudentApp = () => {
    sounds.playPop();
    window.location.hash = '';
    setIsAdminView(false);
  };

  // ----------------------------------------------------------------------
  // ROUTE 1: DEVELOPER / ADMIN PORTAL (/admin or #admin)
  // ----------------------------------------------------------------------
  if (isAdminView) {
    if (!adminUserEmail) {
      return (
        <AdminLogin
          onLoginSuccess={handleAdminLoginSuccess}
          onBackToStudentApp={handleBackToStudentApp}
        />
      );
    }

    return (
      <AdminDashboard
        adminEmail={adminUserEmail}
        onLogout={handleAdminLogout}
        onNavigateToStudentApp={handleBackToStudentApp}
      />
    );
  }

  // ----------------------------------------------------------------------
  // ROUTE 2: STUDENT MAGICAL WRITING EXPERIENCE
  // ----------------------------------------------------------------------
  return (
    <div className="min-h-screen flex flex-col bg-[#FFF0F3] text-[#5D4A4F] font-sans selection:bg-[#FFD1DC]">
      {/* Student Onboarding Modal */}
      <StudentOnboardingModal
        isOpen={isOnboardingOpen || !currentStudent}
        currentStudent={currentStudent}
        onComplete={handleOnboardingComplete}
        onBack={currentStudent ? handleBackFromOnboarding : undefined}
      />

      {/* Main Student Header Navigation */}
      <Header
        currentTab={currentTab}
        onSelectTab={handleSelectTab}
        stats={stats}
        diaryCount={diaryWords.length}
        onOpenDiary={() => setIsDiaryOpen(true)}
        onOpenEmailModal={() => {}}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
        student={currentStudent}
        onSwitchStudent={handleSwitchStudent}
        savedStoriesCount={savedStories.length}
        onOpenAdmin={() => {
          sounds.playPop();
          window.location.hash = 'admin';
          setIsAdminView(true);
        }}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-6 md:p-8">
        {/* Tab 1: Home */}
        {currentTab === 'home' && (
          <StudentHome
            student={currentStudent}
            onNavigateTab={handleSelectTab}
            onSelectPromptAndWrite={handleSelectPromptAndWrite}
            savedStoriesCount={savedStories.length}
          />
        )}

        {/* Tab 2: Write Canvas */}
        {currentTab === 'writing' && (
          <MagicalWritingStudio
            onSaveStory={handleSaveStory}
            onShareToAashna={handleShareStoryToAashna}
            initialPrompt={activeWritingPrompt}
          />
        )}

        {/* Tab 3: My Stories Bookshelf */}
        {currentTab === 'stories' && (
          <MyStoriesView
            savedStories={savedStories}
            onSelectStoryToEdit={handleEditStory}
            onShareStoryToAashna={handleShareStoryToAashna}
            onDeleteStory={handleDeleteStory}
            onStartNewStory={() => {
              setActiveWritingPrompt(null);
              setCurrentTab('writing');
            }}
          />
        )}

        {/* Tab 4: Talk to Aashna */}
        {currentTab === 'talk' && (
          <TalkToAashnaView
            savedStories={savedStories}
            prefilledStory={prefilledTalkStory}
          />
        )}

        {/* Tab 5: Speaking Room (Teleprompter Scroll & Voice Recording) */}
        {currentTab === 'speaking' && (
          <SpeakingRoom
            diaryWords={diaryWords}
            savedStories={savedStories}
            onAddStar={handleAddStar}
            onOpenEmailModal={(title, content) => {
              setEmailModalData({
                type: 'general',
                title,
                content,
              });
              setIsEmailModalOpen(true);
            }}
          />
        )}

        {/* Tab 6: Word Detective Bonus Learning Module */}
        {currentTab === 'vocabulary' && (
          <>
            {isDetectiveActive ? (
              <WordDetectiveGame
                challenges={INITIAL_CHALLENGES}
                onBackToHub={() => setIsDetectiveActive(false)}
                diaryWords={diaryWords}
                onAddWordToDiary={handleAddWordToDiary}
                onOpenDiary={() => setIsDiaryOpen(true)}
                onAnswerCorrect={handleAnswerCorrect}
              />
            ) : (
              <VocabularyHome
                onStartDetective={(category) => {
                  setActiveCategory(category);
                  setIsDetectiveActive(true);
                }}
                diaryWords={diaryWords}
                onOpenDiary={() => setIsDiaryOpen(true)}
                allChallenges={INITIAL_CHALLENGES}
                solvedCount={stats.solvedCount}
              />
            )}
          </>
        )}

        {/* Tab 7: App Feedback & Suggestions */}
        {currentTab === 'feedback' && (
          <FeedbackView
            student={currentStudent}
            onOpenAdmin={() => {
              sounds.playPop();
              window.location.hash = 'admin';
              setIsAdminView(true);
            }}
          />
        )}
      </main>

      {/* Vocabulary Diary Modal */}
      <VocabularyDiaryModal
        isOpen={isDiaryOpen}
        onClose={() => setIsDiaryOpen(false)}
        diaryWords={diaryWords}
        onToggleMastery={handleToggleMastery}
        onRemoveWord={handleRemoveWord}
        onClearMastered={handleClearMastered}
      />

      {/* Email Dispatch Modal */}
      <EmailModal
        isOpen={isEmailModalOpen}
        onClose={() => setIsEmailModalOpen(false)}
        defaultType={emailModalData.type}
        defaultTitle={emailModalData.title}
        defaultContent={emailModalData.content}
      />

      {/* Cute Student Footer with Creator Attribution */}
      <footer className="py-7 px-4 text-center text-xs text-[#A89094] border-t-2 border-[#FFE4E9] bg-white/80">
        <div className="max-w-lg mx-auto space-y-3">
          <div className="space-y-1">
            <p className="font-heading font-extrabold text-sm text-[#7D5A61] flex items-center justify-center gap-1.5">
              <span>✨ The Write Magic</span>
            </p>
            <p className="text-xs font-semibold text-[#FF8DA1] tracking-wide">
              Created by Aashna Agrawal under The Write Magic
            </p>
          </div>

          <p className="text-[11px] text-[#A89094] leading-relaxed">
            A magical digital writing playground where young authors look, imagine, write, read aloud, and share.
          </p>

          <div className="pt-1">
            <button
              onClick={() => {
                sounds.playPop();
                window.location.hash = 'admin';
                setIsAdminView(true);
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-[11px] font-bold text-slate-700 hover:text-slate-950 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-all cursor-pointer shadow-2xs"
            >
              <span>🔒 Educator / Admin Portal Login</span>
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
