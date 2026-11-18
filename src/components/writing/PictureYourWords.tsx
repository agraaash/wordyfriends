import React, { useState, useRef, useEffect, useMemo } from 'react';
import { PhotoStory } from '../../types';
import { WritingFeedbackPanel } from './WritingFeedbackPanel';
import { SentenceBankModal } from './SentenceBankModal';
import { analyzeWriting } from '../../utils/writingFeedback';
import {
  Camera,
  Upload,
  Sparkles,
  Volume2,
  Save,
  Trash2,
  Heart,
  Send,
  RefreshCw,
  Image as ImageIcon,
  CheckCircle2,
  Lightbulb,
  X,
  Wand2,
  Scissors,
  ChevronDown,
  ChevronUp,
  BookOpen
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { speakWordOrSentence, stopSpeaking } from '../../utils/speech';
import { sounds } from '../../utils/sound';

const STORAGE_PHOTO_STORIES_KEY = 'pink_crayon_photo_stories_v1';

// Sample inspiring photos for kids to write about right away
const SAMPLE_INSPIRATIONS = [
  {
    id: 'sample-1',
    title: 'A Playful Golden Puppy in the Meadow',
    url: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=800&q=80',
    prompt: 'Look at the puppy’s joyful smile! Where do you think it is running to?',
    tag: 'Animals 🐶',
  },
  {
    id: 'sample-2',
    title: 'A Magical Treehouse in the Woods',
    url: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80',
    prompt: 'Who lives up in this cozy treehouse? What secret adventures happen inside?',
    tag: 'Adventure 🌲',
  },
  {
    id: 'sample-3',
    title: 'A Delicious Birthday Cake with Strawberries',
    url: 'https://images.unsplash.com/photo-1535141192574-5d4897c13136?auto=format&fit=crop&w=800&q=80',
    prompt: 'What special celebration is this for? How did it taste and smell?',
    tag: 'Celebration 🎂',
  },
  {
    id: 'sample-4',
    title: 'A Colorful Rainbow after the Rain',
    url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
    prompt: 'How did the sky change when the rainbow appeared? How did you feel looking at it?',
    tag: 'Nature 🌈',
  },
];

const WRITING_GUIDE_PROMPTS = [
  { id: 'p1', question: 'Why did you click or choose this picture?', starter: 'I chose this picture because...' },
  { id: 'p2', question: 'What did it make you feel when you saw it?', starter: 'Looking at this picture makes me feel...' },
  { id: 'p3', question: 'What sounds, smells, or colors do you notice?', starter: 'In this scene, I can notice...' },
  { id: 'p4', question: 'If this picture had a secret story, what is it?', starter: 'The secret story behind this is...' },
];

interface PictureYourWordsProps {
  onOpenEmailModal?: (title: string, content: string) => void;
}

export const PictureYourWords: React.FC<PictureYourWordsProps> = ({ onOpenEmailModal }) => {
  const [photoStories, setPhotoStories] = useState<PhotoStory[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_PHOTO_STORIES_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // Ignore
    }
    return [];
  });

  const [currentImage, setCurrentImage] = useState<string>(SAMPLE_INSPIRATIONS[0].url);
  const [storyTitle, setStoryTitle] = useState('My Sunny Adventure');
  const [storyText, setStoryText] = useState('');
  const [selectedPromptId, setSelectedPromptId] = useState('p1');
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isReadingAloud, setIsReadingAloud] = useState(false);
  const [viewMode, setViewMode] = useState<'create' | 'gallery'>('create');
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [isSentenceBankOpen, setIsSentenceBankOpen] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Dynamic Writing Feedback & Grammar Analysis
  const analysis = useMemo(() => {
    return analyzeWriting(storyText);
  }, [storyText]);

  // Save stories to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_PHOTO_STORIES_KEY, JSON.stringify(photoStories));
    } catch {
      // Ignore
    }
  }, [photoStories]);

  // Clean up camera stream on unmount
  useEffect(() => {
    return () => {
      stopCameraStream();
    };
  }, []);

  const stopCameraStream = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  };

  // Start Camera Stream
  const handleStartCamera = async () => {
    sounds.playPop();
    setCameraError(null);
    setIsCameraActive(true);

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera not supported in this browser.');
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (err: any) {
      console.error('Camera access error:', err);
      setCameraError('Could not access camera. Please allow camera permissions or upload an image.');
      setIsCameraActive(false);
    }
  };

  // Capture Photo from Camera
  const handleCapturePhoto = () => {
    sounds.playPop();
    if (!videoRef.current) return;

    try {
      const video = videoRef.current;
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
        setCurrentImage(dataUrl);
        stopCameraStream();
        setIsCameraActive(false);

        sounds.playCorrect();
        confetti({
          particleCount: 30,
          spread: 40,
          origin: { y: 0.6 },
          colors: ['#D8CEBE', '#C2A68C', '#E5A99B', '#F3D2C1'],
        });
      }
    } catch (err) {
      console.error('Photo capture error:', err);
    }
  };

  // Cancel Camera
  const handleCancelCamera = () => {
    sounds.playPop();
    stopCameraStream();
    setIsCameraActive(false);
  };

  // Handle Photo File Upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    sounds.playPop();
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setCurrentImage(event.target.result as string);
        sounds.playCorrect();
      }
    };
    reader.readAsDataURL(file);
  };

  // Apply Prompt Starter
  const handleApplyStarter = (promptItem: (typeof WRITING_GUIDE_PROMPTS)[0]) => {
    sounds.playPop();
    setSelectedPromptId(promptItem.id);
    if (!storyText.includes(promptItem.starter)) {
      setStoryText((prev) => {
        const trimmed = prev.trim();
        return trimmed ? `${trimmed}\n\n${promptItem.starter} ` : `${promptItem.starter} `;
      });
    }
  };

  const handleSelectSample = (sample: (typeof SAMPLE_INSPIRATIONS)[0]) => {
    sounds.playPop();
    setCurrentImage(sample.url);
    setStoryTitle(sample.title);
    setStoryText(`When I look at this picture, ${sample.prompt} `);
  };

  const handleInsertSentenceFromBank = (sentence: string) => {
    sounds.playCorrect();
    setStoryText((prev) => {
      const trimmed = prev.trim();
      return trimmed ? `${trimmed} ${sentence} ` : `${sentence} `;
    });
  };

  // Read Aloud Story
  const handleReadAloud = () => {
    sounds.playPop();
    if (!storyText.trim()) return;

    setIsReadingAloud(true);
    speakWordOrSentence(
      `${storyTitle}. ${storyText}`,
      false,
      () => {
        setIsReadingAloud(false);
      }
    );
  };

  // Save photo story
  const handleSavePhotoStory = () => {
    if (!storyText.trim()) return;

    sounds.playCorrect();
    const newStory: PhotoStory = {
      id: 'photo-story-' + Date.now(),
      title: storyTitle || 'My Photo Story',
      imageUrl: currentImage,
      reflectionText: storyText,
      promptsAnswered: [WRITING_GUIDE_PROMPTS.find((p) => p.id === selectedPromptId)?.question || ''],
      dateCreated: new Date().toLocaleDateString(),
    };

    setPhotoStories((prev) => [newStory, ...prev]);

    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#D8CEBE', '#C2A68C', '#E5A99B', '#F3D2C1', '#A68A78'],
      });
    } catch {
      // Ignore
    }
  };

  // Delete saved story
  const handleDeleteStory = (id: string) => {
    sounds.playPop();
    setPhotoStories((prev) => prev.filter((s) => s.id !== id));
  };

  // Email to NGO
  const handleEmailStory = () => {
    sounds.playPop();
    if (onOpenEmailModal) {
      onOpenEmailModal(
        storyTitle || 'My Photo Story',
        `Photo Story Title: ${storyTitle}\n\nStory / Reflection:\n${storyText}\n\nPrompt Answered: ${
          WRITING_GUIDE_PROMPTS.find((p) => p.id === selectedPromptId)?.question || ''
        }`
      );
    }
  };

  const wordCount = storyText.trim() ? storyText.trim().split(/\s+/).length : 0;
  const issuesCount = analysis.feedbackItems.length + analysis.sentenceRecommendations.filter((s) => s.isTooVerbose || s.hasRunOn).length;

  return (
    <div className="space-y-6 animate-fadeIn text-[#5C4E44]">
      {/* White and Beige Theme Header */}
      <div className="bg-[#FAF7F2] rounded-[32px] p-6 sm:p-8 border-3 border-[#EFEAE1] shadow-xs flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#E5DFD5] text-xs font-bold text-[#8C7B70]">
            <Sparkles className="w-3.5 h-3.5 text-[#C2A68C]" />
            <span>White & Beige Creative Canvas</span>
          </div>
          <h2 className="font-heading font-bold text-2xl sm:text-3xl text-[#5C4E44]">
            Picture Your Words 📷📝
          </h2>
          <p className="text-xs sm:text-sm text-[#8C7B70] max-w-xl leading-relaxed">
            Snap a photo with your camera or upload from your gallery! Reflect on why you clicked it, what it made you feel, and receive real writing & grammar coaching!
          </p>
        </div>

        {/* View Switcher */}
        <div className="flex bg-[#EFEAE1] rounded-2xl p-1 text-xs font-bold border border-[#E5DFD5]">
          <button
            onClick={() => {
              sounds.playPop();
              setViewMode('create');
            }}
            className={`px-4 py-2 rounded-xl transition-all cursor-pointer ${
              viewMode === 'create'
                ? 'bg-white text-[#5C4E44] shadow-xs'
                : 'text-[#8C7B70] hover:text-[#5C4E44]'
            }`}
          >
            Create Story
          </button>
          <button
            onClick={() => {
              sounds.playPop();
              setViewMode('gallery');
            }}
            className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
              viewMode === 'gallery'
                ? 'bg-white text-[#5C4E44] shadow-xs'
                : 'text-[#8C7B70] hover:text-[#5C4E44]'
            }`}
          >
            <span>My Photo Stories</span>
            {photoStories.length > 0 && (
              <span className="bg-[#C2A68C] text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                {photoStories.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {viewMode === 'create' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Photo View, Upload, Camera & Inspiration (5 Cols) */}
          <div className="lg:col-span-5 space-y-4">
            {/* Active Selected Photo Frame (Beige & White styling) */}
            <div className="bg-white rounded-[28px] p-4 border-2 border-[#EFEAE1] shadow-xs space-y-3">
              <div className="relative aspect-4/3 rounded-2xl overflow-hidden bg-[#FAF7F2] border border-[#EFEAE1] group">
                <img
                  src={currentImage}
                  alt="Story inspiration"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-103"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-2 right-2 bg-black/50 backdrop-blur-xs text-white text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                  <ImageIcon className="w-3 h-3" />
                  <span>Current Picture</span>
                </div>
              </div>

              {/* Photo Action Buttons: Camera & Upload */}
              <div className="grid grid-cols-2 gap-2.5 pt-1">
                <button
                  onClick={handleStartCamera}
                  className="px-3.5 py-2.5 rounded-xl bg-[#F4EFE6] hover:bg-[#EAE2D5] text-[#5C4E44] font-bold text-xs border border-[#E5DFD5] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Camera className="w-4 h-4 text-[#8C7B70]" />
                  <span>Click Camera</span>
                </button>

                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] hover:bg-[#F4EFE6] text-[#5C4E44] font-bold text-xs border border-[#E5DFD5] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Upload className="w-4 h-4 text-[#8C7B70]" />
                  <span>Upload Gallery</span>
                </button>

                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept="image/*"
                  className="hidden"
                />
              </div>

              {cameraError && (
                <p className="text-[11px] text-amber-700 bg-amber-50 p-2 rounded-xl border border-amber-200">
                  {cameraError}
                </p>
              )}
            </div>

            {/* Quick Sample Inspirations & 200 Sentences Starter Bank */}
            <div className="bg-white rounded-[28px] p-4 sm:p-5 border-2 border-[#EFEAE1] shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-[#8C7B70] flex items-center gap-1.5">
                  <Lightbulb className="w-3.5 h-3.5 text-[#C2A68C]" />
                  <span>Pick a Sample Picture</span>
                </span>
                <button
                  onClick={() => {
                    sounds.playPop();
                    setIsSentenceBankOpen(true);
                  }}
                  className="text-[11px] font-bold text-[#8C7B70] hover:text-[#5C4E44] underline flex items-center gap-1 cursor-pointer"
                >
                  <BookOpen className="w-3 h-3 text-[#C2A68C]" />
                  <span>200 Sentences</span>
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                {SAMPLE_INSPIRATIONS.map((sample) => (
                  <button
                    key={sample.id}
                    onClick={() => handleSelectSample(sample)}
                    className="p-2 rounded-2xl bg-[#FAF7F2] border border-[#EFEAE1] hover:border-[#C2A68C] hover:bg-[#F4EFE6] transition-all text-left group cursor-pointer"
                  >
                    <div className="aspect-video rounded-xl overflow-hidden mb-1.5 bg-[#EFEAE1]">
                      <img
                        src={sample.url}
                        alt={sample.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <span className="text-[10px] font-bold text-[#5C4E44] block line-clamp-1">
                      {sample.tag}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Writing Editor & Prompts (7 Cols) */}
          <div className="lg:col-span-7 space-y-4">
            {/* Guided Reflection Prompts */}
            <div className="bg-white rounded-[28px] p-5 border-2 border-[#EFEAE1] shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-[#8C7B70] flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-[#C2A68C]" />
                  <span>Inspiring Questions & Prompts</span>
                </span>
                <span className="text-[11px] text-[#8C7B70]">Click to add starter</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {WRITING_GUIDE_PROMPTS.map((promptItem) => (
                  <button
                    key={promptItem.id}
                    onClick={() => handleApplyStarter(promptItem)}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                      selectedPromptId === promptItem.id
                        ? 'bg-[#FAF7F2] border-[#C2A68C] text-[#5C4E44] shadow-xs'
                        : 'bg-white border-[#EFEAE1] hover:border-[#D8CEBE] text-[#8C7B70]'
                    }`}
                  >
                    <p className="text-xs font-bold mb-1 text-[#5C4E44]">
                      {promptItem.question}
                    </p>
                    <span className="text-[11px] text-[#8C7B70] italic">
                      "{promptItem.starter}"
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Story Editor Canvas */}
            <div className="bg-white rounded-[28px] p-6 border-2 border-[#EFEAE1] shadow-xs space-y-4">
              {/* Story Title */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8C7B70] mb-1">
                  Story Title
                </label>
                <input
                  type="text"
                  value={storyTitle}
                  onChange={(e) => setStoryTitle(e.target.value)}
                  placeholder="Give your picture story a fun name..."
                  className="w-full px-4 py-2.5 text-sm font-bold rounded-2xl bg-[#FAF7F2] border border-[#EFEAE1] focus:outline-none focus:border-[#C2A68C] text-[#5C4E44]"
                />
              </div>

              {/* Story Content Area */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8C7B70]">
                    Your Words & Reflections
                  </label>
                  <span className="text-[11px] font-semibold text-[#8C7B70]">
                    {wordCount} words • {analysis.totalSentences} sentences
                  </span>
                </div>

                <textarea
                  rows={8}
                  value={storyText}
                  onChange={(e) => setStoryText(e.target.value)}
                  placeholder="Describe your photo! Why did you click it? What feelings, colors, or sounds come to your mind?"
                  className="w-full px-4 py-3 text-sm rounded-2xl bg-[#FAF7F2] border border-[#EFEAE1] focus:outline-none focus:border-[#C2A68C] text-[#5C4E44] leading-relaxed resize-none"
                />
              </div>

              {/* Writing Helper & Feedback Quick Bar */}
              <div className="p-3.5 rounded-2xl bg-[#FAF7F2] border border-[#EFEAE1] flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="font-heading font-bold text-[#5C4E44] flex items-center gap-1">
                    <span>Writing Helper:</span>
                  </span>

                  <span
                    className={`flex items-center gap-1 font-medium ${
                      analysis.grammarScore >= 90 ? 'text-emerald-700' : 'text-amber-700'
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Grammar: {analysis.grammarScore}%</span>
                  </span>

                  <span
                    className={`flex items-center gap-1 font-medium ${
                      analysis.simplicityScore >= 80 ? 'text-emerald-700' : 'text-purple-700'
                    }`}
                  >
                    <Scissors className="w-3.5 h-3.5" />
                    <span>Avg Length: {analysis.avgSentenceLength}w</span>
                  </span>
                </div>

                {/* Open Coach Feedback Drawer Button */}
                <button
                  onClick={() => {
                    sounds.playPop();
                    setIsFeedbackOpen(!isFeedbackOpen);
                  }}
                  className={`px-3.5 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                    isFeedbackOpen
                      ? 'bg-[#5C4E44] text-white'
                      : issuesCount > 0
                      ? 'bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300'
                      : 'bg-white hover:bg-[#F4EFE6] text-[#5C4E44] border border-[#EFEAE1]'
                  }`}
                >
                  <Wand2 className="w-3.5 h-3.5 text-[#C2A68C]" />
                  <span>
                    {isFeedbackOpen
                      ? 'Hide Writing Coach'
                      : issuesCount > 0
                      ? `Writing Coach (${issuesCount} Tips)`
                      : 'Writing Coach'}
                  </span>
                  {isFeedbackOpen ? (
                    <ChevronUp className="w-3.5 h-3.5" />
                  ) : (
                    <ChevronDown className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>

              {/* Expandable Writing Coach Feedback Panel */}
              {isFeedbackOpen && (
                <WritingFeedbackPanel
                  analysis={analysis}
                  currentText={storyText}
                  onUpdateText={setStoryText}
                  onClose={() => setIsFeedbackOpen(false)}
                  isInline={true}
                />
              )}

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#EFEAE1]">
                <div className="flex items-center gap-2">
                  {/* Read Aloud */}
                  <button
                    onClick={handleReadAloud}
                    disabled={!storyText.trim()}
                    className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      isReadingAloud
                        ? 'bg-[#C2A68C] text-white border-[#C2A68C]'
                        : 'bg-[#FAF7F2] text-[#5C4E44] border-[#EFEAE1] hover:bg-[#F4EFE6] disabled:opacity-40'
                    }`}
                  >
                    <Volume2 className="w-3.5 h-3.5 text-[#8C7B70]" />
                    <span>{isReadingAloud ? 'Reading...' : 'Listen Story'}</span>
                  </button>

                  {/* Email to NGO */}
                  <button
                    onClick={handleEmailStory}
                    disabled={!storyText.trim()}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-[#FAF7F2] text-[#5C4E44] border border-[#EFEAE1] text-xs font-bold transition-colors disabled:opacity-40 cursor-pointer"
                    title="Send to The Write Magic NGO"
                  >
                    <Send className="w-3.5 h-3.5 text-[#C2A68C]" />
                    <span>Email to NGO</span>
                  </button>
                </div>

                {/* Save to Gallery */}
                <button
                  onClick={handleSavePhotoStory}
                  disabled={!storyText.trim()}
                  className="px-6 py-2.5 rounded-2xl bg-[#C2A68C] hover:bg-[#A68A78] text-white font-bold text-xs shadow-xs transition-transform hover:scale-102 disabled:opacity-40 flex items-center gap-1.5 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Save to Stories</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Saved Photo Stories Gallery */
        <div className="space-y-4">
          {photoStories.length === 0 ? (
            <div className="bg-white rounded-[32px] p-12 text-center border-2 border-[#EFEAE1] space-y-3">
              <div className="w-16 h-16 rounded-full bg-[#FAF7F2] border border-[#EFEAE1] flex items-center justify-center text-3xl mx-auto">
                📸
              </div>
              <h3 className="font-heading font-bold text-lg text-[#5C4E44]">
                No Photo Stories Yet!
              </h3>
              <p className="text-xs text-[#8C7B70] max-w-sm mx-auto leading-relaxed">
                Click the "Create Story" tab above to click a photo or choose an inspiring picture and write your very first reflection.
              </p>
              <button
                onClick={() => {
                  sounds.playPop();
                  setViewMode('create');
                }}
                className="px-6 py-2.5 rounded-2xl bg-[#C2A68C] hover:bg-[#A68A78] text-white font-bold text-xs shadow-xs cursor-pointer"
              >
                Create My First Photo Story
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {photoStories.map((story) => (
                <div
                  key={story.id}
                  className="bg-white rounded-[28px] p-5 border-2 border-[#EFEAE1] shadow-xs flex flex-col justify-between space-y-4 hover:border-[#C2A68C] transition-all"
                >
                  <div className="space-y-3">
                    <div className="aspect-16/9 rounded-2xl overflow-hidden bg-[#FAF7F2] border border-[#EFEAE1]">
                      <img
                        src={story.imageUrl}
                        alt={story.title}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <h4 className="font-heading font-bold text-base text-[#5C4E44]">
                        {story.title}
                      </h4>
                      <span className="text-[10px] text-[#8C7B70] font-semibold bg-[#FAF7F2] px-2.5 py-1 rounded-full border border-[#EFEAE1]">
                        {story.dateCreated}
                      </span>
                    </div>

                    {story.promptsAnswered?.[0] && (
                      <p className="text-[11px] font-bold text-[#8C7B70] italic">
                        Prompt: "{story.promptsAnswered[0]}"
                      </p>
                    )}

                    <p className="text-xs text-[#5C4E44] leading-relaxed whitespace-pre-line bg-[#FAF7F2] p-3.5 rounded-xl border border-[#EFEAE1]">
                      {story.reflectionText}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-[#EFEAE1]">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          sounds.playPop();
                          speakWordOrSentence(story.reflectionText, false);
                        }}
                        className="p-2 rounded-xl bg-[#FAF7F2] hover:bg-[#F4EFE6] text-[#5C4E44] border border-[#EFEAE1] transition-colors cursor-pointer"
                        title="Listen to story"
                      >
                        <Volume2 className="w-4 h-4 text-[#8C7B70]" />
                      </button>

                      <button
                        onClick={() => {
                          if (onOpenEmailModal) {
                            onOpenEmailModal(
                              story.title,
                              `Photo Story: ${story.title}\n\n${story.reflectionText}`
                            );
                          }
                        }}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white hover:bg-[#FAF7F2] text-[#5C4E44] border border-[#EFEAE1] text-xs font-bold transition-colors cursor-pointer"
                        title="Email to The Write Magic"
                      >
                        <Send className="w-3 h-3 text-[#C2A68C]" />
                        <span>Email NGO</span>
                      </button>
                    </div>

                    <button
                      onClick={() => handleDeleteStory(story.id)}
                      className="p-2 rounded-xl text-rose-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                      title="Delete story"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Camera Live Modal Overlay */}
      {isCameraActive && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-[32px] p-6 max-w-lg w-full border-3 border-[#EFEAE1] shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#EFEAE1] pb-3">
              <div className="flex items-center gap-2">
                <Camera className="w-5 h-5 text-[#8C7B70]" />
                <h3 className="font-heading font-bold text-lg text-[#5C4E44]">
                  Snap Your Picture 📷
                </h3>
              </div>
              <button
                onClick={handleCancelCamera}
                className="p-1 rounded-full text-stone-400 hover:text-stone-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="relative aspect-4/3 rounded-2xl overflow-hidden bg-stone-900 border-2 border-[#EFEAE1]">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={handleCancelCamera}
                className="px-5 py-2.5 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-600 font-bold text-xs transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleCapturePhoto}
                className="px-6 py-2.5 rounded-2xl bg-[#C2A68C] hover:bg-[#A68A78] text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer"
              >
                <Camera className="w-4 h-4" />
                <span>Snap Photo</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sentence Bank Modal */}
      <SentenceBankModal
        isOpen={isSentenceBankOpen}
        onClose={() => setIsSentenceBankOpen(false)}
        onSelectSentence={handleInsertSentenceFromBank}
      />
    </div>
  );
};
