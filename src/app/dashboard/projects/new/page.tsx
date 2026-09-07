"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewProjectPage() {
  const router = useRouter();

  const [title, setTitle] =
    useState("");

  const [description, setDescription] =
    useState("");

  const [goal, setGoal] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const handleCreate =
    async () => {
      if (!title.trim()) {
        return;
      }

      try {
        setLoading(true);

        const response =
          await fetch(
            "/api/projects/create",
            {
              method: "POST",
              headers: {
                "Content-Type":
                  "application/json",
              },
              body: JSON.stringify({
                title,
                description,
                goal,
              }),
            }
          );

        const data =
          await response.json();

        if (!response.ok) {
          alert(
            data.error ??
            "Unable to create workspace."
          );
          return;
        }

        router.push(
          `/dashboard/projects/${data.project.id}`
        );
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

  return (
    <div className="max-w-3xl mx-auto px-6 py-8">

      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">

        <h1 className="text-3xl font-bold text-white">
          Create Project
        </h1>

        <p className="text-white/40 mt-2">
          Create a new AI workspace.
        </p>

        <input
          value={title}
          onChange={(e) =>
            setTitle(
              e.target.value
            )
          }
          placeholder="Project Title"
          className="
            mt-6
            w-full
            rounded-xl
            border
            border-white/10
            bg-black/20
            px-4
            py-3
            text-white
          "
        />

        <textarea
          value={description}
          onChange={(e) =>
            setDescription(
              e.target.value
            )
          }
          placeholder="Project Description"
          className="
            mt-4
            w-full
            h-32
            rounded-xl
            border
            border-white/10
            bg-black/20
            p-4
            text-white
          "
        />

        <textarea
          value={goal}
          onChange={(e) =>
            setGoal(
              e.target.value
            )
          }
          placeholder="Project Goal"
          className="
            mt-4
            w-full
            h-32
            rounded-xl
            border
            border-white/10
            bg-black/20
            p-4
            text-white
          "
        />

        <button
          onClick={handleCreate}
          disabled={loading}
          className="
            mt-6
            rounded-xl
            bg-violet-600
            px-5
            py-3
            text-white
          "
        >
          {loading
            ? "Creating..."
            : "Create Project"}
        </button>

      </div>

    </div>
  );
}