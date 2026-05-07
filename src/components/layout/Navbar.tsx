"use client";

import * as React from "react";
import { Bell, Search, ChevronDown, LogOut, User, CreditCard, Keyboard } from "lucide-react";

import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { MobileSidebar } from "@/components/layout/MobileSidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Notification {
  id: string;
  title: string;
  description: string;
  time: string;
  read: boolean;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: "1",
    title: "Model training complete",
    description: "GPT-4o fine-tune job finished successfully",
    time: "2m ago",
    read: false,
  },
  {
    id: "2",
    title: "Usage threshold reached",
    description: "You've used 80% of your monthly quota",
    time: "1h ago",
    read: false,
  },
  {
    id: "3",
    title: "New team member joined",
    description: "sarah@acme.com accepted your invite",
    time: "3h ago",
    read: true,
  },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function NotificationsPopover() {
  const [open, setOpen] = React.useState(false);
  const unreadCount = MOCK_NOTIFICATIONS.filter((n) => !n.read).length;

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "relative h-8 w-8 text-zinc-400 hover:bg-white/[0.06] hover:text-white",
          open && "bg-white/[0.06] text-white"
        )}
        aria-label="Notifications"
      >
        <Bell size={15} />
        {unreadCount > 0 && (
          <span className="absolute right-1.5 top-1.5 flex h-1.5 w-1.5 rounded-full bg-blue-500 ring-1 ring-[#111111]" />
        )}
      </Button>

      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => setOpen(false)}
            />

            <motion.div
              initial={{ opacity: 0, y: -6, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.97 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              className={cn(
                "absolute right-0 top-10 z-50 w-80 overflow-hidden rounded-xl",
                "border border-white/[0.08] bg-[#111111] shadow-2xl shadow-black/60"
              )}
            >
              <div className="flex items-center justify-between border-b border-white/[0.06] px-4 py-3">
                <p className="text-xs font-semibold text-white">Notifications</p>
                {unreadCount > 0 && (
                  <Badge
                    variant="secondary"
                    className="h-4 bg-white/[0.08] px-1.5 text-[10px] text-zinc-400"
                  >
                    {unreadCount} new
                  </Badge>
                )}
              </div>

              <div className="divide-y divide-white/[0.04]">
                {MOCK_NOTIFICATIONS.map((n) => (
                  <div
                    key={n.id}
                    className={cn(
                      "flex gap-3 px-4 py-3 transition-colors hover:bg-white/[0.03]",
                      !n.read && "bg-white/[0.02]"
                    )}
                  >
                    {!n.read && (
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500" />
                    )}
                    {n.read && <span className="mt-1.5 h-1.5 w-1.5 shrink-0" />}
                    <div className="flex flex-col gap-0.5">
                      <p className="text-xs font-medium text-white">{n.title}</p>
                      <p className="text-[11px] text-zinc-500">{n.description}</p>
                      <p className="mt-0.5 text-[10px] text-zinc-600">{n.time}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-white/[0.06] px-4 py-2.5">
                <button className="text-[11px] text-zinc-500 transition-colors hover:text-zinc-300">
                  Mark all as read
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

function SearchButton() {
  return (
    <button
      className={cn(
        "flex h-8 items-center gap-2 rounded-lg border border-white/[0.08] px-3",
        "bg-white/[0.03] text-xs text-zinc-500 transition-all",
        "hover:border-white/[0.12] hover:bg-white/[0.06] hover:text-zinc-300",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20"
      )}
      aria-label="Search"
    >
      <Search size={12} />
      <span className="hidden sm:block">Search...</span>
      <kbd className="ml-2 hidden rounded border border-white/[0.08] bg-white/[0.04] px-1 py-0.5 font-mono text-[10px] text-zinc-600 sm:block">
        ⌘K
      </kbd>
    </button>
  );
}

function UserMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className={cn(
            "flex items-center gap-2 rounded-lg px-1.5 py-1 transition-colors",
            "hover:bg-white/[0.06] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20"
          )}
        >
          <Avatar className="h-6 w-6 ring-1 ring-white/[0.12]">
            <AvatarImage src="/avatar.png" alt="User" />
            <AvatarFallback className="bg-white/[0.08] text-[9px] font-medium text-white">
              AJ
            </AvatarFallback>
          </Avatar>
          <span className="hidden text-xs font-medium text-zinc-300 sm:block">
            Alex Johnson
          </span>
          <ChevronDown size={12} className="hidden text-zinc-600 sm:block" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        sideOffset={8}
        className="w-52 border-white/[0.08] bg-[#111111] shadow-2xl shadow-black/60"
      >
        <DropdownMenuLabel className="pb-1">
          <p className="text-xs font-medium text-white">Alex Johnson</p>
          <p className="text-[11px] font-normal text-zinc-500">alex@acme.com</p>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-white/[0.06]" />
        <DropdownMenuGroup>
          <DropdownMenuItem className="gap-2 text-xs text-zinc-400 focus:bg-white/[0.06] focus:text-white">
            <User size={13} />
            Profile
            <DropdownMenuShortcut className="text-[10px]">⌘P</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem className="gap-2 text-xs text-zinc-400 focus:bg-white/[0.06] focus:text-white">
            <CreditCard size={13} />
            Billing
            <DropdownMenuShortcut className="text-[10px]">⌘B</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem className="gap-2 text-xs text-zinc-400 focus:bg-white/[0.06] focus:text-white">
            <Keyboard size={13} />
            Shortcuts
            <DropdownMenuShortcut className="text-[10px]">⌘/</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator className="bg-white/[0.06]" />
        <DropdownMenuItem className="gap-2 text-xs text-red-400 focus:bg-red-500/10 focus:text-red-400">
          <LogOut size={13} />
          Log out
          <DropdownMenuShortcut className="text-[10px]">⌘Q</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

interface NavbarProps {
  isMobile?: boolean;
  className?: string;
}

export function Navbar({ className, isMobile }: NavbarProps) {
  return (
    <header
      className={cn(
        "sticky top-0 z-30 flex h-14 shrink-0 items-center justify-between",
        "border-b border-white/[0.06] px-4",
        // Glassmorphism
        "bg-[#0a0a0a]/80 backdrop-blur-xl backdrop-saturate-150",
        className
      )}
    >
      {/* Left */}
      <div className="flex items-center gap-3">
        {isMobile && <MobileSidebar />}
        <SearchButton />
      </div>

      {/* Right */}
      <div className="flex items-center gap-1.5">
        <NotificationsPopover />
        <div className="mx-1 h-4 w-px bg-white/[0.08]" />
        <UserMenu />
      </div>
    </header>
  );
}