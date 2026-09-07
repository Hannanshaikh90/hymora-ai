"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { UserDropdown } from "./UserDropdown";
import {
  Brain,
  MessageSquare,
  FolderOpen,
  Sparkles,
  Activity,
  Code2,
  ImageIcon,
  Music,
  Video,
  Settings,
  CreditCard,
  ChevronDown,
  Circle,
  Plus,
  Bell,
  Home,
  Layers,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  badge?: string | number;
}

interface NavGroup {
  label: string;
  items: NavItem[];
}

// ─── Navigation Config ────────────────────────────────────────────────────────

const coreNav: NavItem[] = [
  { label: "Ask Hymora", href: "/dashboard/conversation", icon: Brain },
  { label: "Memory", href: "/dashboard/memory", icon: Sparkles, badge: "12" },
  { label: "Activity", href: "/dashboard/activity", icon: Activity },
];

const toolsNav: NavGroup = {
  label: "Generate",
  items: [
    { label: "Image", href: "/dashboard/image", icon: ImageIcon },
    { label: "Code", href: "/dashboard/code", icon: Code2 },
    { label: "Video", href: "/dashboard/video", icon: Video },
    { label: "Music", href: "/dashboard/music", icon: Music },
  ],
};

const workspaceNav: NavGroup = {
  label: "Workspaces",
  items: [
    { label: "Projects", href: "/dashboard/projects", icon: FolderOpen },
  ],
};

const systemNav: NavItem[] = [
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
  { label: "Billing", href: "/dashboard/billing", icon: CreditCard },
];

// ─── NavLink ──────────────────────────────────────────────────────────────────

interface NavLinkProps {
  item: NavItem;
  isActive: boolean;
}

function NavLink({ item, isActive }: NavLinkProps) {
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      className={cn(
        "group relative flex items-center gap-2.5 rounded-lg px-3 py-[7px] text-[13px] font-medium transition-all duration-150",
        isActive
          ? "bg-[rgba(124,58,237,0.14)] text-[#E5E5F0]"
          : "text-[#5A5A72] hover:bg-[rgba(255,255,255,0.035)] hover:text-[#8B8BA3]"
      )}
    >
      {/* active indicator bar */}
      {isActive && (
        <span className="absolute left-0 top-1/2 h-[18px] w-[2px] -translate-y-1/2 rounded-r-full bg-[#7C3AED]" />
      )}

      {/* icon */}
      <Icon
        className={cn(
          "h-[15px] w-[15px] shrink-0 transition-colors duration-150",
          isActive
            ? "text-[#A78BFA]"
            : "text-[#3A3A52] group-hover:text-[#5A5A72]"
        )}
        strokeWidth={1.75}
      />

      <span className="flex-1 truncate tracking-[-0.01em]">{item.label}</span>

      {item.badge !== undefined && (
        <span
          className={cn(
            "ml-auto flex h-[17px] min-w-[17px] items-center justify-center rounded-full px-1.5 text-[10px] font-semibold tabular-nums",
            isActive
              ? "bg-[rgba(124,58,237,0.28)] text-[#A78BFA]"
              : "bg-[rgba(255,255,255,0.05)] text-[#5A5A72]"
          )}
        >
          {item.badge}
        </span>
      )}
    </Link>
  );
}

// ─── NavSection ───────────────────────────────────────────────────────────────

interface NavSectionProps {
  label: string;
  items: NavItem[];
  pathname: string;
}

function NavSection({ label, items, pathname }: NavSectionProps) {
  return (
    <div className="space-y-0.5">
      <p className="mb-1.5 px-3 text-[9.5px] font-semibold uppercase tracking-[0.14em] text-[#2E2E45]">
        {label}
      </p>
      {items.map((item) => (
        <NavLink key={item.href} item={item} isActive={pathname === item.href} />
      ))}
    </div>
  );
}

// ─── AIStatusPanel ────────────────────────────────────────────────────────────

const AI_STATUSES = [
  { label: "Memory Engine Active" },
  { label: "Knowledge Indexed" },
  { label: "Context Retrieval Ready" },
] as const;

function AIStatusPanel() {
  return (
    <div
      className="mx-2 mb-2 overflow-hidden rounded-xl p-3.5"
      style={{
        background:
          "linear-gradient(135deg, rgba(124,58,237,0.07) 0%, rgba(124,58,237,0.03) 100%)",
        border: "0.5px solid rgba(124,58,237,0.18)",
      }}
    >
      {/* header */}
      <div className="mb-3 flex items-center gap-2">
        <div
          className="flex h-5 w-5 items-center justify-center rounded-md"
          style={{ background: "rgba(124,58,237,0.2)" }}
        >
          <Brain className="h-3 w-3 text-[#A78BFA]" strokeWidth={1.75} />
        </div>
        <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#A78BFA]">
          AI Status
        </span>
      </div>

      <div className="space-y-2">
        {AI_STATUSES.map((s) => (
          <div key={s.label} className="flex items-center gap-2">
            <span className="relative flex h-1.5 w-1.5 shrink-0">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#639922] opacity-60" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#639922]" />
            </span>
            <span className="text-[11px] text-[#4A6824]">{s.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── WorkspaceInsight ─────────────────────────────────────────────────────────

function WorkspaceInsight() {
  const insights = [
    { label: "Workspaces", value: "4" },
    { label: "Knowledge", value: "128" },
    { label: "Memories", value: "1.2k" },
  ];

  return (
    <div
      className="mx-2 mb-2 overflow-hidden rounded-xl"
      style={{
        background: "rgba(255,255,255,0.02)",
        border: "0.5px solid rgba(255,255,255,0.05)",
      }}
    >
      {/* top gradient bar */}
      <div
        className="h-px w-full"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(124,58,237,0.4), transparent)",
        }}
      />

      <div className="flex divide-x divide-[rgba(255,255,255,0.04)] px-0">
        {insights.map((ins) => (
          <div key={ins.label} className="flex flex-1 flex-col items-center py-2.5">
            <span
              className="text-[15px] font-medium tabular-nums tracking-tight"
              style={{ color: "#E5E5F0", letterSpacing: "-0.02em" }}
            >
              {ins.value}
            </span>
            <span className="mt-0.5 text-[9.5px] font-medium uppercase tracking-[0.08em] text-[#3A3A52]">
              {ins.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── MemoryPulse ──────────────────────────────────────────────────────────────

function MemoryPulse() {
  return (
    <div
      className="relative mx-2 mb-2 overflow-hidden rounded-xl p-3"
      style={{
        background: "#0D0B14",
        border: "0.5px solid rgba(124,58,237,0.22)",
      }}
    >
      {/* glow blob */}
      <div
        className="pointer-events-none absolute -right-4 -top-4 h-16 w-16 rounded-full blur-xl"
        style={{ background: "rgba(124,58,237,0.18)" }}
      />

      <div className="relative">
        <div className="mb-2 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Brain className="h-3 w-3 text-[#A78BFA]" strokeWidth={1.75} />
            <span className="text-[11px] font-medium text-[#A78BFA]">
              Memory active
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Circle className="h-1.5 w-1.5 fill-[#639922] text-[#639922]" />
            <span className="text-[10px] font-medium" style={{ color: "#4A6824" }}>
              Live
            </span>
          </div>
        </div>

        <div
          className="h-[2px] w-full overflow-hidden rounded-full"
          style={{ background: "rgba(255,255,255,0.05)" }}
        >
          <div
            className="h-full rounded-full"
            style={{
              width: "68%",
              background: "linear-gradient(90deg, #7C3AED, #A78BFA)",
            }}
          />
        </div>

        <div className="mt-1.5 flex items-center justify-between">
          <span className="text-[10px] text-[#3D3D55]">1,284 memories indexed</span>
          <span className="text-[10px] font-semibold text-[#7C3AED]">68%</span>
        </div>
      </div>
    </div>
  );
}


// ─── Divider ─────────────────────────────────────────────────────────────────

function Divider() {
  return <div className="mx-3 h-px" style={{ background: "rgba(255,255,255,0.04)" }} />;
}

// ─── Root ─────────────────────────────────────────────────────────────────────

export const Sidebar = () => {
  const pathname = usePathname();

  return (
    <aside
      className="relative flex h-full w-[228px] shrink-0 flex-col overflow-hidden"
      style={{
        background:
          "linear-gradient(180deg, #0D0B14 0%, #0A0812 60%, #080610 100%)",
        borderRight: "0.5px solid rgba(255,255,255,0.06)",
      }}
    >
      {/* ambient glow — top-right */}
      <div
        className="pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full blur-3xl"
        style={{ background: "rgba(124,58,237,0.08)" }}
        aria-hidden="true"
      />

      {/* ── Brand header ──────────────────────────────────────────────────── */}
      <div
        className="relative flex h-[58px] shrink-0 items-center justify-between px-4"
        style={{ borderBottom: "0.5px solid rgba(255,255,255,0.05)" }}
      >
        <div className="flex items-center gap-2.5">
          <div
            className="flex h-8 w-8 items-center justify-center rounded-[9px]"
            style={{ background: "#7C3AED" }}
          >
            <Brain className="h-4 w-4 text-white" strokeWidth={1.75} />
          </div>

          <div className="flex flex-col leading-none">
            <span
              className="text-[14px] font-medium tracking-[-0.02em]"
              style={{ color: "#E5E5F0" }}
            >
              hymora
            </span>
            <span
              className="mt-0.5 text-[9px] font-medium uppercase tracking-[0.12em]"
              style={{ color: "#3D3D55" }}
            >
              AI Operating System
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button className="flex h-6 w-6 items-center justify-center rounded-md transition-all duration-150 hover:bg-[rgba(255,255,255,0.05)]">
            <Bell className="h-3.5 w-3.5 text-[#2E2E45] hover:text-[#5A5A72]" strokeWidth={1.75} />
          </button>
          <button className="flex h-6 w-6 items-center justify-center rounded-md transition-all duration-150 hover:bg-[rgba(255,255,255,0.05)]">
            <Plus className="h-3.5 w-3.5 text-[#2E2E45] hover:text-[#5A5A72]" strokeWidth={1.75} />
          </button>
        </div>
      </div>

      {/* ── Scrollable nav body ───────────────────────────────────────────── */}
      <nav className="flex-1 space-y-4 overflow-y-auto px-2 py-3 scrollbar-none">
        {/* Core */}
        <div className="space-y-0.5">
          {coreNav.map((item) => (
            <NavLink key={item.href} item={item} isActive={pathname === item.href} />
          ))}
        </div>

        <Divider />

        {/* Generate */}
        <NavSection label={toolsNav.label} items={toolsNav.items} pathname={pathname} />

        <Divider />

        {/* Workspaces */}
        <NavSection label={workspaceNav.label} items={workspaceNav.items} pathname={pathname} />

        <Divider />

        {/* System */}
        <NavSection label="System" items={systemNav} pathname={pathname} />
      </nav>

      {/* ── Bottom fixed zone ─────────────────────────────────────────────── */}
      <div className="shrink-0 space-y-2 pb-2 pt-2">
        {/* AI status */}
        <AIStatusPanel />

        {/* Workspace insight */}
        <WorkspaceInsight />

        {/* Memory bar */}
        <MemoryPulse />

        {/* User */}
        <UserDropdown />
      </div>
    </aside>
  );
};