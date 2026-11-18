import React, { useState, useEffect, useRef } from 'react';
import { StoryImage, SavedStory, InlineCorrection, SentenceSuggestion } from '../../types';
import { STORY_IMAGES_REPOSITORY } from '../../data/storyImagesData';
import { storySparksManager } from '../../utils/storySparksManager';
import { ImageRepositoryModal } from './ImageRepositoryModal';
import { SurpriseMeModal } from './SurpriseMeModal';
import { analyzeWriting, applyFeedbackFix, applySentenceSimplification, WritingAnalysisResult, FeedbackItem, SentenceRecommendation } from '../../utils/writingFeedback';
import {
  Sparkles,
  Volume2,
  VolumeX,
  Bookmark,
  Send,
  Dice5,
  Image as ImageIcon,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Wand2,
  Heart,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  BookOpen,
  ArrowRight,
  Check,
  X,
  Smile,
  Lightbulb,
} from 'lucide-react';
import { sounds } from '../../utils/sound';
import { speakWordOrSentence } from '../../utils/speech';
import confetti from 'canvas-confetti';
import { analytics } from '../../utils/analyticsTracker';

interface MagicalWritingStudioProps {
  onSaveStory: (story: SavedStory) => void;
  onShareToAashna: (story: SavedStory) => void;
  initialPrompt?: StoryImage | null;
}

export const MagicalWritingStudio: React.FC<MagicalWritingStudioProps> = ({
  onSaveStory,
  onShareToAashna,
  initialPrompt,
}) => {
  // Selected Image state
  const [selectedImage, setSelectedImage] = useState<StoryImage>(() => {
    return initialPrompt || storySparksManager.getAllSparks()[0];
  });

  // Writing state
  const [storyTitle, setStoryTitle] = useState('');
  const [storyContent, setStoryContent] = useState('');
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [isSurpriseOpen, setIsSurpriseOpen] = useState(false);
  const [surpriseSpark, setSurpriseSpark] = useState<StoryImage | null>(null);
  const [imageError, setImageError] = useState(false);
  const [showGuidedHelp, setShowGuidedHelp] = useState(false);

  // Evaluation & Feedback state
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluationResult, setEvaluationResult] = useState<WritingAnalysisResult | null>(null);
  const [activeCorrectionId, setActiveCorrectionId] = useState<string | null>(null);
  const [appliedCorrectionIds, setAppliedCorrectionIds] = useState<{ [id: string]: boolean }>({});
  const [appliedSentenceIds, setAppliedSentenceIds] = useState<{ [id: string]: boolean }>({});
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [saveToast, setSaveToast] = useState<string | null>(null);

  // Track story start once user starts typing
  const hasTrackedStoryStart = useRef(false);

  useEffect(() => {
    if (storyContent.length > 5 && !hasTrackedStoryStart.current) {
      hasTrackedStoryStart.current = true;
      analytics.trackEvent('story_started', 'Write', { imageId: selectedImage.id }, undefined, selectedImage.id);
    }
  }, [storyContent, selectedImage]);

  // If initialPrompt changes from parent, set it without clearing text
  useEffect(() => {
    if (initialPrompt) {
      setSelectedImage(initialPrompt);
      setImageError(false);
    }
  }, [initialPrompt]);

  const handleSelectImage = (img: StoryImage, supportLevel?: 'look' | 'help' | 'starter') => {
    setSelectedImage(img);
    setImageError(false);
    analytics.trackEvent('image_changed', 'Write', { newImageId: img.id, title: img.title }, undefined, img.id);

    if (supportLevel === 'starter' && img.starterSentence && !storyContent.trim()) {
      setStoryContent(img.starterSentence + ' ');
    } else if (supportLevel === 'help') {
      setShowGuidedHelp(true);
    }
  };

  const handleSurpriseMe = () => {
    sounds.playCelebration();
    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.6 },
    });
    const randomImg = storySparksManager.getRandomSpark();
    setSurpriseSpark(randomImg);
    setIsSurpriseOpen(true);
  };

  const handleSurpriseStartWriting = (spark: StoryImage, withStarter: boolean) => {
    setIsSurpriseOpen(false);
    setSelectedImage(spark);
    setImageError(false);
    storySparksManager.recordSelection(spark.id);
    if (withStarter && spark.starterSentence && !storyContent.trim()) {
      setStoryContent(spark.starterSentence + ' ');
    }
  };

  const handleEvaluate = () => {
    if (!storyContent.trim()) return;

    sounds.playPop();
    setIsEvaluating(true);
    analytics.trackEvent('evaluate_clicked', 'Evaluate', {
      words: storyContent.split(/\s+/).filter(Boolean).length,
    });

    // Run writing analysis
    setTimeout(() => {
      const result = analyzeWriting(storyContent);
      setEvaluationResult(result);
      setIsEvaluating(false);
      analytics.recordEvaluationCompleted();
      analytics.trackEvent('evaluation_completed', 'Evaluate', {
        issuesCount: result.feedbackItems.length,
        score: result.overallScore,
      });

      if (result.feedbackItems.length === 0 && result.sentenceRecommendations.filter((s) => s.isTooVerbose).length === 0) {
        sounds.playCelebration();
        confetti({
          particleCount: 60,
          spread: 70,
          origin: { y: 0.6 },
        });
      }
    }, 400);
  };

  const handleApplySingleFix = (item: FeedbackItem) => {
    sounds.playCorrect();
    const updated = applyFeedbackFix(storyContent, item);
    setStoryContent(updated);
    setAppliedCorrectionIds((prev) => ({ ...prev, [item.id]: true }));
    analytics.trackEvent('correction_applied', 'Evaluate', {
      type: item.type,
      original: item.original,
      replacement: item.replacement,
    });

    // Re-evaluate softly after applying
    setTimeout(() => {
      const fresh = analyzeWriting(updated);
      setEvaluationResult(fresh);
    }, 150);
  };

  const handleApplySentenceRewrite = (rec: SentenceRecommendation) => {
    sounds.playCorrect();
    const updated = applySentenceSimplification(storyContent, rec);
    setStoryContent(updated);
    setAppliedSentenceIds((prev) => ({ ...prev, [`sent-${rec.sentenceIndex}`]: true }));
    analytics.trackEvent('sentence_suggestion_applied', 'Evaluate', {
      sentenceIndex: rec.sentenceIndex,
      words: rec.wordCount,
    });

    // Re-evaluate
    setTimeout(() => {
      const fresh = analyzeWriting(updated);
      setEvaluationResult(fresh);
    }, 150);
  };

  const handleInsertStarter = () => {
    sounds.playPop();
    if (!storyContent.includes(selectedImage.starterSentence)) {
      setStoryContent((prev) => (prev ? prev + ' ' + selectedImage.starterSentence : selectedImage.starterSentence));
    }
  };

  const handleInsertWord = (word: string) => {
    sounds.playPop();
    setStoryContent((prev) => (prev ? prev + ' ' + word : word));
  };

  const handleReadAloud = () => {
    if (isSpeaking) {
      window.speechSynthesis?.cancel();
      setIsSpeaking(false);
      return;
    }
    const textToRead = (storyTitle ? storyTitle + '. ' : '') + storyContent;
    if (!textToRead.trim()) return;

    setIsSpeaking(true);
    speakWordOrSentence(textToRead, false, () => {
      setIsSpeaking(false);
    });
  };

  const handleSave = () => {
    if (!storyContent.trim()) return;

    sounds.playCelebration();
    const currentStudent = analytics.getCurrentStudent();
    const newStory: SavedStory = {
      id: 'story-' + Date.now(),
      title: storyTitle.trim() || selectedImage.title,
      content: storyContent,
      promptTitle: selectedImage.title,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      wordsUsed: storyContent.split(/\s+/).filter(Boolean),
      emoji: selectedImage.emoji,
      type: 'magical_prompt',
      imageUrl: selectedImage.imageUrl,
      feelings: 'Proud & Inspired ✨',
      studentId: currentStudent?.id,
      studentName: currentStudent?.name,
      organization: currentStudent?.organization,
    };

    onSaveStory(newStory);
    analytics.recordStorySaved();
    analytics.trackEvent('story_saved', 'My Stories', { title: newStory.title, words: newStory.wordsUsed.length }, newStory.id, selectedImage.id);

    setSaveToast('Story saved to My Stories! 📚✨');
    setTimeout(() => setSaveToast(null), 3000);
  };

  const handleSendToAashna = () => {
    if (!storyContent.trim()) return;
    const currentStudent = analytics.getCurrentStudent();
    const story: SavedStory = {
      id: 'story-' + Date.now(),
      title: storyTitle.trim() || selectedImage.title,
      content: storyContent,
      promptTitle: selectedImage.title,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      wordsUsed: storyContent.split(/\s+/).filter(Boolean),
      emoji: selectedImage.emoji,
      type: 'magical_prompt',
      imageUrl: selectedImage.imageUrl,
      feelings: 'Shared with Aashna 💌',
      studentId: currentStudent?.id,
      studentName: currentStudent?.name,
      organization: currentStudent?.organization,
    };
    onShareToAashna(story);
  };

  const wordCount = storyContent.split(/\s+/).filter(Boolean).length;
  const sentenceCount = storyContent.split(/[.!?]+/).filter((s) => s.trim().length > 0).length;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Toast Notification */}
      {saveToast && (
        <div className="fixed top-6 right-6 z-50 bg-[#FF8DA1] text-white font-bold text-sm px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-5 h-5" />
          <span>{saveToast}</span>
        </div>
      )}

      {/* Main Digital Notebook Card */}
      <div className="bg-white rounded-[36px] border-4 border-[#FFE4E9] shadow-xl overflow-hidden">
        {/* Top Image & Prompt Showcase Header */}
        <div className="p-6 sm:p-8 bg-gradient-to-r from-[#FFF5F7] via-white to-[#FFF0F3] border-b-2 border-[#FFE4E9]">
          <div className="flex flex-col lg:flex-row gap-6 items-start">
            {/* Selected Image Card with graceful fallback */}
            <div className="relative w-full lg:w-72 h-56 rounded-3xl overflow-hidden border-3 border-[#FFB6C1] shadow-md flex-shrink-0 group bg-stone-100">
              {!imageError ? (
                <img
                  src={selectedImage.imageUrl}
                  alt={selectedImage.title}
                  referrerPolicy="no-referrer"
                  onError={() => setImageError(true)}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-pink-100 via-rose-50 to-purple-100 flex flex-col items-center justify-center p-4 text-center">
                  <span className="text-5xl mb-2">{selectedImage.emoji || '🎨'}</span>
                  <span className="text-xs font-heading font-extrabold text-[#7D5A61] line-clamp-2 px-1">
                    {selectedImage.title}
                  </span>
                  <span className="text-[10px] font-bold text-[#A89094] mt-1">{selectedImage.categoryLabel}</span>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />

              {/* Category & Tag */}
              <span className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-extrabold bg-white/95 text-[#7D5A61] shadow-xs flex items-center gap-1.5 border border-[#FFE4E9]">
                <span>{selectedImage.emoji}</span>
                <span>{selectedImage.categoryLabel || selectedImage.tag}</span>
              </span>

              {/* Change Picture Overlay Button */}
              <button
                onClick={() => setIsImageModalOpen(true)}
                className="absolute bottom-3 right-3 px-3 py-1.5 rounded-xl bg-white/95 hover:bg-white text-xs font-bold text-[#7D5A61] hover:text-[#FF6B8B] shadow-sm flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <ImageIcon className="w-3.5 h-3.5 text-[#FF8DA1]" />
                <span>Change Picture</span>
              </button>
            </div>

            {/* Prompt Description & Actions */}
            <div className="flex-1 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="text-xs font-extrabold uppercase tracking-wider px-3 py-1 rounded-full bg-[#FFE4E9] text-[#7D5A61]">
                  Story Spark ✨
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleSurpriseMe}
                    className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-[#FFF0F3] border border-[#FFE4E9] hover:border-[#FFB6C1] text-xs font-bold text-[#7D5A61] flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer active:scale-95"
                    title="Pick another random story spark"
                  >
                    <Dice5 className="w-3.5 h-3.5 text-[#FF8DA1]" />
                    <span>Surprise Me!</span>
                  </button>

                  <button
                    onClick={() => setIsImageModalOpen(true)}
                    className="px-3.5 py-1.5 rounded-xl bg-[#FFF0F3] hover:bg-[#FFE4E9] text-xs font-bold text-[#FF6B8B] flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>✨ Find Your Story Spark</span>
                  </button>
                </div>
              </div>

              <h2 className="text-xl sm:text-2xl font-heading font-extrabold text-[#7D5A61]">
                {selectedImage.title}
              </h2>

              {/* Guiding Question */}
              <div className="p-3.5 rounded-2xl bg-[#FFF9FA] border border-[#FFE4E9] text-xs sm:text-sm text-[#7D5A61] leading-relaxed">
                <span className="font-bold text-[#FF8DA1] block mb-0.5">What story does this picture tell? 🤔</span>
                {selectedImage.prompt}
              </div>

              {/* Guided Questions Collapse / Toggle */}
              {selectedImage.guidedQuestions && selectedImage.guidedQuestions.length > 0 && (
                <div className="space-y-2">
                  <button
                    onClick={() => setShowGuidedHelp(!showGuidedHelp)}
                    className="text-xs font-bold text-[#FF6B8B] flex items-center gap-1.5 hover:underline cursor-pointer"
                  >
                    <HelpCircle className="w-3.5 h-3.5" />
                    <span>{showGuidedHelp ? 'Hide Thinking Questions' : '💡 Need help? View curious questions'}</span>
                    {showGuidedHelp ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>

                  {showGuidedHelp && (
                    <div className="p-3 rounded-2xl bg-[#FFF5F7] border border-[#FFD1DC] text-xs text-[#7D5A61] space-y-1 animate-fadeIn">
                      <span className="font-extrabold text-[#7D5A61] block mb-1">Explore these ideas:</span>
                      <ul className="list-disc list-inside space-y-1 pl-1">
                        {selectedImage.guidedQuestions.map((q, idx) => (
                          <li key={idx}>{q}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {/* Suggested Word Sparks */}
              <div className="flex items-center gap-1.5 flex-wrap pt-1">
                <span className="text-[11px] font-bold text-[#A89094] mr-1">Word Sparks:</span>
                {selectedImage.suggestedWords.map((word, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleInsertWord(word)}
                    className="text-[11px] font-bold px-2.5 py-1 rounded-xl bg-white hover:bg-[#FFF0F3] text-[#7D5A61] hover:text-[#FF6B8B] border border-[#FFE4E9] transition-all cursor-pointer active:scale-95 shadow-2xs"
                    title="Click to add word to writing"
                  >
                    + {word}
                  </button>
                ))}

                {selectedImage.starterSentence && (
                  <button
                    onClick={handleInsertStarter}
                    className="text-[11px] font-bold px-2.5 py-1 rounded-xl bg-[#FFF0F3] hover:bg-[#FFE4E9] text-[#FF6B8B] transition-all cursor-pointer ml-auto"
                  >
                    💡 Add Starter Sentence
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Writing Canvas Section */}
        <div className="p-6 sm:p-8 space-y-5 bg-white">
          {/* Story Title Input */}
          <div>
            <label className="block text-xs font-extrabold uppercase tracking-wider text-[#A89094] mb-1.5">
              Story Title 🏷️
            </label>
            <input
              type="text"
              value={storyTitle}
              onChange={(e) => setStoryTitle(e.target.value)}
              placeholder="Give your story an awesome title..."
              className="w-full px-5 py-3.5 text-lg font-heading font-bold rounded-2xl bg-[#FFF9FA] border-2 border-[#FFE4E9] focus:outline-none focus:border-[#FF8DA1] focus:bg-white text-[#7D5A61] placeholder-[#C4B5B8] transition-all"
            />
          </div>

          {/* Large Writing Canvas */}
          <div className="relative">
            <label className="flex items-center justify-between text-xs font-extrabold uppercase tracking-wider text-[#A89094] mb-1.5">
              <span>Your Story ✨</span>
              <span className="text-[11px] text-[#A89094] font-medium lowercase">
                {wordCount} words • {sentenceCount} sentences
              </span>
            </label>

            <textarea
              rows={8}
              value={storyContent}
              onChange={(e) => {
                setStoryContent(e.target.value);
                // Clear evaluation when child types so they can re-evaluate fresh
                if (evaluationResult) setEvaluationResult(null);
              }}
              placeholder="Start writing your magical adventure here... Look at the picture, let your imagination fly, and tell us what happens next!"
              className="w-full p-5 text-base sm:text-lg leading-relaxed rounded-3xl bg-[#FFF9FA] border-2 border-[#FFE4E9] focus:outline-none focus:border-[#FF8DA1] focus:bg-white text-[#7D5A61] placeholder-[#C4B5B8] transition-all resize-y font-sans shadow-inner"
            />
          </div>

          {/* Action Bar (Evaluate, Read Aloud, Save, Share) */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 border-t border-[#FFE4E9]">
            {/* Left Tools */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={handleReadAloud}
                disabled={!storyContent.trim()}
                className={`px-4 py-2.5 rounded-2xl text-xs font-bold border transition-all flex items-center gap-2 cursor-pointer ${
                  isSpeaking
                    ? 'bg-amber-100 border-amber-300 text-amber-800 animate-pulse'
                    : 'bg-white border-[#FFE4E9] hover:bg-[#FFF0F3] text-[#7D5A61]'
                } disabled:opacity-40`}
              >
                {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-[#FF8DA1]" />}
                <span>{isSpeaking ? 'Stop Audio' : 'Listen 🔊'}</span>
              </button>

              <button
                onClick={handleSave}
                disabled={!storyContent.trim()}
                className="px-4 py-2.5 rounded-2xl text-xs font-bold bg-white border border-[#FFE4E9] hover:bg-[#FFF0F3] text-[#7D5A61] transition-all flex items-center gap-2 cursor-pointer disabled:opacity-40"
              >
                <Bookmark className="w-4 h-4 text-[#FF8DA1]" />
                <span>Save My Story 💾</span>
              </button>
            </div>

            {/* Right Primary Action (Evaluate & Share) */}
            <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
              <button
                onClick={handleSendToAashna}
                disabled={!storyContent.trim()}
                className="px-4 py-2.5 rounded-2xl text-xs font-bold bg-[#FFF0F3] hover:bg-[#FFE4E9] text-[#FF6B8B] border border-[#FFB6C1] transition-all flex items-center gap-2 cursor-pointer disabled:opacity-40"
              >
                <Send className="w-4 h-4" />
                <span>Send to Aashna 💌</span>
              </button>

              <button
                onClick={handleEvaluate}
                disabled={!storyContent.trim() || isEvaluating}
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-[#FF8DA1] to-[#FF6B8B] hover:opacity-95 text-white font-heading font-extrabold text-sm shadow-md hover:shadow-lg transition-all transform active:scale-98 flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <Sparkles className="w-4 h-4" />
                <span>{isEvaluating ? 'Checking Words...' : '✨ Evaluate My Writing'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Word-Style Inline Feedback & Friendly Coach Panel (Appears after clicking Evaluate) */}
      {evaluationResult && (
        <div className="bg-[#FFFBF7] rounded-[36px] border-4 border-[#FED7AA] shadow-xl p-6 sm:p-8 space-y-6 animate-fadeIn">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#FDE68A]">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-100 to-amber-200 border-2 border-amber-300 flex items-center justify-center text-2xl shadow-xs">
                🌟
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl font-heading font-extrabold text-[#78350F]">
                  Your Writing — You did a great job!
                </h3>
                <p className="text-xs sm:text-sm text-[#92400E] font-medium">
                  Here are friendly tips to make your magical story shine even brighter ✨
                </p>
              </div>
            </div>

            {/* Overall Rating Stars */}
            <div className="px-4 py-2 rounded-2xl bg-white border border-[#FDE68A] shadow-2xs text-center flex items-center gap-2">
              <span className="text-xs font-bold text-[#78350F]">Story Polish:</span>
              <span className="text-amber-500 font-bold text-sm">
                {'⭐'.repeat(evaluationResult.starCount || 5)}
              </span>
            </div>
          </div>

          {/* Two-Column Encouragement & What to Improve */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* What you did well */}
            <div className="p-5 rounded-3xl bg-emerald-50/70 border-2 border-emerald-200 space-y-2">
              <h4 className="text-sm font-bold text-emerald-900 flex items-center gap-2">
                <Heart className="w-4 h-4 text-emerald-600 fill-emerald-600" />
                <span>What You Did Well! 💛</span>
              </h4>
              <ul className="text-xs text-emerald-800 space-y-1.5 leading-relaxed list-disc list-inside">
                <li>You wrote a creative story with {wordCount} words and {sentenceCount} sentences!</li>
                <li>Great imagination describing the scene and characters.</li>
                <li>{evaluationResult.encouragement}</li>
              </ul>
            </div>

            {/* Let's make it even better */}
            <div className="p-5 rounded-3xl bg-amber-50/70 border-2 border-amber-200 space-y-2">
              <h4 className="text-sm font-bold text-amber-900 flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-amber-600 fill-amber-600" />
                <span>Let's Make It Even Better ✏️</span>
              </h4>
              <p className="text-xs text-amber-800 leading-relaxed">
                {evaluationResult.feedbackItems.length === 0 && evaluationResult.sentenceRecommendations.filter((s) => s.isTooVerbose).length === 0 ? (
                  <span className="font-bold text-emerald-700">
                    🎉 Outstanding! No spelling or grammar fixes needed. Your writing is clear and expressive!
                  </span>
                ) : (
                  <span>
                    We found {evaluationResult.feedbackItems.length} little word suggestion(s) and{' '}
                    {evaluationResult.sentenceRecommendations.filter((s) => s.isTooVerbose).length} sentence tip(s) below. Click <strong>[Apply Fix]</strong> to update them easily!
                  </span>
                )}
              </p>
            </div>
          </div>

          {/* Interactive Word-Style Inline Corrections Cards */}
          {evaluationResult.feedbackItems.length > 0 && (
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#78350F] flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>Word & Spelling Suggestions (Click to Apply)</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {evaluationResult.feedbackItems.map((item) => {
                  const isApplied = !!appliedCorrectionIds[item.id];
                  return (
                    <div
                      key={item.id}
                      className={`p-4 rounded-2xl border transition-all flex flex-col justify-between gap-3 shadow-2xs ${
                        isApplied
                          ? 'bg-emerald-50 border-emerald-200 opacity-80'
                          : 'bg-white border-[#FDE68A] hover:border-amber-400'
                      }`}
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span
                            className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full ${
                              item.type === 'grammar'
                                ? 'bg-rose-100 text-rose-700'
                                : item.type === 'spelling'
                                ? 'bg-amber-100 text-amber-700'
                                : 'bg-purple-100 text-purple-700'
                            }`}
                          >
                            {item.type}
                          </span>
                          <span className="text-[11px] font-bold text-stone-500">{item.title}</span>
                        </div>

                        {/* Diff pill */}
                        <div className="flex items-center gap-2 text-xs pt-1 flex-wrap font-medium">
                          <span className="line-through text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md">
                            {item.original}
                          </span>
                          <ArrowRight className="w-3.5 h-3.5 text-stone-400" />
                          <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                            {item.replacement}
                          </span>
                        </div>

                        {/* Child-friendly explanation */}
                        <p className="text-xs text-stone-600 leading-snug pt-0.5">
                          {item.explanation}
                        </p>
                      </div>

                      {/* Action Button */}
                      <button
                        onClick={() => handleApplySingleFix(item)}
                        disabled={isApplied}
                        className={`w-full py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                          isApplied
                            ? 'bg-emerald-100 text-emerald-800 cursor-default'
                            : 'bg-gradient-to-r from-amber-400 to-rose-400 hover:from-amber-500 hover:to-rose-500 text-white shadow-xs active:scale-98'
                        }`}
                      >
                        {isApplied ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Applied ✨</span>
                          </>
                        ) : (
                          <>
                            <Wand2 className="w-3.5 h-3.5" />
                            <span>Apply Fix</span>
                          </>
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Sentence Simplification Recommendations */}
          {evaluationResult.sentenceRecommendations.filter((s) => s.isTooVerbose || s.hasRunOn).length > 0 && (
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#78350F] flex items-center gap-2">
                <span>✂️</span>
                <span>Sentence Tips (Make It Simpler & Punchier)</span>
              </h4>

              <div className="space-y-3">
                {evaluationResult.sentenceRecommendations
                  .filter((s) => s.isTooVerbose || s.hasRunOn)
                  .map((rec) => {
                    const isApplied = !!appliedSentenceIds[`sent-${rec.sentenceIndex}`];
                    return (
                      <div
                        key={`sent-${rec.sentenceIndex}`}
                        className={`p-4 sm:p-5 rounded-3xl border transition-all space-y-3 ${
                          isApplied
                            ? 'bg-emerald-50 border-emerald-200 opacity-80'
                            : 'bg-white border-purple-200 hover:border-purple-300 shadow-2xs'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-purple-900">
                            Sentence #{rec.sentenceIndex + 1} ({rec.wordCount} words)
                          </span>
                          <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-700">
                            ⚡ Tip: Breaking into simpler sentences makes your idea easier to follow!
                          </span>
                        </div>

                        {/* Original */}
                        <div className="text-xs text-stone-600 bg-stone-50 p-2.5 rounded-xl border border-stone-100">
                          <span className="text-[10px] font-bold uppercase text-stone-400 block mb-0.5">Original:</span>
                          "{rec.originalSentence}"
                        </div>

                        {/* Improved rewrite */}
                        <div className="text-xs text-emerald-900 bg-emerald-50/70 p-2.5 rounded-xl border border-emerald-200 font-medium">
                          <span className="text-[10px] font-bold uppercase text-emerald-600 block mb-0.5 flex items-center gap-1">
                            <Sparkles className="w-3 h-3 text-emerald-500" />
                            <span>Simpler Suggestion:</span>
                          </span>
                          "{rec.improvedSentence}"
                        </div>

                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleApplySentenceRewrite(rec)}
                            disabled={isApplied}
                            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                              isApplied
                                ? 'bg-emerald-100 text-emerald-800 cursor-default'
                                : 'bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white shadow-xs active:scale-98'
                            }`}
                          >
                            {isApplied ? (
                              <>
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                <span>Updated!</span>
                              </>
                            ) : (
                              <>
                                <Wand2 className="w-3.5 h-3.5" />
                                <span>Use Suggestion</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Story Sparks Library Modal */}
      <ImageRepositoryModal
        isOpen={isImageModalOpen}
        onClose={() => setIsImageModalOpen(false)}
        onSelectImage={handleSelectImage}
        selectedImageId={selectedImage.id}
      />

      {/* Surprise Me Modal */}
      <SurpriseMeModal
        isOpen={isSurpriseOpen}
        spark={surpriseSpark}
        onClose={() => setIsSurpriseOpen(false)}
        onStartWriting={handleSurpriseStartWriting}
        onRollAgain={() => {
          const newRandom = storySparksManager.getRandomSpark();
          setSurpriseSpark(newRandom);
        }}
      />
    </div>
  );
};
