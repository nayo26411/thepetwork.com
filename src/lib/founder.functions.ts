import { createServerFn } from "@tanstack/react-start";
import { useSession } from "@tanstack/react-start/server";
import { founderSessionConfig, findFounder, type FounderIdentity } from "./founder.server";

export const loginFounder = createServerFn({ method: "POST" })
  .inputValidator((data: { email: string; password: string }) => data)
  .handler(async ({ data }) => {
    const founder = findFounder(data.email ?? "", data.password ?? "");
    if (!founder) return { ok: false as const };
    const session = await useSession<{ founder?: FounderIdentity }>(founderSessionConfig);
    await session.update({ founder });
    return { ok: true as const, founder };
  });

export const getFounderSession = createServerFn({ method: "GET" }).handler(async () => {
  const session = await useSession<{ founder?: FounderIdentity }>(founderSessionConfig);
  return session.data.founder ?? null;
});

export const logoutFounder = createServerFn({ method: "POST" }).handler(async () => {
  const session = await useSession<{ founder?: FounderIdentity }>(founderSessionConfig);
  await session.clear();
  return { ok: true as const };
});
