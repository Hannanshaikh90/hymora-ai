import type { LucideIcon } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type Accent = "purple" | "blue" | "amber" | "green";

interface StatsCardProps {
  icon: LucideIcon;
  label: string;
  value: number;
  accent?: Accent;
}

// ─── Accent map ───────────────────────────────────────────────────────────────

const accentMap: Record<
  Accent,
  { iconBg: string; iconColor: string; dotColor: string }
> = {
  purple: {
    iconBg: "rgba(124,58,237,0.15)",
    iconColor: "#A78BFA",
    dotColor: "#7C3AED",
  },
  blue: {
    iconBg: "rgba(56,138,221,0.12)",
    iconColor: "#378ADD",
    dotColor: "#378ADD",
  },
  amber: {
    iconBg: "rgba(186,117,23,0.12)",
    iconColor: "#BA7517",
    dotColor: "#BA7517",
  },
  green: {
    iconBg: "rgba(99,153,34,0.12)",
    iconColor: "#639922",
    dotColor: "#639922",
  },
};

// ─── Component ────────────────────────────────────────────────────────────────

export function StatsCard({
  icon: Icon,
  label,
  value,
  accent = "purple",
}: StatsCardProps) {
  const { iconBg, iconColor, dotColor } = accentMap[accent];

  return (
    <div className="group relative rounded-[12px] border border-white/[0.06] bg-[#0D0B14] p-4 hover:border-white/[0.1] transition-all duration-200 overflow-hidden">
      {/* Hover glow */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-400 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at 50% 0%, rgba(124,58,237,0.05) 0%, transparent 65%)",
        }}
      />

      <div className="flex items-start justify-between mb-4">
        <div
          className="w-8 h-8 rounded-[8px] flex items-center justify-center"
          style={{ background: iconBg }}
        >
          <Icon className="w-3.5 h-3.5" style={{ color: iconColor }} />
        </div>

        {/* Live indicator */}
        <div className="flex items-center gap-1.5">
          <span
            className="w-1.5 h-1.5 rounded-full"
            style={{ background: dotColor }}
          />
          <span className="text-[10px] text-[#5A5A72]">Live</span>
        </div>
      </div>

      <p className="text-[22px] font-medium tracking-[-0.02em] text-[#E5E5F0] mb-0.5">
        {value.toLocaleString()}
      </p>
      <p className="text-[11px] text-[#5A5A72]">{label}</p>
    </div>
  );
}