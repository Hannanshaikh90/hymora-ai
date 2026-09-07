interface StatsCardProps {
  label: string;
  value: string;
}

export function StatsCard({
  label,
  value,
}: StatsCardProps) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
      <p className="text-xs text-white/40">
        {label}
      </p>

      <h3 className="mt-2 text-2xl font-semibold text-white">
        {value}
      </h3>
    </div>
  );
}