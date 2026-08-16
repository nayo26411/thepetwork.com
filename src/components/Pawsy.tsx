import { useEffect, useRef, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Send, X, Loader2 } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { usePets } from "@/lib/pets";
import pawsyAvatar from "@/assets/pawsy-avatar.png";

type Msg = { role: "user" | "assistant"; content: string };

const GREETING: Msg = {
  role: "assistant",
  content:
    "Hi there! I'm Pawsy 🐾 I can help you find services, book appointments, explore the map, discover recipes, and navigate The Petwork. What can I help you with today?",
};

const QUICK = [
  "Book a dog walker",
  "Find a pet friendly cafe",
  "Emergency vet near me",
  "Recipes for my cat",
] as const;

const ROUTES: { match: RegExp; to: string; label: string }[] = [
  { match: /\/emergency/, to: "/emergency", label: "Emergency vets" },
  { match: /\/neighbourhood-watch/, to: "/neighbourhood-watch", label: "Open the map" },
  { match: /\/pro-portal/, to: "/pro-portal", label: "Hire a pro" },
  { match: /\/munchie-menu/, to: "/munchie-menu", label: "Recipes" },
  { match: /\/daily-bark/, to: "/daily-bark", label: "Video guides" },
  { match: /\/pack-social/, to: "/pack-social", label: "Community" },
  { match: /\/digital-collar/, to: "/digital-collar", label: "Pet profile" },
  { match: /\/pro-signup/, to: "/pro-signup", label: "Join as a pro" },
];

export function Pawsy() {
  const [open, setOpen] = useState(false);
  const [nudge, setNudge] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([GREETING]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [activePet, setActivePet] = useState<string | null>(null);
  const { session } = useAuth();
  const { pets } = usePets();
  const navigate = useNavigate();
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Friendly nudge bubble: appears after 5s, fades away after another 8s.
  useEffect(() => {
    const show = window.setTimeout(() => setNudge(true), 5000);
    const hide = window.setTimeout(() => setNudge(false), 13000);
    return () => {
      window.clearTimeout(show);
      window.clearTimeout(hide);
    };
  }, []);


  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, busy]);

  useEffect(() => {
    if (open && !busy) inputRef.current?.focus();
  }, [open, busy]);

  async function send(text: string) {
    const clean = text.trim().slice(0, 1000);
    if (!clean || busy) return;

    // Session memory: once a pet is named, remember it for the rest of the chat.
    let pet = activePet;
    if (pets.length > 0) {
      const named = pets.find((p) =>
        new RegExp(`\\b${p.name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "i").test(clean),
      );
      if (named) {
        pet = named.name;
        setActivePet(named.name);
      } else if (!pet && pets.length === 1) {
        pet = pets[0]!.name;
        setActivePet(pets[0]!.name);
      }
    }

    const next: Msg[] = [...messages, { role: "user", content: clean }];
    setMessages(next);
    setInput("");
    setBusy(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: next.map((m) => ({ role: m.role, content: m.content })),
          owner: session ? { name: session.name } : null,
          pets: pets.map((p) => ({
            name: p.name,
            species: p.species,
            breed: p.breed,
            age: p.age,
          })),
          activePet: pet,
        }),
      });
      if (!res.ok || !res.body) throw new Error(String(res.status));

      setMessages([...next, { role: "assistant", content: "" }]);
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let acc = "";
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        acc += decoder.decode(value, { stream: true });
        setMessages([...next, { role: "assistant", content: acc }]);
      }
    } catch {
      setMessages([
        ...next,
        {
          role: "assistant",
          content:
            "Sorry, I lost my train of thought there 🐾 Give it another go in a moment, or browse the Explore menu up top.",
        },
      ]);
    } finally {
      setBusy(false);
    }
  }

  useEffect(() => {
    if (messages.length !== 1) return;
    const intro =
      pets.length === 1
        ? `Hi ${session?.name?.split(" ")[0] ?? "there"}! I'm Pawsy 🐾 I've got ${pets[0]!.name}'s profile right here — want help finding a walker, groomer or a pet friendly spot for them?`
        : pets.length > 1
          ? `Hi ${session?.name?.split(" ")[0] ?? "there"}! I'm Pawsy 🐾 You've got ${pets.map((p) => p.name).join(" and ")} on your collar — tell me who this is for and I'll take it from there.`
          : GREETING.content;
    setMessages([{ role: "assistant", content: intro }]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pets.length, session?.name]);

  const last = messages[messages.length - 1];
  const suggested =
    last?.role === "assistant" ? ROUTES.filter((r) => r.match.test(last.content)).slice(0, 3) : [];

  return (
    <>
      {/* Nudge bubble */}
      {nudge && !open && (
        <div className="fixed bottom-[8.5rem] right-5 z-[60] max-w-[14rem] animate-fade-up rounded-3xl rounded-br-md border border-border bg-card px-4 py-3 text-sm font-semibold text-foreground shadow-lift">
          Hi! I'm Pawsy 🐾 Need help?
        </div>
      )}

      {/* Floating launcher */}
      <button
        onClick={() => {
          setNudge(false);
          setOpen((v) => !v);
        }}
        aria-label={open ? "Close Pawsy" : "Chat with Pawsy"}
        className="fixed bottom-5 right-5 z-[60] flex flex-col items-center gap-1.5"
      >
        <span className="grid size-16 place-items-center overflow-hidden rounded-full bg-mocha text-mocha-foreground ring-4 ring-honey/40 transition-transform hover:scale-105 motion-safe:animate-pawsy-glow">
          {open ? (
            <X className="size-7" />
          ) : (
            <img
              src={pawsyAvatar}
              alt=""
              width={512}
              height={512}
              loading="lazy"
              className="size-12 object-contain"
            />
          )}
        </span>
        <span className="rounded-full bg-card px-2.5 py-1 text-xs font-extrabold tracking-wide text-caramel shadow-cozy">
          Chat with Pawsy
        </span>
      </button>

      {open && (
        <div className="fixed bottom-32 right-4 z-[60] flex h-[min(500px,70vh)] w-[min(24rem,calc(100vw-2rem))] flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-lift">
          <div className="flex items-center gap-3 border-b border-border bg-espresso px-4 py-3.5 text-espresso-foreground">
            <span className="grid size-12 shrink-0 place-items-center overflow-hidden rounded-full bg-honey/25 ring-2 ring-honey/50">
              <img
                src={pawsyAvatar}
                alt="Pawsy the puppy concierge"
                width={512}
                height={512}
                className="size-10 object-contain"
              />
            </span>
            <div className="min-w-0">
              <p className="truncate font-display text-lg font-bold">Pawsy</p>
              <p className="truncate text-xs text-espresso-foreground/70">
                Your Petwork concierge · not a vet
              </p>
            </div>
          </div>


          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto bg-cream px-4 py-4">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <p
                  className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                    m.role === "user"
                      ? "rounded-br-md bg-caramel text-caramel-foreground"
                      : "rounded-bl-md bg-oat text-foreground ring-1 ring-border"
                  }`}
                >
                  {m.content || "…"}
                </p>
              </div>
            ))}
            {busy && last?.role === "user" && (
              <p className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
                <Loader2 className="size-3.5 animate-spin text-caramel" /> Pawsy is sniffing around…
              </p>
            )}

            {suggested.length > 0 && !busy && (
              <div className="flex flex-wrap gap-2 pt-1">
                {suggested.map((s) => (
                  <button
                    key={s.to}
                    onClick={() => {
                      navigate({ to: s.to });
                      setOpen(false);
                    }}
                    className="rounded-full bg-card px-3 py-1.5 text-xs font-bold text-caramel ring-1 ring-border transition-colors hover:bg-accent"
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            )}

            {messages.length === 1 && (
              <div className="flex flex-wrap gap-2 pt-1">
                {QUICK.map((q) => (
                  <button
                    key={q}
                    onClick={() => void send(q)}
                    className="rounded-full bg-card px-3 py-1.5 text-xs font-bold text-caramel ring-1 ring-border transition-colors hover:bg-accent"
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              void send(input);
            }}
            className="flex items-center gap-2 border-t border-border bg-card px-3 py-3"
          >
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              maxLength={1000}
              placeholder="Ask Pawsy anything…"
              className="min-w-0 flex-1 rounded-full border border-input bg-background px-4 py-2.5 text-sm outline-none focus:border-caramel"
            />
            <button
              type="submit"
              disabled={busy || !input.trim()}
              aria-label="Send"
              className="grid size-10 shrink-0 place-items-center rounded-full bg-caramel text-caramel-foreground transition-opacity disabled:opacity-40"
            >
              <Send className="size-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
