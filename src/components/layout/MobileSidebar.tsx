"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BrainCircuit,
  MessageSquare,
  BarChart3,
  FolderOpen,
  Settings,
  Users,
  Zap,
  Menu,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

// ─── Types ────────────────────────────────────────────────────────────────────

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  badge?: string | number;
}

interface NavGroup {
  title?: string;
  items: NavItem[];
}

// ─── Constants ────────────────────────────────────────────────────────────────

const NAV_GROUPS: NavGroup[] = [
  {
    items: [
      { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
      { label: "AI Studio", href: "/dashboard/studio", icon: BrainCircuit, badge: "New" },
      { label: "Chat", href: "/dashboard/chat", icon: MessageSquare, badge: 3 },
    ],
  },
  {
    title: "Workspace",
    items: [
      { label: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
      { label: "Projects", href: "/dashboard/projects", icon: FolderOpen },
      { label: "Automations", href: "/dashboard/automations", icon: Zap },
      { label: "Team", href: "/dashboard/team", icon: Users },
    ],
  },
  {
    title: "System",
    items: [
      { label: "Settings", href: "/dashboard/settings", icon: Settings },
    ],
  },
];

// ─── Main Component ───────────────────────────────────────────────────────────

export function MobileSidebar() {
  const pathname = usePathname();
  const [open, setOpen] = React.useState(false);

  const isActive = (href: string) =>
    href === "/dashboard" ? pathname === href : pathname.startsWith(href);

  // Close sheet on route change
  React.useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-zinc-400 hover:bg-white/[0.06] hover:text-white"
          aria-label="Open navigation"
        >
          <Menu size={16} />
        </Button>
      </SheetTrigger>

      <SheetContent
        side="left"
        className="w-64 border-r border-white/[0.06] bg-[#0a0a0a] p-0"
      >
        {/* Logo */}
        <div className="flex h-14 items-center border-b border-white/[0.06] px-4">
          <Link href="/dashboard" className="flex items-center gap-2.5">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/[0.08] ring-1 ring-white/[0.12]">
              <Sparkles size={14} className="text-white" />
            </span>
            <span className="text-sm font-semibold tracking-tight text-white">
              Nexus AI
            </span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex flex-1 flex-col gap-4 overflow-y-auto p-3">
          {NAV_GROUPS.map((group, groupIdx) => (
            <div key={groupIdx} className="flex flex-col gap-0.5">
              {group.title && (
                <p className="mb-1 px-3 text-[10px] font-semibold uppercase tracking-widest text-zinc-600">
                  {group.title}
                </p>
              )}
              {group.items.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                      "hover:bg-white/[0.06] hover:text-white",
                      active
                        ? "bg-white/[0.08] text-white ring-1 ring-white/[0.12]"
                        : "text-zinc-400"
                    )}
                  >
                    <Icon
                      size={15}
                      className={cn(
                        active ? "text-white" : "text-zinc-500"
                      )}
                    />
                    <span className="flex-1">{item.label}</span>
                    {item.badge !== undefined && (
                      <Badge
                        variant="secondary"
                        className="h-4 bg-white/[0.08] px-1 text-[10px] text-zinc-400"
                      >
                        {item.badge}
                      </Badge>
                    )}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        {/* User section */}
        <div className="border-t border-white/[0.06] p-3">
          <div className="flex items-center gap-3 rounded-lg px-2 py-2">
            <Avatar className="h-7 w-7 ring-1 ring-white/[0.12]">
              <AvatarImage src="/avatar.png" alt="User" />
              <AvatarFallback className="bg-white/[0.08] text-[10px] font-medium text-white">
                AJ
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-xs font-medium text-white">Alex Johnson</p>
              <p className="text-[10px] text-zinc-500">Pro Plan</p>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}