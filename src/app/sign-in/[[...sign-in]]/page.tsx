"use client";

import Link from "next/link";
import Image from "next/image";
import { SignIn } from "@clerk/nextjs";
import {
  Brain,
  ArrowLeft,
  Database,
  Sparkles,
  Shield,
  MessageSquare,
  Activity,
  FolderOpen,
} from "lucide-react";

// ─── Noise overlay ────────────────────────────────────────────────────────────

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

// ─── Activity feed card (left panel visual) ───────────────────────────────────

const activityItems = [
  {
    icon: Brain,
    bg: "rgba(124,58,237,0.15)",
    color: "#A78BFA",
    text: "Memory saved in Brand Redesign",
    time: "2m",
  },
  {
    icon: Database,
    bg: "rgba(56,138,221,0.12)",
    color: "#378ADD",
    text: "Recalled 3 memories during session",
    time: "18m",
  },
  {
    icon: MessageSquare,
    bg: "rgba(186,117,23,0.12)",
    color: "#BA7517",
    text: "New conversation context built",
    time: "1h",
  },
  {
    icon: FolderOpen,
    bg: "rgba(99,153,34,0.12)",
    color: "#639922",
    text: "Workspace context synced",
    time: "3h",
  },
  {
    icon: Sparkles,
    bg: "rgba(124,58,237,0.15)",
    color: "#A78BFA",
    text: "Knowledge base updated",
    time: "1d",
  },
];

function ActivityCard() {
  return (
    <div className="rounded-[14px] border border-[rgba(255,255,255,0.07)] bg-[#0D0B14] p-5 relative overflow-hidden">
      {/* Purple top bar */}
      <div
        aria-hidden
        className="absolute top-0 left-0 right-0 h-[1.5px]"
        style={{
          background: "linear-gradient(90deg, #7C3AED, #A78BFA, transparent)",
        }}
      />

      <div className="flex items-center gap-2 mb-5">
        <div className="w-6 h-6 rounded-[6px] bg-[rgba(124,58,237,0.2)] flex items-center justify-center">
          <Activity className="w-3 h-3 text-[#A78BFA]" />
        </div>
        <span className="text-[12px] font-medium text-[#E5E5F0]">
          Workspace Activity
        </span>
        <span className="ml-auto flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#639922] inline-block" />
          <span className="text-[10px] text-[#5A5A72]">Live</span>
        </span>
      </div>

      <div className="space-y-3">
        {activityItems.map(({ icon: Icon, bg, color, text, time }) => (
          <div key={text} className="flex items-center gap-2.5">
            <div
              className="w-7 h-7 rounded-[6px] flex items-center justify-center flex-shrink-0"
              style={{ background: bg }}
            >
              <Icon className="w-3 h-3" style={{ color }} />
            </div>
            <p className="flex-1 text-[12px] text-[#8B8BA3] leading-[1.5] min-w-0 truncate">
              {text}
            </p>
            <span className="text-[10px] text-[#5A5A72] flex-shrink-0">{time}</span>
          </div>
        ))}
      </div>

      {/* Memory indicator */}
      <div className="mt-4 pt-4 border-t border-white/[0.05] flex items-center gap-2">
        <div className="w-4 h-4 rounded-[4px] bg-[rgba(124,58,237,0.2)] flex items-center justify-center">
          <Database className="w-2.5 h-2.5 text-[#A78BFA]" />
        </div>
        <span className="text-[10px] text-[#5A5A72]">
          1,284 memories persisted across all workspaces
        </span>
      </div>
    </div>
  );
}

// ─── Brand panel (left column) ────────────────────────────────────────────────

const benefits = [
  {
    label: "Persistent Memory",
    detail: "Context that grows with every conversation.",
  },
  {
    label: "Project Workspaces",
    detail: "Dedicated workspaces for every project, client, or goal.",
  },
  {
    label: "Project Knowledge",
    detail: "Knowledge your AI can reference across future conversations.",
  },
];

function BrandPanel() {
  return (
    <div className="flex h-full flex-col justify-between px-12 py-16 xl:px-16">
      <div>
        {/* Logo */}
        <div className="flex items-center gap-2.5 mb-16">
          <Image
            src="/brand/icon.png"
            alt="Hymora logo"
            width={36}
            height={36}
            priority
            className="h-9 w-9 rounded-xl"
          />

          <span className="text-[15px] font-semibold tracking-[-0.02em] text-[#E5E5F0]">
            Hymora
          </span>
        </div>

        {/* Headline */}
        <div className="mb-10">
          <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-[#7C3AED] mb-4">
            Welcome back
          </p>
          <h1 className="text-[clamp(26px,3.5vw,36px)] font-medium tracking-[-0.025em] leading-[1.1] text-[#E5E5F0] mb-4">
            Your workspace
            <br />
            never stopped
            <br />
            <span className="text-[#7C3AED]">remembering.</span>
          </h1>
          <p className="max-w-md text-[15px] leading-8 text-[#8B8BA3]">
            Every conversation, file, and decision is exactly where you left
            it. Sign in to pick up where you left off.
          </p>
        </div>

        {/* Benefits */}
        <div className="mb-12 space-y-4">
          {benefits.map(({ label, detail }) => (
            <div key={label} className="flex items-start gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-[#7C3AED] mt-[5px] flex-shrink-0" />
              <div>
                <p className="text-[13px] font-medium text-[#E5E5F0]">{label}</p>
                <p className="text-[12px] text-[#8B8BA3] leading-[1.55]">{detail}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Activity visual */}
        <ActivityCard />
      </div>

      {/* Trust badge */}
      <div className="mt-10 flex items-center gap-2">
        <Shield className="w-3.5 h-3.5 text-[#5A5A72]" />
        <span className="text-[11px] text-[#5A5A72]">
          End-to-end encrypted · Built for modern AI workspaces
        </span>
      </div>
    </div>
  );
}

// ─── Auth panel (right column) ────────────────────────────────────────────────

function AuthPanel() {
  return (
    <div className="flex flex-col justify-center items-center px-8 py-12 lg:py-16 min-h-full">
      <div className="w-full max-w-[400px]">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#5B21B6]/40 bg-[rgba(124,58,237,0.12)] mb-5">
            <Brain className="w-3 h-3 text-[#A78BFA]" />
            <span className="text-[11px] font-medium tracking-[0.1em] uppercase text-[#A78BFA]">
              AI Workspace
            </span>
          </div>
          <h2 className="text-[22px] font-medium tracking-[-0.02em] text-[#E5E5F0] mb-2">
            Sign in to Hymora
          </h2>
          <p className="text-[13px] text-[#8B8BA3] leading-[1.6]">
            Your memory is waiting. Continue where you left off.
          </p>
        </div>

        {/* Clerk SignIn component */}
        <SignIn
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
                "transition-all duration-300",
                "rounded-[14px]",
                "shadow-2xl shadow-black/60",
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
              footerActionLink:
                "text-[#A78BFA] hover:text-[#7C3AED] text-[12px] transition-colors duration-150",
              footerActionText: "text-[#5A5A72] text-[12px]",
              identityPreviewEditButton:
                "text-[#A78BFA] hover:text-[#7C3AED] transition-colors",
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
          signUpUrl="/sign-up"
        />

        {/* Create account link */}
        <p className="mt-5 text-center text-[12px] text-[#5A5A72]">
          Don&apos;t have an account?{" "}
          <Link
            href="/sign-up"
            className="text-[#A78BFA] hover:text-[#7C3AED] transition-colors duration-150 font-medium"
          >
            Create one free
          </Link>
        </p>

        {/* Terms */}
        <p className="mt-4 text-center text-[11px] text-[#5A5A72] leading-[1.6] max-w-xs mx-auto">
         Built with security and privacy in mind.{" "}
          <Link
            href="/privacy"
            className="text-[#8B8BA3] hover:text-[#A78BFA] transition-colors duration-150 underline underline-offset-2"
          >
            Privacy Policy
          </Link>
          .
        </p>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-[#05030A] text-white antialiased">
      <Noise />

      {/* Back to home */}
      <div className="fixed top-0 left-0 z-40 p-5">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-[12px] text-[#5A5A72] hover:text-[#8B8BA3] transition-colors duration-150"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
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
        {/* Left — brand panel (desktop only) */}
        <div className="hidden lg:flex flex-col relative border-r border-white/[0.05]">
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
            priority
            className="h-9 w-9 rounded-xl"
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