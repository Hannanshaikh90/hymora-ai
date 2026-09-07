"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  Copy,
  Check,
} from "lucide-react";

interface KnowledgeItem {
  id: string;
  content: string;
}

interface ProjectKnowledgeProps {
  projectId: string;
}

export function ProjectKnowledge({
  projectId,
}: ProjectKnowledgeProps) {
  const [knowledge, setKnowledge] =
    useState<KnowledgeItem[]>([]);

  const [content, setContent] =
    useState("");

  const [search, setSearch] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [deletingId, setDeletingId] =
    useState<string | null>(null);

  const [copiedId, setCopiedId] =
    useState<string | null>(null);

  const loadKnowledge =
    async () => {
      try {
        const res =
          await fetch(
            `/api/projects/knowledge/${projectId}`
          );

        const data =
          await res.json();

        if (
          Array.isArray(data)
        ) {
          setKnowledge(data);
        } else {
          setKnowledge([]);
        }
      } catch (error) {
        console.error(error);
      }
    };

  useEffect(() => {
    loadKnowledge();
  }, [projectId]);

  const handleSave =
    async () => {
      if (!content.trim()) {
        return;
      }

      try {
        setLoading(true);

        const res =
          await fetch(
            "/api/projects/knowledge/create",
            {
              method: "POST",
              headers: {
                "Content-Type":
                  "application/json",
              },
              body: JSON.stringify({
                projectId,
                content,
              }),
            }
          );

        const data =
          await res.json();

        if (!res.ok) {
          throw new Error(
            data.error
          );
        }

        setContent("");

        await loadKnowledge();
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

  const handleDelete =
    async (
      knowledgeId: string
    ) => {
      try {
        setDeletingId(
          knowledgeId
        );

        const res =
          await fetch(
            "/api/projects/knowledge/delete",
            {
              method: "POST",
              headers: {
                "Content-Type":
                  "application/json",
              },
              body: JSON.stringify({
                knowledgeId,
              }),
            }
          );

        const data =
          await res.json();

        if (!res.ok) {
          throw new Error(
            data.error
          );
        }

        await loadKnowledge();
      } catch (error) {
        console.error(error);
      } finally {
        setDeletingId(null);
      }
    };

  const handleCopy =
    async (
      id: string,
      content: string
    ) => {
      try {
        await navigator.clipboard.writeText(
          content
        );

        setCopiedId(id);

        setTimeout(() => {
          setCopiedId(
            null
          );
        }, 2000);
      } catch (error) {
        console.error(error);
      }
    };

  const filteredKnowledge =
    knowledge.filter((item) =>
      item.content
        .toLowerCase()
        .includes(
          search.toLowerCase()
        )
    );

  return (
    <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-4">

      {/* Header */}

      <div className="mb-4 flex items-center justify-between">

        <div>
          <h3 className="text-sm font-medium text-white">
            Knowledge
          </h3>

          <p className="mt-1 text-xs text-zinc-500">
            {knowledge.length} memories saved
          </p>
        </div>

      </div>

      {/* Add Knowledge */}

      <textarea
        value={content}
        onChange={(e) =>
          setContent(
            e.target.value
          )
        }
        placeholder="Add important information..."
        className="
          min-h-[90px]
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

      <button
        onClick={handleSave}
        disabled={loading}
        className="
          mt-3
          rounded-lg
          bg-purple-600
          px-3
          py-2
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
          : "Add Knowledge"}
      </button>

      {/* Search */}

      <input
        value={search}
        onChange={(e) =>
          setSearch(
            e.target.value
          )
        }
        placeholder="Search memories..."
        className="
          mt-4
          w-full
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

      {/* Knowledge List */}

      <div className="mt-4 space-y-3">

        {filteredKnowledge.length ===
          0 && (
          <div className="rounded-xl border border-white/5 p-3">
            <p className="text-xs text-zinc-500">
              No memories found.
            </p>
          </div>
        )}

        {filteredKnowledge.map(
          (item) => (
            <div
              key={item.id}
              className="
                rounded-xl
                border
                border-white/5
                bg-black/10
                p-3
              "
            >
              <p className="whitespace-pre-wrap text-sm text-white">
                {item.content}
              </p>

              <div className="mt-3 flex items-center gap-4">

                <button
                  onClick={() =>
                    handleCopy(
                      item.id,
                      item.content
                    )
                  }
                  className="
                    flex
                    items-center
                    gap-1
                    text-xs
                    text-zinc-400
                    transition
                    hover:text-white
                  "
                >
                  {copiedId ===
                  item.id ? (
                    <>
                      <Check
                        size={14}
                      />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy
                        size={14}
                      />
                      Copy
                    </>
                  )}
                </button>

                <button
                  onClick={() =>
                    handleDelete(
                      item.id
                    )
                  }
                  disabled={
                    deletingId ===
                    item.id
                  }
                  className="
                    text-xs
                    text-red-400
                    transition
                    hover:text-red-300
                  "
                >
                  {deletingId ===
                  item.id
                    ? "Deleting..."
                    : "Delete"}
                </button>

              </div>
            </div>
          )
        )}

      </div>

    </div>
  );
}