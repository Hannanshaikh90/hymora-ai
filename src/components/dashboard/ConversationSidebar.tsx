"use client";

import {
  Trash2,
  Search,
  Settings,
  CreditCard,
} from "lucide-react";
import { UserButton } from "@clerk/nextjs";

import { useState } from "react";

interface ConversationSidebarProps {
  chats: string[];
  activeChat: number;
  onSelect: (index: number) => void;
  onNewChat: () => void;
  onDelete: (index: number) => void;

  sidebarOpen: boolean;
}

export function ConversationSidebar({
  chats,
  activeChat,
  onSelect,
  onNewChat,
  onDelete,
  sidebarOpen,
}: ConversationSidebarProps) {

  const [search, setSearch] =
    useState("");

  return (
  <div className="w-64 border-r border-white/[0.08] bg-black/40 backdrop-blur-2xl flex flex-col h-screen">

    {/* Top */}
    <div className="p-4 border-b border-white/[0.05]">

      {/* New Chat */}
      <button
        onClick={onNewChat}
        className="w-full rounded-2xl bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:opacity-90 transition-all px-4 py-3 text-sm font-medium text-white shadow-lg shadow-violet-500/20"
      >
        + New Chat
      </button>

      {/* Search */}
      <div className="relative mt-4">

        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25" />

        <input
          value={search}
          onChange={(e) =>
            setSearch(
              e.target.value
            )
          }
          placeholder="Search chats..."
          className="w-full rounded-2xl border border-white/[0.08] bg-white/[0.04] pl-10 pr-4 py-3 text-sm text-white placeholder:text-white/25 outline-none focus:border-violet-500/40"
        />

      </div>

    </div>

    {/* Chats */}
    <div className="flex-1 overflow-y-auto p-4 space-y-2">

      {chats
        .filter((chat) =>
          chat
            .toLowerCase()
            .includes(
              search.toLowerCase()
            )
        )
        .map((chat, index) => (

          <div
            key={index}
            className={`group flex items-center justify-between rounded-2xl px-3 py-3 text-sm transition-all duration-200 ${
              activeChat === index
                ? "bg-white/[0.08] text-white shadow-lg shadow-black/20"
                : "text-white/60 hover:bg-white/[0.05]"
            }`}
          >

            <button
              onClick={() =>
                onSelect(index)
              }
              className="flex-1 text-left truncate"
            >
              {chat}
            </button>

            <button
              onClick={() =>
                onDelete(index)
              }
              className="opacity-0 group-hover:opacity-100 text-white/40 hover:text-red-400 transition-all"
            >
              <Trash2 className="w-4 h-4" />
            </button>

          </div>
        ))}

    </div>

    {/* Bottom */}
    <div className="p-4 border-t border-white/[0.05] space-y-2">

      {/* Profile */}
      <div className="flex items-center gap-3 rounded-2xl border border-white/[0.08] bg-white/[0.03] px-3 py-3">

        <UserButton />

        <div className="flex flex-col min-w-0">
          <p className="text-sm font-medium text-white truncate">
            Nexus User
          </p>

          <p className="text-xs text-white/40 truncate">
            Free Plan
          </p>
        </div>

      </div>

      {/* Settings */}
      <button
        className="flex items-center gap-3 w-full rounded-2xl px-3 py-3 text-sm text-white/60 hover:bg-white/[0.05] hover:text-white transition-all"
      >
        <Settings className="w-4 h-4" />
        Settings
      </button>

      {/* Billing */}
      <button
        className="flex items-center gap-3 w-full rounded-2xl px-3 py-3 text-sm text-white/60 hover:bg-white/[0.05] hover:text-white transition-all"
      >
        <CreditCard className="w-4 h-4" />
        Billing
      </button>

    </div>

  </div>
);
}