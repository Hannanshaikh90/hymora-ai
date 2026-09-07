export default function MemorySkeleton() {
  return (
    <div className="space-y-8 animate-pulse">

      {/* Hero */}
      <div className="rounded-3xl border border-white/5 bg-[#0F0C16] p-8">
        <div className="h-8 w-56 rounded bg-white/5" />
        <div className="mt-4 h-4 w-[420px] max-w-full rounded bg-white/5" />

        <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-5">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="h-24 rounded-2xl bg-white/5"
            />
          ))}
        </div>
      </div>

      {/* Insights */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="h-36 rounded-2xl border border-white/5 bg-[#0F0C16]"
          />
        ))}
      </div>

      {/* Memories */}
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="h-28 rounded-2xl border border-white/5 bg-[#0F0C16]"
          />
        ))}
      </div>

    </div>
  );
}