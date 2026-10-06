import type { ReactNode } from "react";
import { signOut as demoSignOut } from "@/mock/actions";
import { useSession } from "@/mock/store";
import type { Role } from "@/mock/types";

export type { Role };

export type Session = {
  id: string;
  role: Role;
  name: string;
  email: string;
};

type AuthValue = {
  session: Session | null;
  signOut: () => void;
  ready: boolean;
};

/** Kept so the app shell's provider tree stays the same; the session lives in the demo store. */
export function AuthProvider({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

export function useAuth(): AuthValue {
  const { user, ready } = useSession();
  return {
    session: user ? { id: user.id, role: user.role, name: user.name, email: user.email } : null,
    signOut: demoSignOut,
    ready,
  };
}
