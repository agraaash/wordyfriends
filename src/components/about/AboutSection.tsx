import React from 'react';
import {
  Sparkles,
  Heart,
  BookOpen,
  Mail,
  ExternalLink,
  Users,
  Award,
  Globe,
  Feather,
  Lightbulb,
  CheckCircle2,
  Smile
} from 'lucide-react';
import { sounds } from '../../utils/sound';

interface AboutSectionProps {
  onOpenEmailModal: (defaultTitle: string, defaultContent: string) => void;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ onOpenEmailModal }) => {
  const ngoWebsite = 'https://thewritemagic2022.wixsite.com/website';
  const ngoEmail = 'aashnaagrawal1200@gmail.com';

  const handleContactFounder = () => {
    sounds.playPop();
    onOpenEmailModal(
      'Message / Question for The Write Magic',
      'Hi Aashna,\n\nI love learning English and writing stories with The Write Magic and WordyFriends!\n\nHere is what I would like to share or ask:\n'
    );
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn">
      {/* Hero Banner with Pastel Warm Magic */}
      <div className="bg-gradient-to-br from-white via-[#FFF9FA] to-[#FFF0F3] rounded-[36px] p-8 sm:p-12 border-4 border-[#FFE4E9] shadow-sm relative overflow-hidden text-center md:text-left">
        {/* Background playful stars */}
        <div className="absolute top-4 right-8 text-3xl opacity-30 select-none animate-pulse">✨</div>
        <div className="absolute bottom-6 right-16 text-4xl opacity-20 select-none">✍️</div>
        <div className="absolute top-1/2 right-1/4 text-2xl opacity-20 select-none">🌟</div>

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFF0F3] border border-[#FFE4E9] text-xs font-bold text-[#FF8DA1]">
              <Sparkles className="w-3.5 h-3.5 text-[#FF8DA1]" />
              <span>Youth Empowerment NGO</span>
            </div>

            <h1 className="font-heading font-bold text-3xl sm:text-4xl text-[#7D5A61] leading-tight">
              The Write Magic 📖✨
            </h1>

            <p className="text-sm sm:text-base text-[#5D4A4F] leading-relaxed">
              <strong>The Write Magic</strong> is a youth-led educational NGO founded by <strong>Aashna Agrawal</strong> in 2022. Our heartfelt mission is to nurture the creative spark in children through imaginative writing, expressive speaking, and vocabulary enrichment.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <a
                href={ngoWebsite}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[#FFB6C1] hover:bg-[#FF8DA1] text-white font-bold text-xs shadow-xs transition-transform hover:scale-102 cursor-pointer"
              >
                <span>Visit Official Website</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <button
                onClick={handleContactFounder}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-white hover:bg-[#FFF0F3] text-[#7D5A61] border border-[#FFE4E9] font-bold text-xs shadow-xs transition-colors cursor-pointer"
              >
                <Mail className="w-3.5 h-3.5 text-[#FF8DA1]" />
                <span>Contact Founder</span>
              </button>
            </div>
          </div>

          {/* Logo / Mascot Badge */}
          <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-3xl bg-white border-4 border-[#FFD1DC] shadow-md flex flex-col items-center justify-center p-4 text-center transform rotate-1 hover:rotate-0 transition-transform">
            <div className="w-16 h-16 rounded-2xl bg-[#FFF0F3] border border-[#FFE4E9] flex items-center justify-center text-3xl mb-2">
              🪄
            </div>
            <span className="font-heading font-bold text-xs text-[#7D5A61] block">
              The Write Magic
            </span>
            <span className="text-[10px] text-[#A89094] font-medium">
              Est. 2022
            </span>
          </div>
        </div>
      </div>

      {/* Mission & Core Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white rounded-3xl p-6 border-2 border-[#FFE4E9] shadow-xs space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-[#FFF0F3] text-[#FF8DA1] flex items-center justify-center text-2xl border border-[#FFE4E9]">
            🖍️
          </div>
          <h3 className="font-heading font-bold text-base text-[#7D5A61]">
            Creative Expression
          </h3>
          <p className="text-xs text-[#A89094] leading-relaxed">
            Every child is an innate storyteller. We provide friendly prompts, picture stories, and open canvases that let their imagination run free.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 border-2 border-[#FFE4E9] shadow-xs space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-[#FFF0F3] text-[#FF8DA1] flex items-center justify-center text-2xl border border-[#FFE4E9]">
            🗣️
          </div>
          <h3 className="font-heading font-bold text-base text-[#7D5A61]">
            Confident Speaking
          </h3>
          <p className="text-xs text-[#A89094] leading-relaxed">
            From reading rhythmic stories aloud to describing colorful cartoon situations, we help children speak clearly and comfortably.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 border-2 border-[#FFE4E9] shadow-xs space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-[#FFF0F3] text-[#FF8DA1] flex items-center justify-center text-2xl border border-[#FFE4E9]">
            📚
          </div>
          <h3 className="font-heading font-bold text-base text-[#7D5A61]">
            Vocabulary Growth
          </h3>
          <p className="text-xs text-[#A89094] leading-relaxed">
            Gentle clues, simple definitions, and a personal Vocabulary Diary make learning new words fun, rewarding, and pressure-free.
          </p>
        </div>
      </div>

      {/* Meet the Founder & Story of The Write Magic */}
      <div className="bg-white rounded-[32px] p-6 sm:p-8 border-2 border-[#FFE4E9] shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#FFE4E9] pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#FFF0F3] border border-[#FFE4E9] flex items-center justify-center text-2xl">
              👩‍🏫
            </div>
            <div>
              <h2 className="font-heading font-bold text-xl text-[#7D5A61]">
                Aashna Agrawal
              </h2>
              <p className="text-xs text-[#A89094]">
                Founder & Director, The Write Magic
              </p>
            </div>
          </div>

          <button
            onClick={handleContactFounder}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#FFF0F3] hover:bg-[#FFE4E9] text-[#7D5A61] border border-[#FFE4E9] font-bold text-xs transition-colors cursor-pointer"
          >
            <Mail className="w-3.5 h-3.5 text-[#FF8DA1]" />
            <span>Send Email to Aashna</span>
          </button>
        </div>

        <div className="space-y-4 text-xs sm:text-sm text-[#5D4A4F] leading-relaxed">
          <p>
            "I started <strong>The Write Magic</strong> in 2022 to give children a platform where writing isn't seen as a chore or an exam requirement, but as a superpower. When young minds find the joy of playing with words, discovering new feelings, and putting thoughts onto paper, they build confidence that lasts a lifetime."
          </p>
          <p>
            Through workshops, interactive story prompts, community reading circles, and digital companions like this app, The Write Magic strives to make quality English education accessible, warm, and inspiring for every child.
          </p>
        </div>

        {/* Highlights & Initiatives */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <div className="p-3.5 rounded-2xl bg-[#FFF9FA] border border-[#FFE4E9] flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-[#FF8DA1] mt-0.5 flex-shrink-0" />
            <div>
              <span className="font-bold text-xs text-[#7D5A61] block">
                Story Circles & Workshops
              </span>
              <span className="text-[11px] text-[#A89094]">
                Engaging interactive sessions helping kids write their first mini-books.
              </span>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#FFF9FA] border border-[#FFE4E9] flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-[#FF8DA1] mt-0.5 flex-shrink-0" />
            <div>
              <span className="font-bold text-xs text-[#7D5A61] block">
                Community Story Exchanges
              </span>
              <span className="text-[11px] text-[#A89094]">
                Young writers submit their work to get personal encouragement and notes.
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Get in Touch / Submit Writing Callout */}
      <div className="bg-gradient-to-r from-[#FFF0F3] via-white to-[#FFF0F3] rounded-[32px] p-6 sm:p-8 border-3 border-[#FFD1DC] text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-white border-2 border-[#FFD1DC] flex items-center justify-center text-2xl mx-auto shadow-xs">
          💌
        </div>
        <div className="space-y-1 max-w-lg mx-auto">
          <h3 className="font-heading font-bold text-xl text-[#7D5A61]">
            Have a Question or Story to Share?
          </h3>
          <p className="text-xs text-[#A89094] leading-relaxed">
            We love hearing from young authors, parents, and educators! Send your photo stories, questions, or comments directly to Aashna at{' '}
            <strong className="text-[#7D5A61]">{ngoEmail}</strong>.
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={handleContactFounder}
            className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-[#FFB6C1] hover:bg-[#FF8DA1] text-white font-bold text-xs shadow-xs transition-transform hover:scale-102 flex items-center justify-center gap-2 cursor-pointer"
          >
            <Mail className="w-4 h-4" />
            <span>Open Email Writer</span>
          </button>

          <a
            href={ngoWebsite}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-white hover:bg-[#FFF0F3] text-[#7D5A61] border border-[#FFE4E9] font-bold text-xs shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <Globe className="w-4 h-4 text-[#FF8DA1]" />
            <span>Visit thewritemagic2022 website</span>
          </a>
        </div>
      </div>
    </div>
  );
};
