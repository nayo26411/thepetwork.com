import type { EmergencyVet } from "@/data/emergency";
import type { PetPlace } from "@/data/locations";

/*
 * Types for The Petwork demo data. Everything here lives in the browser
 * (see store.ts) — there is no backend behind these records.
 */

export type Role = "owner" | "pro" | "founder";

export const PRO_TYPES = ["Dog Walker", "Groomer", "Vet", "Sitter", "Trainer"] as const;
export type ProType = (typeof PRO_TYPES)[number];

export type NotificationPrefs = {
  inApp: boolean;
  email: boolean;
  reminders: boolean;
  bookings: boolean;
  messages: boolean;
  community: boolean;
  marketing: boolean;
};

export type User = {
  id: string;
  role: Role;
  name: string;
  email: string;
  phone: string;
  password: string;
  area: string;
  avatar: string;
  joinedAt: string;
  status: "active" | "suspended";
  prefs: NotificationPrefs;
};

export type ProProfile = {
  userId: string;
  types: ProType[];
  headline: string;
  bio: string;
  area: string;
  years: number;
  priceFrom: number;
  priceUnit: string;
  languages: string[];
  services: string[];
  rating: number;
  reviewCount: number;
  /** 0 = Sunday … 6 = Saturday */
  workDays: number[];
  slots: string[];
  blockedDates: string[];
  listed: boolean;
};

export type ApplicationStatus =
  "submitted" | "in_review" | "changes_requested" | "approved" | "rejected";

export type Application = {
  id: string;
  userId: string;
  name: string;
  email: string;
  phone: string;
  area: string;
  years: number;
  services: ProType[];
  bio: string;
  idDocName: string;
  references: { name: string; phone: string; relation: string }[];
  videoName: string;
  status: ApplicationStatus;
  submittedAt: string;
  checks: { id: boolean; references: boolean; video: boolean };
  history: { status: ApplicationStatus; at: string; note: string }[];
};

export type Pet = {
  id: string;
  ownerId: string;
  name: string;
  species: string;
  breed: string;
  age: string;
  weight: string;
  sex: string;
  allergies: string;
  about: string;
  photo: string;
};

export type HealthEntry = {
  id: string;
  petId: string;
  date: string;
  title: string;
  vet: string;
  notes: string;
};

export type Vaccination = {
  id: string;
  petId: string;
  name: string;
  givenOn: string;
  dueOn: string;
  clinic: string;
};

export type Medication = {
  id: string;
  petId: string;
  name: string;
  dose: string;
  frequency: string;
  startOn: string;
  endOn: string;
  active: boolean;
  notes: string;
};

export type PetDocument = {
  id: string;
  petId: string;
  name: string;
  kind: string;
  size: number;
  mime: string;
  uploadedAt: string;
  dataUrl: string;
};

export const REMINDER_KINDS = [
  "Vaccination",
  "Medication",
  "Appointment",
  "Grooming",
  "Other",
] as const;
export type ReminderKind = (typeof REMINDER_KINDS)[number];

export type Reminder = {
  id: string;
  ownerId: string;
  petId: string;
  kind: ReminderKind;
  title: string;
  dueOn: string;
  time: string;
  repeat: "none" | "daily" | "weekly" | "monthly" | "yearly";
  notes: string;
  done: boolean;
};

export type BookingStatus = "requested" | "accepted" | "declined" | "cancelled" | "completed";

export type Booking = {
  id: string;
  ownerId: string;
  proId: string;
  petId: string;
  service: ProType;
  date: string;
  time: string;
  durationMins: number;
  notes: string;
  price: number;
  status: BookingStatus;
  reason: string;
  createdAt: string;
  updatedAt: string;
  review: { rating: number; text: string } | null;
};

export type Thread = {
  id: string;
  ownerId: string;
  proId: string;
  updatedAt: string;
};

export type Message = {
  id: string;
  threadId: string;
  senderId: string;
  body: string;
  at: string;
  readBy: string[];
};

export type NotificationKind =
  "booking" | "message" | "reminder" | "application" | "community" | "system";

export type AppNotification = {
  id: string;
  userId: string;
  kind: NotificationKind;
  title: string;
  body: string;
  link: string;
  at: string;
  read: boolean;
};

export const POST_TYPES = ["Stories", "Tips", "Questions", "Blogs", "Videos"] as const;
export type PostType = (typeof POST_TYPES)[number];

export const POST_SPECIES = [
  "Dogs",
  "Cats",
  "Birds",
  "Rabbits",
  "Reptiles",
  "Fish",
  "Hamsters",
  "Other",
] as const;

export type ContentStatus = "published" | "pending" | "removed";

export type Post = {
  id: string;
  authorId: string;
  authorName: string;
  type: PostType;
  title: string;
  content: string;
  species: string;
  videoUrl: string;
  createdAt: string;
  editedAt: string;
  baseLikes: number;
  likedBy: string[];
  savedBy: string[];
  status: ContentStatus;
};

export type Comment = {
  id: string;
  postId: string;
  authorId: string;
  authorName: string;
  body: string;
  at: string;
  status: ContentStatus;
};

export const COMMUNITY_CATEGORIES = ["Breed", "Species", "Topic", "Location"] as const;

export type Community = {
  id: string;
  name: string;
  category: string;
  description: string;
  createdBy: string;
  baseMembers: number;
  members: string[];
  status: "active" | "archived";
  createdAt: string;
};

export type CommunityPost = {
  id: string;
  communityId: string;
  authorId: string;
  authorName: string;
  body: string;
  at: string;
  status: ContentStatus;
  replies: { id: string; authorId: string; authorName: string; body: string; at: string }[];
};

export type ReportTarget = "post" | "comment" | "communityPost" | "user";

export type Report = {
  id: string;
  targetKind: ReportTarget;
  targetId: string;
  /** Short human label of what was reported, captured at report time. */
  excerpt: string;
  reason: string;
  details: string;
  reporterId: string;
  at: string;
  status: "open" | "removed" | "dismissed";
};

export type MunicipalRule = {
  id: string;
  city: string;
  authority: string;
  registration: string;
  licensing: string;
  leash: string;
  waste: string;
  publicSpaces: string;
  guidance: string;
  sourceName: string;
  sourceUrl: string;
  lastChecked: string;
};

export type PlaceOverride = { published?: boolean; image?: string };

export type DemoState = {
  version: number;
  seededAt: string;
  settings: { autoReplies: boolean };
  users: User[];
  pros: ProProfile[];
  applications: Application[];
  pets: Pet[];
  health: HealthEntry[];
  vaccinations: Vaccination[];
  medications: Medication[];
  documents: PetDocument[];
  reminders: Reminder[];
  bookings: Booking[];
  threads: Thread[];
  messages: Message[];
  notifications: AppNotification[];
  posts: Post[];
  comments: Comment[];
  communities: Community[];
  communityPosts: CommunityPost[];
  reports: Report[];
  blocks: { userId: string; blockedId: string }[];
  favourites: { userId: string; placeId: string }[];
  placeOverrides: Record<string, PlaceOverride>;
  customPlaces: PetPlace[];
  emergency: EmergencyVet[];
  municipal: MunicipalRule[];
  recipeOverrides: Record<string, { hidden?: boolean; note?: string }>;
};
