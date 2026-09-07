"use client";

import type { ReactNode } from "react";
import { useRouter } from "next/navigation";

interface CreateWorkspaceButtonProps {
  children: ReactNode;
  className?: string;
}

export function CreateWorkspaceButton({
  children,
  className,
}: CreateWorkspaceButtonProps) {
  const router = useRouter();

  async function handleClick() {
    try {
      const response = await fetch(
        "/api/projects/check-limit",
        {
          cache: "no-store",
        }
      );

      if (!response.ok) {
        console.error(
          "Failed to check workspace limit."
        );
        return;
      }

      const data = await response.json();

      if (!response.ok) {
        console.error(data.error);

        return;
      }

      if (!data.allowed) {
        window.dispatchEvent(
          new CustomEvent(
            "open-upgrade-modal",
            {
              detail: {
                type: "workspace",
              },
            }
          )
        );

        return;
      }

      router.push(
        "/dashboard/projects/new"
      );
    } catch (error) {
      console.error(
        "WORKSPACE_LIMIT_ERROR",
        error
      );
    }
  }

  return (
    <button
      type="button"
      className={className}
      onClick={handleClick}
    >
      {children}
    </button>
  );
}