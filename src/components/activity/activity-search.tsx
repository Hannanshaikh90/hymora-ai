"use client";

export default function ActivitySearch() {
  return (
    <div className="mt-10">
      <input
        type="text"
        placeholder="Search conversations, memories, knowledge..."
        className="
          w-full
          rounded-2xl
          border
          border-white/5
          bg-[#0D0B14]
          px-5
          py-3.5
          text-sm
          text-white
          placeholder:text-[#6B6B85]
          outline-none
          transition
          focus:border-[#7C3AED]/50
        "
      />
    </div>
  );
}