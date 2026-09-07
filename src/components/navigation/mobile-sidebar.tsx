"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

import {
  mainNavigation,
  secondaryNavigation,
} from "@/config/navigation";

import { UserDropdown } from "@/components/layout/UserDropdown";
import { cn } from "@/lib/utils";

export function MobileSidebar() {
  const pathname = usePathname();

  const [open, setOpen] = useState(false);

  return (
  <>
    {/* Menu Button */}
    <button
      onClick={() => setOpen(true)}
      className="fixed left-4 top-4 z-50 flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-[#0D0B14] text-white lg:hidden"
    >
      <Menu className="h-5 w-5" />
    </button>

    {open && (
      <div className="fixed inset-0 z-50 lg:hidden">
        {/* Overlay */}
        <div
          onClick={() => setOpen(false)}
          className="
  absolute
  inset-0
  bg-black/60
  backdrop-blur-sm
  animate-in
  fade-in
  duration-300
"
        />

        {/* Drawer */}
       <aside
  className="
    absolute
    left-0
    top-0
    flex
    h-full
    w-[280px]
    flex-col
    border-r
    border-white/10
    bg-[#05030A]
    shadow-2xl
    animate-in
    slide-in-from-left
    duration-300
  "
>

  {/* Header */}
  <div className="flex items-center justify-between border-b border-white/5 px-4 py-4">

    <div className="flex items-center gap-2">
      <div className="flex h-6 w-6 items-center justify-center rounded-md bg-[#7C3AED]">
        <Image
          src="/brand/icon.png"
          alt="Hymora"
          width={14}
          height={14}
        />
      </div>

      <span className="text-sm font-semibold text-white">
        Hymora
      </span>
    </div>

    <button
      onClick={() => setOpen(false)}
      className="rounded-lg p-2 text-[#A1A1B5] transition hover:bg-white/5 hover:text-white"
    >
      <X className="h-5 w-5" />
    </button>

  </div>

  {/* Main Navigation */}
<nav className="flex flex-col gap-1 px-3 py-4">
  {mainNavigation.map((item) => {
    const Icon = item.icon;

    const isActive = pathname === item.href;

    return (
      <Link
        key={item.href}
        href={item.href}
        onClick={() => setOpen(false)}
        className={cn(
          "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
          isActive
            ? "bg-[#7C3AED]/15 text-white"
            : "text-[#8B8BA3] hover:bg-white/5 hover:text-white"
        )}
      >
        <Icon className="h-4 w-4" />

        <span>{item.title}</span>
      </Link>
    );
  })}
</nav>

<div className="mx-4 h-px bg-white/5" />

{/* Secondary Navigation */}
<nav className="flex flex-col gap-1 px-3 py-4">
  {secondaryNavigation.map((item) => {
    const Icon = item.icon;

    const isActive = pathname === item.href;

    return (
      <Link
        key={item.href}
        href={item.href}
        onClick={() => setOpen(false)}
        className={cn(
          "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
          isActive
            ? "bg-[#7C3AED]/15 text-white"
            : "text-[#8B8BA3] hover:bg-white/5 hover:text-white"
        )}
      >
        <Icon className="h-4 w-4" />

        <span>{item.title}</span>
      </Link>
    );
  })}
</nav>

<div className="flex-1" />

<div className="border-t border-white/5 p-3">
  <UserDropdown />
</div>

</aside>
      </div>
    )}
  </>
);
}