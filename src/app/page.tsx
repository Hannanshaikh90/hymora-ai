"use client";

import { useState, useEffect, useRef } from "react";
import MobileNav from "@/components/landing/mobile-nav";
import Link from "next/link";
import {
  Brain,
  FolderOpen,
  MessageSquare,
  FileText,
  Layers,
  Zap,
  ArrowRight,
  Check,
  Plus,
  Minus,
  Sparkles,
  Database,
  BookOpen,
  Shield,
} from "lucide-react";
import Image from "next/image";

// ─── Types ────────────────────────────────────────────────────────────────────

type FAQItem = { q: string; a: string };

// ─── Utils ────────────────────────────────────────────────────────────────────

function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(" ");
}

// ─── Hooks ────────────────────────────────────────────────────────────────────

function useInView(threshold = 0.12) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          obs.disconnect();
        }
      },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);

  return { ref, inView };
}

// ─── Animation ────────────────────────────────────────────────────────────────

function Reveal({
  children,
  delay = 0,
  className,
  direction = "up",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  direction?: "up" | "down" | "none";
}) {
  const { ref, inView } = useInView();
  const offsets = { up: "20px", down: "-20px", none: "0px" };
  return (
    <div
      ref={ref}
      className={cn(className)}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : `translateY(${offsets[direction]})`,
        transition: `opacity 0.55s cubic-bezier(.22,.61,.36,1) ${delay}ms, transform 0.55s cubic-bezier(.22,.61,.36,1) ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

// ─── Section Label ────────────────────────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-[#7C3AED] mb-4">
      {children}
    </p>
  );
}

// ─── Noise ────────────────────────────────────────────────────────────────────

function Noise() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-50 opacity-[0.018]"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        backgroundSize: "256px 256px",
      }}
    />
  );
}

// ─── Navbar ───────────────────────────────────────────────────────────────────

function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 inset-x-0 z-40 transition-all duration-300",
        scrolled
          ? "bg-[#05030A]/85 backdrop-blur-2xl border-b border-white/[0.05]"
          : "bg-transparent"
      )}
    >
      <nav
        aria-label="Primary"
        className="max-w-6xl mx-auto px-6 h-[56px] flex items-center justify-between"
      >
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/brand/icon.png"
            alt="Hymora logo"
            width={36}
            height={36}
            priority
            className="h-9 w-9 rounded-xl"
            sizes="36px"
          />

          <span className="text-[15px] font-semibold tracking-[-0.02em] text-[#E5E5F0]">
            Hymora
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {[
            { label: "Why Hymora", id: "why-hymora" },
            { label: "How it Works", id: "how-it-works" },
            { label: "Features", id: "features" },
            { label: "Pricing", id: "pricing" },
          ].map(({ label, id }) => (
            <a
              key={id}
              href={`#${id}`}
              className="text-[13px] text-[#8B8BA3] transition-colors duration-150 hover:text-[#E5E5F0] focus:outline-none focus:text-[#E5E5F0]"
            >
              {label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-3">

          {/* Desktop */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/sign-in"
              className="text-[13px] text-[#8B8BA3] hover:text-[#E5E5F0] transition-colors duration-150"
            >
              Sign in
            </Link>

            <Link
              href="/sign-up"
              className="text-[13px] font-medium px-4 h-9 inline-flex items-center rounded-[8px] bg-[#7C3AED] text-white hover:opacity-90 active:scale-[0.98] transition-all duration-150 shadow-md shadow-[#7C3AED]/25"
            >
              Get Started
            </Link>
          </div>

          {/* Mobile */}
          <MobileNav />

        </div>
      </nav>
    </header>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────

function Hero() {
  return (
    <section className="relative overflow-hidden px-6 pt-28 pb-20 md:pt-40 md:pb-24">
      <div
        aria-hidden
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[520px] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 0%, rgba(124,58,237,0.14) 0%, transparent 70%)",
        }}
      />

      <div className="relative mx-auto grid max-w-6xl grid-cols-1 items-center gap-10 lg:grid-cols-[1fr_1fr] lg:gap-16">
        {/* Left: copy */}
        <div className="text-left">
          <div
            className="mb-6 inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#5B21B6]/40 bg-[rgba(124,58,237,0.12)]"
            style={{ animation: "hymFadeDown 0.6s ease 0.05s both" }}
          >
            <Sparkles className="w-3 h-3 text-[#A78BFA]" aria-hidden />
            <span className="text-[11px] font-medium tracking-[0.1em] uppercase text-[#A78BFA]">
              AI Workspace with Persistent Memory
            </span>
          </div>

          <h1
            className="text-[clamp(36px,5vw,58px)] font-medium tracking-[-0.03em] leading-[1.08] text-[#E5E5F0]"
            style={{ animation: "hymFadeDown 0.65s ease 0.15s both" }}
          >
            The AI workspace that
            <br />
            <span className="text-[#7C3AED]">remembers everything</span>
          </h1>

          <p
            className="mt-6 max-w-[460px] text-[15px] text-[#8B8BA3] leading-[1.7]"
            style={{ animation: "hymFadeDown 0.65s ease 0.25s both" }}
          >
            Create a dedicated AI workspace for every project. Upload documents,
            build knowledge, and chat naturally—Hymora remembers your files,
            conversations, and decisions so you never have to repeat yourself.
          </p>

          <div
            className="mt-9 flex flex-col sm:flex-row items-start sm:items-center gap-3"
            style={{ animation: "hymFadeDown 0.65s ease 0.35s both" }}
          >
            <Link
              href="/sign-up"
              className="group inline-flex items-center gap-2 bg-[#7C3AED] text-white text-[13px] font-medium px-6 h-10 rounded-[8px] hover:opacity-90 active:scale-[0.98] transition-all duration-150 shadow-xl shadow-[#7C3AED]/25"
            >
              Start for Free
              <ArrowRight
                className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform"
                aria-hidden
              />
            </Link>
            <a
              href="#how-it-works"
              className="inline-flex items-center gap-2 text-[13px] font-medium text-[#8B8BA3] px-5 h-10 rounded-[8px] border border-white/[0.08] hover:border-white/[0.14] hover:text-[#E5E5F0] transition-all duration-150"
            >
              See how it works
            </a>
          </div>

          <p
            className="mt-4 text-[12px] text-[#5A5A72]"
            style={{ animation: "hymFadeDown 0.65s ease 0.45s both" }}
          >
            Free forever plan • No credit card required • Cancel anytime
          </p>

        </div>

        {/* Right: real product preview */}
        <div style={{ animation: "hymFadeUp 0.8s ease 0.3s both" }}>
          <ProductPreview />
        </div>
      </div>

      <style>{`
        @keyframes hymFadeDown {
          from { opacity: 0; transform: translateY(-14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes hymFadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
}

function ProductPreview() {
  return (
    <div className="rounded-2xl border border-white/[0.07] bg-[#0D0B14] overflow-hidden shadow-2xl shadow-black/70">
      {/* Chrome bar */}
      <div className="flex items-center gap-2 px-5 py-3 border-b border-white/[0.05]">
        <div className="w-3 h-3 rounded-full bg-[#FF5F57]" />
        <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
        <div className="w-3 h-3 rounded-full bg-[#28CA41]" />
        <div className="flex-1 mx-4">
          <div className="h-6 max-w-xs mx-auto rounded-md bg-white/[0.04] flex items-center justify-center px-3">
            <span className="text-[10px] text-[#5A5A72] font-mono">
  hymora.ai/workspaces/brand-redesign
</span>
          </div>
        </div>
      </div>

      {/* Layout */}
      <div className="grid grid-cols-[160px_1fr] min-h-[300px]">
        {/* Sidebar */}
        <div className="border-r border-white/[0.05] p-3 space-y-0.5">
          <p className="text-[9px] uppercase tracking-widest text-[#5A5A72] px-2 mb-2 mt-1">
            Workspaces
          </p>
          {[
            { name: "Brand Redesign", active: true },
            { name: "Q4 Campaign", active: false },
            { name: "Client Onboarding", active: false },
          ].map((ws) => (
            <div
              key={ws.name}
              className={cn(
                "px-2.5 py-2 rounded-[6px] text-[11px] flex items-center gap-2 cursor-default truncate",
                ws.active
                  ? "bg-[rgba(124,58,237,0.15)] text-[#A78BFA]"
                  : "text-[#5A5A72]"
              )}
            >
              <FolderOpen className="w-3 h-3 flex-shrink-0" aria-hidden />
              {ws.name}
            </div>
          ))}

          <div className="mt-3 pt-3 border-t border-white/[0.05]">
            <p className="text-[9px] uppercase tracking-widest text-[#5A5A72] px-2 mb-2">
              Memory
            </p>
            {[
              { Icon: FileText, label: "12 Files" },
              { Icon: Database, label: "24 Knowledge Entries" },
              { Icon: MessageSquare, label: "38 Conversations" },
            ].map(({ Icon, label }) => (
              <div
                key={label}
                className="px-2.5 py-1.5 text-[11px] text-[#5A5A72] flex items-center gap-2"
              >
                <Icon className="w-3 h-3" aria-hidden />
                {label}
              </div>
            ))}
          </div>
        </div>

        {/* Chat */}
        <div className="p-5 flex flex-col justify-end gap-3">
          <div className="flex justify-end">
            <div className="bg-white/[0.05] rounded-2xl rounded-tr-sm px-4 py-2.5 text-[12px] text-[#8B8BA3] max-w-xs leading-relaxed">
              What color palette did we decide for the rebrand?
            </div>
          </div>
          <div className="flex gap-3 items-start">
            <div className="w-6 h-6 rounded-full bg-[#7C3AED] flex-shrink-0 flex items-center justify-center mt-0.5">
              <Brain className="w-3 h-3 text-white" aria-hidden />
            </div>
            <div className="bg-[rgba(124,58,237,0.1)] border border-[rgba(124,58,237,0.2)] rounded-2xl rounded-tl-sm px-4 py-2.5 text-[12px] text-[#E5E5F0] max-w-sm leading-relaxed">
              From your Brand Redesign workspace: you decided on{" "}
              <span className="text-[#A78BFA] font-medium">Deep Navy #0F172A</span>{" "}
              with{" "}
              <span className="text-[#A78BFA] font-medium">Electric Violet #7C3AED</span>{" "}
              as the accent — finalized in your design review.
            </div>
          </div>

          <div className="mt-1 flex items-center gap-2 px-1">
            <div className="w-4 h-4 rounded-[4px] bg-[rgba(124,58,237,0.2)] flex items-center justify-center">
              <Database className="w-2.5 h-2.5 text-[#A78BFA]" aria-hidden />
            </div>
            <span className="text-[10px] text-[#5A5A72]">
              Retrieved from your workspace knowledge and memory
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Why Hymora ───────────────────────────────────────────────────────────────

const comparisons = [
  {
    before: "Most AI tools answer questions.",
    after: "Hymora builds long-term knowledge.",
  },
  {
    before: "Most AI tools forget.",
    after: "Hymora remembers.",
  },
  {
    before: "Most AI tools restart.",
    after: "Hymora continues your work.",
  },
];

function WhyHymora() {
  return (
    <section id="why-hymora" className="py-24 px-6 border-t border-white/[0.04]">
      <div className="max-w-3xl mx-auto text-center">
        <Reveal>
          <SectionLabel>Why Hymora</SectionLabel>
          <h2 className="text-[clamp(26px,4vw,38px)] font-medium tracking-[-0.02em] leading-[1.2] text-[#E5E5F0]">
            A different kind of AI
          </h2>
        </Reveal>

        <div className="mt-14 space-y-8">
          {comparisons.map(({ before, after }, i) => (
            <Reveal key={before} delay={i * 80}>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6">
                <p className="text-[16px] sm:text-[19px] text-[#5A5A72] leading-snug">
                  {before}
                </p>
                <div className="hidden sm:block w-8 h-px bg-white/[0.1]" aria-hidden />
                <p className="text-[16px] sm:text-[19px] font-medium text-[#E5E5F0] leading-snug">
                  {after}
                </p>
              </div>
              {i < comparisons.length - 1 && (
                <div className="mt-8 h-px w-16 bg-white/[0.05] mx-auto" aria-hidden />
              )}
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Problem ──────────────────────────────────────────────────────────────────

const problems = [
  {
    icon: MessageSquare,
    title: "AI forgets conversations",
    body: "Every new chat starts from zero. You re-explain the same project, goals, and decisions each time.",
  },
  {
    icon: Layers,
    title: "Knowledge gets scattered",
    body: "Files, briefs, and decisions live across different tools — disconnected from the AI you're working with.",
  },
  {
    icon: FolderOpen,
    title: "Projects lose context",
    body: "Step away for a week and you're back to square one, rebuilding context the AI should have kept.",
  },
];

function Problem() {
  return (
    <section className="py-24 px-6 border-t border-white/[0.04]">
      <div className="max-w-5xl mx-auto">
        <Reveal className="text-center mb-14">
          <SectionLabel>The Problem</SectionLabel>
          <h2 className="text-[clamp(26px,4vw,38px)] font-medium tracking-[-0.02em] leading-[1.2] text-[#E5E5F0]">
            AI forgets. Your work shouldn&apos;t.
          </h2>
        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {problems.map(({ icon: Icon, title, body }, i) => (
            <Reveal key={title} delay={i * 70}>
              <div className="h-full p-6 rounded-[12px] border border-[rgba(255,255,255,0.06)] bg-[#0D0B14]">
                <div className="w-8 h-8 rounded-[8px] border border-white/[0.07] bg-white/[0.03] flex items-center justify-center mb-4">
                  <Icon className="w-3.5 h-3.5 text-[#8B8BA3]" aria-hidden />
                </div>
                <h3 className="text-[14px] font-medium text-[#E5E5F0] mb-2">
                  {title}
                </h3>
                <p className="text-[13px] text-[#8B8BA3] leading-[1.6]">{body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Solution: Four Pillars ───────────────────────────────────────────────────

const pillars = [
  {
    icon: FolderOpen,
    label: "Projects",
    detail: "An isolated workspace for every client, project, or goal — nothing bleeds together.",
  },
  {
    icon: BookOpen,
    label: "Knowledge",
    detail: "Upload documents and PDFs once. Hymora indexes them and keeps them permanently referenceable.",
  },
  {
    icon: MessageSquare,
    label: "Conversations",
    detail: "Every chat in a workspace builds on the last — pick up exactly where you left off.",
  },
  {
    icon: Brain,
    label: "Memory",
    detail: "Decisions, preferences, and context accumulate automatically, so the AI already knows your work.",
  },
];

function Solution() {
  return (
    <section className="py-24 px-6 border-t border-white/[0.04] relative">
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 55% 40% at 50% 60%, rgba(124,58,237,0.06) 0%, transparent 70%)",
        }}
      />
      <div className="max-w-6xl mx-auto relative">
        <Reveal className="text-center mb-14">
          <SectionLabel>The Solution</SectionLabel>
          <h2 className="text-[clamp(26px,4vw,38px)] font-medium tracking-[-0.02em] leading-[1.2] text-[#E5E5F0]">
            Four pillars, one workspace
          </h2>
        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {pillars.map(({ icon: Icon, label, detail }, i) => (
            <Reveal key={label} delay={i * 65}>
              <div className="h-full p-5 rounded-[12px] border border-white/[0.05] bg-[#0D0B14] hover:border-[rgba(124,58,237,0.25)] hover:bg-[rgba(124,58,237,0.04)] transition-all duration-200">
                <div className="w-8 h-8 rounded-[8px] bg-[rgba(124,58,237,0.15)] border border-[rgba(124,58,237,0.25)] flex items-center justify-center mb-4">
                  <Icon className="w-3.5 h-3.5 text-[#A78BFA]" aria-hidden />
                </div>
                <p className="text-[13px] font-medium text-[#E5E5F0] mb-1.5">
                  {label}
                </p>
                <p className="text-[12px] text-[#8B8BA3] leading-[1.6]">
                  {detail}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Workspace Preview ─────────────────────────────────────────────────────────

function WorkspacePreview() {
  return (
    <section
      id="workspace-preview"
      className="py-24 px-6 border-t border-white/[0.04]"
    >
      <div className="max-w-6xl mx-auto">
        <Reveal className="text-center mb-14">
          <SectionLabel>Inside a Workspace</SectionLabel>
          <h2 className="text-[clamp(26px,4vw,38px)] font-medium tracking-[-0.02em] leading-[1.2] text-[#E5E5F0]">
            Everything in one place,
            <br />
            <span className="text-[#5A5A72]">always remembered.</span>
          </h2>
        </Reveal>

        <Reveal delay={80}>
          <div className="rounded-[14px] border border-[rgba(255,255,255,0.07)] bg-[#0D0B14] p-6 max-w-3xl mx-auto">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-8 h-8 rounded-[8px] bg-[#7C3AED] flex items-center justify-center shadow-md shadow-[#7C3AED]/30">
                <Brain className="w-4 h-4 text-white" aria-hidden />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-medium text-[#E5E5F0] truncate">
                  Brand Redesign
                </p>
                <p className="text-[10px] text-[#5A5A72]">Active workspace</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 mb-5">
              {[
                { label: "Files", value: "12", Icon: FileText },
                { label: "Chats", value: "38", Icon: MessageSquare },
                { label: "Knowledge", value: "4", Icon: Database },
              ].map(({ label, value, Icon }) => (
                <div
                  key={label}
                  className="rounded-[8px] border border-white/[0.06] bg-[#141120] p-3 text-center"
                >
                  <Icon className="w-3 h-3 text-[#A78BFA] mx-auto mb-1.5" aria-hidden />
                  <p className="text-[15px] font-medium text-[#E5E5F0]">{value}</p>
                  <p className="text-[10px] text-[#5A5A72]">{label}</p>
                </div>
              ))}
            </div>

            <div className="space-y-1">
              <p className="text-[10px] uppercase tracking-[0.1em] text-[#5A5A72] mb-1.5">
                Recent Files
              </p>
              {["Brand Brief v3.pdf", "Color System.fig", "Moodboard.pdf"].map(
                (f) => (
                  <div
                    key={f}
                    className="flex items-center gap-2.5 px-2 py-2 rounded-[6px] hover:bg-white/[0.03] transition-colors"
                  >
                    <FileText className="w-3 h-3 text-[#5A5A72]" aria-hidden />
                    <span className="text-[11px] text-[#8B8BA3]">{f}</span>
                  </div>
                )
              )}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ─── Features ─────────────────────────────────────────────────────────────────

const features = [
  {
    icon: FolderOpen,
    title: "Project Workspaces",
    description:
      "Each project lives in its own isolated environment — goals, files, and conversations, scoped and searchable.",
  },
  {
    icon: Brain,
    title: "Persistent Memory",
    description:
      "Hymora carries context across every session, so you never re-explain decisions you've already made.",
  },
  {
    icon: BookOpen,
    title: "Knowledge Base",
    description:
      "Store facts, guidelines, and decisions the AI references automatically in every response.",
  },
  {
    icon: FileText,
    title: "Document Intelligence",
    description:
      "Upload PDFs and docs. Hymora parses and indexes them so they're permanently referenceable.",
  },
  {
    icon: Zap,
    title: "Context-Aware AI",
    description:
      "Every response is grounded in your workspace's history — no prompting required to establish who you are.",
  },
];

function Features() {
  return (
    <section id="features" className="py-24 px-6 border-t border-white/[0.04]">
      <div className="max-w-6xl mx-auto">
        <Reveal className="text-center mb-14">
          <SectionLabel>Features</SectionLabel>
          <h2 className="text-[clamp(26px,4vw,38px)] font-medium tracking-[-0.02em] leading-[1.2] text-[#E5E5F0]">
            Built to remember
          </h2>
        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {features.map(({ icon: Icon, title, description }, i) => (
            <Reveal key={title} delay={i * 55}>
              <div className="h-full p-5 rounded-[12px] border border-[rgba(255,255,255,0.06)] bg-[#0D0B14] hover:border-[rgba(124,58,237,0.25)] transition-all duration-200">
                <div className="w-9 h-9 rounded-[8px] bg-[rgba(124,58,237,0.15)] border border-[rgba(124,58,237,0.2)] flex items-center justify-center mb-4">
                  <Icon className="w-4 h-4 text-[#A78BFA]" aria-hidden />
                </div>
                <h3 className="text-[13px] font-medium text-[#E5E5F0] mb-2">
                  {title}
                </h3>
                <p className="text-[12px] text-[#8B8BA3] leading-[1.65]">
                  {description}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── How It Works ───────────────────────────────────────────────────────────────

const steps = [
  {
    title: "Create a Workspace",
    body: "Start a dedicated workspace for your project, client, research, or business idea.",
  },
  {
    title: "Add Knowledge",
    body: "Upload PDFs, documents, and project knowledge so Hymora understands your work.",
  },
  {
    title: "Chat with AI",
    body: "Ask questions, brainstorm ideas, and work naturally with AI using your project context.",
  },
  {
    title: "Hymora Remembers",
    body: "Every conversation, knowledge item, and project decision stays available for future chats.",
  },
];

function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 px-6 border-t border-white/[0.04]">
      <div className="max-w-5xl mx-auto">
        <Reveal className="text-center mb-16">
          <SectionLabel>How It Works</SectionLabel>
          <h2 className="text-[clamp(26px,4vw,38px)] font-medium tracking-[-0.02em] leading-[1.2] text-[#E5E5F0]">
            From your first workspace to long-term AI memory
          </h2>
        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map(({ title, body }, i) => (
            <Reveal key={title} delay={i * 70}>
              <div className="relative">
                <span className="text-[28px] font-medium text-[#7C3AED]/40 leading-none">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-3 text-[14px] font-medium text-[#E5E5F0] mb-1.5">
                  {title}
                </h3>
                <p className="text-[12px] text-[#8B8BA3] leading-[1.6]">{body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Pricing ──────────────────────────────────────────────────────────────────

function Pricing() {
  return (
    <section id="pricing" className="py-24 px-6 border-t border-white/[0.04]">
      <div className="max-w-6xl mx-auto">
        <Reveal className="text-center mb-14">
          <SectionLabel>Pricing</SectionLabel>
          <h2 className="text-[clamp(26px,4vw,38px)] font-medium tracking-[-0.02em] leading-[1.2] text-[#E5E5F0]">
            Simple, honest pricing
          </h2>
          <p className="mt-4 text-[14px] text-[#8B8BA3]">
            Start free. Upgrade when memory becomes essential.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
          {/* Free */}
          <Reveal delay={0}>
            <div className="h-full p-6 rounded-[14px] border border-[rgba(255,255,255,0.07)] bg-[#0D0B14]">
              <p className="text-[11px] font-medium uppercase tracking-[0.08em] text-[#8B8BA3] mb-5">
                Free
              </p>
              <div className="mb-1">
                <span className="text-[28px] font-medium text-[#E5E5F0]">$0</span>
              </div>
              <p className="text-[12px] text-[#5A5A72] mb-7">Forever</p>

              <div className="space-y-2.5 mb-7">
                {[
                  "1 Workspace",
                  "20 AI Messages / Day",
                  "3 PDF Uploads",
                  "5 AI Searches",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-2.5">
                    <Check className="w-3.5 h-3.5 text-[#5A5A72] flex-shrink-0" aria-hidden />
                    <span className="text-[13px] text-[#8B8BA3]">{item}</span>
                  </div>
                ))}
              </div>

              <Link
                href="/sign-up"
                className="block text-center text-[13px] font-medium text-[#E5E5F0] border border-white/[0.1] rounded-[8px] py-2.5 hover:border-white/[0.18] hover:bg-white/[0.03] transition-all duration-150"
              >
                Get Started
              </Link>
            </div>
          </Reveal>

          {/* Pro */}
          <Reveal delay={100}>
            <div className="h-full p-6 rounded-[14px] border border-[rgba(124,58,237,0.4)] bg-[#0D0B14] relative overflow-hidden">
              <div
                aria-hidden
                className="absolute top-0 left-0 right-0 h-[1.5px]"
                style={{
                  background: "linear-gradient(90deg, #7C3AED, #A78BFA)",
                }}
              />
              <div
                aria-hidden
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    "radial-gradient(circle at 50% 0%, rgba(124,58,237,0.1) 0%, transparent 60%)",
                }}
              />

              <div className="flex items-center justify-between mb-5">
                <p className="text-[11px] font-medium uppercase tracking-[0.08em] text-[#A78BFA]">
                  Pro
                </p>
                <span className="text-[10px] px-2 py-1 rounded-full bg-[rgba(124,58,237,0.15)] text-[#A78BFA] border border-[rgba(124,58,237,0.3)]">
                  Most Popular
                </span>
              </div>

              <div className="mb-1 flex items-end gap-1">
                <span className="text-[28px] font-medium text-[#E5E5F0]">$9</span>
                <span className="text-[13px] text-[#5A5A72] mb-1">/mo</span>
              </div>
              <p className="text-[12px] text-[#5A5A72] mb-7">Billed monthly</p>

              <div className="space-y-2.5 mb-7">
                {[
                  "Unlimited Workspaces",
                  "Unlimited AI Messages",
                  "Unlimited PDF Uploads",
                  "Unlimited AI Searches",
                  "Project Memory & Knowledge",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-2.5">
                    <Check className="w-3.5 h-3.5 text-[#7C3AED] flex-shrink-0" aria-hidden />
                    <span className="text-[13px] text-[#E5E5F0]">{item}</span>
                  </div>
                ))}
              </div>

              <Link
                href="/sign-up"
                className="block text-center text-[13px] font-medium text-white bg-[#7C3AED] rounded-[8px] py-2.5 hover:opacity-90 active:scale-[0.98] transition-all duration-150 shadow-lg shadow-[#7C3AED]/25"
              >
                Start Pro
              </Link>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

// ─── FAQ ──────────────────────────────────────────────────────────────────────

const faqs: FAQItem[] = [
  {
    q: "How is Hymora different from traditional AI chatbots?",
    a: "ChatGPT resets after every conversation. Hymora builds a persistent memory layer per workspace — storing files, decisions, and conversation history that the AI references automatically in every session.",
  },
  {
    q: "What types of files can I upload?",
    a: "You can upload supported project documents such as PDFs and other supported knowledge files. Hymora indexes their content so your AI workspace can reference relevant information during future conversations.",
  },
  {
    q: "Is my data secure?",
    a: "Yes. Each workspace is isolated to your account. Hymora uses secure authentication, encrypted connections (HTTPS), and trusted infrastructure providers to help protect your data. Your workspace content is never used to train AI models.",
  },
  {
    q: "Can I have multiple workspaces?",
    a: "Free users can create 1 workspace. Pro users can create unlimited workspaces, each with its own knowledge, files, AI conversations, and project memory.",
  },
  {
    q: "Can I cancel my subscription anytime?",
    a: "Yes. You can cancel your subscription at any time from the Billing page. Your Pro features remain available until the end of your current billing period.",
  },
];

function FAQ() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section className="py-24 px-6 border-t border-white/[0.04]">
      <div className="max-w-2xl mx-auto">
        <Reveal className="text-center mb-14">
          <SectionLabel>FAQ</SectionLabel>
          <h2 className="text-[clamp(26px,4vw,38px)] font-medium tracking-[-0.02em] leading-[1.2] text-[#E5E5F0]">
            Common questions
          </h2>
        </Reveal>

        <div className="space-y-2">
          {faqs.map(({ q, a }, i) => {
            const isOpen = open === i;
            return (
              <Reveal key={q} delay={i * 40}>
                <div className="rounded-[10px] border border-[rgba(255,255,255,0.06)] bg-[#0D0B14] overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    aria-controls={`faq-panel-${i}`}
                    className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left"
                  >
                    <span className="text-[13px] font-medium text-[#E5E5F0]">
                      {q}
                    </span>
                    <span className="flex-shrink-0">
                      {isOpen ? (
                        <Minus className="w-3.5 h-3.5 text-[#A78BFA]" aria-hidden />
                      ) : (
                        <Plus className="w-3.5 h-3.5 text-[#5A5A72]" aria-hidden />
                      )}
                    </span>
                  </button>
                  {isOpen && (
                    <div id={`faq-panel-${i}`} className="px-5 pb-5">
                      <p className="text-[13px] text-[#8B8BA3] leading-[1.7]">{a}</p>
                    </div>
                  )}
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ─── Final CTA ────────────────────────────────────────────────────────────────

function FinalCTA() {
  return (
    <section className="py-24 px-6 border-t border-white/[0.04]">
      <div className="max-w-3xl mx-auto text-center">
        <Reveal>
          <h2 className="text-[clamp(28px,4.5vw,42px)] font-medium tracking-[-0.02em] leading-[1.15] text-[#E5E5F0] mb-9">
            Stop repeating yourself to AI.
          </h2>
          <Link
            href="/sign-up"
            className="group inline-flex items-center gap-2 bg-[#7C3AED] text-white text-[13px] font-medium px-7 h-10 rounded-[8px] hover:opacity-90 active:scale-[0.98] transition-all duration-150 shadow-xl shadow-[#7C3AED]/30"
          >
            Start for Free
            <ArrowRight
              className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform"
              aria-hidden
            />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer className="border-t border-white/[0.05] py-10 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-8">
          <div className="flex items-center gap-3">
            <Image
              src="/brand/icon.png"
              alt="Hymora logo"
              width={32}
              height={32}
              className="h-8 w-8 rounded-lg"
              sizes="32px"
            />

            <div>
              <p className="text-[14px] font-semibold tracking-[-0.02em] text-[#E5E5F0]">
                Hymora
              </p>

              <p className="text-[11px] text-[#5A5A72]">
                The AI Workspace That Remembers Everything
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-6">
            {[
  { label: "Features", href: "#features" },
  { label: "Pricing", href: "#pricing" },
  { label: "Contact", href: "/contact" },
  { label: "Sign in", href: "/sign-in" },
].map(({ label, href }) => (
              <Link
                key={label}
                href={href}
                className="text-[12px] text-[#5A5A72] hover:text-[#8B8BA3] transition-colors duration-150"
              >
                {label}
              </Link>
            ))}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-white/[0.04]">
          <div className="flex flex-wrap items-center gap-4">
  <Link
    href="/privacy"
    className="text-[11px] text-[#5A5A72] hover:text-[#8B8BA3] transition-colors"
  >
    Privacy
  </Link>

  <Link
    href="/terms"
    className="text-[11px] text-[#5A5A72] hover:text-[#8B8BA3] transition-colors"
  >
    Terms
  </Link>

  <Link
    href="/cookies"
    className="text-[11px] text-[#5A5A72] hover:text-[#8B8BA3] transition-colors"
  >
    Cookies
  </Link>

  <Link
    href="/refund"
    className="text-[11px] text-[#5A5A72] hover:text-[#8B8BA3] transition-colors"
  >
    Refund
  </Link>

  <Link
    href="/contact"
    className="text-[11px] text-[#5A5A72] hover:text-[#8B8BA3] transition-colors"
  >
    Contact
  </Link>
</div>
          <div className="flex items-center gap-2">
            <Shield className="w-3 h-3 text-[#5A5A72]" aria-hidden />
            <span className="text-[11px] text-[#5A5A72]">
              © {new Date().getFullYear()} Hymora · Built for secure AI workspaces
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#05030A] text-white antialiased">
      <Noise />
      <Navbar />
      <main>
        <Hero />
        <WhyHymora />
        <Problem />
        <Solution />
        <WorkspacePreview />
        <Features />
        <HowItWorks />
        <Pricing />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}
