import { useCallback, useEffect, useState, type ComponentType, type ReactNode } from "react";
import { PawPrint, Star, WifiOff } from "lucide-react";
import { toast } from "sonner";
import { EmptyMark } from "@/components/EmptyMark";
import { Skeleton } from "@/components/ui/skeleton";
import { initials } from "@/mock/format";
import { cn } from "@/lib/utils";
import type { Pet } from "@/mock/types";

/** Run an async action with a busy flag and a toast if it fails. */
export function useBusy() {
  const [busy, setBusy] = useState(false);
  const run = useCallback(async <T,>(fn: () => Promise<T>): Promise<T | undefined> => {
    setBusy(true);
    try {
      return await fn();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Something went wrong. Please try again.");
      return undefined;
    } finally {
      setBusy(false);
    }
  }, []);
  return [busy, run] as const;
}

/** A short first-load delay so skeleton states show, the way a real fetch would. */
export function useFakeLoading(ms = 450) {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const t = window.setTimeout(() => setLoading(false), ms);
    return () => window.clearTimeout(t);
  }, [ms]);
  return loading;
}

export function PageHeader({
  label,
  title,
  sub,
  actions,
}: {
  label?: string;
  title: string;
  sub?: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div className="min-w-0">
        {label && <p className="section-label">{label}</p>}
        <h1 className="mt-1 text-3xl text-foreground sm:text-4xl">{title}</h1>
        {sub && <p className="mt-2 max-w-2xl text-muted-foreground">{sub}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}

export function EmptyState({
  title,
  text,
  action,
  className = "",
}: {
  title: string;
  text?: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div className={`card-cozy flex flex-col items-center px-6 py-12 text-center ${className}`}>
      <EmptyMark />
      <h2 className="mt-4 text-xl text-foreground">{title}</h2>
      {text && <p className="mt-2 max-w-md text-sm text-muted-foreground">{text}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}

export function ListSkeleton({ rows = 3, className = "" }: { rows?: number; className?: string }) {
  return (
    <div className={`space-y-3 ${className}`} aria-busy="true" aria-label="Loading">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="card-cozy flex items-center gap-4 p-5">
          <Skeleton className="size-12 shrink-0 rounded-full bg-oat" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-1/3 bg-oat" />
            <Skeleton className="h-3 w-2/3 bg-oat" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function PersonAvatar({
  name,
  className = "size-10 text-sm",
}: {
  name: string;
  className?: string;
}) {
  return (
    <span
      aria-hidden
      className={cn(
        "grid shrink-0 place-items-center rounded-full bg-caramel/15 font-bold text-caramel ring-1 ring-border",
        className,
      )}
    >
      {initials(name)}
    </span>
  );
}

export function PetPhoto({
  pet,
  className = "size-14",
}: {
  pet: Pick<Pet, "name" | "photo">;
  className?: string;
}) {
  const [broken, setBroken] = useState(false);
  if (!pet.photo || broken) {
    return (
      <span
        aria-hidden
        className={`grid shrink-0 place-items-center rounded-2xl bg-oat text-caramel ring-1 ring-border ${className}`}
      >
        <PawPrint className="size-1/2" />
      </span>
    );
  }
  return (
    <img
      src={pet.photo}
      alt={pet.name}
      onError={() => setBroken(true)}
      className={`shrink-0 rounded-2xl object-cover ring-1 ring-border ${className}`}
    />
  );
}

export function Stars({ value, className = "" }: { value: number; className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-0.5 ${className}`}
      role="img"
      aria-label={`${value} out of 5 stars`}
    >
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          className={`size-3.5 ${n <= Math.round(value) ? "fill-caramel text-caramel" : "text-border"}`}
        />
      ))}
    </span>
  );
}

export function IconTile({
  icon: Icon,
  className = "",
}: {
  icon: ComponentType<{ className?: string }>;
  className?: string;
}) {
  return (
    <span
      className={`grid size-11 shrink-0 place-items-center rounded-2xl bg-accent text-caramel ${className}`}
    >
      <Icon className="size-5" />
    </span>
  );
}

export function TabPills<T extends string>({
  tabs,
  value,
  onChange,
  className = "",
}: {
  tabs: readonly { key: T; label: string; count?: number | undefined }[];
  value: T;
  onChange: (key: T) => void;
  className?: string;
}) {
  return (
    <div
      role="tablist"
      className={`inline-flex max-w-full flex-wrap gap-1.5 rounded-3xl bg-oat p-1.5 ${className}`}
    >
      {tabs.map((t) => (
        <button
          key={t.key}
          role="tab"
          aria-selected={value === t.key}
          onClick={() => onChange(t.key)}
          className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-bold transition-all ${
            value === t.key
              ? "bg-caramel text-caramel-foreground shadow-cozy"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {t.label}
          {t.count !== undefined && t.count > 0 && (
            <span
              className={`rounded-full px-1.5 text-xs ${value === t.key ? "bg-mocha/20" : "bg-card"}`}
            >
              {t.count}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}

export function OfflineBanner() {
  const [offline, setOffline] = useState(false);
  useEffect(() => {
    const update = () => setOffline(!navigator.onLine);
    update();
    window.addEventListener("online", update);
    window.addEventListener("offline", update);
    return () => {
      window.removeEventListener("online", update);
      window.removeEventListener("offline", update);
    };
  }, []);
  if (!offline) return null;
  return (
    <div
      role="status"
      className="flex items-center justify-center gap-2 bg-destructive px-4 py-2 text-sm font-bold text-destructive-foreground"
    >
      <WifiOff className="size-4" /> You're offline. Your changes are kept on this device and maps
      or Pawsy may not load.
    </div>
  );
}

export const fieldClass = "mt-1.5 w-full rounded-xl border border-input bg-card px-3 py-2 text-sm";
