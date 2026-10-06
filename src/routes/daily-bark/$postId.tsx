import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ArrowLeft, Flag, Pencil, PlayCircle, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { PostActions } from "@/components/app/PostCard";
import { PostComposer } from "@/components/app/PostComposer";
import { ReportDialog } from "@/components/app/ReportDialog";
import { EmptyState, PersonAvatar, useBusy } from "@/components/app/ui";
import { useRequireLogin } from "@/components/app/useRequireLogin";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { addComment, deleteComment, deletePost } from "@/mock/actions";
import { ago } from "@/mock/format";
import { useDemo, useSession } from "@/mock/store";
import type { ReportTarget } from "@/mock/types";

export const Route = createFileRoute("/daily-bark/$postId")({
  head: () => ({ meta: [{ title: "The Daily Bark | The Petwork" }] }),
  component: PostPage,
});

function PostPage() {
  const { postId } = Route.useParams();
  const data = useDemo();
  const { user } = useSession();
  const navigate = useNavigate();
  const gate = useRequireLogin();
  const [editing, setEditing] = useState(false);
  const [reporting, setReporting] = useState<{
    kind: ReportTarget;
    id: string;
    excerpt: string;
  } | null>(null);
  const [comment, setComment] = useState("");
  const [posting, runPost] = useBusy();
  const [deleting, runDelete] = useBusy();

  const post = data.posts.find((p) => p.id === postId);
  const comments = useMemo(
    () =>
      data.comments
        .filter((c) => c.postId === postId && c.status === "published")
        .sort((a, b) => a.at.localeCompare(b.at)),
    [data.comments, postId],
  );

  const isAuthor = !!user && post?.authorId === user.id;
  const canSee = post && (post.status === "published" || isAuthor || user?.role === "founder");

  if (!post || !canSee) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-14">
        <EmptyState
          title="This post isn't available"
          text="It may have been removed, or it's still waiting for review."
          action={
            <Button
              asChild
              className="rounded-full bg-caramel text-caramel-foreground hover:bg-caramel/90"
            >
              <Link to="/daily-bark">Back to the Daily Bark</Link>
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <Link
        to="/daily-bark"
        className="inline-flex items-center gap-1 py-2 text-sm font-bold text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" /> The Daily Bark
      </Link>

      {post.status !== "published" && (
        <p
          className={`mt-4 rounded-2xl p-4 text-sm font-semibold ${post.status === "pending" ? "bg-honey/40 text-honey-foreground" : "bg-destructive/10 text-destructive"}`}
        >
          {post.status === "pending"
            ? "Waiting for review — only you and the Petwork team can see this post right now."
            : "This post was removed by the Petwork team."}
        </p>
      )}

      <article className="card-cozy mt-4 p-6 sm:p-9">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <PersonAvatar name={post.authorName} className="size-11" />
            <div>
              <p className="font-bold">{post.authorName}</p>
              <p className="text-xs text-muted-foreground">
                {ago(post.createdAt)}
                {post.editedAt && ` · edited ${ago(post.editedAt)}`}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-oat px-3 py-1 text-xs font-bold text-caramel">
              {post.type}
            </span>
            <span className="rounded-full bg-oat px-3 py-1 text-xs font-semibold text-muted-foreground">
              {post.species}
            </span>
          </div>
        </div>

        <h1 className="mt-6 text-3xl leading-tight text-foreground">{post.title}</h1>
        {post.type === "Videos" && (
          <div className="mt-5 flex aspect-video items-center justify-center rounded-2xl bg-mocha text-mocha-foreground">
            <div className="text-center">
              <PlayCircle className="mx-auto size-14 opacity-80" />
              <p className="mt-2 text-xs opacity-70">{post.videoUrl}</p>
            </div>
          </div>
        )}
        <div className="mt-5 whitespace-pre-line leading-relaxed text-foreground/90">
          {post.content}
        </div>

        <div className="mt-8">
          <PostActions post={post} commentCount={comments.length} />
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {isAuthor && (
            <>
              <Button
                variant="outline"
                size="sm"
                className="rounded-full"
                onClick={() => setEditing(true)}
              >
                <Pencil className="size-4" /> Edit
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-full text-destructive hover:bg-destructive/10 hover:text-destructive"
                  >
                    <Trash2 className="size-4" /> Delete
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="rounded-3xl">
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete this post?</AlertDialogTitle>
                    <AlertDialogDescription>
                      The post and its comments will be removed for everyone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="rounded-full">Keep</AlertDialogCancel>
                    <AlertDialogAction
                      disabled={deleting}
                      className="rounded-full bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      onClick={() =>
                        void runDelete(async () => {
                          await deletePost(post.id);
                          toast.success("Post deleted");
                          void navigate({ to: "/daily-bark" });
                        })
                      }
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </>
          )}
          {!isAuthor && (
            <Button
              variant="ghost"
              size="sm"
              className="rounded-full text-muted-foreground"
              onClick={() =>
                gate(() => setReporting({ kind: "post", id: post.id, excerpt: post.title }))
              }
            >
              <Flag className="size-4" /> Report post
            </Button>
          )}
        </div>
      </article>

      <section id="comments" className="mt-8">
        <h2 className="text-xl text-foreground">
          {comments.length} comment{comments.length === 1 ? "" : "s"}
        </h2>

        {post.status === "published" &&
          (user ? (
            <form
              className="card-cozy mt-4 flex flex-col gap-3 p-4 sm:flex-row sm:items-end"
              onSubmit={(e) => {
                e.preventDefault();
                if (!comment.trim()) return;
                void runPost(async () => {
                  await addComment(post.id, comment);
                  setComment("");
                  toast.success("Comment posted");
                });
              }}
            >
              <label htmlFor="new-comment" className="sr-only">
                Add a comment
              </label>
              <textarea
                id="new-comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={2}
                maxLength={1000}
                placeholder="Add a kind, useful comment…"
                className="min-h-11 flex-1 resize-none rounded-2xl border border-input bg-background px-4 py-2.5 text-sm outline-none focus:border-caramel"
              />
              <Button
                type="submit"
                disabled={posting || !comment.trim()}
                className="rounded-full bg-caramel text-caramel-foreground hover:bg-caramel/90"
              >
                {posting ? "Posting…" : "Comment"}
              </Button>
            </form>
          ) : (
            <p className="mt-4 rounded-2xl bg-oat p-4 text-sm text-muted-foreground">
              <Link
                to="/login"
                search={{ redirect: `/daily-bark/${post.id}` }}
                className="font-bold text-caramel hover:underline"
              >
                Sign in
              </Link>{" "}
              to join the conversation.
            </p>
          ))}

        <ul className="mt-4 space-y-3">
          {comments.map((c) => (
            <li key={c.id} className="card-cozy p-4">
              <div className="flex items-start gap-3">
                <PersonAvatar name={c.authorName} className="size-9 text-xs" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm">
                    <span className="font-bold">{c.authorName}</span>{" "}
                    <span className="text-xs text-muted-foreground">· {ago(c.at)}</span>
                  </p>
                  <p className="mt-1 whitespace-pre-line text-sm text-foreground/90">{c.body}</p>
                </div>
                {user?.id === c.authorId ? (
                  <button
                    onClick={() =>
                      void deleteComment(c.id).then(() => toast.success("Comment deleted"))
                    }
                    aria-label="Delete comment"
                    className="rounded-full p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                  >
                    <Trash2 className="size-4" />
                  </button>
                ) : (
                  <button
                    onClick={() =>
                      gate(() => setReporting({ kind: "comment", id: c.id, excerpt: c.body }))
                    }
                    aria-label="Report comment"
                    className="rounded-full p-1.5 text-muted-foreground hover:bg-oat"
                  >
                    <Flag className="size-4" />
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      </section>

      <PostComposer open={editing} onOpenChange={setEditing} type={post.type} post={post} />
      <ReportDialog target={reporting} onClose={() => setReporting(null)} />
    </div>
  );
}
