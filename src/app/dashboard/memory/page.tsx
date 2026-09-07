import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import Link from "next/link";
import MemorySearch from "@/components/memory/memory-search";
import MemoryCard from "@/components/memory/MemoryCard";
import {
  Brain,
  Sparkles,
  Clock,
  ArrowRight,
  BookOpen,
  MessageSquare,
  Layers3,
} from "lucide-react";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// ─────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────

interface MemoryRecord {
  id: string;
  memory: string;
  category: string | null;
  created_at: string;
}

interface StatCardProps {
  icon: React.ElementType;
  label: string;
  value: number;
}



interface TimelineItemProps {
  title: string;
  date: string;
}

const PREFERENCE_CATEGORIES = new Set([
  "preference",
  "language",
  "framework",
  "response_style",
  "tone",
]);

// ─────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────

function formatRelativeDate(dateString: string) {
  const date = new Date(dateString);

  const diff =
    (Date.now() - date.getTime()) / 1000 / 60 / 60 / 24;

  if (diff < 1) return "Today";
  if (diff < 2) return "Yesterday";
  if (diff < 7) return `${Math.floor(diff)} days ago`;

  return date.toLocaleDateString();
}

function StatCard({
  icon: Icon,
  label,
  value,
}: StatCardProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/5 bg-[#0F0C16] p-5">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-[#7C3AED] via-[#A78BFA] to-transparent" />

      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#7C3AED]/10">
        <Icon
          className="h-5 w-5 text-[#A78BFA]"
          strokeWidth={1.8}
        />
      </div>

      <p className="mt-4 text-xs text-[#5A5A72]">
        {label}
      </p>

      <p className="mt-1 text-3xl font-semibold text-white">
        {value.toLocaleString()}
      </p>
    </div>
  );
}

function TimelineItem({
  title,
  date,
}: TimelineItemProps) {
  return (
    <div className="flex items-start gap-3 py-3">
      <div className="mt-2 h-2 w-2 rounded-full bg-[#7C3AED]" />

      <div>
        <p className="text-[14px] text-white">
          {title}
        </p>

        <p className="mt-1 text-xs text-[#5A5A72]">
          {date}
        </p>
      </div>
    </div>
  );
}
function EmptyState() {
  return (
    <div className="rounded-[24px] border border-dashed border-[rgba(124,58,237,0.18)] bg-[#0F0C16] px-8 py-20 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#7C3AED]/10">
        <Brain
          className="h-8 w-8 text-[#A78BFA]"
          strokeWidth={1.75}
        />
      </div>

      <h2 className="mt-6 text-2xl font-semibold text-white">
        No memories yet
      </h2>

      <p className="mx-auto mt-3 max-w-md text-[14px] leading-7 text-[#6F6B84]">
        Hymora automatically saves important information from your
        conversations so you never have to repeat yourself.
      </p>

      <Link
        href="/dashboard"
        className="mt-8 inline-flex items-center gap-2 rounded-xl bg-[#7C3AED] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#8B5CF6]"
      >
        Start Chatting
        <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}

function SectionHeading({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <div className="mb-5">
      <h2 className="text-lg font-semibold text-white">
        {title}
      </h2>

      {description && (
        <p className="mt-1 text-sm text-[#6F6B84]">
          {description}
        </p>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────────────────────

export default async function MemoryPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const [memoriesResult, projectsResult] = await Promise.all([
    supabase
      .from("user_memories")
      .select("*")
      .eq("clerk_user_id", userId)
      .order("created_at", {
        ascending: false,
      }),

    supabase
      .from("projects")
      .select("*")
      .eq("user_id", userId),
  ]);

  const memories: MemoryRecord[] =
    memoriesResult.data ?? [];

  const projects =
    projectsResult.data ?? [];

  const projectIds = projects.map((project) => project.id);

  const [
    messagesResult,
    knowledgeResult,
    chunksResult,
    filesResult,
  ] = await Promise.all([
    projectIds.length
      ? supabase
        .from("project_messages")
        .select("*")
        .in("project_id", projectIds)
      : Promise.resolve({ data: [] }),

    projectIds.length
      ? supabase
        .from("project_knowledge")
        .select("*")
        .in("project_id", projectIds)
      : Promise.resolve({ data: [] }),

    projectIds.length
      ? supabase
        .from("project_chunks")
        .select("*")
        .in("project_id", projectIds)
      : Promise.resolve({ data: [] }),

    projectIds.length
      ? supabase
        .from("project_files")
        .select("*")
        .in("project_id", projectIds)
      : Promise.resolve({ data: [] }),
  ]);

  const messages = Array.isArray(messagesResult.data)
    ? messagesResult.data
    : [];

  const knowledge = Array.isArray(knowledgeResult.data)
    ? knowledgeResult.data
    : [];

  const chunks = Array.isArray(chunksResult.data)
    ? chunksResult.data
    : [];

  const files = Array.isArray(filesResult.data)
    ? filesResult.data
    : [];





  const preferences = memories.filter((m) =>
    m.category
      ? PREFERENCE_CATEGORIES.has(m.category)
      : false
  );

  const facts = memories.filter(
    (m) =>
      !m.category ||
      !PREFERENCE_CATEGORIES.has(m.category)
  );
  const recentActivity = [
    ...memories.map((item) => ({
      id: item.id,
      type: "Memory",
      title: item.memory,
      created_at: item.created_at,
    })),

    ...knowledge.map((item: any) => ({
      id: item.id,
      type: "Knowledge",
      title: item.title || item.content || "Knowledge Added",
      created_at: item.created_at,
    })),

    ...messages
      .filter(
        (item: any) =>
          item.role === "assistant" &&
          item.content &&
          item.content !==
          "The requested information is not available in this workspace."
      )
      .map((item: any) => ({
        id: item.id,
        type: "Conversation",
        title: item.content,
        created_at: item.created_at,
      })),

    ...files.map((item: any) => ({
      id: item.id,
      type: "File",
      title: item.file_name,
      created_at: item.created_at,
    })),

    ...projects.map((item: any) => ({
      id: item.id,
      type: "Workspace",
      title: item.title,
      created_at: item.created_at,
    })),
  ]
    .sort(
      (a, b) =>
        new Date(b.created_at).getTime() -
        new Date(a.created_at).getTime()
    )
    .slice(0, 5);

  const totalMemories = memories.length;

  const totalPreferences = preferences.length;

  const totalFacts = facts.length;

  const totalProjects = projects.length;

  const totalMessages = messages.length;

  const totalKnowledge = knowledge.length;

  const totalChunks = chunks.length;

  const totalFiles = files.length;

  const hasMemories =
    totalMemories > 0 ||
    totalProjects > 0 ||
    totalMessages > 0 ||
    totalKnowledge > 0 ||
    totalChunks > 0 ||
    totalFiles > 0;

  const totalCategories = new Set(
    memories
      .map((memory) => memory.category)
      .filter(Boolean)
  ).size;

  const latestSaved =
    memories.length > 0
      ? formatRelativeDate(memories[0].created_at)
      : "Never";



  const topCategory =
    memories[0]?.category ?? "General";

  const latestMemory =
    memories[0]?.memory ?? "No memories yet";

  const latestPreference =
    preferences[0]?.memory ?? "No preference saved";

  const latestFact =
    facts[0]?.memory ?? "No fact saved";



  return (
    <div className="min-h-screen bg-[#05030A]">
      <div className="mx-auto max-w-7xl px-6 py-10">
        {/* Hero */}

        <div className="relative mb-10 overflow-hidden rounded-3xl border border-white/5 bg-[#0F0C16] p-8">
          <div className="absolute inset-0 bg-gradient-to-br from-[#7C3AED]/10 via-transparent to-transparent" />

          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

            <div>
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#7C3AED]/15">
                <Brain
                  className="h-6 w-6 text-[#A78BFA]"
                  strokeWidth={1.8}
                />
              </div>

              <h1 className="text-3xl font-semibold tracking-tight text-white">
                Memory Center
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-7 text-[#8B8BA3]">
                Hymora remembers your preferences, important facts, and long-term context
                so every conversation becomes smarter without asking you to repeat yourself.
              </p>
            </div>

            <div className="hidden lg:flex items-center rounded-2xl border border-white/5 bg-[#12101B] px-5 py-4">
              <div>
                <p className="text-xs uppercase tracking-[0.12em] text-[#6B6B85]">
                  Total Memories
                </p>

                <p className="mt-2 text-3xl font-semibold text-white">
                  {totalMemories}
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* Stats */}

        <div className="mb-10 grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-5">

          <StatCard
            icon={Brain}
            label="Memories"
            value={totalMemories}
          />

          <StatCard
            icon={Sparkles}
            label="Preferences"
            value={totalPreferences}
          />

          <StatCard
            icon={BookOpen}
            label="Facts"
            value={totalFacts}
          />

          <StatCard
            icon={Layers3}
            label="Categories"
            value={totalCategories}
          />

          <div className="relative overflow-hidden rounded-2xl border border-white/5 bg-[#0F0C16] p-5">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-[#7C3AED] via-[#A78BFA] to-transparent" />

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#7C3AED]/10">
              <Clock
                className="h-5 w-5 text-[#A78BFA]"
                strokeWidth={1.8}
              />
            </div>

            <p className="mt-4 text-xs text-[#5A5A72]">
              Latest Saved
            </p>

            <p className="mt-1 text-2xl font-semibold text-white">
              {latestSaved}
            </p>
          </div>

        </div>

        {hasMemories ? (
          <>

            {/* Memory Insights */}

            <section className="mb-10">
              <SectionHeading
                title="Memory Insights"
                description="What Hymora currently remembers about you."
              />

              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">

                <div className="rounded-2xl border border-white/5 bg-[#0F0C16] p-5">
                  <p className="text-xs uppercase tracking-[0.08em] text-[#5A5A72]">
                    🧠 Latest Memory
                  </p>

                  <p className="mt-3 line-clamp-3 text-[14px] leading-6 text-white">
                    {latestMemory}
                  </p>

                  <p className="mt-4 text-xs text-[#8B8BA3]">
                    Most recently saved memory
                  </p>
                </div>

                <div className="rounded-2xl border border-white/5 bg-[#0F0C16] p-5">
                  <p className="text-xs uppercase tracking-[0.08em] text-[#5A5A72]">
                    ❤️ Latest Preference
                  </p>

                  <p className="mt-3 line-clamp-3 text-[14px] leading-6 text-white">
                    {latestPreference}
                  </p>

                  <p className="mt-4 text-xs text-[#8B8BA3]">
                    Latest user preference remembered
                  </p>
                </div>

                <div className="rounded-2xl border border-white/5 bg-[#0F0C16] p-5">
                  <p className="text-xs uppercase tracking-[0.08em] text-[#5A5A72]">
                    📌 Latest Fact
                  </p>

                  <p className="mt-3 line-clamp-3 text-[14px] leading-6 text-white">
                    {latestFact}
                  </p>

                  <p className="mt-4 text-xs text-[#8B8BA3]">
                    Latest important fact remembered
                  </p>
                </div>

                <div className="rounded-2xl border border-white/5 bg-[#0F0C16] p-5">
                  <p className="text-xs uppercase tracking-[0.08em] text-[#5A5A72]">
                    🏷️ Top Category
                  </p>

                  <p className="mt-3 text-lg font-semibold text-white">
                    {topCategory}
                  </p>

                  <p className="mt-4 text-xs text-[#8B8BA3]">
                    Most recent memory category
                  </p>
                </div>

              </div>
            </section>

            {/* Search & Filter */}

            <MemorySearch
              memories={memories}
              knowledge={knowledge}
              messages={messages}
              files={files}
              projects={projects}
            />

            {/* Memory Cards */}

            <section className="mb-12">
              <SectionHeading
                title="Saved Memories"
                description={`${totalMemories} memories currently stored by Hymora.`}
              />

              <div className="space-y-4">
                {memories.length === 0 && (
                  <div className="rounded-2xl border border-dashed border-white/10 bg-[#0F0C16] p-10 text-center">
                    <Brain className="mx-auto h-10 w-10 text-[#A78BFA]" />
                    <p className="mt-4 text-sm text-[#8B8BA3]">
                      No memories have been saved yet.
                    </p>
                  </div>
                )}
                {memories.length > 0 &&
                  memories.map((memory) => (
                    <MemoryCard
                      key={memory.id}
                      memory={memory}
                    />
                  ))}
              </div>
            </section>


            {/* Knowledge

<section className="mb-12">
  <SectionHeading
    title="Knowledge"
    description="Knowledge currently indexed by Hymora."
  />

  {knowledge.length > 0 ? (
    <div className="space-y-3">
      {knowledge.slice(0, 8).map((item: any) => (
        <div
          key={item.id}
          className="rounded-2xl border border-white/5 bg-[#0F0C16] p-5"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#7C3AED]/10">
                <BookOpen
                  className="h-5 w-5 text-[#A78BFA]"
                  strokeWidth={1.8}
                />
              </div>

              <div className="min-w-0">
                <p className="text-[15px] font-medium text-white">
                  {item.title || "Untitled Knowledge"}
                </p>

                <p className="mt-2 line-clamp-2 text-[13px] leading-6 text-[#6F6B84]">
                  {item.content}
                </p>

                <p className="mt-3 text-[12px] text-[#5A5A72]">
                  {formatRelativeDate(item.created_at)}
                </p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  ) : (
    <div className="rounded-2xl border border-dashed border-white/10 bg-[#0F0C16] p-8 text-center text-[#6F6B84]">
      No knowledge indexed yet.
    </div>
  )}
</section> */}

            {/* Recent Conversations

<section className="mb-12">
  <SectionHeading
    title="Recent Conversations"
    description="Latest AI conversations across your workspaces."
  />

  {messages.length > 0 ? (
    <div className="space-y-3">
      {messages.slice(0, 8).map((message: any) => (
        <div
          key={message.id}
          className="rounded-2xl border border-white/5 bg-[#0F0C16] p-5"
        >
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#7C3AED]/10">
              <MessageSquare
                className="h-5 w-5 text-[#A78BFA]"
                strokeWidth={1.8}
              />
            </div>

            <div className="min-w-0 flex-1">
              <p className="line-clamp-2 text-[15px] leading-6 text-white">
                {message.content}
              </p>

              <div className="mt-3 flex items-center justify-between">
                <span className="rounded-full border border-white/5 bg-white/[0.03] px-2 py-1 text-[11px] text-[#8B8BA3]">
                  {message.role}
                </span>

                <span className="text-[12px] text-[#5A5A72]">
                  {formatRelativeDate(message.created_at)}
                </span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  ) : (
    <div className="rounded-2xl border border-dashed border-white/10 bg-[#0F0C16] p-8 text-center text-[#6F6B84]">
      No conversations yet.
    </div>
  )}
</section> */}

            {/* Uploaded Files

<section className="mb-12">
  <SectionHeading
    title="Uploaded Files"
    description="Files currently connected to your AI memory."
  />

  {files.length > 0 ? (
    <div className="space-y-3">
      {files.slice(0, 8).map((file: any) => (
        <div
          key={file.id}
          className="rounded-2xl border border-white/5 bg-[#0F0C16] p-5 transition-all duration-200 hover:border-[#7C3AED]/30"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#7C3AED]/10">
                <BookOpen
                  className="h-5 w-5 text-[#A78BFA]"
                  strokeWidth={1.8}
                />
              </div>

              <div className="min-w-0">
                <p className="truncate text-[15px] font-medium text-white">
                  {file.file_name}
                </p>

                <div className="mt-2 flex flex-wrap gap-2">
                  {file.file_type && (
                    <span className="rounded-full border border-white/5 bg-white/[0.03] px-2 py-1 text-[11px] text-[#8B8BA3]">
                      {file.file_type}
                    </span>
                  )}

                  {file.file_size && (
                    <span className="rounded-full border border-white/5 bg-white/[0.03] px-2 py-1 text-[11px] text-[#8B8BA3]">
                      {(file.file_size / 1024).toFixed(1)} KB
                    </span>
                  )}
                </div>

                <p className="mt-3 text-[12px] text-[#5A5A72]">
                  {formatRelativeDate(file.created_at)}
                </p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  ) : (
    <div className="rounded-2xl border border-dashed border-white/10 bg-[#0F0C16] p-8 text-center text-[#6F6B84]">
      No uploaded files yet.
    </div>
  )}
</section> */}


          </>
        ) : (
          <EmptyState />
        )}
      </div>
    </div>
  );
}