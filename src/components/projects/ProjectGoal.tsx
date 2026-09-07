"use client";

import { useState } from "react";

interface ProjectGoalProps {
  projectId: string;
  initialGoal: string;
}

export function ProjectGoal({
  projectId,
  initialGoal,
}: ProjectGoalProps) {
  const [goal, setGoal] =
    useState(initialGoal);

  const [loading, setLoading] =
    useState(false);

  const handleSave =
    async () => {
      try {
        setLoading(true);

        await fetch(
          "/api/projects/update-goal",
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              projectId,
              goal,
            }),
          }
        );
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

  return (
    <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-4">

      <div className="mb-3 flex items-center justify-between">

        <h3 className="text-sm font-medium text-white">
          Project Goal
        </h3>

        <button
          onClick={handleSave}
          disabled={loading}
          className="
            rounded-lg
            bg-purple-600
            px-3
            py-1.5
            text-xs
            font-medium
            text-white
            transition
            hover:bg-purple-500
            disabled:opacity-50
          "
        >
          {loading
            ? "Saving..."
            : "Save"}
        </button>

      </div>

      <textarea
        value={goal}
        onChange={(e) =>
          setGoal(
            e.target.value
          )
        }
        placeholder="What is this workspace trying to achieve?"
        className="
          min-h-[100px]
          w-full
          resize-none
          rounded-xl
          border
          border-white/5
          bg-black/20
          p-3
          text-sm
          text-white
          outline-none
          placeholder:text-zinc-500
        "
      />

    </div>
  );
}