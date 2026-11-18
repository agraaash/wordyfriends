import React, { useState } from 'react';
import { RAW_200_SENTENCES, RawSentenceItem } from '../../data/rawSentencesData';
import {
  Search,
  Sparkles,
  Volume2,
  PlusCircle,
  BookOpen,
  Filter,
  Check,
  X,
  ArrowRight,
  Lightbulb,
} from 'lucide-react';
import { speakWordOrSentence } from '../../utils/speech';
import { sounds } from '../../utils/sound';

interface SentenceBankModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectSentence: (sentence: string) => void;
}

export const SentenceBankModal: React.FC<SentenceBankModalProps> = ({
  isOpen,
  onClose,
  onSelectSentence,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [playingId, setPlayingId] = useState<number | null>(null);
  const [copiedId, setCopiedId] = useState<number | null>(null);

  if (!isOpen) return null;

  const categories = [
    { id: 'all', label: 'All 200 Sentences', icon: '📚' },
    { id: 'feelings', label: 'Feelings', icon: '💖' },
    { id: 'school', label: 'School & Friends', icon: '🎒' },
    { id: 'nature', label: 'Nature & Pets', icon: '🐾' },
    { id: 'magic', label: 'Adventures & Magic', icon: '✨' },
    { id: 'food', label: 'Food & Meals', icon: '🧁' },
  ];

  const filteredSentences = RAW_200_SENTENCES.filter((item) => {
    const fullSentence = item.sentence.replace(/_{3,}/g, item.correctAnswer);
    const matchesQuery =
      fullSentence.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.correctAnswer.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === 'all' || item.category === selectedCategory;

    return matchesQuery && matchesCategory;
  });

  const handleSpeak = (item: RawSentenceItem, e: React.MouseEvent) => {
    e.stopPropagation();
    sounds.playPop();
    setPlayingId(item.id);
    const full = item.sentence.replace(/_{3,}/g, item.correctAnswer);
    speakWordOrSentence(full, false, () => {
      setPlayingId(null);
    });
  };

  const handleInsert = (item: RawSentenceItem) => {
    sounds.playCorrect();
    const full = item.sentence.replace(/_{3,}/g, item.correctAnswer);
    setCopiedId(item.id);
    setTimeout(() => {
      onSelectSentence(full);
      onClose();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fadeIn">
      <div className="bg-[#FFFBF7] border-4 border-[#FED7AA] w-full max-w-4xl rounded-3xl p-6 shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#FDE68A]">
          <div className="flex items-center gap-3">
            <span className="p-3 bg-amber-100 rounded-2xl text-2xl">📖</span>
            <div>
              <h2 className="text-2xl font-bold text-[#78350F] flex items-center gap-2">
                <span>Sentence Starter Library</span>
                <span className="text-xs bg-amber-200 text-amber-900 px-2.5 py-0.5 rounded-full font-bold">
                  200 Ideas
                </span>
              </h2>
              <p className="text-xs text-[#92400E]">
                Pick any real sentence to start your story, practice expanding it, or spark your imagination!
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-stone-600 hover:bg-stone-100 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Search & Category Filter Bar */}
        <div className="py-4 space-y-3">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <input
              type="text"
              placeholder="Search by words, emotions (e.g., 'bicycle', 'proud', 'puppy', 'worried')..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border-2 border-[#FED7AA] rounded-2xl text-sm text-[#78350F] placeholder-stone-400 focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Category Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  sounds.playPop();
                  setSelectedCategory(cat.id);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-[#78350F] text-white shadow-xs'
                    : 'bg-white border border-[#FED7AA] text-[#78350F] hover:bg-amber-50'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Sentence Grid */}
        <div className="flex-1 overflow-y-auto pr-1 space-y-2.5 my-2">
          {filteredSentences.length === 0 ? (
            <div className="text-center py-12 text-stone-400">
              <p className="text-3xl mb-2">🔍</p>
              <p className="font-semibold text-sm">No matching sentences found.</p>
              <p className="text-xs mt-1">Try another search keyword or select "All 200 Sentences".</p>
            </div>
          ) : (
            filteredSentences.map((item) => {
              const fullSentence = item.sentence.replace(/_{3,}/g, item.correctAnswer);
              const isPlaying = playingId === item.id;
              const isCopied = copiedId === item.id;

              return (
                <div
                  key={item.id}
                  onClick={() => handleInsert(item)}
                  className={`group bg-white border-2 border-[#FED7AA] hover:border-amber-400 rounded-2xl p-4 transition-all hover:shadow-xs flex items-center justify-between gap-4 cursor-pointer ${
                    isCopied ? 'bg-amber-50 border-amber-500' : ''
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-2xl pt-0.5 flex-shrink-0">{item.emoji || '✨'}</span>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-bold uppercase text-amber-700 bg-amber-100 px-2 py-0.5 rounded-md">
                          Clue #{item.id}
                        </span>
                        <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                          Word: {item.correctAnswer}
                        </span>
                      </div>
                      <p className="text-sm font-medium text-[#5D4A4F] leading-relaxed">
                        {fullSentence}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
                    {/* Read Aloud Button */}
                    <button
                      onClick={(e) => handleSpeak(item, e)}
                      className={`p-2 rounded-xl border transition-all cursor-pointer ${
                        isPlaying
                          ? 'bg-amber-500 text-white border-amber-500'
                          : 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-amber-50 hover:text-amber-700'
                      }`}
                      title="Read aloud"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>

                    {/* Use in Story Button */}
                    <button
                      onClick={() => handleInsert(item)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                        isCopied
                          ? 'bg-emerald-600 text-white'
                          : 'bg-[#78350F] text-white hover:bg-amber-900 shadow-xs'
                      }`}
                    >
                      {isCopied ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Inserted!</span>
                        </>
                      ) : (
                        <>
                          <PlusCircle className="w-3.5 h-3.5" />
                          <span>Use as Starter</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-[#FDE68A] flex items-center justify-between text-xs text-[#92400E]">
          <span>Showing {filteredSentences.length} of 200 sentence ideas</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold rounded-xl transition-colors cursor-pointer"
          >
            Close Library
          </button>
        </div>
      </div>
    </div>
  );
};
