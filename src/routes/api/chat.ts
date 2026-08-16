import { createFileRoute } from "@tanstack/react-router";
import { streamText } from "ai";
import { createLovableAiGatewayProvider } from "@/lib/ai-gateway.server";
import { PAWSY_SYSTEM_PROMPT } from "@/lib/pawsy-prompt";

type ChatMessage = { role: "user" | "assistant"; content: string };
type ChatBody = { messages?: unknown; owner?: unknown; pets?: unknown; activePet?: unknown };

type PetInfo = { name: string; species?: string | undefined; breed?: string | undefined; age?: string | undefined };

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
    return `\n\nOWNER CONTEXT\nThis person is not logged in and has no pet profile. Early in the conversation, say exactly once: "I'd love to personalise this for your pet! Log in or create a profile and I'll remember everything 🐾" Then help them anyway. Never invent a pet name.`;
  }

  const list = pets
    .map((p) => `- ${p.name}${p.species ? `, a ${p.species.toLowerCase()}` : ""}${p.breed ? ` (${p.breed})` : ""}${p.age ? `, ${p.age}` : ""}`)
    .join("\n");

  if (pets.length === 0) {
    return `\n\nOWNER CONTEXT\nSigned in as ${owner}. No pets on their Digital Collar yet — warmly invite them to add one at /digital-collar so you can personalise things.`;
  }

  if (pets.length === 1) {
    return `\n\nOWNER CONTEXT\n${owner ? `Signed in as ${owner}. ` : ""}They have one pet:\n${list}\nAlways refer to this pet by name, naturally and affectionately, like a friend who knows them ("Are you looking for a groomer for ${pets[0]!.name}?"). Never ask which pet — there is only one.`;
  }

  return `\n\nOWNER CONTEXT\n${owner ? `Signed in as ${owner}. ` : ""}They have several pets:\n${list}\n${
    active
      ? `This conversation is about ${active}. Refer to ${active} by name from now on and do NOT ask again which pet it is for.`
      : `Before acting on a pet-specific request, ask warmly which pet it's for, naming them (e.g. "Sure! Is this for ${pets[0]!.name} or ${pets[1]!.name}?"). Once a pet is named, keep using that name for the rest of the chat.`
  }`;
}

function sanitise(input: unknown): ChatMessage[] {
  if (!Array.isArray(input)) return [];
  return input
    .filter(
      (m): m is ChatMessage =>
        !!m &&
        typeof m === "object" &&
        (("role" in m && (m as ChatMessage).role === "user") ||
          (m as ChatMessage).role === "assistant") &&
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

        const key = process.env["LOVABLE_API_KEY"];
        if (!key) return new Response("AI is not configured", { status: 500 });

        const gateway = createLovableAiGatewayProvider(key);
        const result = streamText({
          model: gateway("google/gemini-3.6-flash"),
          system: PAWSY_SYSTEM_PROMPT + petContext(body),
          messages,
        });

        return result.toTextStreamResponse();
      },
    },
  },
});
