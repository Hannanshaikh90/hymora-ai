import Link from "next/link";
import { Brain, MessageSquare, ArrowUpRight, Layers } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface WorkspaceCardProps {
  id: string;
  title: string;
  description: string;
  knowledgeCount: number;
  messageCount: number;
  memoryStrength: number;
  lastActive: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

type MemoryTier = {
  label: string;
  color: string;
  bg: string;
  border: string;
  barColor: string;
};

function getMemoryTier(strength: number): MemoryTier {
  if (strength >= 70) {
    return {
      label: "Strong",
      color: "#639922",
      bg: "rgba(99,153,34,0.1)",
      border: "rgba(99,153,34,0.2)",
      barColor: "linear-gradient(90deg, #7C3AED, #A78BFA)",
    };
  }
  if (strength >= 35) {
    return {
      label: "Building",
      color: "#BA7517",
      bg: "rgba(186,117,23,0.1)",
      border: "rgba(186,117,23,0.2)",
      barColor: "linear-gradient(90deg, #7C3AED, #BA7517)",
    };
  }
  return {
    label: "Thin",
    color: "#5A5A72",
    bg: "rgba(255,255,255,0.04)",
    border: "rgba(255,255,255,0.06)",
    barColor: "linear-gradient(90deg, #3A3A52, #5A5A72)",
  };
}

// ─── Component ────────────────────────────────────────────────────────────────

export function WorkspaceCard({
  id,
  title,
  description,
  knowledgeCount,
  messageCount,
  memoryStrength,
  lastActive,
}: WorkspaceCardProps) {
  const strength = Math.min(100, Math.max(0, memoryStrength));
  const tier = getMemoryTier(strength);

  return (
    <Link
      href={`/dashboard/projects/${id}`}
      className="group relative flex flex-col overflow-hidden rounded-[20px] border border-white/[0.06] bg-gradient-to-br from-[#100D18] via-[#0D0B14] to-[#09080E] p-5 transition-all duration-300 hover:-translate-y-1.5 hover:border-[#7C3AED]/30 hover:shadow-[0_24px_60px_rgba(124,58,237,0.16)]">
      {/* Gradient top bar — always rendered, opacity controlled */}
      <span
        aria-hidden
        className="absolute inset-x-0 top-0 h-px opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ background: "linear-gradient(90deg, #7C3AED 0%, #A78BFA 50%, transparent 100%)" }}
      />

      {/* Ambient glow */}
      <span
        aria-hidden
        className="pointer-events-none absolute -top-12 right-0 h-[100px] w-[140px] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background: "radial-gradient(ellipse at 80% 0%, rgba(124,58,237,0.12) 0%, transparent 70%)",
        }}
      />

      {/* ── Header ───────────────────────────────────────────────────────── */}
      <div className="relative flex items-start justify-between gap-3 mb-3.5">
        <div className="flex items-start gap-2.5 min-w-0">
          {/* Workspace identity mark */}
          <div className="relative mt-px flex h-7 w-7 shrink-0 items-center justify-center rounded-[7px] bg-[rgba(124,58,237,0.2)] border border-[rgba(124,58,237,0.2)]">
            <Brain className="h-3.5 w-3.5 text-[#A78BFA]" strokeWidth={1.75} />
            {/* Memory-alive pulse dot */}
            <span
              className="absolute -bottom-0.5 -right-0.5 h-[7px] w-[7px] rounded-full border-[1.5px] border-[#0D0B14]"
              style={{ background: tier.color }}
            />
          </div>

          <div className="min-w-0">
            <p className="truncate text-[16px] font-semibold tracking-[-0.02em] text-white">
              {title}
            </p>
            <p className="mt-1 line-clamp-2 text-[13px] leading-6 text-[#8B8BA3]">
              {description}
            </p>
          </div>
        </div>

        <ArrowUpRight
          className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#3A3A52] opacity-0 transition-all duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100 group-hover:text-[#7C3AED]"
          strokeWidth={1.75}
        />
      </div>

      {/* ── Memory bar ───────────────────────────────────────────────────── */}
      <div className="relative mb-3.5">
        <div className="mb-1.5 flex items-center justify-between">
          <span className="text-[10px] text-[#3A3A52] uppercase tracking-[0.1em] font-medium">
            Memory
          </span>
          <span
            className="rounded-full px-1.5 py-px text-[9px] font-semibold uppercase tracking-[0.08em]"
            style={{
              color: tier.color,
              background: tier.bg,
              border: `0.5px solid ${tier.border}`,
            }}
          >
            {tier.label}
          </span>
        </div>

        <div className="h-[3px] w-full overflow-hidden rounded-full bg-[rgba(255,255,255,0.04)]">
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{ width: `${strength}%`, background: tier.barColor }}
          />
        </div>
      </div>

      {/* ── Stats row ────────────────────────────────────────────────────── */}
      <div className="relative flex items-center gap-1 mb-3.5">
        <div className="flex flex-1 items-center gap-2 rounded-xl border border-white/[0.06] bg-white/[0.03] px-3 py-2 transition-colors duration-200 group-hover:border-[#7C3AED]/15">
          <Layers className="h-3 w-3 text-[#5A5A72] shrink-0" strokeWidth={1.75} />
          <span className="text-[12px] font-medium text-[#8B8BA3] tabular-nums">{knowledgeCount}</span>
          <span className="text-[10px] text-[#3A3A52] uppercase tracking-[0.06em]">Knowledge</span>
        </div>

        <div className="flex flex-1 items-center gap-2 rounded-xl border border-white/[0.06] bg-white/[0.03] px-3 py-2 transition-colors duration-200 group-hover:border-[#7C3AED]/15">
          <MessageSquare className="h-3 w-3 text-[#5A5A72] shrink-0" strokeWidth={1.75} />
          <span className="text-[12px] font-medium text-[#8B8BA3] tabular-nums">{messageCount}</span>
          <span className="text-[10px] text-[#3A3A52] uppercase tracking-[0.06em]">Threads</span>
        </div>
      </div>

      {/* ── Footer ───────────────────────────────────────────────────────── */}
      <div className="relative mt-auto flex items-center justify-between border-t border-white/[0.05] pt-3">
        <span className="text-[11px] text-[#8B8BA3]">Active {lastActive}</span>

        <span className="flex items-center gap-1 text-[10px] text-[#5A5A72]">
          <span
            className="inline-block h-1.5 w-1.5 rounded-full"
            style={{ background: tier.color }}
          />
          {strength}% indexed
        </span>
      </div>
    </Link>
  );
}