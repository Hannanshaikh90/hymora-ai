"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  BrainCircuit,
  MessageSquare,
  BarChart3,
  FolderOpen,
  Settings,
  Users,
  Zap,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
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

const SIDEBAR_WIDTH = 240;
const SIDEBAR_COLLAPSED_WIDTH = 64;

// ─── Sub-components ───────────────────────────────────────────────────────────

interface SidebarNavItemProps {
  item: NavItem;
  isCollapsed: boolean;
  isActive: boolean;
}

const SidebarNavItem = ({ item, isCollapsed, isActive }: SidebarNavItemProps) => {
  const Icon = item.icon;

  const content = (
    <Link
      href={item.href}
      className={cn(
        "relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-150",
        "group hover:bg-white/[0.06] hover:text-white",
        isActive
          ? "bg-white/[0.08] text-white"
          : "text-zinc-400",
        isCollapsed && "justify-center px-0"
      )}
    >
      {/* Active indicator */}
      {isActive && (
        <motion.span
          layoutId="sidebar-active-pill"
          className="absolute inset-0 rounded-lg bg-white/[0.08] ring-1 ring-white/[0.12]"
          transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
        />
      )}

      <span className="relative z-10 flex shrink-0 items-center">
        <Icon
          size={16}
          className={cn(
            "transition-colors duration-150",
            isActive ? "text-white" : "text-zinc-500 group-hover:text-zinc-300"
          )}
        />
      </span>

      <AnimatePresence initial={false}>
        {!isCollapsed && (
          <motion.span
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: "auto" }}
            exit={{ opacity: 0, width: 0 }}
            transition={{ duration: 0.2 }}
            className="relative z-10 flex flex-1 items-center justify-between overflow-hidden whitespace-nowrap"
          >
            {item.label}
            {item.badge !== undefined && (
              <Badge
                variant="secondary"
                className="ml-auto h-4 min-w-4 shrink-0 bg-white/[0.08] px-1 text-[10px] font-medium text-zinc-400"
              >
                {item.badge}
              </Badge>
            )}
          </motion.span>
        )}
      </AnimatePresence>
    </Link>
  );

  if (isCollapsed) {
    return (
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>{content}</TooltipTrigger>
        <TooltipContent side="right" className="flex items-center gap-2">
          {item.label}
          {item.badge !== undefined && (
            <Badge variant="secondary" className="text-[10px]">
              {item.badge}
            </Badge>
          )}
        </TooltipContent>
      </Tooltip>
    );
  }

  return content;
};

// ─── Main Component ───────────────────────────────────────────────────────────

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
  className?: string;
}

export function Sidebar({ isCollapsed, onToggle, className }: SidebarProps) {
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/dashboard" ? pathname === href : pathname.startsWith(href);

  return (
    <TooltipProvider>
      <motion.aside
        animate={{ width: isCollapsed ? SIDEBAR_COLLAPSED_WIDTH : SIDEBAR_WIDTH }}
        transition={{ type: "spring", bounce: 0, duration: 0.35 }}
        className={cn(
          "relative flex h-full shrink-0 flex-col overflow-hidden",
          "border-r border-white/[0.06] bg-[#0a0a0a]",
          className
        )}
      >
        {/* Logo */}
        <div
          className={cn(
            "flex h-14 shrink-0 items-center border-b border-white/[0.06] px-4",
            isCollapsed && "justify-center px-0"
          )}
        >
          <Link href="/dashboard" className="flex items-center gap-2.5">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white/[0.08] ring-1 ring-white/[0.12]">
              <Sparkles size={14} className="text-white" />
            </span>
            <AnimatePresence initial={false}>
              {!isCollapsed && (
                <motion.span
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden whitespace-nowrap text-sm font-semibold tracking-tight text-white"
                >
                  Nexus AI
                </motion.span>
              )}
            </AnimatePresence>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex flex-1 flex-col gap-4 overflow-y-auto overflow-x-hidden p-3 scrollbar-none">
          {NAV_GROUPS.map((group, groupIdx) => (
            <div key={groupIdx} className="flex flex-col gap-0.5">
              <AnimatePresence initial={false}>
                {!isCollapsed && group.title && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    className="mb-1 px-3 text-[10px] font-semibold uppercase tracking-widest text-zinc-600"
                  >
                    {group.title}
                  </motion.p>
                )}
              </AnimatePresence>
              {group.items.map((item) => (
                <SidebarNavItem
                  key={item.href}
                  item={item}
                  isCollapsed={isCollapsed}
                  isActive={isActive(item.href)}
                />
              ))}
            </div>
          ))}
        </nav>

        {/* User section */}
        <div className="shrink-0 border-t border-white/[0.06] p-3">
          <div
            className={cn(
              "flex items-center gap-3 rounded-lg px-2 py-2 transition-colors hover:bg-white/[0.04]",
              isCollapsed && "justify-center px-0"
            )}
          >
            <Avatar className="h-7 w-7 shrink-0 ring-1 ring-white/[0.12]">
              <AvatarImage src="/avatar.png" alt="User" />
              <AvatarFallback className="bg-white/[0.08] text-[10px] font-medium text-white">
                NA
              </AvatarFallback>
            </Avatar>
            <AnimatePresence initial={false}>
              {!isCollapsed && (
                <motion.div
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <p className="whitespace-nowrap text-xs font-medium text-white">
                    Alex Johnson
                  </p>
                  <p className="whitespace-nowrap text-[10px] text-zinc-500">
                    Pro Plan
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Collapse toggle */}
        <button
          onClick={onToggle}
          className={cn(
            "absolute -right-3 top-[52px] z-10 flex h-6 w-6 items-center justify-center",
            "rounded-full border border-white/[0.1] bg-[#0a0a0a] text-zinc-400",
            "shadow-sm transition-all hover:border-white/[0.2] hover:text-white",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20"
          )}
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
        </button>
      </motion.aside>
    </TooltipProvider>
  );
}