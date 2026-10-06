import type { PetPlace } from "@/data/locations";
import { dayLabel, timeLabel } from "./format";
import type { EmergencyVet } from "@/data/emergency";
import { getSessionUserId, getState, mutate, resetDemoData, setSessionUserId } from "./store";
import type {
  AppNotification,
  ApplicationStatus,
  Booking,
  BookingStatus,
  DemoState,
  HealthEntry,
  Medication,
  MunicipalRule,
  NotificationKind,
  Pet,
  PetDocument,
  Post,
  ProProfile,
  Reminder,
  ReportTarget,
  Role,
  User,
  Vaccination,
} from "./types";

/*
 * Everything a screen can do to the demo data. Actions wait a moment before
 * applying so loaders, disabled buttons and success messages are visible, the
 * way they would be against a real server.
 */

export function wait(ms = 550) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

export function uid(prefix: string) {
  return `${prefix}-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
}

const nowIso = () => new Date().toISOString();

function requireUser(): User {
  const id = getSessionUserId();
  const user = getState().users.find((u) => u.id === id);
  if (!user) throw new Error("Please sign in first.");
  return user;
}

const PREF_FOR_KIND: Record<NotificationKind, keyof User["prefs"] | null> = {
  booking: "bookings",
  message: "messages",
  reminder: "reminders",
  community: "community",
  application: null,
  system: null,
};

function notify(
  draft: DemoState,
  userId: string,
  n: Pick<AppNotification, "kind" | "title" | "body" | "link">,
) {
  const user = draft.users.find((u) => u.id === userId);
  if (!user || !user.prefs.inApp) return;
  const pref = PREF_FOR_KIND[n.kind];
  if (pref && !user.prefs[pref]) return;
  draft.notifications.unshift({ id: uid("n"), userId, at: nowIso(), read: false, ...n });
}

function nameOf(draft: DemoState, id: string) {
  return draft.users.find((u) => u.id === id)?.name ?? "Someone";
}

/* ---------------------------------------------------------------- accounts */

export async function signIn(email: string, password: string) {
  await wait(700);
  const user = getState().users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());
  if (!user || user.password !== password)
    throw new Error("That email and password don't match an account.");
  if (user.status === "suspended")
    throw new Error("This account has been suspended. Contact hello@thepetwork.com.");
  return user;
}

/** Second step of sign-in and sign-up. Any 6-digit code works in the demo. */
export async function verifyCode(userId: string, code: string) {
  await wait(600);
  if (!/^\d{6}$/.test(code)) throw new Error("Enter the 6-digit code from your email.");
  setSessionUserId(userId);
  return getState().users.find((u) => u.id === userId)!;
}

/** Skip verification — used by the demo switcher. */
export function signInAs(userId: string | null) {
  setSessionUserId(userId);
}

export function signOut() {
  setSessionUserId(null);
}

export async function signUp(input: {
  name: string;
  email: string;
  phone: string;
  password: string;
  area: string;
  role: Role;
  marketing: boolean;
}) {
  await wait(800);
  const email = input.email.trim().toLowerCase();
  if (getState().users.some((u) => u.email.toLowerCase() === email)) {
    throw new Error("An account with this email already exists. Try signing in.");
  }
  const user: User = {
    id: uid("u"),
    role: input.role,
    name: input.name.trim(),
    email,
    phone: input.phone.trim(),
    password: input.password,
    area: input.area.trim(),
    avatar: "",
    joinedAt: nowIso(),
    status: "active",
    prefs: {
      inApp: true,
      email: true,
      reminders: true,
      bookings: true,
      messages: true,
      community: true,
      marketing: input.marketing,
    },
  };
  mutate((d) => {
    d.users.push(user);
    notify(d, user.id, {
      kind: "system",
      title: "Welcome to The Petwork",
      body:
        input.role === "pro"
          ? "Finish your professional application to get verified."
          : "Add your first pet to start their Digital Collar.",
      link: input.role === "pro" ? "/pro-signup" : "/digital-collar",
    });
    const founder = d.users.find((u) => u.role === "founder");
    if (founder)
      notify(d, founder.id, {
        kind: "system",
        title: "New sign-up",
        body: `${user.name} joined as ${input.role === "pro" ? "a professional" : "a pet owner"}.`,
        link: "/founder?section=users",
      });
  });
  return user;
}

export async function requestPasswordReset(email: string) {
  await wait(800);
  return getState().users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase()) ?? null;
}

export async function resetPassword(userId: string, password: string) {
  await wait(700);
  mutate((d) => {
    const u = d.users.find((x) => x.id === userId);
    if (u) u.password = password;
  });
}

export async function updateAccount(
  patch: Partial<Pick<User, "name" | "phone" | "area" | "email">>,
) {
  const me = requireUser();
  await wait();
  mutate((d) => {
    const u = d.users.find((x) => x.id === me.id)!;
    Object.assign(u, patch);
  });
}

export async function updatePrefs(patch: Partial<User["prefs"]>) {
  const me = requireUser();
  await wait(300);
  mutate((d) => {
    const u = d.users.find((x) => x.id === me.id)!;
    u.prefs = { ...u.prefs, ...patch };
  });
}

export async function changePassword(current: string, next: string) {
  const me = requireUser();
  await wait();
  if (me.password !== current) throw new Error("Your current password is not right.");
  mutate((d) => {
    d.users.find((x) => x.id === me.id)!.password = next;
  });
}

export async function deleteAccount() {
  const me = requireUser();
  await wait(900);
  mutate((d) => {
    d.users = d.users.filter((u) => u.id !== me.id);
    const petIds = new Set(d.pets.filter((p) => p.ownerId === me.id).map((p) => p.id));
    d.pets = d.pets.filter((p) => !petIds.has(p.id));
    d.health = d.health.filter((x) => !petIds.has(x.petId));
    d.vaccinations = d.vaccinations.filter((x) => !petIds.has(x.petId));
    d.medications = d.medications.filter((x) => !petIds.has(x.petId));
    d.documents = d.documents.filter((x) => !petIds.has(x.petId));
    d.reminders = d.reminders.filter((x) => x.ownerId !== me.id);
    d.notifications = d.notifications.filter((x) => x.userId !== me.id);
    d.favourites = d.favourites.filter((x) => x.userId !== me.id);
  });
  setSessionUserId(null);
}

/** Everything the signed-in user has stored, as a JSON file download. */
export function exportMyData() {
  const me = requireUser();
  const d = getState();
  const petIds = new Set(d.pets.filter((p) => p.ownerId === me.id).map((p) => p.id));
  const { password: _password, ...profile } = me;
  return {
    exportedAt: nowIso(),
    profile,
    pets: d.pets.filter((p) => petIds.has(p.id)),
    health: d.health.filter((x) => petIds.has(x.petId)),
    vaccinations: d.vaccinations.filter((x) => petIds.has(x.petId)),
    medications: d.medications.filter((x) => petIds.has(x.petId)),
    documents: d.documents
      .filter((x) => petIds.has(x.petId))
      .map(({ dataUrl: _dataUrl, ...doc }) => doc),
    reminders: d.reminders.filter((x) => x.ownerId === me.id),
    bookings: d.bookings.filter((b) => b.ownerId === me.id || b.proId === me.id),
    posts: d.posts.filter((p) => p.authorId === me.id),
  };
}

/* -------------------------------------------------------------------- pets */

export type PetInput = Omit<Pet, "id" | "ownerId">;

export async function savePet(input: PetInput, id?: string) {
  const me = requireUser();
  await wait();
  const petId = id ?? uid("pet");
  mutate((d) => {
    if (id) {
      const pet = d.pets.find((p) => p.id === id && p.ownerId === me.id);
      if (pet) Object.assign(pet, input);
    } else {
      d.pets.push({ ...input, id: petId, ownerId: me.id });
    }
  });
  return petId;
}

export async function deletePet(id: string) {
  const me = requireUser();
  await wait();
  mutate((d) => {
    d.pets = d.pets.filter((p) => !(p.id === id && p.ownerId === me.id));
    d.health = d.health.filter((x) => x.petId !== id);
    d.vaccinations = d.vaccinations.filter((x) => x.petId !== id);
    d.medications = d.medications.filter((x) => x.petId !== id);
    d.documents = d.documents.filter((x) => x.petId !== id);
    d.reminders = d.reminders.filter((x) => x.petId !== id);
  });
}

type RecordKind = "health" | "vaccinations" | "medications" | "documents";
type RecordOf<K extends RecordKind> = DemoState[K][number];

export async function saveRecord<K extends RecordKind>(
  kind: K,
  record: Omit<RecordOf<K>, "id"> & { id?: string },
) {
  requireUser();
  await wait();
  const id = record.id ?? uid(kind.slice(0, 3));
  mutate((d) => {
    const list = d[kind] as RecordOf<K>[];
    const existing = list.find((x) => x.id === id);
    if (existing) Object.assign(existing, record);
    else list.unshift({ ...record, id } as RecordOf<K>);
  });

  // A new vaccination with a due date gets a matching reminder.
  if (kind === "vaccinations" && !record.id) {
    const v = record as unknown as Vaccination;
    const pet = getState().pets.find((p) => p.id === v.petId);
    if (pet && v.dueOn) {
      mutate((d) => {
        d.reminders.push({
          id: uid("r"),
          ownerId: pet.ownerId,
          petId: pet.id,
          kind: "Vaccination",
          title: `${v.name} due`,
          dueOn: v.dueOn,
          time: "10:00",
          repeat: "none",
          notes: `Auto-created from ${pet.name}'s vaccination record.`,
          done: false,
        });
      });
    }
  }
  return id;
}

export async function deleteRecord(kind: RecordKind, id: string) {
  requireUser();
  await wait(350);
  mutate((d) => {
    const list = d[kind] as { id: string }[];
    const i = list.findIndex((x) => x.id === id);
    if (i >= 0) list.splice(i, 1);
  });
}

export type { HealthEntry, Vaccination, Medication, PetDocument };

/* --------------------------------------------------------------- reminders */

export async function saveReminder(
  input: Omit<Reminder, "id" | "ownerId" | "done"> & { id?: string },
) {
  const me = requireUser();
  await wait();
  mutate((d) => {
    const existing = input.id ? d.reminders.find((r) => r.id === input.id) : null;
    if (existing) Object.assign(existing, input);
    else {
      d.reminders.push({ ...input, id: uid("r"), ownerId: me.id, done: false });
      const pet = d.pets.find((p) => p.id === input.petId);
      notify(d, me.id, {
        kind: "reminder",
        title: `Reminder set: ${input.title}`,
        body: `${pet?.name ?? "Your pet"} · due ${dayLabel(input.dueOn)}`,
        link: "/reminders",
      });
    }
  });
}

export async function toggleReminder(id: string) {
  await wait(250);
  mutate((d) => {
    const r = d.reminders.find((x) => x.id === id);
    if (r) r.done = !r.done;
  });
}

export async function deleteReminder(id: string) {
  await wait(300);
  mutate((d) => {
    d.reminders = d.reminders.filter((r) => r.id !== id);
  });
}

/* ----------------------------------------------------------- notifications */

export function markNotificationRead(id: string) {
  mutate((d) => {
    const n = d.notifications.find((x) => x.id === id);
    if (n) n.read = true;
  });
}

export function markAllNotificationsRead() {
  const me = requireUser();
  mutate((d) => {
    for (const n of d.notifications) if (n.userId === me.id) n.read = true;
  });
}

/* ---------------------------------------------------------------- bookings */

export function slotTaken(
  state: DemoState,
  proId: string,
  date: string,
  time: string,
  ignoreId?: string,
) {
  return state.bookings.some(
    (b) =>
      b.proId === proId &&
      b.date === date &&
      b.time === time &&
      b.id !== ignoreId &&
      (b.status === "accepted" || b.status === "requested"),
  );
}

export async function requestBooking(
  input: Pick<
    Booking,
    "proId" | "petId" | "service" | "date" | "time" | "durationMins" | "notes" | "price"
  >,
) {
  const me = requireUser();
  await wait(900);
  if (slotTaken(getState(), input.proId, input.date, input.time)) {
    throw new Error("That slot was just taken. Please pick another time.");
  }
  const id = uid("b");
  mutate((d) => {
    d.bookings.unshift({
      ...input,
      id,
      ownerId: me.id,
      status: "requested",
      reason: "",
      createdAt: nowIso(),
      updatedAt: nowIso(),
      review: null,
    });
    const pet = d.pets.find((p) => p.id === input.petId);
    notify(d, input.proId, {
      kind: "booking",
      title: `New booking request from ${me.name}`,
      body: `${input.service} for ${pet?.name ?? "a pet"} · ${dayLabel(input.date)} at ${timeLabel(input.time)}`,
      link: "/pro/bookings",
    });
  });
  return id;
}

export async function setBookingStatus(id: string, status: BookingStatus, reason = "") {
  const me = requireUser();
  await wait(700);
  const b = getState().bookings.find((x) => x.id === id);
  if (!b) throw new Error("Booking not found.");
  if (status === "accepted") {
    const clash = getState().bookings.some(
      (x) =>
        x.proId === b.proId &&
        x.date === b.date &&
        x.time === b.time &&
        x.id !== b.id &&
        x.status === "accepted",
    );
    if (clash) throw new Error("You already have a confirmed booking at this time.");
  }
  mutate((d) => {
    const bk = d.bookings.find((x) => x.id === id)!;
    bk.status = status;
    bk.reason = reason;
    bk.updatedAt = nowIso();
    const pet = d.pets.find((p) => p.id === bk.petId)?.name ?? "your pet";
    const proName = nameOf(d, bk.proId);
    const ownerName = nameOf(d, bk.ownerId);
    const copy: Record<BookingStatus, [string, string, string] | null> = {
      requested: null,
      accepted: [
        bk.ownerId,
        `${proName} accepted your booking`,
        `${bk.service} for ${pet} on ${dayLabel(bk.date)} at ${timeLabel(bk.time)}.`,
      ],
      declined: [
        bk.ownerId,
        `${proName} couldn't take your booking`,
        reason || "Try another time or professional.",
      ],
      cancelled:
        me.id === bk.ownerId
          ? [
              bk.proId,
              `${ownerName} cancelled a booking`,
              `${dayLabel(bk.date)} at ${timeLabel(bk.time)}${reason ? ` · ${reason}` : ""}`,
            ]
          : [
              bk.ownerId,
              `${proName} cancelled your booking`,
              reason || `${dayLabel(bk.date)} at ${timeLabel(bk.time)}`,
            ],
      completed: [
        bk.ownerId,
        `${pet}'s session is complete`,
        `How did it go with ${proName}? Leave a review.`,
      ],
    };
    const c = copy[status];
    if (c)
      notify(d, c[0], {
        kind: "booking",
        title: c[1],
        body: c[2],
        link: c[0] === bk.proId ? "/pro/bookings" : "/bookings",
      });
  });
}

export async function reviewBooking(id: string, rating: number, text: string) {
  await wait();
  mutate((d) => {
    const bk = d.bookings.find((x) => x.id === id);
    if (!bk) return;
    bk.review = { rating, text };
    const pro = d.pros.find((p) => p.userId === bk.proId);
    if (pro) {
      pro.rating =
        Math.round(((pro.rating * pro.reviewCount + rating) / (pro.reviewCount + 1)) * 10) / 10;
      pro.reviewCount += 1;
    }
    notify(d, bk.proId, {
      kind: "booking",
      title: `New ${rating}-star review`,
      body: text || "No comment left.",
      link: "/pro/bookings",
    });
  });
}

/* ---------------------------------------------------------------- messages */

export function threadWith(otherId: string) {
  const me = requireUser();
  const ownerId = me.role === "pro" ? otherId : me.id;
  const proId = me.role === "pro" ? me.id : otherId;
  const existing = getState().threads.find((t) => t.ownerId === ownerId && t.proId === proId);
  if (existing) return existing.id;
  const id = uid("t");
  mutate((d) => {
    d.threads.unshift({ id, ownerId, proId, updatedAt: nowIso() });
  });
  return id;
}

const AUTO_REPLIES = [
  "Thanks for the message! Let me check my schedule and get back to you shortly.",
  "Sounds good — I'll keep that in mind for the session. 🐾",
  "Got it! Feel free to send any other details about your pet's routine.",
];

export async function sendMessage(threadId: string, body: string) {
  const me = requireUser();
  const text = body.trim();
  if (!text) return;
  await wait(250);
  mutate((d) => {
    d.messages.push({
      id: uid("msg"),
      threadId,
      senderId: me.id,
      body: text.slice(0, 2000),
      at: nowIso(),
      readBy: [me.id],
    });
    const t = d.threads.find((x) => x.id === threadId);
    if (!t) return;
    t.updatedAt = nowIso();
    const to = me.id === t.ownerId ? t.proId : t.ownerId;
    notify(d, to, {
      kind: "message",
      title: `New message from ${me.name}`,
      body: text.slice(0, 120),
      link: `/messages?t=${threadId}`,
    });
  });

  // Simulated reply so a single presenter can show a two-way conversation.
  const t = getState().threads.find((x) => x.id === threadId);
  if (t && me.id === t.ownerId && getState().settings.autoReplies) {
    window.setTimeout(() => {
      const count = getState().messages.filter(
        (m) => m.threadId === threadId && m.senderId === t.proId,
      ).length;
      mutate((d) => {
        d.messages.push({
          id: uid("msg"),
          threadId,
          senderId: t.proId,
          body: AUTO_REPLIES[count % AUTO_REPLIES.length]!,
          at: nowIso(),
          readBy: [t.proId],
        });
        const th = d.threads.find((x) => x.id === threadId);
        if (th) th.updatedAt = nowIso();
        notify(d, t.ownerId, {
          kind: "message",
          title: `New message from ${nameOf(d, t.proId)}`,
          body: AUTO_REPLIES[count % AUTO_REPLIES.length]!,
          link: `/messages?t=${threadId}`,
        });
      });
    }, 3500);
  }
}

export function markThreadRead(threadId: string) {
  const id = getSessionUserId();
  if (!id) return;
  const unread = getState().messages.some((m) => m.threadId === threadId && !m.readBy.includes(id));
  const unreadNotes = getState().notifications.some(
    (n) => n.userId === id && !n.read && n.link === `/messages?t=${threadId}`,
  );
  if (!unread && !unreadNotes) return;
  mutate((d) => {
    for (const m of d.messages)
      if (m.threadId === threadId && !m.readBy.includes(id)) m.readBy.push(id);
    for (const n of d.notifications)
      if (n.userId === id && n.link === `/messages?t=${threadId}`) n.read = true;
  });
}

/* ----------------------------------------------------------- professionals */

export async function submitApplication(input: {
  name: string;
  email: string;
  phone: string;
  area: string;
  years: number;
  services: ProProfile["types"];
  bio: string;
  idDocName: string;
  videoName: string;
  references: { name: string; phone: string; relation: string }[];
}) {
  const me = requireUser();
  await wait(1100);
  mutate((d) => {
    const existing = d.applications.find((a) => a.userId === me.id);
    const history = existing ? [...existing.history] : [];
    history.push({
      status: "submitted",
      at: nowIso(),
      note: existing ? "Resubmitted with changes." : "",
    });
    const app = {
      id: existing?.id ?? uid("app"),
      userId: me.id,
      ...input,
      status: "submitted" as const,
      submittedAt: nowIso(),
      checks: { id: false, references: false, video: false },
      history,
    };
    if (existing) Object.assign(existing, app);
    else d.applications.unshift(app);

    if (!d.pros.some((p) => p.userId === me.id)) {
      d.pros.push({
        userId: me.id,
        types: input.services,
        headline: `${input.services.join(" & ")} in ${input.area}`,
        bio: input.bio,
        area: input.area,
        years: input.years,
        priceFrom: 300,
        priceUnit: "per session",
        languages: ["Hindi", "English"],
        services: [],
        rating: 0,
        reviewCount: 0,
        workDays: [1, 2, 3, 4, 5],
        slots: ["09:00", "17:00"],
        blockedDates: [],
        listed: false,
      });
    }
    notify(d, me.id, {
      kind: "application",
      title: "Application received",
      body: "We'll review it within 3 to 5 business days.",
      link: "/pro/application",
    });
    const founder = d.users.find((u) => u.role === "founder");
    if (founder)
      notify(d, founder.id, {
        kind: "application",
        title: "New professional application",
        body: `${input.name} applied as ${input.services.join(", ")}.`,
        link: "/founder?section=applications",
      });
  });
}

export async function reviewApplication(id: string, status: ApplicationStatus, note = "") {
  await wait(800);
  mutate((d) => {
    const app = d.applications.find((a) => a.id === id);
    if (!app) return;
    app.status = status;
    app.history.push({ status, at: nowIso(), note });
    if (status === "approved") app.checks = { id: true, references: true, video: true };
    const pro = d.pros.find((p) => p.userId === app.userId);
    if (pro) pro.listed = status === "approved";
    const copy: Partial<Record<ApplicationStatus, [string, string]>> = {
      in_review: ["Your application is in review", "Our team has started checking your documents."],
      approved: [
        "You're verified! 🎉",
        "Your profile is now live on the Pro Portal with a verified badge.",
      ],
      changes_requested: [
        "Changes requested on your application",
        note || "Please update your application.",
      ],
      rejected: [
        "Update on your application",
        note || "We're unable to approve your application right now.",
      ],
    };
    const c = copy[status];
    if (c)
      notify(d, app.userId, {
        kind: "application",
        title: c[0],
        body: c[1],
        link: "/pro/application",
      });
  });
}

export async function setApplicationCheck(
  id: string,
  check: "id" | "references" | "video",
  value: boolean,
) {
  mutate((d) => {
    const app = d.applications.find((a) => a.id === id);
    if (app) app.checks[check] = value;
  });
}

export async function updateProProfile(patch: Partial<Omit<ProProfile, "userId">>) {
  const me = requireUser();
  await wait();
  mutate((d) => {
    const pro = d.pros.find((p) => p.userId === me.id);
    if (pro) Object.assign(pro, patch);
  });
}

/* --------------------------------------------------------- Daily Bark */

export async function savePost(
  input: Pick<Post, "type" | "title" | "content" | "species" | "videoUrl">,
  id?: string,
) {
  const me = requireUser();
  await wait(800);
  const postId = id ?? uid("post");
  mutate((d) => {
    if (id) {
      const p = d.posts.find((x) => x.id === id);
      if (p) Object.assign(p, input, { editedAt: nowIso() });
    } else {
      d.posts.unshift({
        ...input,
        id: postId,
        authorId: me.id,
        authorName: me.name,
        createdAt: nowIso(),
        editedAt: "",
        baseLikes: 0,
        likedBy: [],
        savedBy: [],
        status: me.role === "founder" ? "published" : "pending",
      });
      const founder = d.users.find((u) => u.role === "founder");
      if (founder && me.role !== "founder")
        notify(d, founder.id, {
          kind: "community",
          title: "New Daily Bark post to approve",
          body: input.title,
          link: "/founder?section=moderation",
        });
    }
  });
  return postId;
}

export async function deletePost(id: string) {
  await wait(500);
  mutate((d) => {
    d.posts = d.posts.filter((p) => p.id !== id);
    d.comments = d.comments.filter((c) => c.postId !== id);
  });
}

export function toggleLike(postId: string) {
  const me = requireUser();
  mutate((d) => {
    const p = d.posts.find((x) => x.id === postId);
    if (!p) return;
    p.likedBy = p.likedBy.includes(me.id)
      ? p.likedBy.filter((x) => x !== me.id)
      : [...p.likedBy, me.id];
  });
}

export function toggleSave(postId: string) {
  const me = requireUser();
  let saved = false;
  mutate((d) => {
    const p = d.posts.find((x) => x.id === postId);
    if (!p) return;
    saved = !p.savedBy.includes(me.id);
    p.savedBy = saved ? [...p.savedBy, me.id] : p.savedBy.filter((x) => x !== me.id);
  });
  return saved;
}

export async function addComment(postId: string, body: string) {
  const me = requireUser();
  await wait(400);
  mutate((d) => {
    d.comments.push({
      id: uid("c"),
      postId,
      authorId: me.id,
      authorName: me.name,
      body: body.trim().slice(0, 1000),
      at: nowIso(),
      status: "published",
    });
    const post = d.posts.find((p) => p.id === postId);
    if (post && post.authorId !== me.id)
      notify(d, post.authorId, {
        kind: "community",
        title: `${me.name} commented on your post`,
        body: body.slice(0, 100),
        link: `/daily-bark/${postId}`,
      });
  });
}

export async function deleteComment(id: string) {
  await wait(300);
  mutate((d) => {
    d.comments = d.comments.filter((c) => c.id !== id);
  });
}

export async function report(
  targetKind: ReportTarget,
  targetId: string,
  excerpt: string,
  reason: string,
  details: string,
) {
  const me = requireUser();
  await wait(600);
  mutate((d) => {
    d.reports.unshift({
      id: uid("rep"),
      targetKind,
      targetId,
      excerpt: excerpt.slice(0, 140),
      reason,
      details,
      reporterId: me.id,
      at: nowIso(),
      status: "open",
    });
    const founder = d.users.find((u) => u.role === "founder");
    if (founder)
      notify(d, founder.id, {
        kind: "community",
        title: "New report to review",
        body: `${reason}: “${excerpt.slice(0, 80)}”`,
        link: "/founder?section=moderation",
      });
  });
}

/* --------------------------------------------------------- Pack Social */

export async function createCommunity(input: {
  name: string;
  category: string;
  description: string;
}) {
  const me = requireUser();
  await wait(700);
  if (
    getState().communities.some((c) => c.name.toLowerCase() === input.name.trim().toLowerCase())
  ) {
    throw new Error("A community with that name already exists.");
  }
  const id = uid("com");
  mutate((d) => {
    d.communities.unshift({
      id,
      name: input.name.trim(),
      category: input.category,
      description: input.description.trim(),
      createdBy: me.id,
      baseMembers: 0,
      members: [me.id],
      status: "active",
      createdAt: nowIso(),
    });
  });
  return id;
}

export async function toggleMembership(communityId: string) {
  const me = requireUser();
  await wait(400);
  let joined = false;
  mutate((d) => {
    const c = d.communities.find((x) => x.id === communityId);
    if (!c) return;
    joined = !c.members.includes(me.id);
    c.members = joined ? [...c.members, me.id] : c.members.filter((x) => x !== me.id);
  });
  return joined;
}

export async function addCommunityPost(communityId: string, body: string) {
  const me = requireUser();
  await wait(500);
  mutate((d) => {
    d.communityPosts.unshift({
      id: uid("cp"),
      communityId,
      authorId: me.id,
      authorName: me.name,
      body: body.trim().slice(0, 1500),
      at: nowIso(),
      status: "published",
      replies: [],
    });
  });
}

export async function addReply(postId: string, body: string) {
  const me = requireUser();
  await wait(350);
  mutate((d) => {
    const p = d.communityPosts.find((x) => x.id === postId);
    if (!p) return;
    p.replies.push({
      id: uid("cpr"),
      authorId: me.id,
      authorName: me.name,
      body: body.trim().slice(0, 1000),
      at: nowIso(),
    });
    if (p.authorId !== me.id)
      notify(d, p.authorId, {
        kind: "community",
        title: `${me.name} replied to your post`,
        body: body.slice(0, 100),
        link: `/pack-social/${p.communityId}`,
      });
  });
}

export async function deleteCommunityPost(id: string) {
  await wait(300);
  mutate((d) => {
    d.communityPosts = d.communityPosts.filter((p) => p.id !== id);
  });
}

export function toggleBlock(blockedId: string) {
  const me = requireUser();
  let blocked = false;
  mutate((d) => {
    const exists = d.blocks.some((b) => b.userId === me.id && b.blockedId === blockedId);
    blocked = !exists;
    d.blocks = exists
      ? d.blocks.filter((b) => !(b.userId === me.id && b.blockedId === blockedId))
      : [...d.blocks, { userId: me.id, blockedId }];
  });
  return blocked;
}

/* ----------------------------------------------------- Neighbourhood Watch */

export function toggleFavourite(placeId: string) {
  const me = requireUser();
  let fav = false;
  mutate((d) => {
    const exists = d.favourites.some((f) => f.userId === me.id && f.placeId === placeId);
    fav = !exists;
    d.favourites = exists
      ? d.favourites.filter((f) => !(f.userId === me.id && f.placeId === placeId))
      : [...d.favourites, { userId: me.id, placeId }];
  });
  return fav;
}

/* ----------------------------------------------------------------- founder */

export async function moderateReport(id: string, action: "removed" | "dismissed") {
  await wait(500);
  mutate((d) => {
    const r = d.reports.find((x) => x.id === id);
    if (!r) return;
    r.status = action;
    if (action !== "removed") return;
    if (r.targetKind === "post") {
      const p = d.posts.find((x) => x.id === r.targetId);
      if (p) p.status = "removed";
    } else if (r.targetKind === "comment") {
      const c = d.comments.find((x) => x.id === r.targetId);
      if (c) c.status = "removed";
    } else if (r.targetKind === "communityPost") {
      const c = d.communityPosts.find((x) => x.id === r.targetId);
      if (c) c.status = "removed";
    }
  });
}

export async function setPostStatus(id: string, status: Post["status"]) {
  await wait(450);
  mutate((d) => {
    const p = d.posts.find((x) => x.id === id);
    if (!p) return;
    p.status = status;
    if (status === "published")
      notify(d, p.authorId, {
        kind: "community",
        title: "Your Daily Bark post is live",
        body: p.title,
        link: `/daily-bark/${p.id}`,
      });
    if (status === "removed")
      notify(d, p.authorId, {
        kind: "community",
        title: "Your post was not approved",
        body: p.title,
        link: "/daily-bark",
      });
  });
}

export async function setUserStatus(id: string, status: User["status"]) {
  await wait(450);
  mutate((d) => {
    const u = d.users.find((x) => x.id === id);
    if (u) u.status = status;
    const pro = d.pros.find((p) => p.userId === id);
    if (pro && status === "suspended") pro.listed = false;
    if (pro && status === "active")
      pro.listed = d.applications.some((a) => a.userId === id && a.status === "approved");
  });
}

export async function setCommunityStatus(id: string, status: "active" | "archived") {
  await wait(400);
  mutate((d) => {
    const c = d.communities.find((x) => x.id === id);
    if (c) c.status = status;
  });
}

export function setPlaceOverride(
  id: string,
  patch: { published?: boolean; image?: string | null },
) {
  mutate((d) => {
    const current = { ...(d.placeOverrides[id] ?? {}) };
    if (patch.published !== undefined) current.published = patch.published;
    if (patch.image === null) delete current.image;
    else if (patch.image !== undefined) current.image = patch.image;
    d.placeOverrides[id] = current;
  });
}

export async function addCustomPlace(place: PetPlace, image?: string) {
  await wait(600);
  mutate((d) => {
    d.customPlaces.unshift(place);
    d.placeOverrides[place.id] = {
      published: place.published ?? true,
      ...(image ? { image } : {}),
    };
  });
}

export async function saveEmergencyContact(vet: EmergencyVet) {
  await wait(500);
  mutate((d) => {
    const i = d.emergency.findIndex((v) => v.id === vet.id);
    if (i >= 0) d.emergency[i] = vet;
    else d.emergency.unshift(vet);
  });
}

export async function deleteEmergencyContact(id: string) {
  await wait(350);
  mutate((d) => {
    d.emergency = d.emergency.filter((v) => v.id !== id);
  });
}

export async function saveMunicipalRule(rule: MunicipalRule) {
  await wait(500);
  mutate((d) => {
    const i = d.municipal.findIndex((r) => r.id === rule.id);
    if (i >= 0) d.municipal[i] = rule;
    else d.municipal.push(rule);
  });
}

export async function setRecipeOverride(id: string, patch: { hidden?: boolean; note?: string }) {
  await wait(300);
  mutate((d) => {
    d.recipeOverrides[id] = { ...(d.recipeOverrides[id] ?? {}), ...patch };
  });
}

/* -------------------------------------------------------------------- demo */

export function resetDemo() {
  resetDemoData();
}

export function setAutoReplies(on: boolean) {
  mutate((d) => {
    d.settings.autoReplies = on;
  });
}
