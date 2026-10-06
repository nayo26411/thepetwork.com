import { Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  Bell,
  CalendarCheck,
  ClipboardCheck,
  MessageCircle,
  Sparkles,
  Syringe,
  Users,
} from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { markAllNotificationsRead, markNotificationRead } from "@/mock/actions";
import { ago } from "@/mock/format";
import { useDemo } from "@/mock/store";
import type { AppNotification, NotificationKind } from "@/mock/types";

export const NOTIFICATION_ICONS: Record<NotificationKind, typeof Bell> = {
  booking: CalendarCheck,
  message: MessageCircle,
  reminder: Syringe,
  application: ClipboardCheck,
  community: Users,
  system: Sparkles,
};

export function useMyNotifications(userId: string) {
  const data = useDemo();
  return useMemo(() => {
    const mine = data.notifications
      .filter((n) => n.userId === userId)
      .sort((a, b) => b.at.localeCompare(a.at));
    return { all: mine, unread: mine.filter((n) => !n.read).length };
  }, [data.notifications, userId]);
}

export function NotificationRow({
  n,
  onOpen,
}: {
  n: AppNotification;
  onOpen: (n: AppNotification) => void;
}) {
  const Icon = NOTIFICATION_ICONS[n.kind];
  return (
    <button
      onClick={() => onOpen(n)}
      className={`flex w-full items-start gap-3 rounded-2xl p-3 text-left transition-colors hover:bg-oat ${n.read ? "" : "bg-accent/10"}`}
    >
      <span className="mt-0.5 grid size-9 shrink-0 place-items-center rounded-xl bg-oat text-caramel ring-1 ring-border">
        <Icon className="size-4" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex items-start justify-between gap-2">
          <span
            className={`text-sm ${n.read ? "font-semibold text-foreground/80" : "font-bold text-foreground"}`}
          >
            {n.title}
          </span>
          {!n.read && (
            <span className="mt-1.5 size-2 shrink-0 rounded-full bg-caramel" aria-label="Unread" />
          )}
        </span>
        <span className="mt-0.5 block line-clamp-2 text-xs text-muted-foreground">{n.body}</span>
        <span className="mt-1 block text-[0.6875rem] font-semibold text-muted-foreground">
          {ago(n.at)}
        </span>
      </span>
    </button>
  );
}

export function NotificationBell({ userId }: { userId: string }) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { all, unread } = useMyNotifications(userId);

  const openItem = (n: AppNotification) => {
    markNotificationRead(n.id);
    setOpen(false);
    void navigate({ href: n.link });
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          aria-label={`Notifications${unread ? `, ${unread} unread` : ""}`}
          className="relative grid size-9 place-items-center rounded-full text-mocha-foreground hover:bg-sidebar-accent"
        >
          <Bell className="size-5" />
          {unread > 0 && (
            <span className="absolute -right-0.5 -top-0.5 grid min-w-5 place-items-center rounded-full bg-caramel px-1 text-[0.6875rem] font-extrabold text-caramel-foreground ring-2 ring-mocha">
              {unread > 9 ? "9+" : unread}
            </span>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-[min(24rem,calc(100vw-2rem))] rounded-3xl p-2">
        <div className="flex items-center justify-between px-3 py-2">
          <p className="font-display text-base font-bold">Notifications</p>
          {unread > 0 && (
            <button
              onClick={markAllNotificationsRead}
              className="text-xs font-bold text-caramel hover:underline"
            >
              Mark all read
            </button>
          )}
        </div>
        <div className="max-h-96 overflow-y-auto">
          {all.length === 0 ? (
            <p className="px-3 py-8 text-center text-sm text-muted-foreground">
              You're all caught up.
            </p>
          ) : (
            all.slice(0, 6).map((n) => <NotificationRow key={n.id} n={n} onOpen={openItem} />)
          )}
        </div>
        <Link
          to="/notifications"
          onClick={() => setOpen(false)}
          className="mt-1 block rounded-2xl px-3 py-2.5 text-center text-sm font-bold text-caramel hover:bg-oat"
        >
          See all notifications
        </Link>
      </PopoverContent>
    </Popover>
  );
}
