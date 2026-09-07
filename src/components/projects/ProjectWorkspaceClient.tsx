"use client";

import { useState } from "react";
import { Brain } from "lucide-react";

import { MemoryDrawer } from "./MemoryDrawer";
import { ProjectChat } from "./ProjectChat";

interface ProjectWorkspaceClientProps {
  project: any;
}

export function ProjectWorkspaceClient({
  project,
}: ProjectWorkspaceClientProps) {
  const [memoryOpen, setMemoryOpen] = useState(false);

  return (
  <div className="flex h-screen flex-col bg-[#05030A]">
  <div className="flex h-[56px] items-center justify-between border-b border-white/5 px-6">
    <div className="min-w-0">

  <h1 className="truncate text-[16px] font-semibold text-white">
    {project.title}
  </h1>

  <p className="mt-1 truncate text-[12px] text-[#8B8BA3]">
    {project.project_goal?.trim()
      ? project.project_goal
      : "No project goal yet"}
  </p>

</div>

    <button
      onClick={() => setMemoryOpen(true)}
      className="flex items-center gap-2 rounded-[8px] border border-[rgba(124,58,237,0.25)] bg-[rgba(124,58,237,0.08)] px-3 py-1.5 text-[12px] font-medium text-[#A78BFA] hover:bg-[rgba(124,58,237,0.14)]"
    >
      <>
  <Brain
    className="h-4 w-4"
    strokeWidth={1.75}
  />
  Memory
</>
    </button>
  </div>

 <div className="flex-1 overflow-hidden">
  <ProjectChat
    projectId={project.id}
    projectName={project.title}
    onOpenMemoryDrawer={() => setMemoryOpen(true)}
  />
</div>

  <MemoryDrawer
    open={memoryOpen}
    onClose={() => setMemoryOpen(false)}
    projectId={project.id}
    initialGoal={project.project_goal || ""}
  />
</div>
  );
}