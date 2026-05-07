"use client";

import * as React from "react";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { cn } from "@/lib/utils";
import { Sidebar } from "@/components/layout/Sidebar";
import { Navbar } from "@/components/layout/Navbar";
import { MobileSidebar } from "@/components/layout/MobileSidebar";

// ─── Types ────────────────────────────────────────────────────────────────────

interface DashboardLayoutProps {
  children: React.ReactNode;
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)");

  // Collapse sidebar automatically on mobile
  React.useEffect(() => {
    if (isMobile) setIsCollapsed(true);
  }, [isMobile]);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#0a0a0a]">
      {/* Desktop Sidebar */}
      {!isMobile && (
        <Sidebar
          isCollapsed={isCollapsed}
          onToggle={() => setIsCollapsed((v) => !v)}
        />
      )}

      {/* Main content area */}
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        {/* Navbar — passes mobile sidebar trigger on small screens */}
        <Navbar isMobile={isMobile} />

        {/* Scrollable content */}
        <main
          className={cn(
            "flex-1 overflow-y-auto overflow-x-hidden",
            "scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/[0.06]"
          )}
        >
          <div className="mx-auto w-full max-w-screen-xl px-4 py-6 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}