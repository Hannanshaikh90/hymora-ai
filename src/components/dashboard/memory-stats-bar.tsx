interface MemoryStatsBarProps {
  workspaceCount: number;
  knowledgeCount: number;
  messageCount: number;
  memoryCount: number;
}

export function MemoryStatsBar({
  workspaceCount,
  knowledgeCount,
  messageCount,
  memoryCount,
}: MemoryStatsBarProps) {
  return (
    <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">

      <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-4">
        <p className="text-xs text-zinc-500">
          Memories
        </p>

        <h3 className="mt-2 text-2xl font-bold text-white">
          {memoryCount}
        </h3>
      </div>

      <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-4">
        <p className="text-xs text-zinc-500">
          Knowledge
        </p>

        <h3 className="mt-2 text-2xl font-bold text-white">
          {knowledgeCount}
        </h3>
      </div>

      <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-4">
        <p className="text-xs text-zinc-500">
          Messages
        </p>

        <h3 className="mt-2 text-2xl font-bold text-white">
          {messageCount}
        </h3>
      </div>

      <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-4">
        <p className="text-xs text-zinc-500">
          Workspaces
        </p>

        <h3 className="mt-2 text-2xl font-bold text-white">
          {workspaceCount}
        </h3>
      </div>

    </div>
  );
}