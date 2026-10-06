import { useNavigate, useRouterState } from "@tanstack/react-router";
import { toast } from "sonner";
import { useSession } from "@/mock/store";

/** Wrap an action that needs an account: guests are sent to sign in and brought back afterwards. */
export function useRequireLogin() {
  const { user } = useSession();
  const navigate = useNavigate();
  const href = useRouterState({ select: (s) => s.location.href });
  return (action: () => void, message = "Sign in to do that") => {
    if (user) {
      action();
      return;
    }
    toast.info(message);
    void navigate({ to: "/login", search: { redirect: href } });
  };
}
