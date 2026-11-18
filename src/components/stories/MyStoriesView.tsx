import React, { useState } from 'react';
import { SavedStory } from '../../types';
import { Sparkles, BookOpen, Volume2, VolumeX, Send, Trash2, Edit3, Calendar, FileText, Heart } from 'lucide-react';
import { speakWordOrSentence } from '../../utils/speech';
import { sounds } from '../../utils/sound';
import { analytics } from '../../utils/analyticsTracker';

interface MyStoriesViewProps {
  savedStories: SavedStory[];
  onSelectStoryToEdit: (story: SavedStory) => void;
  onShareStoryToAashna: (story: SavedStory) => void;
  onDeleteStory: (storyId: string) => void;
  onStartNewStory: () => void;
}

export const MyStoriesView: React.FC<MyStoriesViewProps> = ({
  savedStories,
  onSelectStoryToEdit,
  onShareStoryToAashna,
  onDeleteStory,
  onStartNewStory,
}) => {
  const [speakingStoryId, setSpeakingStoryId] = useState<string | null>(null);

  const handleReadAloud = (story: SavedStory) => {
    if (speakingStoryId === story.id) {
      window.speechSynthesis?.cancel();
      setSpeakingStoryId(null);
      return;
    }

    setSpeakingStoryId(story.id);
    const fullText = `${story.title}. ${story.content}`;
    speakWordOrSentence(fullText, false, () => {
      setSpeakingStoryId(null);
    });
  };

  const handleDelete = (story: SavedStory) => {
    if (window.confirm(`Are you sure you want to remove "${story.title}"?`)) {
      sounds.playPop();
      analytics.trackEvent('story_deleted', 'My Stories', { title: story.title, storyId: story.id });
      onDeleteStory(story.id);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fadeIn pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-[#FFF0F3] via-white to-[#FFE4E9] rounded-[36px] border-4 border-[#FFE4E9] p-6 sm:p-8 shadow-md">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-3xl bg-white border-2 border-[#FFB6C1] shadow-xs flex items-center justify-center text-3xl">
            📚
          </div>
          <div>
            <h2 className="text-2xl sm:text-3xl font-heading font-extrabold text-[#7D5A61]">
              My Stories Bookshelf
            </h2>
            <p className="text-xs sm:text-sm text-[#A89094] font-medium mt-0.5">
              {savedStories.length} magical {savedStories.length === 1 ? 'story' : 'stories'} written & saved
            </p>
          </div>
        </div>

        <button
          onClick={onStartNewStory}
          className="px-5 py-3 rounded-2xl bg-[#FF8DA1] hover:bg-[#FF6B8B] text-white font-heading font-extrabold text-sm shadow-md transition-all flex items-center gap-2 cursor-pointer active:scale-95"
        >
          <Sparkles className="w-4 h-4" />
          <span>Write New Story ✨</span>
        </button>
      </div>

      {/* Stories Grid or Empty State */}
      {savedStories.length === 0 ? (
        <div className="bg-white rounded-[36px] border-4 border-[#FFE4E9] p-12 text-center space-y-4 shadow-xl">
          <span className="text-5xl block">📖</span>
          <h3 className="text-xl font-heading font-extrabold text-[#7D5A61]">
            Your Bookshelf is Waiting for Its First Story!
          </h3>
          <p className="text-xs sm:text-sm text-[#A89094] max-w-md mx-auto">
            Choose any of the 150+ picture sparks in the Write tab to start your writing adventure today.
          </p>
          <button
            onClick={onStartNewStory}
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-[#FF8DA1] to-[#FF6B8B] text-white font-bold text-sm shadow-md cursor-pointer"
          >
            ✨ Start Your First Story
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {savedStories.map((story) => {
            const isSpeaking = speakingStoryId === story.id;
            const wordCount = story.content.split(/\s+/).filter(Boolean).length;

            return (
              <div
                key={story.id}
                className="bg-white rounded-[32px] border-3 border-[#FFE4E9] hover:border-[#FFB6C1] p-6 shadow-md hover:shadow-xl transition-all flex flex-col justify-between space-y-4 group"
              >
                <div className="space-y-3">
                  {/* Image & Header meta */}
                  <div className="flex items-start gap-4">
                    {story.imageUrl && (
                      <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-[#FFE4E9] flex-shrink-0 shadow-2xs">
                        <img
                          src={story.imageUrl}
                          alt={story.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 text-[10px] font-bold text-[#A89094] mb-1">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-[#FF8DA1]" />
                          {story.date}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <FileText className="w-3 h-3 text-[#FF8DA1]" />
                          {wordCount} words
                        </span>
                      </div>
                      <h3 className="text-lg font-heading font-extrabold text-[#7D5A61] line-clamp-1 group-hover:text-[#FF6B8B] transition-colors">
                        {story.title}
                      </h3>
                      <p className="text-[11px] text-[#A89094] italic truncate">
                        Prompt: {story.promptTitle || 'Magical Picture Spark'}
                      </p>
                    </div>
                  </div>

                  {/* Story excerpt */}
                  <div className="p-4 rounded-2xl bg-[#FFF9FA] border border-[#FFE4E9] text-xs text-[#7D5A61] leading-relaxed line-clamp-4 font-sans">
                    {story.content}
                  </div>
                </div>

                {/* Actions bottom bar */}
                <div className="flex items-center justify-between gap-2 pt-3 border-t border-[#FFF0F3]">
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleReadAloud(story)}
                      className={`p-2.5 rounded-xl border text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                        isSpeaking
                          ? 'bg-amber-100 border-amber-300 text-amber-800 animate-pulse'
                          : 'bg-white border-[#FFE4E9] hover:bg-[#FFF0F3] text-[#7D5A61]'
                      }`}
                      title="Read aloud"
                    >
                      {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-[#FF8DA1]" />}
                      <span className="text-[11px]">{isSpeaking ? 'Stop' : 'Listen'}</span>
                    </button>

                    <button
                      onClick={() => onShareStoryToAashna(story)}
                      className="px-3 py-2 rounded-xl bg-[#FFF0F3] hover:bg-[#FFE4E9] text-[#FF6B8B] text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                      title="Send to Aashna"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span className="text-[11px]">Send to Aashna 💌</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onSelectStoryToEdit(story)}
                      className="p-2 rounded-xl bg-white hover:bg-[#FFF0F3] text-[#A89094] hover:text-[#7D5A61] border border-[#FFE4E9] transition-all cursor-pointer"
                      title="Edit story"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => handleDelete(story)}
                      className="p-2 rounded-xl bg-white hover:bg-rose-50 text-[#A89094] hover:text-rose-600 border border-[#FFE4E9] transition-all cursor-pointer"
                      title="Delete story"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
