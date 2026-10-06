import { Link, useNavigate } from "@tanstack/react-router";
import {
  BellRing,
  BriefcaseBusiness,
  CalendarCheck,
  CalendarDays,
  ChevronDown,
  ClipboardCheck,
  Dog,
  LayoutDashboard,
  LogOut,
  MessageCircle,
  Settings,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { signOut } from "@/mock/actions";
import type { User } from "@/mock/types";
import { PersonAvatar } from "./ui";

export const MENU_LINKS: Record<User["role"], { to: string; label: string; icon: typeof Dog }[]> = {
  owner: [
    { to: "/digital-collar", label: "My pets", icon: Dog },
    { to: "/reminders", label: "Reminders", icon: BellRing },
    { to: "/bookings", label: "My bookings", icon: CalendarCheck },
    { to: "/messages", label: "Messages", icon: MessageCircle },
    { to: "/account", label: "Account settings", icon: Settings },
  ],
  pro: [
    { to: "/pro/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/pro/bookings", label: "Bookings", icon: CalendarCheck },
    { to: "/pro/availability", label: "Availability", icon: CalendarDays },
    { to: "/pro/profile", label: "Public profile", icon: UserRound },
    { to: "/pro/application", label: "Verification status", icon: ClipboardCheck },
    { to: "/messages", label: "Messages", icon: MessageCircle },
    { to: "/account", label: "Account settings", icon: Settings },
  ],
  founder: [
    { to: "/founder", label: "Founder console", icon: ShieldCheck },
    { to: "/account", label: "Account settings", icon: Settings },
  ],
};

const ROLE_LABEL: Record<User["role"], string> = {
  owner: "Pet owner",
  pro: "Professional",
  founder: "Founder",
};

export function UserMenu({ user }: { user: User }) {
  const navigate = useNavigate();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-2 rounded-full py-1 pl-1 pr-2.5 text-sm font-semibold hover:bg-sidebar-accent">
        <PersonAvatar name={user.name} className="size-8 bg-blush text-xs text-mocha ring-0" />
        <span className="hidden max-w-28 truncate sm:inline">{user.name.split(" ")[0]}</span>
        <ChevronDown className="size-4 opacity-70" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-60 rounded-2xl p-1.5">
        <DropdownMenuLabel className="px-2.5 py-2">
          <span className="block truncate text-sm font-bold">{user.name}</span>
          <span className="flex items-center gap-1 text-xs font-semibold text-muted-foreground">
            <BriefcaseBusiness className="size-3" /> {ROLE_LABEL[user.role]}
          </span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {MENU_LINKS[user.role].map((l) => (
          <DropdownMenuItem key={l.to} asChild className="cursor-pointer rounded-xl px-2.5 py-2">
            <Link to={l.to}>
              <l.icon className="size-4 text-caramel" /> {l.label}
            </Link>
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer rounded-xl px-2.5 py-2"
          onSelect={() => {
            signOut();
            void navigate({ to: "/" });
          }}
        >
          <LogOut className="size-4" /> Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
