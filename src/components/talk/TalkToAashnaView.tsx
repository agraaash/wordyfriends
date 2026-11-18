import React, { useState } from 'react';
import { SavedStory } from '../../types';
import { analytics } from '../../utils/analyticsTracker';
import { Sparkles, Send, Calendar, BookOpen, CheckCircle2, Mail, Copy, Check, ExternalLink, Heart } from 'lucide-react';
import { sounds } from '../../utils/sound';
import confetti from 'canvas-confetti';

interface TalkToAashnaViewProps {
  savedStories: SavedStory[];
  prefilledStory?: SavedStory | null;
}

export const TalkToAashnaView: React.FC<TalkToAashnaViewProps> = ({
  savedStories,
  prefilledStory,
}) => {
  const [mode, setMode] = useState<'share_story' | 'request_session'>('share_story');

  // Target Email Address requested by user
  const TARGET_EMAIL = 'aashnaagrawal1200@gmail.com';

  // Share story state
  const [selectedStoryId, setSelectedStoryId] = useState<string>(prefilledStory?.id || (savedStories[0]?.id || 'custom'));
  const [customTitle, setCustomTitle] = useState(prefilledStory?.title || '');
  const [customContent, setCustomContent] = useState(prefilledStory?.content || '');
  const [personalMessage, setPersonalMessage] = useState('');

  // Request session state
  const [sessionTopic, setSessionTopic] = useState('I have an idea for a new story 💡');
  const [sessionDetails, setSessionDetails] = useState('');
  const [availability, setAvailability] = useState('');

  // Submission status
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmittedSuccess, setIsSubmittedSuccess] = useState(false);
  const [lastSubmittedData, setLastSubmittedData] = useState<{
    subject: string;
    body: string;
    type: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);

  const student = analytics.getCurrentStudent();

  const handleSelectStory = (storyId: string) => {
    setSelectedStoryId(storyId);
    if (storyId === 'custom') {
      setCustomTitle('');
      setCustomContent('');
    } else {
      const found = savedStories.find((s) => s.id === storyId);
      if (found) {
        setCustomTitle(found.title);
        setCustomContent(found.content);
      }
    }
  };

  const handleSubmitShareStory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customContent.trim()) return;

    sounds.playCelebration();
    setIsSubmitting(true);

    const storyTitle = customTitle.trim() || 'Untitled Story';
    const emailSubject = `[The Write Magic] Story Submission: "${storyTitle}" by ${student?.name || 'Young Author'}`;
    const emailBody = `Dear Aashna,

A young author has shared a story with you from The Write Magic app!

----------------------------------------
STORY TITLE: ${storyTitle}
AUTHOR: ${student?.name || 'Young Author'}
ORGANIZATION / SCHOOL: ${student?.organization || 'Independent Young Author'}
DATE: ${new Date().toLocaleDateString()}
----------------------------------------

${personalMessage.trim() ? `PERSONAL NOTE FROM AUTHOR:\n"${personalMessage.trim()}"\n\n----------------------------------------\n` : ''}
STORY TEXT:
${customContent}

----------------------------------------
Sent with love via The Write Magic Platform ✨`;

    // 1. Record immediately & synchronously in persistent analytics tracker for admin review
    analytics.submitTalkToAashna({
      studentId: student?.id || 'stud-unknown',
      studentName: student?.name || 'Young Author',
      organization: student?.organization || 'Independent Author',
      type: 'story_share',
      storyTitle: storyTitle,
      storyContent: customContent,
      message: personalMessage,
    });

    setLastSubmittedData({
      subject: emailSubject,
      body: emailBody,
      type: 'Story Share',
    });

    setTimeout(() => {
      // 2. Open user's default email client addressed to aashnaagrawal1200@gmail.com
      const mailtoUrl = `mailto:${TARGET_EMAIL}?subject=${encodeURIComponent(
        emailSubject
      )}&body=${encodeURIComponent(emailBody)}`;
      
      try {
        const link = document.createElement('a');
        link.href = mailtoUrl;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.click();
      } catch (err) {
        console.warn('Could not launch mail client automatically:', err);
      }

      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#FFD1DC', '#FF8DA1', '#60A5FA', '#34D399', '#FBBF24'],
      });

      setIsSubmitting(false);
      setIsSubmittedSuccess(true);
    }, 400);
  };

  const handleSubmitRequestSession = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sessionDetails.trim()) return;

    sounds.playCelebration();
    setIsSubmitting(true);

    const emailSubject = `[The Write Magic] 1-on-1 Session Request from ${student?.name || 'Young Author'}`;
    const emailBody = `Dear Aashna,

A student would love to schedule a 1-on-1 creative writing session with you!

----------------------------------------
STUDENT NAME: ${student?.name || 'Young Author'}
ORGANIZATION / SCHOOL: ${student?.organization || 'Independent Young Author'}
TOPIC: ${sessionTopic}
PREFERRED AVAILABILITY: ${availability.trim() || 'Flexible / After School'}
DATE REQUESTED: ${new Date().toLocaleDateString()}
----------------------------------------

STUDENT'S MESSAGE / CREATIVE QUESTIONS:
${sessionDetails}

----------------------------------------
Sent with love via The Write Magic Platform ✨`;

    // 1. Save immediately & synchronously in admin tracker
    analytics.submitTalkToAashna({
      studentId: student?.id || 'stud-unknown',
      studentName: student?.name || 'Young Author',
      organization: student?.organization || 'Independent Author',
      type: 'session_request',
      topic: sessionTopic,
      message: sessionDetails,
      preferredAvailability: availability,
    });

    setLastSubmittedData({
      subject: emailSubject,
      body: emailBody,
      type: 'Session Request',
    });

    setTimeout(() => {
      // 2. Open default mail client addressed to aashnaagrawal1200@gmail.com
      const mailtoUrl = `mailto:${TARGET_EMAIL}?subject=${encodeURIComponent(
        emailSubject
      )}&body=${encodeURIComponent(emailBody)}`;
      
      try {
        const link = document.createElement('a');
        link.href = mailtoUrl;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.click();
      } catch (err) {
        console.warn('Could not launch mail client automatically:', err);
      }

      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#FFD1DC', '#FF8DA1', '#60A5FA', '#34D399', '#FBBF24'],
      });

      setIsSubmitting(false);
      setIsSubmittedSuccess(true);
    }, 400);
  };

  const handleCopyFormattedEmail = () => {
    sounds.playPop();
    if (!lastSubmittedData) return;
    const textToCopy = `To: ${TARGET_EMAIL}\nSubject: ${lastSubmittedData.subject}\n\n${lastSubmittedData.body}`;
    navigator.clipboard.writeText(textToCopy).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  const handleResendMailto = () => {
    sounds.playPop();
    if (!lastSubmittedData) return;
    const mailtoUrl = `mailto:${TARGET_EMAIL}?subject=${encodeURIComponent(
      lastSubmittedData.subject
    )}&body=${encodeURIComponent(lastSubmittedData.body)}`;
    window.location.href = mailtoUrl;
  };

  const handleReset = () => {
    setIsSubmittedSuccess(false);
    setPersonalMessage('');
    setSessionDetails('');
    setAvailability('');
    setLastSubmittedData(null);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#FFF0F3] via-white to-[#FFE4E9] rounded-[36px] border-4 border-[#FFE4E9] p-6 sm:p-8 shadow-lg text-center relative overflow-hidden">
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-white border-2 border-[#FFB6C1] shadow-xs text-2xl mx-auto">
            💌
          </div>
          <h2 className="text-2xl sm:text-3xl font-heading font-extrabold text-[#7D5A61]">
            Talk to Aashna ✨
          </h2>
          <p className="text-xs sm:text-sm text-[#A89094] max-w-lg mx-auto font-medium leading-relaxed">
            All messages and requests are delivered directly to Founder Aashna at{' '}
            <strong className="text-[#FF8DA1] font-bold underline decoration-[#FFB6C1]">
              {TARGET_EMAIL}
            </strong>
            .
          </p>
        </div>
      </div>

      {/* Success Confirmation State with Direct Email Actions */}
      {isSubmittedSuccess ? (
        <div className="bg-white rounded-[36px] border-4 border-emerald-200 p-8 sm:p-10 text-center space-y-6 shadow-xl animate-fadeIn">
          <div className="w-20 h-20 rounded-full bg-emerald-100 border-2 border-emerald-300 flex items-center justify-center text-4xl mx-auto animate-bounce">
            🎉
          </div>
          
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-700">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Email Prepared & Sent to {TARGET_EMAIL}</span>
            </div>
            <h3 className="text-2xl font-heading font-extrabold text-emerald-900">
              ✨ Sent to Aashna!
            </h3>
            <p className="text-sm text-emerald-800 max-w-lg mx-auto leading-relaxed">
              Thank you, <strong>{student?.name || 'Friend'}</strong>! Your message is saved in our system and opened for delivery to <strong>{TARGET_EMAIL}</strong>. Aashna reads every submission and looks forward to your creative journey!
            </p>
          </div>

          {/* Quick Actions if mail client needs re-triggering or manual copy */}
          {lastSubmittedData && (
            <div className="max-w-md mx-auto p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 text-left space-y-3">
              <div className="text-xs font-bold text-emerald-900 flex items-center justify-between">
                <span>📧 Destination: {TARGET_EMAIL}</span>
                <span className="text-[10px] text-emerald-600 font-semibold uppercase">{lastSubmittedData.type}</span>
              </div>
              <p className="text-xs text-emerald-700 leading-relaxed">
                If your email app didn't open automatically, you can click below to reopen or copy the message to your clipboard:
              </p>
              <div className="flex flex-wrap gap-2 pt-1">
                <a
                  href={`https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(TARGET_EMAIL)}&su=${encodeURIComponent(lastSubmittedData.subject)}&body=${encodeURIComponent(lastSubmittedData.body)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Send via Gmail Web</span>
                </a>

                <button
                  type="button"
                  onClick={handleResendMailto}
                  className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Open Default Email App</span>
                </button>

                <button
                  type="button"
                  onClick={handleCopyFormattedEmail}
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
                      <span>Copy Message</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          <div className="pt-2">
            <button
              onClick={handleReset}
              className="px-6 py-3 rounded-2xl bg-[#FF8DA1] hover:bg-[#FF6B8B] text-white font-heading font-bold text-sm shadow-md transition-all cursor-pointer hover:scale-102"
            >
              Send Another Note to Aashna ✨
            </button>
          </div>
        </div>
      ) : (
        /* Main Submission Card */
        <div className="bg-white rounded-[36px] border-4 border-[#FFE4E9] shadow-xl overflow-hidden">
          {/* Destination Notice Pill */}
          <div className="bg-[#FFF0F3] px-6 py-2.5 border-b border-[#FFE4E9] flex flex-col sm:flex-row items-center justify-between gap-2 text-xs font-medium text-[#7D5A61]">
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-[#FF8DA1]" />
              <span>
                Sending directly to: <strong className="font-bold text-[#FF6B8B]">{TARGET_EMAIL}</strong>
              </span>
            </div>
            <span className="text-[11px] text-[#A89094]">
              {student ? `Author: ${student.name} (${student.organization})` : 'Guest Author'}
            </span>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="grid grid-cols-2 p-2 bg-[#FFF9FA] border-b-2 border-[#FFE4E9]">
            <button
              type="button"
              onClick={() => setMode('share_story')}
              className={`py-3 px-4 rounded-2xl text-xs sm:text-sm font-heading font-extrabold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                mode === 'share_story'
                  ? 'bg-white text-[#7D5A61] shadow-xs border border-[#FFE4E9]'
                  : 'text-[#A89094] hover:text-[#7D5A61]'
              }`}
            >
              <BookOpen className="w-4 h-4 text-[#FF8DA1]" />
              <span>📖 Share My Writing</span>
            </button>

            <button
              type="button"
              onClick={() => setMode('request_session')}
              className={`py-3 px-4 rounded-2xl text-xs sm:text-sm font-heading font-extrabold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                mode === 'request_session'
                  ? 'bg-white text-[#7D5A61] shadow-xs border border-[#FFE4E9]'
                  : 'text-[#A89094] hover:text-[#7D5A61]'
              }`}
            >
              <Calendar className="w-4 h-4 text-[#FF8DA1]" />
              <span>💬 Request 1-on-1 Session</span>
            </button>
          </div>

          {/* Form Content */}
          <div className="p-6 sm:p-8">
            {mode === 'share_story' ? (
              /* Share Story Flow */
              <form onSubmit={handleSubmitShareStory} className="space-y-5">
                {/* Select from Saved Stories */}
                <div>
                  <label className="block text-xs font-extrabold uppercase tracking-wider text-[#A89094] mb-2">
                    Choose a Story to Share 📚
                  </label>

                  {savedStories.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {savedStories.map((story) => (
                        <button
                          key={story.id}
                          type="button"
                          onClick={() => handleSelectStory(story.id)}
                          className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                            selectedStoryId === story.id
                              ? 'bg-[#FF8DA1] text-white shadow-xs'
                              : 'bg-[#FFF5F7] text-[#7D5A61] border border-[#FFE4E9] hover:bg-[#FFE4E9]'
                          }`}
                        >
                          <span>{story.emoji || '📖'}</span>
                          <span>{story.title}</span>
                        </button>
                      ))}
                      <button
                        type="button"
                        onClick={() => handleSelectStory('custom')}
                        className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          selectedStoryId === 'custom'
                            ? 'bg-[#FF8DA1] text-white shadow-xs'
                            : 'bg-white text-[#A89094] border border-dashed border-[#FFE4E9] hover:border-[#FFB6C1]'
                        }`}
                      >
                        ✏️ Type a new draft
                      </button>
                    </div>
                  )}

                  <input
                    type="text"
                    value={customTitle}
                    onChange={(e) => setCustomTitle(e.target.value)}
                    placeholder="Story Title..."
                    className="w-full px-4 py-3 rounded-2xl bg-[#FFF9FA] border-2 border-[#FFE4E9] focus:outline-none focus:border-[#FF8DA1] text-[#7D5A61] font-bold text-sm"
                  />
                </div>

                {/* Story Content Area */}
                <div>
                  <label className="block text-xs font-extrabold uppercase tracking-wider text-[#A89094] mb-1.5">
                    Story Content ✨
                  </label>
                  <textarea
                    rows={6}
                    required
                    value={customContent}
                    onChange={(e) => setCustomContent(e.target.value)}
                    placeholder="Your wonderful story text..."
                    className="w-full p-4 rounded-2xl bg-[#FFF9FA] border-2 border-[#FFE4E9] focus:outline-none focus:border-[#FF8DA1] text-[#7D5A61] text-sm leading-relaxed"
                  />
                </div>

                {/* Note to Aashna */}
                <div>
                  <label className="block text-xs font-extrabold uppercase tracking-wider text-[#A89094] mb-1.5">
                    Add a Note for Aashna 💌 (optional)
                  </label>
                  <input
                    type="text"
                    value={personalMessage}
                    onChange={(e) => setPersonalMessage(e.target.value)}
                    placeholder="e.g. I loved writing the ending! Let me know what you think!"
                    className="w-full px-4 py-3 rounded-2xl bg-[#FFF9FA] border-2 border-[#FFE4E9] focus:outline-none focus:border-[#FF8DA1] text-[#7D5A61] text-xs sm:text-sm"
                  />
                </div>

                <button
                  type="submit"
                  disabled={!customContent.trim() || isSubmitting}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#FF8DA1] to-[#FF6B8B] hover:opacity-95 text-white font-heading font-extrabold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  <span>
                    {isSubmitting
                      ? 'Sending to aashnaagrawal1200@gmail.com...'
                      : `Send Story to ${TARGET_EMAIL} ✨`}
                  </span>
                </button>
              </form>
            ) : (
              /* Request Session Flow */
              <form onSubmit={handleSubmitRequestSession} className="space-y-5">
                <div>
                  <label className="block text-xs font-extrabold uppercase tracking-wider text-[#A89094] mb-2">
                    What would you like to talk about? 💭
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {[
                      'I have an idea for a new story 💡',
                      'Help with grammar & sentence flow ✏️',
                      'Help developing cool characters 🦸',
                    ].map((topic) => (
                      <button
                        key={topic}
                        type="button"
                        onClick={() => setSessionTopic(topic)}
                        className={`p-3 rounded-2xl text-xs font-bold text-left border transition-all cursor-pointer ${
                          sessionTopic === topic
                            ? 'bg-[#FFF0F3] border-[#FF8DA1] text-[#7D5A61] shadow-xs'
                            : 'bg-[#FFF9FA] border-[#FFE4E9] text-[#A89094] hover:border-[#FFB6C1]'
                        }`}
                      >
                        {topic}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-extrabold uppercase tracking-wider text-[#A89094] mb-1.5">
                    Tell Aashna about your idea or questions 📝
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={sessionDetails}
                    onChange={(e) => setSessionDetails(e.target.value)}
                    placeholder="Describe your story idea or what you would love help with..."
                    className="w-full p-4 rounded-2xl bg-[#FFF9FA] border-2 border-[#FFE4E9] focus:outline-none focus:border-[#FF8DA1] text-[#7D5A61] text-sm leading-relaxed"
                  />
                </div>

                <div>
                  <label className="block text-xs font-extrabold uppercase tracking-wider text-[#A89094] mb-1.5">
                    When are you usually free? ⏰
                  </label>
                  <input
                    type="text"
                    value={availability}
                    onChange={(e) => setAvailability(e.target.value)}
                    placeholder="e.g. Wednesday after school (4:00 PM), or Saturday mornings..."
                    className="w-full px-4 py-3 rounded-2xl bg-[#FFF9FA] border-2 border-[#FFE4E9] focus:outline-none focus:border-[#FF8DA1] text-[#7D5A61] text-xs sm:text-sm"
                  />
                </div>

                <button
                  type="submit"
                  disabled={!sessionDetails.trim() || isSubmitting}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#FF8DA1] to-[#FF6B8B] hover:opacity-95 text-white font-heading font-extrabold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Calendar className="w-4 h-4" />
                  <span>
                    {isSubmitting
                      ? 'Sending to aashnaagrawal1200@gmail.com...'
                      : `Request Session via ${TARGET_EMAIL} 🗓️`}
                  </span>
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

