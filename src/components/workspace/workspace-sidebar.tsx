export function WorkspaceSidebar() {
  return (
    <aside className="border-r border-white/5 bg-[#080808] p-4">
      
      <h2 className="mb-6 text-sm font-semibold text-zinc-400">
        WORKSPACES
      </h2>

      <div className="space-y-2">
        
        <div className="rounded-2xl border border-purple-500/20 bg-purple-500/10 p-4">
          <h3 className="font-medium text-white">
            Nike Marketing
          </h3>

          <p className="mt-1 text-xs text-zinc-500">
            Active Workspace
          </p>
        </div>

        <div className="rounded-2xl p-4 hover:bg-white/[0.03]">
          Adidas Campaign
        </div>

        <div className="rounded-2xl p-4 hover:bg-white/[0.03]">
          Study Notes
        </div>

      </div>

    </aside>
  );
}