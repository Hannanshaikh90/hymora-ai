import Link from "next/link";

import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import {
  Activity,
  Brain,
  Database,
  FolderPlus,

  MessageSquare,
  Plus,
  Sparkles,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import ActivitySearch from "@/components/activity/activity-search";
import ActivityClient from "@/components/activity/ActivityClient";


const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// ─── Types ────────────────────────────────────────────────────────────────────

type ActivityType = "conversation" | "knowledge" | "memory" | "workspace";

interface ActivityItem {
  id: string;
  type: ActivityType;
  workspaceId: string;
  workspaceTitle: string;
  description: string;
  timestamp: string;
}

interface WorkspaceActivitySummary {
  id: string;
  title: string;
  conversationCount: number;
  knowledgeCount: number;
  memoryCount: number;
  lastActive: string | null;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatTimestamp(isoDate: string): string {
  const date = new Date(isoDate);
  return date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
}

function formatLastActive(isoDate: string | null): string {
  if (!isoDate) return "No activity yet";
  const date = new Date(isoDate);
  const diffMinutes = Math.floor((Date.now() - date.getTime()) / 60000);

  if (diffMinutes < 1) return "Just now";
  if (diffMinutes < 60) return `${diffMinutes}m ago`;

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours}h ago`;

  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 30) return `${diffDays}d ago`;

  const diffMonths = Math.floor(diffDays / 30);
  if (diffMonths < 12) return `${diffMonths}mo ago`;

  return `${Math.floor(diffMonths / 12)}y ago`;
}

function getDateGroup(isoDate: string): "Today" | "Yesterday" | "Earlier" {
  const date = new Date(isoDate);
  const now = new Date();

  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfYesterday = new Date(startOfToday);
  startOfYesterday.setDate(startOfYesterday.getDate() - 1);

  if (date >= startOfToday) return "Today";
  if (date >= startOfYesterday) return "Yesterday";
  return "Earlier";
}

function truncate(text: string, max: number): string {
  if (text.length <= max) return text;
  return `${text.slice(0, max).trimEnd()}…`;
}

const ACTIVITY_GROUP_ORDER: Array<"Today" | "Yesterday" | "Earlier"> = [
  "Today",
  "Yesterday",
  "Earlier",
];

const ACTIVITY_ICON: Record<ActivityType, LucideIcon> = {
  conversation: MessageSquare,
  knowledge: Database,
  memory: Brain,
  workspace: FolderPlus,
};

const ACTIVITY_LABEL: Record<ActivityType, string> = {
  conversation: "Conversation",
  knowledge: "Knowledge Upload",
  memory: "Memory Created",
  workspace: "Workspace Created",
};

const ACTIVITY_ACCENT: Record<ActivityType, string> = {

  conversation: "text-[#7FB2F0]",
  knowledge: "text-[#A78BFA]",
  memory: "text-[#73C991]",
  workspace: "text-[#E0A85C]",
};

const ACTIVITY_BADGE_CLASS: Record<ActivityType, string> = {
  conversation:
    "rounded-full bg-blue-500/15 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-blue-300",

  knowledge:
    "rounded-full bg-emerald-500/15 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-emerald-300",

  memory:
    "rounded-full bg-violet-500/15 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-violet-300",

  workspace:
    "rounded-full bg-amber-500/15 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-amber-300",
};

// ─── Data loading ─────────────────────────────────────────────────────────────

async function loadActivityData(userId: string) {
  const { data: projects } = await supabase
    .from("projects")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  const workspaceList = projects ?? [];


  const workspaceIds = workspaceList.map((project) => project.id);
  const workspaceTitleById = new Map<string, string>(
    workspaceList.map((project) => [project.id, project.title as string])
  );

  if (workspaceIds.length === 0) {
    return {
      activities: [] as ActivityItem[],
      workspaceSummaries: [] as WorkspaceActivitySummary[],
      totalConversations: 0,
      totalKnowledge: 0,
      totalMemories: 0,
    };
  }

  const [
    messagesResult,
    knowledgeResult,
    memoriesResult,
    knowledgeCountResult,
    memoryCountResult,
    filesResult,
  ] = await Promise.all([
    supabase
      .from("project_messages")
      .select("id, content, role, project_id, created_at")
      .in("project_id", workspaceIds)
      .order("created_at", { ascending: false })
      .limit(100),
    supabase
      .from("project_knowledge")
      .select("id, content, project_id, created_at")
      .in("project_id", workspaceIds)
      .order("created_at", { ascending: false })
      .limit(100),
    supabase
      .from("user_memories")
      .select("id, memory, created_at")
      .eq("clerk_user_id", userId)
      .order("created_at", { ascending: false })
      .limit(100),
    // Exact totals, matching how Home/Workspace pages compute counts —
    // independent of the .limit(100) cap on the row-level queries above.
    supabase
      .from("project_knowledge")
      .select("*", { count: "exact", head: true })
      .in("project_id", workspaceIds),
    supabase
      .from("user_memories")
      .select("*", { count: "exact", head: true })
      .eq("clerk_user_id", userId),

    supabase
      .from("project_files")
      .select("id")
      .in("project_id", workspaceIds),
  ]);

  if (messagesResult.error) {
    console.error("[activity] project_messages query failed:", messagesResult.error);
  }
  if (knowledgeResult.error) {
    console.error("[activity] project_knowledge query failed:", knowledgeResult.error);
  }
  if (memoriesResult.error) {
    console.error("[activity] user_memories query failed:", memoriesResult.error);
  }
  if (knowledgeCountResult.error) {
    console.error("[activity] project_knowledge count failed:", knowledgeCountResult.error);
  }
  if (memoryCountResult.error) {
    console.error("[activity] user_memories count failed:", memoryCountResult.error);
  }

  const messages = messagesResult.data ?? [];
  const knowledgeRows = knowledgeResult.data ?? [];
  const memoryRows = memoriesResult.data ?? [];
  const _files = filesResult.data ?? [];

  const totalConversations = messages.filter(
    (row) => (row.role ?? "user") === "user"
  ).length;

  const totalKnowledge = knowledgeCountResult.count ?? 0;

  const totalMemories = memoryCountResult.count ?? 0;

  const conversationActivities: ActivityItem[] = messages
    .filter(
      (row) =>
        (row.role ?? "user") === "user" &&
        row.content &&
        row.content.trim().length > 10
    )
    .map((row) => ({
      id: `conversation-${row.id}`,
      type: "conversation" as const,
      workspaceId: "memory",
      workspaceTitle:
        workspaceTitleById.get(row.project_id as string) ??
        "Workspace",

      description: truncate(
        row.content as string,
        70
      ),

      timestamp: row.created_at as string,
    }));

  const knowledgeActivities: ActivityItem[] = knowledgeRows.map((row) => ({
    id: `knowledge-${row.id}`,
    type: "knowledge" as const,
    workspaceId: row.project_id as string,
    workspaceTitle: workspaceTitleById.get(row.project_id as string) ?? "Workspace",
    description: `Knowledge: ${truncate((row.content as string) ?? "", 70)}`,
    timestamp: row.created_at as string,
  }));

  const memoryActivities: ActivityItem[] = memoryRows.map((row) => ({
    id: `memory-${row.id}`,
    type: "memory" as const,
    workspaceId: "personal-memory",
    workspaceTitle: "Personal Memory",
    description: `Memory: ${truncate((row.memory as string) ?? "", 80)}`,
    timestamp: row.created_at as string,
  }));

  const workspaceActivities: ActivityItem[] = workspaceList.map((project) => ({
    id: `workspace-${project.id}`,
    type: "workspace" as const,
    workspaceId: project.id as string,
    workspaceTitle: project.title as string,
    description: `Created Workspace: ${project.title as string}`,
    timestamp: project.created_at as string,
  }));

  const uniqueActivities = [
    ...conversationActivities,
    ...knowledgeActivities,
    ...memoryActivities,
    ...workspaceActivities,
  ].filter((activity, index, array) => {
    return (
      index ===
      array.findIndex(
        (item) =>
          item.type === activity.type &&
          item.description === activity.description &&
          item.workspaceId === activity.workspaceId
      )
    );
  });

  const activities = uniqueActivities
    .sort(
      (a, b) =>
        new Date(b.timestamp).getTime() -
        new Date(a.timestamp).getTime()
    )
    .slice(0, 30);

  const workspaceSummaries: WorkspaceActivitySummary[] = workspaceList
    .map((project) => {
      const id = project.id as string;

      const conversationCount = messages.filter(
        (row) => row.project_id === id && (row.role ?? "user") === "user"
      ).length;
      const knowledgeCount = knowledgeRows.filter((row) => row.project_id === id).length;
      const memoryCount = memoryRows.length;

      const timestamps = [
        project.updated_at as string | undefined,
        project.created_at as string | undefined,
        ...messages.filter((row) => row.project_id === id).map((row) => row.created_at as string),
        ...knowledgeRows.filter((row) => row.project_id === id).map((row) => row.created_at as string),
        ...memoryRows.map((row) => row.created_at as string),
      ].filter(Boolean) as string[];

      const lastActive =
        timestamps.length > 0
          ? timestamps.reduce((latest, current) =>
            new Date(current).getTime() > new Date(latest).getTime() ? current : latest
          )
          : null;

      return {
        id,
        title: project.title as string,
        conversationCount,
        knowledgeCount,
        memoryCount,
        lastActive,
      };
    })
    .sort((a, b) => {
      const aTime = a.lastActive ? new Date(a.lastActive).getTime() : 0;
      const bTime = b.lastActive ? new Date(b.lastActive).getTime() : 0;
      return bTime - aTime;
    })
    .slice(0, 6);

  return {
    activities,
    workspaceSummaries,

    totalConversations,
    totalKnowledge,
    totalMemories,

    latestConversation:
      messages[0]?.content ?? null,

    latestKnowledge:
      knowledgeRows[0]?.content ?? null,

    mostActiveWorkspace:
      workspaceSummaries[0]?.title ?? null,
  };
}

// ─── Hero stat ────────────────────────────────────────────────────────────────

interface HeroStatProps {
  icon: LucideIcon;
  label: string;
  value: number;
}

function HeroStat({ icon: Icon, label, value }: HeroStatProps) {
  return (
    <div className="group relative overflow-hidden rounded-[16px] border border-[rgba(255,255,255,0.06)] bg-[#0D0B14] p-5 transition-all duration-300 hover:-translate-y-1 hover:border-[#7C3AED]/25 hover:shadow-[0_18px_40px_rgba(124,58,237,0.15)]">
      <div className="absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-[#7C3AED] via-[#A78BFA] to-transparent" />
      <div className="flex h-8 w-8 items-center justify-center rounded-[8px] bg-[rgba(124,58,237,0.12)]">
        <Icon className="h-[15px] w-[15px] text-[#A78BFA]" strokeWidth={1.75} />
      </div>
      <p className="mt-3 text-[12px] text-[#5A5A72]">{label}</p>
      <p className="mt-1 text-[30px] font-semibold tracking-[-0.02em] text-[#E5E5F0]">
        {value.toLocaleString()}
      </p>
    </div>
  );
}

// ─── Timeline ─────────────────────────────────────────────────────────────────

function ActivityTimeline({ activities }: { activities: ActivityItem[] }) {
  const grouped = new Map<"Today" | "Yesterday" | "Earlier", ActivityItem[]>();
  for (const item of activities) {
    const group = getDateGroup(item.timestamp);
    const existing = grouped.get(group) ?? [];
    existing.push(item);
    grouped.set(group, existing);
  }

  return (
    <div className="flex flex-col gap-8">
      {ACTIVITY_GROUP_ORDER.filter((group) => grouped.has(group)).map((group) => (
        <div key={group}>
          <p className="mb-5 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#A78BFA]">
            {group}
          </p>

          <div className="relative flex flex-col gap-3">
            <div
              className="pointer-events-none absolute bottom-4 left-[19px] top-4 w-px bg-gradient-to-b from-[#7C3AED]/30 via-white/10 to-transparent"
              aria-hidden
            />
            {grouped.get(group)!.map((item) => (
              <TimelineRow key={item.id} item={item} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function TimelineRow({ item }: { item: ActivityItem }) {
  const Icon = ACTIVITY_ICON[item.type];

  return (
    <Link
      href={`/dashboard/projects/${item.workspaceId}`}
      className="
group
relative
flex
items-start
gap-4
rounded-2xl
border
border-white/5
bg-[#0D0B14]
p-5
transition-all
duration-200
hover:-translate-y-[2px]
hover:border-[#7C3AED]/30
hover:bg-[#12101B]
"
    >
      <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[rgba(255,255,255,0.08)] bg-[#0D0B14] transition-colors duration-150 group-hover:border-[rgba(124,58,237,0.35)]">
        <Icon className={`h-4 w-4 ${ACTIVITY_ACCENT[item.type]}`} strokeWidth={1.75} />
      </div>

      <div className="min-w-0 flex-1 pt-0.5">
        <div className="flex flex-wrap items-center gap-2">
          <span className={ACTIVITY_BADGE_CLASS[item.type]}>
            {ACTIVITY_LABEL[item.type]}
          </span>
          <span className="text-[11px] text-[#3A3A52]">·</span>
          <span className="truncate text-[12px] font-semibold text-[#A78BFA]">
            {item.workspaceTitle}
          </span>
        </div>

        <p className="mt-2 line-clamp-2 text-[14px] leading-6 text-[#E5E5F0]">
          {item.description}
        </p>
      </div>

      <span className="shrink-0 rounded-full border border-white/5 bg-white/5 px-3 py-1 text-[11px] text-[#8B8BA3]">
        {formatTimestamp(item.timestamp)}
      </span>
    </Link>
  );
}

// ─── Recent workspace activity ────────────────────────────────────────────────

function RecentWorkspaceActivity({
  workspaces,
}: {
  workspaces: WorkspaceActivitySummary[];
}) {
  return (
    <div className="flex flex-col gap-2">
      {workspaces.map((workspace) => (
        <Link
          key={workspace.id}
          href={`/dashboard/projects/${workspace.id}`}
          className="group flex items-center gap-4 rounded-[12px] border border-[rgba(255,255,255,0.06)] bg-[#0D0B14] px-4 py-3.5 transition-colors duration-150 hover:-translate-y-[2px] hover:border-[rgba(124,58,237,0.25)] hover:bg-[#12101B]"
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[9px] bg-[rgba(124,58,237,0.12)]">
            <Sparkles className="h-4 w-4 text-[#A78BFA]" strokeWidth={1.75} />
          </div>

          <div className="min-w-0 flex-1">
            <p className="truncate text-[13.5px] font-medium text-[#E5E5F0]">
              {workspace.title}
            </p>
            <div className="mt-1 flex items-center gap-3 text-[11.5px] text-[#5A5A72]">
              <span className="flex items-center gap-1">
                <MessageSquare className="h-3 w-3" strokeWidth={1.75} />
                {workspace.conversationCount}
              </span>
              <span className="flex items-center gap-1">
                <Database className="h-3 w-3" strokeWidth={1.75} />
                {workspace.knowledgeCount}
              </span>
              <span className="flex items-center gap-1">
                <Brain className="h-3 w-3" strokeWidth={1.75} />
                {workspace.memoryCount}
              </span>
            </div>
          </div>

          <span className="shrink-0 text-[11.5px] text-[#5A5A72]">
            {formatLastActive(workspace.lastActive)}
          </span>
        </Link>
      ))}
    </div>
  );
}

// ─── Empty state ──────────────────────────────────────────────────────────────

function EmptyActivityState() {
  return (
    <div className="relative flex flex-col items-center overflow-hidden rounded-[24px] border border-[rgba(255,255,255,0.06)] bg-[#0D0B14] px-10 py-24 text-center">
      <div className="pointer-events-none absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#7C3AED] opacity-[0.12] blur-[110px]" />

      <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-[rgba(124,58,237,0.12)]">
        <Activity className="h-7 w-7 text-[#A78BFA]" strokeWidth={1.5} />
      </div>

      <h2 className="relative mt-6 text-[22px] font-semibold tracking-tight text-white">
        Your Activity Stream Starts Here
      </h2>

      <p className="relative mt-3 max-w-[420px] text-sm leading-7 text-[#8B8BA3]">
        Every conversation, uploaded document, memory, and workspace update will
        appear here automatically as you work with Hymora.
      </p>

      <Link
        href="/dashboard/projects/new"
        className="
          relative mt-6 inline-flex items-center gap-2 rounded-[10px]
          bg-[#7C3AED] px-5 py-2.5
          text-[13px] font-medium text-white
          transition-all duration-150
          hover:opacity-90 active:scale-[0.98]
        "
      >
        <Plus className="h-[15px] w-[15px]" strokeWidth={2} />
        Create Workspace
      </Link>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function ActivityPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const {
    activities,
    workspaceSummaries,

    totalConversations,
    totalKnowledge,
    totalMemories,


    latestKnowledge,
    mostActiveWorkspace,
  } = await loadActivityData(userId);

  const latestMemory = activities.find(
    (item) => item.type === "memory"
  );

  const hasActivity = activities.length > 0;

  return (
    <div className="min-h-screen bg-[#05030A]">
      <div className="mx-auto max-w-6xl px-6 py-10">
        {/* ── Hero Card ───────────────────────────────────────────────────── */}

        <div className="relative overflow-hidden rounded-3xl border border-white/5 bg-gradient-to-br from-[#100D18] via-[#0D0B14] to-[#09080E] p-8">
          <div className="absolute inset-0 bg-gradient-to-br from-[#7C3AED]/10 via-transparent to-transparent" />

          <div className="relative flex items-start justify-between gap-6">
            <div>
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#7C3AED]/15">
                <Activity
                  className="h-6 w-6 text-[#A78BFA]"
                  strokeWidth={1.8}
                />
              </div>

              <h1 className="text-3xl font-semibold tracking-tight text-white">
                Activity Stream
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-7 text-[#8B8BA3]">
                Follow every conversation, memory, knowledge update and workspace change across your AI workspace in one unified timeline.
              </p>
            </div>

            <div className="hidden lg:flex items-center rounded-2xl border border-[#7C3AED]/10 bg-[#12101B] px-6 py-5 shadow-[0_12px_30px_rgba(124,58,237,0.08)]">
              <div>
                <p className="text-xs uppercase tracking-[0.12em] text-[#6B6B85]">
                  Total Activity
                </p>

                <p className="mt-2 text-3xl font-semibold text-white">
                  {activities.length}
                </p>
              </div>
            </div>
          </div>

        </div>

        {hasActivity && (
          <div className="mt-12 grid gap-4 grid-cols-2 lg:grid-cols-4" >
            <HeroStat
              icon={Activity}
              label="Activities"
              value={activities.length}
            />

            <HeroStat
              icon={MessageSquare}
              label="Conversations"
              value={totalConversations}
            />

            <HeroStat
              icon={Database}
              label="Knowledge"
              value={totalKnowledge}
            />

            <HeroStat
              icon={Brain}
              label="Memories"
              value={totalMemories}
            />
          </div>
        )}

        {hasActivity ? (

          <>
            {/* ── AI Highlights ───────────────────────────────────────────── */}

            <section className="mt-10">
              <div className="mb-5">
                <h2 className="text-xl font-semibold text-white">
                  AI Highlights
                </h2>

                <p className="mt-1 text-sm text-[#8B8BA3]">
                  Your AI workspace has been actively learning and organizing your work.
                </p>
              </div>

              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
                <div className="group rounded-2xl border border-white/5 bg-[#0D0B14] p-5 transition-all duration-300 hover:-translate-y-1 hover:border-[#7C3AED]/25 hover:bg-[#12101B]">
                  <p className="text-xs uppercase tracking-[0.08em] text-[#5A5A72]">
                    🧠 Learned
                  </p>

                  <p className="mt-3 flex-1 text-sm leading-6 text-white">
                    {latestMemory
                      ? latestMemory.description
                      : "No memory created yet"}
                  </p>

                  <p className="mt-4 text-xs text-[#8B8BA3]">
                    Latest memory stored by Hymora
                  </p>
                </div>

                <div className="flex min-h-[250px] flex-col rounded-2xl border border-white/5 bg-[#0D0B14] p-5">
                  <p className="text-xs uppercase tracking-[0.08em] text-[#5A5A72]">
                    📚 Indexed
                  </p>

                  <p className="mt-3 line-clamp-6 flex-1 overflow-hidden text-sm leading-6 text-white">
                    {latestKnowledge ?? "No knowledge uploaded"}
                  </p>

                  <p className="mt-4 text-xs text-[#8B8BA3]">
                    Most recently indexed knowledge
                  </p>
                </div>

                <div className="flex min-h-[250px] flex-col rounded-2xl border border-white/5 bg-[#0D0B14] p-5">
                  <p className="text-xs uppercase tracking-[0.08em] text-[#5A5A72]">
                    💬 Processed
                  </p>

                  <p className="mt-3 text-3xl font-semibold text-white">
                    {totalConversations}
                  </p>

                  <p className="mt-4 text-xs text-[#8B8BA3]">
                    User conversations processed across every workspace
                  </p>
                </div>

                <div className="flex min-h-[250px] flex-col rounded-2xl border border-white/5 bg-[#0D0B14] p-5">
                  <p className="text-xs uppercase tracking-[0.08em] text-[#5A5A72]">
                    ⚡ Active
                  </p>

                  <p className="mt-3 flex-1 text-sm leading-6 text-white">
                    {mostActiveWorkspace ?? "No workspace yet"}
                  </p>

                  <p className="mt-4 text-xs text-[#8B8BA3]">
                    Workspace with the latest activity
                  </p>
                </div>
              </div>
            </section>

            <div className="mt-8 space-y-4">
              <ActivitySearch />

              <div className="flex flex-wrap gap-2">
                <button className="rounded-full bg-[#7C3AED] px-4 py-2 text-xs font-medium text-white">
                  All
                </button>

                <button className="rounded-full border border-white/10 bg-[#0D0B14] px-4 py-2 text-xs text-[#A1A1B5] transition hover:border-[#7C3AED]/40 hover:text-white">
                  Conversations
                </button>

                <button className="rounded-full border border-white/10 bg-[#0D0B14] px-4 py-2 text-xs text-[#A1A1B5] transition hover:border-[#7C3AED]/40 hover:text-white">
                  Knowledge
                </button>

                <button className="rounded-full border border-white/10 bg-[#0D0B14] px-4 py-2 text-xs text-[#A1A1B5] transition hover:border-[#7C3AED]/40 hover:text-white">
                  Memories
                </button>

                <button className="rounded-full border border-white/10 bg-[#0D0B14] px-4 py-2 text-xs text-[#A1A1B5] transition hover:border-[#7C3AED]/40 hover:text-white">
                  Workspaces
                </button>
              </div>
            </div>

            {/* ── Timeline + Sidebar ───────────────────────────────────── */}

            <div className="mt-12 grid grid-cols-1 gap-10 lg:grid-cols-[1fr_320px]">



              {/* ── Timeline ──────────────────────────────────────────────── */}
              <section>
                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-white">
                    Timeline
                  </h2>

                  <p className="mt-1 text-sm text-[#8B8BA3]">
                    A chronological history of important activity across your workspaces.
                  </p>
                </div>

                <div className="relative">
                  <div className="absolute left-[18px] top-0 bottom-0 w-px bg-white/5" />

                  <ActivityTimeline activities={activities} />
                </div>
              </section>

              {/* ── Recent workspace activity ────────────────────────────── */}
              <aside>
                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-white">
                    Recent Workspaces
                  </h2>

                  <p className="mt-1 text-sm text-[#8B8BA3]">
                    Your most recently active AI workspaces.
                  </p>
                </div>

                <RecentWorkspaceActivity
                  workspaces={workspaceSummaries}
                />
              </aside>
            </div>
          </>
        ) : (
          <EmptyActivityState />
        )}
      </div>
    </div>
  );
}