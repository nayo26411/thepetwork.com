import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Plus } from "lucide-react";
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
import { Button } from "@/components/ui/button";
import { useDemo } from "@/mock/store";
import type { User } from "@/mock/types";

export const Route = createFileRoute("/bookings")({
  head: () => ({ meta: [{ title: "My bookings | The Petwork" }] }),
  component: () => (
    <RequireRole roles={["owner"]}>{(user) => <Bookings user={user} />}</RequireRole>
  ),
});

function Bookings({ user }: { user: User }) {
  const data = useDemo();
  const loading = useFakeLoading();
  const [tab, setTab] = useState<BookingTab>("upcoming");
  const mine = useMemo(
    () => data.bookings.filter((b) => b.ownerId === user.id),
    [data.bookings, user.id],
  );
  const shown = filterBookings(mine, tab);

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <PageHeader
        label="Pro Portal"
        title="My bookings"
        sub="Requests, confirmed sessions and your booking history with Petwork professionals."
        actions={
          <Button
            asChild
            className="rounded-full bg-caramel text-caramel-foreground hover:bg-caramel/90"
          >
            <Link to="/pro-portal">
              <Plus className="size-4" /> New booking
            </Link>
          </Button>
        }
      />
      <TabPills
        className="mt-6"
        tabs={BOOKING_TABS.map((t) => ({ ...t, count: filterBookings(mine, t.key).length }))}
        value={tab}
        onChange={setTab}
      />
      <div className="mt-5 space-y-4">
        <h2 className="sr-only">{BOOKING_TABS.find((t) => t.key === tab)?.label}</h2>
        {loading ? (
          <ListSkeleton rows={3} />
        ) : shown.length === 0 ? (
          <EmptyState
            title={tab === "upcoming" ? "No upcoming bookings" : "Nothing here yet"}
            text="Find a verified walker, groomer, sitter, trainer or vet and send a request."
            action={
              <Button
                asChild
                className="rounded-full bg-caramel text-caramel-foreground hover:bg-caramel/90"
              >
                <Link to="/pro-portal">Browse professionals</Link>
              </Button>
            }
          />
        ) : (
          shown.map((b) => <BookingCard key={b.id} booking={b} viewer={user} />)
        )}
      </div>
    </div>
  );
}
