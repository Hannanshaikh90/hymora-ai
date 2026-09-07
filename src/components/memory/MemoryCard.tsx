"use client";

import { Brain, Clock, Copy } from "lucide-react";

interface MemoryRecord {
  id: string;
  memory: string;
  created_at: string;
}

interface MemoryCardProps {
  memory: MemoryRecord;
}

function formatRelativeDate(date: string) {
  const diff =
    Date.now() - new Date(date).getTime();

  const minutes = Math.floor(diff / 60000);

  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;

  const hours = Math.floor(minutes / 60);

  if (hours < 24) return `${hours}h ago`;

  const days = Math.floor(hours / 24);

  return `${days}d ago`;
}

export default function MemoryCard({
  memory,
}: MemoryCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-white/5 bg-[#0F0C16] p-5 transition-all duration-300 hover:-translate-y-1 hover:border-[#7C3AED]/30 hover:shadow-[0_18px_40px_rgba(124,58,237,0.12)]">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-[#7C3AED] via-[#A78BFA] to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex flex-1 gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#7C3AED]/10">
            <Brain
              className="h-5 w-5 text-[#A78BFA]"
              strokeWidth={1.8}
            />
          </div>

          <div>
            <p className="line-clamp-3 text-[15px] font-medium leading-6 text-white">
              {memory.memory}
            </p>

            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className="rounded-full border border-[#7C3AED]/20 bg-[#7C3AED]/10 px-2.5 py-1 text-[11px] font-medium text-[#C4B5FD]">
                {"Memory"}
              </span>

              <span className="flex items-center gap-1 text-[11px] text-[#5A5A72]">
                <Clock className="h-3 w-3" />
                {formatRelativeDate(memory.created_at)}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
          <button
            onClick={() =>
              navigator.clipboard.writeText(memory.memory)
            }
            className="rounded-lg border border-white/10 p-2 text-[#8B8BA3] transition hover:border-[#7C3AED]/40 hover:text-white"
            title="Copy memory"
          >
            <Copy className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}