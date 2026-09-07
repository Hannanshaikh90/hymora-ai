import {
  MessageSquare,
  Sparkles,
  Code2,
  PenSquare,
  Lightbulb,
} from "lucide-react";

const suggestions = [
  {
    icon: PenSquare,
    title:
      "Write a blog post",
    description:
      "Generate engaging content ideas and articles.",
  },
  {
    icon: Code2,
    title:
      "Generate code",
    description:
      "Get help with coding, debugging, and development.",
  },
  {
    icon: Lightbulb,
    title:
      "Brainstorm ideas",
    description:
      "Discover creative ideas for projects and business.",
  },
];

export function EmptyConversation() {
  return (
    <div className="flex flex-col items-center justify-center text-center py-24">

      {/* Icon */}
      <div className="relative mb-8">

        <div className="absolute inset-0 rounded-full bg-violet-500/20 blur-2xl" />

        <div className="relative flex items-center justify-center w-20 h-20 rounded-3xl border border-white/[0.08] bg-white/[0.04] backdrop-blur-xl shadow-2xl shadow-violet-500/10">
          <MessageSquare className="w-8 h-8 text-violet-400" />
        </div>
      </div>

      {/* Heading */}
      <div className="max-w-2xl">

        <div className="inline-flex items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/10 px-3 py-1 text-[11px] font-medium text-violet-300 mb-5">
          <Sparkles className="w-3 h-3" />
          AI Powered Assistant
        </div>

        <h2 className="text-4xl font-bold tracking-tight text-white">
          Start a conversation
        </h2>

        <p className="text-sm md:text-base text-white/45 mt-4 leading-7">
          Ask Nexus AI anything — writing, coding, research,
          brainstorming, productivity, and more.
        </p>
      </div>

      {/* Suggestions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-12 w-full max-w-5xl">

        {suggestions.map(
          (item, index) => (
            <button
              key={index}
              className="group text-left rounded-3xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-xl p-5 hover:bg-white/[0.05] transition-all duration-200 shadow-xl shadow-black/10"
            >

              <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 border border-white/[0.08] mb-4">
                <item.icon className="w-5 h-5 text-violet-300" />
              </div>

              <h3 className="text-sm font-semibold text-white">
                {item.title}
              </h3>

              <p className="text-xs text-white/40 mt-2 leading-6">
                {item.description}
              </p>

            </button>
          )
        )}
      </div>
    </div>
  );
}