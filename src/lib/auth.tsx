import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type Role = "owner";

export type Session = {
  role: Role;
  name: string;
  email: string;
};

type AuthValue = {
  session: Session | null;
  signIn: (session: Session) => void;
  signOut: () => void;
  ready: boolean;
};

const STORAGE_KEY = "petwork.session";

const AuthContext = createContext<AuthValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setSession(JSON.parse(raw) as Session);
    } catch {
      /* ignore malformed session */
    }
    setReady(true);
  }, []);

  const value = useMemo<AuthValue>(
    () => ({
      session,
      ready,
      signIn: (next) => {
        setSession(next);
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      },
      signOut: () => {
        setSession(null);
        window.localStorage.removeItem(STORAGE_KEY);
      },
    }),
    [session, ready],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
