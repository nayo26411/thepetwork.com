import { createHash, timingSafeEqual } from "node:crypto";

export type FounderIdentity = { email: string; name: string };

export const founderSessionConfig = {
  password: process.env["SESSION_SECRET"] ?? "",
  name: "petwork-founder",
  maxAge: 60 * 60 * 8,
  cookie: {
    httpOnly: true,
    secure: process.env["NODE_ENV"] === "production",
    sameSite: "lax" as const,
    path: "/",
  },
};

/** Allowlisted founder emails: comma or newline separated in FOUNDER_EMAILS. */
export function readFounderEmails(): string[] {
  const raw = process.env["FOUNDER_EMAILS"] ?? "";
  return raw
    .split(/[\s,;]+/)
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean);
}

function digest(value: string) {
  return createHash("sha256").update(value, "utf8").digest();
}

export function matches(input: string, expected: string) {
  return timingSafeEqual(digest(input), digest(expected));
}

function nameFromEmail(email: string) {
  const handle = email.split("@")[0] ?? "Founder";
  return handle
    .split(/[._-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

/** One shared founder password; the email must be on the allowlist. */
export function findFounder(email: string, password: string): FounderIdentity | null {
  const shared = process.env["FOUNDER_PASSWORD"];
  if (!shared) return null;

  const normalised = email.trim().toLowerCase();
  const allowed = readFounderEmails();

  let emailOk = false;
  for (const candidate of allowed) {
    if (matches(normalised, candidate)) emailOk = true;
  }
  const passwordOk = matches(password, shared);
  if (!emailOk || !passwordOk) return null;

  return { email: normalised, name: nameFromEmail(normalised) };
}
