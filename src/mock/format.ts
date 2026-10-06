import {
  format,
  formatDistanceToNowStrict,
  isToday,
  isTomorrow,
  isYesterday,
  parseISO,
} from "date-fns";
import { CATEGORY_COLORS, PET_PLACES, type PetPlace } from "@/data/locations";
import { RECIPES } from "@/data/recipes";
import type { BookingStatus, Community, DemoState } from "./types";

export function initials(name: string) {
  return name
    .replace(/^Dr\.\s*/i, "")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]!.toUpperCase())
    .join("");
}

export function rupees(n: number) {
  return `₹${n.toLocaleString("en-IN")}`;
}

/** "Today", "Tomorrow", "Mon 12 Oct" */
export function dayLabel(date: string) {
  const d = parseISO(date);
  if (isToday(d)) return "Today";
  if (isTomorrow(d)) return "Tomorrow";
  if (isYesterday(d)) return "Yesterday";
  return format(d, "EEE d MMM");
}

export function longDate(date: string) {
  return format(parseISO(date), "d MMM yyyy");
}

export function timeLabel(time: string) {
  const [h, m] = time.split(":").map(Number);
  const d = new Date();
  d.setHours(h ?? 0, m ?? 0, 0, 0);
  return format(d, "h:mm a");
}

export function ago(iso: string) {
  const d = parseISO(iso);
  const diff = Date.now() - d.getTime();
  if (diff < 60_000) return "just now";
  return `${formatDistanceToNowStrict(d)} ago`;
}

export function daysUntil(date: string) {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  return Math.round((parseISO(date).getTime() - start.getTime()) / 86_400_000);
}

export function dueLabel(date: string) {
  const n = daysUntil(date);
  if (n < 0) return `Overdue by ${-n} day${n === -1 ? "" : "s"}`;
  if (n === 0) return "Due today";
  if (n === 1) return "Due tomorrow";
  return `Due in ${n} days`;
}

export function fileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

export const BOOKING_STATUS: Record<BookingStatus, { label: string; className: string }> = {
  requested: { label: "Awaiting reply", className: "bg-honey/40 text-honey-foreground" },
  accepted: { label: "Confirmed", className: "bg-verified/15 text-verified" },
  declined: { label: "Declined", className: "bg-destructive/10 text-destructive" },
  cancelled: { label: "Cancelled", className: "bg-oat text-muted-foreground ring-1 ring-border" },
  completed: { label: "Completed", className: "bg-mocha text-mocha-foreground" },
};

/** Map places as the public sees them: seeded + founder-added, minus unpublished. */
export function allPlaces(state: DemoState): (PetPlace & { published: boolean; image?: string })[] {
  return [...state.customPlaces, ...PET_PLACES].map((p) => {
    const o = state.placeOverrides[p.id] ?? {};
    return {
      ...p,
      published: o.published ?? p.published ?? true,
      ...(o.image ? { image: o.image } : {}),
    };
  });
}

export function visibleRecipes(state: DemoState) {
  return RECIPES.filter((r) => !state.recipeOverrides[r.id]?.hidden);
}

export { CATEGORY_COLORS };

export function memberCount(c: Community) {
  return c.baseMembers + c.members.length;
}

/** Background and readable text colour for a map category badge. */
export function categoryBadge(category: keyof typeof CATEGORY_COLORS) {
  const bg = CATEGORY_COLORS[category];
  const [r, g, b] = [1, 3, 5].map((i) => {
    const c = parseInt(bg.slice(i, i + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  const lum = 0.2126 * r! + 0.7152 * g! + 0.0722 * b!;
  return { backgroundColor: bg, color: lum > 0.25 ? "#3a2119" : "#fff8f0" };
}
