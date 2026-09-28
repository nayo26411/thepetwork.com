import { createFileRoute } from "@tanstack/react-router";
import { PAWSY_SYSTEM_PROMPT } from "@/lib/pawsy-prompt";

type ChatMessage = { role: "user" | "assistant"; content: string };
type ChatBody = { messages?: unknown; owner?: unknown; pets?: unknown; activePet?: unknown };
type PetInfo = { name: string; species?: string; breed?: string; age?: string };

function sanitisePets(input: unknown): PetInfo[] {
  if (!Array.isArray(input)) return [];
  return input
    .filter((p): p is PetInfo => !!p && typeof p === "object" && typeof (p as PetInfo).name === "string")
    .slice(0, 8)
    .map((p) => ({
      name: String(p.name).slice(0, 40),
      species: typeof p.species === "string" ? p.species.slice(0, 30) : undefined,
      breed: typeof p.breed === "string" ? p.breed.slice(0, 50) : undefined,
      age: typeof p.age === "string" ? p.age.slice(0, 20) : undefined,
    }));
}

function petContext(body: ChatBody): string {
  const pets = sanitisePets(body.pets);
  const owner =
    body.owner && typeof body.owner === "object" && typeof (body.owner as { name?: unknown }).name === "string"
      ? String((body.owner as { name: string }).name).slice(0, 60)
      : null;
  const active = typeof body.activePet === "string" ? body.activePet.slice(0, 40) : null;

  if (!owner && pets.length === 0) {
    return `\n\nOWNER CONTEXT\nThis person is not logged in and has no pet profile. Early in the conversation, say exactly once: "I'd love to personalise this for your pet! Log in or create a profile and I'll remember everything 🐾" Then help them anyway.`;
  }

  const list = pets
    .map((p) => `- ${p.name}${p.species ? `, a ${p.species.toLowerCase()}` : ""}${p.breed ? ` (${p.breed})` : ""}${p.age ? `, ${p.age}` : ""}`)
    .join("\n");

  if (pets.length === 0) {
    return `\n\nOWNER CONTEXT\nSigned in as ${owner}. No pets on their Digital Collar yet — warmly invite them to add one at /digital-collar.`;
  }

  if (pets.length === 1) {
    return `\n\nOWNER CONTEXT\n${owner ? `Signed in as ${owner}. ` : ""}They have one pet:\n${list}\nAlways refer to this pet by name naturally and affectionately.`;
  }

  return `\n\nOWNER CONTEXT\n${owner ? `Signed in as ${owner}. ` : ""}They have several pets:\n${list}\n${
    active
      ? `This conversation is about ${active}. Refer to ${active} by name from now on.`
      : `Before acting on a pet-specific request, ask warmly which pet it's for, naming them (e.g. "Sure! Is this for ${pets[0]!.name} or ${pets[1]!.name}?").`
  }`;
}

function sanitise(input: unknown): ChatMessage[] {
  if (!Array.isArray(input)) return [];
  return input
    .filter(
      (m): m is ChatMessage =>
        !!m &&
        typeof m === "object" &&
        ((m as ChatMessage).role === "user" || (m as ChatMessage).role === "assistant") &&
        typeof (m as ChatMessage).content === "string",
    )
    .slice(-20)
    .map((m) => ({ role: m.role, content: m.content.slice(0, 2000) }));
}

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const body = (await request.json()) as ChatBody;
        const messages = sanitise(body.messages);
        if (messages.length === 0) {
          return new Response("A message is required", { status: 400 });
        }

        const key = process.env["ANTHROPIC_API_KEY"];
        if (!key) return new Response("AI is not configured", { status: 500 });

        const systemPrompt = PAWSY_SYSTEM_PROMPT + petContext(body);

        const response = await fetch("https://api.anthropic.com/v1/messages", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": key,
            "anthropic-version": "2023-06-01",
          },
          body: JSON.stringify({
            model: "claude-haiku-4-5-20251001",
            max_tokens: 500,
            system: systemPrompt,
            messages,
          }),
        });

        if (!response.ok) {
          return new Response("AI error", { status: 500 });
        }

        const data = await response.json() as { content: Array<{ type: string; text: string }> };
        const text = data.content.find((c) => c.type === "text")?.text ?? "Sorry, I couldn't respond right now 🐾";

        return new Response(text, {
          headers: { "Content-Type": "text/plain" },
        });
      },
    },
  },
});
