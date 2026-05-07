import { type ReactNode } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";

// ─── Metadata ─────────────────────────────────────────────────────────────────

export const metadata = {
  title: {
    template: "%s | Nexus AI",
    default: "Dashboard | Nexus AI",
  },
  description: "Nexus AI — your intelligent SaaS platform",
};

// ─── Layout ───────────────────────────────────────────────────────────────────

interface DashboardRootLayoutProps {
  children: ReactNode;
}

export default function DashboardRootLayout({
  children,
}: DashboardRootLayoutProps) {
  return <DashboardLayout>{children}</DashboardLayout>;
}