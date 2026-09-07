"use client";

import {
  useEffect,
  useState,
  type ReactNode,
} from "react";


import {
  Brain,
  User,
  Mail,
  Shield,
  Sparkles,
  Database,
  Palette,
  AlertTriangle,
  ChevronRight,
  Check,
  Laptop,
  Smartphone,
  LogOut,
  Camera,
  Sliders,
} from "lucide-react";

import Image from "next/image";
import { useUser } from "@clerk/nextjs";



// ─── Types ─────────────────────────────────────────────────────────────────

type ResponseStyle = "concise" | "balanced" | "detailed";
type MemoryMode = "off" | "passive" | "active";
type AccentColor = "purple" | "blue" | "teal" | "amber" | "rose" | "slate";

// ─── Small primitives (kept local so this file is a drop-in replacement) ────

function SectionLabel({ index, title }: { index: string; title: string }) {
  return (
    <div className="mb-4 flex items-center gap-2">
      <span className="text-[10px] font-medium uppercase tracking-[0.14em] text-[#7C3AED]">
        {index} — {title}
      </span>
      <span className="h-px flex-1 bg-[#7C3AED]/20" />
    </div>
  );
}

function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={`relative h-[22px] w-[38px] shrink-0 rounded-full transition-colors duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7C3AED]/40 ${checked ? "bg-[#7C3AED]" : "bg-white/10"
        }`}
    >
      <span
        className={`absolute top-[3px] h-[16px] w-[16px] rounded-full bg-white shadow-sm transition-transform duration-150 ease-out ${checked ? "translate-x-[19px]" : "translate-x-[3px]"
          }`}
      />
    </button>
  );
}

function SegmentedControl<T extends string>({
  value,
  onChange,
  options,
}: {
  value: T;
  onChange: (v: T) => void;
  options: { value: T; label: string }[];
}) {
  return (
    <div className="inline-flex rounded-[8px] border-[0.5px] border-white/[0.08] bg-white/[0.03] p-[3px]">
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          className={`rounded-[6px] px-3 py-[6px] text-[12px] font-medium transition-all duration-150 ${value === opt.value
            ? "bg-[#7C3AED] text-white"
            : "text-[#8B8BA3] hover:text-[#E5E5F0]"
            }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

function FieldRow({
  icon,
  title,
  description,
  control,
}: {
  icon: ReactNode;
  title: string;
  description: string;
  control: ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-4 py-3.5 first:pt-0 last:pb-0">
      <div className="flex items-start gap-3">
        <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-[7px] bg-[#7C3AED]/10 text-[#A78BFA]">
          {icon}
        </div>
        <div>
          <div className="text-[13px] font-medium text-[#E5E5F0]">{title}</div>
          <div className="mt-0.5 text-[12px] leading-[1.5] text-[#5A5A72]">
            {description}
          </div>
        </div>
      </div>
      <div className="shrink-0 pt-0.5">{control}</div>
    </div>
  );
}

function Divider() {
  return <div className="h-[0.5px] w-full bg-white/[0.06]" />;
}

function Card({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-[14px] border-[0.5px] border-white/[0.08] bg-[#0D0B14]/70 backdrop-blur-xl ${className}`}
    >
      {children}
    </div>
  );
}

function CardHeader({
  icon,
  title,
  description,
}: {
  icon: ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-center gap-3 border-b-[0.5px] border-white/[0.06] px-5 py-4">
      <div className="flex h-8 w-8 items-center justify-center rounded-[8px] bg-[#7C3AED]/15 text-[#A78BFA]">
        {icon}
      </div>
      <div>
        <div className="text-[14px] font-medium text-[#E5E5F0]">{title}</div>
        <div className="text-[12px] text-[#5A5A72]">{description}</div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────────────────────────────────────

export default function SettingsPage() {
  const { user } = useUser();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [responseStyle, setResponseStyle] =
    useState<ResponseStyle>("balanced");

  const [memoryMode, setMemoryMode] =
    useState<MemoryMode>("active");

  const [creativity, setCreativity] =
    useState(60);

  const [autoSaveMemory, setAutoSaveMemory] =
    useState(true);

  const [
    autoKnowledgeExtraction,
    setAutoKnowledgeExtraction,
  ] = useState(true);

  const [defaultWorkspace, setDefaultWorkspace] =
    useState("");

  const [workspaces, setWorkspaces] =
    useState<
      {
        id: string;
        title: string;
      }[]
    >([]);

  const [theme, setTheme] =
    useState<"dark" | "system">("dark");

  const [accent, setAccent] =
    useState<AccentColor>("purple");

  const [deleteConfirmText, setDeleteConfirmText] =
    useState("");

  const [deleteOpen, setDeleteOpen] =
    useState(false);

  const [success, setSuccess] =
    useState("");

  const [error, setError] =
    useState("");

  useEffect(() => {
    async function loadSettings() {
      try {
        setLoading(true);

        const res = await fetch("/api/settings");

        const json = await res.json();

        if (!res.ok) {
          throw new Error(
            json.error ?? "Failed to load settings"
          );
        }

        const settings = json.settings;

        setWorkspaces(
          json.workspaces ?? []
        );

        setResponseStyle(settings.response_style);
        setMemoryMode(settings.memory_mode);
        setCreativity(settings.creativity);

        setTheme(settings.theme);
        setAccent(settings.accent);

        setAutoSaveMemory(
          settings.auto_save_memory
        );

        setAutoKnowledgeExtraction(
          settings.auto_knowledge_extraction
        );

        setDefaultWorkspace(
          settings.default_workspace
        );
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    }

    loadSettings();
  }, []);

  async function saveSettings() {
    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          responseStyle,
          memoryMode,
          creativity,
          theme,
          accent,
          autoSaveMemory,
          autoKnowledgeExtraction,
          defaultWorkspace,
        }),
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(
          json.error ?? "Unable to save settings"
        );
      }

      setSuccess("Settings saved successfully.");

      setTimeout(() => {
        setSuccess("");
      }, 2500);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);

        setTimeout(() => {
          setError("");
        }, 3500);
      }
    } finally {
      setSaving(false);
    }
  }

  const accentColors = [
    { value: "purple", hex: "#7C3AED" },
    { value: "blue", hex: "#378ADD" },
    { value: "teal", hex: "#1FA189" },
    { value: "amber", hex: "#BA7517" },
    { value: "rose", hex: "#E24B91" },
    { value: "slate", hex: "#64748B" },
  ] as const;

  return (
    <div className="min-h-screen bg-[#05030A] text-[#E5E5F0]">
      <div className="mx-auto max-w-[860px] px-5 py-10 md:px-10">

        {/* Hero */}

        <div className="relative mb-8 overflow-hidden rounded-2xl border border-white/10 bg-[#0D0B14] p-8">

          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#7C3AED]/20 blur-[120px]" />

          <div className="relative flex items-start justify-between">

            <div>

              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#7C3AED]/20 bg-[#7C3AED]/10 px-3 py-1 text-xs font-medium uppercase tracking-widest text-[#A78BFA]">

                <Sparkles size={12} />

                Hymora OS

              </div>

              <h1 className="text-3xl font-semibold text-white">

                Settings

              </h1>

              <p className="mt-2 max-w-xl text-sm text-[#8B8BA3]">

                Configure how Hymora thinks, remembers and works across every workspace.

              </p>

            </div>

            <button
              onClick={() => {
                if (!saving) {
                  void saveSettings();
                }
              }}
              disabled={saving || loading}
              className="rounded-xl bg-[#7C3AED] px-5 py-2.5 text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-50"
            >
              {saving
                ? "Saving..."
                : success
                  ? "Saved ✓"
                  : "Save Changes"}
            </button>

          </div>

          {success && (
            <div className="mt-5 rounded-lg border border-green-500/20 bg-green-500/10 px-4 py-3 text-sm text-green-400">
              {success}
            </div>
          )}

          {error && (
            <div className="mt-5 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}

        </div>

        <div className="flex flex-col gap-8">

          {/* Profile */}

          <section>

            <SectionLabel
              index="01"
              title="Profile"
            />

            <Card>

              <div className="flex flex-col gap-6 p-6 sm:flex-row sm:items-center">

                <div className="relative">

                  <div className="relative h-20 w-20 overflow-hidden rounded-full border border-white/10">

                    {user?.imageUrl ? (

                      <Image
                        src={user.imageUrl}
                        alt={user.fullName ?? "User"}
                        fill
                        className="object-cover"
                      />

                    ) : (

                      <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#7C3AED] to-[#4C1D95] text-xl font-semibold text-white">

                        {user?.firstName?.[0] ??
                          user?.fullName?.[0] ??
                          "U"}

                      </div>

                    )}

                  </div>

                  <button
                    className="absolute bottom-0 right-0 flex h-7 w-7 items-center justify-center rounded-full bg-[#1D1633] text-[#A78BFA]"
                  >
                    <Camera size={13} />
                  </button>

                </div>

                <div className="grid flex-1 grid-cols-1 gap-4 md:grid-cols-2">

                  <div>

                    <label className="mb-2 block text-xs text-[#8B8BA3]">
                      Full Name
                    </label>

                    <div className="relative">

                      <User
                        size={15}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-[#666]"
                      />

                      <input
                        readOnly
                        value={user?.fullName ?? ""}
                        className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 pl-10 pr-4 text-sm outline-none"
                      />

                    </div>

                  </div>

                  <div>

                    <label className="mb-2 block text-xs text-[#8B8BA3]">
                      Email
                    </label>

                    <div className="relative">

                      <Mail
                        size={15}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-[#666]"
                      />

                      <input
                        readOnly
                        value={user?.primaryEmailAddress?.emailAddress ?? ""}
                        className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 pl-10 pr-4 text-sm outline-none"
                      />

                    </div>

                  </div>

                </div>

                <div>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${loading
                      ? "border border-[#7C3AED]/30 bg-[#7C3AED]/10 text-[#A78BFA]"
                      : "border border-[#639922]/30 bg-[#639922]/10 text-[#639922]"
                      }`}
                  >
                    {loading ? "Loading..." : "Profile Ready"}
                  </span>

                </div>

              </div>

            </Card>

          </section>
          {/* ── 02 AI Preferences ───────────────────────────────── */}
          <section>
            <SectionLabel index="02" title="AI Preferences" />
            <Card>
              <CardHeader
                icon={<Brain size={16} />}
                title="How Hymora thinks"
                description="Tune the model's tone, memory, and risk-taking"
              />
              <div className="px-5">
                <FieldRow
                  icon={<Sliders size={14} />}
                  title="Response style"
                  description="Controls the length and tone of every reply"
                  control={
                    <SegmentedControl
                      value={responseStyle}
                      onChange={setResponseStyle}
                      options={[
                        { value: "concise", label: "Concise" },
                        { value: "balanced", label: "Balanced" },
                        { value: "detailed", label: "Detailed" },
                      ]}
                    />
                  }
                />
                <Divider />
                <FieldRow
                  icon={<Database size={14} />}
                  title="Memory mode"
                  description="How actively Hymora recalls past context"
                  control={
                    <SegmentedControl
                      value={memoryMode}
                      onChange={setMemoryMode}
                      options={[
                        { value: "off", label: "Off" },
                        { value: "passive", label: "Passive" },
                        { value: "active", label: "Active" },
                      ]}
                    />
                  }
                />
                <Divider />
                <div className="py-3.5">
                  <div className="mb-3 flex items-start gap-3">
                    <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-[7px] bg-[#7C3AED]/10 text-[#A78BFA]">
                      <Sparkles size={14} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-baseline justify-between gap-3">
                        <div className="text-[13px] font-medium text-[#E5E5F0]">
                          Creativity level
                        </div>
                        <span className="font-mono text-[12px] text-[#A78BFA]">
                          {creativity}%
                        </span>
                      </div>
                      <div className="mt-0.5 text-[12px] leading-[1.5] text-[#5A5A72]">
                        Higher values explore more unconventional answers
                      </div>
                    </div>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={creativity}
                    onChange={(e) => setCreativity(Number(e.target.value))}
                    className="h-1 w-full cursor-pointer appearance-none rounded-full bg-white/[0.08] accent-[#7C3AED] [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#7C3AED]"
                  />
                  <div className="mt-1.5 flex justify-between text-[10px] text-[#5A5A72]">
                    <span>Precise</span>
                    <span>Exploratory</span>
                  </div>
                </div>
              </div>
            </Card>
          </section>

          {/* ── 03 Workspace Preferences ────────────────────────── */}
          <section>
            <SectionLabel index="03" title="Workspace Preferences" />
            <Card>
              <CardHeader
                icon={<Sliders size={16} />}
                title="Defaults"
                description="Applied automatically across every workspace"
              />
              <div className="px-5">
                <FieldRow
                  icon={<Database size={14} />}
                  title="Auto save memory"
                  description="Capture key facts from sessions without asking"
                  control={
                    <Toggle
                      checked={autoSaveMemory}
                      onChange={setAutoSaveMemory}
                      label="Auto save memory"
                    />
                  }
                />
                <Divider />
                <FieldRow
                  icon={<Brain size={14} />}
                  title="Auto knowledge extraction"
                  description="Pull structured facts out of documents you share"
                  control={
                    <Toggle
                      checked={autoKnowledgeExtraction}
                      onChange={setAutoKnowledgeExtraction}
                      label="Auto knowledge extraction"
                    />
                  }
                />
                <Divider />
                <FieldRow
                  icon={<ChevronRight size={14} />}
                  title="Default workspace"
                  description="Where new memories land when none is specified"
                  control={
                    <select
                      value={defaultWorkspace}
                      onChange={(e) => setDefaultWorkspace(e.target.value)}
                      className="cursor-pointer rounded-[8px] border-[0.5px] border-white/[0.12] bg-white/[0.04] px-3 py-[7px] text-[13px] text-[#E5E5F0] outline-none transition-colors focus:border-[#7C3AED]/50 focus:ring-2 focus:ring-[#7C3AED]/40"
                    >
                      {workspaces.map((workspace) => (
                        <option
                          key={workspace.id}
                          value={workspace.id}
                        >
                          {workspace.title}
                        </option>
                      ))}
                    </select>
                  }
                />
              </div>
            </Card>
          </section>

          {/* ── 04 Appearance ───────────────────────────────────── */}
          <section>
            <SectionLabel index="04" title="Appearance" />
            <Card>
              <CardHeader
                icon={<Palette size={16} />}
                title="Look & feel"
                description="Hymora is designed for dark — light mode coming later"
              />
              <div className="px-5">
                <FieldRow
                  icon={<Laptop size={14} />}
                  title="Theme"
                  description="System will match Hymora once light mode ships"
                  control={
                    <SegmentedControl
                      value={theme}
                      onChange={setTheme}
                      options={[
                        { value: "dark", label: "Dark" },
                        { value: "system", label: "System" },
                      ]}
                    />
                  }
                />
                <Divider />
                <div className="py-3.5">
                  <div className="mb-3 flex items-start gap-3">
                    <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-[7px] bg-[#7C3AED]/10 text-[#A78BFA]">
                      <Palette size={14} />
                    </div>
                    <div>
                      <div className="text-[13px] font-medium text-[#E5E5F0]">
                        Accent color
                      </div>
                      <div className="mt-0.5 text-[12px] leading-[1.5] text-[#5A5A72]">
                        Used for focus rings, links, and active states
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2.5 pl-10">
                    {accentColors.map((c) => (
                      <button
                        key={c.value}
                        type="button"
                        aria-label={c.value}
                        onClick={() => setAccent(c.value)}
                        className="relative flex h-8 w-8 items-center justify-center rounded-full transition-transform duration-150 hover:scale-110"
                        style={{ backgroundColor: c.hex }}
                      >
                        {accent === c.value && (
                          <Check size={14} className="text-white" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          </section>

          {/* ── 05 Security ──────────────────────────────────────── */}
          <section>
            <SectionLabel index="05" title="Security" />
            <Card>
              <CardHeader
                icon={<Shield size={16} />}
                title="Authentication"
                description="Keep your workspace and memories protected"
              />
              <div className="px-5">
                <FieldRow
                  icon={<Shield size={14} />}
                  title="Authentication status"
                  description="Your account is securely managed by Clerk."
                  control={
                    <span className="inline-flex items-center gap-1.5 rounded-full border-[0.5px] border-[#639922]/30 bg-[#639922]/[0.12] px-2.5 py-1 text-[11px] font-medium text-[#639922]">
                      <Check size={11} />
                      Authenticated
                    </span>
                  }
                />
                <Divider />
                <div className="py-3.5">
                  <div className="mb-3 flex items-center gap-3">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[7px] bg-[#7C3AED]/10 text-[#A78BFA]">
                      <Laptop size={14} />
                    </div>
                    <div className="text-[13px] font-medium text-[#E5E5F0]">
                      Active session
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 pl-10">
                    <div className="flex items-center justify-between gap-3 rounded-[8px] border-[0.5px] border-white/[0.06] bg-white/[0.02] px-3 py-2.5">
                      <div className="flex items-center gap-2.5">
                        <Laptop size={14} className="text-[#5A5A72]" />
                        <div>
                          <div className="text-[12px] font-medium text-[#E5E5F0]">
                            Current Device
                          </div>
                          <div className="text-[11px] text-[#5A5A72]">
                            Current authenticated session
                          </div>
                        </div>
                      </div>
                      <span className="h-1.5 w-1.5 rounded-full bg-[#639922]" />
                    </div>
                    <div className="flex items-center justify-between gap-3 rounded-[8px] border-[0.5px] border-white/[0.06] bg-white/[0.02] px-3 py-2.5">
                      <div className="flex items-center gap-2.5">
                        <Smartphone size={14} className="text-[#5A5A72]" />
                        <div>
                          <div className="text-[12px] font-medium text-[#E5E5F0]">
                            Other Devices
                          </div>
                          <div className="text-[11px] text-[#5A5A72]">
                            Session information unavailable
                          </div>
                        </div>
                      </div>
                      <button
                        type="button"
                        disabled
                        className="flex items-center gap-1.5 rounded-[6px] border-[0.5px] border-white/[0.1] px-2.5 py-1 text-[11px] font-medium text-[#8B8BA3] opacity-50 transition-colors"
                      >
                        <LogOut size={11} />
                        Coming Soon
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </section>

          {/* ── 06 Danger Zone ───────────────────────────────────── */}
          <section>
            <SectionLabel index="06" title="Danger Zone" />
            <Card className="border-[#E24B4A]/[0.25]">
              <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-[8px] bg-[#E24B4A]/[0.12] text-[#E24B4A]">
                    <AlertTriangle size={16} />
                  </div>
                  <div>
                    <div className="text-[13px] font-medium text-[#E5E5F0]">
                      Delete account
                    </div>
                    <div className="mt-0.5 max-w-[420px] text-[12px] leading-[1.5] text-[#5A5A72]">
                      Permanently erases every memory, workspace, and saved
                      preference. This can&apos;t be undone.
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setDeleteOpen((v) => !v)}
                  className="shrink-0 rounded-[8px] border-[0.5px] border-[#E24B4A]/35 bg-[#E24B4A]/[0.12] px-[18px] py-[9px] text-[13px] font-medium text-[#E24B4A] transition-all duration-150 ease-out hover:opacity-90 active:scale-[0.98]"
                >
                  Delete account
                </button>
              </div>

              {deleteOpen && (
                <div className="border-t-[0.5px] border-[#E24B4A]/[0.2] bg-[#E24B4A]/[0.04] px-5 py-4">
                  <label className="mb-1.5 block text-[12px] font-medium text-[#A0A0B8]">
                    Type <span className="font-mono text-[#E24B4A]">delete my account</span> to confirm
                  </label>
                  <div className="flex flex-col gap-2 sm:flex-row">
                    <input
                      type="text"
                      value={deleteConfirmText}
                      onChange={(e) => setDeleteConfirmText(e.target.value)}
                      placeholder="delete my account"
                      className="flex-1 rounded-[8px] border-[0.5px] border-[#E24B4A]/30 bg-white/[0.04] px-3 py-2 text-[13px] text-[#E5E5F0] outline-none transition-colors placeholder:text-[#5A5A72] focus:ring-2 focus:ring-[#E24B4A]/30"
                    />
                    <button
                      type="button"
                      disabled={deleteConfirmText !== "delete my account"}
                      className="shrink-0 rounded-[8px] bg-[#E24B4A] px-[18px] py-2 text-[13px] font-medium text-white transition-opacity duration-150 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Coming Soon
                    </button>
                  </div>
                </div>
              )}
            </Card>
          </section>
        </div>

        <div className="mt-10 flex items-center justify-center gap-1.5 text-[11px] text-[#5A5A72]">
          <Brain size={12} />
          Hymora · AI Workspace That Never Forgets
        </div>
      </div>
    </div>
  );
}