import React, { useState } from 'react';
import { StoryImage } from '../../types';
import { Heart, Sparkles, HelpCircle, Pencil, Eye, Check, ChevronDown, ChevronUp } from 'lucide-react';
import { sounds } from '../../utils/sound';

interface StorySparkCardProps {
  spark: StoryImage;
  isSelected?: boolean;
  isFavorite?: boolean;
  onToggleFavorite?: (e: React.MouseEvent, id: string) => void;
  onSelectSpark: (spark: StoryImage, supportLevel?: 'look' | 'help' | 'starter') => void;
}

export const StorySparkCard: React.FC<StorySparkCardProps> = ({
  spark,
  isSelected,
  isFavorite,
  onToggleFavorite,
  onSelectSpark,
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  // Fallback gradient colors based on category
  const categoryGradients: Record<string, string> = {
    school: 'from-sky-100 via-sky-50 to-blue-100 text-sky-800',
    magic: 'from-purple-100 via-pink-50 to-purple-200 text-purple-800',
    difference: 'from-emerald-100 via-teal-50 to-emerald-200 text-emerald-800',
    feelings: 'from-rose-100 via-pink-50 to-rose-200 text-rose-800',
    mystery: 'from-amber-100 via-orange-50 to-amber-200 text-amber-800',
    funny: 'from-teal-100 via-emerald-50 to-teal-200 text-teal-800',
    what_if: 'from-indigo-100 via-blue-50 to-indigo-200 text-indigo-800',
    adventure: 'from-orange-100 via-amber-50 to-orange-200 text-orange-800',
    animals: 'from-green-100 via-emerald-50 to-green-200 text-green-800',
    finish_story: 'from-violet-100 via-purple-50 to-violet-200 text-violet-800',
    special_days: 'from-yellow-100 via-amber-50 to-yellow-200 text-yellow-800',
    everyday_life: 'from-stone-100 via-rose-50 to-stone-200 text-stone-800',
  };

  const gradientClass = categoryGradients[spark.category] || 'from-pink-100 via-rose-50 to-pink-200 text-pink-800';

  const handleCardClick = () => {
    sounds.playPop();
    setIsExpanded(!isExpanded);
  };

  return (
    <div
      className={`group relative bg-white rounded-[28px] overflow-hidden border-2 transition-all flex flex-col hover:shadow-xl ${
        isSelected
          ? 'border-[#FF8DA1] ring-4 ring-[#FF8DA1]/30 shadow-md'
          : 'border-[#FFE4E9] hover:border-[#FFB6C1]'
      }`}
    >
      {/* Hero Image Container */}
      <div
        onClick={handleCardClick}
        className="relative h-48 sm:h-52 w-full overflow-hidden bg-gradient-to-tr from-[#FFF5F7] to-[#FFE4E9] cursor-pointer"
      >
        {/* Shimmer Placeholder while loading */}
        {!imageLoaded && !imageError && (
          <div className="absolute inset-0 bg-stone-200 animate-pulse flex items-center justify-center">
            <span className="text-3xl animate-bounce">{spark.emoji || '✨'}</span>
          </div>
        )}

        {/* Story Illustration Image */}
        {!imageError ? (
          <img
            src={spark.imageUrl}
            alt={spark.title}
            loading="lazy"
            referrerPolicy="no-referrer"
            onLoad={() => setImageLoaded(true)}
            onError={() => {
              setImageError(true);
              setImageLoaded(true);
            }}
            className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
          />
        ) : (
          /* Graceful Storybook Fallback Canvas */
          <div className={`w-full h-full bg-gradient-to-br ${gradientClass} flex flex-col items-center justify-center p-4 text-center select-none`}>
            <span className="text-5xl mb-2 drop-shadow-sm transform group-hover:scale-110 transition-transform">
              {spark.emoji || '🎨'}
            </span>
            <span className="text-xs font-heading font-extrabold line-clamp-2 px-2">
              {spark.title}
            </span>
            <span className="text-[10px] font-bold opacity-75 mt-1 px-2 py-0.5 rounded-full bg-white/60">
              {spark.tag}
            </span>
          </div>
        )}

        {/* Hover Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

        {/* Category & Tag Badge */}
        <span className="absolute top-3 left-3 px-3 py-1 rounded-full text-[11px] font-bold bg-white/95 backdrop-blur-xs text-[#7D5A61] shadow-xs flex items-center gap-1.5 border border-[#FFE4E9]">
          <span>{spark.emoji}</span>
          <span>{spark.categoryLabel || spark.tag}</span>
        </span>

        {/* Favorite Heart Button */}
        {onToggleFavorite && (
          <button
            onClick={(e) => onToggleFavorite(e, spark.id)}
            className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-xs ${
              isFavorite
                ? 'bg-rose-500 text-white hover:scale-110'
                : 'bg-white/90 text-[#A89094] hover:text-rose-500 hover:bg-white'
            }`}
            title={isFavorite ? 'Unfavorite' : 'Add to favorites'}
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
          </button>
        )}

        {/* Selected Indicator */}
        {isSelected && (
          <span className="absolute bottom-3 right-3 px-3 py-1 rounded-full text-[11px] font-extrabold bg-[#FF8DA1] text-white shadow-md flex items-center gap-1.5 animate-fadeIn">
            <Check className="w-3.5 h-3.5 stroke-[3]" />
            <span>Chosen Spark</span>
          </span>
        )}

        {/* Quick Expand Button overlay */}
        <div className="absolute bottom-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity">
          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-black/60 text-white backdrop-blur-xs flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-300" />
            <span>Click to explore</span>
          </span>
        </div>
      </div>

      {/* Card Content & Narrative Teaser */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <div className="flex items-start justify-between gap-2">
            <h4
              onClick={handleCardClick}
              className="text-sm sm:text-base font-heading font-extrabold text-[#7D5A61] leading-snug group-hover:text-[#FF6B8B] transition-colors cursor-pointer"
            >
              {spark.title}
            </h4>
            <button
              onClick={handleCardClick}
              className="text-[#A89094] hover:text-[#7D5A61] p-1 rounded-lg hover:bg-[#FFF0F3] transition-colors cursor-pointer"
              title="Expand Story Spark"
            >
              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>

          {/* Prompt Question */}
          <p className="text-xs text-[#7D5A61]/80 mt-1.5 leading-relaxed">
            {spark.prompt}
          </p>
        </div>

        {/* Expanded Writing Support Options */}
        {isExpanded && (
          <div className="space-y-3 pt-3 border-t border-[#FFF0F3] animate-fadeIn">
            {/* Guided Questions (Need a little help) */}
            {spark.guidedQuestions && spark.guidedQuestions.length > 0 && (
              <div className="p-3 rounded-2xl bg-[#FFF9FA] border border-[#FFE4E9] space-y-1.5">
                <div className="flex items-center gap-1.5 text-[11px] font-extrabold text-[#FF8DA1]">
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>Think about:</span>
                </div>
                <ul className="space-y-1 text-[11px] text-[#7D5A61] pl-2 list-disc list-inside">
                  {spark.guidedQuestions.map((q, idx) => (
                    <li key={idx} className="leading-snug">{q}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Starter Sentence Option */}
            {spark.starterSentence && (
              <div className="p-2.5 rounded-2xl bg-[#F0FDF4] border border-[#DCFCE7] text-[11px] text-[#166534] leading-snug">
                <span className="font-bold block text-[#15803D] mb-0.5">💡 Story Starter:</span>
                "{spark.starterSentence}"
              </div>
            )}

            {/* Word Sparks */}
            {spark.suggestedWords && spark.suggestedWords.length > 0 && (
              <div className="flex items-center gap-1 flex-wrap">
                <span className="text-[10px] font-bold text-[#A89094]">Words:</span>
                {spark.suggestedWords.slice(0, 4).map((w, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-[#FFF5F7] text-[#7D5A61] border border-[#FFE4E9]"
                  >
                    ✨ {w}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Action Buttons: 3 Support Levels */}
        <div className="pt-2 border-t border-[#FFF0F3] flex items-center gap-2">
          {/* Quick Write with Starter */}
          <button
            onClick={() => onSelectSpark(spark, 'starter')}
            className="flex-1 py-2 px-3 rounded-xl bg-gradient-to-r from-[#FF8DA1] to-[#FF6B8B] hover:opacity-95 text-white font-heading font-extrabold text-xs shadow-xs flex items-center justify-center gap-1.5 transition-all transform active:scale-95 cursor-pointer"
          >
            <Pencil className="w-3.5 h-3.5" />
            <span>Write Story</span>
          </button>

          {/* Just Look / Open Blank Canvas */}
          <button
            onClick={() => onSelectSpark(spark, 'look')}
            className="p-2 rounded-xl bg-[#FFF5F7] hover:bg-[#FFE4E9] text-[#7D5A61] hover:text-[#FF6B8B] border border-[#FFE4E9] transition-all cursor-pointer"
            title="Start with blank canvas"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
