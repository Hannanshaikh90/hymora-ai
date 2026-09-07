"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";

interface MemorySearchProps {
  memories: any[];
  knowledge: any[];
  messages: any[];
  files: any[];
  projects: any[];
}

export default function MemorySearch({
  memories,
  knowledge,
  messages,
  files,
  projects,
}: MemorySearchProps) {

  const [query, setQuery] = useState("");

  const search = query.trim().toLowerCase();

  const results = useMemo(() => {
    if (!search) return [];

    return [
      ...memories.map((item) => ({
        type: "Memory",
        title: item.memory,
      })),

      ...knowledge.map((item) => ({
        type: "Knowledge",
        title: item.content,
      })),

      ...messages.map((item) => ({
        type: "Conversation",
        title: item.content,
      })),

      ...files.map((item) => ({
        type: "File",
        title: item.file_name,
      })),

      ...projects.map((item) => ({
        type: "Workspace",
        title: item.title,
      })),
    ]
      .filter(
        (item) =>
          item.title &&
          item.title
            .toLowerCase()
            .includes(search)
      )
      .slice(0, 20);
  }, [
    search,
    memories,
    knowledge,
    messages,
    files,
    projects,
  ]);
  return (
    <div className="space-y-4">
      <div className="relative">
        <Search
          size={18}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-[#7A7A90]"
        />

        <input
          value={query}
          onChange={(e) =>
            setQuery(e.target.value)
          }
          placeholder="Search anything Hymora remembers..."
          className="w-full rounded-2xl border border-white/5 bg-[#0F0C16] py-3.5 pl-11 pr-4 text-sm text-white outline-none transition-all duration-200 focus:border-[#7C3AED]/40 focus:ring-2 focus:ring-[#7C3AED]/10"
        />
      </div>

      {search && (
        <div className="overflow-hidden rounded-2xl border border-white/5 bg-[#0F0C16] shadow-[0_10px_30px_rgba(0,0,0,0.25)]">
          {results.length === 0 ? (
            <div className="p-5 text-sm text-[#8B8BA3]">
              Hymora couldn't find anything matching your search.
            </div>
          ) : (
            results.map((item, index) => (
              <div
                key={index}
                className="border-b border-white/5 p-4 transition-colors duration-200 hover:bg-white/[0.03] last:border-none"
              >
                <p className="text-xs text-[#A78BFA]">
                  {item.type}
                </p>

                <p className="mt-1 text-sm text-white">
                  {item.title}
                </p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}