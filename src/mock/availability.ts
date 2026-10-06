import { slotTaken } from "./actions";
import type { DemoState, ProProfile } from "./types";

export const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;

export function nextDays(count: number, from = new Date()) {
  return Array.from({ length: count }, (_, i) => {
    const d = new Date(from);
    d.setHours(12, 0, 0, 0);
    d.setDate(d.getDate() + i);
    return d.toISOString().slice(0, 10);
  });
}

export function worksOn(pro: ProProfile, date: string) {
  const day = new Date(`${date}T12:00:00`).getDay();
  return pro.workDays.includes(day) && !pro.blockedDates.includes(date);
}

/** Slots a professional can still take on a day (working day, not blocked, not booked, not in the past). */
export function openSlots(state: DemoState, pro: ProProfile, date: string) {
  if (!worksOn(pro, date)) return [];
  const now = new Date();
  const today = now.toISOString().slice(0, 10);
  return pro.slots.filter((s) => {
    if (slotTaken(state, pro.userId, date, s)) return false;
    if (date === today) {
      const [h, m] = s.split(":").map(Number);
      if ((h ?? 0) * 60 + (m ?? 0) <= now.getHours() * 60 + now.getMinutes()) return false;
    }
    return true;
  });
}
