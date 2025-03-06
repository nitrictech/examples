export interface Suggestion {
  text: string;
  prompt: string;
}

const artStyles = [
  "grunge",
  "punk zine",
  "distressed collage",
  "crayon doodle",
];

const basePrompts: { text: string; prompt: string }[] = [
  {
    text: "Whiskey Wisdom",
    prompt:
      "A scruffy man in a stained bathrobe, holding a whiskey bottle, lecturing a cat about the meaning of life in a dimly lit alley.",
  },
  {
    text: "Dumpster Throne",
    prompt:
      "A guy in a tattered tracksuit sitting on a pile of garbage like it's a throne, holding a half-eaten pizza slice like a royal scepter.",
  },
  {
    text: "Beer Baptism",
    prompt:
      "A drunk pigeon being 'baptized' with a can of cheap beer by a disheveled man shouting about enlightenment.",
  },
  {
    text: "Toaster Spa",
    prompt:
      "A raccoon chilling in a broken toaster, cucumber slices on its eyes, pretending it's a luxury spa.",
  },
  {
    text: "Cigarette Samurai",
    prompt:
      "A rugged-looking man in a bathrobe wielding a bent cigarette like a samurai sword, ready to duel a very unimpressed goose.",
  },
  {
    text: "Subway Sorcerer",
    prompt:
      "A bearded man in a wizard robe (probably a blanket) casting spells on subway rats with a traffic cone as a staff.",
  },
  {
    text: "Meth Lab Chihuahua",
    prompt:
      "A shaky chihuahua in an oversized hoodie, staring at the camera like it just discovered the secrets of the universe.",
  },
  {
    text: "Expired Milk Prophet",
    prompt:
      "A man preaching on the street while holding a carton of expired milk, warning strangers about the impending dairy apocalypse.",
  },
  {
    text: "Couch Pirate",
    prompt:
      "A man wearing an eyepatch, digging for 'treasure' between couch cushions, celebrating wildly after finding a single fry.",
  },
  {
    text: "Bathroom Philosopher",
    prompt:
      "A guy sitting on a toilet, completely zoned out, contemplating life while holding an empty roll of toilet paper.",
  },
  {
    text: "Homeless Jedi",
    prompt:
      "A bearded man waving around a broken broomstick like a lightsaber, dueling an invisible Sith Lord in an alleyway.",
  },
  {
    text: "Hangover Renaissance",
    prompt:
      "A man lying on the floor, beer cans surrounding him, gazing at the ceiling like he's in a Renaissance painting.",
  },
  {
    text: "Ferret Crime Boss",
    prompt:
      "A ferret wearing tiny sunglasses and a gold chain, sitting atop a stack of stolen wallets, plotting its next heist.",
  },
  {
    text: "Pizza Cult",
    prompt:
      "A group of people in tattered robes chanting around a half-eaten pizza slice like it’s a sacred relic.",
  },
  {
    text: "Grocery Store Gladiator",
    prompt:
      "A man in an oversized hoodie, wielding a baguette like a sword, preparing for battle in the supermarket aisle.",
  },
  {
    text: "Rat King Ruler",
    prompt:
      "A scruffy man wearing a crown made of soda cans, surrounded by an army of well-trained alley rats.",
  },
  {
    text: "Cursed Vending Machine",
    prompt:
      "A man furiously shaking a vending machine, convinced it's conspiring against him while a raccoon watches in amusement.",
  },
  {
    text: "Laundry Mat Oracle",
    prompt:
      "A woman staring into a spinning washing machine like it's a crystal ball, mumbling about 'the prophecies.'",
  },
  {
    text: "Pigeon Mafia",
    prompt:
      "A group of pigeons huddled together on a rooftop, looking extremely suspicious, as if they're plotting a coup.",
  },
  {
    text: "Sewer Tavern",
    prompt:
      "A group of raccoons huddled around a burning trash can, drinking from stolen soda cans like medieval tavern-goers.",
  },
  {
    text: "Half-Eaten Sandwich Saga",
    prompt:
      "A guy in a trench coat dramatically retrieving a half-eaten sandwich from the sidewalk as if it’s a lost relic.",
  },
  {
    text: "TV Static Guru",
    prompt:
      "A man in a foil hat staring at a static-filled TV screen, claiming he’s receiving messages from 'beyond the grid.'",
  },
];

function shuffle<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function getRandomSuggestions(count: number = 5): Suggestion[] {
  const shuffledPrompts = shuffle(basePrompts);
  const shuffledStyles = shuffle(artStyles);

  return shuffledPrompts.slice(0, count).map((item, index) => ({
    text: item.text,
    prompt: `${item.prompt}, in the style of ${
      shuffledStyles[index % shuffledStyles.length]
    }`,
  }));
}
