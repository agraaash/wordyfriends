import { WritingPrompt } from '../types';

export const WRITING_PROMPTS: WritingPrompt[] = [
  {
    id: 'wp-1',
    title: 'The Magic Pink Crayon',
    prompt: 'Imagine you find a glowing pink crayon in your pencil case. Anything you draw with it pops to life! What do you draw first?',
    starterSentence: 'One sunny morning, I opened my pink pencil box and saw a crayon that was glowing like a star...',
    suggestedWords: ['magical', 'delighted', 'glittering', 'sparkling', 'whispered', 'gentle'],
    emoji: '🖍️',
    theme: 'Fantasy & Magic',
  },
  {
    id: 'wp-2',
    title: 'The Lost School Bag Adventure',
    prompt: 'Rahul and his friends are looking for a missing school bag before the bell rings. What clues do they find?',
    starterSentence: 'Rahul looked everywhere for his green school bag, but it was nowhere in sight...',
    suggestedWords: ['worried', 'curious', 'detective', 'carefully', 'discovered', 'cheered'],
    emoji: '🎒',
    theme: 'School Mystery',
  },
  {
    id: 'wp-3',
    title: 'A Cozy Day in the Treehouse',
    prompt: 'You and your pet squirrel build the coziest secret room inside an ancient oak tree.',
    starterSentence: 'High up in the branches of the old oak tree, we tucked ourselves into a cozy blanket fort...',
    suggestedWords: ['cozy', 'warm', 'delicious', 'peaceful', 'chattered', 'feathery'],
    emoji: '🌳',
    theme: 'Nature & Cozy Friends',
  },
  {
    id: 'wp-4',
    title: 'The Generous Little Baker',
    prompt: 'Write about baking sweet strawberry cupcakes and sharing them with everyone in your neighborhood.',
    starterSentence: 'The kitchen smelled like sweet strawberries and warm vanilla as the oven timer dinged...',
    suggestedWords: ['generous', 'delicious', 'frosting', 'smiling', 'delicate', 'celebration'],
    emoji: '🧁',
    theme: 'Sweet Cooking',
  },
];
