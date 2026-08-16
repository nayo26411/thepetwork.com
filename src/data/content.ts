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

export const VIDEOS: Video[] = [
  // DOGS
  {
    id: "peUVLEUj-AM",
    title: "Owning a Dog | Things to Know Before Getting a Puppy",
    channel: "Doctor Mike",
    species: "Dogs",
    duration: "4:51",
  },
  {
    id: "ckWzAqJEhKg",
    title: "Your Complete First Week Puppy Training Plan",
    channel: "McCann Dog Training",
    species: "Dogs",
    duration: "19:02",
  },
  {
    id: "aI6G14oE0v8",
    title: "Caring for Your Senior Dog: Essential Tips",
    channel: "McCann Dog Training",
    species: "Dogs",
    duration: "13:42",
  },

  // CATS
  {
    id: "sctuy_arPMg",
    title: "10 Things I Wish I Knew Before Adopting a Cat",
    channel: "Jackson Galaxy",
    species: "Cats",
    duration: "14:54",
  },
  {
    id: "ch9GLtDp6c0",
    title: "New Kitten? 5 Tips Every Cat Owner Should Know",
    channel: "Rescue Vet",
    species: "Cats",
    duration: "3:54",
  },
  {
    id: "gRrQGom_1oo",
    title: "Introducing a Cat to a Dog Safely",
    channel: "Jackson Galaxy",
    species: "Cats",
    duration: "12:15",
  },
  {
    id: "Y0118rN031I",
    title: "Cat Body Language 101",
    channel: "Jackson Galaxy",
    species: "Cats",
    duration: "11:22",
  },

  // BIRDS
  {
    id: "t_Q7WMntlMo",
    title: "How to Take Care of a Parakeet — Beginner's Guide",
    channel: "Bird Nuggets",
    species: "Birds",
    duration: "14:49",
  },
  {
    id: "2gL7CQtFmcM",
    title: "10 Things You Should Know Before You Get a Pet Bird",
    channel: "BirdTricks",
    species: "Birds",
    duration: "4:49",
  },
  {
    id: "bY7tV8HqHnI",
    title: "Budgie Care 101: Everything You Need to Know",
    channel: "BirdTricks",
    species: "Birds",
    duration: "11:15",
  },
  {
    id: "rF40w6sI-y4",
    title: "How to Bond With Your Pet Bird",
    channel: "BirdTricks",
    species: "Birds",
    duration: "11:02",
  },

  // RABBITS
  {
    id: "pxoriD4weO0",
    title: "Rabbit 101: Rabbit Care Guide for Beginners",
    channel: "Pets Life",
    species: "Rabbits",
    duration: "8:06",
  },
  {
    id: "n3OwgFrZ4zY",
    title: "Beginner's Guide to Caring for a Pet Rabbit",
    channel: "Learn about Animals",
    species: "Rabbits",
    duration: "8:40",
  },
  {
    id: "K7Z6zP2E69w",
    title: "Rabbit Care 101: How to Care for a Rabbit",
    channel: "Lennon The Bunny",
    species: "Rabbits",
    duration: "8:01",
  },
  {
    id: "1z9FhW3qLQE",
    title: "How to Litter Train Your Rabbit",
    channel: "Lennon The Bunny",
    species: "Rabbits",
    duration: "7:51",
  },

  // REPTILES
  {
    id: "GarmW8Tc9QY",
    title: "The Top 5 Mistakes New Reptile Keepers Make",
    channel: "Snake Discovery",
    species: "Reptiles",
    duration: "21:12",
  },
  {
    id: "TkrjaJC5680",
    title: "First Pet Reptile Mistakes You Need to Avoid",
    channel: "Wickens Wicked Reptiles",
    species: "Reptiles",
    duration: "13:50",
  },
  {
    id: "_iTf8aX5d7k",
    title: "Bearded Dragon Setup: The Complete Guide",
    channel: "Snake Discovery",
    species: "Reptiles",
    duration: "18:24",
  },
  {
    id: "e_6t-xP3D2k",
    title: "Setting Up Your First Reptile Enclosure",
    channel: "Snake Discovery",
    species: "Reptiles",
    duration: "14:03",
  },

  // FISH
  {
    id: "o2Yl_u621l0",
    title: "Goldfish Care: Setting Up Your First Tank",
    channel: "Girl Talks Fish",
    species: "Fish",
    duration: "12:47",
  },

  // HAMSTERS
  {
    id: "xj68J9g1Nyo",
    title: "HAMSTER CARE 101: Everything You Need!",
    channel: "Victoria Raechel",
    species: "Hamsters",
    duration: "22:56",
  },

  // GENERAL PET CARE
  {
    id: "T8uK_0vB5sQ",
    title: "Pet First Aid Basics Every Owner Should Know",
    channel: "Veterinary Secret",
    species: "Other",
    duration: "10:14",
  },
];
];

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
