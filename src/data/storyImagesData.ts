import { StoryImage } from '../types';

// Import our 16 Gemini-generated 2D children's storybook illustration assets
import imgLibraryDoor from '../assets/images/storybook_library_door_1787491956550.jpg';
import imgLitterBin from '../assets/images/storybook_litter_bin_1787491971683.jpg';
import imgSchoolBus from '../assets/images/storybook_school_bus_1787491988605.jpg';
import imgMysteryClues from '../assets/images/storybook_mystery_clues_1787492000963.jpg';
import imgMagicPortal from '../assets/images/storybook_magic_portal_1787492014094.jpg';
import imgFriendshipBench from '../assets/images/storybook_friendship_bench_1787492028472.jpg';
import imgFunnyPancakes from '../assets/images/storybook_funny_pancakes_1787492042187.jpg';
import imgWhatIfClouds from '../assets/images/storybook_what_if_clouds_1787492058260.jpg';
import imgAdventureTreehouse from '../assets/images/storybook_adventure_treehouse_1787492073787.jpg';
import imgAnimalsGarden from '../assets/images/storybook_animals_garden_1787492089189.jpg';
import imgSpecialParty from '../assets/images/storybook_special_party_1787492105365.jpg';
import imgEverydayRain from '../assets/images/storybook_everyday_rain_1787492121437.jpg';
import imgClassroomChalk from '../assets/images/storybook_classroom_chalk_1787492146451.jpg';
import imgCommunityGarden from '../assets/images/storybook_community_garden_1787492160517.jpg';
import imgCrystalCave from '../assets/images/storybook_crystal_cave_1787492176329.jpg';
import imgCozySpace from '../assets/images/storybook_cozy_space_1787492190234.jpg';

export interface ImageCategory {
  id: string;
  name: string;
  emoji: string;
  description: string;
  badgeColor: string;
}

export const IMAGE_CATEGORIES: ImageCategory[] = [
  { id: 'all', name: 'All Story Sparks', emoji: '✨', description: 'Hundreds of picture sparks waiting to become stories', badgeColor: 'bg-pink-100 text-pink-700 border-pink-300' },
  { id: 'school', name: 'School Days', emoji: '🏫', description: 'Classroom mysteries, bus adventures & secret desk notes', badgeColor: 'bg-sky-100 text-sky-700 border-sky-300' },
  { id: 'magic', name: 'Magic', emoji: '🪄', description: 'Talking pencils, secret portals & living storybooks', badgeColor: 'bg-purple-100 text-purple-700 border-purple-300' },
  { id: 'difference', name: 'Make a Difference', emoji: '🌍', description: 'Kindness, community gardens, helping hands & caring for Earth', badgeColor: 'bg-emerald-100 text-emerald-700 border-emerald-300' },
  { id: 'feelings', name: 'Feelings & Friendship', emoji: '❤️', description: 'Empathy, courage, making up after arguments & true friendship', badgeColor: 'bg-rose-100 text-rose-700 border-rose-300' },
  { id: 'mystery', name: 'Mystery', emoji: '🕵️', description: 'Locked chests, glowing footprints & unexplained clues', badgeColor: 'bg-amber-100 text-amber-700 border-amber-300' },
  { id: 'funny', name: 'Funny', emoji: '😂', description: 'Pancake disasters, pets in capes & hilarious surprises', badgeColor: 'bg-teal-100 text-teal-700 border-teal-300' },
  { id: 'what_if', name: 'What If?', emoji: '🚀', description: 'Underwater schools, zero gravity & floating cloud cities', badgeColor: 'bg-indigo-100 text-indigo-700 border-indigo-300' },
  { id: 'adventure', name: 'Adventure', emoji: '🧭', description: 'Hidden caves, treasure maps & misty islands', badgeColor: 'bg-orange-100 text-orange-700 border-orange-300' },
  { id: 'animals', name: 'Animals', emoji: '🐾', description: 'Animals on secret missions & unexpected animal tales', badgeColor: 'bg-green-100 text-green-700 border-green-300' },
  { id: 'finish_story', name: 'Finish the Story', emoji: '📖', description: 'Start with an exciting cliffhanger sentence and make it yours', badgeColor: 'bg-violet-100 text-violet-700 border-violet-300' },
  { id: 'special_days', name: 'Special Days', emoji: '🎉', description: 'Birthdays, moving day, big performances & campouts', badgeColor: 'bg-yellow-100 text-yellow-700 border-yellow-300' },
  { id: 'everyday_life', name: 'Everyday Life', emoji: '🏙️', description: 'Ordinary days that suddenly take a delightful twist', badgeColor: 'bg-stone-100 text-stone-700 border-stone-300' },
];

export const STORY_IMAGES_REPOSITORY: StoryImage[] = [
  // ==========================================
  // 1. 🏫 SCHOOL DAYS (1-10)
  // ==========================================
  {
    id: 'sch-01',
    title: 'The Mysterious Door Behind the Bookshelf',
    prompt: 'While looking for a dictionary in the school library, two curious cartoon students discover a tiny archway glowing soft green behind the encyclopedia shelf. Where does it lead?',
    category: 'school',
    categoryLabel: 'School Days',
    imageUrl: imgLibraryDoor,
    tag: 'Secret Door 🚪',
    starterSentence: 'When Maya pulled back the heavy blue dictionary, a tiny wooden door whispered open behind the bookshelf.',
    suggestedWords: ['whispered', 'creaked', 'glimmering', 'tunnels', 'curious'],
    emoji: '🏫',
    guidedQuestions: ['Who made this tiny door inside the school?', 'What sound is coming from inside?', 'What happens if someone walks through?'],
    suggestedEmotions: ['Curious', 'Astonished', 'Daring'],
    isFeatured: true,
  },
  {
    id: 'sch-02',
    title: 'The New Student with the Brass Key',
    prompt: 'A new student arrives at room 4B with a mysterious brass key hanging from their backpack. They never open their desk without whispering to it first.',
    category: 'school',
    categoryLabel: 'School Days',
    imageUrl: imgClassroomChalk,
    tag: 'New Student 🎒',
    starterSentence: 'Everyone turned around as the classroom door opened and a girl with a shining brass key stepped inside.',
    suggestedWords: ['mysterious', 'whisper', 'unlocked', 'secret', 'clatter'],
    emoji: '🎒',
    guidedQuestions: ['What is the key designed to open?', 'Why is the new student so quiet?', 'What happens during afternoon recess?'],
    suggestedEmotions: ['Intrigued', 'Shy', 'Excited'],
  },
  {
    id: 'sch-03',
    title: 'The School Bus That Took a Wrong Turn',
    prompt: 'The cheerful yellow bus turns onto a road nobody has ever seen before, lined with giant luminescent sunflowers and sparkling rainbow pebbles.',
    category: 'school',
    categoryLabel: 'School Days',
    imageUrl: imgSchoolBus,
    tag: 'School Bus 🚌',
    starterSentence: 'Mr. Henderson blinked through his glasses as the school bus rolled across a shimmering bridge into unfamiliar hills.',
    suggestedWords: ['bouncing', 'sunflowers', 'rainbow', 'steering', 'adventure'],
    emoji: '🚌',
    guidedQuestions: ['Where is the bus heading?', 'How do the kids on the bus react?', 'How will they get back in time for lunch?'],
    suggestedEmotions: ['Adventurous', 'Surprised', 'Cheery'],
    isFeatured: true,
  },
  {
    id: 'sch-04',
    title: 'The Chalkboard Drawing That Came Alive',
    prompt: 'The chalk sketch of a friendly dolphin on the blackboard begins splashing real bubbles and sparkling water into the front row of desks.',
    category: 'school',
    categoryLabel: 'School Days',
    imageUrl: imgClassroomChalk,
    tag: 'Chalkboard ✨',
    starterSentence: 'Just as the morning bell rang, a tiny splash of cool water flew directly out of the chalk dolphin on the blackboard.',
    suggestedWords: ['rippling', 'chalk dust', 'splashing', 'leaping', 'laughter'],
    emoji: '🐬',
    guidedQuestions: ['Who drew the dolphin on the board?', 'What other chalk drawings start moving?', 'How does the teacher react?'],
    suggestedEmotions: ['Amazed', 'Giggling', 'Playful'],
    isFeatured: true,
  },
  {
    id: 'sch-05',
    title: 'The Secret Note in Desk 14',
    prompt: 'Inside an old wooden desk, a student finds a folded note sealed with glitter wax: "Look up at the ceiling fan at exactly 2:15 PM."',
    category: 'school',
    categoryLabel: 'School Days',
    imageUrl: imgLibraryDoor,
    tag: 'Secret Note 💌',
    starterSentence: 'Tucked into the far corner of my desk was a folded golden paper with three mysterious words.',
    suggestedWords: ['handwriting', 'ticking', 'sealed', 'glitter', 'message'],
    emoji: '📝',
    guidedQuestions: ['Who left the note in desk 14?', 'What appears on the ceiling fan at 2:15 PM?', 'Will the student tell their best friend?'],
    suggestedEmotions: ['Eager', 'Curious', 'Nervous'],
  },
  {
    id: 'sch-06',
    title: 'The Playground Chalk Maze',
    prompt: 'Someone stayed late yesterday and drew a giant, intricate chalk labyrinth across the whole basketball court with a treasure chest marked at the center.',
    category: 'school',
    categoryLabel: 'School Days',
    imageUrl: imgFriendshipBench,
    tag: 'Chalk Maze 🌀',
    starterSentence: 'At 10:00 AM recess, the entire playground ground had been transformed into a sparkling neon maze.',
    suggestedWords: ['labyrinth', 'twisting', 'footsteps', 'clues', 'cheering'],
    emoji: '🌀',
    guidedQuestions: ['Who drew the giant maze?', 'What is waiting at the center?', 'Who reaches the middle first?'],
    suggestedEmotions: ['Competitive', 'Excited', 'Determined'],
  },

  // ==========================================
  // 2. 🪄 MAGIC (11-20)
  // ==========================================
  {
    id: 'mag-01',
    title: 'The Living Storybook and the Stardust Portal',
    prompt: 'In a cozy pastel bedroom, an open storybook gently floats into the air, releasing shimmering golden stardust and friendly tiny dragons from its pages.',
    category: 'magic',
    categoryLabel: 'Magic',
    imageUrl: imgMagicPortal,
    tag: 'Floating Book 📖',
    starterSentence: 'As the golden clock clicked, the storybook began to hover six inches above the wooden table.',
    suggestedWords: ['levitating', 'stardust', 'whisper', 'enchanted', 'glowing'],
    emoji: '📖',
    guidedQuestions: ['What story was written on that page?', 'What creature emerges from the glow?', 'Where does the golden portal lead?'],
    suggestedEmotions: ['Awestruck', 'Delighted', 'Wonder'],
    isFeatured: true,
  },
  {
    id: 'mag-02',
    title: 'The Enchanted Crystal Cave',
    prompt: 'Deep inside a sparkling cavern, two young cartoon adventurers paddle a canoe towards glowing amethyst crystals and a magical carved chest.',
    category: 'magic',
    categoryLabel: 'Magic',
    imageUrl: imgCrystalCave,
    tag: 'Crystal Cave 💎',
    starterSentence: 'The water glowed turquoise as our canoe slipped beneath the shimmering amethyst archway.',
    suggestedWords: ['shimmering', 'amethyst', 'lantern', 'echo', 'treasure'],
    emoji: '💎',
    guidedQuestions: ['Who lit the lanterns in the cavern?', 'What is locked inside the carved stone chest?', 'What magical power does the crystal hold?'],
    suggestedEmotions: ['Brave', 'Curious', 'Enchanted'],
    isFeatured: true,
  },
  {
    id: 'mag-03',
    title: 'The Wandering Teacup Dragon',
    prompt: 'A tiny dragon no larger than a teacup wakes up inside the kitchen cupboard and starts baking miniature glowing cookies.',
    category: 'magic',
    categoryLabel: 'Magic',
    imageUrl: imgMagicPortal,
    tag: 'Teacup Dragon ☕',
    starterSentence: 'When I opened the top kitchen cupboard, a puff of lavender smoke rolled out over the teacups.',
    suggestedWords: ['sparklet', 'miniature', 'baking', 'whimsical', 'flame'],
    emoji: '🐉',
    guidedQuestions: ['Where did the tiny dragon come from?', 'What recipe is it trying to bake?', 'How do you keep it secret from your family?'],
    suggestedEmotions: ['Amused', 'Friendly', 'Careful'],
  },

  // ==========================================
  // 3. 🌍 MAKE A DIFFERENCE (21-30)
  // ==========================================
  {
    id: 'dif-01',
    title: 'The Litter Drop on Maple Street',
    prompt: 'On a sunny neighbourhood sidewalk, an adult carelessly drops a candy wrapper right next to a recycling bin. Two alert cartoon children notice and decide to take action!',
    category: 'difference',
    categoryLabel: 'Make a Difference',
    imageUrl: imgLitterBin,
    tag: 'Sidewalk Hero ♻️',
    starterSentence: 'The shiny candy wrapper fluttered across the pavement, landing just three inches away from the bright green bin.',
    suggestedWords: ['wrapper', 'recycling', 'courage', 'neighborhood', 'inspire'],
    emoji: '♻️',
    guidedQuestions: ['How do the children politely address the situation?', 'What creative idea do they have to make Maple Street cleaner?', 'How does the neighborhood respond?'],
    suggestedEmotions: ['Determined', 'Responsible', 'Inspiring'],
    isFeatured: true,
  },
  {
    id: 'dif-02',
    title: 'The Sunny Sunflower Community Garden',
    prompt: 'A once-empty concrete lot is transformed into a vibrant community garden as cheerful kids and neighbours plant sunflower seedlings and vegetable beds together.',
    category: 'difference',
    categoryLabel: 'Make a Difference',
    imageUrl: imgCommunityGarden,
    tag: 'Community Garden 🌻',
    starterSentence: 'Grandpa Joe passed me the first green sunflower seedling and pointed to the sunny corner of the soil bed.',
    suggestedWords: ['sprouting', 'seedling', 'watering can', 'teamwork', 'harvest'],
    emoji: '🌻',
    guidedQuestions: ['Who came up with the idea to build the garden?', 'What will they do with the fresh vegetables they grow?', 'How does the community celebrate?'],
    suggestedEmotions: ['Joyful', 'Proud', 'United'],
    isFeatured: true,
  },
  {
    id: 'dif-03',
    title: 'The Little Free Library in the Park',
    prompt: 'Maya and her brother spend the weekend painting a wooden book box shaped like an owl, stocking it with storybooks for everyone in the neighborhood.',
    category: 'difference',
    categoryLabel: 'Make a Difference',
    imageUrl: imgCommunityGarden,
    tag: 'Free Library 📚',
    starterSentence: 'We hammered the little wooden roof into place, and the bright blue Free Library was finally ready for books.',
    suggestedWords: ['bookshelf', 'sharing', 'reading', 'neighborhood', 'kindness'],
    emoji: '📚',
    guidedQuestions: ['What is the first book they place inside?', 'Who comes to borrow a story the next morning?', 'What surprise note does someone leave in return?'],
    suggestedEmotions: ['Generous', 'Content', 'Excited'],
  },

  // ==========================================
  // 4. ❤️ FEELINGS & FRIENDSHIP (31-40)
  // ==========================================
  {
    id: 'fel-01',
    title: 'The Buddy Bench at Recess',
    prompt: 'Two cartoon children share a colorful sketchbook on the rainbow Buddy Bench under a blooming cherry blossom tree, finding a new friendship through art.',
    category: 'feelings',
    categoryLabel: 'Feelings & Friendship',
    imageUrl: imgFriendshipBench,
    tag: 'Buddy Bench 🌸',
    starterSentence: 'Sitting alone on the painted bench, I opened my box of pastels—and then a gentle voice asked, "Can I draw too?"',
    suggestedWords: ['welcome', 'sketchbook', 'friendship', 'blossoms', 'smiles'],
    emoji: '🌸',
    guidedQuestions: ['What made the second student come over to sit down?', 'What picture do they decide to draw together?', 'How does their friendship grow throughout the school year?'],
    suggestedEmotions: ['Warm', 'Relieved', 'Grateful'],
    isFeatured: true,
  },
  {
    id: 'fel-02',
    title: 'Making Up After the Lost Game',
    prompt: 'After a tough kickball match at recess, two best friends sit under the shade tree, sharing a bottle of water and laughing about the wild referee calls.',
    category: 'feelings',
    categoryLabel: 'Feelings & Friendship',
    imageUrl: imgFriendshipBench,
    tag: 'Making Up 🤝',
    starterSentence: 'The kickball had bounced out of bounds, but the apology bounced straight into our hearts.',
    suggestedWords: ['apology', 'forgiveness', 'laughter', 'teammate', 'loyalty'],
    emoji: '🤝',
    guidedQuestions: ['Why was there an argument during the game?', 'Who took the first step to say sorry?', 'What funny memory made them both laugh?'],
    suggestedEmotions: ['Empathetic', 'Forgiving', 'Close'],
  },

  // ==========================================
  // 5. 🕵️ MYSTERY (41-50)
  // ==========================================
  {
    id: 'mys-01',
    title: 'The Secret Clues in the Attic Chest',
    prompt: 'Two kid detectives with magnifying glasses follow glowing footprints across an old wooden attic floor leading to a mysterious carved chest.',
    category: 'mystery',
    categoryLabel: 'Mystery',
    imageUrl: imgMysteryClues,
    tag: 'Attic Chest 🗝️',
    starterSentence: 'Under the dim amber attic light, the magnifying glass revealed three tiny glowing footprints heading toward the wooden trunk.',
    suggestedWords: ['footprints', 'magnifying', 'brass lock', 'clues', 'shadows'],
    emoji: '🕵️',
    guidedQuestions: ['Whose footprints are glowing on the attic floorboards?', 'What ancient combination opens the brass lock?', 'What secret treasure is resting inside?'],
    suggestedEmotions: ['Suspenseful', 'Clever', 'Thrilled'],
    isFeatured: true,
  },
  {
    id: 'mys-02',
    title: 'The Treehouse Telescope Signal',
    prompt: 'Every night at 8:00 PM, a blinking green light shines from the highest turret of the old treehouse observatory across the valley. Who is sending the code?',
    category: 'mystery',
    categoryLabel: 'Mystery',
    imageUrl: imgAdventureTreehouse,
    tag: 'Secret Signal 🔭',
    starterSentence: 'Through my bedroom window, three short flashes of green light blinked in perfect rhythm across the dark treetops.',
    suggestedWords: ['morse code', 'telescope', 'observatory', 'flashing', 'cipher'],
    emoji: '🔭',
    guidedQuestions: ['What message is the green light flashing?', 'Who is up in the observatory after sunset?', 'How do the kid detectives answer the signal?'],
    suggestedEmotions: ['Investigative', 'Curious', 'Alert'],
    isFeatured: true,
  },

  // ==========================================
  // 6. 😂 FUNNY (51-60)
  // ==========================================
  {
    id: 'fun-01',
    title: 'The Robot Chef Pancake Catastrophe',
    prompt: 'A cheerful cartoon robot chef and two giggling kids make a giant wobbly tower of blueberry pancakes that reaches all the way to the kitchen ceiling!',
    category: 'funny',
    categoryLabel: 'Funny',
    imageUrl: imgFunnyPancakes,
    tag: 'Pancake Tower 🥞',
    starterSentence: 'Chef Bot-3000 beeped with joy as the twenty-fifth pancake landed with a glorious squish atop the leaning syrup tower.',
    suggestedWords: ['wobbling', 'syrup', 'splattered', 'giggling', 'catastrophe'],
    emoji: '🥞',
    guidedQuestions: ['Why did the robot decide to make 25 pancakes?', 'What happens when the tower starts tilting to the left?', 'Who ends up wearing pancake batter on their nose?'],
    suggestedEmotions: ['Giggling', 'Chaotic', 'Delighted'],
    isFeatured: true,
  },
  {
    id: 'fun-02',
    title: 'The Kitten with the Red Detective Cape',
    prompt: 'A fluffy ginger kitten puts on a tiny red cape and takes his job as household detective very seriously, interrogating a butterfly in the garden.',
    category: 'funny',
    categoryLabel: 'Funny',
    imageUrl: imgAnimalsGarden,
    tag: 'Detective Kitty 🐱',
    starterSentence: 'Barnaby adjusted his tiny red satin cape, sniffed the tulip blossom, and meowed, "Case number forty-two is underway."',
    suggestedWords: ['whiskers', 'magnifying', 'pouncing', 'hilarious', 'investigation'],
    emoji: '🐱',
    guidedQuestions: ['What missing toy is the kitten trying to solve?', 'How does the butterfly outsmart him?', 'What does the golden puppy say about the case?'],
    suggestedEmotions: ['Playful', 'Amused', 'Warm'],
  },

  // ==========================================
  // 7. 🚀 WHAT IF? (61-70)
  // ==========================================
  {
    id: 'wif-01',
    title: 'The City in the Cotton-Candy Clouds',
    prompt: 'What if schools were built on giant pastel pink clouds, and kids flew to recess on colorful giant paper airplanes?',
    category: 'what_if',
    categoryLabel: 'What If?',
    imageUrl: imgWhatIfClouds,
    tag: 'Cloud City ☁️',
    starterSentence: 'I stepped onto the bouncy cloud boardwalk and unfolded the wings of my mint-green glider plane.',
    suggestedWords: ['floating', 'cotton candy', 'gliding', 'sunset', 'skyward'],
    emoji: '☁️',
    guidedQuestions: ['How do people travel between the cloud houses?', 'What happens when a storm cloud passes by?', 'What do students study in cloud school?'],
    suggestedEmotions: ['Dreamy', 'Adventurous', 'Free'],
    isFeatured: true,
  },
  {
    id: 'wif-02',
    title: 'Zero Gravity in the Space Cabin',
    prompt: 'What if you did your school homework in zero gravity, while floating past swirling pink nebula galaxies and glowing moons?',
    category: 'what_if',
    categoryLabel: 'What If?',
    imageUrl: imgCozySpace,
    tag: 'Space Cabin 🪐',
    starterSentence: 'My math pencil drifted gently past my nose as the rings of Saturn glowed through the round cabin window.',
    suggestedWords: ['weightless', 'nebula', 'orbit', 'constellation', 'spacesuit'],
    emoji: '🪐',
    guidedQuestions: ['What is the funniest thing about eating lunch in zero gravity?', 'What constellation looks back at the spaceship?', 'Where is the space cabin traveling next?'],
    suggestedEmotions: ['Awe', 'Weightless', 'Excited'],
    isFeatured: true,
  },

  // ==========================================
  // 8. 🧭 ADVENTURE (71-80)
  // ==========================================
  {
    id: 'adv-01',
    title: 'The Great Treetop Observatory Expedition',
    prompt: 'Two young adventurers climb the rope ladder to a magnificent wooden treehouse with glowing lanterns and telescopes pointed at uncharted lands.',
    category: 'adventure',
    categoryLabel: 'Adventure',
    imageUrl: imgAdventureTreehouse,
    tag: 'Treehouse Map 🗺️',
    starterSentence: 'From the topmost deck of the treehouse, the old parchment map aligned perfectly with the distant jagged mountain peaks.',
    suggestedWords: ['telescope', 'expedition', 'rope ladder', 'compass', 'canopy'],
    emoji: '🗺️',
    guidedQuestions: ['What secret destination is marked with a red X on their map?', 'What tools do they pack in their canvas rucksacks?', 'What surprising creature guards the bridge?'],
    suggestedEmotions: ['Daring', 'Brave', 'Heroic'],
    isFeatured: true,
  },
  {
    id: 'adv-02',
    title: 'Paddling the Underground Crystal River',
    prompt: 'Navigating a wooden canoe along an underground glowing stream, searching for the ancient Lost Lantern of the River Keepers.',
    category: 'adventure',
    categoryLabel: 'Adventure',
    imageUrl: imgCrystalCave,
    tag: 'Underground River 🛶',
    starterSentence: 'The paddles dipped silently into the sparkling turquoise water as the cave ceiling opened into a hall of glowing geodes.',
    suggestedWords: ['navigating', 'stalactite', 'current', 'echoes', 'discovery'],
    emoji: '🛶',
    guidedQuestions: ['How did they discover the entrance to the underground river?', 'What message is etched on the riverbank stone?', 'What treasure awaits at the waterfall?'],
    suggestedEmotions: ['Thrilled', 'Courageous', 'Focused'],
  },

  // ==========================================
  // 9. 🐾 ANIMALS (81-90)
  // ==========================================
  {
    id: 'ani-01',
    title: 'The Secret Garden Animal Detectives',
    prompt: 'In a sunny garden filled with blooming tulips, a kitten with a detective cape and a friendly golden puppy investigate a dancing blue butterfly clue.',
    category: 'animals',
    categoryLabel: 'Animals',
    imageUrl: imgAnimalsGarden,
    tag: 'Garden Patrol 🐾',
    starterSentence: 'Barnaby the kitten tapped the magnifying glass with his paw as the golden puppy sniffed the mysterious floral tracks.',
    suggestedWords: ['pawprints', 'butterflies', 'whiskers', 'investigate', 'sunshine'],
    emoji: '🐾',
    guidedQuestions: ['What secret animal meeting takes place at noon?', 'What is the butterfly trying to tell the pets?', 'How do the animals help the garden grow?'],
    suggestedEmotions: ['Playful', 'Curious', 'Gentle'],
    isFeatured: true,
  },
  {
    id: 'ani-02',
    title: 'The Raincoat Duckling Parade',
    prompt: 'On a rainy afternoon, a flock of friendly yellow ducklings and two children in rain boots splash through puddle rainbows.',
    category: 'animals',
    categoryLabel: 'Animals',
    imageUrl: imgEverydayRain,
    tag: 'Duckling Parade 🦆',
    starterSentence: 'Three tiny ducklings waddled in a neat row right behind my bright yellow rain boots.',
    suggestedWords: ['quacking', 'splashing', 'raincoat', 'puddles', 'parade'],
    emoji: '🦆',
    guidedQuestions: ['Where are the ducklings heading in the rain?', 'How do the children guide them safely across the path?', 'What reward do they get at the pond?'],
    suggestedEmotions: ['Delighted', 'Caring', 'Happy'],
  },

  // ==========================================
  // 10. 📖 FINISH THE STORY (91-100)
  // ==========================================
  {
    id: 'fin-01',
    title: 'The Rainbow Puddle Jump',
    prompt: 'Jump into a puddle, but instead of water splashing, you hear faint piano music and see a doorway beneath the surface!',
    category: 'finish_story',
    categoryLabel: 'Finish the Story',
    imageUrl: imgEverydayRain,
    tag: 'Puddle Portal 🌈',
    starterSentence: 'When Liam stomped his boots into the center of the puddle, the water didn’t splash—it parted like glass to reveal a glowing staircase.',
    suggestedWords: ['staircase', 'ripples', 'splashing', 'submerged', 'reflection'],
    emoji: '🌈',
    guidedQuestions: ['Where does the staircase under the puddle go?', 'Who is waiting at the bottom of the steps?', 'How will Liam return before dinner?'],
    suggestedEmotions: ['Mystified', 'Adventurous', 'Curious'],
    isFeatured: true,
  },
  {
    id: 'fin-02',
    title: 'The Midnight Library Whisper',
    prompt: 'You stayed inside the library after closing time, and suddenly all the picture books opened up by themselves.',
    category: 'finish_story',
    categoryLabel: 'Finish the Story',
    imageUrl: imgLibraryDoor,
    tag: 'Midnight Book 📚',
    starterSentence: 'The library lights went dark with a heavy click, and every book spine on row seven began to softly glow.',
    suggestedWords: ['whispering', 'midnight', 'librarian', 'enchanted', 'lantern'],
    emoji: '📚',
    guidedQuestions: ['What do the book characters do when humans leave?', 'Which character asks for your help first?', 'How do you solve the mystery before morning?'],
    suggestedEmotions: ['Suspenseful', 'Brave', 'Excited'],
  },

  // ==========================================
  // 11. 🎉 SPECIAL DAYS (101-110)
  // ==========================================
  {
    id: 'spc-01',
    title: 'The Enchanted Garden Birthday Party',
    prompt: 'A joyful pastel garden celebration with colorful bunting flags, floating balloons, a giant strawberry cake, and friendly woodland guests!',
    category: 'special_days',
    categoryLabel: 'Special Days',
    imageUrl: imgSpecialParty,
    tag: 'Birthday Party 🎂',
    starterSentence: 'As the twelve candles flickered on the strawberry cake, the garden bunnies hopped over carrying a wrapped flower parcel.',
    suggestedWords: ['bunting', 'strawberry cake', 'celebrate', 'balloons', 'wishes'],
    emoji: '🎂',
    guidedQuestions: ['What wish was made when the candles were blown out?', 'What was the surprise gift inside the flower box?', 'What game did all the party guests play together?'],
    suggestedEmotions: ['Joyful', 'Celebratory', 'Warm'],
    isFeatured: true,
  },
  {
    id: 'spc-02',
    title: 'The Big Stage Performance',
    prompt: 'Standing behind the velvet curtain with butterflies in your stomach, hearing the audience applause and stepping into the warm spotlight.',
    category: 'special_days',
    categoryLabel: 'Special Days',
    imageUrl: imgSpecialParty,
    tag: 'Stage Debut 🎭',
    starterSentence: 'The music began to swell, the heavy red curtain parted, and three hundred smiling faces looked up from the auditorium.',
    suggestedWords: ['spotlight', 'applause', 'butterflies', 'curtain', 'performance'],
    emoji: '🎭',
    guidedQuestions: ['What was the performance about?', 'How did the performer overcome nervousness?', 'How did the audience react at the end?'],
    suggestedEmotions: ['Proud', 'Excited', 'Triumphant'],
  },

  // ==========================================
  // 12. 🏙️ EVERYDAY LIFE (111-120)
  // ==========================================
  {
    id: 'evy-01',
    title: 'The Sidewalk Rainbow Puddle Splash',
    prompt: 'On a fresh rainy afternoon, walking home from school becomes an adventure as raindrops make music on colorful polka-dot umbrellas.',
    category: 'everyday_life',
    categoryLabel: 'Everyday Life',
    imageUrl: imgEverydayRain,
    tag: 'Rainy Day Walk ☔',
    starterSentence: 'The sun broke through the gray clouds just as my yellow raincoat caught the first reflection of the rainbow.',
    suggestedWords: ['sun shower', 'polka-dot', 'pavement', 'rainbow', 'splashing'],
    emoji: '☔',
    guidedQuestions: ['What surprising reflection appeared in the puddle?', 'Who joined the walk under the umbrella?', 'What cozy treat was waiting at home?'],
    suggestedEmotions: ['Cheerful', 'Cozy', 'Reflective'],
    isFeatured: true,
  },
  {
    id: 'evy-02',
    title: 'The Community Planting Morning',
    prompt: 'Neighbours of all ages come together with trowels and watering cans to turn the street corner into a blossoming flower garden.',
    category: 'everyday_life',
    categoryLabel: 'Everyday Life',
    imageUrl: imgCommunityGarden,
    tag: 'Planting Day 🌿',
    starterSentence: 'With green gloves on and a watering can ready, we turned the sunny street corner into a haven for bees and butterflies.',
    suggestedWords: ['blossom', 'trowel', 'watering', 'neighbors', 'sunshine'],
    emoji: '🌿',
    guidedQuestions: ['What flowers were planted in the front row?', 'What stories did the neighbors share while working?', 'How did the street look by sunset?'],
    suggestedEmotions: ['Content', 'Connected', 'Energetic'],
  },
  {
    id: 'evy-03',
    title: 'The Mystery Note in the Breakfast Bowl',
    prompt: 'Sitting down for morning cereal, a mysterious colorful parchment card floats up from the bottom of the bowl with today’s secret mission.',
    category: 'everyday_life',
    categoryLabel: 'Everyday Life',
    imageUrl: imgFunnyPancakes,
    tag: 'Breakfast Clue 🥣',
    starterSentence: 'As the milk poured over the flakes, a waterproof purple envelope surfaced with the words: "MISSION: SPREAD THREE SMILES TODAY."',
    suggestedWords: ['cereal', 'envelope', 'secret mission', 'morning', 'smile'],
    emoji: '🥣',
    guidedQuestions: ['Who placed the waterproof mission note in the bowl?', 'How does the student carry out the three smiles mission?', 'What reward is waiting at the end of the day?'],
    suggestedEmotions: ['Inspired', 'Playful', 'Determined'],
  },
];
