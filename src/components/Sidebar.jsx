"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, FolderGit2, Settings, User, Sparkles } from "lucide-react";
import { UserButton } from "@clerk/nextjs";

const NAV_ITEMS = [
  { href: "/", label: "Overview", icon: LayoutDashboard },
  { href: "/repos", label: "Repos", icon: FolderGit2 },
  { href: "/profile", label: "Profile", icon: User },
  { href: "/settings", label: "Settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-full flex-col border-r border-border bg-surface-raised/80 p-4 backdrop-blur">
      <div className="mb-8 flex items-center gap-2 px-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-accent-soft-border bg-accent-soft text-accent">
          <Sparkles size={16} />
        </div>
        <span className="text-lg font-semibold tracking-tight text-text-primary">Git Wiki</span>
      </div>

      <nav className="flex flex-1 flex-col gap-1">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition ${
                active
                  ? "border border-border bg-white/[0.06] text-text-primary"
                  : "text-text-muted hover:bg-surface-hover hover:text-text-primary"
              }`}
            >
              <Icon size={18} />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="flex items-center gap-3 border-t border-border pt-4">
        <UserButton afterSignOutUrl="/sign-in" />
        <span className="text-sm text-text-muted">Account</span>
      </div>
    </aside>
  );
}