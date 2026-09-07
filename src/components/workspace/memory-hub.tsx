interface MemoryHubProps {
  goal: string;
  summary: string;
  knowledgeCount: number;
}

export function MemoryHub({
  goal,
  summary,
  knowledgeCount,
}: MemoryHubProps) {
  return (

    
    <aside className="h-full border-l border-white/5 bg-[#09090B]">
      <div className="flex h-full flex-col">

        <div className="bg-red-600 p-4 text-white text-center">
  TEST MEMORY HUB
</div>

        {/* Header */}
        <div className="border-b border-white/5 px-6 py-6">
          <h2 className="text-lg font-semibold text-white">
            Memory Hub
          </h2>

          <p className="mt-1 text-sm text-zinc-500">
            Everything this workspace remembers.
          </p>
        </div>

        {/* Content */}
        <div className="flex-1 space-y-8 overflow-y-auto px-6 py-6">

          {/* Goal */}
          <section>
            <p className="mb-3 text-xs font-medium uppercase tracking-wider text-zinc-500">
              Goal
            </p>

            <div className="rounded-xl border border-white/5 bg-[#111111] p-4">
              <p className="text-sm leading-6 text-white">
              {goal || "No goal set yet."}
              </p>
            </div>
          </section>

          {/* Summary */}
          <section>
            <p className="mb-3 text-xs font-medium uppercase tracking-wider text-zinc-500">
              Summary
            </p>

            <div className="rounded-xl border border-white/5 bg-[#111111] p-4">
              <p className="text-sm leading-6 text-zinc-300">
               {summary || "No project summary available yet."}
              </p>
            </div>
          </section>

          {/* Knowledge */}
          <section>
            <div className="mb-3 flex items-center justify-between">
              <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">
                Knowledge
              </p>

              <span className="text-xs text-zinc-500">
                {knowledgeCount} Sources
              </span>
            </div>

            <div className="rounded-xl border border-white/5 bg-[#111111] p-4">
              <p className="text-sm text-zinc-300">
                Documents, PDFs and notes indexed for this workspace.
              </p>
            </div>
          </section>

        </div>
      </div>
    </aside>
  );
}