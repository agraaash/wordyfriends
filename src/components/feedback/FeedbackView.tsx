import React, { useState } from 'react';
import { FeedbackSubmission } from '../../types';
import { analytics } from '../../utils/analyticsTracker';
import {
  MessageSquare,
  Sparkles,
  Send,
  Star,
  CheckCircle2,
  AlertCircle,
  Lightbulb,
  AlertTriangle,
  Bug,
  Heart,
  Mail,
  User,
  Building2,
  ExternalLink,
  Copy,
  Check,
  HelpCircle,
  ThumbsUp,
} from 'lucide-react';
import { sounds } from '../../utils/sound';
import confetti from 'canvas-confetti';

interface FeedbackViewProps {
  onBackToHome?: () => void;
}

export const FeedbackView: React.FC<FeedbackViewProps> = () => {
  const student = analytics.getCurrentStudent();
  const TARGET_EMAIL = 'aashnaagrawal1200@gmail.com';

  const [category, setCategory] = useState<FeedbackSubmission['category']>('suggestion');
  const [userRole, setUserRole] = useState<FeedbackSubmission['userRole']>('student');
  const [rating, setRating] = useState<number>(5);
  const [featureArea, setFeatureArea] = useState<string>('Speaking Studio');
  const [title, setTitle] = useState<string>('');
  const [feedbackText, setFeedbackText] = useState<string>('');
  const [name, setName] = useState<string>(student?.name || '');
  const [organization, setOrganization] = useState<string>(student?.organization || '');
  const [contactEmail, setContactEmail] = useState<string>('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedFeedback, setSubmittedFeedback] = useState<FeedbackSubmission | null>(null);
  const [copied, setCopied] = useState(false);

  // Community feedback items
  const [communityFeedback, setCommunityFeedback] = useState<FeedbackSubmission[]>(() =>
    analytics.getAllFeedback().slice(0, 6)
  );

  const categories = [
    {
      id: 'suggestion',
      label: 'Suggestion / Idea',
      emoji: '💡',
      icon: Lightbulb,
      description: 'Have a cool feature idea, prompt request, or improvement?',
      color: 'border-amber-200 bg-amber-50/60 text-amber-900',
      activeColor: 'border-amber-400 bg-amber-100/90 text-amber-950 ring-2 ring-amber-300',
    },
    {
      id: 'concern',
      label: 'Concern / Question',
      emoji: '⚠️',
      icon: AlertTriangle,
      description: 'Something feels confusing, too fast, or unclear?',
      color: 'border-orange-200 bg-orange-50/60 text-orange-900',
      activeColor: 'border-orange-400 bg-orange-100/90 text-orange-950 ring-2 ring-orange-300',
    },
    {
      id: 'complaint',
      label: 'Complaint / Bug',
      emoji: '🐞',
      icon: Bug,
      description: 'Found an issue, formatting problem, or broken tool?',
      color: 'border-rose-200 bg-rose-50/60 text-rose-900',
      activeColor: 'border-rose-400 bg-rose-100/90 text-rose-950 ring-2 ring-rose-300',
    },
    {
      id: 'praise',
      label: 'Praise & Love',
      emoji: '💖',
      icon: Heart,
      description: 'Tell us what you and your students enjoyed most!',
      color: 'border-pink-200 bg-pink-50/60 text-pink-900',
      activeColor: 'border-pink-400 bg-pink-100/90 text-pink-950 ring-2 ring-pink-300',
    },
  ];

  const featureAreas = [
    'Speaking Studio & Reading Zone 🎙️',
    'Story Writing Workshop ✍️',
    'Vocabulary Detective 🔍',
    'Talk to Aashna 💌',
    'Audio & Sound Pronunciation 🔊',
    'Visual Theme & Readability 🎨',
    'Educator / Admin Portal 🛡️',
    'General App Feedback 🌐',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackText.trim()) return;

    sounds.playCelebration();
    setIsSubmitting(true);

    const cleanTitle =
      title.trim() ||
      `${category.toUpperCase()}: Feedback on ${featureArea.split(' ')[0]} by ${name.trim() || 'Anonymous'}`;

    setTimeout(() => {
      const newFeedback = analytics.submitFeedback({
        studentId: student?.id || 'guest-user',
        studentName: name.trim() || student?.name || 'Anonymous User',
        organization: organization.trim() || student?.organization || 'Independent Learner',
        userRole,
        category,
        rating,
        title: cleanTitle,
        feedbackText: feedbackText.trim(),
        featureArea,
        contactEmail: contactEmail.trim() || undefined,
      });

      setSubmittedFeedback(newFeedback);
      setCommunityFeedback(analytics.getAllFeedback().slice(0, 6));

      try {
        confetti({
          particleCount: 60,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#FFD1DC', '#FF8DA1', '#60A5FA', '#34D399', '#FBBF24'],
        });
      } catch {
        // Ignore
      }

      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 400);
  };

  const handleResetForm = () => {
    sounds.playPop();
    setIsSubmitted(false);
    setTitle('');
    setFeedbackText('');
    setSubmittedFeedback(null);
  };

  const handleOpenEmail = () => {
    if (!submittedFeedback) return;
    sounds.playPop();
    const subject = `[The Write Magic] App Feedback (${submittedFeedback.category.toUpperCase()}): ${submittedFeedback.title}`;
    const body = `Dear Aashna & The Write Magic Team,

Here is feedback submitted for The Write Magic app:

----------------------------------------
CATEGORY: ${submittedFeedback.category.toUpperCase()}
FEATURE AREA: ${submittedFeedback.featureArea}
RATING: ${'⭐'.repeat(submittedFeedback.rating)} (${submittedFeedback.rating}/5)
SUBMITTER: ${submittedFeedback.studentName} (${submittedFeedback.userRole})
SCHOOL / ORGANIZATION: ${submittedFeedback.organization}
CONTACT EMAIL: ${submittedFeedback.contactEmail || 'Not provided'}
DATE: ${submittedFeedback.submittedAt}
----------------------------------------

FEEDBACK / CONCERNS / SUGGESTIONS:
${submittedFeedback.feedbackText}

----------------------------------------
Sent via The Write Magic Feedback System ✨`;

    const mailto = `mailto:${TARGET_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(
      body
    )}`;
    window.location.href = mailto;
  };

  const handleCopyEmail = () => {
    if (!submittedFeedback) return;
    sounds.playPop();
    const text = `To: ${TARGET_EMAIL}\nSubject: [The Write Magic] App Feedback (${submittedFeedback.category.toUpperCase()}): ${submittedFeedback.title}\n\nCategory: ${submittedFeedback.category}\nFeature: ${submittedFeedback.featureArea}\nFrom: ${submittedFeedback.studentName} (${submittedFeedback.organization})\n\nFeedback:\n${submittedFeedback.feedbackText}`;
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn pb-16">
      {/* 1. Header Banner */}
      <div className="bg-gradient-to-r from-[#FFF0F3] via-white to-[#FFE4E9] rounded-[36px] border-4 border-[#FFE4E9] p-6 sm:p-8 shadow-lg text-center relative overflow-hidden">
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 border border-[#FFB6C1] text-xs font-extrabold text-[#7D5A61] shadow-2xs">
            <MessageSquare className="w-3.5 h-3.5 text-[#FF8DA1]" />
            <span>We Value Your Voice</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-heading font-extrabold text-[#7D5A61] tracking-tight">
            App Feedback & Suggestions 💬
          </h2>
          <p className="text-xs sm:text-sm text-[#A89094] max-w-xl mx-auto font-medium leading-relaxed">
            Have a suggestion, concern, question, or found something that needs improvement? 
            All submissions are recorded instantly in the <strong>Admin Portal</strong> for our team to review!
          </p>
        </div>
      </div>

      {/* 2. Main Content Card */}
      {isSubmitted && submittedFeedback ? (
        <div className="bg-white rounded-[36px] border-4 border-emerald-200 p-8 sm:p-12 text-center space-y-6 shadow-xl animate-fadeIn">
          <div className="w-20 h-20 rounded-full bg-emerald-100 border-2 border-emerald-300 flex items-center justify-center text-4xl mx-auto animate-bounce">
            💌
          </div>

          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Feedback Saved in Admin Portal</span>
            </div>
            <h3 className="text-2xl font-heading font-extrabold text-emerald-950">
              Thank You for Your Feedback! ✨
            </h3>
            <p className="text-sm text-emerald-800 max-w-lg mx-auto leading-relaxed">
              Your thoughts and suggestions help us make <strong>The Write Magic</strong> better for young authors and classrooms everywhere.
            </p>
          </div>

          {/* Submission Details Summary Box */}
          <div className="max-w-lg mx-auto p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200 text-left space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-emerald-950">
              <span className="capitalize">
                {submittedFeedback.category === 'complaint'
                  ? '🐞 Complaint / Bug'
                  : submittedFeedback.category === 'concern'
                  ? '⚠️ Concern'
                  : submittedFeedback.category === 'praise'
                  ? '💖 Praise'
                  : '💡 Suggestion'}
              </span>
              <span className="text-[11px] text-emerald-700 bg-white px-2.5 py-0.5 rounded-full border border-emerald-200">
                {submittedFeedback.featureArea}
              </span>
            </div>

            <p className="text-xs text-emerald-900 font-semibold italic line-clamp-3 bg-white/70 p-3 rounded-xl border border-emerald-100">
              "{submittedFeedback.feedbackText}"
            </p>

            <div className="pt-2 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={handleOpenEmail}
                className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Also Email to Founder Aashna</span>
              </button>

              <button
                type="button"
                onClick={handleCopyEmail}
                className="px-3.5 py-2 rounded-xl bg-white hover:bg-emerald-100/60 border border-emerald-300 text-emerald-800 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Copy Text</span>
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="pt-3">
            <button
              onClick={handleResetForm}
              className="px-6 py-3 rounded-2xl bg-[#FF8DA1] hover:bg-[#FF6B8B] text-white font-heading font-bold text-sm shadow-md transition-all cursor-pointer hover:scale-102"
            >
              Submit Another Feedback ✨
            </button>
          </div>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-[36px] border-4 border-[#FFE4E9] shadow-xl p-6 sm:p-10 space-y-8"
        >
          {/* Step 1: Select Category */}
          <div className="space-y-3">
            <label className="block text-xs font-bold uppercase tracking-wider text-[#7D5A61] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#FF8DA1]" />
              <span>1. What kind of feedback are you sharing?</span>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {categories.map((cat) => {
                const isSelected = category === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => {
                      sounds.playPop();
                      setCategory(cat.id as FeedbackSubmission['category']);
                    }}
                    className={`p-4 rounded-2xl border-2 text-left transition-all cursor-pointer flex items-start gap-3.5 ${
                      isSelected ? cat.activeColor : `${cat.color} hover:border-[#FFB6C1]`
                    }`}
                  >
                    <span className="text-2xl mt-0.5">{cat.emoji}</span>
                    <div className="space-y-0.5">
                      <div className="font-heading font-bold text-sm">{cat.label}</div>
                      <p className="text-[11px] opacity-80 leading-snug">{cat.description}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 2: Feature Area & Role */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#7D5A61] mb-2 flex items-center gap-1.5">
                <HelpCircle className="w-3.5 h-3.5 text-[#FF8DA1]" />
                <span>2. Feature / Topic Area</span>
              </label>
              <select
                value={featureArea}
                onChange={(e) => setFeatureArea(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-[#FFF9FA] border-2 border-[#FFE4E9] text-[#7D5A61] font-bold text-xs sm:text-sm focus:outline-none focus:border-[#FF8DA1] transition-all cursor-pointer"
              >
                {featureAreas.map((area) => (
                  <option key={area} value={area}>
                    {area}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#7D5A61] mb-2 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-[#FF8DA1]" />
                <span>Your Role</span>
              </label>
              <select
                value={userRole}
                onChange={(e) => setUserRole(e.target.value as FeedbackSubmission['userRole'])}
                className="w-full px-4 py-3 rounded-2xl bg-[#FFF9FA] border-2 border-[#FFE4E9] text-[#7D5A61] font-bold text-xs sm:text-sm focus:outline-none focus:border-[#FF8DA1] transition-all cursor-pointer"
              >
                <option value="student">🎒 Student / Young Author</option>
                <option value="teacher">👩‍🏫 Teacher / Educator</option>
                <option value="parent">👨‍👩‍👧 Parent / Guardian</option>
                <option value="guest">🌟 Community Guest</option>
              </select>
            </div>
          </div>

          {/* Step 3: Star Rating */}
          <div className="bg-[#FFF9FA] p-4 sm:p-5 rounded-2xl border-2 border-[#FFE4E9] flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-0.5 text-center sm:text-left">
              <span className="text-xs font-bold text-[#7D5A61] uppercase tracking-wider block">
                Overall Experience Rating
              </span>
              <span className="text-[11px] text-[#A89094]">
                How satisfied are you with this feature of the app?
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => {
                    sounds.playPop();
                    setRating(star);
                  }}
                  className={`p-1 text-2xl sm:text-3xl transition-transform hover:scale-120 cursor-pointer ${
                    rating >= star ? 'text-amber-400' : 'text-slate-200'
                  }`}
                  title={`${star} star${star > 1 ? 's' : ''}`}
                >
                  ★
                </button>
              ))}
              <span className="text-xs font-extrabold text-amber-600 ml-1.5">
                {rating === 5 ? '⭐⭐⭐⭐⭐ Excellent' : rating === 4 ? '⭐⭐⭐⭐ Good' : rating === 3 ? '⭐⭐⭐ Okay' : 'Needs Work'}
              </span>
            </div>
          </div>

          {/* Step 4: Title / Topic */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-[#7D5A61]">
              Subject / Topic (Optional)
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Teleprompter speed suggestions, Story prompt idea, formatting bug..."
              className="w-full px-4 py-3 rounded-2xl bg-[#FFF9FA] border-2 border-[#FFE4E9] text-[#7D5A61] font-medium text-xs sm:text-sm placeholder:text-[#C4B5B8] focus:outline-none focus:border-[#FF8DA1] transition-all"
            />
          </div>

          {/* Step 5: The Feedback Textarea (Requested: Box where people can write complaints, concerns or suggestions) */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-[#7D5A61] flex items-center justify-between">
              <span>
                3. Your Feedback, Complaints, Concerns, or Suggestions <span className="text-rose-500">*</span>
              </span>
              <span className="text-[11px] text-[#A89094] font-normal">
                {feedbackText.length} characters
              </span>
            </label>
            <textarea
              required
              rows={5}
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              placeholder="Please describe your suggestion, complaint, or concern in detail here. What went well? What could be improved or fixed? We read every message carefully!"
              className="w-full p-4 rounded-2xl bg-[#FFF9FA] border-2 border-[#FFE4E9] text-[#4A3B32] font-medium text-xs sm:text-sm placeholder:text-[#C4B5B8] focus:outline-none focus:border-[#FF8DA1] transition-all leading-relaxed"
            />
          </div>

          {/* Step 6: User Info (Optional customization) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div>
              <label className="block text-[11px] font-bold text-[#7D5A61] mb-1">Your Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={student?.name || 'Your name'}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFF9FA] border border-[#FFE4E9] text-xs text-[#7D5A61] focus:outline-none focus:border-[#FF8DA1]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#7D5A61] mb-1">School / Organization</label>
              <input
                type="text"
                value={organization}
                onChange={(e) => setOrganization(e.target.value)}
                placeholder={student?.organization || 'School or NGO'}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFF9FA] border border-[#FFE4E9] text-xs text-[#7D5A61] focus:outline-none focus:border-[#FF8DA1]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#7D5A61] mb-1">Contact Email (Optional)</label>
              <input
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                placeholder="For reply / follow-up"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFF9FA] border border-[#FFE4E9] text-xs text-[#7D5A61] focus:outline-none focus:border-[#FF8DA1]"
              />
            </div>
          </div>

          {/* Submit Action */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting || !feedbackText.trim()}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#FF8DA1] to-[#FF6B8B] hover:opacity-95 text-white font-heading font-extrabold text-sm sm:text-base shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-50 active:scale-98"
            >
              <Send className="w-5 h-5" />
              <span>{isSubmitting ? 'Submitting to Admin Portal...' : 'Submit Feedback to Admin ✨'}</span>
            </button>
          </div>
        </form>
      )}

      {/* 3. Community Feedback & Suggestions Board */}
      <div className="space-y-4 pt-4">
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-2">
            <ThumbsUp className="w-4 h-4 text-[#FF8DA1]" />
            <h3 className="font-heading font-extrabold text-sm sm:text-base text-[#7D5A61]">
              Recent Community Suggestions & Improvements
            </h3>
          </div>
          <span className="text-xs font-bold text-[#A89094]">
            {communityFeedback.length} entries reviewed
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {communityFeedback.map((fb) => {
            const isResolved = fb.status === 'Resolved';
            const isPlanned = fb.status === 'Planned';
            return (
              <div
                key={fb.id}
                className="p-4 rounded-2xl bg-white border border-[#FFE4E9] shadow-2xs space-y-2 transition-all hover:border-[#FFB6C1]"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#7D5A61] flex items-center gap-1.5">
                    <span>
                      {fb.category === 'complaint'
                        ? '🐞'
                        : fb.category === 'concern'
                        ? '⚠️'
                        : fb.category === 'praise'
                        ? '💖'
                        : '💡'}
                    </span>
                    <span className="line-clamp-1">{fb.title || 'App Feedback'}</span>
                  </span>

                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      isResolved
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                        : isPlanned
                        ? 'bg-indigo-100 text-indigo-800 border border-indigo-200'
                        : 'bg-amber-100 text-amber-800 border border-amber-200'
                    }`}
                  >
                    {fb.status}
                  </span>
                </div>

                <p className="text-[11px] text-[#7D5A61] line-clamp-2 leading-relaxed italic">
                  "{fb.feedbackText}"
                </p>

                <div className="flex items-center justify-between text-[10px] text-[#A89094] pt-1 border-t border-slate-50">
                  <span>{fb.studentName} ({fb.organization.split(' ')[0]})</span>
                  <span className="font-semibold">{fb.featureArea.split(' ')[0]}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
