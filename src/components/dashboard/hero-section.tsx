import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MemoryStatsBar } from "./memory-stats-bar";

interface HeroSectionProps {
  workspaceCount: number;
  knowledgeCount: number;
  messageCount: number;
  memoryCount: number;
}

export function HeroSection({
  workspaceCount,
  knowledgeCount,
  messageCount,
  memoryCount,
}: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden rounded-[32px] border border-white/5 bg-[#0A0A0A] p-8">

      {/* Ambient Glow */}
      <div className="absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 rounded-full bg-purple-500/20 blur-[140px]" />

      <div className="relative">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">

          {/* Left Content */}
          <div className="max-w-3xl">
            <p className="mb-3 text-sm font-medium text-purple-400">
              Welcome back 👋
            </p>

            <h1 className="text-4xl font-bold tracking-tight text-white md:text-5xl xl:text-6xl">
              The AI Workspace
              <br />
              That Remembers Everything
            </h1>

            <p className="mt-5 max-w-2xl text-zinc-400">
              Your AI remembers conversations, knowledge, files and
              project context so you can continue work without losing
              momentum.
            </p>

            <MemoryStatsBar
              workspaceCount={workspaceCount}
              knowledgeCount={knowledgeCount}
              messageCount={messageCount}
              memoryCount={memoryCount}
            />
          </div>

          {/* Right Action */}
          <div className="flex items-start">
            <Button
              size="lg"
              className="rounded-2xl bg-purple-600 px-6 hover:bg-purple-500"
            >
              <Plus className="mr-2 h-4 w-4" />
              New Workspace
            </Button>
          </div>

        </div>
      </div>
    </section>
  );
}