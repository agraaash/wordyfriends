import React, { useState, useMemo } from 'react';
import { DiaryWord, SavedStory, WritingPrompt } from '../../types';
import { WRITING_PROMPTS } from '../../data/writingData';
import { PictureYourWords } from './PictureYourWords';
import { WritingFeedbackPanel } from './WritingFeedbackPanel';
import { SentenceBankModal } from './SentenceBankModal';
import { analyzeWriting } from '../../utils/writingFeedback';
import {
  PenTool,
  Volume2,
  Sparkles,
  CheckCircle2,
  BookMarked,
  Save,
  Trash2,
  BookOpen,
  RotateCcw,
  Plus,
  Camera,
  Mail,
  Wand2,
  Scissors,
  HelpCircle,
  Lightbulb,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { speakWordOrSentence, stopSpeaking } from '../../utils/speech';
import { sounds } from '../../utils/sound';

interface WritingStudioProps {
  diaryWords: DiaryWord[];
  onSaveStory: (story: SavedStory) => void;
  savedStories: SavedStory[];
  onDeleteStory: (id: string) => void;
  onOpenEmailModal?: (title: string, content: string) => void;
}

export const WritingStudio: React.FC<WritingStudioProps> = ({
  diaryWords,
  onSaveStory,
  savedStories,
  onDeleteStory,
  onOpenEmailModal,
}) => {
  const [selectedPromptIndex, setSelectedPromptIndex] = useState(0);
  const [storyTitle, setStoryTitle] = useState('My Story');
  const [storyContent, setStoryContent] = useState('');
  const [isReadingStory, setIsReadingStory] = useState(false);
  const [activeTab, setActiveTab] = useState<'picture' | 'writer' | 'gallery'>('picture');
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [isSentenceBankOpen, setIsSentenceBankOpen] = useState(false);

  const currentPrompt = WRITING_PROMPTS[selectedPromptIndex] || WRITING_PROMPTS[0];

  // Dynamic Writing Feedback & Grammar Analysis
  const analysis = useMemo(() => {
    return analyzeWriting(storyContent);
  }, [storyContent]);

  const handleSelectPrompt = (index: number) => {
    sounds.playPop();
    setSelectedPromptIndex(index);
    setStoryTitle(WRITING_PROMPTS[index].title);
    setStoryContent(WRITING_PROMPTS[index].starterSentence + ' ');
  };

  const handleInsertWord = (word: string) => {
    sounds.playPop();
    setStoryContent((prev) => prev.trim() + ' ' + word + ' ');
  };

  const handleInsertSentenceFromBank = (sentence: string) => {
    sounds.playCorrect();
    setStoryContent((prev) => {
      const trimmed = prev.trim();
      return trimmed ? `${trimmed} ${sentence} ` : `${sentence} `;
    });
  };

  const handleReadAloud = () => {
    sounds.playPop();
    if (!storyContent.trim()) return;

    setIsReadingStory(true);
    speakWordOrSentence(storyContent, false, () => {
      setIsReadingStory(false);
    });
  };

  const handleSave = () => {
    if (!storyContent.trim()) return;

    sounds.playCorrect();
    const newStory: SavedStory = {
      id: 'story-' + Date.now(),
      title: storyTitle || 'My Fun Story',
      content: storyContent,
      promptTitle: currentPrompt.title,
      date: new Date().toLocaleDateString(),
      wordsUsed: currentPrompt.suggestedWords.filter((w) =>
        storyContent.toLowerCase().includes(w.toLowerCase())
      ),
      emoji: currentPrompt.emoji,
    };

    onSaveStory(newStory);

    try {
      confetti({
        particleCount: 40,
        spread: 50,
        origin: { y: 0.6 },
        colors: ['#F472B6', '#FBCFE8', '#60A5FA', '#34D399'],
      });
    } catch {
      // Ignore
    }
  };

  const handleEmailStory = () => {
    sounds.playPop();
    if (onOpenEmailModal) {
      onOpenEmailModal(
        storyTitle || 'My Story',
        `Story Title: ${storyTitle}\n\n${storyContent}`
      );
    }
  };

  const wordCount = storyContent.trim() ? storyContent.trim().split(/\s+/).length : 0;
  const issuesCount = analysis.feedbackItems.length + analysis.sentenceRecommendations.filter((s) => s.isTooVerbose || s.hasRunOn).length;

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fadeIn">
      {/* Top Header & Mode Switch */}
      <div className="sleek-card p-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#FFF0F3] border border-[#FFE4E9] text-[#7D5A61] flex items-center justify-center text-xl shadow-xs">
            ✍️
          </div>
          <div>
            <h1 className="font-heading font-bold text-2xl text-[#7D5A61]">
              Writing Playground
            </h1>
            <p className="text-xs text-[#A89094]">
              Snap photos, reflect on memories, craft imaginative stories & polish with real grammar feedback!
            </p>
          </div>
        </div>

        {/* Tab switch with Picture your words */}
        <div className="flex bg-[#FFF0F3] rounded-2xl border border-[#FFE4E9] p-1 text-xs font-bold flex-wrap justify-center">
          <button
            onClick={() => {
              sounds.playPop();
              setActiveTab('picture');
            }}
            className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'picture'
                ? 'bg-white text-[#5C4E44] shadow-xs border border-[#EFEAE1]'
                : 'text-[#A89094] hover:text-[#7D5A61]'
            }`}
          >
            <Camera className="w-3.5 h-3.5 text-[#C2A68C]" />
            <span>Picture Your Words</span>
          </button>

          <button
            onClick={() => {
              sounds.playPop();
              setActiveTab('writer');
            }}
            className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'writer'
                ? 'bg-white text-[#7D5A61] shadow-xs border border-[#FFE4E9]'
                : 'text-[#A89094] hover:text-[#7D5A61]'
            }`}
          >
            <PenTool className="w-3.5 h-3.5 text-[#FF8DA1]" />
            <span>Story Prompts</span>
          </button>

          <button
            onClick={() => {
              sounds.playPop();
              setActiveTab('gallery');
            }}
            className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'gallery'
                ? 'bg-white text-[#7D5A61] shadow-xs border border-[#FFE4E9]'
                : 'text-[#A89094] hover:text-[#7D5A61]'
            }`}
          >
            <span>My Stories</span>
            {savedStories.length > 0 && (
              <span className="bg-[#FFB6C1] text-white text-[10px] px-1.5 py-0.2 rounded-full">
                {savedStories.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Picture Your Words View */}
      {activeTab === 'picture' && (
        <PictureYourWords onOpenEmailModal={onOpenEmailModal} />
      )}

      {/* Story Prompts & Writer View */}
      {activeTab === 'writer' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Prompts, Word Bank & 200 Sentences Starter */}
          <div className="space-y-4">
            {/* 200 Sentences Starter Button */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200 rounded-3xl p-5 shadow-xs space-y-2.5">
              <div className="flex items-center gap-2">
                <span className="text-2xl">📖</span>
                <div>
                  <h4 className="font-bold text-xs text-amber-900 uppercase tracking-wider">
                    Sentence Starter Bank
                  </h4>
                  <p className="text-[11px] text-amber-800">
                    200 ready-to-use sentences from our library!
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  sounds.playPop();
                  setIsSentenceBankOpen(true);
                }}
                className="w-full py-2.5 px-4 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>Browse 200 Sentences</span>
              </button>
            </div>

            {/* Story Prompts Selector */}
            <div className="sleek-card p-5 space-y-3">
              <h3 className="font-heading font-bold text-sm text-[#7D5A61] flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-[#FF8DA1]" />
                Choose a Story Starter:
              </h3>

              <div className="space-y-2">
                {WRITING_PROMPTS.map((prompt, idx) => {
                  const isSelected = selectedPromptIndex === idx;
                  return (
                    <button
                      key={prompt.id}
                      onClick={() => handleSelectPrompt(idx)}
                      className={`w-full p-3 rounded-2xl border text-left transition-all flex items-center gap-3 cursor-pointer ${
                        isSelected
                          ? 'bg-[#FFF0F3] border-[#FFB6C1] shadow-xs'
                          : 'bg-white border-[#FFE4E9] hover:border-[#FFD1DC]'
                      }`}
                    >
                      <span className="text-2xl">{prompt.emoji}</span>
                      <div className="flex-1 min-w-0">
                        <div className="font-heading font-bold text-xs text-[#7D5A61] truncate">
                          {prompt.title}
                        </div>
                        <div className="text-[11px] text-[#A89094] line-clamp-1">
                          {prompt.theme}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Word Bank from Diary */}
            <div className="sleek-card p-5 space-y-3">
              <h3 className="font-heading font-bold text-sm text-[#7D5A61] flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <BookMarked className="w-4 h-4 text-[#FF8DA1]" />
                  Insert Diary Words:
                </span>
                <span className="text-[11px] text-[#A89094]">
                  {diaryWords.length} available
                </span>
              </h3>

              {diaryWords.length === 0 ? (
                <p className="text-xs text-[#A89094] italic bg-[#FFF9FA] p-3 rounded-xl border border-[#FFE4E9]">
                  Words you save in Word Detective will appear here!
                </p>
              ) : (
                <div className="flex flex-wrap gap-1.5 max-h-40 overflow-y-auto pr-1">
                  {diaryWords.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleInsertWord(item.word)}
                      className="px-2.5 py-1 rounded-xl bg-[#FFF0F3] hover:bg-[#FFE4E9] text-[#7D5A61] border border-[#FFE4E9] text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                      title={item.definition}
                    >
                      <span>{item.word}</span>
                      <Plus className="w-3 h-3 text-[#FF8DA1]" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Writing Canvas & Feedback Assistant (2 Cols) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="sleek-card p-6 space-y-4">
              {/* Title input */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#A89094] mb-1">
                  Story Title
                </label>
                <input
                  type="text"
                  value={storyTitle}
                  onChange={(e) => setStoryTitle(e.target.value)}
                  className="w-full px-4 py-2.5 text-base font-heading font-bold rounded-2xl bg-[#FFF9FA] border border-[#FFE4E9] focus:outline-none focus:border-[#FFB6C1] text-[#7D5A61]"
                />
              </div>

              {/* Textarea */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#A89094]">
                    Your Story Text
                  </label>
                  <span className="text-[11px] font-semibold text-[#A89094]">
                    {wordCount} words • {analysis.totalSentences} sentences
                  </span>
                </div>

                <textarea
                  rows={8}
                  value={storyContent}
                  onChange={(e) => setStoryContent(e.target.value)}
                  placeholder="Once upon a time in a faraway forest..."
                  className="w-full p-4 text-sm rounded-2xl bg-[#FFF9FA] border border-[#FFE4E9] focus:outline-none focus:border-[#FFB6C1] text-[#5D4A4F] leading-relaxed resize-none"
                />
              </div>

              {/* Writing Helper & Feedback Quick Bar */}
              <div className="p-3.5 rounded-2xl bg-[#FFF0F3] border border-[#FFE4E9] flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="font-heading font-bold text-[#7D5A61] flex items-center gap-1">
                    <span>Writing Helper:</span>
                  </span>

                  <span
                    className={`flex items-center gap-1 font-medium ${
                      analysis.grammarScore >= 90 ? 'text-emerald-700' : 'text-amber-700'
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Grammar: {analysis.grammarScore}%</span>
                  </span>

                  <span
                    className={`flex items-center gap-1 font-medium ${
                      analysis.simplicityScore >= 80 ? 'text-emerald-700' : 'text-purple-700'
                    }`}
                  >
                    <Scissors className="w-3.5 h-3.5" />
                    <span>Avg Length: {analysis.avgSentenceLength}w</span>
                  </span>
                </div>

                {/* Open Coach Feedback Drawer Button */}
                <button
                  onClick={() => {
                    sounds.playPop();
                    setIsFeedbackOpen(!isFeedbackOpen);
                  }}
                  className={`px-3.5 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                    isFeedbackOpen
                      ? 'bg-[#7D5A61] text-white'
                      : issuesCount > 0
                      ? 'bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300'
                      : 'bg-white hover:bg-[#FFF0F3] text-[#7D5A61] border border-[#FFE4E9]'
                  }`}
                >
                  <Wand2 className="w-3.5 h-3.5 text-[#FF8DA1]" />
                  <span>
                    {isFeedbackOpen
                      ? 'Hide Writing Coach'
                      : issuesCount > 0
                      ? `Writing Coach (${issuesCount} Tips)`
                      : 'Writing Coach'}
                  </span>
                  {isFeedbackOpen ? (
                    <ChevronUp className="w-3.5 h-3.5" />
                  ) : (
                    <ChevronDown className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>

              {/* Expandable Writing Coach Feedback Panel */}
              {isFeedbackOpen && (
                <WritingFeedbackPanel
                  analysis={analysis}
                  currentText={storyContent}
                  onUpdateText={setStoryContent}
                  onClose={() => setIsFeedbackOpen(false)}
                  isInline={true}
                />
              )}

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#FFE4E9]">
                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    onClick={handleReadAloud}
                    disabled={!storyContent.trim()}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      isReadingStory
                        ? 'bg-[#FF8DA1] text-white border-[#FF8DA1]'
                        : 'bg-white text-[#7D5A61] border-[#FFE4E9] hover:bg-[#FFF0F3] disabled:opacity-40'
                    }`}
                  >
                    <Volume2 className="w-4 h-4 text-[#FF8DA1]" />
                    <span>{isReadingStory ? 'Reading...' : 'Listen Story'}</span>
                  </button>

                  <button
                    onClick={handleEmailStory}
                    disabled={!storyContent.trim()}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white hover:bg-[#FFF0F3] text-[#7D5A61] border border-[#FFE4E9] text-xs font-bold transition-colors disabled:opacity-40 cursor-pointer"
                    title="Send story to The Write Magic"
                  >
                    <Mail className="w-3.5 h-3.5 text-[#FF8DA1]" />
                    <span>Email NGO</span>
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      sounds.playPop();
                      setStoryContent('');
                    }}
                    className="p-2 rounded-xl text-[#A89094] hover:text-[#7D5A61] hover:bg-[#FFF0F3] transition-colors cursor-pointer"
                    title="Clear text"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>

                  <button
                    onClick={handleSave}
                    disabled={!storyContent.trim()}
                    className="px-6 py-2.5 rounded-2xl bg-[#FFB6C1] hover:bg-[#FF8DA1] disabled:opacity-40 text-white font-bold text-xs shadow-xs transition-transform hover:scale-102 flex items-center gap-1.5 cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save My Story</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Gallery Tab */}
      {activeTab === 'gallery' && (
        <div className="space-y-4">
          {savedStories.length === 0 ? (
            <div className="sleek-card p-12 text-center space-y-3">
              <div className="w-16 h-16 rounded-full bg-[#FFF0F3] border border-[#FFE4E9] flex items-center justify-center text-3xl mx-auto">
                📖
              </div>
              <h3 className="font-heading font-bold text-lg text-[#7D5A61]">
                No Stories Written Yet!
              </h3>
              <p className="text-xs text-[#A89094] max-w-sm mx-auto leading-relaxed">
                Choose a prompt, pick from our 200 sentences, or snap a photo and write your first creative masterpiece!
              </p>
              <button
                onClick={() => {
                  sounds.playPop();
                  setActiveTab('writer');
                }}
                className="px-6 py-2.5 rounded-2xl bg-[#FFB6C1] hover:bg-[#FF8DA1] text-white font-bold text-xs shadow-xs cursor-pointer"
              >
                Start Writing Now
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {savedStories.map((story) => (
                <div
                  key={story.id}
                  className="sleek-card p-5 flex flex-col justify-between space-y-3"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-2xl">{story.emoji}</span>
                      <span className="text-[10px] text-[#A89094] font-medium bg-[#FFF0F3] px-2.5 py-0.5 rounded-full border border-[#FFE4E9]">
                        {story.date}
                      </span>
                    </div>

                    <h4 className="font-heading font-bold text-base text-[#7D5A61]">
                      {story.title}
                    </h4>

                    <p className="text-xs text-[#5D4A4F] leading-relaxed whitespace-pre-line bg-[#FFF9FA] p-3 rounded-xl border border-[#FFE4E9]">
                      {story.content}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-[#FFE4E9]">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          sounds.playPop();
                          speakWordOrSentence(story.content, false);
                        }}
                        className="p-1.5 rounded-xl bg-white hover:bg-[#FFF0F3] text-[#7D5A61] border border-[#FFE4E9] transition-colors cursor-pointer"
                        title="Listen to story"
                      >
                        <Volume2 className="w-4 h-4 text-[#FF8DA1]" />
                      </button>

                      <button
                        onClick={() => {
                          if (onOpenEmailModal) {
                            onOpenEmailModal(
                              story.title,
                              `Story: ${story.title}\n\n${story.content}`
                            );
                          }
                        }}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white hover:bg-[#FFF0F3] text-[#7D5A61] border border-[#FFE4E9] text-xs font-bold transition-colors cursor-pointer"
                        title="Email to The Write Magic"
                      >
                        <Mail className="w-3 h-3 text-[#FF8DA1]" />
                        <span>Email NGO</span>
                      </button>
                    </div>

                    <button
                      onClick={() => {
                        sounds.playPop();
                        onDeleteStory(story.id);
                      }}
                      className="p-1.5 rounded-xl text-rose-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                      title="Delete story"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Sentence Bank Modal */}
      <SentenceBankModal
        isOpen={isSentenceBankOpen}
        onClose={() => setIsSentenceBankOpen(false)}
        onSelectSentence={handleInsertSentenceFromBank}
      />
    </div>
  );
};
