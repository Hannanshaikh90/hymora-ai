export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">
          Welcome back 👋
        </h1>
        <p className="mt-2 text-sm text-zinc-400">
          Your AI dashboard is now running successfully.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-6">
          <p className="text-sm text-zinc-400">Total Requests</p>
          <h2 className="mt-3 text-3xl font-bold text-white">24.8K</h2>
        </div>

        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-6">
          <p className="text-sm text-zinc-400">Active Users</p>
          <h2 className="mt-3 text-3xl font-bold text-white">1,284</h2>
        </div>

        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-6">
          <p className="text-sm text-zinc-400">API Usage</p>
          <h2 className="mt-3 text-3xl font-bold text-white">87%</h2>
        </div>

        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-6">
          <p className="text-sm text-zinc-400">Revenue</p>
          <h2 className="mt-3 text-3xl font-bold text-white">$12,480</h2>
        </div>
      </div>
    </div>
  );
}