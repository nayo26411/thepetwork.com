import { Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import {
  AlertTriangle,
  CalendarClock,
  Check,
  MessageCircle,
  PawPrint,
  Star,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { reviewBooking, setBookingStatus, slotTaken, threadWith } from "@/mock/actions";
import { BOOKING_STATUS, dayLabel, rupees, timeLabel } from "@/mock/format";
import { useDemo } from "@/mock/store";
import type { Booking, User } from "@/mock/types";
import { FormDialog, str } from "./FormDialog";
import { PersonAvatar, PetPhoto, Stars, useBusy } from "./ui";

export function BookingCard({ booking: b, viewer }: { booking: Booking; viewer: User }) {
  const data = useDemo();
  const navigate = useNavigate();
  const [busy, run] = useBusy();
  const [dialog, setDialog] = useState<"decline" | "cancel" | "review" | null>(null);

  const asPro = viewer.id === b.proId;
  const other = data.users.find((u) => u.id === (asPro ? b.ownerId : b.proId));
  const pet = data.pets.find((p) => p.id === b.petId);
  const status = BOOKING_STATUS[b.status];
  const past = b.date < new Date().toISOString().slice(0, 10);
  // Another request for the same slot the pro would have to choose between.
  const clash =
    asPro &&
    b.status === "requested" &&
    data.bookings.some(
      (x) =>
        x.id !== b.id &&
        x.proId === b.proId &&
        x.date === b.date &&
        x.time === b.time &&
        x.status === "accepted",
    );

  const act = (status: Booking["status"], msg: string, reason = "") =>
    run(async () => {
      await setBookingStatus(b.id, status, reason);
      toast.success(msg);
    });

  const otherName = other?.name ?? "Unknown";
  const shortName = asPro ? otherName.split(" ")[0] : otherName;

  return (
    <article className={`card-cozy p-5 sm:p-6 ${busy ? "opacity-70" : ""}`}>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
        {pet ? (
          <PetPhoto pet={pet} className="size-16" />
        ) : (
          <PersonAvatar name={otherName} className="size-16" />
        )}
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-lg text-foreground">
              {b.service} · {pet?.name ?? "Pet"}
            </h3>
            <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${status.className}`}>
              {status.label}
            </span>
          </div>
          <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
            <span className="flex items-center gap-1 font-semibold text-foreground">
              <CalendarClock className="size-4 text-caramel" /> {dayLabel(b.date)},{" "}
              {timeLabel(b.time)} · {b.durationMins} min
            </span>
            <span>
              {asPro ? "Owner" : "With"}:{" "}
              {asPro ? (
                <span className="font-semibold text-foreground">{shortName}</span>
              ) : (
                <Link
                  to="/pro-portal/$proId"
                  params={{ proId: b.proId }}
                  className="font-semibold text-foreground hover:text-caramel"
                >
                  {shortName}
                </Link>
              )}
              {asPro && other?.area ? ` · ${other.area}` : ""}
            </span>
            <span>{rupees(b.price)}</span>
          </p>
          {asPro && pet && (
            <p className="mt-1.5 text-xs text-muted-foreground">
              <PawPrint className="mr-1 inline size-3" />
              {[pet.species, pet.breed, pet.age, pet.weight].filter(Boolean).join(" · ")}
              {pet.allergies && (
                <span className="ml-1 font-bold text-destructive">
                  · Allergies: {pet.allergies}
                </span>
              )}
            </p>
          )}
          {b.notes && (
            <p className="mt-2 rounded-xl bg-oat px-3 py-2 text-sm text-foreground/85">
              “{b.notes}”
            </p>
          )}
          {b.reason && (b.status === "declined" || b.status === "cancelled") && (
            <p className="mt-2 text-sm text-muted-foreground">Reason: {b.reason}</p>
          )}
          {clash && (
            <p className="mt-2 flex items-center gap-1.5 text-sm font-semibold text-destructive">
              <AlertTriangle className="size-4" /> You already have a confirmed booking at this
              time.
            </p>
          )}
          {b.review && (
            <div className="mt-2 flex items-center gap-2 text-sm">
              <Stars value={b.review.rating} />
              <span className="text-muted-foreground">{b.review.text}</span>
            </div>
          )}
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2 border-t border-border pt-4">
        {asPro && b.status === "requested" && (
          <>
            <Button
              size="sm"
              disabled={busy || clash}
              className="rounded-full bg-verified text-verified-foreground hover:bg-verified/90"
              onClick={() =>
                void act("accepted", "Booking confirmed — the owner has been notified")
              }
            >
              <Check className="size-4" /> Accept
            </Button>
            <Button
              size="sm"
              variant="outline"
              disabled={busy}
              className="rounded-full"
              onClick={() => setDialog("decline")}
            >
              <X className="size-4" /> Decline
            </Button>
          </>
        )}
        {asPro && b.status === "accepted" && (
          <Button
            size="sm"
            disabled={busy}
            className="rounded-full bg-mocha text-mocha-foreground hover:bg-mocha/90"
            onClick={() => void act("completed", "Marked as completed")}
          >
            <Check className="size-4" /> Mark completed
          </Button>
        )}
        {!asPro && b.status === "completed" && !b.review && (
          <Button
            size="sm"
            className="rounded-full bg-caramel text-caramel-foreground hover:bg-caramel/90"
            onClick={() => setDialog("review")}
          >
            <Star className="size-4" /> Leave a review
          </Button>
        )}
        {!asPro &&
          (b.status === "declined" || b.status === "cancelled" || b.status === "completed") && (
            <Button asChild size="sm" variant="outline" className="rounded-full">
              <Link to="/book/$proId" params={{ proId: b.proId }}>
                Book again
              </Link>
            </Button>
          )}
        {(b.status === "requested" || b.status === "accepted") &&
          !(asPro && b.status === "requested") &&
          !past && (
            <Button
              size="sm"
              variant="outline"
              disabled={busy}
              className="rounded-full text-destructive hover:bg-destructive/10 hover:text-destructive"
              onClick={() => setDialog("cancel")}
            >
              {b.status === "requested" ? "Cancel request" : "Cancel booking"}
            </Button>
          )}
        <Button
          size="sm"
          variant="ghost"
          className="ml-auto rounded-full"
          onClick={() =>
            void navigate({
              to: "/messages",
              search: { t: threadWith(asPro ? b.ownerId : b.proId) },
            })
          }
        >
          <MessageCircle className="size-4" /> Message
        </Button>
      </div>

      <FormDialog
        open={dialog === "decline" || dialog === "cancel"}
        onOpenChange={(v) => !v && setDialog(null)}
        title={dialog === "decline" ? "Decline this request?" : "Cancel this booking?"}
        description={
          dialog === "decline"
            ? "Let the owner know why, so they can rebook."
            : `${asPro ? "The owner" : "The professional"} will be notified straight away.`
        }
        fields={[
          {
            key: "reason",
            label: "Reason",
            type: "textarea",
            required: dialog === "decline",
            placeholder:
              dialog === "decline" ? "I'm away that day — could you try Friday?" : "Plans changed",
          },
        ]}
        initial={{ reason: "" }}
        submitLabel={dialog === "decline" ? "Decline request" : "Cancel booking"}
        onSubmit={async (v) => {
          await setBookingStatus(
            b.id,
            dialog === "decline" ? "declined" : "cancelled",
            str(v["reason"]),
          );
          toast.success(dialog === "decline" ? "Request declined" : "Booking cancelled");
        }}
      />
      <FormDialog
        open={dialog === "review"}
        onOpenChange={(v) => !v && setDialog(null)}
        title={`How was ${pet?.name ?? "your pet"}'s session?`}
        fields={[
          {
            key: "rating",
            label: "Rating",
            type: "select",
            required: true,
            options: [
              { value: "5", label: "★★★★★ Excellent" },
              { value: "4", label: "★★★★ Good" },
              { value: "3", label: "★★★ Okay" },
              { value: "2", label: "★★ Poor" },
              { value: "1", label: "★ Bad" },
            ],
          },
          {
            key: "text",
            label: "Your review",
            type: "textarea",
            placeholder: "What went well? Anything to improve?",
          },
        ]}
        initial={{ rating: "5", text: "" }}
        submitLabel="Post review"
        onSubmit={async (v) => {
          await reviewBooking(b.id, Number(str(v["rating"])), str(v["text"]));
          toast.success("Thanks! Your review is on their profile.");
        }}
      />
    </article>
  );
}

export const BOOKING_TABS = [
  { key: "upcoming", label: "Upcoming" },
  { key: "requested", label: "Awaiting reply" },
  { key: "past", label: "History" },
  { key: "cancelled", label: "Cancelled & declined" },
] as const;
export type BookingTab = (typeof BOOKING_TABS)[number]["key"];

export function filterBookings(list: Booking[], tab: BookingTab) {
  const today = new Date().toISOString().slice(0, 10);
  const byDate = (a: Booking, b: Booking) =>
    `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`);
  switch (tab) {
    case "upcoming":
      return list.filter((b) => b.status === "accepted" && b.date >= today).sort(byDate);
    case "requested":
      return list.filter((b) => b.status === "requested").sort(byDate);
    case "past":
      return list
        .filter((b) => b.status === "completed" || (b.status === "accepted" && b.date < today))
        .sort(byDate)
        .reverse();
    case "cancelled":
      return list
        .filter((b) => b.status === "cancelled" || b.status === "declined")
        .sort(byDate)
        .reverse();
  }
}
