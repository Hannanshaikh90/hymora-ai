"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Brain, X } from "lucide-react";

import { ProjectGoal } from "./ProjectGoal";
import { ProjectKnowledge } from "./ProjectKnowledge";
import { ProjectFiles } from "./ProjectFiles";

// ─── Types ────────────────────────────────────────────────────────────────────

interface MemoryDrawerProps {
  open: boolean;
  onClose: () => void;

  projectId: string;
  initialGoal: string;
  summary?: string;
}

// ─── Section wrapper ──────────────────────────────────────────────────────────

interface SectionProps {
  title: string;
  children: React.ReactNode;
}

function Section({ title, children }: SectionProps) {
  return (
    <div>
      <h3 className="mb-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#8B8BA3]">
        {title}
      </h3>
      <div className="rounded-[16px] border border-[rgba(255,255,255,0.06)] bg-[#0F0D17] p-5 shadow-[0_8px_24px_rgba(0,0,0,0.18)]">
        {children}
      </div>
    </div>
  );
}

// ─── Root component ───────────────────────────────────────────────────────────

export function MemoryDrawer({
  open,
  onClose,
  projectId,
  initialGoal,
  summary,
}: MemoryDrawerProps) {

const [mounted, setMounted] = useState(false);

useEffect(() => {
  setMounted(true);
}, []);

  if (!mounted) return null;

return createPortal(
  <>
      

      {/* Backdrop */}
      {open && (
        <div
        onClick={() => onClose()}
          className="fixed inset-0 z-[99998] bg-black/55 transition-opacity duration-300"
          style={{
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
          }}
        />
      )}

      {/* Drawer */}
      <div
        className={`
  fixed inset-y-0 right-0 z-[99999] flex w-full max-w-[480px] flex-col
          border-l border-[rgba(255,255,255,0.06)]
          bg-[#0D0B14]
         transition-all duration-300 ease-out
          ${open ? "translate-x-0" : "translate-x-full"}
        `}
      >
        {/* ── Header ─────────────────────────────────────────────────────── */}
        <div className="sticky top-0 z-10 flex shrink-0 items-start justify-between gap-4 border-b border-white/[0.05] bg-[#0D0B14]/95 px-6 pb-5 pt-6 backdrop-blur-xl">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px] bg-[rgba(124,58,237,0.14)]">
              <Brain className="h-4 w-4 text-[#A78BFA]" strokeWidth={1.75} />
            </div>
            <div>
              <h2 className="text-[17px] font-semibold tracking-[-0.02em] text-[#E5E5F0]">
                Workspace Memory
              </h2>

              <p className="mt-1 text-[12px] leading-relaxed text-[#7A7A90]">
                Goals, knowledge, and files available during AI conversations.
              </p>
            </div>
          </div>

          <button
          onClick={() =>onClose()}
            title="Close"
            aria-label="Close memory hub"
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[#5A5A72] transition-colors duration-150 hover:bg-[rgba(124,58,237,0.10)] hover:text-[#A78BFA]"
          >
            <X className="h-4 w-4" strokeWidth={2} />
          </button>
        </div>

        {/* ── Scrollable body ─────────────────────────────────────────────── */}
        <div className="flex-1 space-y-6 overflow-y-auto px-6 py-6 pb-10">
          {/* Workspace Goal */}
          <Section title="Workspace Goal">
            <ProjectGoal projectId={projectId} initialGoal={initialGoal} />
          </Section>


          {/* Knowledge Base */}
          <Section title="Recent Knowledge">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-[12px] text-[#7A7A90]">
                Latest workspace knowledge
              </p>

              <span className="text-[11px] text-[#5A5A72]">
                Latest
              </span>
            </div>

            <ProjectKnowledge projectId={projectId} />
          </Section>

          {/* Indexed Files */}
          <Section title="Recent Files">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-[12px] text-[#7A7A90]">
                Files available to the AI
              </p>

              <span className="text-[11px] text-[#5A5A72]">
                Latest
              </span>
            </div>

            <ProjectFiles projectId={projectId} />
          </Section>
        </div>
      </div>
       </>,
    document.body
  );
}