interface SectionHeadingProps {
  title: string;
}

export function SectionHeading({
  title,
}: SectionHeadingProps) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-px bg-white/[0.05]" />

      <span className="text-[10px] font-semibold uppercase tracking-widest text-white/20">
        {title}
      </span>

      <div className="flex-1 h-px bg-white/[0.05]" />
    </div>
  );
}