export type Category =
  | "Veterinary Clinic"
  | "Grooming Salon"
  | "Pet Store"
  | "Pet Friendly Cafe"
  | "Pet Friendly Hotel"
  | "Off Leash Park";

export type PetPlace = {
  id: string;
  name: string;
  category: Category;
  address: string;
  hours: string;
  conditions: string[];
  lat: number;
  lng: number;
  image: string;
  published?: boolean;
};

export const CATEGORY_COLORS: Record<Category, string> = {
  "Veterinary Clinic": "#8B5E3C",
  "Grooming Salon": "#957662",
  "Pet Store": "#6B4632",
  "Pet Friendly Cafe": "#A66A3F",
  "Pet Friendly Hotel": "#7A5138",
  "Off Leash Park": "#B89578",
};

export const CATEGORIES = Object.keys(CATEGORY_COLORS) as Category[];

/*
 * Curated fallback images by location type.
 *
 * These are stable Unsplash image URLs rather than random placeholder
 * services, so the same image will consistently load for every listing.
 */
const IMAGES = {
  cafe:
    "https://images.unsplash.com/photo-1554118811-1e0d58224f31?auto=format&fit=crop&w=1200&q=85",

  hotel:
    "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=85",

  vet:
    "https://images.unsplash.com/photo-1628009368231-7bb7cfcb0def?auto=format&fit=crop&w=1200&q=85",

  grooming:
    "https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?auto=format&fit=crop&w=1200&q=85",

  petStore:
    "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&w=1200&q=85",

  park:
    "https://images.unsplash.com/photo-1558788353-f76d92427f16?auto=format&fit=crop&w=1200&q=85",
};

export const PET_PLACES: PetPlace[] = [
  // ============================================================
  // CAFES
  // ============================================================

  {
    id: "atheyka",
    name: "Atheyka Cafe",
    category: "Pet Friendly Cafe",
    address: "Sector 137, Noida, Uttar Pradesh 201305",
    hours: "Mon–Sun, 11:00 AM – 11:00 PM",
    conditions: [
      "Dogs allowed across the cafe",
      "Large breeds must stay on leash at all times",
      "No entry inside for dogs above 15 kg — outdoor deck only",
    ],
    lat: 28.5008,
    lng: 77.4142,
    image: IMAGES.cafe,
  },

  {
    id: "colocal",
    name: "Colocal Cafe",
    category: "Pet Friendly Cafe",
    address: "Sector 18 Market, Noida, Uttar Pradesh 201301",
    hours: "Mon–Sun, 8:30 AM – 10:30 PM",
    conditions: [
      "Dogs welcome in outdoor seating only",
      "Water bowls provided on request",
      "Owners must clean up after their pet",
    ],
    lat: 28.5708,
    lng: 77.3261,
    image: IMAGES.cafe,
  },

  {
    id: "roastery",
    name: "Roastery Coffee House",
    category: "Pet Friendly Cafe",
    address: "Sector 104, Noida Expressway, Noida 201304",
    hours: "Mon–Sun, 9:00 AM – 11:00 PM",
    conditions: [
      "Small and medium dogs allowed",
      "Must be leashed at all times",
      "Pets not allowed on furniture or seating",
    ],
    lat: 28.5445,
    lng: 77.3403,
    image: IMAGES.cafe,
  },

  {
    id: "cyberhub",
    name: "DLF Cyber Hub",
    category: "Pet Friendly Cafe",
    address: "DLF Cyber City, Phase 2, Gurugram, Haryana 122002",
    hours: "Mon–Sun, 10:00 AM – 1:00 AM",
    conditions: [
      "Pet friendly outdoor plaza and promenade areas",
      "Dogs on leash only",
      "Individual restaurants may refuse indoor entry",
    ],
    lat: 28.4949,
    lng: 77.0886,
    image: IMAGES.cafe,
  },

  {
    id: "cafe-lodhi",
    name: "The Big Chill Cakery, Khan Market",
    category: "Pet Friendly Cafe",
    address: "Khan Market, New Delhi 110003",
    hours: "Mon–Sun, 12:00 PM – 11:00 PM",
    conditions: [
      "Dogs allowed at pavement tables only",
      "Leash mandatory, no pets on chairs",
      "Water bowls provided free of charge",
    ],
    lat: 28.6002,
    lng: 77.2273,
    image: IMAGES.cafe,
  },

  {
    id: "cafe-hauzkhas",
    name: "Kunzum Travel Cafe, Hauz Khas",
    category: "Pet Friendly Cafe",
    address: "T-49 Hauz Khas Village, New Delhi 110016",
    hours: "Tue–Sun, 11:00 AM – 7:30 PM",
    conditions: [
      "Well-behaved dogs allowed indoors",
      "Must be leashed and stay off the book shelves",
      "One pet per table",
    ],
    lat: 28.5535,
    lng: 77.1946,
    image: IMAGES.cafe,
  },

  {
    id: "cafe-cyberhub-social",
    name: "Social, Cyber Hub Gurgaon",
    category: "Pet Friendly Cafe",
    address: "DLF Cyber Hub, Gurugram 122002",
    hours: "Mon–Sun, 11:00 AM – 12:30 AM",
    conditions: [
      "Dogs allowed in the outdoor section only",
      "Leash required",
      "Pet-safe plain water served on request",
    ],
    lat: 28.4956,
    lng: 77.0892,
    image: IMAGES.cafe,
  },

  {
    id: "cafe-dwarka",
    name: "Cafe Woof, Dwarka",
    category: "Pet Friendly Cafe",
    address: "Sector 10 Market, Dwarka, New Delhi 110075",
    hours: "Mon–Sun, 9:00 AM – 10:00 PM",
    conditions: [
      "Fully pet friendly indoors and outdoors",
      "Dog menu with plain chicken and curd bowls",
      "Dogs in heat not permitted",
    ],
    lat: 28.5806,
    lng: 77.0574,
    image: IMAGES.cafe,
  },

  {
    id: "piano-man-safdarjung",
    name: "The Piano Man Jazz Club, Safdarjung",
    category: "Pet Friendly Cafe",
    address:
      "3, Kailash Hotel Complex, Africa Avenue, Safdarjung Enclave, New Delhi 110029",
    hours: "Mon–Sun, 7:00 PM – 12:30 AM",
    conditions: [
      "Dogs allowed only in the outdoor courtyard seating",
      "Evenings only",
      "Keep pets calm during live performances",
    ],
    lat: 28.5687,
    lng: 77.1954,
    image: IMAGES.cafe,
  },

  {
    id: "cafe-lota-pragati-maidan",
    name: "Cafe Lota, Pragati Maidan",
    category: "Pet Friendly Cafe",
    address:
      "Crafts Museum Complex, Bhairon Marg, Pragati Maidan, New Delhi 110001",
    hours: "Mon–Sun, 11:00 AM – 8:00 PM",
    conditions: [
      "Small dogs only, up to 10 kg",
      "Outdoor courtyard seating only",
      "Leash mandatory near museum walkways",
    ],
    lat: 28.6157,
    lng: 77.2431,
    image: IMAGES.cafe,
  },

  {
    id: "all-american-diner-ihc",
    name: "All American Diner, India Habitat Centre",
    category: "Pet Friendly Cafe",
    address: "Lodhi Road, India Habitat Centre, New Delhi 110003",
    hours: "Mon–Sun, 8:00 AM – 11:00 PM",
    conditions: [
      "Pets allowed at outside terrace tables only",
      "No pet entry inside the diner",
      "Leash required at all times",
    ],
    lat: 28.5875,
    lng: 77.2246,
    image: IMAGES.cafe,
  },

  {
    id: "soi7-gurugram",
    name: "Soi 7 Pub & Brewery, Gurugram",
    category: "Pet Friendly Cafe",
    address: "Sector 29, Gurugram 122001",
    hours: "Fri–Sun, 5:00 PM – 1:00 AM",
    conditions: [
      "Pets welcome on the outdoor lawn on weekends",
      "No pets in the indoor bar",
      "Water bowls available on request",
    ],
    lat: 28.4664,
    lng: 77.0654,
    image: IMAGES.cafe,
  },

  // ============================================================
  // HOTELS
  // ============================================================

  {
    id: "claridges",
    name: "The Claridges Hotel",
    category: "Pet Friendly Hotel",
    address: "12 Dr. APJ Abdul Kalam Road, New Delhi 110011",
    hours: "Front desk open 24 hours",
    conditions: [
      "Pets allowed up to 10 kg",
      "Refundable pet deposit required at check-in",
      "Dedicated in-room pet menu available",
    ],
    lat: 28.5983,
    lng: 77.2103,
    image: IMAGES.hotel,
  },

  {
    id: "taj-mansingh",
    name: "Taj Mahal Hotel, Man Singh Road",
    category: "Pet Friendly Hotel",
    address: "1 Man Singh Road, New Delhi 110011",
    hours: "Front desk open 24 hours",
    conditions: [
      "Dogs allowed in select room categories only",
      "Prior booking and confirmation required",
      "Size restrictions apply",
    ],
    lat: 28.6096,
    lng: 77.2213,
    image: IMAGES.hotel,
  },

  {
    id: "hotel-leela",
    name: "The Leela Ambience, Gurugram",
    category: "Pet Friendly Hotel",
    address: "Ambience Island, NH-8, Gurugram 122002",
    hours: "Front desk open 24 hours",
    conditions: [
      "Pets up to 12 kg allowed in select rooms",
      "Pets not permitted in restaurants or pool deck",
      "One-time cleaning fee applies",
    ],
    lat: 28.5044,
    lng: 77.096,
    image: IMAGES.hotel,
  },

  {
    id: "hotel-lalit",
    name: "The Lalit, Connaught Place",
    category: "Pet Friendly Hotel",
    address: "Barakhamba Avenue, Connaught Place, New Delhi 110001",
    hours: "Front desk open 24 hours",
    conditions: [
      "Small dogs and cats allowed with prior intimation",
      "Pet must be crated when housekeeping enters",
      "Damage charges billed to the room",
    ],
    lat: 28.6293,
    lng: 77.2261,
    image: IMAGES.hotel,
  },

  {
    id: "hotel-roseate",
    name: "Roseate House, Aerocity",
    category: "Pet Friendly Hotel",
    address: "Asset 10, Aerocity, New Delhi 110037",
    hours: "Front desk open 24 hours",
    conditions: [
      "Dogs under 15 kg welcome in garden-facing rooms",
      "Pet bed and bowls provided on request",
      "Pets must be leashed in public areas",
    ],
    lat: 28.5525,
    lng: 77.1218,
    image: IMAGES.hotel,
  },

  {
    id: "oberoi-new-delhi",
    name: "The Oberoi, New Delhi",
    category: "Pet Friendly Hotel",
    address: "Dr. Zakir Hussain Marg, New Delhi 110003",
    hours: "Front desk open 24 hours",
    conditions: [
      "Small pets accepted with prior notice",
      "Pet bed and bowls provided in-room",
      "Pets not permitted in restaurants, spa or pool areas",
    ],
    lat: 28.5978,
    lng: 77.2276,
    image: IMAGES.hotel,
  },

  {
    id: "itc-maurya",
    name: "ITC Maurya, New Delhi",
    category: "Pet Friendly Hotel",
    address: "Sardar Patel Marg, Diplomatic Enclave, New Delhi 110021",
    hours: "Front desk open 24 hours",
    conditions: [
      "Pet friendly rooms available on request",
      "Dogs up to 25 kg accepted",
      "Housekeeping requires pets to be secured during service",
    ],
    lat: 28.5964,
    lng: 77.1758,
    image: IMAGES.hotel,
  },

  {
    id: "lemon-tree-aerocity",
    name: "Lemon Tree Premier, Aerocity",
    category: "Pet Friendly Hotel",
    address: "Asset 8, Aerocity, New Delhi 110037",
    hours: "Front desk open 24 hours",
    conditions: [
      "Prior intimation required at booking",
      "Small breeds only",
      "One-time pet cleaning fee added to bill",
    ],
    lat: 28.5493,
    lng: 77.1201,
    image: IMAGES.hotel,
  },

  // ============================================================
  // VETERINARY CLINICS
  // ============================================================

  {
    id: "maxpetz-vk",
    name: "Maxpetz Veterinary Hospital",
    category: "Veterinary Clinic",
    address: "Vasant Kunj, New Delhi 110070",
    hours: "Mon–Sat, 10:00 AM – 8:00 PM · Sun, 11:00 AM – 4:00 PM",
    conditions: [
      "Walk-ins accepted, appointments prioritised",
      "Aggressive dogs must be managed safely in waiting areas",
      "Carriers recommended for cats and small animals",
    ],
    lat: 28.5202,
    lng: 77.1568,
    image: IMAGES.vet,
  },

  {
    id: "dcc-defence",
    name: "Dog & Cat Clinic",
    category: "Veterinary Clinic",
    address: "Defence Colony, South Delhi 110024",
    hours: "Mon–Sat, 9:30 AM – 7:30 PM",
    conditions: [
      "One attendant per pet inside consultation",
      "Dogs must be leashed in reception",
      "Emergency cases prioritised",
    ],
    lat: 28.5729,
    lng: 77.2295,
    image: IMAGES.vet,
  },

  {
    id: "vetic-gk",
    name: "Vetic Pet Clinic, Greater Kailash",
    category: "Veterinary Clinic",
    address: "M Block Market, Greater Kailash 1, New Delhi 110048",
    hours: "Mon–Sun, 10:00 AM – 9:00 PM",
    conditions: [
      "Appointment based",
      "Same-day slots may be available",
      "Cats handled in a quieter consultation area",
    ],
    lat: 28.5495,
    lng: 77.2426,
    image: IMAGES.vet,
  },

  {
    id: "petsy-noida",
    name: "Petsy Veterinary Clinic, Noida",
    category: "Veterinary Clinic",
    address: "Sector 50 Market, Noida 201301",
    hours: "Mon–Sun, 10:00 AM – 8:00 PM",
    conditions: [
      "Leash or carrier recommended at entry",
      "Deworming and vaccination appointments available",
      "Surgery admissions require veterinary instructions",
    ],
    lat: 28.5748,
    lng: 77.3609,
    image: IMAGES.vet,
  },

  {
    id: "cgs-dwarka",
    name: "CGS Hospital, Dwarka",
    category: "Veterinary Clinic",
    address: "Sector 6, Dwarka, New Delhi 110075",
    hours: "Open 24 hours for emergencies",
    conditions: [
      "24x7 emergency and critical care",
      "Owners may have restricted access to ICU areas",
      "Large breeds may require staff assistance",
    ],
    lat: 28.5921,
    lng: 77.0463,
    image: IMAGES.vet,
  },

  {
    id: "vet-lajpat",
    name: "Pet Care Veterinary Clinic, Lajpat Nagar",
    category: "Veterinary Clinic",
    address: "Central Market, Lajpat Nagar 2, New Delhi 110024",
    hours: "Mon–Sat, 10:00 AM – 2:00 PM & 5:00 PM – 8:00 PM",
    conditions: [
      "Closed for consultation between 2 PM and 5 PM",
      "Large dogs may require additional handling support",
      "Cash and UPI accepted",
    ],
    lat: 28.5677,
    lng: 77.2433,
    image: IMAGES.vet,
  },

  {
    id: "sanjay-gandhi-animal-care-raja-garden",
    name: "Sanjay Gandhi Animal Care Centre, Raja Garden",
    category: "Veterinary Clinic",
    address: "Raja Garden, New Delhi 110015",
    hours: "Open 24 hours, every day",
    conditions: [
      "24x7 rescue, ICU, OPD and surgery",
      "Rescue and emergency services available",
      "Call ahead for emergency admissions",
    ],
    lat: 28.6519,
    lng: 77.1284,
    image: IMAGES.vet,
  },

  {
    id: "cgs-hospital-dlf-phase3",
    name: "CGS Hospital, DLF Phase 3 Gurugram",
    category: "Veterinary Clinic",
    address: "DLF Phase 3, Gurugram 122002",
    hours: "Open 24 hours, every day",
    conditions: [
      "ICU and surgical services",
      "In-house diagnostics and imaging",
      "24x7 emergency admissions",
    ],
    lat: 28.4933,
    lng: 77.0946,
    image: IMAGES.vet,
  },

  {
    id: "dr-anands-pets-hospital-vikaspuri",
    name: "Dr Anand's Pets Hospital, Vikas Puri",
    category: "Veterinary Clinic",
    address: "Vikas Puri, New Delhi 110018",
    hours: "OPD 10:00 AM – 8:00 PM · Emergency 24 hours",
    conditions: [
      "Regular OPD consultations available",
      "After-hours emergency service",
      "Call ahead for night availability",
    ],
    lat: 28.6377,
    lng: 77.0798,
    image: IMAGES.vet,
  },

  {
    id: "friendicoes-seca-jangpura",
    name: "Friendicoes SECA, Jangpura",
    category: "Veterinary Clinic",
    address: "Jangpura Extension, New Delhi 110014",
    hours: "Mon–Sun, 9:00 AM – 6:00 PM",
    conditions: [
      "Rescue, rehabilitation and adoption services",
      "OPD consultations available",
      "Call ahead for rescue pickups",
    ],
    lat: 28.5817,
    lng: 77.2434,
    image: IMAGES.vet,
  },

  {
    id: "pfa-delhi-animal-hospital-harinagar",
    name: "PFA Delhi Animal Hospital, Hari Nagar",
    category: "Veterinary Clinic",
    address: "Hari Nagar, New Delhi 110064",
    hours: "Open 24 hours for emergencies",
    conditions: [
      "Emergency and critical care",
      "Surgical and post-operative care",
      "Call before bringing a critical case",
    ],
    lat: 28.6339,
    lng: 77.1152,
    image: IMAGES.vet,
  },

  {
    id: "shroffs-animal-wing-daryaganj",
    name: "Dr Shroff's Charity Eye Hospital, Animal Wing",
    category: "Veterinary Clinic",
    address: "Daryaganj, New Delhi 110002",
    hours: "Mon–Sat, 9:00 AM – 5:00 PM",
    conditions: [
      "General pet consultations",
      "Emergency cases may be referred",
      "Call ahead to confirm availability",
    ],
    lat: 28.6459,
    lng: 77.2413,
    image: IMAGES.vet,
  },

  {
    id: "jeevashram-animal-hospital-gurgaon",
    name: "Jeevashram Animal Hospital, Gurgaon",
    category: "Veterinary Clinic",
    address: "Sector 46, Gurugram 122003",
    hours: "Open 24 hours, every day",
    conditions: [
      "24x7 emergency, ICU and surgery",
      "In-house diagnostic lab",
      "Emergency admission available",
    ],
    lat: 28.4408,
    lng: 77.0716,
    image: IMAGES.vet,
  },

  {
    id: "mahendales-pet-clinic-noida-50",
    name: "Mahendale's Pet Clinic & Hospital, Noida Sector 50",
    category: "Veterinary Clinic",
    address: "Sector 50, Noida 201301",
    hours: "OPD and emergency, Mon–Sun 9:00 AM – 9:00 PM",
    conditions: [
      "OPD and emergency consultations",
      "In-house pharmacy and diagnostics",
      "Call ahead for after-hours visits",
    ],
    lat: 28.5729,
    lng: 77.359,
    image: IMAGES.vet,
  },

  {
    id: "animal-care-centre-greater-noida",
    name: "Animal Care Centre, Greater Noida",
    category: "Veterinary Clinic",
    address: "Alpha 1, Greater Noida 201310",
    hours: "Mon–Sun, 9:00 AM – 8:00 PM",
    conditions: [
      "Treats dogs, cats, birds and exotic animals",
      "Vaccination records may be required",
      "Call ahead to book a slot",
    ],
    lat: 28.4737,
    lng: 77.5039,
    image: IMAGES.vet,
  },

  {
    id: "cessna-lifeline-vasant-kunj",
    name: "Cessna Lifeline Veterinary Hospital, Vasant Kunj",
    category: "Veterinary Clinic",
    address: "Vasant Kunj, New Delhi 110070",
    hours: "Open 24 hours, every day",
    conditions: [
      "24x7 emergency care",
      "In-house diagnostics and imaging",
      "Emergency admission available",
    ],
    lat: 28.5217,
    lng: 77.1531,
    image: IMAGES.vet,
  },

  {
    id: "bark-meow-saket",
    name: "Bark & Meow Veterinary Clinic, Saket",
    category: "Veterinary Clinic",
    address: "Saket, New Delhi 110017",
    hours: "OPD and emergency, Mon–Sun 10:00 AM – 9:00 PM",
    conditions: [
      "OPD and emergency consultations",
      "Vaccination and deworming appointments",
      "Call ahead for urgent cases",
    ],
    lat: 28.5245,
    lng: 77.2066,
    image: IMAGES.vet,
  },

  {
    id: "delhi-spca-srinivaspuri",
    name: "Delhi SPCA Animal Hospital, Srinivaspuri",
    category: "Veterinary Clinic",
    address: "Srinivaspuri, New Delhi 110065",
    hours: "Mon–Sun, 9:00 AM – 6:00 PM",
    conditions: [
      "Rescue, OPD and adoption services",
      "Community animal cases prioritised",
      "Call ahead for rescue calls",
    ],
    lat: 28.5623,
    lng: 77.2436,
    image: IMAGES.vet,
  },

  // ============================================================
  // GROOMING
  // ============================================================

  {
    id: "scoopy-gk",
    name: "Scoopy Scrub Grooming Studio",
    category: "Grooming Salon",
    address: "N Block Market, Greater Kailash 1, New Delhi 110048",
    hours: "Tue–Sun, 11:00 AM – 7:00 PM",
    conditions: [
      "Appointment only",
      "Vaccination certificate required for first visit",
      "Matted coats discussed with owner before shave-down",
    ],
    lat: 28.5514,
    lng: 77.2402,
    image: IMAGES.grooming,
  },

  {
    id: "furrmaid-noida",
    name: "The Furr Maid Pet Spa",
    category: "Grooming Salon",
    address: "Sector 41, Noida 201303",
    hours: "Mon–Sun, 10:00 AM – 7:00 PM",
    conditions: [
      "Owners may stay during the groom",
      "Aggressive dogs require safe handling",
      "Cat grooming on Tuesdays and Thursdays",
    ],
    lat: 28.5648,
    lng: 77.3512,
    image: IMAGES.grooming,
  },

  {
    id: "pawfect-gurgaon",
    name: "Pawfect Grooming Studio",
    category: "Grooming Salon",
    address: "Sector 56, Golf Course Road, Gurugram 122011",
    hours: "Mon–Sun, 10:30 AM – 8:00 PM",
    conditions: [
      "Home grooming available",
      "Tick treatment booked separately",
      "Young puppies may require veterinary clearance",
    ],
    lat: 28.4211,
    lng: 77.1013,
    image: IMAGES.grooming,
  },

  {
    id: "groom-dwarka",
    name: "Waggy Tails Grooming, Dwarka",
    category: "Grooming Salon",
    address: "Sector 12 Market, Dwarka, New Delhi 110078",
    hours: "Tue–Sun, 11:00 AM – 7:30 PM",
    conditions: [
      "Warm water bath",
      "Senior dogs groomed with breaks",
      "Pick and drop available on request",
    ],
    lat: 28.5921,
    lng: 77.0405,
    image: IMAGES.grooming,
  },

  {
    id: "fur-ball-story-hauzkhas",
    name: "Fur Ball Story, Hauz Khas",
    category: "Grooming Salon",
    address: "Hauz Khas Village, New Delhi 110016",
    hours: "Tue–Sun, 10:00 AM – 7:00 PM",
    conditions: [
      "Appointment recommended",
      "Vaccination certificate required for first visit",
      "Cat grooming handled separately",
    ],
    lat: 28.5541,
    lng: 77.1961,
    image: IMAGES.grooming,
  },

  {
    id: "petstudio-noida-50",
    name: "PetStudio Grooming, Noida Sector 50",
    category: "Grooming Salon",
    address: "Sector 50, Noida 201301",
    hours: "Mon–Sun, 10:00 AM – 7:30 PM",
    conditions: [
      "Owners may wait on-site",
      "Aggressive dogs require safe handling",
      "Young puppies may require vet clearance",
    ],
    lat: 28.5741,
    lng: 77.3583,
    image: IMAGES.grooming,
  },

  {
    id: "groom-room-gurugram",
    name: "The Groom Room, Gurugram",
    category: "Grooming Salon",
    address: "Sector 45, Gurugram 122003",
    hours: "Mon–Sun, 10:30 AM – 8:00 PM",
    conditions: [
      "Home grooming available",
      "Tick and flea treatment booked separately",
      "Senior dogs groomed with breaks",
    ],
    lat: 28.4501,
    lng: 77.0839,
    image: IMAGES.grooming,
  },

  {
    id: "snip-wag-vk",
    name: "Snip & Wag, Vasant Kunj",
    category: "Grooming Salon",
    address: "Vasant Kunj, New Delhi 110070",
    hours: "Tue–Sun, 11:00 AM – 7:30 PM",
    conditions: [
      "Warm water bath",
      "Matted coats discussed before shave-down",
      "Vaccination record required for first visit",
    ],
    lat: 28.5292,
    lng: 77.1571,
    image: IMAGES.grooming,
  },

  {
    id: "pawfect-grooming-dwarka",
    name: "Pawfect Grooming, Dwarka",
    category: "Grooming Salon",
    address: "Sector 12, Dwarka, New Delhi 110078",
    hours: "Tue–Sun, 11:00 AM – 7:30 PM",
    conditions: [
      "Pick and drop available on request",
      "Cat grooming on Tuesdays and Thursdays",
      "Senior and anxious dogs groomed with extra breaks",
    ],
    lat: 28.5919,
    lng: 77.0412,
    image: IMAGES.grooming,
  },

  // ============================================================
  // PET STORES
  // ============================================================

  {
    id: "heads-up-vk",
    name: "Heads Up For Tails, Vasant Kunj",
    category: "Pet Store",
    address: "Ambience Mall, Vasant Kunj, New Delhi 110070",
    hours: "Mon–Sun, 11:00 AM – 9:00 PM",
    conditions: [
      "Pets welcome inside on leash",
      "Trial of collars and harnesses allowed",
      "Water bowl at entrance",
    ],
    lat: 28.5407,
    lng: 77.1552,
    image: IMAGES.petStore,
  },

  {
    id: "hut-cp",
    name: "Pet Hut, Connaught Place",
    category: "Pet Store",
    address: "Inner Circle, Block N, Connaught Place, New Delhi 110001",
    hours: "Mon–Sat, 10:30 AM – 8:30 PM",
    conditions: [
      "Leashed pets allowed inside",
      "Cats should remain in carriers",
      "Prescription diets may require veterinary documentation",
    ],
    lat: 28.6331,
    lng: 77.2197,
    image: IMAGES.petStore,
  },

  {
    id: "store-lajpat",
    name: "Delhi Pet Shop, Lajpat Nagar",
    category: "Pet Store",
    address: "Amar Colony Main Market, Lajpat Nagar 4, New Delhi 110024",
    hours: "Mon–Sun, 10:00 AM – 9:00 PM",
    conditions: [
      "Pets allowed on leash",
      "Aquarium section",
      "Live fish sales stop before closing",
    ],
    lat: 28.5637,
    lng: 77.2411,
    image: IMAGES.petStore,
  },

  {
    id: "store-gnoida",
    name: "Pet Bazaar, Greater Noida",
    category: "Pet Store",
    address: "Alpha 1 Commercial Belt, Greater Noida 201310",
    hours: "Mon–Sun, 10:00 AM – 8:30 PM",
    conditions: [
      "Pets welcome, leash mandatory",
      "Free weight check for dogs",
      "Bulk feed delivery available",
    ],
    lat: 28.4744,
    lng: 77.502,
    image: IMAGES.petStore,
  },

  {
    id: "store-gurgaon",
    name: "Paws & Claws Supply Store",
    category: "Pet Store",
    address: "Sushant Lok Phase 1, Gurugram 122002",
    hours: "Mon–Sun, 10:00 AM – 9:00 PM",
    conditions: [
      "Dogs on leash allowed",
      "Small pets should remain in carriers",
      "Treat sampling with staff permission",
    ],
    lat: 28.4664,
    lng: 77.0817,
    image: IMAGES.petStore,
  },

  {
    id: "petkart-noida-18",
    name: "PetKart, Noida Sector 18",
    category: "Pet Store",
    address: "Sector 18 Market, Noida 201301",
    hours: "Mon–Sun, 10:00 AM – 9:00 PM",
    conditions: [
      "Pets welcome on leash",
      "Cats and small animals should remain in carriers",
      "In-store services available",
    ],
    lat: 28.5697,
    lng: 77.3258,
    image: IMAGES.petStore,
  },

  {
    id: "hupt-dlf-promenade",
    name: "Heads Up For Tails, DLF Promenade Vasant Kunj",
    category: "Pet Store",
    address: "DLF Promenade Mall, Vasant Kunj, New Delhi 110070",
    hours: "Mon–Sun, 11:00 AM – 9:00 PM",
    conditions: [
      "Pets welcome inside on leash",
      "In-store grooming counter",
      "Water bowl available",
    ],
    lat: 28.5478,
    lng: 77.1544,
    image: IMAGES.petStore,
  },

  {
    id: "wiggles-lajpat",
    name: "Wiggles Pet Store, Lajpat Nagar",
    category: "Pet Store",
    address: "Lajpat Nagar 2, New Delhi 110024",
    hours: "Mon–Sun, 10:30 AM – 8:30 PM",
    conditions: [
      "Leashed dogs allowed",
      "Small pets should remain in carriers",
      "Home delivery available",
    ],
    lat: 28.5683,
    lng: 77.2436,
    image: IMAGES.petStore,
  },

  {
    id: "petsutra-janakpuri",
    name: "PetSutra, Janakpuri",
    category: "Pet Store",
    address: "District Centre, Janakpuri, New Delhi 110058",
    hours: "Mon–Sun, 10:00 AM – 8:30 PM",
    conditions: [
      "Pets welcome on leash",
      "Small pets should remain in carriers",
      "Bulk feed delivery available",
    ],
    lat: 28.6219,
    lng: 77.0878,
    image: IMAGES.petStore,
  },

  {
    id: "pet-shop-cp",
    name: "The Pet Shop, Connaught Place",
    category: "Pet Store",
    address: "Block A, Connaught Place, New Delhi 110001",
    hours: "Mon–Sat, 10:30 AM – 8:00 PM",
    conditions: [
      "Leashed pets allowed",
      "Cats should remain in carriers",
      "Live animal sales close before store closing",
    ],
    lat: 28.633,
    lng: 77.219,
    image: IMAGES.petStore,
  },

  {
    id: "paws-claws-gnoida",
    name: "Paws & Claws, Greater Noida",
    category: "Pet Store",
    address: "Alpha 2 Commercial Belt, Greater Noida 201310",
    hours: "Mon–Sun, 10:00 AM – 8:30 PM",
    conditions: [
      "Pets welcome, leash mandatory",
      "Free weight check for dogs",
      "Bulk feed home delivery available",
    ],
    lat: 28.4762,
    lng: 77.5044,
    image: IMAGES.petStore,
  },

  // ============================================================
  // PARKS
  // ============================================================

  {
    id: "park-lodhi",
    name: "Lodhi Garden Dog Walk Lawns",
    category: "Off Leash Park",
    address: "Lodhi Road, New Delhi 110003",
    hours: "Daily, 5:00 AM – 8:00 PM",
    conditions: [
      "Leash rules vary by area and time",
      "Leash mandatory near monuments",
      "Owners should clean up after pets",
    ],
    lat: 28.5931,
    lng: 77.2197,
    image: IMAGES.park,
  },

  {
    id: "park-nehru",
    name: "Nehru Park, Chanakyapuri",
    category: "Off Leash Park",
    address: "Vinay Marg, Chanakyapuri, New Delhi 110021",
    hours: "Daily, 5:00 AM – 9:00 PM",
    conditions: [
      "Leash recommended in busy areas",
      "Keep dogs away from jogging zones",
      "Supervise pets around other visitors",
    ],
    lat: 28.5893,
    lng: 77.1938,
    image: IMAGES.park,
  },

  {
    id: "park-dda-vk",
    name: "DDA Park, Vasant Kunj Sector C",
    category: "Off Leash Park",
    address: "Sector C Pocket 6, Vasant Kunj, New Delhi 110070",
    hours: "Daily, 5:30 AM – 9:00 PM",
    conditions: [
      "Use designated open areas responsibly",
      "Community dogs may be present",
      "Water available near the gate",
    ],
    lat: 28.5245,
    lng: 77.1591,
    image: IMAGES.park,
  },

  {
    id: "park-noida-sec-50",
    name: "Sector 50 Central Park, Noida",
    category: "Off Leash Park",
    address: "Sector 50, Noida 201301",
    hours: "Daily, 5:00 AM – 9:30 PM",
    conditions: [
      "Use marked areas where applicable",
      "Water fountains available",
      "Leash recommended on busy walking routes",
    ],
    lat: 28.5734,
    lng: 77.3626,
    image: IMAGES.park,
  },

  {
    id: "park-leisure-valley",
    name: "Leisure Valley Park, Gurugram",
    category: "Off Leash Park",
    address: "Sector 29, Gurugram 122001",
    hours: "Daily, 5:00 AM – 9:00 PM",
    conditions: [
      "Leash recommended during busy hours",
      "Open lawns available",
      "Drinking water near main entrance",
    ],
    lat: 28.4667,
    lng: 77.0645,
    image: IMAGES.park,
  },

  {
    id: "park-dwarka-sec-11",
    name: "Bharat Vandana Adjacent Park, Dwarka Sector 11",
    category: "Off Leash Park",
    address: "Sector 11, Dwarka, New Delhi 110075",
    hours: "Daily, 5:30 AM – 8:30 PM",
    conditions: [
      "Fenced walking areas",
      "Leash recommended when children are present",
      "Water availability may vary seasonally",
    ],
    lat: 28.5896,
    lng: 77.0473,
    image: IMAGES.park,
  },

  {
    id: "park-gnoida",
    name: "Jagat Farm Green Belt, Greater Noida",
    category: "Off Leash Park",
    address: "Gamma 1, Jagat Farm, Greater Noida 201310",
    hours: "Daily, 5:00 AM – 9:00 PM",
    conditions: [
      "Keep dogs away from road edges",
      "Recall-trained dogs recommended",
      "Supervise pets around other animals",
    ],
    lat: 28.4636,
    lng: 77.5065,
    image: IMAGES.park,
  },

  {
    id: "lodhi-garden-full",
    name: "Lodhi Garden",
    category: "Off Leash Park",
    address: "Lodhi Road, New Delhi 110003",
    hours: "Daily, 5:00 AM – 8:00 PM",
    conditions: [
      "Leash recommended during busy periods",
      "Quiet lawns may be suitable for supervised dog walks",
      "Poop bags recommended",
    ],
    lat: 28.5931,
    lng: 77.2197,
    image: IMAGES.park,
  },

  {
    id: "sanjay-van",
    name: "Sanjay Van",
    category: "Off Leash Park",
    address: "Mehrauli, near Vasant Vihar, New Delhi 110057",
    hours: "Daily, 5:00 AM – 7:00 PM",
    conditions: [
      "Keep dogs supervised on forest trails",
      "Natural water bodies are present",
      "Community and stray dogs may be encountered",
    ],
    lat: 28.5359,
    lng: 77.1734,
    image: IMAGES.park,
  },

  {
    id: "dda-park-dwarka-10",
    name: "DDA Park, Dwarka Sector 10",
    category: "Off Leash Park",
    address: "Sector 10, Dwarka, New Delhi 110075",
    hours: "Daily, 5:30 AM – 9:00 PM",
    conditions: [
      "Use designated dog areas where available",
      "Leash recommended on main walking tracks",
      "Water tap available in the park",
    ],
    lat: 28.5977,
    lng: 77.0537,
    image: IMAGES.park,
  },

  {
    id: "central-park-cp",
    name: "Central Park, Connaught Place",
    category: "Off Leash Park",
    address: "Connaught Place, New Delhi 110001",
    hours: "Daily, 5:00 AM – 10:00 PM",
    conditions: [
      "Leash recommended throughout",
      "Heavy pedestrian traffic",
      "No off-leash play in crowded areas",
    ],
    lat: 28.6315,
    lng: 77.2167,
    image: IMAGES.park,
  },

  {
    id: "garden-of-five-senses",
    name: "Garden of Five Senses, Saket",
    category: "Off Leash Park",
    address: "Said-Ul-Ajaib, Saket, New Delhi 110030",
    hours: "Daily, 9:00 AM – 9:30 PM",
    conditions: [
      "Leash mandatory",
      "Ticketed garden with families and children",
      "Water fountains available",
    ],
    lat: 28.516,
    lng: 77.1969,
    image: IMAGES.park,
  },

  {
    id: "botanical-garden-noida",
    name: "Botanical Garden, Noida",
    category: "Off Leash Park",
    address: "Sector 38, Noida 201301",
    hours: "Daily, 6:00 AM – 8:00 PM",
    conditions: [
      "Leash recommended near entrances",
      "Supervise pets in crowded areas",
      "Drinking water points available",
    ],
    lat: 28.5747,
    lng: 77.331,
    image: IMAGES.park,
  },
];
