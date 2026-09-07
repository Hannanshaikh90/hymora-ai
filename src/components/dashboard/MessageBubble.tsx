"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { motion } from "framer-motion";

import {
  Sparkles,
  User,
  Copy,
  Check,
} from "lucide-react";

interface MessageBubbleProps {
  content: string;
  isUser?: boolean;
}

export function MessageBubble({
  content,
  isUser = false,
}: MessageBubbleProps) {
  const [copied, setCopied] =
    useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(
      content
    );

    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 20,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.25,
      }}
      className={`w-full flex items-start gap-4 ${
        isUser
          ? "justify-end"
          : "justify-start"
      }`}
    >
      {/* AI Avatar */}
      {!isUser && (
        <div className="flex items-center justify-center shrink-0 w-10 h-10 rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-600 shadow-lg shadow-violet-500/20">
          <Sparkles className="w-4 h-4 text-white" />
        </div>
      )}

      {/* Message Container */}
      <div
        className="
          relative
          group
          flex
          flex-col
          max-w-[85%]
          md:max-w-[65%]
        "
      >
        {/* Bubble */}
        <div
          className={`
            rounded-3xl
            px-5
            py-2

            text-[15px]
            leading-7

            whitespace-pre-wrap
            break-words

            overflow-hidden

            backdrop-blur-xl
            shadow-xl

            transition-all

            ${
              isUser
                ? "bg-gradient-to-br from-violet-500 to-fuchsia-600 text-white shadow-violet-500/20"
                : "border border-white/[0.08] bg-white/[0.04] text-white/90 shadow-black/20"
            }
          `}
        >
          <div
            className="
              prose
              prose-invert
              prose-sm

              max-w-none

              prose-p:leading-7
              prose-p:mb-3

              prose-pre:bg-black/40
              prose-pre:border
              prose-pre:border-white/10
              prose-pre:rounded-2xl
              prose-pre:p-4
              prose-pre:overflow-x-auto

              prose-code:text-violet-300

              prose-strong:text-white
              prose-headings:text-white

              break-words
            "
          >
            <ReactMarkdown>
              {content}
            </ReactMarkdown>
          </div>
        </div>

        {/* Copy Button */}
        {!isUser && (
          <button
            onClick={handleCopy}
            className="
              absolute
              -bottom-3
              right-4

              opacity-0
              group-hover:opacity-100

              transition-all

              flex
              items-center
              justify-center

              w-8
              h-8

              rounded-xl

              border
              border-white/[0.08]

              bg-black/40
              backdrop-blur-xl

              text-white/60
              hover:text-white
            "
          >
            {copied ? (
              <Check className="w-4 h-4 text-green-400" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </button>
        )}
      </div>

      {/* User Avatar */}
      {isUser && (
        <div className="flex items-center justify-center shrink-0 w-10 h-10 rounded-2xl border border-white/[0.08] bg-white/[0.04]">
          <User className="w-4 h-4 text-white/70" />
        </div>
      )}
    </motion.div>
  );
}