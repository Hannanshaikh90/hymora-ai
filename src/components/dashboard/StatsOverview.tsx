import { StatsCard } from "@/components/dashboard/StatsCard";

const stats = [
  {
    label: "Active Plan",
    value: "Pro",
  },
  {
    label: "AI Generations",
    value: "1,248",
  },
  {
    label: "Credits Remaining",
    value: "892",
  },
];

export function StatsOverview() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      {stats.map((stat) => (
        <StatsCard
          key={stat.label}
          label={stat.label}
          value={stat.value}
        />
      ))}
    </div>
  );
}