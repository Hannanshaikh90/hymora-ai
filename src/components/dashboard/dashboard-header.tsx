import { UserButton } from "@clerk/nextjs";
import { Brain, Bell, Sparkles, Database, Activity, Radio } from "lucide-react";
import Link from "next/link";

interface DashboardHeaderProps {
  workspaceCount: number;
}

export function DashboardHeader({ workspaceCount }: DashboardHeaderProps) {
  const hasWorkspaces = workspaceCount > 0;

  return (
    <header>
      {/* Topbar */}
      <div className="flex items-center justify-between mb-8">
        <Link href="/dashboard" className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-[8px] bg-[#7C3AED] flex items-center justify-center shadow-lg shadow-[#7C3AED]/30">
            <Brain className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="text-[15px] font-medium tracking-[-0.02em] text-[#E5E5F0]">
            Hymora
          </span>
        </Link>

        <div className="flex items-center gap-3">
          <button
            aria-label="Notifications"
            className="w-8 h-8 rounded-[8px] border border-white/[0.07] bg-white/[0.02] flex items-center justify-center text-[#5A5A72] hover:text-[#8B8BA3] hover:border-white/[0.12] transition-all duration-150"
          >
            <Bell className="w-3.5 h-3.5" />
          </button>
          <UserButton
            appearance={{
              elements: {
                avatarBox: "w-8 h-8 rounded-[8px]",
              },
            }}
          />
        </div>
      </div>

      {/* Hero / Intelligence Surface */}
      <div className="rounded-[14px] border border-white/[0.06] bg-[#0D0B14] relative overflow-hidden">
        {/* Top gradient line */}
        <div
          aria-hidden
          className="absolute top-0 left-0 right-0 h-[1.5px]"
          style={{
            background:
              "linear-gradient(90deg, #7C3AED, #A78BFA, transparent)",
          }}
        />
        {/* Ambient glows */}
        <div
          aria-hidden
          className="absolute -top-16 -right-10 w-[320px] h-[280px] pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 60% 55% at 80% 20%, rgba(124,58,237,0.16) 0%, transparent 70%)",
          }}
        />
        <div
          aria-hidden
          className="absolute bottom-0 left-0 w-[260px] h-[160px] pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 60% 60% at 0% 100%, rgba(124,58,237,0.07) 0%, transparent 70%)",
          }}
        />

        <div className="relative px-7 py-6">
          <div className="flex items-start justify-between gap-6 flex-wrap">
            <div className="flex-1 min-w-[260px]">
              <div className="inline-flex items-center gap-1.5 mb-3 px-2.5 py-1 rounded-full bg-[rgba(124,58,237,0.12)] border border-[#5B21B6]/50">
                <Radio className="w-2.5 h-2.5 text-[#A78BFA]" />
                <span className="text-[10px] font-medium uppercase tracking-[0.12em] text-[#A78BFA]">
                  System Online
                </span>
              </div>
              <h1 className="text-[clamp(22px,3vw,28px)] font-medium tracking-[-0.02em] text-[#E5E5F0] mb-2">
                Your knowledge, always live.
              </h1>
              <p className="text-[13px] text-[#8B8BA3] leading-[1.6] max-w-lg">
                Hymora is holding your context across every workspace —
                ready to recall, reason, and act the moment you need it.
              </p>
            </div>

            <div className="flex items-center gap-2.5 pt-1">
              <div className="w-9 h-9 rounded-[10px] bg-[rgba(124,58,237,0.15)] border border-[rgba(124,58,237,0.3)] flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-[#A78BFA]" />
              </div>
              <div className="text-right">
                <p className="text-[11px] font-medium text-[#E5E5F0] leading-tight">
                  Memory Engine
                </p>
                <p className="text-[10px] text-[#5A5A72] leading-tight">
                  Active &amp; syncing
                </p>
              </div>
            </div>
          </div>

          {/* Intelligence strip */}
          <div className="mt-6 pt-5 border-t border-white/[0.06] grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="flex items-center gap-3 rounded-[10px] border border-white/[0.06] bg-white/[0.02] px-3.5 py-3">
              <div className="w-8 h-8 rounded-[8px] bg-[rgba(124,58,237,0.15)] flex items-center justify-center shrink-0">
                <Database className="w-3.5 h-3.5 text-[#A78BFA]" />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] text-[#5A5A72] leading-tight">
                  Workspaces
                </p>
                <p className="text-[13px] font-medium text-[#E5E5F0] leading-tight truncate">
                  {hasWorkspaces
                    ? `${workspaceCount} active`
                    : "None yet"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-[10px] border border-white/[0.06] bg-white/[0.02] px-3.5 py-3">
              <div className="w-8 h-8 rounded-[8px] bg-[rgba(124,58,237,0.15)] flex items-center justify-center shrink-0">
                <Brain className="w-3.5 h-3.5 text-[#A78BFA]" />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] text-[#5A5A72] leading-tight">
                  Memory Layer
                </p>
                <p className="text-[13px] font-medium text-[#E5E5F0] leading-tight truncate">
                  Persistent &amp; indexed
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-[10px] border border-white/[0.06] bg-white/[0.02] px-3.5 py-3">
              <div className="w-8 h-8 rounded-[8px] bg-[rgba(99,153,34,0.12)] flex items-center justify-center shrink-0">
                <Activity className="w-3.5 h-3.5 text-[#639922]" />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] text-[#5A5A72] leading-tight">
                  System Status
                </p>
                <p className="text-[13px] font-medium text-[#E5E5F0] leading-tight truncate">
                  All systems normal
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}