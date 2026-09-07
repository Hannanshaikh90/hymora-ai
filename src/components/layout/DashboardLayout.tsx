"use client";

import { AppSidebar } from "@/components/navigation/app-sidebar";
import { MobileSidebar } from "@/components/navigation/mobile-sidebar";
import { usePathname } from "next/navigation";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout = ({
  children,
}: DashboardLayoutProps) => {

  const pathname = usePathname();

  const isProjectPage =
    pathname.includes("/dashboard/projects/");

  return (
    <div className="flex h-screen bg-[#050505] text-white">

      <MobileSidebar />

      {/* Sidebar */}
      <AppSidebar />

      {/* Main Content */}

      {isProjectPage ? (
        <main className="flex-1 min-h-0 overflow-hidden">
          {children}
        </main>
      ) : (
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      )}

    </div>
  );
};