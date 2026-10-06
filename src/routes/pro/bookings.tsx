import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  BOOKING_TABS,
  BookingCard,
  filterBookings,
  type BookingTab,
} from "@/components/app/BookingCard";
import { RequireRole } from "@/components/app/RequireRole";
import {
  EmptyState,
  ListSkeleton,
  PageHeader,
  TabPills,
  useFakeLoading,
} from "@/components/app/ui";
import { useDemo } from "@/mock/store";
import type { User } from "@/mock/types";

export const Route = createFileRoute("/pro/bookings")({
  head: () => ({ meta: [{ title: "Bookings | The Petwork Pro Network" }] }),
  component: () => (
    <RequireRole roles={["pro"]}>{(user) => <ProBookings user={user} />}</RequireRole>
  ),
});

const TABS = BOOKING_TABS.map((t) => (t.key === "requested" ? { ...t, label: "Requests" } : t));

function ProBookings({ user }: { user: User }) {
  const data = useDemo();
  const loading = useFakeLoading();
  const mine = useMemo(
    () => data.bookings.filter((b) => b.proId === user.id),
    [data.bookings, user.id],
  );
  const [tab, setTab] = useState<BookingTab>(() =>
    mine.some((b) => b.status === "requested") ? "requested" : "upcoming",
  );
  const shown = filterBookings(mine, tab);

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <PageHeader
        label="Pro Network"
        title="Bookings"
        sub="Accept or decline requests, keep track of upcoming sessions and mark them complete."
      />
      <TabPills
        className="mt-6"
        tabs={TABS.map((t) => ({ ...t, count: filterBookings(mine, t.key).length }))}
        value={tab}
        onChange={setTab}
      />
      <div className="mt-5 space-y-4">
        <h2 className="sr-only">{TABS.find((t) => t.key === tab)?.label}</h2>
        {loading ? (
          <ListSkeleton rows={3} />
        ) : shown.length === 0 ? (
          <EmptyState
            title="Nothing here yet"
            text={
              tab === "requested"
                ? "New requests from pet owners will show up here."
                : "Bookings will appear here as owners book you."
            }
          />
        ) : (
          shown.map((b) => <BookingCard key={b.id} booking={b} viewer={user} />)
        )}
      </div>
    </div>
  );
}
