import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { CheckCheck, Settings } from "lucide-react";
import { NotificationRow, useMyNotifications } from "@/components/app/NotificationBell";
import { RequireRole } from "@/components/app/RequireRole";
import {
  EmptyState,
  ListSkeleton,
  PageHeader,
  TabPills,
  useFakeLoading,
} from "@/components/app/ui";
import { Button } from "@/components/ui/button";
import { markAllNotificationsRead, markNotificationRead } from "@/mock/actions";
import type { NotificationKind, User } from "@/mock/types";

export const Route = createFileRoute("/notifications")({
  head: () => ({ meta: [{ title: "Notifications | The Petwork" }] }),
  component: () => (
    <RequireRole roles={["owner", "pro", "founder"]}>
      {(user) => <Notifications user={user} />}
    </RequireRole>
  ),
});

const FILTERS: { key: "all" | "unread" | NotificationKind; label: string }[] = [
  { key: "all", label: "All" },
  { key: "unread", label: "Unread" },
  { key: "booking", label: "Bookings" },
  { key: "message", label: "Messages" },
  { key: "reminder", label: "Reminders" },
  { key: "community", label: "Community" },
  { key: "application", label: "Verification" },
];

function Notifications({ user }: { user: User }) {
  const navigate = useNavigate();
  const loading = useFakeLoading();
  const { all, unread } = useMyNotifications(user.id);
  const [filter, setFilter] = useState<(typeof FILTERS)[number]["key"]>("all");
  const shown = all.filter((n) =>
    filter === "all" ? true : filter === "unread" ? !n.read : n.kind === filter,
  );
  const tabs = FILTERS.filter(
    (f) => f.key === "all" || f.key === "unread" || all.some((n) => n.kind === f.key),
  );

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <PageHeader
        title="Notifications"
        sub={unread ? `${unread} unread` : "You're all caught up."}
        actions={
          <>
            {unread > 0 && (
              <Button variant="outline" className="rounded-full" onClick={markAllNotificationsRead}>
                <CheckCheck className="size-4" /> Mark all read
              </Button>
            )}
            <Button asChild variant="ghost" className="rounded-full">
              <Link to="/account">
                <Settings className="size-4" /> Preferences
              </Link>
            </Button>
          </>
        }
      />
      <TabPills
        className="mt-6"
        tabs={tabs.map((t) => ({ ...t, count: t.key === "unread" ? unread : undefined }))}
        value={filter}
        onChange={setFilter}
      />
      <div className="mt-5">
        {loading ? (
          <ListSkeleton rows={4} />
        ) : shown.length === 0 ? (
          <EmptyState
            title="Nothing here"
            text="Booking updates, messages and reminders will show up here."
          />
        ) : (
          <div className="card-cozy p-2">
            {shown.map((n) => (
              <NotificationRow
                key={n.id}
                n={n}
                onOpen={(x) => {
                  markNotificationRead(x.id);
                  void navigate({ href: x.link });
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
