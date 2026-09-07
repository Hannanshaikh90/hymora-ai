"use client";

import { useRouter } from "next/navigation";
import { useUser, useClerk } from "@clerk/nextjs";
import {
  Settings,
  CreditCard,
  LogOut,
  ChevronDown,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function UserDropdown() {
  const { user } = useUser();
  const { signOut } = useClerk();
  const router = useRouter();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="group flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 transition-all hover:bg-white/5">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#7C3AED] text-xs font-semibold text-white">
            {user?.firstName?.charAt(0) ||
              user?.fullName?.charAt(0) ||
              "U"}
          </div>

          <div className="min-w-0 flex-1 text-left">
            <p className="truncate text-sm font-medium text-white">
              {user?.fullName || "User"}
            </p>

            <p className="truncate text-xs text-zinc-400">
              {user?.primaryEmailAddress?.emailAddress}
            </p>
          </div>

          <ChevronDown
            size={16}
            className="text-zinc-500 transition-transform duration-200 data-[state=open]:rotate-180"
          />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        side="top"
align="center"
sideOffset={12}
alignOffset={0}
        className="z-50 w-[224px] rounded-xl border border-white/10 bg-[#0D0B14] p-2 shadow-2xl"
      >
        <div className="border-b border-white/5 px-2 py-2">
          <p className="truncate text-sm font-semibold text-white">
            {user?.fullName}
          </p>

          <p className="truncate text-xs text-zinc-400">
            {user?.primaryEmailAddress?.emailAddress}
          </p>
        </div>

        <div className="py-1">
          <DropdownMenuItem
            className="cursor-pointer rounded-lg"
            onClick={() => router.push("/dashboard/settings")}
          >
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </DropdownMenuItem>

          <DropdownMenuItem
            className="cursor-pointer rounded-lg"
            onClick={() => router.push("/dashboard/billing")}
          >
            <CreditCard className="mr-2 h-4 w-4" />
            Billing
          </DropdownMenuItem>
        </div>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          className="cursor-pointer rounded-lg text-red-400 focus:text-red-400"
          onClick={() =>
            signOut({
              redirectUrl: "/",
            })
          }
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}