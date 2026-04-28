/**
 * Maps attractions to their land/area for each park.
 * Uses keyword matching on attraction names (case-insensitive).
 * Each land has an `order` so sections render in natural walking order.
 */

export interface LandDef {
  name: string;
  keywords: string[];
  order: number;
}

const PARK_LANDS: Record<string, LandDef[]> = {
  // ── Disneyland ────────────────────────────────────────────────────────────
  disneyland: [
    { name: "Main Street, U.S.A.", order: 1, keywords: ["main street", "great moments"] },
    { name: "Adventureland", order: 2, keywords: ["jungle cruise", "indiana jones", "treehouse", "enchanted tiki", "adventureland"] },
    { name: "New Orleans Square", order: 3, keywords: ["haunted mansion", "pirates of the caribbean", "new orleans"] },
    { name: "Frontierland", order: 4, keywords: ["big thunder", "splash mountain", "tiana's", "mark twain", "sailing ship columbia", "frontierland", "frontier"] },
    { name: "Fantasyland", order: 5, keywords: ["small world", "matterhorn", "peter pan", "dumbo", "mr. toad", "snow white", "pinocchio", "sleeping beauty", "king arthur", "alice in", "fantasy faire", "storybook"] },
    { name: "Mickey's Toontown", order: 6, keywords: ["toontown", "roger rabbit", "chip 'n' dale", "mickey's", "minnie's", "donald's"] },
    { name: "Tomorrowland", order: 7, keywords: ["space mountain", "finding nemo", "buzz lightyear", "star tours", "tomorrowland", "autopia", "astro", "hyperspace"] },
    { name: "Star Wars: Galaxy's Edge", order: 8, keywords: ["millennium falcon", "rise of the resistance", "galaxy's edge", "oga's", "savi's", "star wars"] },
  ],

  // ── Disney California Adventure ───────────────────────────────────────────
  "california-adventure": [
    { name: "Buena Vista Street", order: 1, keywords: ["buena vista", "carthay"] },
    { name: "Hollywood Land", order: 2, keywords: ["guardians", "webslingers", "animation academy", "hyperion", "hollywood land", "tower of terror", "monsters"] },
    { name: "Avengers Campus", order: 3, keywords: ["avengers", "iron man", "spider-man", "doctor strange", "ant-man"] },
    { name: "Grizzly Peak", order: 4, keywords: ["grizzly", "soarin'", "soarin ", "redwood creek"] },
    { name: "Pacific Wharf", order: 5, keywords: ["pacific wharf", "bay area"] },
    { name: "Cars Land", order: 6, keywords: ["radiator springs", "mater's", "luigi's", "cars land"] },
    { name: "Paradise Gardens Park", order: 7, keywords: ["goofy's", "jumpin'", "paradise gardens", "golden zephyr", "silly symphony"] },
    { name: "Pixar Pier", order: 8, keywords: ["incredicoaster", "inside out", "toy story", "jessie's", "pixar pal-a-round", "pixar pier", "lamplight"] },
  ],

  // ── Magic Kingdom ─────────────────────────────────────────────────────────
  "magic-kingdom": [
    { name: "Main Street, U.S.A.", order: 1, keywords: ["main street", "ferry", "monorail", "town square"] },
    { name: "Adventureland", order: 2, keywords: ["jungle cruise", "pirates of the caribbean", "magic carpets", "enchanted tiki", "adventureland", "swiss family"] },
    { name: "Frontierland", order: 3, keywords: ["big thunder", "tiana's", "tom sawyer", "frontierland", "country bear"] },
    { name: "Liberty Square", order: 4, keywords: ["haunted mansion", "hall of presidents", "liberty belle", "liberty square"] },
    { name: "Fantasyland", order: 5, keywords: ["seven dwarfs", "peter pan", "it's a small world", "small world", "cinderella", "under the sea", "winnie the pooh", "beauty and the beast", "ariel", "prince charming"] },
    { name: "Storybook Circus", order: 6, keywords: ["storybook circus", "dumbo", "barnstormer", "casey jr.", "tomorrowland speedway"] },
    { name: "Tomorrowland", order: 7, keywords: ["space mountain", "buzz lightyear", "tomorrowland", "astro orbiter", "tron", "monsters inc", "carousel of progress", "peoplemover"] },
  ],

  // ── EPCOT ─────────────────────────────────────────────────────────────────
  epcot: [
    { name: "World Celebration", order: 1, keywords: ["spaceship earth", "club cool", "creations shop", "festival center"] },
    { name: "World Discovery", order: 2, keywords: ["guardians of the galaxy", "test track", "mission: space", "play pavilion", "innoventions"] },
    { name: "World Nature", order: 3, keywords: ["living with the land", "turtle talk", "journey of water", "the seas", "soarin'", "soarin "] },
    { name: "World Showcase", order: 4, keywords: ["frozen ever after", "remy", "gran fiesta", "american adventure", "mexico pavilion", "norway pavilion", "china pavilion", "germany pavilion", "italy pavilion", "american pavilion", "japan pavilion", "morocco pavilion", "france pavilion", "united kingdom pavilion", "canada pavilion", "world showcase", "reflections of china", "impressions de france", "o canada"] },
  ],

  // ── Hollywood Studios ─────────────────────────────────────────────────────
  "hollywood-studios": [
    { name: "Hollywood Boulevard", order: 1, keywords: ["hollywood boulevard", "the great movie ride", "mickey's philhar"] },
    { name: "Echo Lake", order: 2, keywords: ["indiana jones", "star tours", "echo lake", "jedi training"] },
    { name: "Grand Avenue", order: 3, keywords: ["muppet*vision", "grand avenue"] },
    { name: "Star Wars: Galaxy's Edge", order: 4, keywords: ["millennium falcon", "rise of the resistance", "galaxy's edge", "oga's", "star wars"] },
    { name: "Toy Story Land", order: 5, keywords: ["slinky dog", "alien swirling", "toy story mania", "toy story land"] },
    { name: "Animation Courtyard", order: 6, keywords: ["disney junior", "voyage of the little mermaid", "animation courtyard"] },
    { name: "Sunset Boulevard", order: 7, keywords: ["tower of terror", "rock 'n' roller", "rock n roll", "sunset boulevard", "beauty and the beast"] },
  ],

  // ── Animal Kingdom ────────────────────────────────────────────────────────
  "animal-kingdom": [
    { name: "Oasis", order: 1, keywords: ["oasis exhibits"] },
    { name: "Discovery Island", order: 2, keywords: ["tree of life", "discovery island", "it's tough to be a bug", "tough to be a bug"] },
    { name: "Pandora – The World of Avatar", order: 3, keywords: ["flight of passage", "na'vi river", "pandora", "avatar"] },
    { name: "Africa", order: 4, keywords: ["kilimanjaro", "gorilla falls", "festival of the lion king", "africa", "harambe", "wildlife express"] },
    { name: "Asia", order: 5, keywords: ["expedition everest", "kali river", "maharajah jungle", "asia", "UP! a great bird"] },
    { name: "DinoLand U.S.A.", order: 6, keywords: ["dinosaur", "primeval whirl", "finding nemo", "dino", "triceratop spin"] },
  ],

  // ── Universal Studios Hollywood ───────────────────────────────────────────
  "universal-hollywood": [
    { name: "Upper Lot", order: 1, keywords: ["despicable me", "minion", "the simpsons", "studio tour", "special effects show", "animal actors", "water world", "waterworld", "backdraft", "fast & furious", "fast and furious"] },
    { name: "The Wizarding World of Harry Potter", order: 2, keywords: ["harry potter", "wizarding world", "forbidden journey", "flight of the hippogriff", "hogsmeade", "ollivanders"] },
    { name: "Super Nintendo World", order: 3, keywords: ["mario kart", "yoshi", "super nintendo", "nintendo", "donkey kong", "mario"] },
    { name: "Lower Lot", order: 4, keywords: ["transformers", "revenge of the mummy", "mummy", "jurassic world", "raptor encounter", "dinoplay", "lower lot"] },
  ],

  // ── Universal Studios Florida ─────────────────────────────────────────────
  "universal-studios-florida": [
    { name: "Production Central", order: 1, keywords: ["hollywood rip ride rockit", "rip ride", "shrek", "despicable me"] },
    { name: "New York", order: 2, keywords: ["race through new york", "revenge of the mummy", "mummy", "new york"] },
    { name: "San Francisco", order: 3, keywords: ["fast & furious", "fast and furious", "san francisco"] },
    { name: "The Wizarding World of Harry Potter – Diagon Alley", order: 4, keywords: ["diagon alley", "escape from gringotts", "hogwarts express", "ollivanders"] },
    { name: "Springfield: Home of the Simpsons", order: 5, keywords: ["simpsons", "kang & kodos", "springfield"] },
    { name: "World Expo", order: 6, keywords: ["men in black", "fear factor", "world expo"] },
    { name: "Woody Woodpecker's KidZone", order: 7, keywords: ["woody woodpecker", "fievel's", "e.t. adventure", "animal actors", "a day in the park"] },
    { name: "Hollywood", order: 8, keywords: ["terminator", "universal orlando horror", "hollywood"] },
  ],

  // ── Islands of Adventure ──────────────────────────────────────────────────
  "islands-of-adventure": [
    { name: "Port of Entry", order: 1, keywords: ["port of entry"] },
    { name: "Marvel Super Hero Island", order: 2, keywords: ["amazing adventures of spider-man", "doctor doom", "incredible hulk", "storm force", "marvel"] },
    { name: "Toon Lagoon", order: 3, keywords: ["dudley do-right", "popeye", "toon lagoon"] },
    { name: "Skull Island", order: 4, keywords: ["skull island", "kong"] },
    { name: "Jurassic World", order: 5, keywords: ["jurassic world", "velocicoaster", "jurassic park river", "camp jurassic", "pteranodon flyers", "raptor encounter"] },
    { name: "The Wizarding World of Harry Potter – Hogsmeade", order: 6, keywords: ["hogsmeade", "forbidden journey", "flight of the hippogriff", "hogwarts express", "harry potter and the forbidden", "ollivanders"] },
    { name: "The Lost Continent", order: 7, keywords: ["poseidon's fury", "sindbad", "lost continent", "the eighth voyage"] },
    { name: "Seuss Landing", order: 8, keywords: ["seuss", "the cat in the hat", "caro-seuss-el", "one fish two fish", "the high in the sky"] },
  ],

  // ── Epic Universe ─────────────────────────────────────────────────────────
  "epic-universe": [
    { name: "Celestial Park", order: 1, keywords: ["starfall racers", "constellation carousel", "celestial park"] },
    { name: "Super Nintendo World", order: 2, keywords: ["mario kart", "yoshi's adventure", "donkey kong", "nintendo", "mario"] },
    { name: "The Wizarding World of Harry Potter – Ministry of Magic", order: 3, keywords: ["ministry of magic", "harry potter and the battle", "wizarding world"] },
    { name: "How to Train Your Dragon – Isle of Berk", order: 4, keywords: ["hiccup", "dragon", "berk", "how to train"] },
    { name: "MONSTER-VERSE", order: 5, keywords: ["godzilla", "kong", "monsterverse", "monster"] },
  ],
};

export function getLandForAttraction(attractionName: string, parkSlug: string): string {
  const lands = PARK_LANDS[parkSlug];
  if (!lands) return "Attractions";

  const lower = attractionName.toLowerCase();
  for (const land of lands) {
    if (land.keywords.some((k) => lower.includes(k.toLowerCase()))) {
      return land.name;
    }
  }
  return "Other";
}

export function getLandsForPark(parkSlug: string): string[] {
  const lands = PARK_LANDS[parkSlug];
  if (!lands) return [];
  return lands
    .sort((a, b) => a.order - b.order)
    .map((l) => l.name)
    .concat(["Other"]);
}
