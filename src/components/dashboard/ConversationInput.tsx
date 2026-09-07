"use client";

import { Send } from "lucide-react";
import { useState } from "react";

interface ConversationInputProps {
  onSend: (
    message: string
  ) => void;

  isLoading?: boolean;
}

export function ConversationInput({
  onSend,
  isLoading,
}: ConversationInputProps) {
  const [input, setInput] =
    useState("");

  return (
    <div className="fixed bottom-6 left-0 right-0 px-4 md:px-6 z-50">
      <div className="max-w-4xl mx-auto">

        {/* Glass Container */}
<div className="relative overflow-hidden rounded-3xl border border-white/[0.08] bg-white/[0.04] backdrop-blur-2xl shadow-2xl shadow-black/30 transition-all focus-within:border-violet-500/40 focus-within:bg-white/[0.05]">

  {/* Glow */}
  <div className="absolute inset-0 bg-gradient-to-r from-violet-500/[0.04] via-transparent to-fuchsia-500/[0.04]" />

  <div className="relative flex items-end gap-3 px-4 py-3">

    <textarea
      value={input}
      disabled={isLoading}
      onChange={(e) =>
        setInput(e.target.value)
      }
      placeholder="Ask Nexus AI anything..."
      rows={1}
      className="w-full bg-transparent text-[15px] leading-7 text-white placeholder:text-white/30 outline-none resize-none max-h-40 min-h-[28px] overflow-y-hidden disabled:opacity-50"
      onInput={(e) => {

        const target =
          e.target as HTMLTextAreaElement;

       target.style.height =
  "0px";

target.style.height =
  `${target.scrollHeight}px`;

      }}
      onKeyDown={(e) => {

        if (
          e.key === "Enter" &&
          !e.shiftKey
        ) {

          e.preventDefault();

          if (!input.trim())
            return;

          onSend(input);

          setInput("");

        }

      }}
    />

    <button
      disabled={isLoading}
      onClick={() => {

        if (!input.trim())
          return;

        onSend(input);

        setInput("");

      }}
      className="flex items-center justify-center shrink-0 w-11 h-11 rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white shadow-lg shadow-violet-500/20 hover:scale-[1.03] active:scale-95 transition-all disabled:opacity-50 disabled:hover:scale-100"
    >

      <Send className="w-4 h-4" />

    </button>

  </div>

</div>
      </div>
    </div>
  );
}