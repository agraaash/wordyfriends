import { CategoryInfo, SentenceChallenge } from '../types';
import { ALL_SENTENCE_CHALLENGES } from './rawSentencesData';

export const VOCABULARY_CATEGORIES: CategoryInfo[] = [
  {
    id: 'all',
    name: 'All Puzzles (200 Sentences)',
    description: 'Mix of every fun detective mystery from our full sentence library!',
    emoji: '🔍',
    badgeColor: 'bg-pink-100 text-pink-700 border-pink-300',
  },
  {
    id: 'feelings',
    name: 'Feelings & Moods',
    description: 'Words that express how we feel inside.',
    emoji: '💖',
    badgeColor: 'bg-rose-100 text-rose-700 border-rose-300',
  },
  {
    id: 'school',
    name: 'School & Friends',
    description: 'Classroom adventures, bags, desks & playtime.',
    emoji: '🎒',
    badgeColor: 'bg-amber-100 text-amber-700 border-amber-300',
  },
  {
    id: 'nature',
    name: 'Animals & Nature',
    description: 'Puppies, birds, blooming flowers & rainy days.',
    emoji: '🐾',
    badgeColor: 'bg-emerald-100 text-emerald-700 border-emerald-300',
  },
  {
    id: 'magic',
    name: 'Adventures & Magic',
    description: 'Castles, treasure maps, stars & wonders.',
    emoji: '✨',
    badgeColor: 'bg-purple-100 text-purple-700 border-purple-300',
  },
  {
    id: 'food',
    name: 'Yummy Kitchen',
    description: 'Sweet fruits, warm soup, baking & tastes.',
    emoji: '🧁',
    badgeColor: 'bg-orange-100 text-orange-700 border-orange-300',
  },
];

export const DAILY_WORD_OF_DAY = {
  id: 'daily-curious',
  word: 'Curious',
  phonetic: '/ˈkjʊə.ri.əs/',
  partOfSpeech: 'Adjective',
  definition: 'Eager to know, discover, or learn something new and interesting.',
  simpleExplanation: 'Wanting to find out how things work or asking lots of fun questions.',
  example: 'The curious kitten peeked into the cardboard box to see what was inside.',
  kidTip: 'Use when you want to explore or ask why!',
  emoji: '🔍',
  synonyms: ['inquisitive', 'interested', 'eager'],
};

export const INITIAL_CHALLENGES: SentenceChallenge[] = ALL_SENTENCE_CHALLENGES;
