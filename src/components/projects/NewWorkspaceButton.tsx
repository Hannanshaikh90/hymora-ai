"use client";

import Link from "next/link";
import { Plus } from "lucide-react";

interface NewWorkspaceButtonProps {
  limitReached: boolean;
}

export function NewWorkspaceButton({
  limitReached,
}: NewWorkspaceButtonProps) {
  if (limitReached) {
    return (
      <button
        type="button"
        onClick={() => {
          window.dispatchEvent(
            new CustomEvent("open-upgrade-modal", {
              detail: {
                type: "workspace",
              },
            })
          );
        }}
        className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#7C3AED] px-5 py-3 text-[14px] font-medium text-white transition-all duration-200 hover:scale-[1.02] hover:bg-[#8B5CF6]"
      >
        <Plus className="h-4 w-4" />
        New Workspace
      </button>
    );
  }

  return (
    <Link
      href="/dashboard/projects/new"
      className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#7C3AED] px-5 py-3 text-[14px] font-medium text-white transition-all duration-200 hover:scale-[1.02] hover:bg-[#8B5CF6]"
    >
      <Plus className="h-4 w-4" />
      New Workspace
    </Link>
  );
}