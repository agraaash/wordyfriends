import React, { useState } from 'react';
import { StudentProfile } from '../../types';
import { analytics } from '../../utils/analyticsTracker';
import { ArrowRight, ArrowLeft, X } from 'lucide-react';
import { sounds } from '../../utils/sound';

interface StudentOnboardingModalProps {
  isOpen: boolean;
  currentStudent?: StudentProfile | null;
  onComplete: (student: StudentProfile) => void;
  onBack?: () => void;
}

export const StudentOnboardingModal: React.FC<StudentOnboardingModalProps> = ({
  isOpen,
  currentStudent,
  onComplete,
  onBack,
}) => {
  const [studentName, setStudentName] = useState('');
  const [organization, setOrganization] = useState(currentStudent?.organization || '');

  if (!isOpen) return null;

  const handleStartWriting = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName.trim()) return;

    sounds.playCelebration();
    const student = analytics.authenticateStudent(studentName, organization);
    onComplete(student);
  };

  const handleBack = () => {
    sounds.playPop();
    if (onBack) {
      onBack();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#7D5A61]/30 backdrop-blur-sm animate-fadeIn">
      {/* Playful Doodles / Floating elements */}
      <div className="relative w-full max-w-lg bg-white rounded-[36px] p-8 sm:p-10 border-4 border-[#FFE4E9] shadow-2xl overflow-hidden">
        {/* Cute background pastel decorations */}
        <div className="absolute -top-10 -right-10 w-36 h-36 bg-[#FFF0F3] rounded-full blur-xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-36 h-36 bg-[#FFF5EB] rounded-full blur-xl pointer-events-none" />

        {/* Back and Close buttons when user is already logged in */}
        {currentStudent && onBack && (
          <>
            <button
              type="button"
              onClick={handleBack}
              className="absolute top-5 left-5 z-20 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FFF0F3] hover:bg-[#FFE4E9] text-[#7D5A61] font-heading font-bold text-xs transition-colors cursor-pointer border border-[#FFB6C1] shadow-2xs group"
              title="Go back without changing author"
            >
              <ArrowLeft className="w-4 h-4 text-[#FF8DA1] group-hover:-translate-x-0.5 transition-transform" />
              <span>Back</span>
            </button>

            <button
              type="button"
              onClick={handleBack}
              className="absolute top-5 right-5 z-20 p-2 rounded-full bg-[#FFF0F3] hover:bg-[#FFE4E9] text-[#7D5A61] transition-colors cursor-pointer border border-[#FFB6C1] shadow-2xs"
              title="Close and return to app"
            >
              <X className="w-4 h-4 text-[#7D5A61]" />
            </button>
          </>
        )}

        {/* Decorative corner illustrations */}
        <div className="absolute top-14 left-6 text-xl animate-bounce">✨</div>
        <div className="absolute top-14 right-6 text-xl">🦋</div>
        <div className="absolute bottom-6 right-6 text-xl">🌸</div>
        <div className="absolute bottom-6 left-6 text-xl">✏️</div>

        <div className="relative z-10 space-y-5 text-center">
          {/* Brand Logo & Title */}
          <div className="space-y-2">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-gradient-to-tr from-[#FFD1DC] via-[#FFE4E9] to-[#FFF0F3] border-2 border-[#FFB6C1] shadow-xs text-3xl mx-auto">
              ✨
            </div>
            <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-[#7D5A61] tracking-tight">
              {currentStudent ? 'Switch Author or Profile ✨' : 'Welcome to The Write Magic ✨'}
            </h1>
            <p className="text-sm font-medium text-[#A89094] max-w-sm mx-auto leading-relaxed">
              {currentStudent
                ? 'Enter a new author name below, or click Back to stay logged in!'
                : 'Where your ideas become stories. Look, imagine, write, and make words dance!'}
            </p>
          </div>

          {/* Currently logged in active author card */}
          {currentStudent && (
            <div className="bg-[#FFF0F3] border border-[#FFB6C1] rounded-2xl p-3.5 flex items-center justify-between gap-3 text-left shadow-2xs">
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="text-2xl">{currentStudent.avatarEmoji || '🌸'}</span>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-[#7D5A61] truncate">
                    Currently logged in as <span className="text-[#FF6B8B] font-extrabold">{currentStudent.name}</span>
                  </p>
                  <p className="text-[11px] text-[#A89094] truncate">
                    {currentStudent.organization || 'Independent Young Author'}
                  </p>
                </div>
              </div>
              {onBack && (
                <button
                  type="button"
                  onClick={handleBack}
                  className="shrink-0 px-3 py-1.5 rounded-xl bg-white hover:bg-[#FFE4E9] border border-[#FFB6C1] text-[#7D5A61] text-xs font-bold font-heading shadow-xs cursor-pointer transition-all hover:scale-102"
                >
                  ← Stay as {currentStudent.name.split(' ')[0]}
                </button>
              )}
            </div>
          )}

          {/* Student Form */}
          <form onSubmit={handleStartWriting} className="space-y-4 text-left">
            <div>
              <label className="block text-xs font-bold text-[#7D5A61] uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <span>{currentStudent ? 'New Author Name' : 'Your Name'}</span>
                <span className="text-[#FF8DA1]">*</span>
              </label>
              <input
                type="text"
                required
                autoFocus
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                placeholder="e.g. Maya, Ethan, Ananya..."
                className="w-full px-5 py-3.5 text-base font-semibold rounded-2xl bg-[#FFF9FA] border-2 border-[#FFE4E9] focus:outline-none focus:border-[#FF8DA1] focus:bg-white text-[#7D5A61] placeholder-[#C4B5B8] transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#7D5A61] uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <span>School or Organization</span>
                <span className="text-[10px] text-[#A89094] font-normal lowercase">(optional)</span>
              </label>
              <input
                type="text"
                value={organization}
                onChange={(e) => setOrganization(e.target.value)}
                placeholder="e.g. Sunshine Elementary, Grade 4..."
                className="w-full px-5 py-3.5 text-sm font-semibold rounded-2xl bg-[#FFF9FA] border-2 border-[#FFE4E9] focus:outline-none focus:border-[#FF8DA1] focus:bg-white text-[#7D5A61] placeholder-[#C4B5B8] transition-all"
              />
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-1">
              {currentStudent && onBack && (
                <button
                  type="button"
                  onClick={handleBack}
                  className="w-full sm:w-auto px-5 py-3.5 rounded-2xl border-2 border-[#FFE4E9] bg-white hover:bg-[#FFF0F3] text-[#7D5A61] font-heading font-bold text-sm transition-all cursor-pointer flex items-center justify-center gap-1.5 order-2 sm:order-1 hover:border-[#FFB6C1]"
                >
                  <ArrowLeft className="w-4 h-4 text-[#FF8DA1]" />
                  <span>Back</span>
                </button>
              )}

              <button
                type="submit"
                disabled={!studentName.trim()}
                className={`w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#FF8DA1] to-[#FF6B8B] hover:opacity-95 text-white font-heading font-extrabold text-sm sm:text-base shadow-md hover:shadow-lg transition-all transform active:scale-98 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 ${
                  currentStudent ? 'flex-1 order-1 sm:order-2' : ''
                }`}
              >
                <span>{currentStudent ? '✨ Switch Author' : '✨ Start Writing'}</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </form>

          {/* Friendly Footer Note */}
          <div className="pt-1 text-center">
            <p className="text-xs text-[#A89094] flex items-center justify-center gap-1">
              <span>Ready for magical stories, fun word discoveries & friendly feedback!</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
