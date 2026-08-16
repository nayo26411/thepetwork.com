import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type Pet = {
  name: string;
  species: string;
  breed: string;
  age: string;
  weight: string;
  about: string;
};

type PetsValue = {
  pets: Pet[];
  addPet: (pet: Pet) => void;
  ready: boolean;
};

const STORAGE_KEY = "petwork.pets";

const PetsContext = createContext<PetsValue | null>(null);

/** Pet profiles from The Digital Collar, shared across the app (Pawsy reads these). */
export function PetsProvider({ children }: { children: ReactNode }) {
  const [pets, setPets] = useState<Pet[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setPets(JSON.parse(raw) as Pet[]);
    } catch {
      /* ignore malformed store */
    }
    setReady(true);
  }, []);

  const value = useMemo<PetsValue>(
    () => ({
      pets,
      ready,
      addPet: (pet) => {
        setPets((prev) => {
          const next = [...prev, pet];
          try {
            window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
          } catch {
            /* storage unavailable */
          }
          return next;
        });
      },
    }),
    [pets, ready],
  );

  return <PetsContext.Provider value={value}>{children}</PetsContext.Provider>;
}

export function usePets() {
  const ctx = useContext(PetsContext);
  if (!ctx) throw new Error("usePets must be used inside PetsProvider");
  return ctx;
}
