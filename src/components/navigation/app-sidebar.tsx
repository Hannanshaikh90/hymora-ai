"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  useUser,
  useClerk,
} from "@clerk/nextjs";

import {
  mainNavigation,
  secondaryNavigation,
} from "@/config/navigation";

import { cn } from "@/lib/utils";
import { UserDropdown } from "@/components/layout/UserDropdown";

// ─── Types ────────────────────────────────────────────────────────────────────

interface NavItem {
  href: string;
  title: string;
  icon: React.ElementType;
}

// ─── NavLink ──────────────────────────────────────────────────────────────────

function NavLink({
  item,
  isActive,
}: {
  item: NavItem;
  isActive: boolean;
}) {
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      className={cn(
        "group relative flex items-center gap-2.5 rounded-md px-2.5 py-[7px] text-[13px] transition-colors duration-150 ease-out",
        isActive
          ? "font-medium"
          : "font-normal"
      )}
      style={{
        color: isActive
          ? "#E5E5F0"
          : "#7A7A92",
        backgroundColor: isActive
          ? "rgba(124,58,237,0.10)"
          : "transparent",
      }}
    >
      {!isActive && (
        <span
          className="pointer-events-none absolute inset-0 rounded-md opacity-0 transition-opacity duration-150 group-hover:opacity-100"
          style={{
            background:
              "rgba(255,255,255,0.035)",
          }}
        />
      )}

      <Icon
        className="relative h-[15px] w-[15px] shrink-0 transition-colors duration-150"
        style={{
          color: isActive
            ? "#A78BFA"
            : "#5A5A72",
        }}
        strokeWidth={1.75}
      />

      <span className="relative flex-1 truncate tracking-[-0.01em]">
        {item.title}
      </span>
    </Link>
  );
}

// ─── Divider ─────────────────────────────────────────────────────────────────

function Divider() {
  return (
    <div
      className="mx-4 my-3"
      style={{
        height: "1px",
        background:
          "rgba(255,255,255,0.045)",
      }}
    />
  );
}


// ─── AppSidebar ──────────────────────────────────────────────────────────────

export function AppSidebar() {
  const pathname =
    usePathname();

  return (
    <aside
  className="hidden lg:flex h-screen w-[240px] shrink-0 flex-col border-r"
      style={{
        backgroundColor: "#05030A",
        borderColor:
          "rgba(255,255,255,0.045)",
      }}
    >
      {/* Logo */}
      <div className="flex h-14 shrink-0 items-center gap-2 px-4">
        <div
          className="flex h-5 w-5 shrink-0 items-center justify-center rounded-[5px]"
          style={{
            background: "#7C3AED",
          }}
        >
          <Image
            src="/brand/icon.png"
            alt=""
            width={12}
            height={12}
            priority
            className="h-3 w-3 object-contain"
          />
        </div>

        <span
          className="text-[13.5px] font-medium tracking-[-0.01em]"
          style={{
            color: "#E5E5F0",
          }}
        >
          Hymora
        </span>
      </div>

      {/* Main navigation */}
      <nav className="flex flex-col gap-[2px] px-3 pt-2">
        {mainNavigation.map(
          (item: NavItem) => (
            <NavLink
              key={item.href}
              item={item}
              isActive={
                pathname === item.href
              }
            />
          )
        )}
      </nav>

      <Divider />

      {/* Secondary navigation */}
      <nav className="flex flex-col gap-[2px] px-3">
        {secondaryNavigation.map(
          (item: NavItem) => (
            <NavLink
              key={item.href}
              item={item}
              isActive={
                pathname === item.href
              }
            />
          )
        )}
      </nav>

      {/* Spacer */}
      <div className="flex-1" />

      {/* User */}
      <div
        className="border-t px-3 py-3"
        style={{
          borderColor:
            "rgba(255,255,255,0.045)",
        }}
      >
        <UserDropdown />
      </div>
    </aside>
  );
}