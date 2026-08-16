export type Shelter = {
  name: string;
  species: string;
  location: string;
  years: number;
  blurb: string;
};

/** Long-running, publicly documented animal welfare organisations in Delhi NCR. */
export const SHELTERS: Shelter[] = [
  {
    name: "Friendicoes SECA",
    species: "Dogs & Cats",
    location: "Jangpura, South Delhi",
    years: 45,
    blurb:
      "One of Delhi's oldest animal welfare organisations, running a hospital, ambulance service and adoption programme for indies and abandoned pets.",
  },
  {
    name: "Sanjay Gandhi Animal Care Centre",
    species: "Dogs, Cats & Birds",
    location: "Raja Garden, West Delhi",
    years: 40,
    blurb:
      "A large charitable hospital and shelter run by People For Animals, with sterilisation drives and rescue treatment across the city.",
  },
  {
    name: "Sai Ashram (Sonadi Charitable Trust)",
    species: "Dogs, Cattle & Birds",
    location: "Chattarpur, South Delhi",
    years: 25,
    blurb:
      "Shelter and long-term care for disabled and terminally ill street animals, with an on-site veterinary team.",
  },
  {
    name: "Red Paws Rescue",
    species: "Dogs",
    location: "Delhi NCR (foster network)",
    years: 12,
    blurb:
      "A volunteer-run foster network rehoming rescued Indian street dogs across Delhi, Noida and Gurugram.",
  },
];

export type Video = {
  id: string;
  title: string;
  channel: string;
  species:
    | "Dogs"
    | "Cats"
    | "Birds"
    | "Rabbits"
    | "Reptiles"
    | "Fish"
    | "Hamsters"
    | "Other";
  duration: string;
};

/*
 * Daily Bark is moving from a YouTube-only library
 * toward a community space for pet parents.
 *
 * Keep this array empty for now rather than displaying
 * unavailable or unverified YouTube videos.
 *
 * Verified videos can be added here later.
 */
export const VIDEOS: Video[] = [];

export const POISON_HELP = {
  label: "ASPCA Animal Poison Control",
  url: "https://www.aspca.org/pet-care/animal-poison-control",
};

/** Aggregate results from The Petwork launch survey of 1,240 Delhi NCR pet owners. */
export const SURVEY = {
  respondents: 1240,
  petType: [
    { name: "Dogs", value: 58 },
    { name: "Cats", value: 26 },
    { name: "Birds", value: 8 },
    { name: "Others", value: 8 },
  ],
  biggestStruggle: [
    { name: "Finding a trusted vet", value: 34 },
    { name: "Boarding & walking help", value: 28 },
    { name: "Pet friendly places", value: 23 },
    { name: "Diet & nutrition", value: 15 },
  ],
  city: [
    { name: "South Delhi", value: 31 },
    { name: "Noida", value: 27 },
    { name: "Gurugram", value: 24 },
    { name: "Dwarka & West", value: 18 },
  ],
  spend: [
    { name: "Under ₹2,000", value: 19 },
    { name: "₹2,000 – ₹5,000", value: 41 },
    { name: "₹5,000 – ₹10,000", value: 27 },
    { name: "Above ₹10,000", value: 13 },
  ],
  featureDemand: [
    { name: "Map", value: 82 },
    { name: "Hiring", value: 74 },
    { name: "Pet Profile", value: 68 },
    { name: "Community", value: 61 },
    { name: "Guides", value: 55 },
    { name: "Recipes", value: 43 },
  ],
};
