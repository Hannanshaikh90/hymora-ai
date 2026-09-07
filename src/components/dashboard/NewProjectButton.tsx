"use client";

import { useState } from "react";

export function NewProjectButton() {
  const [open, setOpen] =
    useState(false);

  const [title, setTitle] =
    useState("");

  const [
    description,
    setDescription,
  ] = useState("");

  const [loading, setLoading] =
    useState(false);

  const handleCreateProject =
    async () => {
      if (!title.trim()) {
        alert(
          "Project name is required"
        );
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
              }),
            }
          );

        const data =
          await response.json();

        console.log(data);

        setOpen(false);

        setTitle("");
        setDescription("");

        window.location.reload();
      } catch (error) {
        console.error(error);

        alert(
          "Project Creation Failed ❌"
        );
      } finally {
        setLoading(false);
      }
    };

  return (
    <>
      <button
        onClick={() =>
          setOpen(true)
        }
        className="
          rounded-xl
          bg-violet-600
          px-4
          py-2
          text-sm
          font-medium
          text-white
          hover:bg-violet-500
          transition
        "
      >
        + New Project
      </button>

      {open && (
        <div
          className="
            fixed
            inset-0
            z-50
            flex
            items-center
            justify-center
            bg-black/70
            backdrop-blur-sm
          "
        >
          <div
            className="
              w-full
              max-w-md
              rounded-2xl
              border
              border-white/10
              bg-[#111]
              p-6
            "
          >
            <h2
              className="
                text-xl
                font-semibold
                text-white
                mb-5
              "
            >
              Create Project
            </h2>

            <div className="space-y-4">
              <input
                value={title}
                onChange={(e) =>
                  setTitle(
                    e.target.value
                  )
                }
                placeholder="Project Name"
                className="
                  w-full
                  rounded-xl
                  border
                  border-white/10
                  bg-black/30
                  p-3
                  text-white
                  outline-none
                "
              />

              <textarea
                value={description}
                onChange={(e) =>
                  setDescription(
                    e.target.value
                  )
                }
                placeholder="Description"
                rows={4}
                className="
                  w-full
                  rounded-xl
                  border
                  border-white/10
                  bg-black/30
                  p-3
                  text-white
                  outline-none
                  resize-none
                "
              />
            </div>

            <div
              className="
                mt-6
                flex
                justify-end
                gap-3
              "
            >
              <button
                onClick={() =>
                  setOpen(false)
                }
                className="
                  rounded-xl
                  border
                  border-white/10
                  px-4
                  py-2
                  text-white
                "
              >
                Cancel
              </button>

              <button
                onClick={
                  handleCreateProject
                }
                disabled={loading}
                className="
                  rounded-xl
                  bg-violet-600
                  px-4
                  py-2
                  text-white
                  disabled:opacity-50
                "
              >
                {loading
                  ? "Creating..."
                  : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}