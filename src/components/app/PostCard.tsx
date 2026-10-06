import { Link } from "@tanstack/react-router";
import { Bookmark, Heart, MessageCircle, PlayCircle, Share2 } from "lucide-react";
import { toast } from "sonner";
import { toggleLike, toggleSave } from "@/mock/actions";
import { ago } from "@/mock/format";
import { useDemo, useSession } from "@/mock/store";
import type { Post } from "@/mock/types";
import { PersonAvatar } from "./ui";
import { useRequireLogin } from "./useRequireLogin";

export function sharePost(post: Post) {
  const url = `${window.location.origin}/daily-bark/${post.id}`;
  if (navigator.share) {
    navigator
      .share({ title: post.title, text: `${post.title} | The Daily Bark`, url })
      .catch(() => {});
  } else {
    void navigator.clipboard?.writeText(url);
    toast.success("Link copied");
  }
}

export function PostActions({ post, commentCount }: { post: Post; commentCount: number }) {
  const { user } = useSession();
  const gate = useRequireLogin();
  const liked = !!user && post.likedBy.includes(user.id);
  const saved = !!user && post.savedBy.includes(user.id);

  return (
    <div className="flex items-center justify-between border-t border-border pt-4">
      <div className="flex items-center gap-1">
        <button
          onClick={() => gate(() => toggleLike(post.id), "Sign in to like posts")}
          aria-pressed={liked}
          aria-label={liked ? "Unlike" : "Like"}
          className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold transition-colors ${liked ? "bg-destructive/10 text-destructive" : "text-muted-foreground hover:bg-oat"}`}
        >
          <Heart className={`size-4 ${liked ? "fill-current" : ""}`} />{" "}
          {post.baseLikes + post.likedBy.length}
        </button>
        <Link
          to="/daily-bark/$postId"
          params={{ postId: post.id }}
          hash="comments"
          className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold text-muted-foreground hover:bg-oat"
        >
          <MessageCircle className="size-4" /> {commentCount}
        </Link>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() =>
            gate(() => {
              const now = toggleSave(post.id);
              toast.success(now ? "Saved to your collection" : "Removed from saved");
            }, "Sign in to save posts")
          }
          aria-pressed={saved}
          aria-label={saved ? "Remove from saved" : "Save post"}
          className={`grid size-9 place-items-center rounded-full transition-colors ${saved ? "bg-caramel text-caramel-foreground" : "bg-oat text-muted-foreground hover:bg-caramel hover:text-caramel-foreground"}`}
        >
          <Bookmark className={`size-4 ${saved ? "fill-current" : ""}`} />
        </button>
        <button
          onClick={() => sharePost(post)}
          aria-label="Share post"
          className="grid size-9 place-items-center rounded-full bg-oat text-muted-foreground transition-colors hover:bg-caramel hover:text-caramel-foreground"
        >
          <Share2 className="size-4" />
        </button>
      </div>
    </div>
  );
}

export function PostCard({ post }: { post: Post }) {
  const data = useDemo();
  const comments = data.comments.filter(
    (c) => c.postId === post.id && c.status === "published",
  ).length;
  return (
    <article className="card-cozy flex flex-col p-6">
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <PersonAvatar name={post.authorName} />
          <div className="min-w-0">
            <p className="truncate text-sm font-bold text-foreground">{post.authorName}</p>
            <p className="text-xs text-muted-foreground">
              {ago(post.createdAt)}
              {post.editedAt && " · edited"}
            </p>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-1.5">
          {post.status === "pending" && (
            <span className="rounded-full bg-honey/50 px-2.5 py-1 text-xs font-bold text-honey-foreground">
              Pending review
            </span>
          )}
          <span className="rounded-full bg-oat px-3 py-1 text-xs font-bold text-caramel">
            {post.type}
          </span>
        </div>
      </div>
      <Link to="/daily-bark/$postId" params={{ postId: post.id }} className="group mt-5 flex-1">
        <h2 className="text-xl leading-snug text-foreground group-hover:text-caramel">
          {post.title}
        </h2>
        {post.type === "Videos" && (
          <span className="mt-3 flex h-36 items-center justify-center rounded-2xl bg-mocha text-mocha-foreground">
            <PlayCircle className="size-12 opacity-80" />
          </span>
        )}
        <p className="mt-3 line-clamp-3 whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
          {post.content}
        </p>
        <span className="mt-3 inline-block rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold text-muted-foreground ring-1 ring-border">
          {post.species}
        </span>
      </Link>
      <div className="mt-5">
        <PostActions post={post} commentCount={comments} />
      </div>
    </article>
  );
}
