import Link from "next/link";
import { Brain, Database, FileText, Plus, Sparkles } from "lucide-react";

export function EmptyWorkspaces() {
  return (
    <div className="relative rounded-[14px] border border-white/[0.06] bg-[#0D0B14] px-8 py-14 flex flex-col items-center text-center overflow-hidden">
      <div
        aria-hidden
        className="absolute -top-20 left-1/2 -translate-x-1/2 w-[420px] h-[260px] pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 60% 60% at 50% 0%, rgba(124,58,237,0.16) 0%, transparent 70%)",
        }}
      />
      <div
        aria-hidden
        className="absolute top-0 left-0 right-0 h-[1.5px]"
        style={{ background: "linear-gradient(90deg, transparent, #7C3AED, #A78BFA, transparent)" }}
      />

      <div className="relative flex items-center justify-center mb-6">
        <div
          aria-hidden
          className="absolute w-20 h-20 rounded-full"
          style={{ background: "radial-gradient(circle, rgba(124,58,237,0.18) 0%, transparent 75%)" }}
        />
        <div className="absolute -left-7 -top-1 w-7 h-7 rounded-[8px] bg-white/[0.03] border border-white/[0.07] flex items-center justify-center rotate-[-8deg]">
          <FileText className="w-3 h-3 text-[#5A5A72]" />
        </div>
        <div className="absolute -right-7 -top-2 w-7 h-7 rounded-[8px] bg-white/[0.03] border border-white/[0.07] flex items-center justify-center rotate-[8deg]">
          <Database className="w-3 h-3 text-[#5A5A72]" />
        </div>
        <div className="relative w-12 h-12 rounded-[12px] bg-[#7C3AED] flex items-center justify-center shadow-lg shadow-[#7C3AED]/30">
          <Brain className="w-5 h-5 text-white" />
        </div>
        <div className="absolute -right-1 -bottom-1 w-5 h-5 rounded-full bg-[#0D0B14] border border-[rgba(124,58,237,0.4)] flex items-center justify-center">
          <Sparkles className="w-2.5 h-2.5 text-[#A78BFA]" />
        </div>
      </div>

      <p className="text-[10px] font-medium uppercase tracking-[0.12em] text-[#7C3AED] mb-3">
        Begin Here
      </p>
      <p className="text-[16px] font-medium text-[#E5E5F0] mb-2 tracking-[-0.01em]">
        Spin up your first AI workspace
      </p>
      <p className="text-[12px] text-[#8B8BA3] max-w-sm leading-[1.65] mb-7">
        A workspace is where Hymora starts remembering — your files,
        conversations, and decisions, held in persistent memory and recalled
        the instant you need them again.
      </p>

      <Link
        href="/dashboard/projects/new"
        className="inline-flex items-center gap-1.5 text-[12px] font-medium text-white bg-[#7C3AED] px-4 h-9 rounded-[8px] hover:opacity-90 active:scale-[0.98] transition-all duration-150 shadow-md shadow-[#7C3AED]/25"
      >
        <Plus className="w-3.5 h-3.5" />
        Create Workspace
      </Link>

      <div className="relative flex items-center gap-5 mt-7 pt-6 border-t border-white/[0.05] w-full max-w-xs justify-center">
        <div className="flex items-center gap-1.5">
          <span className="w-1 h-1 rounded-full bg-[#A78BFA]" />
          <span className="text-[10px] text-[#5A5A72]">Persistent memory</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-1 h-1 rounded-full bg-[#A78BFA]" />
          <span className="text-[10px] text-[#5A5A72]">Always recalled</span>
        </div>
      </div>
    </div>
  );
}