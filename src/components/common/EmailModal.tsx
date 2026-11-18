import React, { useState } from 'react';
import { Mail, Send, Copy, Check, X, Sparkles, Heart } from 'lucide-react';
import { sounds } from '../../utils/sound';

interface EmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultType?: 'story' | 'photo_story' | 'situation' | 'question' | 'general';
  defaultTitle?: string;
  defaultContent?: string;
}

export const EmailModal: React.FC<EmailModalProps> = ({
  isOpen,
  onClose,
  defaultType = 'story',
  defaultTitle = '',
  defaultContent = '',
}) => {
  const [authorName, setAuthorName] = useState('');
  const [authorAge, setAuthorAge] = useState('');
  const [subject, setSubject] = useState(
    defaultTitle ? `Story Submission: ${defaultTitle}` : 'My Story / Question for The Write Magic'
  );
  const [message, setMessage] = useState(defaultContent || '');
  const [copied, setCopied] = useState(false);
  const [hasSent, setHasSent] = useState(false);

  // Sync state if default props change
  React.useEffect(() => {
    if (defaultTitle) {
      setSubject(
        defaultType === 'photo_story'
          ? `[Photo Story] ${defaultTitle}`
          : defaultType === 'situation'
          ? `[Describe Situation] ${defaultTitle}`
          : defaultType === 'question'
          ? `[Question for Aashna] ${defaultTitle}`
          : `[Story Submission] ${defaultTitle}`
      );
    }
    if (defaultContent) {
      setMessage(defaultContent);
    }
  }, [defaultTitle, defaultContent, defaultType, isOpen]);

  if (!isOpen) return null;

  const targetEmail = 'aashnaagrawal1200@gmail.com';

  const fullEmailBody = `Dear Aashna & The Write Magic Team,

${message}

---
Author Name: ${authorName || 'Young Writer'}
Age/Grade: ${authorAge || 'Creative Learner'}
Submitted via WordyFriends & The Write Magic App`;

  const handleOpenMailto = () => {
    sounds.playPop();
    const mailtoUrl = `mailto:${targetEmail}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(fullEmailBody)}`;
    window.location.href = mailtoUrl;
    setHasSent(true);
  };

  const handleCopyText = () => {
    sounds.playPop();
    const textToCopy = `To: ${targetEmail}\nSubject: ${subject}\n\n${fullEmailBody}`;
    navigator.clipboard.writeText(textToCopy).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-[32px] border-4 border-[#FFE4E9] shadow-xl max-w-lg w-full overflow-hidden animate-scaleUp">
        {/* Header */}
        <div className="bg-[#FFF0F3] px-6 py-4 border-b border-[#FFE4E9] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white text-[#FF8DA1] flex items-center justify-center text-xl shadow-xs border border-[#FFE4E9]">
              💌
            </div>
            <div>
              <h3 className="font-heading font-bold text-lg text-[#7D5A61]">
                Email to The Write Magic
              </h3>
              <p className="text-xs text-[#A89094]">
                To Founder Aashna Agrawal ({targetEmail})
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              sounds.playPop();
              onClose();
            }}
            className="p-1.5 rounded-xl text-[#A89094] hover:text-[#7D5A61] hover:bg-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {hasSent ? (
            <div className="text-center py-6 space-y-3 animate-fadeIn">
              <div className="w-16 h-16 rounded-full bg-[#FFF0F3] border-2 border-[#FFD1DC] text-3xl flex items-center justify-center mx-auto">
                ✨
              </div>
              <h4 className="font-heading font-bold text-xl text-[#7D5A61]">
                Thank you for sharing your magic!
              </h4>
              <p className="text-xs text-[#A89094] max-w-xs mx-auto leading-relaxed">
                Your email client was opened to send your writing to{' '}
                <strong className="text-[#7D5A61]">{targetEmail}</strong>. Aashna and the team at The Write Magic love reading stories and answering questions from young creators!
              </p>
              <button
                onClick={() => {
                  sounds.playPop();
                  setHasSent(false);
                  onClose();
                }}
                className="px-6 py-2.5 rounded-xl bg-[#FFB6C1] hover:bg-[#FF8DA1] text-white font-bold text-xs shadow-xs cursor-pointer"
              >
                Close Window
              </button>
            </div>
          ) : (
            <>
              <div className="bg-[#FFF9FA] p-3 rounded-2xl border border-[#FFE4E9] text-xs text-[#7D5A61] flex items-center gap-2">
                <Heart className="w-4 h-4 text-[#FF8DA1] flex-shrink-0" />
                <span>
                  Submit your creative stories, questions, or poems directly to the NGO!
                </span>
              </div>

              {/* Author Details */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#7D5A61] mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    placeholder="e.g. Maya, Kabir"
                    className="w-full px-3 py-2 text-xs rounded-xl bg-[#FFF9FA] border border-[#FFE4E9] focus:outline-none focus:border-[#FFB6C1] text-[#5D4A4F]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#7D5A61] mb-1">
                    Age / Grade (Optional)
                  </label>
                  <input
                    type="text"
                    value={authorAge}
                    onChange={(e) => setAuthorAge(e.target.value)}
                    placeholder="e.g. 9 years old / 4th Grade"
                    className="w-full px-3 py-2 text-xs rounded-xl bg-[#FFF9FA] border border-[#FFE4E9] focus:outline-none focus:border-[#FFB6C1] text-[#5D4A4F]"
                  />
                </div>
              </div>

              {/* Subject */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#7D5A61] mb-1">
                  Subject
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Subject of your message..."
                  className="w-full px-3 py-2 text-xs rounded-xl bg-[#FFF9FA] border border-[#FFE4E9] focus:outline-none focus:border-[#FFB6C1] text-[#5D4A4F] font-semibold"
                />
              </div>

              {/* Message */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#7D5A61] mb-1">
                  Story / Message Body
                </label>
                <textarea
                  rows={6}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Write your story, thoughts, or questions here..."
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-[#FFF9FA] border border-[#FFE4E9] focus:outline-none focus:border-[#FFB6C1] text-[#5D4A4F] leading-relaxed resize-none"
                />
              </div>

              {/* Actions */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-[#FFE4E9]">
                <button
                  onClick={handleCopyText}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-white border border-[#FFE4E9] text-[#7D5A61] hover:bg-[#FFF0F3] text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-700">Copied to Clipboard!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-[#FF8DA1]" />
                      <span>Copy Formatted Text</span>
                    </>
                  )}
                </button>

                <button
                  onClick={handleOpenMailto}
                  disabled={!message.trim()}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#FFB6C1] hover:bg-[#FF8DA1] disabled:opacity-50 text-white font-bold text-xs shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Email via Mail App</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
