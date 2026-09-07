import Link from "next/link";
import { NewWorkspaceButton } from "@/components/projects/NewWorkspaceButton";
import { WorkspaceCard } from "@/components/dashboard/workspace-card";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import { isProUser } from "@/lib/subscription";
import { FREE_LIMITS } from "@/config/usage";
import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  ArrowUpDown,

  Brain,
  Clock,
  MessageSquare,
  MessageSquarePlus,
  Plus,
  Search,
  Sparkles,
  Upload,
} from "lucide-react";


const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// ─── Types ────────────────────────────────────────────────────────────────────
// Permissive shape — the query below still selects "*", this just documents the
// fields the UI reads. Missing columns simply render their fallback.

interface ProjectRow {
  id: string;
  title: string;
  description?: string | null;
  project_goal?: string | null;
  message_count?: number | null;
  memory_count?: number | null;
  knowledge_count?: number | null;
  updated_at?: string | null;
  created_at?: string | null;
}

type SortKey = "recent" | "newest" | "oldest" | "alphabetical";

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "recent", label: "Recently Active" },
  { value: "newest", label: "Newest" },
  { value: "oldest", label: "Oldest" },
  { value: "alphabetical", label: "Alphabetical" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatActivityLabel(dateString?: string | null): string {
  if (!dateString) return "No activity yet";
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return "No activity yet";

  const diffMinutes = Math.floor((Date.now() - date.getTime()) / 60000);
  if (diffMinutes < 60) return "Last active recently";

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `Updated ${diffHours}h ago`;

  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 30) return `Updated ${diffDays}d ago`;

  const diffMonths = Math.floor(diffDays / 30);
  if (diffMonths < 12) return `Updated ${diffMonths}mo ago`;

  return `Updated ${Math.floor(diffMonths / 12)}y ago`;
}

function getTimestamp(project: ProjectRow, field: "updated_at" | "created_at"): number {
  const value = project[field];
  if (!value) return 0;
  const time = new Date(value).getTime();
  return Number.isNaN(time) ? 0 : time;
}

function filterProjects(list: ProjectRow[], query: string): ProjectRow[] {
  if (!query.trim()) return list;
  const needle = query.trim().toLowerCase();
  return list.filter((project) => {
    const title = project.title?.toLowerCase() ?? "";
    const goal = project.project_goal?.toLowerCase() ?? "";
    return title.includes(needle) || goal.includes(needle);
  });
}

function sortProjects(list: ProjectRow[], sort: SortKey): ProjectRow[] {
  const sorted = [...list];
  switch (sort) {
    case "newest":
      return sorted.sort(
        (a, b) => getTimestamp(b, "created_at") - getTimestamp(a, "created_at")
      );
    case "oldest":
      return sorted.sort(
        (a, b) => getTimestamp(a, "created_at") - getTimestamp(b, "created_at")
      );
    case "alphabetical":
      return sorted.sort((a, b) => a.title.localeCompare(b.title));
    case "recent":
    default:
      return sorted.sort((a, b) => {
        const aTime = getTimestamp(a, "updated_at") || getTimestamp(a, "created_at");
        const bTime = getTimestamp(b, "updated_at") || getTimestamp(b, "created_at");
        return bTime - aTime;
      });
  }
}

function getMostRecentlyActive(list: ProjectRow[]): ProjectRow | null {
  if (list.length === 0) return null;
  return sortProjects(list, "recent")[0];
}

function buildQueryString(params: Record<string, string>): string {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value) search.set(key, value);
  });
  const result = search.toString();
  return result ? `?${result}` : "";
}



// ─── AI status pill ───────────────────────────────────────────────────────────

interface StatusPillProps {
  active: boolean;
  label: string;
}

function StatusPill({ active, label }: StatusPillProps) {
  return (
    <span
      className={
        active
          ? "inline-flex items-center gap-1.5 rounded-full border border-[rgba(99,153,34,0.3)] bg-[rgba(99,153,34,0.12)] px-2.5 py-1 text-[11px] font-medium text-[#639922]"
          : "inline-flex items-center gap-1.5 rounded-full border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] px-2.5 py-1 text-[11px] font-medium text-[#5A5A72]"
      }
    >
      <span
        className={`h-1.5 w-1.5 shrink-0 rounded-full ${active ? "bg-[#639922]" : "bg-[#5A5A72]"
          }`}
      />
      {label}
    </span>
  );
}

interface ToolbarProps {
  query: string;
  sort: SortKey;
}

function WorkspaceToolbar({ query, sort }: ToolbarProps) {
  return (
    <form
      method="GET"
      className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center"
    >
      <div className="relative flex-1">
        <Search
          className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#5A5A72]"
          strokeWidth={1.75}
        />

        <input
          type="text"
          name="q"
          defaultValue={query}
          placeholder="Search workspaces..."
          className="w-full rounded-[14px] border border-[rgba(255,255,255,0.06)] bg-[#11101A] py-3 pl-11 pr-4 text-[14px] text-[#E5E5F0] placeholder:text-[#6F6B84] shadow-[0_0_0_1px_rgba(255,255,255,0.02)] transition-all duration-200 outline-none focus:border-[#7C3AED] focus:bg-[#151320] focus:shadow-[0_0_0_4px_rgba(124,58,237,0.12)]" />
      </div>

      <div className="relative">
        <ArrowUpDown
          className="pointer-events-none absolute left-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#5A5A72]"
          strokeWidth={1.75}
        />

        <select
          name="sort"
          defaultValue={sort}
          className="appearance-none rounded-[14px] border border-[rgba(255,255,255,0.06)] bg-[#11101A] py-3 pl-10 pr-10 text-[14px] text-[#E5E5F0] shadow-[0_0_0_1px_rgba(255,255,255,0.02)] transition-all duration-200 outline-none focus:border-[#7C3AED] focus:bg-[#151320] focus:shadow-[0_0_0_4px_rgba(124,58,237,0.12)] sm:w-[210px]">
          {SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </form>
  );
}

interface NoResultsStateProps {
  query: string;
}

function NoResultsState({ query }: NoResultsStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-[20px] border border-dashed border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.015)] px-8 py-16 text-center">
      <Search
        className="mb-4 h-8 w-8 text-[#A78BFA]"
        strokeWidth={1.75}
      />

      <h3 className="text-lg font-medium text-[#E5E5F0]">
        No workspaces found
      </h3>

      <p className="mt-2 text-[13px] text-[#5A5A72]">
        No workspace matches "<span className="text-[#E5E5F0]">{query}</span>"
      </p>
    </div>
  );
}

// ─── Empty state (no workspaces at all) ──────────────────────────────────────

function EmptyWorkspaceState() {
  return (
    <div className="relative overflow-hidden rounded-[24px] border border-[rgba(255,255,255,0.06)] bg-[#0D0B14] px-8 py-20 text-center">
      <div className="pointer-events-none absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#7C3AED] opacity-[0.12] blur-[110px]" />

      <div className="relative mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[rgba(124,58,237,0.12)]">
        <Sparkles className="h-7 w-7 text-[#A78BFA]" strokeWidth={1.5} />
      </div>

      <h2 className="relative mt-6 text-[22px] font-medium tracking-[-0.015em] text-[#E5E5F0]">
        Create your first workspace
      </h2>

      <p className="relative mx-auto mt-3 max-w-md text-[13.5px] leading-relaxed text-[#5A5A72]">
        Create a workspace to organize your AI conversations, knowledge, and
        long-term memory in one dedicated place.
      </p>

      <Link
        href="/dashboard/projects/new"
        className="relative mt-8 inline-flex items-center gap-2 rounded-[10px] bg-[#7C3AED] px-5 py-2.5 text-[13px] font-medium text-white transition-all duration-150 hover:opacity-90 active:scale-[0.98]"
      >
        <Plus className="h-[15px] w-[15px]" strokeWidth={2} />
        Create Workspace
      </Link>

      <div className="relative mt-12 grid w-full max-w-[640px] grid-cols-1 gap-4 sm:mx-auto sm:grid-cols-3">
        <OnboardingStep
          icon={Plus}
          step="1"
          title="Create"
          description="Create a workspace for your project."
        />
        <OnboardingStep
          icon={Upload}
          step="2"
          title="Upload"
          description="Add documents and knowledge."
        />
        <OnboardingStep
          icon={MessageSquarePlus}
          step="3"
          title="Chat"
          description="Start chatting with persistent memory."
        />
      </div>
    </div>
  );
}
interface OnboardingStepProps {
  icon: React.ElementType;
  step: string;
  title: string;
  description: string;
}

function OnboardingStep({
  icon: Icon,
  step,
  title,
  description,
}: OnboardingStepProps) {
  return (
    <div className="flex flex-col items-center rounded-[14px] border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.015)] p-4 text-center">
      <div className="flex h-9 w-9 items-center justify-center rounded-[9px] bg-[rgba(124,58,237,0.1)]">
        <Icon
          className="h-4 w-4 text-[#A78BFA]"
          strokeWidth={1.75}
        />
      </div>

      <p className="mt-3 text-[11px] font-medium uppercase tracking-[0.08em] text-[#7C3AED]">
        Step {step}
      </p>

      <p className="mt-1 text-[13px] font-medium text-[#E5E5F0]">
        {title}
      </p>

      <p className="mt-1 text-[11.5px] leading-relaxed text-[#5A5A72]">
        {description}
      </p>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

interface ProjectsPageProps {
  searchParams: Promise<{
    q?: string;
    sort?: string;
  }>;
}

export default async function ProjectsPage({
  searchParams,
}: ProjectsPageProps) {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const resolvedParams = await searchParams;

  const query = resolvedParams.q ?? "";

  const sort: SortKey = (
    ["recent", "newest", "oldest", "alphabetical"] as const
  ).includes(resolvedParams.sort as SortKey)
    ? (resolvedParams.sort as SortKey)
    : "recent";

  const { data: projects, error } = await supabase
    .from("projects")
    .select("*")
    .eq("user_id", userId)
    .order("updated_at", { ascending: false });

  if (error) {
    console.error("Failed to load workspaces:", error);
  }

  const rawProjects: ProjectRow[] = projects ?? [];
  /**
   * REAL WORKSPACE COUNTS
   */

  const list: ProjectRow[] = await Promise.all(
    rawProjects.map(async (project) => {
      const [knowledgeResult, messageResult, memoryResult] = await Promise.all([
        supabase
          .from("project_knowledge")
          .select("*", {
            count: "exact",
            head: true,
          })
          .eq("project_id", project.id),

        supabase
          .from("project_messages")
          .select("*", {
            count: "exact",
            head: true,
          })
          .eq("project_id", project.id),

        supabase
          .from("project_chunks")
          .select("*", {
            count: "exact",
            head: true,
          })
          .eq("project_id", project.id),
      ]);

      return {
        ...project,
        knowledge_count: knowledgeResult.count ?? 0,
        message_count: messageResult.count ?? 0,
        memory_count: memoryResult.count ?? 0,
      };
    })
  );

  const proUser = await isProUser();

  const workspaceLimitReached =
    !proUser &&
    list.length >= FREE_LIMITS.workspaces;

  const hasProjects = list.length > 0;

  const mostRecentProject =
    getMostRecentlyActive(list);

  const filteredAndSorted = sortProjects(
    filterProjects(list, query),
    sort
  ); return (
    <div className="min-h-screen bg-[#05030A]">
      <div className="mx-auto max-w-7xl px-6 py-10">
        {/* Header */}
        <div className="relative mb-10 overflow-hidden rounded-[28px] border border-[#7C3AED]/15 bg-gradient-to-br from-[#0F0C16] via-[#0C0B11] to-[#09080E] p-8 shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
          <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="inline-flex items-center rounded-full border border-[rgba(124,58,237,0.25)] bg-[rgba(124,58,237,0.08)] px-3 py-1">
                <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#A78BFA]">
                  Hymora Workspaces
                </span>
              </div>

              <h1 className="mt-5 text-[34px] font-semibold tracking-[-0.03em] text-white">
                Workspaces
              </h1>

              <div className="mt-5 flex flex-wrap gap-3">
                <StatusPill
                  active
                  label={`${list.length} Workspaces`}
                />

                <StatusPill
                  active={list.length > 0}
                  label={
                    mostRecentProject
                      ? formatActivityLabel(
                        mostRecentProject.updated_at ??
                        mostRecentProject.created_at
                      )
                      : "No activity"
                  }
                />
              </div>

              <p className="mt-5 max-w-2xl text-[15px] leading-8 text-[#9A98AC]">
                Organize every project inside its own intelligent workspace. Each
                workspace keeps conversations, knowledge and long-term memory together.
              </p>
            </div>

            <NewWorkspaceButton
              limitReached={workspaceLimitReached}
            />
          </div>
        </div>

        {hasProjects ? (
          <>
            {/* Search */}
            <WorkspaceToolbar
              query={query}
              sort={sort}
            />

            {/* Search Result */}
            {query && (
              <div className="mb-6 flex items-center justify-between">
                <p className="text-[12.5px] text-[#5A5A72]">
                  {filteredAndSorted.length} result
                  {filteredAndSorted.length !== 1 && "s"} found for{" "}
                  <span className="text-[#E5E5F0]">&ldquo;{query}&rdquo;</span>
                </p>

                <Link
                  href={`/dashboard/projects${buildQueryString({
                    sort,
                  })}`}
                  className="text-[12.5px] font-medium text-[#7C3AED] transition-colors duration-150 hover:text-[#A78BFA]"
                >
                  Clear
                </Link>
              </div>
            )}



            {/* Workspace Grid */}
            {filteredAndSorted.length === 0 ? (
              <NoResultsState query={query} />
            ) : (
              <div className="grid grid-cols-1 gap-7 md:grid-cols-2 xl:grid-cols-3">
                {filteredAndSorted.map((project) => (
                  <WorkspaceCard
                    key={project.id}
                    id={project.id}
                    title={project.title}
                    description={
                      project.project_goal ??
                      project.description ??
                      "No project goal yet."
                    }
                    knowledgeCount={project.knowledge_count ?? 0}
                    messageCount={project.message_count ?? 0}
                    memoryStrength={Math.min(
                      100,
                      (project.memory_count ?? 0) * 10
                    )}
                    lastActive={formatActivityLabel(
                      project.updated_at ?? project.created_at
                    )}
                  />
                ))}
              </div>
            )}
          </>
        ) : (
          <EmptyWorkspaceState />
        )}
      </div>
    </div>
  );
}