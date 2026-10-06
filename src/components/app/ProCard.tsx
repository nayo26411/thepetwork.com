import { Link } from "@tanstack/react-router";
import { BadgeCheck, MapPin } from "lucide-react";
import { rupees } from "@/mock/format";
import type { ProProfile, User } from "@/mock/types";
import { PersonAvatar, Stars } from "./ui";

export function VerifiedBadge({ className = "" }: { className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full bg-verified/15 px-2.5 py-0.5 text-xs font-bold text-verified ${className}`}
    >
      <BadgeCheck className="size-3.5" /> Verified
    </span>
  );
}

export function ProCard({ pro, user }: { pro: ProProfile; user: User }) {
  return (
    <Link
      to="/pro-portal/$proId"
      params={{ proId: user.id }}
      className="card-cozy hover-lift flex flex-col p-6"
    >
      <div className="flex items-start gap-4">
        <PersonAvatar name={user.name} className="size-14 text-lg" />
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-lg text-foreground">{user.name}</h3>
          <p className="text-sm font-semibold text-caramel">{pro.types.join(" · ")}</p>
          <div className="mt-1 flex flex-wrap items-center gap-2">
            <VerifiedBadge />
            {pro.reviewCount > 0 && (
              <span className="flex items-center gap-1 text-xs font-semibold text-muted-foreground">
                <Stars value={pro.rating} /> {pro.rating.toFixed(1)} ({pro.reviewCount})
              </span>
            )}
          </div>
        </div>
      </div>
      <p className="mt-4 line-clamp-2 flex-1 text-sm leading-relaxed text-muted-foreground">
        {pro.headline}
      </p>
      <div className="mt-4 flex items-center justify-between gap-3 border-t border-border pt-4 text-sm">
        <span className="flex min-w-0 items-center gap-1.5 text-muted-foreground">
          <MapPin className="size-4 shrink-0 text-caramel" />{" "}
          <span className="truncate">{pro.area}</span>
        </span>
        <span className="shrink-0 font-bold text-foreground">from {rupees(pro.priceFrom)}</span>
      </div>
    </Link>
  );
}
