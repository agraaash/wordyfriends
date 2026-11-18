import React, { useState, useMemo } from 'react';
import { StoryImage } from '../../types';
import { IMAGE_CATEGORIES } from '../../data/storyImagesData';
import { storySparksManager } from '../../utils/storySparksManager';
import { StorySparkCard } from './StorySparkCard';
import { SurpriseMeModal } from './SurpriseMeModal';
import { Sparkles, Search, Dice5, Heart, X, Filter, BookOpen } from 'lucide-react';
import { sounds } from '../../utils/sound';
import confetti from 'canvas-confetti';
import { analytics } from '../../utils/analyticsTracker';

interface ImageRepositoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectImage: (image: StoryImage, supportLevel?: 'look' | 'help' | 'starter') => void;
  selectedImageId?: string;
}

export const ImageRepositoryModal: React.FC<ImageRepositoryModalProps> = ({
  isOpen,
  onClose,
  onSelectImage,
  selectedImageId,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);
  const [surpriseSpark, setSurpriseSpark] = useState<StoryImage | null>(null);
  const [isSurpriseOpen, setIsSurpriseOpen] = useState(false);

  const [favoriteIds, setFavoriteIds] = useState<string[]>(() => {
    return storySparksManager.getFavorites();
  });

  const allSparks = useMemo(() => {
    return storySparksManager.getAllSparks();
  }, [isOpen]);

  const toggleFavorite = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    sounds.playPop();
    const isFav = storySparksManager.toggleFavorite(id);
    const updated = storySparksManager.getFavorites();
    setFavoriteIds(updated);
    analytics.trackEvent(isFav ? 'image_favorited' : 'image_unfavorited', 'Image Library', { imageId: id });
  };

  const filteredSparks = useMemo(() => {
    let result = allSparks;

    if (activeCategory !== 'all') {
      result = result.filter((s) => s.category === activeCategory);
    }

    if (showOnlyFavorites) {
      result = result.filter((s) => favoriteIds.includes(s.id));
    }

    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter((s) => {
        const inTitle = s.title.toLowerCase().includes(q);
        const inPrompt = s.prompt.toLowerCase().includes(q);
        const inTag = s.tag.toLowerCase().includes(q);
        const inWords = s.suggestedWords.some((w) => w.toLowerCase().includes(q));
        const inQuestions = s.guidedQuestions?.some((g) => g.toLowerCase().includes(q)) || false;
        return inTitle || inPrompt || inTag || inWords || inQuestions;
      });
    }

    return result;
  }, [allSparks, activeCategory, searchQuery, showOnlyFavorites, favoriteIds]);

  if (!isOpen) return null;

  const handleOpenSurpriseMe = () => {
    sounds.playCelebration();
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 },
    });

    const randomSpark = storySparksManager.getRandomSpark(activeCategory !== 'all' ? activeCategory : undefined);
    setSurpriseSpark(randomSpark);
    setIsSurpriseOpen(true);
    analytics.trackEvent('surprise_me_opened', 'Image Library', { sparkId: randomSpark.id });
  };

  const handleSurpriseStartWriting = (spark: StoryImage, withStarter: boolean) => {
    setIsSurpriseOpen(false);
    sounds.playPop();
    storySparksManager.recordSelection(spark.id);
    analytics.trackEvent('image_selected', 'Image Library', {
      imageId: spark.id,
      title: spark.title,
      source: 'surprise_me',
      withStarter,
    }, undefined, spark.id);
    onSelectImage(spark, withStarter ? 'starter' : 'look');
    onClose();
  };

  const handleCategorySelect = (catId: string, catName: string) => {
    sounds.playPop();
    setActiveCategory(catId);
    setShowOnlyFavorites(false);
    analytics.trackEvent('image_category_viewed', 'Image Library', { category: catId, categoryLabel: catName });
  };

  const handleSelectSpark = (spark: StoryImage, supportLevel?: 'look' | 'help' | 'starter') => {
    sounds.playPop();
    storySparksManager.recordSelection(spark.id);
    analytics.trackEvent('image_selected', 'Image Library', {
      imageId: spark.id,
      title: spark.title,
      supportLevel: supportLevel || 'starter',
    }, undefined, spark.id);
    onSelectImage(spark, supportLevel);
    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-5 bg-[#7D5A61]/45 backdrop-blur-sm animate-fadeIn">
        <div className="relative w-full max-w-6xl h-[92vh] max-h-[880px] bg-white rounded-[32px] sm:rounded-[44px] border-4 border-[#FFE4E9] shadow-2xl flex flex-col overflow-hidden">
          
          {/* Header Bar */}
          <div className="p-5 sm:p-6 pb-4 border-b border-[#FFE4E9] bg-gradient-to-r from-[#FFF5F7] via-white to-[#FFF0F3] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2.5">
                <span className="text-2xl sm:text-3xl">✨</span>
                <h2 className="text-2xl sm:text-3xl font-heading font-extrabold text-[#7D5A61]">
                  Find Your Story Spark
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-[#A89094] font-medium mt-1">
                Hundreds of pictures, situations and ideas waiting to become stories!
              </p>
            </div>

            {/* Actions: Surprise Me & Close */}
            <div className="flex items-center gap-3">
              <button
                onClick={handleOpenSurpriseMe}
                className="px-5 py-3 rounded-2xl bg-gradient-to-r from-[#FF8DA1] to-[#FF6B8B] hover:opacity-95 text-white font-heading font-extrabold text-xs sm:text-sm shadow-md hover:shadow-lg flex items-center gap-2 transition-all transform active:scale-95 cursor-pointer"
              >
                <Dice5 className="w-4 h-4 animate-spin-slow" />
                <span>🎲 Surprise Me!</span>
              </button>

              <button
                onClick={onClose}
                className="p-2.5 rounded-2xl bg-white hover:bg-[#FFF0F3] text-[#A89094] hover:text-[#7D5A61] border border-[#FFE4E9] transition-all cursor-pointer"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Search, Favorites & Category Filter Bar */}
          <div className="p-4 sm:p-5 border-b border-[#FFE4E9] bg-white space-y-3">
            <div className="flex flex-col sm:flex-row items-center gap-3">
              {/* Search Bar */}
              <div className="relative flex-1 w-full">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A89094]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search situations: secret door, runaway puppy, robot pancakes, treehouse, classroom..."
                  className="w-full pl-11 pr-12 py-2.5 text-xs sm:text-sm rounded-2xl bg-[#FFF9FA] border border-[#FFE4E9] focus:outline-none focus:border-[#FF8DA1] focus:bg-white text-[#7D5A61] placeholder-[#C4B5B8] transition-all"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-[#A89094] hover:text-[#7D5A61]"
                  >
                    Clear
                  </button>
                )}
              </div>

              {/* Favorites Filter Button */}
              <button
                onClick={() => setShowOnlyFavorites(!showOnlyFavorites)}
                className={`px-4 py-2.5 rounded-2xl text-xs font-bold border transition-all flex items-center gap-2 cursor-pointer ${
                  showOnlyFavorites
                    ? 'bg-rose-500 text-white border-rose-500 shadow-xs'
                    : 'bg-[#FFF5F7] text-[#7D5A61] hover:bg-[#FFE4E9] border-[#FFE4E9]'
                }`}
              >
                <Heart className={`w-3.5 h-3.5 ${showOnlyFavorites ? 'fill-current' : ''}`} />
                <span>Favorites ({favoriteIds.length})</span>
              </button>
            </div>

            {/* Horizontally Scrollable Situation Category Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              {IMAGE_CATEGORIES.map((cat) => {
                const isActive = activeCategory === cat.id && !showOnlyFavorites;
                return (
                  <button
                    key={cat.id}
                    onClick={() => handleCategorySelect(cat.id, cat.name)}
                    className={`px-3.5 py-2 rounded-2xl text-xs font-heading font-bold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
                      isActive
                        ? 'bg-[#FF8DA1] text-white shadow-xs'
                        : 'bg-[#FFF5F7] text-[#7D5A61] hover:bg-[#FFE4E9] border border-[#FFE4E9]'
                    }`}
                  >
                    <span className="text-base">{cat.emoji}</span>
                    <span>{cat.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sparks Grid Display */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[#FAF7F8]">
            {filteredSparks.length === 0 ? (
              <div className="text-center py-16 space-y-3">
                <span className="text-5xl">🔍</span>
                <h3 className="text-base font-heading font-extrabold text-[#7D5A61]">
                  No Story Sparks matched your search
                </h3>
                <p className="text-xs text-[#A89094] max-w-md mx-auto">
                  Try searching for words like "door", "school", "dragon", "friend", "mystery", or click "All Story Sparks" above!
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setActiveCategory('all');
                    setShowOnlyFavorites(false);
                  }}
                  className="px-5 py-2.5 rounded-2xl bg-white border border-[#FFE4E9] text-xs font-bold text-[#FF8DA1] hover:bg-[#FFF0F3] cursor-pointer shadow-xs"
                >
                  Reset Filters & View All
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                {filteredSparks.map((spark) => (
                  <StorySparkCard
                    key={spark.id}
                    spark={spark}
                    isSelected={selectedImageId === spark.id}
                    isFavorite={favoriteIds.includes(spark.id)}
                    onToggleFavorite={toggleFavorite}
                    onSelectSpark={handleSelectSpark}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Surprise Me Modal */}
      <SurpriseMeModal
        isOpen={isSurpriseOpen}
        spark={surpriseSpark}
        onClose={() => setIsSurpriseOpen(false)}
        onRollAgain={() => {
          const newRandom = storySparksManager.getRandomSpark(activeCategory !== 'all' ? activeCategory : undefined);
          setSurpriseSpark(newRandom);
        }}
        onStartWriting={handleSurpriseStartWriting}
      />
    </>
  );
};
