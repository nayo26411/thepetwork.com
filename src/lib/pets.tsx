import { useMemo, type ReactNode } from "react";
import { useDemo, useSession } from "@/mock/store";
import type { Pet } from "@/mock/types";

export type { Pet };

/** Kept so the app shell's provider tree stays the same; pets live in the demo store. */
export function PetsProvider({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

/** The signed-in owner's pets from The Digital Collar, shared across the app (Pawsy reads these). */
export function usePets() {
  const data = useDemo();
  const { user, ready } = useSession();
  const pets = useMemo(
    () => (user ? data.pets.filter((p) => p.ownerId === user.id) : []),
    [data.pets, user],
  );
  return { pets, ready };
}
