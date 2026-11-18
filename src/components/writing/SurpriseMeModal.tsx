import React, { useState } from 'react';
import { StoryImage } from '../../types';
import { Sparkles, Dice5, Pencil, Eye, X, HelpCircle, ArrowRight, Heart } from 'lucide-react';
import { sounds } from '../../utils/sound';
import confetti from 'canvas-confetti';
import { storySparksManager } from '../../utils/storySparksManager';

interface SurpriseMeModalProps {
  isOpen: boolean;
  spark: StoryImage | null;
  onClose: () => void;
  onStartWriting: (spark: StoryImage, withStarter: boolean) => void;
  onRollAgain: () => void;
}

export const SurpriseMeModal: React.FC<SurpriseMeModalProps> = ({
  isOpen,
  spark,
  onClose,
  onStartWriting,
  onRollAgain,
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isFavorite, setIsFavorite] = useState(() => {
    return spark ? storySparksManager.getFavorites().includes(spark.id) : false;
  });

  if (!isOpen || !spark) return null;

  const handleToggleFavorite = () => {
    sounds.playPop();
    const newFav = storySparksManager.toggleFavorite(spark.id);
    setIsFavorite(newFav);
  };

  const handleRollAgain = () => {
    setImageLoaded(false);
    setImageError(false);
    sounds.playCelebration();
    confetti({
      particleCount: 35,
      spread: 60,
      origin: { y: 0.6 },
    });
    onRollAgain();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#7D5A61]/50 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-white rounded-[36px] border-4 border-[#FFE4E9] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Top Header */}
        <div className="p-5 sm:p-6 pb-4 border-b border-[#FFE4E9] bg-gradient-to-r from-[#FFF5F7] via-white to-[#FFE4E9] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl animate-bounce">🎲</span>
            <div>
              <h2 className="text-xl sm:text-2xl font-heading font-extrabold text-[#7D5A61]">
                ✨ Your Story Spark
              </h2>
              <p className="text-xs text-[#A89094] font-medium">
                Look closely at the scene... what story is waiting to be told?
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleRollAgain}
              className="px-3 py-1.5 rounded-xl bg-white hover:bg-[#FFF0F3] border border-[#FFE4E9] text-[#7D5A61] text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
              title="Pick another random spark"
            >
              <Dice5 className="w-4 h-4 text-[#FF8DA1]" />
              <span className="hidden sm:inline">Roll Again</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white hover:bg-[#FFF0F3] text-[#A89094] hover:text-[#7D5A61] border border-[#FFE4E9] transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-5 bg-[#FAF7F8]">
          {/* Hero Image */}
          <div className="relative h-64 sm:h-72 w-full rounded-3xl overflow-hidden bg-stone-100 border-2 border-[#FFE4E9] shadow-sm">
            {!imageLoaded && !imageError && (
              <div className="absolute inset-0 bg-stone-200 animate-pulse flex items-center justify-center">
                <span className="text-4xl animate-bounce">{spark.emoji || '✨'}</span>
              </div>
            )}

            {!imageError ? (
              <img
                src={spark.imageUrl}
                alt={spark.title}
                referrerPolicy="no-referrer"
                onLoad={() => setImageLoaded(true)}
                onError={() => {
                  setImageError(true);
                  setImageLoaded(true);
                }}
                className={`w-full h-full object-cover transition-opacity duration-500 ${
                  imageLoaded ? 'opacity-100' : 'opacity-0'
                }`}
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-pink-100 via-rose-50 to-pink-200 flex flex-col items-center justify-center p-6 text-center">
                <span className="text-6xl mb-3">{spark.emoji || '🎨'}</span>
                <h4 className="text-lg font-heading font-extrabold text-[#7D5A61]">{spark.title}</h4>
                <span className="text-xs font-bold text-[#A89094] mt-1">{spark.categoryLabel}</span>
              </div>
            )}

            {/* Category Tag */}
            <span className="absolute top-3.5 left-3.5 px-3 py-1 rounded-full text-xs font-extrabold bg-white/95 backdrop-blur-xs text-[#7D5A61] shadow-xs flex items-center gap-1.5 border border-[#FFE4E9]">
              <span>{spark.emoji}</span>
              <span>{spark.categoryLabel}</span>
            </span>

            {/* Favorite Button */}
            <button
              onClick={handleToggleFavorite}
              className={`absolute top-3.5 right-3.5 w-9 h-9 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-md ${
                isFavorite
                  ? 'bg-rose-500 text-white'
                  : 'bg-white/90 text-[#A89094] hover:text-rose-500 hover:bg-white'
              }`}
            >
              <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
            </button>
          </div>

          {/* Title & Core Spark Prompt */}
          <div className="space-y-3 bg-white p-5 rounded-3xl border border-[#FFE4E9] shadow-xs">
            <h3 className="text-xl font-heading font-extrabold text-[#7D5A61]">
              {spark.title}
            </h3>

            <div>
              <span className="text-xs font-extrabold text-[#FF8DA1] uppercase tracking-wider block mb-1">
                What do you think is happening here? 🤔
              </span>
              <p className="text-sm sm:text-base text-[#7D5A61] leading-relaxed">
                {spark.prompt}
              </p>
            </div>

            {/* Guided Questions */}
            {spark.guidedQuestions && spark.guidedQuestions.length > 0 && (
              <div className="pt-3 border-t border-[#FFF0F3] space-y-1.5">
                <div className="flex items-center gap-1.5 text-xs font-extrabold text-[#7D5A61]">
                  <HelpCircle className="w-3.5 h-3.5 text-[#FF8DA1]" />
                  <span>Curious questions to explore:</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#A89094]">
                  {spark.guidedQuestions.map((q, idx) => (
                    <div key={idx} className="p-2.5 rounded-xl bg-[#FFF9FA] border border-[#FFE4E9] text-[#7D5A61]">
                      • {q}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Starter Sentence */}
            {spark.starterSentence && (
              <div className="p-3.5 rounded-2xl bg-[#F0FDF4] border border-[#DCFCE7] text-xs sm:text-sm text-[#166534] space-y-1">
                <span className="font-bold text-[#15803D] block text-xs uppercase tracking-wider">
                  💡 Start your story with:
                </span>
                <p className="font-medium italic">"{spark.starterSentence}"</p>
              </div>
            )}

            {/* Word Sparks */}
            {spark.suggestedWords && spark.suggestedWords.length > 0 && (
              <div className="flex items-center gap-1.5 flex-wrap pt-1">
                <span className="text-xs font-bold text-[#A89094]">Word Sparks:</span>
                {spark.suggestedWords.map((w, idx) => (
                  <span
                    key={idx}
                    className="text-xs font-semibold px-2.5 py-1 rounded-xl bg-[#FFF5F7] text-[#7D5A61] border border-[#FFE4E9]"
                  >
                    ✨ {w}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Bottom Action Buttons */}
        <div className="p-5 sm:p-6 border-t border-[#FFE4E9] bg-white flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            onClick={() => onStartWriting(spark, false)}
            className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-[#FFF5F7] hover:bg-[#FFE4E9] text-[#7D5A61] font-heading font-bold text-xs sm:text-sm border border-[#FFE4E9] transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Eye className="w-4 h-4 text-[#FF8DA1]" />
            <span>💭 I'll Make My Own Story</span>
          </button>

          <button
            onClick={() => onStartWriting(spark, true)}
            className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-gradient-to-r from-[#FF8DA1] to-[#FF6B8B] hover:opacity-95 text-white font-heading font-extrabold text-sm shadow-md hover:shadow-lg transition-all transform active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
          >
            <Pencil className="w-4 h-4" />
            <span>✏️ Start Writing</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
