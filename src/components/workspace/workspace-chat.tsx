export function WorkspaceChat() {
  return (
    <div className="flex h-screen flex-col">
      
      <div className="border-b border-white/5 p-6">
        <h1 className="text-xl font-semibold text-white">
          Nike Marketing
        </h1>

        <p className="mt-1 text-sm text-zinc-500">
          AI Workspace That Remembers Everything
        </p>
      </div>

      <div className="flex-1 p-6">
        <div className="space-y-6">

          <div className="max-w-2xl rounded-3xl bg-white/[0.03] p-5">
            How should Nike target Gen Z consumers?
          </div>

          <div className="ml-auto max-w-3xl rounded-3xl border border-purple-500/10 bg-purple-500/10 p-5">
            Nike should focus on creator-led content,
            short-form video and community-driven campaigns.
          </div>

        </div>
      </div>

      <div className="border-t border-white/5 p-6">
        <div className="rounded-3xl border border-white/5 bg-[#101010] p-4">
          Ask anything about your workspace...
        </div>
      </div>

    </div>
  );
}