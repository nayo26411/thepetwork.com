import { PawPrint } from "lucide-react";

/**
 * Typographic/iconographic stand-in used wherever the site has nothing to show yet.
 * Intentionally image-free: a soft ring, a paw glyph, brand colours only.
 */
export function EmptyMark({ className = "" }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={`grid size-16 place-items-center rounded-full bg-oat ring-1 ring-border ${className}`}
    >
      <PawPrint className="size-7 text-caramel" />
    </span>
  );
}
