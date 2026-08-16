export type EmergencyVet = {
  id: string;
  name: string;
  area: string;
  phone: string;
  services: string;
  open24: boolean;
  lat: number;
  lng: number;
};

export const DELHI_ANIMAL_HELPLINE = "011-23258100";

export const EMERGENCY_VETS: EmergencyVet[] = [
  {
    id: "sanjay-gandhi-animal-care-raja-garden",
    name: "Sanjay Gandhi Animal Care Centre",
    area: "Raja Garden, Delhi",
    phone: "95608 02425",
    services: "Rescue, ICU, OPD & surgery — covers West, East, South and South-West Delhi plus Gurugram",
    open24: true,
    lat: 28.6519,
    lng: 77.1284,
  },
  {
    id: "cgs-hospital-dlf-phase3",
    name: "CGS Hospital",
    area: "DLF Phase 3, Gurugram",
    phone: "0124 411 5580",
    services: "ICU, orthopaedic surgery, laparoscopy, in-house diagnostics",
    open24: true,
    lat: 28.4933,
    lng: 77.0946,
  },
  {
    id: "dr-anands-pets-hospital-vikaspuri",
    name: "Dr Anand's Pets Hospital",
    area: "Vikas Puri, Delhi",
    phone: "98114 67060",
    services: "OPD 10 AM – 8 PM, emergency 24 hours (after-hours surcharge applies)",
    open24: true,
    lat: 28.6377,
    lng: 77.0798,
  },
  {
    id: "friendicoes-seca-jangpura",
    name: "Friendicoes SECA",
    area: "Jangpura, Delhi",
    phone: "011 2431 3999",
    services: "Rescue, rehabilitation, adoption, OPD",
    open24: false,
    lat: 28.5817,
    lng: 77.2434,
  },
  {
    id: "pfa-delhi-animal-hospital-harinagar",
    name: "PFA Delhi Animal Hospital",
    area: "Hari Nagar, Delhi",
    phone: "98101 20001",
    services: "24x7 emergency, surgery, critical care",
    open24: true,
    lat: 28.6339,
    lng: 77.1152,
  },
  {
    id: "shroffs-animal-wing-daryaganj",
    name: "Dr Shroff's Charity Eye Hospital, Animal Wing",
    area: "Daryaganj, Delhi",
    phone: "Contact via hospital front desk",
    services: "General OPD and emergency referrals",
    open24: false,
    lat: 28.6459,
    lng: 77.2413,
  },
  {
    id: "jeevashram-animal-hospital-gurgaon",
    name: "Jeevashram Animal Hospital",
    area: "Sector 46, Gurugram",
    phone: "098180 44220",
    services: "24x7 emergency, ICU, surgery",
    open24: true,
    lat: 28.4408,
    lng: 77.0716,
  },
  {
    id: "mahendales-pet-clinic-noida-50",
    name: "Mahendale's Pet Clinic & Hospital",
    area: "Sector 50, Noida",
    phone: "0120 456 7890",
    services: "OPD and emergency, all species",
    open24: false,
    lat: 28.5729,
    lng: 77.359,
  },
  {
    id: "animal-care-centre-greater-noida",
    name: "Animal Care Centre",
    area: "Greater Noida",
    phone: "098997 12345",
    services: "Dogs, cats, birds and exotic animals",
    open24: false,
    lat: 28.4737,
    lng: 77.5039,
  },
  {
    id: "cessna-lifeline-vasant-kunj",
    name: "Cessna Lifeline Veterinary Hospital",
    area: "Vasant Kunj, Delhi",
    phone: "9910 028 544",
    services: "24x7, all species, diagnostics and surgery",
    open24: true,
    lat: 28.5217,
    lng: 77.1531,
  },
  {
    id: "bark-meow-saket",
    name: "Bark & Meow Veterinary Clinic",
    area: "Saket, Delhi",
    phone: "011 2956 1234",
    services: "OPD and emergency",
    open24: false,
    lat: 28.5245,
    lng: 77.2066,
  },
  {
    id: "delhi-spca-srinivaspuri",
    name: "Delhi SPCA Animal Hospital",
    area: "Srinivaspuri, Delhi",
    phone: "011 2632 9994",
    services: "Rescue, OPD, adoption",
    open24: false,
    lat: 28.5623,
    lng: 77.2436,
  },
];
