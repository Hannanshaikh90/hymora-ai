"use client";

interface StatItem {
  label: string;
  value: string;
  delta?: string;
  positive?: boolean;
}

const stats: StatItem[] = [
  { label: "Generations", value: "1,248", delta: "+12%", positive: true },
  { label: "API Calls", value: "4.3k", delta: "+8%", positive: true },
  { label: "Avg. Latency", value: "340ms", delta: "-5%", positive: true },
  { label: "Active Plan", value: "Free", },
];

export const StatsBar = () => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="flex flex-col gap-1 rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3.5"
        >
          <p className="text-[11px] font-medium text-white/30 uppercase tracking-wider">
            {stat.label}
          </p>
          <div className="flex items-end gap-2">
            <span className="text-[22px] font-semibold tracking-tight text-white">
              {stat.value}
            </span>
            {stat.delta && (
              <span
                className={`text-[11px] font-medium mb-0.5 ${
                  stat.positive ? "text-emerald-400" : "text-red-400"
                }`}
              >
                {stat.delta}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};