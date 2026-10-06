import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { ExternalLink, Search } from "lucide-react";
import { toast } from "sonner";
import { PersonAvatar, TabPills, useBusy } from "@/components/app/ui";
import { Button } from "@/components/ui/button";
import { setCommunityStatus, setUserStatus } from "@/mock/actions";
import { BOOKING_STATUS, dayLabel, longDate, memberCount, rupees, timeLabel } from "@/mock/format";
import { useDemo } from "@/mock/store";
import type { BookingStatus, Community, User } from "@/mock/types";
import { SectionHead, StatusPill, Table } from "./shared";

/* ------------------------------------------------------------- communities */

export function CommunityManagement() {
  const data = useDemo();
  return (
    <>
      <SectionHead
        title="Community management"
        sub="Every Pack Social group with member counts and activity. Archiving hides a group from members without deleting it."
      />
      <Table head={["Community", "Category", "Members", "Posts", "Created by", "Status", ""]}>
        {data.communities.map((c) => (
          <CommunityRow
            key={c.id}
            c={c}
            posts={
              data.communityPosts.filter((p) => p.communityId === c.id && p.status === "published")
                .length
            }
            creator={data.users.find((u) => u.id === c.createdBy)?.name ?? "—"}
          />
        ))}
      </Table>
    </>
  );
}

function CommunityRow({ c, posts, creator }: { c: Community; posts: number; creator: string }) {
  const [busy, run] = useBusy();
  const archived = c.status === "archived";
  return (
    <tr className={busy ? "opacity-60" : ""}>
      <td className="px-4 py-3">
        <Link
          to="/pack-social/$communityId"
          params={{ communityId: c.id }}
          className="inline-block py-1 font-bold hover:text-caramel"
        >
          {c.name}
        </Link>
      </td>
      <td className="px-4 py-3">{c.category}</td>
      <td className="px-4 py-3">{memberCount(c).toLocaleString("en-IN")}</td>
      <td className="px-4 py-3">{posts}</td>
      <td className="px-4 py-3">{creator}</td>
      <td className="px-4 py-3">
        <StatusPill tone={archived ? "muted" : "good"}>
          {archived ? "Archived" : "Active"}
        </StatusPill>
      </td>
      <td className="px-4 py-3 text-right">
        <Button
          size="sm"
          variant="outline"
          disabled={busy}
          className="rounded-full"
          onClick={() =>
            void run(async () => {
              await setCommunityStatus(c.id, archived ? "active" : "archived");
              toast.success(archived ? `${c.name} restored` : `${c.name} archived`);
            })
          }
        >
          {archived ? "Restore" : "Archive"}
        </Button>
      </td>
    </tr>
  );
}

/* ------------------------------------------------------------------- users */

const ROLE_TABS = [
  { key: "all", label: "Everyone" },
  { key: "owner", label: "Pet owners" },
  { key: "pro", label: "Professionals" },
  { key: "suspended", label: "Suspended" },
] as const;

export function UserManagement() {
  const data = useDemo();
  const [tab, setTab] = useState<(typeof ROLE_TABS)[number]["key"]>("all");
  const [q, setQ] = useState("");
  const users = data.users
    .filter((u) => u.role !== "founder")
    .filter((u) =>
      tab === "all" ? true : tab === "suspended" ? u.status === "suspended" : u.role === tab,
    )
    .filter(
      (u) =>
        !q.trim() ||
        `${u.name} ${u.email} ${u.area}`.toLowerCase().includes(q.trim().toLowerCase()),
    )
    .sort((a, b) => b.joinedAt.localeCompare(a.joinedAt));

  return (
    <>
      <SectionHead
        title="User management"
        sub="Everyone who has signed up. Suspending an account signs them out of bookings and hides a professional from the Pro Portal."
      />
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <TabPills tabs={ROLE_TABS} value={tab} onChange={setTab} />
        <label className="relative min-w-60 flex-1">
          <span className="sr-only">Search users</span>
          <Search className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search name, email or area"
            className="w-full rounded-full border border-border bg-card py-2.5 pl-11 pr-4 text-sm outline-none focus:border-caramel"
          />
        </label>
      </div>
      <Table head={["Name", "Role", "Area", "Pets / bookings", "Joined", "Status", ""]}>
        {users.map((u) => (
          <UserRow key={u.id} u={u} />
        ))}
      </Table>
    </>
  );
}

function UserRow({ u }: { u: User }) {
  const data = useDemo();
  const [busy, run] = useBusy();
  const app = data.applications.find((a) => a.userId === u.id);
  const pets = data.pets.filter((p) => p.ownerId === u.id).length;
  const bookings = data.bookings.filter((b) => b.ownerId === u.id || b.proId === u.id).length;
  const suspended = u.status === "suspended";
  return (
    <tr className={busy ? "opacity-60" : ""}>
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <PersonAvatar name={u.name} className="size-9 text-xs" />
          <div className="min-w-0">
            <p className="font-bold">{u.name}</p>
            <p className="text-xs text-muted-foreground">{u.email}</p>
          </div>
        </div>
      </td>
      <td className="px-4 py-3">
        {u.role === "owner" ? (
          "Pet owner"
        ) : (
          <span className="flex flex-col gap-1">
            Professional
            {app && (
              <StatusPill tone={app.status === "approved" ? "good" : "warn"}>
                {app.status === "approved" ? "Verified" : app.status.replace("_", " ")}
              </StatusPill>
            )}
          </span>
        )}
      </td>
      <td className="px-4 py-3">{u.area}</td>
      <td className="px-4 py-3">
        {u.role === "owner" ? `${pets} pets · ${bookings} bookings` : `${bookings} bookings`}
      </td>
      <td className="px-4 py-3">{longDate(u.joinedAt.slice(0, 10))}</td>
      <td className="px-4 py-3">
        <StatusPill tone={suspended ? "bad" : "good"}>
          {suspended ? "Suspended" : "Active"}
        </StatusPill>
      </td>
      <td className="px-4 py-3 text-right">
        <Button
          size="sm"
          variant="outline"
          disabled={busy}
          className={`rounded-full ${suspended ? "" : "text-destructive hover:bg-destructive/10 hover:text-destructive"}`}
          onClick={() =>
            void run(async () => {
              await setUserStatus(u.id, suspended ? "active" : "suspended");
              toast.success(suspended ? `${u.name} reactivated` : `${u.name} suspended`);
            })
          }
        >
          {suspended ? "Reactivate" : "Suspend"}
        </Button>
      </td>
    </tr>
  );
}

/* ---------------------------------------------------------------- bookings */

const STATUS_TABS: { key: "all" | BookingStatus; label: string }[] = [
  { key: "all", label: "All" },
  { key: "requested", label: "Requested" },
  { key: "accepted", label: "Confirmed" },
  { key: "completed", label: "Completed" },
  { key: "cancelled", label: "Cancelled" },
  { key: "declined", label: "Declined" },
];

export function BookingOversight() {
  const data = useDemo();
  const [tab, setTab] = useState<"all" | BookingStatus>("all");
  const name = (id: string) => data.users.find((u) => u.id === id)?.name ?? "Deleted account";
  const list = data.bookings
    .filter((b) => tab === "all" || b.status === tab)
    .sort((a, b) => `${b.date}${b.time}`.localeCompare(`${a.date}${a.time}`));

  return (
    <>
      <SectionHead
        title="Booking oversight"
        sub="Every booking between owners and professionals, with its current status."
      />
      <TabPills
        className="mb-4"
        tabs={STATUS_TABS.map((t) => ({
          ...t,
          count:
            t.key === "all" ? undefined : data.bookings.filter((b) => b.status === t.key).length,
        }))}
        value={tab}
        onChange={setTab}
      />
      <Table head={["When", "Owner & pet", "Professional", "Service", "Price", "Status", ""]}>
        {list.map((b) => (
          <tr key={b.id}>
            <td className="px-4 py-3 font-semibold">
              {dayLabel(b.date)}, {timeLabel(b.time)}
            </td>
            <td className="px-4 py-3">
              {name(b.ownerId)}
              <span className="block text-xs text-muted-foreground">
                {data.pets.find((p) => p.id === b.petId)?.name}
              </span>
            </td>
            <td className="px-4 py-3">{name(b.proId)}</td>
            <td className="px-4 py-3">{b.service}</td>
            <td className="px-4 py-3">{rupees(b.price)}</td>
            <td className="px-4 py-3">
              <span
                className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${BOOKING_STATUS[b.status].className}`}
              >
                {BOOKING_STATUS[b.status].label}
              </span>
              {b.reason && (
                <span className="mt-1 block text-xs text-muted-foreground">{b.reason}</span>
              )}
            </td>
            <td className="px-4 py-3 text-right">
              <Link
                to="/pro-portal/$proId"
                params={{ proId: b.proId }}
                aria-label="Open professional profile"
                className="inline-grid size-8 place-items-center rounded-full text-muted-foreground hover:bg-oat hover:text-caramel"
              >
                <ExternalLink className="size-4" />
              </Link>
            </td>
          </tr>
        ))}
      </Table>
    </>
  );
}
