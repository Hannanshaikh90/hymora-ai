import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { ArrowRight } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type Accent = "purple" | "blue" | "green";

interface QuickActionCardProps {
  href: string;
  icon: LucideIcon;
  title: string;
  description: string;
  accent?: Accent;
}

// ─── Accent map ───────────────────────────────────────────────────────────────

const accentMap: Record<Accent, { iconBg: string; iconColor: string }> = {
  purple: { iconBg: "rgba(124,58,237,0.15)", iconColor: "#A78BFA" },
  blue:   { iconBg: "rgba(56,138,221,0.12)",  iconColor: "#378ADD" },
  green:  { iconBg: "rgba(99,153,34,0.12)",   iconColor: "#639922" },
};

// ─── Component ────────────────────────────────────────────────────────────────

export function QuickActionCard({
  href,
  icon: Icon,
  title,
  description,
  accent = "purple",
}: QuickActionCardProps) {
  const { iconBg, iconColor } = accentMap[accent];

  return (
    <Link
      href={href}
      className="group relative flex flex-col h-full rounded-[12px] border border-white/[0.06] bg-[#0D0B14] p-5 hover:border-[rgba(124,58,237,0.25)] transition-all duration-200 overflow-hidden"
    >
      {/* Hover glow */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-400 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at 50% 0%, rgba(124,58,237,0.06) 0%, transparent 65%)",
        }}
      />

      <div
        className="w-9 h-9 rounded-[8px] flex items-center justify-center mb-4"
        style={{ background: iconBg }}
      >
        <Icon className="w-4 h-4" style={{ color: iconColor }} />
      </div>

      <h3 className="text-[13px] font-medium text-[#E5E5F0] mb-1.5">{title}</h3>
      <p className="text-[12px] text-[#8B8BA3] leading-[1.6] mb-4">{description}</p>

      <div className="mt-auto flex items-center gap-1 text-[11px] font-medium text-[#A78BFA] opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all duration-150">
        Open
        <ArrowRight className="w-3 h-3" />
      </div>
    </Link>
  );
}