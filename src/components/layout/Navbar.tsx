"use client";

import { MobileSidebar } from "@/components/layout/MobileSidebar";
import { UserButton } from "@clerk/nextjs";

import { Bell, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Navbar = () => {
  return (
    <header className="sticky top-0 z-30 shrink-0 flex h-[60px] items-center border-b border-white/[0.06] bg-[#0a0a0a]/80 px-5 backdrop-blur-md">
      
      {/* Mobile Sidebar Trigger */}
      <div className="mr-3 md:hidden">
        <MobileSidebar />
      </div>

      {/* Search Bar */}
      <button
        type="button"
        className="group hidden h-9 w-[240px] items-center gap-2 rounded-xl border border-white/[0.06] bg-white/[0.04] px-3 transition-all duration-200 hover:border-white/[0.10] hover:bg-white/[0.06] md:flex"
      >
        <Search className="h-3.5 w-3.5 shrink-0 text-white/25 transition-colors duration-200 group-hover:text-white/50" />

        <span className="text-[12px] text-white/25 transition-colors duration-200 group-hover:text-white/50">
          Search...
        </span>

        <div className="ml-auto flex items-center gap-1">
          <kbd className="rounded bg-white/[0.06] px-1 py-0.5 font-mono text-[9px] text-white/20">
            ⌘
          </kbd>

          <kbd className="rounded bg-white/[0.06] px-1 py-0.5 font-mono text-[9px] text-white/20">
            K
          </kbd>
        </div>
      </button>

      {/* Right Actions */}
      <div className="ml-auto flex items-center gap-2">
        
        {/* Notifications */}
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label="Notifications"
          className="relative h-9 w-9 rounded-xl text-white/30 transition-all duration-200 hover:bg-white/[0.05] hover:text-white/80"
        >
          <Bell className="h-4 w-4" />

          {/* Notification Dot */}
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-emerald-500" />
        </Button>

        {/* Divider */}
        <div className="mx-1 h-4 w-px bg-white/[0.08]" />

        {/* Clerk User Button */}
        <div className="rounded-full ring-1 ring-white/[0.06] transition-all duration-200 hover:ring-white/[0.12]">
          <UserButton
            appearance={{
              elements: {
                avatarBox: "w-9 h-9",
              },
            }}
          />
        </div>
      </div>
    </header>
  );
};