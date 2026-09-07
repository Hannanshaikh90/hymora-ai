export default function ActivitySkeleton() {
  return (
    <div className="space-y-8 animate-pulse">

      {/* Hero */}
      <div className="rounded-3xl border border-white/5 bg-[#0D0B14] p-8">
        <div className="h-8 w-52 rounded bg-white/5" />
        <div className="mt-4 h-4 w-96 max-w-full rounded bg-white/5" />

        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[...Array(4)].map((_, index) => (
            <div
              key={index}
              className="h-24 rounded-2xl bg-white/5"
            />
          ))}
        </div>
      </div>

      {/* AI Highlights */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[...Array(4)].map((_, index) => (
          <div
            key={index}
            className="h-36 rounded-2xl border border-white/5 bg-[#0D0B14]"
          />
        ))}
      </div>

      {/* Timeline */}
      <div className="grid gap-8 lg:grid-cols-[1fr_320px]">

        <div className="space-y-4">
          {[...Array(6)].map((_, index) => (
            <div
              key={index}
              className="h-24 rounded-2xl border border-white/5 bg-[#0D0B14]"
            />
          ))}
        </div>

        <div className="space-y-4">
          {[...Array(4)].map((_, index) => (
            <div
              key={index}
              className="h-24 rounded-2xl border border-white/5 bg-[#0D0B14]"
            />
          ))}
        </div>

      </div>

    </div>
  );
}