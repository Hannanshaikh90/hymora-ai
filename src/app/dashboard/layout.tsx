import { type ReactNode } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { UpgradeModal } from "@/components/billing/UpgradeModal";

import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export const metadata = {
  title: {
    template: "%s | Nexus AI",
    default: "Dashboard | Nexus AI",
  },
  description: "Nexus AI — your intelligent SaaS platform",
};

interface DashboardRootLayoutProps {
  children: ReactNode;
}

export default async function DashboardRootLayout({
  children,
}: DashboardRootLayoutProps) {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  return (
    <div className="relative min-h-screen bg-[#050505]">

      {/* Background Glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">

        <div className="absolute top-[20%] left-[35%] h-[220px] w-[220px] rounded-full bg-fuchsia-500/10 blur-3xl animate-pulse" />

        <div className="absolute bottom-[15%] left-[10%] h-[180px] w-[180px] rounded-full bg-sky-500/10 blur-3xl animate-pulse" />

        <div className="absolute top-[-120px] left-[-120px] h-[320px] w-[320px] rounded-full bg-violet-500/20 blur-3xl" />

        <div className="absolute bottom-[-120px] right-[-120px] h-[320px] w-[320px] rounded-full bg-fuchsia-500/10 blur-3xl" />

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.05),transparent_45%)]" />

      </div>

      {/* Content */}
      <div className="relative z-10">
        <DashboardLayout>
          {children}
          <UpgradeModal />
        </DashboardLayout>
      </div>

    </div>
  );
}