import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import { Brain } from "lucide-react";


import { MemoryDrawer } from "@/components/projects/MemoryDrawer";
import { ProjectWorkspaceClient } from "@/components/projects/ProjectWorkspaceClient";

// ─── Supabase ─────────────────────────────────────────────────────────────────

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// ─── Types ────────────────────────────────────────────────────────────────────

interface ProjectPageProps {
  params: Promise<{ id: string }>;
}

// ─── Not found ────────────────────────────────────────────────────────────────

function WorkspaceNotFound() {
  return (
    <div className="flex h-screen items-center justify-center bg-[#05030A]">
      <div className="max-w-sm rounded-[10px] border border-[rgba(226,75,74,0.2)] bg-[rgba(226,75,74,0.06)] px-6 py-8 text-center">
        <div className="mb-3 flex justify-center">
          <div className="flex h-10 w-10 items-center justify-center rounded-[10px] bg-[rgba(226,75,74,0.12)]">
            <Brain className="h-5 w-5 text-[#E24B4A]" strokeWidth={1.75} />
          </div>
        </div>
        <h1 className="text-[15px] font-medium text-[#E5E5F0]">
          Workspace not found
        </h1>
        <p className="mt-1.5 text-[12px] leading-relaxed text-[#5A5A72]">
          This workspace does not exist or you do not have access.
        </p>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { userId } = await auth();

console.log("CLERK USER:", userId);

const { id } = await params;

console.log("PROJECT ID:", id);

const { data: project, error } = await supabase
  .from("projects")
  .select("*")
  .eq("id", id)
  .eq("user_id", userId)
  .single();

console.log("PROJECT:", project);
console.log("ERROR:", error);

  if (!project) return <WorkspaceNotFound />;

  return (
 <div className="h-screen overflow-hidden bg-[#05030A]">
  <ProjectWorkspaceClient project={project} />
</div>



    
  );
}