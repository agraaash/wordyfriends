import React, { useState } from 'react';
import {
  WritingAnalysisResult,
  FeedbackItem,
  SentenceRecommendation,
  applyFeedbackFix,
  applySentenceSimplification,
} from '../../utils/writingFeedback';
import {
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Scissors,
  Wand2,
  ThumbsUp,
  X,
  Volume2,
  HelpCircle,
  Lightbulb,
  ArrowRight,
  RefreshCw,
  Award,
} from 'lucide-react';
import { speakWordOrSentence } from '../../utils/speech';
import { sounds } from '../../utils/sound';

interface WritingFeedbackPanelProps {
  analysis: WritingAnalysisResult;
  currentText: string;
  onUpdateText: (newText: string) => void;
  onClose?: () => void;
  isInline?: boolean;
}

export const WritingFeedbackPanel: React.FC<WritingFeedbackPanelProps> = ({
  analysis,
  currentText,
  onUpdateText,
  onClose,
  isInline = false,
}) => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'grammar' | 'simplicity' | 'sentences'>('all');
  const [appliedFixes, setAppliedFixes] = useState<{ [id: string]: boolean }>({});
  const [successToast, setSuccessToast] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => {
      setSuccessToast(null);
    }, 2500);
  };

  const handleApplySingleFix = (item: FeedbackItem) => {
    sounds.playPop();
    const updated = applyFeedbackFix(currentText, item);
    onUpdateText(updated);
    setAppliedFixes((prev) => ({ ...prev, [item.id]: true }));
    triggerToast(`Applied fix: "${item.replacement}" ✨`);
  };

  const handleApplySentenceRewrite = (rec: SentenceRecommendation) => {
    sounds.playCorrect();
    const updated = applySentenceSimplification(currentText, rec);
    onUpdateText(updated);
    setAppliedFixes((prev) => ({ ...prev, [`sent-${rec.sentenceIndex}`]: true }));
    triggerToast(`Simplified sentence #${rec.sentenceIndex + 1}! 🎉`);
  };

  const handleApplyAllFixes = () => {
    sounds.playCelebration();
    let updated = currentText;

    // Apply grammar and spelling fixes first
    analysis.feedbackItems.forEach((item) => {
      updated = applyFeedbackFix(updated, item);
    });

    // Apply verbosity fixes for verbose sentences
    analysis.sentenceRecommendations.forEach((rec) => {
      if (rec.isTooVerbose || rec.hasRunOn) {
        updated = applySentenceSimplification(updated, rec);
      }
    });

    onUpdateText(updated);
    triggerToast('All grammar & simplicity suggestions applied! 🚀');
  };

  const grammarAndSpellingItems = analysis.feedbackItems.filter(
    (item) => item.type === 'grammar' || item.type === 'spelling' || item.type === 'punctuation'
  );

  const simplicityItems = analysis.feedbackItems.filter((item) => item.type === 'simplicity');
  const verboseSentences = analysis.sentenceRecommendations.filter(
    (rec) => rec.isTooVerbose || rec.hasRunOn
  );

  const filteredItems =
    activeFilter === 'grammar'
      ? grammarAndSpellingItems
      : activeFilter === 'simplicity'
      ? simplicityItems
      : analysis.feedbackItems;

  const totalIssuesCount = analysis.feedbackItems.length + verboseSentences.length;

  return (
    <div
      className={`bg-[#FFFBF7] border-2 border-[#FED7AA] rounded-3xl p-5 sm:p-6 shadow-xs relative transition-all ${
        isInline ? 'w-full mt-4' : 'w-full'
      }`}
    >
      {/* Toast Notification */}
      {successToast && (
        <div className="absolute top-4 right-4 z-20 bg-emerald-600 text-white text-xs font-bold px-4 py-2 rounded-full shadow-lg flex items-center gap-1.5 animate-bounce">
          <CheckCircle2 className="w-4 h-4" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#FDE68A]/60">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-2xl bg-amber-100 text-amber-800 font-bold text-lg">
              ✨
            </span>
            <div>
              <h3 className="text-xl font-bold text-[#78350F] flex items-center gap-2">
                <span>Writing Coach & Grammar Feedback</span>
              </h3>
              <p className="text-xs text-[#92400E]">
                Check grammar, correct spelling, and simplify verbose sentences!
              </p>
            </div>
          </div>
        </div>

        {/* Score and Auto-Fix */}
        <div className="flex items-center gap-2 flex-wrap">
          {totalIssuesCount > 0 && (
            <button
              onClick={handleApplyAllFixes}
              className="px-4 py-2 rounded-2xl bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-600 hover:to-rose-600 text-white font-bold text-xs shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Wand2 className="w-3.5 h-3.5" />
              <span>Apply All Fixes</span>
            </button>
          )}

          {onClose && (
            <button
              onClick={onClose}
              className="p-1.5 text-stone-400 hover:text-stone-600 hover:bg-stone-100 rounded-xl transition-colors cursor-pointer"
              title="Close feedback"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Score Dashboard Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-4">
        {/* Overall Quality */}
        <div className="bg-white border border-[#FDE68A] rounded-2xl p-3 text-center">
          <span className="text-[10px] uppercase font-bold text-[#B45309] block">
            Overall Polish
          </span>
          <p className="text-lg font-bold text-[#78350F] mt-0.5">
            {analysis.overallScore}%
          </p>
          <div className="text-amber-500 text-xs mt-0.5">
            {'⭐'.repeat(analysis.starCount)}
          </div>
        </div>

        {/* Grammar Score */}
        <div className="bg-white border border-[#FDE68A] rounded-2xl p-3 text-center">
          <span className="text-[10px] uppercase font-bold text-[#B45309] block">
            Grammar Health
          </span>
          <p className="text-lg font-bold text-[#059669] mt-0.5">
            {analysis.grammarScore}%
          </p>
          <span className="text-[10px] text-[#059669] font-medium">
            {grammarAndSpellingItems.length === 0 ? 'Flawless!' : `${grammarAndSpellingItems.length} fixes`}
          </span>
        </div>

        {/* Simplicity & Length */}
        <div className="bg-white border border-[#FDE68A] rounded-2xl p-3 text-center">
          <span className="text-[10px] uppercase font-bold text-[#B45309] block">
            Simplicity & Length
          </span>
          <p className="text-lg font-bold text-[#D97706] mt-0.5">
            {analysis.simplicityScore}%
          </p>
          <span className="text-[10px] text-[#B45309] font-medium">
            {analysis.avgSentenceLength} words/sentence
          </span>
        </div>

        {/* Readability Assessment */}
        <div className="bg-white border border-[#FDE68A] rounded-2xl p-3 text-center">
          <span className="text-[10px] uppercase font-bold text-[#B45309] block">
            Words & Sentences
          </span>
          <p className="text-sm font-bold text-[#78350F] mt-1">
            {analysis.totalWords}w • {analysis.totalSentences}s
          </p>
          <span className="text-[10px] text-amber-700 block truncate">
            {analysis.readabilityLabel}
          </span>
        </div>
      </div>

      {/* Encouraging Coach Speech Bubble */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3.5 mb-4 flex items-start gap-3">
        <span className="text-2xl flex-shrink-0">🦉</span>
        <div className="text-xs text-[#78350F] leading-relaxed">
          <span className="font-bold block text-amber-900 mb-0.5">Coach Owl’s Note:</span>
          {analysis.encouragement}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-4 scrollbar-none">
        <button
          onClick={() => setActiveFilter('all')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
            activeFilter === 'all'
              ? 'bg-[#78350F] text-white shadow-xs'
              : 'bg-white border border-[#FED7AA] text-[#78350F] hover:bg-amber-50'
          }`}
        >
          All Insights ({totalIssuesCount})
        </button>

        <button
          onClick={() => setActiveFilter('grammar')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
            activeFilter === 'grammar'
              ? 'bg-[#059669] text-white shadow-xs'
              : 'bg-white border border-[#FED7AA] text-[#059669] hover:bg-emerald-50'
          }`}
        >
          Grammar & Spelling ({grammarAndSpellingItems.length})
        </button>

        <button
          onClick={() => setActiveFilter('simplicity')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
            activeFilter === 'simplicity'
              ? 'bg-[#D97706] text-white shadow-xs'
              : 'bg-white border border-[#FED7AA] text-[#D97706] hover:bg-amber-50'
          }`}
        >
          Shorter Phrases ({simplicityItems.length})
        </button>

        <button
          onClick={() => setActiveFilter('sentences')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
            activeFilter === 'sentences'
              ? 'bg-[#9333EA] text-white shadow-xs'
              : 'bg-white border border-[#FED7AA] text-[#9333EA] hover:bg-purple-50'
          }`}
        >
          Sentence Rewrites ({analysis.sentenceRecommendations.length})
        </button>
      </div>

      {/* Content Area */}
      <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
        {activeFilter !== 'sentences' && filteredItems.length > 0 && (
          <div className="space-y-2.5">
            {filteredItems.map((item) => {
              const isApplied = !!appliedFixes[item.id];
              return (
                <div
                  key={item.id}
                  className={`bg-white border rounded-2xl p-3.5 transition-all shadow-xs ${
                    isApplied
                      ? 'border-emerald-200 bg-emerald-50/40 opacity-75'
                      : item.type === 'grammar'
                      ? 'border-rose-200 hover:border-rose-300'
                      : item.type === 'spelling'
                      ? 'border-amber-200 hover:border-amber-300'
                      : 'border-orange-200 hover:border-orange-300'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                            item.type === 'grammar'
                              ? 'bg-rose-100 text-rose-700'
                              : item.type === 'spelling'
                              ? 'bg-amber-100 text-amber-700'
                              : 'bg-orange-100 text-orange-700'
                          }`}
                        >
                          {item.type}
                        </span>
                        <h4 className="text-xs font-bold text-[#5D4A4F]">{item.title}</h4>
                      </div>

                      {/* Before / After Diff Pill */}
                      <div className="flex items-center gap-2 text-xs pt-1 flex-wrap">
                        <span className="line-through text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md font-medium">
                          {item.original}
                        </span>
                        <ArrowRight className="w-3.5 h-3.5 text-stone-400" />
                        <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                          {item.replacement}
                        </span>
                      </div>

                      <p className="text-[11px] text-stone-600 italic pt-0.5">
                        {item.explanation}
                      </p>
                    </div>

                    {/* Action Button */}
                    <div className="self-end sm:self-center">
                      <button
                        onClick={() => handleApplySingleFix(item)}
                        disabled={isApplied}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 transition-all cursor-pointer ${
                          isApplied
                            ? 'bg-emerald-100 text-emerald-800 cursor-default'
                            : 'bg-[#FED7AA] hover:bg-[#FDBA74] text-[#78350F] hover:shadow-xs'
                        }`}
                      >
                        {isApplied ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Applied</span>
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>Apply Fix</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Sentence Rewrites / Simplicity Recommendations Section */}
        {(activeFilter === 'sentences' || (activeFilter === 'all' && verboseSentences.length > 0)) && (
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-2">
              <Scissors className="w-4 h-4 text-purple-600" />
              <h4 className="text-xs font-bold text-purple-900 uppercase tracking-wider">
                Sentence Recommendations (Simpler & Shorter)
              </h4>
            </div>

            {analysis.sentenceRecommendations.map((rec) => {
              const isApplied = !!appliedFixes[`sent-${rec.sentenceIndex}`];
              const needsImprovement = rec.isTooVerbose || rec.hasRunOn || rec.originalSentence !== rec.improvedSentence;

              return (
                <div
                  key={`rec-${rec.sentenceIndex}`}
                  className={`bg-white border rounded-2xl p-4 transition-all shadow-xs ${
                    isApplied
                      ? 'border-emerald-200 bg-emerald-50/40 opacity-75'
                      : rec.isTooVerbose
                      ? 'border-purple-200 hover:border-purple-300'
                      : 'border-stone-200'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[11px] font-bold text-stone-500">
                      Sentence #{rec.sentenceIndex + 1} ({rec.wordCount} words)
                    </span>
                    {rec.isTooVerbose && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-700">
                        ⚡ Too Verbose ({rec.wordCount}w)
                      </span>
                    )}
                    {rec.hasRunOn && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">
                        🔗 Run-on sentence
                      </span>
                    )}
                  </div>

                  {/* Original Sentence */}
                  <div className="mb-2">
                    <span className="text-[10px] uppercase font-bold text-stone-400 block mb-0.5">
                      Original:
                    </span>
                    <p className="text-xs text-stone-700 bg-stone-50 p-2.5 rounded-xl border border-stone-100 leading-relaxed">
                      "{rec.originalSentence}"
                    </p>
                  </div>

                  {/* Recommendation Reasons */}
                  {rec.reasons.length > 0 && (
                    <div className="mb-2 space-y-1">
                      {rec.reasons.map((r, rIdx) => (
                        <p key={rIdx} className="text-[11px] text-purple-800 flex items-start gap-1">
                          <span>💡</span>
                          <span>{r}</span>
                        </p>
                      ))}
                    </div>
                  )}

                  {/* Recommended Simpler Rewrite */}
                  {needsImprovement && (
                    <div>
                      <span className="text-[10px] uppercase font-bold text-emerald-600 block mb-0.5 flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-emerald-500" />
                        <span>Recommended Simpler & Punchier Version:</span>
                      </span>
                      <p className="text-xs text-emerald-900 bg-emerald-50/70 p-2.5 rounded-xl border border-emerald-200 font-medium leading-relaxed mb-3">
                        "{rec.improvedSentence}"
                      </p>

                      <div className="flex justify-end">
                        <button
                          onClick={() => handleApplySentenceRewrite(rec)}
                          disabled={isApplied}
                          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                            isApplied
                              ? 'bg-emerald-100 text-emerald-800 cursor-default'
                              : 'bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white shadow-xs'
                          }`}
                        >
                          {isApplied ? (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              <span>Sentence Updated</span>
                            </>
                          ) : (
                            <>
                              <Wand2 className="w-3.5 h-3.5" />
                              <span>Replace with Simpler Version</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Clean state / No issues */}
        {totalIssuesCount === 0 && (
          <div className="text-center py-8 px-4 bg-emerald-50/50 border border-emerald-200 rounded-2xl">
            <span className="text-4xl block mb-2">🎉</span>
            <h4 className="text-sm font-bold text-emerald-800 mb-1">
              Super Clean & Spotless Writing!
            </h4>
            <p className="text-xs text-emerald-700 max-w-md mx-auto">
              No grammar errors, misspelled words, or overly verbose sentences detected. Your story is ready to share or email!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
