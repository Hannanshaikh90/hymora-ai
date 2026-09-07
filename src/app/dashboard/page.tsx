import {
  auth,
  currentUser,
} from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import Link from "next/link";
import { CreateWorkspaceButton } from "@/components/workspaces/CreateWorkspaceButton";
import {
  FolderKanban,
  Database,
  MessageSquare,
  Brain,
  Plus,
  ArrowRight,
  Sparkles,
  Upload,
  MessageSquarePlus,
  FileText,
  Lightbulb,
  NotebookPen,
  Settings,
} from "lucide-react";

// ─── Supabase client ──────────────────────────────────────────────────────────

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatRelativeTime(isoDate: string | null | undefined): string {
  if (!isoDate) return "Recently";
  const date = new Date(isoDate);
  const diffSeconds = Math.max(0, (Date.now() - date.getTime()) / 1000);

  if (diffSeconds < 60) return "just now";
  if (diffSeconds < 3600) return `${Math.floor(diffSeconds / 60)}m ago`;
  if (diffSeconds < 86400) return `${Math.floor(diffSeconds / 3600)}h ago`;
  if (diffSeconds < 604800) return `${Math.floor(diffSeconds / 86400)}d ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "??";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
}

function buildSmartSummary(
  workspaceCount: number,
  memoryCount: number,
  knowledgeCount: number
): string {
  if (workspaceCount === 0) {
    return "Create your first AI workspace and let Hymora remember every conversation, document, and decision from day one.";
  }

  if (knowledgeCount === 0) {
    return "Your workspace is ready. Upload documents and start chatting to build your AI knowledge base.";
  }

  if (memoryCount === 0) {
    return "Your documents are ready. Start asking questions and Hymora will begin remembering important information.";
  }

  return `You're working across ${workspaceCount} workspace${workspaceCount > 1 ? "s" : ""} with ${knowledgeCount} knowledge item${knowledgeCount !== 1 ? "s" : ""} and ${memoryCount} memories.`;
}

// ─── Section header ───────────────────────────────────────────────────────────

interface SectionHeaderProps {
  title: string;
  href?: string;
  linkLabel?: string;
}

function SectionHeader({ title, href, linkLabel }: SectionHeaderProps) {
  return (
    <div className="mb-4 flex items-center justify-between">
      <h2 className="text-[11px] font-medium uppercase tracking-[0.1em] text-[#7C3AED]">
        {title}
      </h2>
      {href && linkLabel && (
        <Link
          href={href}
          className="flex items-center gap-1 text-[12px] font-medium text-[#5A5A72] transition-colors duration-150 hover:text-[#A78BFA]"
        >
          {linkLabel}
          <ArrowRight className="h-3 w-3" strokeWidth={1.75} />
        </Link>
      )}
    </div>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────

interface HeroProps {
  firstName: string | null;
  summary: string;

  workspaceCount: number;
  memoryCount: number;
  knowledgeCount: number;
  messageCount: number;
}

function Hero({
  firstName,
  summary,

  workspaceCount,
  memoryCount,
  knowledgeCount,
  messageCount,
}: HeroProps) {
  const greeting = firstName
    ? `Welcome back, ${firstName}`
    : "Welcome back";

  return (
    <section className="relative overflow-hidden rounded-[30px] border border-white/[0.06] bg-gradient-to-br from-[#100D18] via-[#0C0B11] to-[#08070D] px-8 py-10 shadow-[0_24px_70px_rgba(0,0,0,0.35)]">

      <div className="pointer-events-none absolute right-[-120px] top-[-120px] h-[300px] w-[300px] rounded-full bg-[#7C3AED]/12 blur-[120px]" />

      <div className="pointer-events-none absolute left-[-120px] bottom-[-120px] h-[260px] w-[260px] rounded-full bg-[#A78BFA]/6 blur-[120px]" />

      <div className="relative z-10 flex flex-col gap-10 lg:flex-row lg:items-center lg:justify-between">

        <div className="max-w-3xl">

          <div className="inline-flex items-center gap-2 rounded-full border border-[#7C3AED]/20 bg-[#7C3AED]/10 px-4 py-2">

            <Sparkles
              className="h-3.5 w-3.5 text-[#A78BFA]"
              strokeWidth={1.75}
            />

            <span className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#A78BFA]">
              AI Workspace
            </span>

          </div>

          <h1 className="mt-6 text-[38px] font-semibold tracking-[-0.04em] leading-tight text-white">
            {greeting}
          </h1>

          <p className="mt-5 max-w-2xl text-[15px] leading-8 text-[#9A9AB3]">
  {summary}
</p>

<div className="mt-8 flex flex-wrap items-center gap-3">

  <CreateWorkspaceButton className="inline-flex items-center justify-center rounded-xl bg-[#7C3AED] px-5 py-3 text-sm font-medium text-white transition-all duration-200 hover:bg-[#8B5CF6]">
    Create Workspace
  </CreateWorkspaceButton>

  <Link
    href="/dashboard/projects"
    className="inline-flex items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.03] px-5 py-3 text-sm font-medium text-[#D7D7E5] transition-all duration-200 hover:border-[#7C3AED]/25 hover:text-white"
  >
    Browse Workspaces
  </Link>

</div>

        </div>

        <div className="grid w-full max-w-[320px] grid-cols-2 gap-3">

          <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-4">
            <p className="text-[11px] uppercase tracking-[0.08em] text-[#7A7A90]">
              Workspaces
            </p>

            <p className="mt-2 text-2xl font-semibold text-white">
              {workspaceCount}
            </p>
          </div>

          <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-4">
            <p className="text-[11px] uppercase tracking-[0.08em] text-[#7A7A90]">
              Memories
            </p>

            <p className="mt-2 text-2xl font-semibold text-white">
              {memoryCount}
            </p>
          </div>

          <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-4">
            <p className="text-[11px] uppercase tracking-[0.08em] text-[#7A7A90]">
              Knowledge
            </p>

            <p className="mt-2 text-2xl font-semibold text-white">
              {knowledgeCount}
            </p>
          </div>

          <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-4">
            <p className="text-[11px] uppercase tracking-[0.08em] text-[#7A7A90]">
              Messages
            </p>

            <p className="mt-2 text-2xl font-semibold text-white">
              {messageCount}
            </p>
          </div>

        </div>

      </div>

    </section>
  );
}
// ─── Continue Working (featured workspace) ───────────────────────────────────

interface FeaturedWorkspaceProps {
  id: string;
  title: string;
  goal: string | null;
  description: string | null;
  updatedAt: string | null;
  memoryCount: number;
  knowledgeCount: number;
}

function ContinueWorking({
  id,
  title,
  goal,
  description,
  updatedAt,
  memoryCount,
  knowledgeCount,
}: FeaturedWorkspaceProps) {
  return (
    <section>
      <SectionHeader title="Continue Working" />

      <div className="group relative overflow-hidden rounded-[30px] border border-white/[0.06] bg-gradient-to-br from-[#100D18] via-[#0C0B11] to-[#08070D] shadow-[0_24px_60px_rgba(0,0,0,0.35)] transition-all duration-300 hover:border-[#7C3AED]/30 hover:shadow-[0_30px_70px_rgba(124,58,237,0.18)]">

        {/* Glow */}
        <div className="pointer-events-none absolute right-[-100px] top-[-100px] h-[240px] w-[240px] rounded-full bg-[#7C3AED]/10 blur-[120px]" />

        <div className="relative flex flex-col gap-8 p-8 lg:flex-row lg:items-center lg:justify-between">

          {/* Left */}
          <div className="flex items-start gap-5">

            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-[#7C3AED]/20 bg-[#7C3AED]/10 text-lg font-semibold text-[#A78BFA]">
              {getInitials(title)}
            </div>

            <div className="min-w-0">

              <div className="flex flex-wrap items-center gap-3">

                <h3 className="truncate text-[28px] font-semibold tracking-[-0.03em] text-white">
                  {title}
                </h3>

                <span className="rounded-full border border-[#22C55E]/20 bg-[#22C55E]/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#4ADE80]">
                  Active
                </span>

              </div>

              <p className="mt-4 max-w-2xl text-[15px] leading-8 text-[#9A9AB3]">
                {goal ||
                  description ||
                  "No workspace goal has been added yet."}
              </p>

              <div className="mt-6 flex flex-wrap gap-3">

                <div className="flex items-center gap-2 rounded-xl border border-white/[0.06] bg-white/[0.02] px-3 py-2">

                  <Brain
                    className="h-4 w-4 text-[#A78BFA]"
                    strokeWidth={1.75}
                  />

                  <span className="text-sm text-[#E5E5F0]">
                    {memoryCount} Memories
                  </span>

                </div>

                <div className="flex items-center gap-2 rounded-xl border border-white/[0.06] bg-white/[0.02] px-3 py-2">

                  <Database
                    className="h-4 w-4 text-[#A78BFA]"
                    strokeWidth={1.75}
                  />

                  <span className="text-sm text-[#E5E5F0]">
                    {knowledgeCount} Knowledge
                  </span>

                </div>

                <div className="flex items-center rounded-xl border border-white/[0.06] bg-white/[0.02] px-3 py-2 text-sm text-[#8B8BA3]">
                  Updated {formatRelativeTime(updatedAt)}
                </div>

              </div>

            </div>

          </div>

          {/* Right */}
          <div className="flex flex-col gap-3 lg:w-[240px]">

            <Link
              href={`/dashboard/projects/${id}`}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#7C3AED] px-6 py-4 text-sm font-medium text-white shadow-lg shadow-[#7C3AED]/25 transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#8B5CF6]"
            >
              Continue Workspace

              <ArrowRight
                className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
                strokeWidth={1.75}
              />
            </Link>

            <Link
              href={`/dashboard/projects/${id}`}
              className="inline-flex items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.03] px-6 py-3 text-sm font-medium text-[#CFCFDC] transition hover:border-[#7C3AED]/25 hover:text-white"
            >
              Open Workspace
            </Link>

          </div>

        </div>

      </div>

    </section>
  );
}

function EmptyContinueWorking() {
  return (
    <section>

      <SectionHeader title="Continue Working" />

      <div className="rounded-2xl border border-dashed border-white/[0.08] bg-[#0C0B11] px-8 py-14 text-center">

        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-[#7C3AED]/10">

          <FolderKanban
            className="h-5 w-5 text-[#A78BFA]"
            strokeWidth={1.75}
          />

        </div>

        <h3 className="mt-5 text-lg font-semibold text-white">
          Create your first workspace
        </h3>

        <p className="mx-auto mt-2 max-w-sm text-sm leading-7 text-[#8B8BA3]">
          Start a workspace, upload knowledge, and let Hymora remember everything for you.
        </p>

        <Link
          href="/dashboard/projects/new"
          className="mt-7 inline-flex items-center gap-2 rounded-xl bg-[#7C3AED] px-5 py-3 text-sm font-medium text-white transition-all duration-200 hover:bg-[#8B5CF6]"
        >
          <Plus
            className="h-4 w-4"
            strokeWidth={2}
          />

          Create Workspace
        </Link>

      </div>

    </section>
  );
}
// ─── Recent memories ──────────────────────────────────────────────────────────

type KnowledgeType =
  | "pdf"
  | "document"
  | "research"
  | "note";

const KNOWLEDGE_TYPE_ICON: Record<
  KnowledgeType,
  React.ElementType
> = {
  pdf: FileText,
  document: FileText,
  research: Lightbulb,
  note: NotebookPen,
};

const KNOWLEDGE_TYPE_LABEL: Record<
  KnowledgeType,
  string
> = {
  pdf: "PDF",
  document: "Document",
  research: "Research",
  note: "Note",
};

function normalizeKnowledgeType(
  type: string | null | undefined
): KnowledgeType {
  if (
    type === "pdf" ||
    type === "research" ||
    type === "note"
  ) {
    return type;
  }

  return "document";
}

interface KnowledgeRowProps {
  title: string;
  type: string | null | undefined;
  workspaceTitle: string;
  createdAt: string | null;
}

interface MemoryCardProps {
  label: string;
  value: string;
  workspaceTitle: string;
  createdAt: string | null;
}

function MemoryCard({
  label,
  value,
  workspaceTitle,
  createdAt,
}: MemoryCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-white/[0.06] bg-gradient-to-br from-[#100D18] via-[#0C0B11] to-[#09080E] p-5 shadow-[0_12px_34px_rgba(0,0,0,0.22)] transition-all duration-300 hover:-translate-y-1 hover:border-[#7C3AED]/25 hover:shadow-[0_20px_50px_rgba(124,58,237,0.18)]">

      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-[#7C3AED] via-[#A78BFA] to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      <div className="flex items-center justify-between">

        <div className="flex items-center gap-3">

          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#7C3AED]/10">
            <Brain
              className="h-5 w-5 text-[#A78BFA]"
              strokeWidth={1.75}
            />
          </div>

          <div>

            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#A78BFA]">
              {label}
            </p>

            <p className="mt-1 text-[12px] text-[#7A7A90]">
              {workspaceTitle}
            </p>

          </div>

        </div>

        <span className="text-[12px] text-[#5A5A72]">
          {formatRelativeTime(createdAt)}
        </span>

      </div>

      <p className="mt-5 line-clamp-4 text-[14px] leading-7 text-[#E5E5F0]">
        {value}
      </p>

      <div className="mt-5 flex items-center justify-between">

        <span className="text-[12px] text-[#5A5A72]">
          Stored in AI Memory
        </span>

        <span className="text-[12px] font-medium text-[#A78BFA] opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          Remembered
        </span>

      </div>

    </div>
  );
}
function EmptyMemories() {
  return (
    <div className="rounded-xl border border-dashed border-white/[0.08] bg-[#0C0B11] px-8 py-10 text-center">

      <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-lg bg-[#7C3AED]/10">

        <Brain
          className="h-4 w-4 text-[#A78BFA]"
          strokeWidth={1.75}
        />

      </div>

      <>
        <p className="mt-4 text-sm font-medium text-white">
          No memories yet
        </p>

        <p className="mt-2 text-[13px] leading-6 text-[#8B8BA3]">
          Start chatting with Hymora and important information will be remembered automatically.
        </p>

        <Link
          href="/dashboard/projects"
          className="mt-6 inline-flex items-center rounded-lg bg-[#7C3AED] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#8B5CF6]"
        >
          Open Workspace
        </Link>
      </>

    </div>
  );
}

function KnowledgeRow({
  title,
  type,
  workspaceTitle,
  createdAt,
}: KnowledgeRowProps) {
  const normalizedType =
    normalizeKnowledgeType(type);

  const Icon =
    KNOWLEDGE_TYPE_ICON[normalizedType];

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-white/[0.06] bg-gradient-to-br from-[#0F0C16] via-[#0C0B11] to-[#09080E] p-5 shadow-[0_12px_32px_rgba(0,0,0,0.22)] transition-all duration-300 hover:-translate-y-1 hover:border-[#7C3AED]/25 hover:shadow-[0_20px_45px_rgba(124,58,237,0.18)]">

      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-[#7C3AED] via-[#A78BFA] to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      <div className="flex items-start gap-4">

        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#7C3AED]/10">
          <Icon
            className="h-5 w-5 text-[#A78BFA]"
            strokeWidth={1.75}
          />
        </div>

        <div className="min-w-0 flex-1">

          <div className="flex items-center justify-between gap-3">

            <h3 className="truncate text-[15px] font-semibold text-white">
              {title}
            </h3>

            <span className="rounded-full border border-[#7C3AED]/20 bg-[#7C3AED]/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#A78BFA]">
              {KNOWLEDGE_TYPE_LABEL[normalizedType]}
            </span>

          </div>

          <p className="mt-2 text-[13px] text-[#8B8BA3]">
            {workspaceTitle}
          </p>

          <div className="mt-4 flex items-center justify-between">

            <span className="text-[12px] text-[#5A5A72]">
              Added {formatRelativeTime(createdAt)}
            </span>

            <span className="text-[12px] font-medium text-[#A78BFA] opacity-0 transition-opacity group-hover:opacity-100">
              Ready for AI
            </span>

          </div>

        </div>

      </div>

    </div>
  );
}
function EmptyKnowledge() {
  return (
    <div className="rounded-xl border border-dashed border-white/[0.08] bg-[#0C0B11] px-8 py-10 text-center">

      <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-lg bg-[#7C3AED]/10">

        <Database
          className="h-4 w-4 text-[#A78BFA]"
          strokeWidth={1.75}
        />

      </div>

      <>
        <p className="mt-4 text-sm font-medium text-white">
          No knowledge yet
        </p>

        <p className="mt-2 text-[13px] leading-6 text-[#8B8BA3]">
          Upload PDFs, DOCX or TXT files and ask questions naturally. Hymora will remember everything inside this workspace.
        </p>

        <Link
          href="/dashboard/projects"
          className="mt-6 inline-flex items-center rounded-lg bg-[#7C3AED] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#8B5CF6]"
        >
          Upload Knowledge
        </Link>
      </>

    </div>
  );
}
// ─── Quick actions ────────────────────────────────────────────────────────────

interface QuickActionProps {
  href: string;
  label: string;
  description: string;
  icon: React.ElementType;
}

function QuickAction({
  href,
  label,
  description,
  icon: Icon,
}: QuickActionProps) {
  return (
    <Link
      href={href}
      className="group relative flex min-h-[128px] items-center gap-4 overflow-hidden rounded-2xl border border-white/[0.06] bg-gradient-to-br from-[#0F0C16] via-[#0C0B11] to-[#09080E] p-5 shadow-[0_10px_35px_rgba(0,0,0,0.22)] transition-all duration-300 hover:-translate-y-1 hover:border-[#7C3AED]/25 hover:shadow-[0_18px_45px_rgba(124,58,237,0.18)]"
    >
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-[#7C3AED] via-[#A78BFA] to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#7C3AED]/10">
        <Icon
          className="h-5 w-5 text-[#A78BFA]"
          strokeWidth={1.75}
        />
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-[15px] font-semibold text-white">
          {label}
        </p>

        <p className="mt-1 min-h-[52px] text-[13px] leading-6 text-[#8B8BA3]">
          {description}
        </p>
      </div>

      <ArrowRight
        className="h-4 w-4 text-[#5A5A72] transition-all duration-300 group-hover:translate-x-1 group-hover:text-[#A78BFA]"
        strokeWidth={1.75}
      />
    </Link>
  );
}// ─── Compact workspace overview ───────────────────────────────────────────────

interface CompactStatProps {
  icon: React.ElementType;
  label: string;
  value: number;
}

function CompactStat({
  icon: Icon,
  label,
  value,
}: CompactStatProps) {
  return (
    <div className="group rounded-2xl border border-white/[0.06] bg-gradient-to-br from-[#0F0C16] via-[#0C0B11] to-[#09080E] p-5 shadow-[0_10px_35px_rgba(0,0,0,0.22)] transition-all duration-300 hover:-translate-y-1 hover:border-[#7C3AED]/25 hover:shadow-[0_18px_45px_rgba(124,58,237,0.18)]">
      <div className="flex items-center justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#7C3AED]/10 transition-colors duration-300 group-hover:bg-[#7C3AED]/15">
          <Icon
            className="h-4.5 w-4.5 text-[#A78BFA]"
            strokeWidth={1.75}
          />
        </div>

        <span className="text-[30px] font-semibold tracking-[-0.03em] text-white">
          {value}
        </span>
      </div>

      <p className="mt-5 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#8B8BA3]">
        {label}
      </p>
    </div>
  );
}
// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function DashboardPage() {
  

const { userId } = await auth();



  if (!userId) {
    redirect("/sign-in");
  }



let firstName = "User";

try {
  let clerkUser = null;

try {
  clerkUser = await currentUser();
} catch (error) {
  console.error(
    "CLERK_CURRENT_USER_ERROR:",
    error
  );
}

  firstName =
    clerkUser?.firstName ||
    clerkUser?.fullName?.split(" ")[0] ||
    "User";
} catch (error) {
  console.error(
    "CLERK USER ERROR:",
    error
  );
}

  

const { data: projects } =
  await supabase
    .from("projects")
    .select(`
  id,
  title,
  description,
  project_goal,
  updated_at
`)
    .eq("user_id", userId)
    .order("updated_at", {
      ascending: false,
    });

const workspaceCount =
  projects?.length ?? 0;

const workspaceIds =
  (projects ?? []).map(
    (project) => project.id
  );

    

const [
  { count: knowledgeCount },
  { count: messageCount },
  { count: memoryCount },
] =
  workspaceIds.length
      ? await Promise.all([
        supabase
          .from("project_knowledge")
          .select("*", {
            count: "exact",
            head: true,
          })
          .in("project_id", workspaceIds),

        supabase
          .from("project_messages")
          .select("*", {
            count: "exact",
            head: true,
          })
          .in("project_id", workspaceIds),

        supabase
          .from("project_chunks")
          .select("*", {
            count: "exact",
            head: true,
          })
          .in("project_id", workspaceIds),
      ])
      : [
        { count: 0 },
        { count: 0 },
        { count: 0 },
      ];

  const topProject = projects?.[0] ?? null;

  

  let featuredMemoryCount = 0;
  let featuredKnowledgeCount = 0;

  if (topProject) {
    const [{ count: projectMemoryCount }, { count: projectKnowledgeCount }] =
      await Promise.all([
        supabase
          .from("project_chunks")
          .select("*", { count: "exact", head: true })
          .eq("project_id", topProject.id),
        supabase
          .from("project_knowledge")
          .select("*", { count: "exact", head: true })
          .eq("project_id", topProject.id),
      ]);
    featuredMemoryCount = projectMemoryCount ?? 0;
    featuredKnowledgeCount = projectKnowledgeCount ?? 0;
  }



  const { data: recentMemoryRows } = workspaceIds.length
    ? await supabase
      .from("project_chunks")
      .select(`
        id,
        content,
        project_id,
        created_at,
        projects (
          title
        )
      `)
      .in("project_id", workspaceIds)
      .order("created_at", { ascending: false })
      .limit(6)
    : { data: [] as never[] };

  const { data: recentKnowledgeRows } = workspaceIds.length
    ? await supabase
      .from("project_knowledge")
      .select(`
        id,
        content,
        project_id,
        created_at,
        projects (
          title
        )
      `)
      .in("project_id", workspaceIds)
      .order("created_at", { ascending: false })
      .limit(6)
    : { data: [] as never[] };

  const summary = buildSmartSummary(
    workspaceCount,
    memoryCount ?? 0,
    knowledgeCount ?? 0
  );

  const heroStats = {
    workspaces: workspaceCount,
    memories: memoryCount ?? 0,
    knowledge: knowledgeCount ?? 0,
    messages: messageCount ?? 0,
  };

  return (
    <div className="min-h-screen bg-[#05030A]">
      <div className="mx-auto max-w-6xl space-y-10 px-6 py-8">

        {/* ── Hero ────────────────────────────────────────────────────────── */}
        <Hero
          firstName={firstName}
          summary={summary}
          workspaceCount={workspaceCount}
          memoryCount={memoryCount ?? 0}
          knowledgeCount={knowledgeCount ?? 0}
          messageCount={messageCount ?? 0}
        />

        {/* ── Continue Working ────────────────────────────────────────────── */}
        {topProject ? (
          <ContinueWorking
            id={topProject.id}
            title={topProject.title}
            goal={topProject.project_goal ?? null}
            description={topProject.description ?? null}
            updatedAt={topProject.updated_at ?? null}
            memoryCount={featuredMemoryCount}
            knowledgeCount={featuredKnowledgeCount}
          />
        ) : (
          <EmptyContinueWorking />
        )}

        {/* ── Quick Actions ─────────────────────────────────────────────── */}
        <section>
          <SectionHeader title="Quick Actions" />

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <CreateWorkspaceButton className="block">
              <div className="group relative flex min-h-[128px] items-center gap-4 overflow-hidden rounded-2xl border border-white/[0.06] bg-gradient-to-br from-[#0F0C16] via-[#0C0B11] to-[#09080E] p-5 shadow-[0_10px_35px_rgba(0,0,0,0.22)] transition-all duration-300 hover:-translate-y-1 hover:border-[#7C3AED]/25 hover:shadow-[0_18px_45px_rgba(124,58,237,0.18)]">

                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-[#7C3AED] via-[#A78BFA] to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#7C3AED]/10">
                  <Plus
                    className="h-5 w-5 text-[#A78BFA]"
                    strokeWidth={1.75}
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-[15px] font-semibold text-white">
                    Create Workspace
                  </p>

                  <p className="mt-1 min-h-[52px] text-[13px] leading-6 text-[#8B8BA3]">
                    Create a workspace and start building with AI
                  </p>
                </div>

                <ArrowRight
                  className="h-4 w-4 text-[#5A5A72] transition-all duration-300 group-hover:translate-x-1 group-hover:text-[#A78BFA]"
                  strokeWidth={1.75}
                />

              </div>
            </CreateWorkspaceButton>

            <QuickAction
              href="/dashboard/projects"
              label="Browse Workspaces"
              description="Open and continue an existing workspace"
              icon={FolderKanban}
            />

            <QuickAction
              href="/dashboard/memory"
              label="Memory Center"
              description="Review what Hymora remembers"
              icon={Brain}
            />

            <QuickAction
              href="/dashboard/settings"
              label="Settings"
              description="Manage your account and preferences"
              icon={Settings}
            />
          </div>
        </section>

        {/* ── Workspace Overview ───────────────────────────────────────── */}
        <section>
          <SectionHeader title="Workspace Overview" />

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <CompactStat
              icon={FolderKanban}
              label="Workspaces"
              value={workspaceCount}
            />

            <CompactStat
              icon={Database}
              label="Documents"
              value={knowledgeCount ?? 0}
            />

            <CompactStat
              icon={MessageSquare}
              label="Messages"
              value={messageCount ?? 0}
            />

            <CompactStat
              icon={Brain}
              label="AI Memories"
              value={memoryCount ?? 0}
            />
          </div>
        </section>

        {/* ── Recent Knowledge ─────────────────────────────────────────── */}
        <section>
          <SectionHeader
            title="Recent Knowledge"
            href="/dashboard/projects"
            linkLabel="View all"
          />

          {recentKnowledgeRows && recentKnowledgeRows.length > 0 ? (
            <div className="flex flex-col gap-3">
              {recentKnowledgeRows.map((row: any) => (
                <KnowledgeRow
                  key={row.id}
                  title={
                    row.content
                      ? row.content.split("\n")[0].slice(0, 60)
                      : "Untitled Knowledge"
                  }
                  type="document"
                  workspaceTitle={row.projects?.title ?? "Workspace"}
                  createdAt={row.created_at}
                />
              ))}
            </div>
          ) : (
            <EmptyKnowledge />
          )}
        </section>

        {/* ── Recent Memories ──────────────────────────────────────────── */}
        <section>
          <SectionHeader
            title="Recent Memories"
            href="/dashboard/memory"
            linkLabel="View all"
          />

          {recentMemoryRows && recentMemoryRows.length > 0 ? (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {recentMemoryRows.map((row: any) => (
                <MemoryCard
                  key={row.id}
                  label="Memory"
                  value={
                    row.content
                      ? row.content.replace(/\n/g, " ").slice(0, 140)
                      : ""
                  }
                  workspaceTitle={row.projects?.title ?? "Workspace"}
                  createdAt={row.created_at}
                />
              ))}
            </div>
          ) : (
            <EmptyMemories />
          )}
        </section>

      </div>
    </div>
  );
}