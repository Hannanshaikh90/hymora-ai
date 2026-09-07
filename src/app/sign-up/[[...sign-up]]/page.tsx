"use client";

import Link from "next/link";
import Image from "next/image";
import { SignUp } from "@clerk/nextjs";
import { Brain, ArrowLeft, FolderOpen, Database, Sparkles, Shield, FileText } from "lucide-react";

// ─── Noise overlay (matches landing page) ────────────────────────────────────

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

// ─── Feature highlight items for brand panel ─────────────────────────────────

const highlights = [
  {
    icon: FolderOpen,
    title: "Project Workspaces",
    body: "Each project lives in its own isolated environment with scoped memory.",
  },
  {
    icon: Brain,
    title: "Persistent Memory",
    body: "Context that grows across every session and stays available for future conversations.",
  },
  {
    icon: Database,
    title: "Project Files",
    body: "Permanent facts your AI references automatically in every response.",
  },
  {
    icon: FileText,
    title: "File Intelligence",
    body: "PDFs and docs parsed, indexed, and permanently remembered.",
  },
];

// ─── Memory activity animation card ─────────────────────────────────────────

function MemoryCard() {
  return (
    <div className="rounded-[14px] border border-[rgba(255,255,255,0.07)] bg-[#0D0B14] p-5 relative overflow-hidden">
      {/* Purple top bar */}
      <div
        aria-hidden
        className="absolute top-0 left-0 right-0 h-[1.5px]"
        style={{ background: "linear-gradient(90deg, #7C3AED, #A78BFA, transparent)" }}
      />

      <div className="flex items-center gap-2 mb-4">
        <div className="w-6 h-6 rounded-[6px] bg-[rgba(124,58,237,0.2)] flex items-center justify-center">
          <Brain className="w-3 h-3 text-[#A78BFA]" />
        </div>
        <span className="text-[11px] font-medium text-[#A78BFA]">Memory recalled</span>
        <span className="ml-auto text-[10px] text-[#5A5A72]">just now</span>
      </div>

      <div className="rounded-[8px] border border-[rgba(124,58,237,0.2)] bg-[rgba(124,58,237,0.08)] px-4 py-3 mb-3">
        <p className="text-[12px] text-[#E5E5F0] leading-[1.6]">
          Based on your Brand Redesign workspace, you decided on{" "}
          <span className="text-[#A78BFA] font-medium">Deep Navy #0F172A</span> as
          primary with{" "}
          <span className="text-[#A78BFA] font-medium">Electric Violet #7C3AED</span>{" "}
          as accent — finalized Feb 3rd.
        </p>
      </div>

      <div className="flex items-center gap-2">
        <div className="w-4 h-4 rounded-[4px] bg-[rgba(124,58,237,0.2)] flex items-center justify-center">
          <Database className="w-2.5 h-2.5 text-[#A78BFA]" />
        </div>
        <span className="text-[10px] text-[#5A5A72]">
          Retrieved from your workspace knowledge and memory
        </span>
      </div>
    </div>
  );
}

// ─── Brand panel (left column) ───────────────────────────────────────────────

function BrandPanel() {
  return (
    <div className="flex h-full flex-col justify-between px-12 py-16 xl:px-16">
      {/* Logo */}
      <div>
        <div className="flex items-center gap-2.5 mb-16">
          <Image
            src="/brand/icon.png"
            alt="Hymora logo"
            width={36}
            height={36}
            className="h-9 w-9 rounded-xl"
            priority
          />
          <span className="text-[15px] font-medium tracking-[-0.02em] text-[#E5E5F0]">
            Hymora
          </span>
        </div>

        {/* Headline */}
        <div className="mb-12 max-w-[520px]">
          <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-[#7C3AED] mb-4">
           AI Workspace
          </p>
          <h1 className="text-[clamp(26px,3.5vw,36px)] font-medium tracking-[-0.025em] leading-[1.1] text-[#E5E5F0] mb-4">
            The AI Workspace
            <br />
            That Remembers Everything
          </h1>
          <p className="max-w-md text-[15px] leading-8 text-[#8B8BA3]">
            Stop repeating project context. Hymora builds a persistent memory layer across every conversation, file, and decision.
          </p>
        </div>

        {/* Feature highlights */}
        <div className="mb-12 space-y-4">
          {highlights.map(({ icon: Icon, title, body }) => (
            <div key={title} className="flex items-start gap-3.5">
              <div className="w-8 h-8 rounded-[8px] bg-[rgba(124,58,237,0.15)] border border-[rgba(124,58,237,0.2)] flex items-center justify-center flex-shrink-0 mt-0.5">
                <Icon className="w-3.5 h-3.5 text-[#A78BFA]" />
              </div>
              <div>
                <p className="text-[13px] font-medium text-[#E5E5F0] mb-0.5">{title}</p>
                <p className="text-[12px] text-[#8B8BA3] leading-[1.55]">{body}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Memory card visual */}
        <MemoryCard />
      </div>

      {/* Bottom trust badge */}
      <div className="mt-12 flex items-center gap-2">
        <Shield className="w-3.5 h-3.5 text-[#5A5A72]" />
        <span className="text-[11px] text-[#5A5A72]">
          Built for secure AI workspaces
        </span>
      </div>
    </div>
  );
}

// ─── Auth panel (right column) ───────────────────────────────────────────────

function AuthPanel() {
  return (
    <div className="flex flex-col justify-center items-center px-8 py-12 lg:py-16 min-h-full">
      <div className="w-full max-w-[420px]">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#5B21B6]/40 bg-[rgba(124,58,237,0.12)] mb-5">
            <Sparkles className="w-3 h-3 text-[#A78BFA]" />
            <span className="text-[11px] font-medium tracking-[0.1em] uppercase text-[#A78BFA]">
              Free forever to start
            </span>
          </div>
          <h2 className="text-[24px] font-medium tracking-[-0.02em] text-[#E5E5F0] mb-2">
            Create your Hymora account
          </h2>
          <p className="text-[14px] leading-7 text-[#8B8BA3]">
            Create your account and start building AI workspaces with persistent memory.
          </p>
        </div>

        {/* Clerk SignUp component */}
        <div className="hymora-clerk-signup">
          <SignUp
            appearance={{
              variables: {
                colorPrimary: "#7C3AED",
                colorBackground: "#0D0B14",
                colorInputBackground: "rgba(255,255,255,0.04)",
                colorInputText: "#E5E5F0",
                colorText: "#E5E5F0",
                colorTextSecondary: "#8B8BA3",
                colorTextOnPrimaryBackground: "#ffffff",
                colorNeutral: "#8B8BA3",
                colorDanger: "#E24B4A",
                borderRadius: "8px",
                fontFamily: "inherit",
                fontSize: "13px",
              },
              elements: {
                rootBox: "w-full",
                card: [
                  "bg-[#0D0B14]",
                  "border border-[rgba(255,255,255,0.07)]",
                  "hover:border-[rgba(124,58,237,0.20)]",
                  "rounded-[14px]",
                  "shadow-2xl shadow-black/60",
                  "transition-all duration-300",
                  "relative overflow-hidden",
                  "p-6",
                  "before:absolute before:top-0 before:left-0 before:right-0 before:h-[1.5px]",
                  "before:bg-gradient-to-r before:from-[#7C3AED] before:to-[#A78BFA]",
                ].join(" "),
                headerTitle: "hidden",
                headerSubtitle: "hidden",
                header: "hidden",
                socialButtonsBlockButton: [
                  "border border-[rgba(255,255,255,0.09)]",
                  "bg-[rgba(255,255,255,0.03)]",
                  "text-[#E5E5F0]",
                  "hover:bg-[rgba(255,255,255,0.06)]",
                  "hover:border-[rgba(255,255,255,0.14)]",
                  "transition-all duration-150",
                  "rounded-[8px]",
                  "text-[13px] font-medium",
                  "h-10",
                ].join(" "),
                socialButtonsBlockButtonText: "text-[#E5E5F0] text-[13px] font-medium",
                dividerLine: "bg-[rgba(255,255,255,0.07)]",
                dividerText: "text-[#5A5A72] text-[11px]",
                formFieldLabel: "text-[12px] font-medium text-[#A0A0B8] mb-1.5",
                formFieldInput: [
                  "bg-[rgba(255,255,255,0.04)]",
                  "border border-[rgba(255,255,255,0.09)]",
                  "text-[#E5E5F0]",
                  "placeholder:text-[#5A5A72]",
                  "rounded-[8px]",
                  "h-10",
                  "text-[13px]",
                  "focus:border-[#7C3AED]",
                  "focus:ring-2 focus:ring-[rgba(124,58,237,0.25)]",
                  "transition-all duration-150",
                ].join(" "),
                formButtonPrimary: [
                  "bg-[#7C3AED]",
                  "hover:opacity-90",
                  "active:scale-[0.98]",
                  "text-white",
                  "text-[13px] font-medium",
                  "rounded-[8px]",
                  "h-10",
                  "shadow-lg shadow-[rgba(124,58,237,0.25)]",
                  "transition-all duration-150",
                ].join(" "),
                footerActionLink: "text-[#A78BFA] hover:text-[#7C3AED] text-[12px] transition-colors duration-150",
                footerActionText: "text-[#5A5A72] text-[12px]",
                identityPreviewEditButton: "text-[#A78BFA] hover:text-[#7C3AED] transition-colors",
                formFieldErrorText: "text-[#E24B4A] text-[11px] mt-1",
                alertText: "text-[13px]",
                alertTextDanger: "text-[#E24B4A]",
                otpCodeFieldInput: [
                  "border border-[rgba(255,255,255,0.09)]",
                  "bg-[rgba(255,255,255,0.04)]",
                  "text-[#E5E5F0]",
                  "rounded-[8px]",
                  "focus:border-[#7C3AED]",
                  "focus:ring-2 focus:ring-[rgba(124,58,237,0.25)]",
                ].join(" "),
              },
            }}

            signInUrl="/sign-in"
          />
        </div>

        {/* Sign in link */}
        <p className="mt-5 text-center text-[12px] text-[#5A5A72]">
          Already have an account?{" "}
          <Link
            href="/sign-in"
            className="text-[#A78BFA] hover:text-[#7C3AED] transition-colors duration-150 font-medium"
          >
            Sign in
          </Link>
        </p>

        {/* Terms */}
        <p className="mt-4 text-center text-[11px] text-[#5A5A72] leading-[1.6] max-w-xs mx-auto">
          By creating an account, you agree to our{" "}
          <Link href="/terms" className="text-[#8B8BA3] hover:text-[#A78BFA] transition-colors duration-150 underline underline-offset-2">
            Terms
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="text-[#8B8BA3] hover:text-[#A78BFA] transition-colors duration-150 underline underline-offset-2">
            Privacy Policy
          </Link>
          .
        </p>
      </div>
    </div>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-[#05030A] text-white antialiased">
      <Noise />

      {/* Top-left: back to home */}
      <div className="fixed top-0 left-0 z-40 p-5" >
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 rounded-lg px-2 py-2 text-[12px] text-[#5A5A72] transition-colors duration-150 hover:text-[#8B8BA3]"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to home
        </Link>
      </div>

      {/* Radial glow */}
      <div
        aria-hidden
        className="fixed top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] pointer-events-none z-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 0%, rgba(124,58,237,0.13) 0%, transparent 70%)",
        }}
      />

      {/* Dot grid */}
      <div
        aria-hidden
        className="fixed inset-0 pointer-events-none z-0 opacity-[0.022]"
        style={{
          backgroundImage: "radial-gradient(circle, #A78BFA 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      {/* Split layout */}
      <div className="relative z-10 min-h-screen flex flex-col lg:grid lg:grid-cols-[1fr_1fr]">
        {/* Left — brand panel */}
        <div className="hidden lg:flex flex-col relative border-r border-white/[0.05]">
          {/* Subtle left-panel glow */}
          <div
            aria-hidden
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse 70% 50% at 40% 60%, rgba(124,58,237,0.06) 0%, transparent 70%)",
            }}
          />
          <div className="relative z-10 h-full">
            <BrandPanel />
          </div>
        </div>

        {/* Mobile: logo bar */}
        <div className="lg:hidden flex items-center gap-3 px-6 pt-16 pb-4">
          <Image
            src="/brand/icon.png"
            alt="Hymora logo"
            width={36}
            height={36}
            className="h-9 w-9 rounded-xl"
            priority
          />

          <span className="text-[15px] font-semibold tracking-[-0.02em] text-[#E5E5F0]">
            Hymora
          </span>
        </div>

        {/* Right — auth panel */}
        <div className="flex-1 flex flex-col">
          <AuthPanel />
        </div>
      </div>
    </div>
  );
}