import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, CalendarCheck, MessageCircle, Send } from "lucide-react";
import { RequireRole } from "@/components/app/RequireRole";
import { EmptyState, ListSkeleton, PersonAvatar, useFakeLoading } from "@/components/app/ui";
import { Button } from "@/components/ui/button";
import { markThreadRead, sendMessage } from "@/mock/actions";
import { ago, dayLabel, timeLabel } from "@/mock/format";
import { useDemo } from "@/mock/store";
import type { User } from "@/mock/types";

export const Route = createFileRoute("/messages")({
  validateSearch: (s: Record<string, unknown>): { t?: string } =>
    typeof s["t"] === "string" ? { t: s["t"] } : {},
  head: () => ({ meta: [{ title: "Messages | The Petwork" }] }),
  component: () => (
    <RequireRole roles={["owner", "pro"]}>{(user) => <Messages user={user} />}</RequireRole>
  ),
});

function Messages({ user }: { user: User }) {
  const data = useDemo();
  const { t: activeId } = Route.useSearch();
  const navigate = useNavigate();
  const loading = useFakeLoading(350);

  const threads = useMemo(() => {
    return data.threads
      .filter((t) => t.ownerId === user.id || t.proId === user.id)
      .map((t) => {
        const otherId = t.ownerId === user.id ? t.proId : t.ownerId;
        const msgs = data.messages.filter((m) => m.threadId === t.id);
        return {
          ...t,
          other: data.users.find((u) => u.id === otherId),
          last: msgs[msgs.length - 1],
          unread: msgs.filter((m) => !m.readBy.includes(user.id)).length,
        };
      })
      .sort((a, b) => (b.last?.at ?? b.updatedAt).localeCompare(a.last?.at ?? a.updatedAt));
  }, [data.threads, data.messages, data.users, user.id]);

  const active = threads.find((t) => t.id === activeId);
  const open = (id: string) => void navigate({ to: "/messages", search: { t: id }, replace: true });

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:py-12">
      <h1
        className={`text-3xl text-foreground sm:text-4xl ${active ? "sr-only md:not-sr-only" : ""}`}
      >
        Messages
      </h1>
      <div className="mt-5 grid h-[min(72vh,720px)] min-h-[440px] overflow-hidden rounded-3xl border border-border bg-card shadow-cozy md:grid-cols-[320px_1fr]">
        <aside
          className={`min-h-0 overflow-y-auto border-border md:border-r ${active ? "hidden md:block" : ""}`}
        >
          {loading ? (
            <ListSkeleton rows={3} className="p-3" />
          ) : threads.length === 0 ? (
            <div className="p-6 text-center text-sm text-muted-foreground">
              <MessageCircle className="mx-auto size-8 text-caramel" />
              <p className="mt-3">No conversations yet.</p>
              {user.role === "owner" && (
                <Link
                  to="/pro-portal"
                  className="mt-2 inline-block font-bold text-caramel hover:underline"
                >
                  Message a professional
                </Link>
              )}
            </div>
          ) : (
            <ul className="p-2">
              {threads.map((t) => (
                <li key={t.id}>
                  <button
                    onClick={() => open(t.id)}
                    className={`flex w-full items-start gap-3 rounded-2xl p-3 text-left transition-colors hover:bg-oat ${t.id === activeId ? "bg-oat" : ""}`}
                  >
                    <PersonAvatar name={t.other?.name ?? "?"} className="size-11" />
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center justify-between gap-2">
                        <span
                          className={`truncate text-sm ${t.unread ? "font-extrabold" : "font-bold"}`}
                        >
                          {t.other?.name ?? "Deleted account"}
                        </span>
                        {t.last && (
                          <span className="shrink-0 text-[0.6875rem] text-muted-foreground">
                            {ago(t.last.at)}
                          </span>
                        )}
                      </span>
                      <span className="flex items-center justify-between gap-2">
                        <span
                          className={`truncate text-xs ${t.unread ? "font-semibold text-foreground" : "text-muted-foreground"}`}
                        >
                          {t.last
                            ? `${t.last.senderId === user.id ? "You: " : ""}${t.last.body}`
                            : "Say hello 👋"}
                        </span>
                        {t.unread > 0 && (
                          <span className="grid min-w-5 shrink-0 place-items-center rounded-full bg-caramel px-1 text-[0.6875rem] font-bold text-caramel-foreground">
                            {t.unread}
                          </span>
                        )}
                      </span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </aside>

        <section className={`flex min-h-0 flex-col ${active ? "" : "hidden md:flex"}`}>
          {active ? (
            <Conversation
              key={active.id}
              threadId={active.id}
              me={user}
              other={active.other}
              onBack={() => void navigate({ to: "/messages", replace: true })}
            />
          ) : (
            <div className="grid flex-1 place-items-center p-6">
              <EmptyState
                className="border-0 shadow-none"
                title="Pick a conversation"
                text="Messages with professionals and pet owners appear here."
              />
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

function Conversation({
  threadId,
  me,
  other,
  onBack,
}: {
  threadId: string;
  me: User;
  other: User | undefined;
  onBack: () => void;
}) {
  const data = useDemo();
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const messages = useMemo(
    () => data.messages.filter((m) => m.threadId === threadId),
    [data.messages, threadId],
  );
  const last = messages[messages.length - 1];

  useEffect(() => {
    markThreadRead(threadId);
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [threadId, messages.length]);

  // Show a typing hint while a simulated reply is on its way.
  const [typing, setTyping] = useState(false);
  useEffect(() => {
    if (!last || last.senderId !== me.id || me.role !== "owner" || !data.settings.autoReplies) {
      setTyping(false);
      return;
    }
    const age = Date.now() - new Date(last.at).getTime();
    if (age > 3500) return;
    const start = window.setTimeout(() => setTyping(true), 900);
    const stop = window.setTimeout(() => setTyping(false), 3600 - age);
    return () => {
      window.clearTimeout(start);
      window.clearTimeout(stop);
    };
  }, [last, me.id, me.role, data.settings.autoReplies]);

  const upcoming = data.bookings.find(
    (b) =>
      (b.ownerId === me.id || b.proId === me.id) &&
      (b.ownerId === other?.id || b.proId === other?.id) &&
      (b.status === "accepted" || b.status === "requested"),
  );

  const submit = async () => {
    if (!text.trim() || sending) return;
    setSending(true);
    const body = text;
    setText("");
    await sendMessage(threadId, body);
    setSending(false);
  };

  return (
    <>
      <header className="flex items-center gap-3 border-b border-border px-4 py-3">
        <button
          onClick={onBack}
          className="rounded-full p-1.5 hover:bg-oat md:hidden"
          aria-label="Back to conversations"
        >
          <ArrowLeft className="size-5" />
        </button>
        <PersonAvatar name={other?.name ?? "?"} className="size-10" />
        <div className="min-w-0 flex-1">
          <p className="truncate font-bold">{other?.name ?? "Deleted account"}</p>
          <p className="truncate text-xs text-muted-foreground">
            {other?.role === "pro"
              ? "Petwork professional"
              : other?.area
                ? `Pet owner · ${other.area}`
                : "Pet owner"}
          </p>
        </div>
        {other?.role === "pro" && (
          <Button
            asChild
            size="sm"
            variant="outline"
            className="hidden rounded-full sm:inline-flex"
          >
            <Link to="/book/$proId" params={{ proId: other.id }}>
              <CalendarCheck className="size-4" /> Book
            </Link>
          </Button>
        )}
      </header>

      {upcoming && (
        <Link
          to={me.role === "pro" ? "/pro/bookings" : "/bookings"}
          className="flex items-center gap-2 border-b border-border bg-oat/70 px-4 py-2 text-xs font-semibold text-muted-foreground hover:text-foreground"
        >
          <CalendarCheck className="size-3.5 text-caramel" />{" "}
          {upcoming.status === "accepted" ? "Confirmed" : "Requested"}: {upcoming.service},{" "}
          {dayLabel(upcoming.date)} at {timeLabel(upcoming.time)}
        </Link>
      )}

      <div
        ref={scrollRef}
        className="flex-1 space-y-2.5 overflow-y-auto bg-cream px-4 py-4"
        aria-live="polite"
      >
        {messages.length === 0 && (
          <p className="py-10 text-center text-sm text-muted-foreground">
            Start the conversation — say hello and share what your pet needs.
          </p>
        )}
        {messages.map((m) => {
          const mine = m.senderId === me.id;
          return (
            <div key={m.id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${mine ? "rounded-br-md bg-caramel text-caramel-foreground" : "rounded-bl-md bg-card text-foreground ring-1 ring-border"}`}
              >
                <p className="whitespace-pre-wrap">{m.body}</p>
                <p
                  className={`mt-1 text-[0.625rem] ${mine ? "text-caramel-foreground/90" : "text-muted-foreground"}`}
                >
                  {ago(m.at)}
                  {mine && other && m.readBy.includes(other.id) ? " · Seen" : ""}
                </p>
              </div>
            </div>
          );
        })}
        {typing && (
          <p className="text-xs font-semibold text-muted-foreground">
            {other?.name.split(" ")[0]} is typing…
          </p>
        )}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          void submit();
        }}
        className="flex items-end gap-2 border-t border-border p-3"
      >
        <label htmlFor="msg-input" className="sr-only">
          Message
        </label>
        <textarea
          id="msg-input"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              void submit();
            }
          }}
          rows={1}
          maxLength={2000}
          placeholder="Write a message…"
          className="max-h-32 min-h-11 flex-1 resize-none rounded-2xl border border-input bg-background px-4 py-2.5 text-sm outline-none focus:border-caramel"
        />
        <button
          type="submit"
          disabled={!text.trim() || sending}
          aria-label="Send message"
          className="grid size-11 shrink-0 place-items-center rounded-full bg-caramel text-caramel-foreground transition-opacity disabled:opacity-40"
        >
          <Send className="size-4" />
        </button>
      </form>
    </>
  );
}
