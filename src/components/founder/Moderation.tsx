import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Check, ExternalLink, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { EmptyState, TabPills, useBusy } from "@/components/app/ui";
import { Button } from "@/components/ui/button";
import { moderateReport, setPostStatus } from "@/mock/actions";
import { ago } from "@/mock/format";
import { useDemo } from "@/mock/store";
import type { Post, Report } from "@/mock/types";
import { SectionHead, StatusPill } from "./shared";

const TABS = [
  { key: "reports", label: "Open reports" },
  { key: "pending", label: "Posts awaiting approval" },
  { key: "resolved", label: "Resolved" },
] as const;

const KIND_LABEL: Record<Report["targetKind"], string> = {
  post: "Daily Bark post",
  comment: "Daily Bark comment",
  communityPost: "Pack Social post",
  user: "User",
};

export function Moderation() {
  const data = useDemo();
  const [tab, setTab] = useState<(typeof TABS)[number]["key"]>("reports");
  const open = data.reports.filter((r) => r.status === "open");
  const resolved = data.reports.filter((r) => r.status !== "open");
  const pending = data.posts.filter((p) => p.status === "pending");
  const counts = { reports: open.length, pending: pending.length, resolved: resolved.length };

  return (
    <>
      <SectionHead
        title="Content moderation"
        sub="Reports from members and new Daily Bark posts waiting for approval. Removed content disappears for everyone straight away."
      />
      <TabPills
        tabs={TABS.map((t) => ({ ...t, count: t.key === "resolved" ? undefined : counts[t.key] }))}
        value={tab}
        onChange={setTab}
      />
      <div className="mt-5 space-y-3">
        {tab === "reports" &&
          (open.length === 0 ? (
            <EmptyState
              title="No open reports"
              text="Nice and quiet. Reports from members land here."
            />
          ) : (
            open.map((r) => <ReportRow key={r.id} r={r} />)
          ))}
        {tab === "pending" &&
          (pending.length === 0 ? (
            <EmptyState
              title="Nothing waiting"
              text="New Daily Bark posts appear here before they go public."
            />
          ) : (
            pending.map((p) => <PendingPost key={p.id} p={p} />)
          ))}
        {tab === "resolved" &&
          (resolved.length === 0 ? (
            <EmptyState title="No resolved reports yet" />
          ) : (
            resolved.map((r) => <ReportRow key={r.id} r={r} />)
          ))}
      </div>
    </>
  );
}

function ReportRow({ r }: { r: Report }) {
  const data = useDemo();
  const [busy, run] = useBusy();
  const reporter = data.users.find((u) => u.id === r.reporterId)?.name ?? "A member";
  const link =
    r.targetKind === "post"
      ? `/daily-bark/${r.targetId}`
      : r.targetKind === "comment"
        ? `/daily-bark/${data.comments.find((c) => c.id === r.targetId)?.postId ?? ""}`
        : r.targetKind === "communityPost"
          ? `/pack-social/${data.communityPosts.find((c) => c.id === r.targetId)?.communityId ?? ""}`
          : "/founder";
  const author =
    r.targetKind === "comment"
      ? data.comments.find((c) => c.id === r.targetId)?.authorName
      : r.targetKind === "communityPost"
        ? data.communityPosts.find((c) => c.id === r.targetId)?.authorName
        : r.targetKind === "post"
          ? data.posts.find((c) => c.id === r.targetId)?.authorName
          : undefined;

  return (
    <article className={`card-cozy p-5 ${busy ? "opacity-60" : ""}`}>
      <div className="flex flex-wrap items-center gap-2">
        <StatusPill tone={r.status === "open" ? "warn" : r.status === "removed" ? "bad" : "muted"}>
          {r.status === "open" ? r.reason : r.status === "removed" ? "Removed" : "Dismissed"}
        </StatusPill>
        <span className="text-xs font-semibold text-muted-foreground">
          {KIND_LABEL[r.targetKind]}
          {author && ` by ${author}`} · reported by {reporter} {ago(r.at)}
        </span>
      </div>
      <blockquote className="mt-3 rounded-2xl bg-oat px-4 py-3 text-sm">“{r.excerpt}”</blockquote>
      {r.details && (
        <p className="mt-2 text-sm text-muted-foreground">Reporter's note: {r.details}</p>
      )}
      <div className="mt-4 flex flex-wrap gap-2">
        {r.status === "open" && (
          <>
            <Button
              size="sm"
              disabled={busy}
              className="rounded-full bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() =>
                void run(async () => {
                  await moderateReport(r.id, "removed");
                  toast.success("Content removed for everyone");
                })
              }
            >
              <Trash2 className="size-4" /> Remove content
            </Button>
            <Button
              size="sm"
              variant="outline"
              disabled={busy}
              className="rounded-full"
              onClick={() =>
                void run(async () => {
                  await moderateReport(r.id, "dismissed");
                  toast.success("Report dismissed — the content stays up");
                })
              }
            >
              <X className="size-4" /> Dismiss
            </Button>
          </>
        )}
        <Button asChild size="sm" variant="ghost" className="rounded-full">
          <Link to={link}>
            View in context <ExternalLink className="size-3.5" />
          </Link>
        </Button>
      </div>
    </article>
  );
}

function PendingPost({ p }: { p: Post }) {
  const [busy, run] = useBusy();
  return (
    <article className={`card-cozy p-5 ${busy ? "opacity-60" : ""}`}>
      <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-muted-foreground">
        <StatusPill tone="warn">{p.type}</StatusPill> {p.authorName} · {p.species} ·{" "}
        {ago(p.createdAt)}
      </div>
      <h3 className="mt-3 text-lg text-foreground">{p.title}</h3>
      <p className="mt-1 line-clamp-4 whitespace-pre-line text-sm text-muted-foreground">
        {p.content}
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        <Button
          size="sm"
          disabled={busy}
          className="rounded-full bg-verified text-verified-foreground hover:bg-verified/90"
          onClick={() =>
            void run(async () => {
              await setPostStatus(p.id, "published");
              toast.success("Post approved and published");
            })
          }
        >
          <Check className="size-4" /> Approve
        </Button>
        <Button
          size="sm"
          variant="outline"
          disabled={busy}
          className="rounded-full text-destructive hover:bg-destructive/10 hover:text-destructive"
          onClick={() =>
            void run(async () => {
              await setPostStatus(p.id, "removed");
              toast.success("Post rejected");
            })
          }
        >
          <X className="size-4" /> Reject
        </Button>
        <Button asChild size="sm" variant="ghost" className="rounded-full">
          <Link to="/daily-bark/$postId" params={{ postId: p.id }}>
            Preview <ExternalLink className="size-3.5" />
          </Link>
        </Button>
      </div>
    </article>
  );
}
