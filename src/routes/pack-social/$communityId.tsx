import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ArrowLeft, Ban, Flag, MessageSquare, MoreHorizontal, Trash2, Users } from "lucide-react";
import { toast } from "sonner";
import { ReportDialog } from "@/components/app/ReportDialog";
import { EmptyState, PersonAvatar, useBusy } from "@/components/app/ui";
import { useRequireLogin } from "@/components/app/useRequireLogin";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  addCommunityPost,
  addReply,
  deleteCommunityPost,
  toggleBlock,
  toggleMembership,
} from "@/mock/actions";
import { ago, memberCount } from "@/mock/format";
import { useDemo, useSession } from "@/mock/store";
import type { CommunityPost, ReportTarget, User } from "@/mock/types";

export const Route = createFileRoute("/pack-social/$communityId")({
  head: () => ({ meta: [{ title: "Community | The Pack Social" }] }),
  component: CommunityPage,
});

function CommunityPage() {
  const { communityId } = Route.useParams();
  const data = useDemo();
  const { user } = useSession();
  const gate = useRequireLogin();
  const [draft, setDraft] = useState("");
  const [posting, runPost] = useBusy();
  const [joining, runJoin] = useBusy();
  const [reporting, setReporting] = useState<{
    kind: ReportTarget;
    id: string;
    excerpt: string;
  } | null>(null);

  const c = data.communities.find((x) => x.id === communityId);
  const blocked = useMemo(
    () => new Set(data.blocks.filter((b) => b.userId === user?.id).map((b) => b.blockedId)),
    [data.blocks, user?.id],
  );
  const posts = useMemo(
    () =>
      data.communityPosts
        .filter((p) => p.communityId === communityId && p.status === "published")
        .sort((a, b) => b.at.localeCompare(a.at)),
    [data.communityPosts, communityId],
  );

  if (!c || (c.status === "archived" && user?.role !== "founder")) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-14">
        <EmptyState
          title="This community isn't available"
          text="It may have been archived by the Petwork team."
          action={
            <Button
              asChild
              className="rounded-full bg-caramel text-caramel-foreground hover:bg-caramel/90"
            >
              <Link to="/pack-social">All communities</Link>
            </Button>
          }
        />
      </div>
    );
  }

  const member = !!user && c.members.includes(user.id);
  const memberNames = c.members
    .map((id) => data.users.find((u) => u.id === id)?.name)
    .filter(Boolean) as string[];
  const creator = data.users.find((u) => u.id === c.createdBy);
  const hiddenCount = posts.filter((p) => blocked.has(p.authorId)).length;

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <Link
        to="/pack-social"
        className="inline-flex items-center gap-1 py-2 text-sm font-bold text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" /> All communities
      </Link>

      <section className="mt-4 overflow-hidden rounded-3xl bg-mocha text-mocha-foreground shadow-cozy">
        <div className="paw-grid p-7 sm:p-9">
          <span className="rounded-full bg-sidebar-accent px-3 py-1 text-xs font-bold">
            {c.category}
          </span>
          <h1 className="mt-4 text-3xl text-mocha-foreground sm:text-4xl">{c.name}</h1>
          <p className="mt-2 max-w-2xl text-mocha-foreground/80">{c.description}</p>
          <div className="mt-5 flex flex-wrap items-center gap-4">
            <Button
              disabled={joining}
              className={`rounded-full ${member ? "bg-sidebar-accent text-mocha-foreground hover:bg-sidebar-accent/80" : "bg-caramel text-caramel-foreground hover:bg-caramel/90"}`}
              onClick={() =>
                gate(
                  () =>
                    void runJoin(async () => {
                      const joined = await toggleMembership(c.id);
                      toast.success(joined ? `Welcome to ${c.name}!` : `You left ${c.name}`);
                    }),
                  "Sign in to join communities",
                )
              }
            >
              {member ? "Leave community" : "Join community"}
            </Button>
            <span className="flex items-center gap-1.5 text-sm font-semibold">
              <Users className="size-4" /> {memberCount(c).toLocaleString("en-IN")} members
            </span>
            {creator && (
              <span className="text-sm text-mocha-foreground/70">Started by {creator.name}</span>
            )}
          </div>
          {c.status === "archived" && (
            <p className="mt-4 rounded-xl bg-destructive px-3 py-2 text-sm font-bold text-destructive-foreground">
              Archived — hidden from members (founder view)
            </p>
          )}
        </div>
      </section>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_280px]">
        <div className="min-w-0 space-y-4">
          {member ? (
            <form
              className="card-cozy p-4"
              onSubmit={(e) => {
                e.preventDefault();
                if (!draft.trim()) return;
                void runPost(async () => {
                  await addCommunityPost(c.id, draft);
                  setDraft("");
                  toast.success("Posted to the community");
                });
              }}
            >
              <label htmlFor="cp-new" className="sr-only">
                Start a discussion
              </label>
              <textarea
                id="cp-new"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                rows={3}
                maxLength={1500}
                placeholder={`Start a discussion in ${c.name}…`}
                className="w-full resize-none rounded-2xl border border-input bg-background px-4 py-3 text-sm outline-none focus:border-caramel"
              />
              <div className="mt-2 flex justify-end">
                <Button
                  type="submit"
                  disabled={posting || !draft.trim()}
                  className="rounded-full bg-caramel text-caramel-foreground hover:bg-caramel/90"
                >
                  {posting ? "Posting…" : "Post"}
                </Button>
              </div>
            </form>
          ) : (
            <p className="card-cozy p-5 text-sm text-muted-foreground">
              Join the community to start discussions and reply to members.
            </p>
          )}

          {posts.length === 0 && (
            <EmptyState title="No discussions yet" text="Be the first to say hello." />
          )}
          {posts
            .filter((p) => !blocked.has(p.authorId))
            .map((p) => (
              <Discussion key={p.id} post={p} me={user} member={member} onReport={setReporting} />
            ))}
          {hiddenCount > 0 && (
            <p className="text-center text-xs text-muted-foreground">
              {hiddenCount} post{hiddenCount === 1 ? "" : "s"} hidden from people you've blocked.
            </p>
          )}
        </div>

        <aside className="min-w-0 space-y-5">
          <div className="card-cozy p-6">
            <h2 className="text-lg text-foreground">Members</h2>
            <ul className="mt-3 space-y-2">
              {memberNames.slice(0, 6).map((n) => (
                <li key={n} className="flex items-center gap-2 text-sm font-semibold">
                  <PersonAvatar name={n} className="size-8 text-xs" /> {n}
                </li>
              ))}
            </ul>
            {memberCount(c) > memberNames.length && (
              <p className="mt-3 text-xs text-muted-foreground">
                + {(memberCount(c) - memberNames.length).toLocaleString("en-IN")} other pet owners
              </p>
            )}
          </div>
          <div className="card-cozy bg-blush-tint p-6 text-sm text-muted-foreground">
            <h2 className="text-base text-foreground">Community guidelines</h2>
            <ul className="mt-2 list-disc space-y-1 pl-4">
              <li>Be kind — everyone was a first-time pet parent once.</li>
              <li>No selling animals or unlicensed breeding.</li>
              <li>Medical questions? Talk to a vet first.</li>
            </ul>
          </div>
        </aside>
      </div>

      <ReportDialog target={reporting} onClose={() => setReporting(null)} />
    </div>
  );
}

function Discussion({
  post,
  me,
  member,
  onReport,
}: {
  post: CommunityPost;
  me: User | null;
  member: boolean;
  onReport: (t: { kind: ReportTarget; id: string; excerpt: string }) => void;
}) {
  const [reply, setReply] = useState("");
  const [open, setOpen] = useState(false);
  const [busy, run] = useBusy();
  const gate = useRequireLogin();
  const mine = me?.id === post.authorId;

  return (
    <article className="card-cozy p-5">
      <div className="flex items-start gap-3">
        <PersonAvatar name={post.authorName} />
        <div className="min-w-0 flex-1">
          <p className="text-sm">
            <span className="font-bold">{post.authorName}</span>{" "}
            <span className="text-xs text-muted-foreground">· {ago(post.at)}</span>
          </p>
          <p className="mt-1.5 whitespace-pre-line text-sm leading-relaxed text-foreground/90">
            {post.body}
          </p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger
            className="rounded-full p-1.5 text-muted-foreground hover:bg-oat"
            aria-label="Post options"
          >
            <MoreHorizontal className="size-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="rounded-2xl">
            {mine ? (
              <DropdownMenuItem
                className="cursor-pointer text-destructive"
                onSelect={() =>
                  void deleteCommunityPost(post.id).then(() => toast.success("Post deleted"))
                }
              >
                <Trash2 className="size-4" /> Delete post
              </DropdownMenuItem>
            ) : (
              <>
                <DropdownMenuItem
                  className="cursor-pointer"
                  onSelect={() =>
                    gate(() => onReport({ kind: "communityPost", id: post.id, excerpt: post.body }))
                  }
                >
                  <Flag className="size-4" /> Report post
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="cursor-pointer"
                  onSelect={() =>
                    gate(() => {
                      toggleBlock(post.authorId);
                      toast.success(`You blocked ${post.authorName}. You won't see their posts.`);
                    })
                  }
                >
                  <Ban className="size-4" /> Block {post.authorName.split(" ")[0]}
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {post.replies.length > 0 && (
        <ul className="mt-4 space-y-3 border-l-2 border-border pl-4 sm:ml-12">
          {post.replies.map((r) => (
            <li key={r.id} className="text-sm">
              <span className="font-bold">{r.authorName}</span>{" "}
              <span className="text-xs text-muted-foreground">· {ago(r.at)}</span>
              <p className="mt-0.5 text-foreground/90">{r.body}</p>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-3 sm:ml-12">
        {open && member ? (
          <form
            className="flex gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              if (!reply.trim()) return;
              void run(async () => {
                await addReply(post.id, reply);
                setReply("");
                setOpen(false);
              });
            }}
          >
            <label htmlFor={`reply-${post.id}`} className="sr-only">
              Reply
            </label>
            <input
              id={`reply-${post.id}`}
              autoFocus
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              maxLength={1000}
              placeholder="Write a reply…"
              className="min-w-0 flex-1 rounded-full border border-input bg-background px-4 py-2 text-sm outline-none focus:border-caramel"
            />
            <Button
              type="submit"
              size="sm"
              disabled={busy || !reply.trim()}
              className="rounded-full bg-caramel text-caramel-foreground hover:bg-caramel/90"
            >
              Reply
            </Button>
          </form>
        ) : (
          <button
            onClick={() =>
              member
                ? setOpen(true)
                : gate(() => toast.info("Join the community to reply"), "Sign in to reply")
            }
            className="flex items-center gap-1.5 py-1.5 text-xs font-bold text-muted-foreground hover:text-caramel"
          >
            <MessageSquare className="size-3.5" /> Reply
            {post.replies.length ? ` · ${post.replies.length}` : ""}
          </button>
        )}
      </div>
    </article>
  );
}
