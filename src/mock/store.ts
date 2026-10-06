import { useEffect, useState, useSyncExternalStore } from "react";
import { createSeed, DEMO_VERSION } from "./seed";
import type { DemoState, User } from "./types";

/*
 * The demo's single source of data.
 *
 * Records live in localStorage so they survive a refresh and are shared by
 * every tab in the same browser (changes in one tab show up in the others).
 * The signed-in user lives in sessionStorage, so two tabs can be signed in as
 * different people — e.g. an owner in one tab and the professional in another.
 */

const DATA_KEY = "petwork.demo.data";
const SESSION_KEY = "petwork.demo.session";

const serverState = createSeed();
let state: DemoState = serverState;
let sessionUserId: string | null = null;
let loaded = false;
const listeners = new Set<() => void>();

function emit() {
  for (const l of listeners) l();
}

function persist() {
  try {
    window.localStorage.setItem(DATA_KEY, JSON.stringify(state));
  } catch {
    // Quota exceeded or storage blocked: the change still applies in memory.
  }
}

function load() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;

  try {
    const raw = window.localStorage.getItem(DATA_KEY);
    const parsed = raw ? (JSON.parse(raw) as DemoState) : null;
    if (parsed && parsed.version === DEMO_VERSION) {
      state = parsed;
    } else {
      state = createSeed();
      persist();
    }
  } catch {
    state = createSeed();
  }

  try {
    sessionUserId = window.sessionStorage.getItem(SESSION_KEY);
  } catch {
    sessionUserId = null;
  }

  window.addEventListener("storage", (e) => {
    if (e.key !== DATA_KEY || !e.newValue) return;
    try {
      state = JSON.parse(e.newValue) as DemoState;
      emit();
    } catch {
      // Ignore malformed writes from other tabs.
    }
  });
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getState(): DemoState {
  load();
  return state;
}

/** Apply a change to a copy of the data, then save and notify every screen. */
export function mutate(change: (draft: DemoState) => void) {
  load();
  const draft = structuredClone(state);
  change(draft);
  state = draft;
  persist();
  emit();
}

export function resetDemoData() {
  state = createSeed();
  persist();
  emit();
}

export function getSessionUserId() {
  load();
  return sessionUserId;
}

export function setSessionUserId(id: string | null) {
  sessionUserId = id;
  try {
    if (id) window.sessionStorage.setItem(SESSION_KEY, id);
    else window.sessionStorage.removeItem(SESSION_KEY);
  } catch {
    // Session still applies for this page view.
  }
  emit();
}

/** The whole demo dataset. Derive what a screen needs with useMemo. */
export function useDemo(): DemoState {
  return useSyncExternalStore(subscribe, getState, () => serverState);
}

/**
 * True once the browser copy of the data has been read. Screens that depend on
 * who is signed in wait for this so a refresh does not flash "please sign in".
 */
export function useHydrated() {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);
  return hydrated;
}

export function useSession(): { user: User | null; ready: boolean } {
  const data = useDemo();
  const id = useSyncExternalStore(subscribe, getSessionUserId, () => null);
  const ready = useHydrated();
  const user = id ? (data.users.find((u) => u.id === id) ?? null) : null;
  return { user: ready ? user : null, ready };
}
