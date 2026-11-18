import { SpeakingCard, ReadingParagraph, SituationCard } from '../types';

export interface SpeakingItem {
  id: string;
  type: 'story' | 'poem' | 'twister';
  category: 'nature' | 'space' | 'animals' | 'kindness' | 'rhymes' | 'twisters' | 'inventions';
  categoryName: string;
  categoryEmoji: string;
  title: string;
  authorOrOrigin?: string;
  content: string; // Multi-line text (paragraphs or stanzas)
  paragraphs: string[];
  vocabularySparks: string[];
  difficulty: 'gentle' | 'explorer' | 'master';
  themeColor: string;
  estimatedWpm: number;
}

export const SPEAKING_LIBRARY: SpeakingItem[] = [
  // --- STORIES ---
  {
    id: 'spk-story-1',
    type: 'story',
    category: 'nature',
    categoryName: 'Enchanted Nature',
    categoryEmoji: '🌲',
    title: 'The Whispering Forest Brook',
    paragraphs: [
      'Deep inside the sunlit forest, a gentle brook tumbled softly over smooth pebble stones.',
      'Friendly deer paused by the mossy bank to take a cool sip, while golden dragonflies glided through the warm morning mist.',
      'Every rustling leaf seemed to sing a peaceful lullaby to the waking woodland creatures.',
      'The morning sun peeked through the tall pine branches, painting shimmering gold patterns across the sweet green moss.',
    ],
    content: `Deep inside the sunlit forest, a gentle brook tumbled softly over smooth pebble stones.

Friendly deer paused by the mossy bank to take a cool sip, while golden dragonflies glided through the warm morning mist.

Every rustling leaf seemed to sing a peaceful lullaby to the waking woodland creatures.

The morning sun peeked through the tall pine branches, painting shimmering gold patterns across the sweet green moss.`,
    vocabularySparks: ['tumbled', 'dragonflies', 'lullaby', 'woodland', 'shimmering', 'peaceful'],
    difficulty: 'gentle',
    themeColor: 'emerald',
    estimatedWpm: 90,
  },
  {
    id: 'spk-story-2',
    type: 'story',
    category: 'animals',
    categoryName: 'Cozy Animals',
    categoryEmoji: '🐾',
    title: 'Barnaby the Baking Hedgehog',
    paragraphs: [
      'Barnaby the little hedgehog tied his checkered apron and preheated his miniature clay stove.',
      'He mixed wild blackberries, sweet golden honey, and fragrant cinnamon to bake the crispiest autumn pies.',
      'Soon, the delightful aroma floated through Pinecone Hollow, welcoming all his forest neighbors for an afternoon feast.',
    ],
    content: `Barnaby the little hedgehog tied his checkered apron and preheated his miniature clay stove.

He mixed wild blackberries, sweet golden honey, and fragrant cinnamon to bake the crispiest autumn pies.

Soon, the delightful aroma floated through Pinecone Hollow, welcoming all his forest neighbors for an afternoon feast.`,
    vocabularySparks: ['checkered', 'miniature', 'fragrant', 'cinnamon', 'aroma', 'feast'],
    difficulty: 'gentle',
    themeColor: 'rose',
    estimatedWpm: 95,
  },
  {
    id: 'spk-story-3',
    type: 'story',
    category: 'space',
    categoryName: 'Cosmic & Space',
    categoryEmoji: '🚀',
    title: 'Journey to the Stardust Nebula',
    paragraphs: [
      'Astronaut Leo pressed the glowing ignition switch, and the silver starship rocketed gracefully past the moon.',
      'Beyond the shimmering asteroid belt, clouds of swirling violet stardust floated silently in zero gravity.',
      'Cosmic wonders sparkled like diamonds in the dark sky, lighting the ship’s path toward new and unexplored galaxies.',
    ],
    content: `Astronaut Leo pressed the glowing ignition switch, and the silver starship rocketed gracefully past the moon.

Beyond the shimmering asteroid belt, clouds of swirling violet stardust floated silently in zero gravity.

Cosmic wonders sparkled like diamonds in the dark sky, lighting the ship’s path toward new and unexplored galaxies.`,
    vocabularySparks: ['ignition', 'gracefully', 'asteroid', 'swirling', 'gravity', 'unexplored'],
    difficulty: 'explorer',
    themeColor: 'indigo',
    estimatedWpm: 105,
  },
  {
    id: 'spk-story-4',
    type: 'story',
    category: 'kindness',
    categoryName: 'Kindness & School',
    categoryEmoji: '🏫',
    title: 'The Bright Yellow Umbrella',
    paragraphs: [
      'When sudden rain poured over the school courtyard, Aarav noticed his classmate shivering under the porch without a jacket.',
      'Without hesitating, he smiled warmly, stepped forward, and held his bright yellow umbrella over both of them.',
      'They laughed as the raindrops tapped rhythmically on the yellow cloth all the way to the warm library.',
    ],
    content: `When sudden rain poured over the school courtyard, Aarav noticed his classmate shivering under the porch without a jacket.

Without hesitating, he smiled warmly, stepped forward, and held his bright yellow umbrella over both of them.

They laughed as the raindrops tapped rhythmically on the yellow cloth all the way to the warm library.`,
    vocabularySparks: ['courtyard', 'shivering', 'hesitating', 'rhythmically', 'generous'],
    difficulty: 'gentle',
    themeColor: 'amber',
    estimatedWpm: 95,
  },
  {
    id: 'spk-story-5',
    type: 'story',
    category: 'inventions',
    categoryName: 'Magic Inventions',
    categoryEmoji: '🧪',
    title: 'The Cloud-Catching Balloon',
    paragraphs: [
      'Professor Zara pulled the brass lever on her fantastical rainbow airship.',
      'A giant velvet funnel gently scooped up a fluffy vanilla-scented cloud, condensing it into shimmering morning dew.',
      'With a single sprinkle, wilting garden blossoms instantly burst open in vivid crimson and violet blooms.',
    ],
    content: `Professor Zara pulled the brass lever on her fantastical rainbow airship.

A giant velvet funnel gently scooped up a fluffy vanilla-scented cloud, condensing it into shimmering morning dew.

With a single sprinkle, wilting garden blossoms instantly burst open in vivid crimson and violet blooms.`,
    vocabularySparks: ['fantastical', 'funnel', 'condensing', 'shimmering', 'blossoms', 'crimson'],
    difficulty: 'master',
    themeColor: 'purple',
    estimatedWpm: 110,
  },

  // --- POEMS & RHYMES ---
  {
    id: 'spk-poem-1',
    type: 'poem',
    category: 'rhymes',
    categoryName: 'Playful Poems',
    categoryEmoji: '🎵',
    title: 'The Starlight Train',
    paragraphs: [
      'Choo-choo through the midnight sky,\nPast the moon so round and high.\nSilver wheels on tracks of gold,\nStories waiting to be told.',
      'Breezes whisper, stars ignite,\nDancing in the velvet night.\nClose your eyes and hold on tight,\nOn the magic train of light!',
    ],
    content: `Choo-choo through the midnight sky,
Past the moon so round and high.
Silver wheels on tracks of gold,
Stories waiting to be told.

Breezes whisper, stars ignite,
Dancing in the velvet night.
Close your eyes and hold on tight,
On the magic train of light!`,
    vocabularySparks: ['ignite', 'velvet', 'tracks', 'whisper', 'midnight'],
    difficulty: 'gentle',
    themeColor: 'indigo',
    estimatedWpm: 80,
  },
  {
    id: 'spk-poem-2',
    type: 'poem',
    category: 'rhymes',
    categoryName: 'Playful Poems',
    categoryEmoji: '🎵',
    title: 'Little Dragonfly Wings',
    paragraphs: [
      'Hover, flutter, dip and spin,\nSee the sunny day begin!\nIridescent wings of green,\nPrettiest sight you have ever seen.',
      'Landing on a lily pad,\nDragonfly looks proud and glad.\nCatching beams of morning sun,\nMagic flights have just begun!',
    ],
    content: `Hover, flutter, dip and spin,
See the sunny day begin!
Iridescent wings of green,
Prettiest sight you have ever seen.

Landing on a lily pad,
Dragonfly looks proud and glad.
Catching beams of morning sun,
Magic flights have just begun!`,
    vocabularySparks: ['hover', 'flutter', 'iridescent', 'lily pad', 'beams'],
    difficulty: 'explorer',
    themeColor: 'emerald',
    estimatedWpm: 85,
  },
  {
    id: 'spk-poem-3',
    type: 'poem',
    category: 'rhymes',
    categoryName: 'Playful Poems',
    categoryEmoji: '🎵',
    title: 'The Secret Garden Tea',
    paragraphs: [
      'Underneath the willow tree,\nLadybugs are sipping tea.\nButterflies with powdered wings,\nListen as the robin sings.',
      'Sugar drops on acorn plates,\nNo one ever comes in late!\nLaughter rings with every cup,\nTill the golden stars wake up.',
    ],
    content: `Underneath the willow tree,
Ladybugs are sipping tea.
Butterflies with powdered wings,
Listen as the robin sings.

Sugar drops on acorn plates,
No one ever comes in late!
Laughter rings with every cup,
Till the golden stars wake up.`,
    vocabularySparks: ['willow', 'powdered', 'robin', 'acorn', 'laughter'],
    difficulty: 'gentle',
    themeColor: 'rose',
    estimatedWpm: 80,
  },

  // --- TONGUE TWISTERS & CHALLENGES ---
  {
    id: 'spk-twister-1',
    type: 'twister',
    category: 'twisters',
    categoryName: 'Tongue Twisters',
    categoryEmoji: '👅',
    title: 'The Curious Cozy Cat',
    paragraphs: [
      'Curious cats quietly creep through colorful cozy corners.',
      'Crisp crunchy cookies crumble cheerfully on the kitchen counter.',
      'Can clever cats catch crunchy cookies carefully?',
    ],
    content: `Curious cats quietly creep through colorful cozy corners.

Crisp crunchy cookies crumble cheerfully on the kitchen counter.

Can clever cats catch crunchy cookies carefully?`,
    vocabularySparks: ['curious', 'quietly', 'cheerfully', 'clever', 'crumble'],
    difficulty: 'explorer',
    themeColor: 'amber',
    estimatedWpm: 90,
  },
  {
    id: 'spk-twister-2',
    type: 'twister',
    category: 'twisters',
    categoryName: 'Tongue Twisters',
    categoryEmoji: '👅',
    title: 'Pretty Pink Paint Brushes',
    paragraphs: [
      'Pretty pink paint brushes paint playful purple puppies.',
      'Peter praised Penelope for painting peaceful pastel portraits.',
      'Pass the perfect pink paint promptly, please!',
    ],
    content: `Pretty pink paint brushes paint playful purple puppies.

Peter praised Penelope for painting peaceful pastel portraits.

Pass the perfect pink paint promptly, please!`,
    vocabularySparks: ['praised', 'peaceful', 'pastel', 'portraits', 'promptly'],
    difficulty: 'master',
    themeColor: 'purple',
    estimatedWpm: 95,
  },
];

export const READING_PARAGRAPHS: ReadingParagraph[] = [
  {
    id: 'rp-1',
    category: 'nature',
    categoryName: 'Enchanted Nature',
    categoryEmoji: '🌲',
    title: 'The Whispering Forest Brook',
    paragraph:
      'Deep inside the sunlit forest, a gentle brook tumbled over smooth pebble stones. Friendly deer paused by the mossy bank to take a cool sip, while golden dragonflies glided through the warm morning mist. Every rustling leaf seemed to sing a peaceful lullaby to the waking woodland creatures.',
    vocabularySparks: ['gentle', 'tumbled', 'dragonflies', 'peaceful', 'woodland', 'rustling'],
    difficulty: 'gentle',
    themeColor: 'emerald',
  },
  {
    id: 'rp-2',
    category: 'nature',
    categoryName: 'Enchanted Nature',
    categoryEmoji: '🌲',
    title: 'The Glowing Firefly Lantern',
    paragraph:
      'As dusk painted the sky in shades of plum and rose, tiny emerald fireflies began their evening waltz. Maya gently raised her glass lantern, watching the soft lights flicker and twinkle among the towering oak branches like miniature fallen stars.',
    vocabularySparks: ['emerald', 'waltz', 'twinkle', 'towering', 'miniature', 'flicker'],
    difficulty: 'explorer',
    themeColor: 'emerald',
  },
  {
    id: 'rp-3',
    category: 'space',
    categoryName: 'Cosmic & Space',
    categoryEmoji: '🚀',
    title: 'Journey to the Stardust Nebula',
    paragraph:
      'Astronaut Leo pressed the ignition switch, and the silver starship rocketed gracefully past the moon. Beyond the asteroid belt, clouds of swirling violet stardust floated silently in zero gravity, glowing with cosmic wonders that no Earth telescope had ever captured before.',
    vocabularySparks: ['astronaut', 'ignition', 'gracefully', 'swirling', 'cosmic', 'gravity'],
    difficulty: 'explorer',
    themeColor: 'indigo',
  },
  {
    id: 'rp-4',
    category: 'space',
    categoryName: 'Cosmic & Space',
    categoryEmoji: '🚀',
    title: 'The Friendly Mars Rover',
    paragraph:
      'High on the crimson hills of Mars, a cheerful rover named Curiosity spun its titanium wheels. It carefully collected red pebble samples and beamed sparkling panoramic photographs across millions of miles back to Earth with a triumphant beep.',
    vocabularySparks: ['crimson', 'titanium', 'panoramic', 'triumphant', 'curiosity', 'beamed'],
    difficulty: 'master',
    themeColor: 'indigo',
  },
  {
    id: 'rp-5',
    category: 'kindness',
    categoryName: 'Kindness & School',
    categoryEmoji: '🏫',
    title: 'The Bright Yellow Umbrella',
    paragraph:
      'When sudden rain poured over the school courtyard, Aarav noticed his classmate shivering under the porch without a jacket. Without hesitating, he smiled warmly, stepped forward, and held his bright yellow umbrella over both of them as they walked to the library together.',
    vocabularySparks: ['courtyard', 'shivering', 'hesitating', 'warmly', 'umbrella', 'generous'],
    difficulty: 'gentle',
    themeColor: 'amber',
  },
  {
    id: 'rp-6',
    category: 'kindness',
    categoryName: 'Kindness & School',
    categoryEmoji: '🏫',
    title: 'The Secret Origami Notes',
    paragraph:
      'Every Monday, Anaya folded colorful origami cranes and slipped kind handwritten compliments into her friends’ cubbies. Her encouraging words brightened gloomy mornings, reminding everyone that a tiny gesture of empathy can illuminate an entire classroom.',
    vocabularySparks: ['origami', 'compliments', 'encouraging', 'empathy', 'illuminate', 'gesture'],
    difficulty: 'explorer',
    themeColor: 'amber',
  },
  {
    id: 'rp-7',
    category: 'animals',
    categoryName: 'Cozy Animals',
    categoryEmoji: '🐾',
    title: 'Barnaby the Baking Hedgehog',
    paragraph:
      'Barnaby the little hedgehog tied his checkered apron and preheated his miniature clay stove. He mixed wild blackberries, golden honey, and fragrant cinnamon to bake the crispiest autumn pies for all his burrowing neighbors in Pinecone Hollow.',
    vocabularySparks: ['checkered', 'miniature', 'fragrant', 'cinnamon', 'burrowing', 'hollow'],
    difficulty: 'gentle',
    themeColor: 'rose',
  },
  {
    id: 'rp-8',
    category: 'animals',
    categoryName: 'Cozy Animals',
    categoryEmoji: '🐾',
    title: 'The Sea Otter’s Treasure Shell',
    paragraph:
      'Floating lazily on his back upon the emerald kelp bed, Oliver the sea otter cradled his favorite smooth purple clam shell. He tapped it playfully against a sea rock, balancing a juicy seaweed snack on his furry belly while watching seagulls glide above.',
    vocabularySparks: ['cradled', 'lazily', 'emerald', 'balancing', 'seagulls', 'playfully'],
    difficulty: 'explorer',
    themeColor: 'rose',
  },
  {
    id: 'rp-9',
    category: 'inventions',
    categoryName: 'Magic Inventions',
    categoryEmoji: '🧪',
    title: 'The Cloud Catching Balloon',
    paragraph:
      'Professor Zara pulled the brass lever on her fantastical rainbow airship. A giant velvet funnel gently scooped up a fluffy vanilla-scented cloud, condensing it into shimmering morning dew that could make wilting garden blossoms instantly bloom in vivid color.',
    vocabularySparks: ['fantastical', 'funnel', 'condensing', 'shimmering', 'blossoms', 'vivid'],
    difficulty: 'master',
    themeColor: 'purple',
  },
];

export const SITUATION_CARDS: SituationCard[] = [
  {
    id: 'sit-1',
    title: 'A Fluffy Rabbit Jumping in the Flower Garden',
    emoji: '🐰🌷',
    sceneDescription:
      'A fluffy white rabbit with twitching pink ears is playfully leaping high over rows of blooming pink tulips, yellow sunflowers, and ripe red strawberries. Bright butterflies flutter in the sunlit breeze while a garden watering can sparkles nearby.',
    cartoonType: 'rabbit_garden',
    guidedQuestions: [
      'Why is the fluffy rabbit hopping around so joyfully?',
      'What colors and flowers do you see in the sunny garden?',
      'What happens when the rabbit discovers the sweet strawberry patch?',
      'What sounds would you hear in this morning garden?',
    ],
    sampleKeywords: ['bouncing', 'blooming', 'strawberries', 'fluttering', 'dewdrops', 'sunlight', 'cheerful'],
    starterPrompt: 'In the middle of the blooming strawberry garden, a fluffy bunny suddenly leaped into the air...',
  },
  {
    id: 'sit-2',
    title: 'Opening a Mystery Can Full of Sparkling Gadgets',
    emoji: '🥫✨',
    sceneDescription:
      'A young inventor carefully opens a vintage silver tin can on a wooden workbench. As the lid pops off, glowing brass gears, magical humming crystals, and miniature spinning compasses burst out with sparkling golden light and swirling stardust!',
    cartoonType: 'treasure_can',
    guidedQuestions: [
      'What did the person find inside the mysterious tin can?',
      'What magical sounds or humming noises did the gadgets make?',
      'Who hid this treasure can and why?',
      'What incredible new machine will the inventor build with these parts?',
    ],
    sampleKeywords: ['sparkling', 'gears', 'mysterious', 'inventor', 'humming', 'discovery', 'magical'],
    starterPrompt: 'With a gentle pop, the silver lid came off the tin can, and a swirl of golden light burst forth...',
  },
  {
    id: 'sit-3',
    title: 'A Playful Puppy Baking Rainbow Cupcakes',
    emoji: '🐶🧁',
    sceneDescription:
      'A golden puppy wearing a tall white chef hat stands on its hind paws, sprinkling rainbow confetti over freshly baked vanilla cupcakes. Mixing bowls, strawberry jam jars, and dusting flour leave cute little paw prints all over the cozy kitchen.',
    cartoonType: 'puppy_bakery',
    guidedQuestions: [
      'Who is the puppy baking these delicious cupcakes for?',
      'What special sweet ingredients did the chef puppy use?',
      'How did flour paw prints end up across the whole kitchen counter?',
      'What happened when the timer on the oven went ding?',
    ],
    sampleKeywords: ['delicious', 'sprinkles', 'chef hat', 'vanilla', 'pawprints', 'sweet', 'whisking'],
    starterPrompt: 'Chef Bruno the golden puppy put on his tall hat and looked proudly at the rainbow cupcakes...',
  },
  {
    id: 'sit-4',
    title: 'Flying a Giant Dragon Kite on Windy Hill',
    emoji: '🪁🌅',
    sceneDescription:
      'Two best friends stand on the crest of a breezy green hill at sunset, holding onto a wooden spool as a magnificent scarlet and gold dragon kite soars high into the orange clouds, its long ribbon tail dancing in the sky.',
    cartoonType: 'dragon_kite',
    guidedQuestions: [
      'How high is the dragon kite soaring in the sky?',
      'What does the wind feel and sound like on top of the hill?',
      'What story does the dragon kite tell as its tail dances in the clouds?',
      'What wishes are the friends making as the sun goes down?',
    ],
    sampleKeywords: ['soaring', 'sunset', 'breezy', 'dancing tail', 'dragon', 'laughter', 'freedom'],
    starterPrompt: 'The strong sunset breeze caught the scarlet dragon kite, lifting it high above the rolling green hill...',
  },
  {
    id: 'sit-5',
    title: 'A Gentle Bear Having Tea in a Treehouse',
    emoji: '🐻🫖',
    sceneDescription:
      'A big cuddly brown bear wearing a yellow polka-dot bow tie sits carefully on a tree trunk stool inside a cozy wooden treehouse. He is pouring warm chamomile tea from a ceramic kettle into tiny porcelain cups for two singing bluebirds.',
    cartoonType: 'bear_tea_party',
    guidedQuestions: [
      'What are the bear and the little bluebirds chatting about over tea?',
      'What sweet snacks like honey biscuits are placed on the treehouse table?',
      'How did they build this warm and cozy hideaway in the branches?',
      'Why is sharing a cup of tea with friends so special?',
    ],
    sampleKeywords: ['chamomile', 'treehouse', 'hospitality', 'porcelain', 'bluebirds', 'peaceful', 'honey'],
    starterPrompt: 'High up in the leafy oak branches, Barnaby the bear poured a warm cup of herbal tea for his feathered guests...',
  },
];

export const SPEAKING_CARDS: SpeakingCard[] = [
  {
    id: 'sp-1',
    title: 'Rahul and the Bag',
    textToSpeak: 'Rahul was worried because he left his bag at home.',
    category: 'word_focus',
    difficulty: 'easy',
    focusWords: ['worried', 'bag', 'home'],
    emoji: '🎒',
  },
  {
    id: 'sp-2',
    title: 'The Cozy Pink Bunny',
    textToSpeak: 'A cozy bunny bounced happily in the blooming flower garden.',
    category: 'rhyme',
    difficulty: 'easy',
    focusWords: ['cozy', 'bounced', 'happily'],
    emoji: '🐰',
  },
  {
    id: 'sp-3',
    title: 'Crayon Tongue Twister',
    textToSpeak: 'Pretty pink crayons paint pretty playful pictures.',
    category: 'tongue_twister',
    difficulty: 'medium',
    focusWords: ['pretty', 'pink', 'crayons', 'playful'],
    emoji: '🖍️',
  },
  {
    id: 'sp-4',
    title: 'Generous Friend Dialogue',
    textToSpeak: 'I am happy to share my delicious fruit with you today!',
    category: 'daily_dialogue',
    difficulty: 'easy',
    focusWords: ['happy', 'delicious', 'share'],
    emoji: '🍓',
  },
  {
    id: 'sp-5',
    title: 'Delicate Butterfly Whisper',
    textToSpeak: 'The delicate butterfly rested softly on the glowing flower petal.',
    category: 'rhyme',
    difficulty: 'medium',
    focusWords: ['delicate', 'rested', 'glowing'],
    emoji: '🦋',
  },
  {
    id: 'sp-6',
    title: 'Curious Cat Twister',
    textToSpeak: 'Curious cats quietly catch colorful crunchy cookies.',
    category: 'tongue_twister',
    difficulty: 'medium',
    focusWords: ['curious', 'quietly', 'colorful'],
    emoji: '🐱',
  },
];
