import { useEffect, useRef, useState } from "react";
import { Send, Video } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { savePost } from "@/mock/actions";
import { POST_SPECIES, POST_TYPES, type Post, type PostType } from "@/mock/types";
import { checkFile } from "@/mock/upload";
import { useBusy } from "./ui";

const HEADINGS: Record<PostType, string> = {
  Stories: "Share a story",
  Tips: "Share a tip",
  Questions: "Ask the community",
  Blogs: "Write a blog",
  Videos: "Share a video",
};

export function PostComposer({
  open,
  onOpenChange,
  type: initialType,
  post,
  onSaved,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  type: PostType;
  post?: Post;
  onSaved?: (id: string) => void;
}) {
  const [type, setType] = useState<PostType>(initialType);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [species, setSpecies] = useState<string>("Dogs");
  const [video, setVideo] = useState("");
  const [busy, run] = useBusy();
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    setType(post?.type ?? initialType);
    setTitle(post?.title ?? "");
    setContent(post?.content ?? "");
    setSpecies(post?.species ?? "Dogs");
    setVideo(post?.videoUrl ?? "");
  }, [open, post, initialType]);

  const submit = () => {
    if (!title.trim() || !content.trim()) {
      toast.error("Add a title and something to share first.");
      return;
    }
    if (type === "Videos" && !video) {
      toast.error("Add a video file or link.");
      return;
    }
    void run(async () => {
      const id = await savePost(
        {
          type,
          title: title.trim(),
          content: content.trim(),
          species,
          videoUrl: type === "Videos" ? video : "",
        },
        post?.id,
      );
      toast.success(
        post ? "Post updated" : "Submitted — it will appear once our team approves it.",
      );
      onOpenChange(false);
      onSaved?.(id);
    });
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !busy && onOpenChange(v)}>
      <DialogContent className="max-h-[90vh] overflow-y-auto rounded-3xl sm:max-w-2xl">
        <DialogHeader>
          <p className="text-xs font-bold uppercase tracking-wider text-caramel">The Daily Bark</p>
          <DialogTitle className="font-display text-2xl">
            {post ? "Edit your post" : HEADINGS[type]}
          </DialogTitle>
          {!post && (
            <DialogDescription>
              Every submission is reviewed before it becomes part of the public Daily Bark.
            </DialogDescription>
          )}
        </DialogHeader>

        <div className="space-y-5">
          <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Post type">
            {POST_TYPES.map((t) => (
              <button
                key={t}
                role="radio"
                aria-checked={type === t}
                onClick={() => setType(t)}
                className={`rounded-full px-3.5 py-1.5 text-xs font-bold ${type === t ? "bg-caramel text-caramel-foreground" : "bg-oat text-muted-foreground hover:text-foreground"}`}
              >
                {t}
              </button>
            ))}
          </div>

          <div>
            <label htmlFor="pc-title" className="mb-2 block text-sm font-bold text-foreground">
              {type === "Questions" ? "Your question" : type === "Blogs" ? "Blog title" : "Title"}
            </label>
            <input
              id="pc-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={140}
              placeholder={
                type === "Questions" ? "What would you like to ask?" : "Give your post a title…"
              }
              className="w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-caramel"
            />
          </div>

          <div>
            <label htmlFor="pc-body" className="mb-2 block text-sm font-bold text-foreground">
              {type === "Blogs"
                ? "Your story"
                : type === "Questions"
                  ? "Tell us a little more"
                  : "What would you like to share?"}
            </label>
            <textarea
              id="pc-body"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={type === "Blogs" ? 10 : 5}
              maxLength={type === "Blogs" ? 6000 : 2000}
              placeholder="Write something the community would find useful…"
              className="w-full resize-none rounded-2xl border border-border bg-background px-4 py-3 text-sm leading-relaxed outline-none focus:border-caramel"
            />
          </div>

          {type === "Videos" && (
            <div className="rounded-2xl bg-oat p-4">
              <p className="flex items-center gap-2 text-sm font-bold">
                <Video className="size-4 text-caramel" /> Video
              </p>
              <input
                ref={fileRef}
                type="file"
                accept="video/*"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  e.target.value = "";
                  if (!f) return;
                  const problem = checkFile(f, "video");
                  if (problem) toast.error(problem);
                  else setVideo(f.name);
                }}
              />
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="rounded-full bg-card px-4 py-2 text-sm font-bold ring-1 ring-border hover:bg-accent hover:text-accent-foreground"
                >
                  Upload a video
                </button>
                <span className="text-xs text-muted-foreground">or paste a YouTube link</span>
                <input
                  value={video.startsWith("http") ? video : ""}
                  onChange={(e) => setVideo(e.target.value)}
                  placeholder="https://youtube.com/…"
                  aria-label="Video link"
                  className="min-w-0 flex-1 rounded-full border border-border bg-background px-3 py-2 text-sm"
                />
              </div>
              {video && !video.startsWith("http") && (
                <p className="mt-2 text-xs font-semibold text-verified">Attached: {video}</p>
              )}
              <p className="mt-2 text-xs text-muted-foreground">MP4 or MOV up to 100 MB.</p>
            </div>
          )}

          <div>
            <p className="mb-2 text-sm font-bold text-foreground">Which pet is this about?</p>
            <div className="flex flex-wrap gap-2">
              {POST_SPECIES.map((s) => (
                <button
                  key={s}
                  onClick={() => setSpecies(s)}
                  aria-pressed={species === s}
                  className={`rounded-full px-3.5 py-2 text-xs font-bold ${species === s ? "bg-caramel text-caramel-foreground" : "bg-oat text-muted-foreground hover:text-foreground"}`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
            <button
              onClick={() => onOpenChange(false)}
              disabled={busy}
              className="rounded-full bg-oat px-5 py-3 text-sm font-bold text-muted-foreground hover:text-foreground"
            >
              Cancel
            </button>
            <button
              onClick={submit}
              disabled={busy}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-caramel px-6 py-3 text-sm font-bold text-caramel-foreground shadow-cozy disabled:opacity-60"
            >
              <Send className="size-4" />{" "}
              {busy ? "Sending…" : post ? "Save changes" : "Submit for review"}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
