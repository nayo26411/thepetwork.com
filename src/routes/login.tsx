import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Heart, PawPrint } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Pet Owner Sign In | The Petwork" },
      {
        name: "description",
        content: "Sign in as a pet owner to save places, join groups and manage your pet profiles on The Petwork.",
      },
      { property: "og:title", content: "Pet Owner Sign In | The Petwork" },
      { property: "og:description", content: "Sign in to your warm corner of The Petwork." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  return (
    <div className="paw-grid flex min-h-[70vh] items-center justify-center px-4 py-14">
      <div className="card-cozy w-full max-w-md p-8">
        <span className="grid size-12 place-items-center rounded-2xl bg-accent text-caramel">
          <Heart className="size-6" />
        </span>
        <h1 className="mt-5 text-2xl text-foreground">Welcome back, pet parent</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Sign in to save places on the map, join neighbourhood groups and keep your pet&apos;s
          records safe.
        </p>

        <form
          className="mt-6 space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            if (!name.trim() || !email.trim()) return;
            signIn({ role: "owner", name: name.trim(), email: email.trim() });
            toast.success(`Welcome to The Petwork, ${name.trim().split(" ")[0]}`);
            navigate({ to: "/" });
          }}
        >
          <div>
            <Label htmlFor="name">Your name</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} maxLength={60} placeholder="Your full name" className="mt-1.5 rounded-xl" required />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} maxLength={120} placeholder="you@thepetwork.com" className="mt-1.5 rounded-xl" required />
          </div>
          <Button type="submit" className="w-full rounded-full bg-caramel text-caramel-foreground hover:bg-caramel/90">
            <PawPrint className="size-4" /> Enter The Petwork
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Running The Petwork?{" "}
          <Link to="/founder-access" className="font-bold text-caramel hover:underline">
            Founder Access
          </Link>
        </p>
      </div>
    </div>
  );
}
