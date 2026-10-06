import { Link, useRouterState } from "@tanstack/react-router";
import { Lock } from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { useSession } from "@/mock/store";
import type { DemoState, Role, User } from "@/mock/types";
import { ListSkeleton } from "./ui";

const ROLE_NAMES: Record<Role, string> = {
  owner: "pet owners",
  pro: "professionals",
  founder: "the founding team",
};

/**
 * Shows its children only to signed-in users with one of the given roles.
 * Note: this only hides screens in the demo — it is not a security boundary.
 */
export function RequireRole({
  roles,
  children,
}: {
  roles: Role[];
  children: (user: User) => ReactNode;
}) {
  const { user, ready } = useSession();
  const pathname = useRouterState({ select: (s) => s.location.href });

  if (!ready) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-12">
        <ListSkeleton rows={3} />
      </div>
    );
  }

  if (!user || !roles.includes(user.role)) {
    return (
      <div className="paw-grid flex min-h-[60vh] items-center justify-center px-4 py-14">
        <div className="card-cozy w-full max-w-md p-8 text-center">
          <span className="mx-auto grid size-12 place-items-center rounded-2xl bg-accent text-caramel">
            <Lock className="size-6" />
          </span>
          <h1 className="mt-5 text-2xl text-foreground">
            {user ? "This page isn't for your account" : "Sign in to continue"}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            This area is for {roles.map((r) => ROLE_NAMES[r]).join(" and ")}.
            {user
              ? ` You're signed in as ${user.name}.`
              : " Sign in or create a free account to keep going."}
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            {user ? (
              <Button
                asChild
                className="rounded-full bg-caramel text-caramel-foreground hover:bg-caramel/90"
              >
                <Link to="/">Go home</Link>
              </Button>
            ) : (
              <>
                <Button
                  asChild
                  className="rounded-full bg-caramel text-caramel-foreground hover:bg-caramel/90"
                >
                  <Link to="/login" search={{ redirect: pathname }}>
                    Sign in
                  </Link>
                </Button>
                <Button asChild variant="outline" className="rounded-full">
                  <Link to="/signup">Create an account</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  return <>{children(user)}</>;
}

/** Where each kind of account lands after signing in. */
export function landingFor(user: Pick<User, "role" | "id">, data: DemoState) {
  if (user.role === "founder") return "/founder";
  if (user.role === "pro") {
    const app = data.applications.find((a) => a.userId === user.id);
    if (!app) return "/pro-signup";
    return app.status === "approved" ? "/pro/dashboard" : "/pro/application";
  }
  return "/digital-collar";
}
