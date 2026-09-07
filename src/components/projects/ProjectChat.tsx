"use client";

import {
  useEffect,
  useState,
  useRef,
  useCallback,
} from "react";

import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";

import "highlight.js/styles/github-dark.css";

import {
  ArrowUp,
  Loader2,
  Brain,
  Check,
  Copy,
  FileText,
  ImagePlus,
  Lightbulb,
  Paperclip,
  Pencil,
  Search,
  Sparkles,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Message {
  id: string;
  role: string;
  content: string;
  attachments?: {
    name: string;
    size: number;
    type?: string;
  }[];
}

interface ProjectChatProps {
  projectId: string;
  projectName?: string;

  onOpenMemoryDrawer?: () => void;

  onFileUpload?: (file: File) => void;
  onImageUpload?: (file: File) => void;
}


// ─── Suggested prompts (empty state) ───────────────────────────────────────────

const SUGGESTED_PROMPTS = [
  {
    icon: FileText,
    label: "Summarize everything in this workspace",
  },
  {
    icon: Search,
    label: "Search my workspace knowledge",
  },
  {
    icon: Brain,
    label: "What should I know before I continue?",
  },
  {
    icon: Sparkles,
    label: "Help me plan the next steps",
  },
];

// ─── Suggested prompt chip ──────────────────────────────────────────────────

interface SuggestedPromptProps {
  icon: LucideIcon;
  label: string;
  delay: number;
  onSelect: (label: string) => void;
}

function SuggestedPrompt({ icon: Icon, label, delay, onSelect }: SuggestedPromptProps) {
  return (
    <motion.button
      type="button"
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay, ease: "easeOut" }}
      onClick={() => onSelect(label)}
      className="
        group flex items-center gap-2.5 rounded-[10px]
        border border-[rgba(255,255,255,0.07)]
        bg-[rgba(255,255,255,0.02)]
        px-4 py-3 text-left
        transition-colors duration-150
        hover:border-[rgba(124,58,237,0.3)] hover:bg-[rgba(124,58,237,0.06)]
      "
    >
      <Icon className="h-[15px] w-[15px] shrink-0 text-[#7C3AED]" strokeWidth={1.75} />
      <span className="text-[13px] leading-snug text-[#8B8BA3] transition-colors group-hover:text-[#C4C4D4]">
        {label}
      </span>
    </motion.button>
  );
}

// ─── Empty state ──────────────────────────────────────────────────────────────

interface EmptyStateProps {
  projectName?: string;
  onSelectPrompt: (label: string) => void;
}

function EmptyState({ projectName, onSelectPrompt }: EmptyStateProps) {
  return (
    <div className="flex h-full flex-col items-center justify-center px-6 py-12">
      <div className="w-full max-w-[520px] text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl border border-[#7C3AED]/20 bg-gradient-to-br from-[#7C3AED]/15 to-[#A78BFA]/10 shadow-[0_12px_40px_rgba(124,58,237,0.18)]"
        >
          <Brain className="h-5 w-5 text-[#A78BFA]" strokeWidth={1.75} />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.05, ease: "easeOut" }}
          className="text-[28px] font-semibold tracking-[-0.03em] text-white"
        >
          {projectName ?? "This workspace"}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1, ease: "easeOut" }}
          className="mx-auto mt-3 max-w-[420px] text-[15px] leading-8 text-[#9A98AC]"
        >
          Ask anything about this workspace. Hymora automatically uses your workspace goal, knowledge and uploaded files to answer with context.
        </motion.p>

        <div className="mt-7 grid grid-cols-1 gap-2 sm:grid-cols-2">
          {SUGGESTED_PROMPTS.map((prompt, i) => (
            <SuggestedPrompt
              key={prompt.label}
              icon={prompt.icon}
              label={prompt.label}
              delay={0.15 + i * 0.05}
              onSelect={onSelectPrompt}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

interface UserMessageProps {
  msg: Message;
  onEdit: (msg: Message) => void;
}

function UserMessage({ msg, onEdit }: UserMessageProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.18 }}
      className="group flex justify-end"
    >
      <div className="flex max-w-[82%] items-end gap-2">

        <button
          onClick={() => onEdit(msg)}
          className="mb-2 rounded-lg p-1.5 opacity-0 transition-all duration-150 hover:bg-white/5 group-hover:opacity-100"
          aria-label="Edit message"
        >
          <Pencil
            className="h-3.5 w-3.5 text-[#7C7C96] hover:text-[#A78BFA]"
            strokeWidth={1.8}
          />
        </button>

        <div className="overflow-hidden rounded-2xl border border-[rgba(124,58,237,0.18)] bg-[linear-gradient(180deg,rgba(124,58,237,0.16),rgba(124,58,237,0.10))] shadow-[0_0_0_1px_rgba(255,255,255,0.02)]">

          {msg.attachments && msg.attachments.length > 0 && (
            <div className="space-y-2 border-b border-white/5 p-3">
              {msg.attachments.map((file) => (
                <div
                  key={file.name}
                  className="flex items-center gap-3 rounded-xl border border-white/5 bg-black/20 px-3 py-2"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[rgba(124,58,237,0.16)]">
                    <FileText
                      className="h-4.5 w-4.5 text-[#A78BFA]"
                      strokeWidth={1.8}
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13px] font-medium text-white">
                      {file.name}
                    </p>

                    <p className="mt-0.5 text-[11px] text-[#8B8BA3]">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {msg.content.trim().length > 0 && (
            <div className="px-4 py-3">
              <p className="whitespace-pre-wrap break-words text-[15px] leading-7 text-[#ECECF8]">
                {msg.content}
              </p>
            </div>
          )}
        </div>

      </div>
    </motion.div>
  );
}
// ─── Typing indicator ─────────────────────────────────────────────────────────

function TypingIndicator() {
  const steps = [
    "Searching workspace memory...",
    "Reading project knowledge...",
    "Preparing response...",
  ];

  const [step, setStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStep((current) => (current + 1) % steps.length);
    }, 1200);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-start gap-3 py-1">
      <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[rgba(124,58,237,0.12)]">
        <Brain
          className="h-3.5 w-3.5 text-[#A78BFA]"
          strokeWidth={1.75}
        />
      </div>

      <div>
        <p className="text-[13px] font-medium text-[#E5E5F0]">
          Working on your request
        </p>

        <motion.p
          key={step}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{
            duration: 0.25,
            ease: "easeOut",
          }}
          className="mt-1 text-[12px] text-[#8B8BA3]"
        >
          {steps[step]}
        </motion.p>
      </div>
    </div>
  );
}

// ─── Assistant message ────────────────────────────────────────────────────────

interface AssistantMessageProps {
  msg: Message;
  isCopied: boolean;
  isStreaming: boolean;
  onCopy: (id: string, content: string) => void;
  onRegenerate?: () => void;
}

function AssistantMessage({
  msg,
  isCopied,
  isStreaming,
  onCopy,
  onRegenerate,
}: AssistantMessageProps) {
  if (isStreaming && !msg.content) return <TypingIndicator />;

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.16,
        ease: "easeOut",
      }}
      className="group relative flex items-start gap-3"
    >
      <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[rgba(124,58,237,0.12)]">
        <Brain className="h-3.5 w-3.5 text-[#A78BFA]" strokeWidth={1.75} />
      </div>

      <div className="min-w-0 flex-1">
        {/* Copy button */}
        {!isStreaming && (
          <>
            <button
              onClick={() => onCopy(msg.id, msg.content)}
              aria-label="Copy response"
              className="absolute right-0 top-0 flex items-center gap-1.5 rounded-[6px] px-2 py-1 text-[11px] text-[#5A5A72] opacity-0 transition-all duration-150 hover:text-[#A78BFA] group-hover:opacity-100"
            >
              {isCopied ? (
                <>
                  <Check
                    className="h-3 w-3 text-[#639922]"
                    strokeWidth={2}
                  />
                  <span className="text-[#639922]">
                    Copied to clipboard
                  </span>
                </>
              ) : (
                <>
                  <Copy
                    className="h-3 w-3"
                    strokeWidth={1.75}
                  />
                  Copy response
                </>
              )}
            </button>

            {onRegenerate && (
              <button
                type="button"
                onClick={onRegenerate}
                className="
          absolute right-[118px] top-0
          flex items-center gap-1.5
          rounded-[6px]
          px-2 py-1
          text-[11px]
          text-[#5A5A72]
          opacity-0
          transition-all
          hover:text-[#A78BFA]
          group-hover:opacity-100
        "
              >
                <Sparkles
                  className="h-3 w-3"
                  strokeWidth={1.8}
                />
                Regenerate
              </button>
            )}
          </>
        )}



        {/* Markdown — tuned for maximum reading comfort */}
        <>


          <div
            className="
      prose prose-sm max-w-none

            prose-headings:font-medium
            prose-headings:tracking-[-0.03em]
            prose-headings:text-[#E5E5F0]
            prose-headings:mb-2
            prose-headings:mt-5

            prose-h1:text-[18px]
            prose-h2:text-[16px]
            prose-h3:text-[14px]

            prose-p:text-[#C4C4D4]
            prose-p:leading-8
            prose-p:text-[15.5px]
            prose-p:my-2.5

            prose-strong:text-[#E5E5F0]
            prose-strong:font-medium

            prose-code:rounded-[4px]
            prose-code:bg-[rgba(124,58,237,0.1)]
            prose-code:border
            prose-code:border-[rgba(124,58,237,0.14)]
            prose-code:px-1.5
            prose-code:py-0.5
            prose-code:text-[#A78BFA]
            prose-code:text-[12.5px]
            prose-code:font-mono
            prose-code:before:content-none
            prose-code:after:content-none

            prose-pre:rounded-[10px]
            prose-pre:border
            prose-pre:border-[rgba(255,255,255,0.05)]
            prose-pre:bg-[#0D0B14]
            prose-pre:p-4
            prose-pre:text-[12.5px]
            prose-pre:my-3

            prose-li:text-[#C4C4D4]
            prose-li:text-[15px]
            prose-li:leading-[1.7]
            prose-li:my-0.5

            prose-ul:my-2.5
            prose-ol:my-2.5
            prose-ul:pl-6
            prose-ol:pl-5

            prose-hr:border-[rgba(255,255,255,0.05)]
            prose-hr:my-4

            prose-blockquote:border-l-2
            prose-blockquote:border-l-[#7C3AED]
            prose-blockquote:pl-4
            prose-blockquote:text-[#8B8BA3]
            prose-blockquote:not-italic
            prose-blockquote:my-3

            prose-table:text-[13.5px]
            prose-th:text-[#E5E5F0]
            prose-th:font-medium
            prose-th:border-b
            prose-th:border-[rgba(255,255,255,0.08)]
            prose-th:pb-2
            prose-td:text-[#C4C4D4]
            prose-td:border-b
            prose-td:border-[rgba(255,255,255,0.04)]
            prose-td:py-2
          "
          >
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeHighlight]}
              components={{
                a: (props) => (
                  <a
                    {...props}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#A78BFA] underline underline-offset-4 hover:text-[#C4B5FD]"
                  />
                ),


              }}
            >
              {msg.content}
            </ReactMarkdown>
          </div>
        </>

        {/* Streaming cursor — smooth, no layout shift */}
        {isStreaming && msg.content && (
          <motion.span
            animate={{ opacity: [0.25, 1, 0.25] }}
            transition={{ duration: 1.1, repeat: Infinity, ease: "easeInOut" }}
            className="mt-1 inline-block h-3.5 w-[3px] rounded-full bg-[#A78BFA]"
          />
        )}
      </div>
    </motion.div>
  );
}

// ─── Composer ─────────────────────────────────────────────────────────────────
// Single floating rounded container — ChatGPT/Claude/Cursor style.
// Attach (file + image) on the left, auto-growing textarea, send button on the right.

interface ComposerProps {
  value: string;
  loading: boolean;
  uploading: boolean;
  selectedFiles: File[];
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
  onChange: (val: string) => void;
  onSend: () => void;
  isEditing?: boolean;
  onFileUpload?: (file: File) => void;
  onImageUpload?: (file: File) => void;
}


function Composer({
  value,
  loading,
  uploading,
  selectedFiles,
  textareaRef,
  onChange,
  onSend,
  onFileUpload,
  onImageUpload,
  isEditing,
}: ComposerProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);


  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key.toLowerCase() === "u") {
        e.preventDefault();
        fileInputRef.current?.click();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handlePaste = async (
    e: React.ClipboardEvent<HTMLTextAreaElement>
  ) => {
    const items = Array.from(
      e.clipboardData.items
    );

    const image = items.find((item) =>
      item.type.startsWith("image/")
    );

    if (!image || !onImageUpload) return;

    e.preventDefault();

    const file = image.getAsFile();

    if (file) {
      onImageUpload(file);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();

      if (
        loading ||
        uploading ||
        (
          !value.trim() &&
          selectedFiles.length === 0
        )
      ) {
        return;
      }

      onSend();
    }
  };

  return (
    <div className="shrink-0 px-4 pb-5 pt-2">
      <div className="mx-auto w-[90%] max-w-[900px]">
        <div
          className="
    relative
    flex items-end gap-1
    overflow-hidden
    rounded-3xl
    border border-white/[0.07]
    bg-gradient-to-br from-[#0F0C16] via-[#0D0B14] to-[#09080E]
    py-2.5 pl-2.5 pr-2.5
    shadow-[0_10px_35px_rgba(0,0,0,0.45)]
    transition-all duration-200
    before:absolute before:inset-x-0 before:top-0 before:h-px
    before:bg-gradient-to-r before:from-[#7C3AED] before:via-[#A78BFA] before:to-transparent
    before:opacity-0
    focus-within:border-[#7C3AED]/30
    focus-within:before:opacity-100
    focus-within:shadow-[0_0_0_3px_rgba(124,58,237,0.08),0_12px_40px_rgba(124,58,237,0.12)]
  "
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept=".pdf,.doc,.docx,.txt,.md,.csv,.xlsx,.ppt,.pptx,.png,.jpg,.jpeg,.webp"
            className="hidden"
            onChange={(e) => {
              const files = Array.from(e.target.files ?? []);

              if (!files.length || !onFileUpload) return;

              files.forEach((file) => {
                onFileUpload(file);
              });

              e.currentTarget.value = "";
            }}
          />

          {/* Attach file */}
          <button
            onClick={() => fileInputRef.current?.click()}
            aria-label="Upload files"
            title="Upload files (Ctrl + U)"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[#5A5A72] transition-colors duration-150 hover:bg-[rgba(255,255,255,0.05)] hover:text-[#A78BFA]"
          >
            <Paperclip className="h-[17px] w-[17px]" strokeWidth={1.75} />
          </button>

          {/* Attach image */}
          <button
            onClick={() => fileInputRef.current?.click()}
            aria-label="Attach image"
            title="Paste or upload image"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[#5A5A72] transition-colors duration-150 hover:bg-[rgba(255,255,255,0.05)] hover:text-[#A78BFA]"
          >
            <ImagePlus className="h-[17px] w-[17px]" strokeWidth={1.75} />
          </button>

          {/* Textarea — auto-grows up to 160px */}
          <textarea
            spellCheck={false}
            autoCorrect="off"
            autoCapitalize="off"
            onPaste={handlePaste}
            ref={textareaRef}
            value={value}
            rows={1}
            style={{ height: "20px" }}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              isEditing
                ? "Update your message..."
                : "Ask anything about this workspace..."
            }
            disabled={loading || uploading}
            className="
          block min-h-[20px] max-h-[180px] flex-1 resize-none
              overflow-y-auto overflow-x-hidden
              whitespace-pre-wrap break-words
              bg-transparent px-1 py-0.5
              text-[15px] leading-relaxed text-[#E5E5F0] outline-none
              placeholder:text-[#6B6882]
              disabled:cursor-not-allowed disabled:opacity-60
            "
          />

          {/* Send */}
          <button
            onClick={onSend}
            disabled={
              loading ||
              uploading ||
              (
                !value.trim() &&
                selectedFiles.length === 0
              )
            }
            aria-busy={loading}
            aria-label="Send message"
            className="
 flex h-9 w-9 shrink-0 items-center justify-center rounded-full
  bg-gradient-to-br from-[#7C3AED] to-[#A855F7]
  text-white
  shadow-[0_8px_24px_rgba(124,58,237,0.35)]
  transition-all duration-200
  hover:scale-110 hover:shadow-[0_12px_30px_rgba(124,58,237,0.45)]
  active:scale-95
  disabled:cursor-not-allowed
  disabled:bg-[#1B1824]
  disabled:text-[#55506A]
  disabled:shadow-none
"
          >
            {uploading ? (
              <Loader2 className="h-4 w-4 animate-spin" strokeWidth={2} />
            ) : loading ? (
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white/80" />
            ) : (
              isEditing ? (
                <Check className="h-4 w-4" strokeWidth={2.25} />
              ) : (
                <ArrowUp className="h-4 w-4" strokeWidth={2.25} />
              )
            )}
          </button>
        </div>

        <p className="mt-2 text-center text-[11px] text-[#3A3A52]">
          Responses are grounded in your workspace context. Always verify important information.
        </p>
      </div>
    </div>
  );
}

// ─── Root component ───────────────────────────────────────────────────────────

export function ProjectChat({
  projectId,
  projectName,
  onOpenMemoryDrawer,
  onFileUpload,
  onImageUpload,
}: ProjectChatProps) {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<
    {
      file: File;
      status: "uploading" | "processing" | "ready" | "error";
    }[]
  >([]);

  const [messages, setMessages] = useState<Message[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [streamingId, setStreamingId] = useState<string | null>(null);
  const [editingMessageId, setEditingMessageId] =
    useState<string | null>(null);

  const isEditing =
    editingMessageId !== null;

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [messages]);

  // ── Auto-resize textarea ──────────────────────────────────────────────────

  const autoResize = useCallback(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "0px";
    el.style.height = Math.min(el.scrollHeight, 160) + "px";
  }, []);

  useEffect(() => { autoResize(); }, [message, autoResize]);



  // ── Load messages ─────────────────────────────────────────────────────────

  const loadMessages = useCallback(async () => {
    try {
      const res = await fetch(`/api/projects/messages/${projectId}`);
      const data = await res.json();

      setMessages(data);
    } catch (error) {
      console.error("[ProjectChat] loadMessages error:", error);
    }
  }, [projectId]);

  useEffect(() => { loadMessages(); }, [loadMessages]);

  // ── Actions ───────────────────────────────────────────────────────────────

  const handleEditPrompt = useCallback((msg: Message) => {
    setEditingMessageId(msg.id);
    setMessage(msg.content);

    requestAnimationFrame(() => {
      messagesEndRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    });
  }, []);

  const handleSelectPrompt = useCallback(
    (prompt: string) => {
      setMessage(prompt);

      requestAnimationFrame(() => {
        textareaRef.current?.focus();

        textareaRef.current?.setSelectionRange(
          prompt.length,
          prompt.length
        );
      });
    },
    []
  );

  const handleRegenerate = useCallback(
    (assistantMessageId: string) => {
      const assistantIndex = messages.findIndex(
        (m) => m.id === assistantMessageId
      );

      if (assistantIndex <= 0) return;

      const previousUserMessage = [...messages]
        .slice(0, assistantIndex)
        .reverse()
        .find((m) => m.role === "user");

      if (!previousUserMessage) return;

      setEditingMessageId(previousUserMessage.id);
      setMessage(previousUserMessage.content);

      requestAnimationFrame(() => {
        textareaRef.current?.focus();
      });
    },
    [messages]
  );

  const handleCopy = useCallback(
    async (id: string, content: string) => {
      try {
        await navigator.clipboard.writeText(content);
        setCopiedId(id);

        setTimeout(() => {
          setCopiedId(null);
        }, 2000);
      } catch (error) {
        console.error(error);
      }
    },
    []
  );

  const handleSend = useCallback(async () => {
    console.log("SEND CLICKED");
    console.log("MESSAGE:", message);
    console.log("FILES:", selectedFiles);

    const trimmed = message.trim();

    if ((!trimmed && selectedFiles.length === 0) || loading) {
      return;
    }

    const tempStreamingId = `streaming-${Date.now()}`;

    try {
      setLoading(true);
      setMessage("");

      if (editingMessageId) {
  setMessages((prev) => {
    const index = prev.findIndex(
      (m) => m.id === editingMessageId
    );

    if (index === -1) return prev;

    const updated = [...prev];

    updated[index] = {
      ...updated[index],
      content: trimmed,
    };

    // Edited message ke baad ki poori branch remove karo
    return [
      ...updated.slice(0, index + 1),
      {
        id: tempStreamingId,
        role: "assistant",
        content: "",
      },
    ];
  });

  setEditingMessageId(null);
      } else {
        const userMessage: Message = {
          id: `local-${Date.now()}`,
          role: "user",
          content: trimmed,
          attachments: selectedFiles
            .filter((item) => item.status === "ready")
            .map((item) => ({
              name: item.file.name,
              size: item.file.size,
              type: item.file.type,
            })),
        };

        setMessages((prev) => [
          ...prev,
          userMessage,
          {
            id: tempStreamingId,
            role: "assistant",
            content: "",
          },
        ]);
      }

      setStreamingId(tempStreamingId);

      setSelectedFiles([]);

      console.log("POSTING TO:", "/api/chat");

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: trimmed,
          projectId,
          editingMessageId,
          attachments: selectedFiles.map((item) => ({
            name: item.file.name,
            size: item.file.size,
            type: item.file.type,
          })),
        }),
      });

      if (!res.ok) {
        const data = await res.json();

        if (
          res.status === 403 &&
          data.upgrade
        ) {
          window.dispatchEvent(
            new CustomEvent(
              "open-upgrade-modal",
              {
                detail: {
                  type:
                    data.type ??
                    "chat",
                },
              }
            )
          );

          return;
        }

        throw new Error(
          data.error || "Request failed"
        );
      }

      const reader = res.body?.getReader();

      if (!reader) {
        throw new Error("No response stream.");
      }

      let aiResponse = "";

      while (true) {
        if (!document.hasFocus()) {
          await new Promise((resolve) =>
            setTimeout(resolve, 50)
          );
        }

        const { done, value } =
          await reader.read();

        if (done) break;

        aiResponse += new TextDecoder().decode(value);

        setMessages((prev) => {
          const updated = prev.map((m) =>
            m.id === tempStreamingId
              ? {
                ...m,
                content: aiResponse,
              }
              : m
          );

          requestAnimationFrame(() => {
            messagesEndRef.current?.scrollIntoView({
              behavior: "smooth",
              block: "end",
            });
          });

          return updated;
        });
      }

      await loadMessages();

      setSelectedFiles((prev) =>
        prev.map((item) => ({
          ...item,
          status: "ready",
        }))
      );

      requestAnimationFrame(() => {
        messagesEndRef.current?.scrollIntoView({
          behavior: "auto",
          block: "end",
        });
      });

      requestAnimationFrame(() => {
        messagesEndRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "end",
        });
      });

      setSelectedFiles([]);

      requestAnimationFrame(() => {
        textareaRef.current?.focus();
      });
    } catch (error) {
      console.error("[ProjectChat] handleSend error:", error);

      setMessages((prev) =>
        prev.filter(
          (m) => m.id !== tempStreamingId
        )
      );
    } finally {
      setLoading(false);
      setStreamingId(null);
      setEditingMessageId(null);

      requestAnimationFrame(() => {
        if (!textareaRef.current) return;

        textareaRef.current.style.height = "0px";
        textareaRef.current.style.height = "24px";
      });
    }
  }, [
    message,
    loading,
    projectId,
    loadMessages,
    selectedFiles,
    editingMessageId,
  ]);
  // ─────────────────────────────────────────────────────────────────────────

  return (
    <div
      className="relative z-0 flex h-full flex-col overflow-hidden bg-[#05030A]"
      onDragEnter={() => setIsDragging(true)}
      onDragLeave={() => setIsDragging(false)}
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}

      onDrop={(e) => {
        setIsDragging(false);
        e.preventDefault();

        const files = Array.from(e.dataTransfer.files);

        files.forEach((file) => {
          if (
            file.type === "application/pdf" ||
            file.name.endsWith(".doc") ||
            file.name.endsWith(".docx") ||
            file.name.endsWith(".txt") ||
            file.name.endsWith(".md")
          ) {
            void (async () => {
              setUploading(true);

              try {
                setSelectedFiles((prev) => [
                  ...prev,
                  {
                    file,
                    status: "uploading",
                  },
                ]);

                const formData = new FormData();

                formData.append("file", file);
                formData.append("projectId", projectId);

                const response = await fetch(
                  "/api/projects/files/upload-storage",
                  {
                    method: "POST",
                    body: formData,
                  }
                );

                const data = await response.json();

                if (!response.ok) {

                  if (
                    response.status === 403 &&
                    data.upgrade
                  ) {

                    setSelectedFiles((prev) =>
                      prev.filter(
                        (item) => item.file !== file
                      )
                    );

                    window.dispatchEvent(
                      new CustomEvent(
                        "open-upgrade-modal",
                        {
                          detail: {
                            type:
                              data.type ??
                              "pdf",
                          },
                        }
                      )
                    );

                    return;
                  }

                  throw new Error(
                    data.error ??
                    "Upload failed"
                  );
                }

                setSelectedFiles((prev) =>
                  prev.map((item) =>
                    item.file === file
                      ? {
                        ...item,
                        status: "ready",
                      }
                      : item
                  )
                );

              } catch (error) {
                console.error(error);

                setSelectedFiles((prev) =>
                  prev.filter((item) => item.file !== file)
                );
              } finally {
                setUploading(false);
                setIsDragging(false);
              }
            })();
          }
        });
      }}
    >
      {/* Memory button is rendered in Project page header */}
      {false && onOpenMemoryDrawer && (
        <button
          onClick={onOpenMemoryDrawer}
          aria-label="Open memory"
          title="Memory"
          className="
            absolute right-5 top-4 z-10
            flex h-8 w-8 items-center justify-center rounded-full
            border border-[rgba(255,255,255,0.07)]
            bg-[rgba(13,11,20,0.7)]
            text-[#5A5A72] backdrop-blur-sm
            transition-colors duration-150
            hover:border-[rgba(124,58,237,0.3)] hover:text-[#A78BFA]
          "
        >
          <Brain className="h-4 w-4" strokeWidth={1.75} />
        </button>
      )}

      {isDragging && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-[#05030A]/80 backdrop-blur-sm">
          <div className="rounded-2xl border border-dashed border-[#7C3AED]/50 bg-[#0F0C16] px-10 py-8 text-center">
            <p className="text-lg font-semibold text-white">
              Drop files to add them to this workspace
            </p>
            <p className="mt-2 text-sm text-[#8B8BA3]">
              They'll be indexed automatically for AI conversations.
            </p>
          </div>
        </div>
      )}

      {/* Conversation canvas */}
      <div className="flex-1 overflow-y-auto scroll-smooth overscroll-contain">
        {messages.length === 0 ? (
          <EmptyState projectName={projectName} onSelectPrompt={handleSelectPrompt} />
        ) : (
          <div className="mx-auto w-[90%] max-w-[860px] space-y-8 px-2 py-10">
            {Array.isArray(messages) &&
              messages.map((msg) =>
                msg.role === "user" ? (
                  <UserMessage
                    key={msg.id}
                    msg={msg}
                    onEdit={handleEditPrompt}
                  />
                ) : (
                  <AssistantMessage
                    key={msg.id}
                    msg={msg}
                    isCopied={copiedId === msg.id}
                    isStreaming={streamingId === msg.id}
                    onCopy={handleCopy}
                    onRegenerate={() =>
                      handleRegenerate(msg.id)
                    }
                  />
                )
              )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Composer — pinned to bottom, floating */}


      <>
        {selectedFiles.length > 0 && (
          <div className="mx-auto mb-3 w-[90%] max-w-[980px]">
            <div className="flex flex-wrap gap-2 rounded-2xl border border-white/[0.06] bg-[#0D0B14] p-3">

              {selectedFiles.map((item, index) => (
                <div
                  key={`${item.file.name}-${index}`}
                  className="group flex items-center gap-3 rounded-2xl border border-white/[0.06] bg-[#12101A] px-3 py-2 transition-all hover:border-[#A78BFA]/40 hover:bg-[#171320]"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#7C3AED]/10">
                    {item.file.type.startsWith("image/") ? (
                      <ImagePlus
                        className="h-4 w-4 text-[#22C55E]"
                        strokeWidth={1.75}
                      />
                    ) : item.file.type === "application/pdf" ? (
                      <FileText
                        className="h-4 w-4 text-[#EF4444]"
                        strokeWidth={1.75}
                      />
                    ) : (
                      <FileText
                        className="h-4 w-4 text-[#A78BFA]"
                        strokeWidth={1.75}
                      />
                    )}
                  </div>

                  <div className="min-w-0">
                    <p className="max-w-[180px] truncate text-[13px] font-medium text-white">
                      {item.file.name}
                    </p>

                    <p className="mt-0.5 text-[11px] text-[#6B6B85]">
                      {(item.file.size / 1024 / 1024).toFixed(2)} MB
                    </p>

                    <div className="mt-1 flex items-center gap-1 text-[11px] text-[#6B6B85]">
                      {item.status === "uploading" && (
                        <>
                          <Loader2 className="h-3 w-3 animate-spin" />
                          <span>Uploading to workspace...</span>
                        </>
                      )}

                      {item.status === "processing" && (
                        <>
                          <Loader2 className="h-3 w-3 animate-spin text-[#A78BFA]" />
                          <span>Indexing workspace...</span>
                        </>
                      )}

                      {item.status === "ready" && (
                        <>
                          <Check className="h-3 w-3 text-[#22C55E]" />
                          <span className="text-[#22C55E]">
                            Indexed and ready
                          </span>
                        </>
                      )}

                      {item.status === "error" && (
                        <>
                          <span className="text-[#EF4444]">
                            Upload failed
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      setSelectedFiles((prev) =>
                        prev.filter((_, i) => i !== index)
                      )
                    }
                    disabled={
                      item.status === "uploading" ||
                      item.status === "processing"
                    }
                    className="ml-1 flex h-7 w-7 items-center justify-center rounded-lg text-[#6B6B85] transition-all hover:bg-white/5 hover:text-white"
                  >
                    ×
                  </button>
                </div>
              ))}

            </div>
          </div>
        )}

        {isEditing && (
          <div className="mx-auto mb-3 flex w-[90%] max-w-[900px] items-center justify-between rounded-2xl border border-[#7C3AED]/20 bg-[#120F1D] px-4 py-3">
            <div>
              <p className="text-sm font-medium text-white">
                Editing message
              </p>
              <p className="text-xs text-[#8B8BA3]">
                Update your prompt and press Enter.
              </p>
            </div>

            <button
              onClick={() => {
                setEditingMessageId(null);
                setMessage("");
              }}
              className="text-xs font-medium text-[#A78BFA] hover:text-[#C4B5FD]"
            >
              Cancel
            </button>
          </div>
        )}

        <Composer
          value={message}
          loading={loading}
          uploading={uploading}
          selectedFiles={selectedFiles.map((item) => item.file)}
          textareaRef={textareaRef}
          onChange={setMessage}
          onSend={handleSend}
          isEditing={isEditing}
          onFileUpload={async (file) => {
            try {
              setUploading(true);

              setSelectedFiles((prev) => [
                ...prev,
                {
                  file,
                  status: "uploading",
                },
              ]);

              const formData = new FormData();

              formData.append("file", file);
              formData.append("projectId", projectId);

              const response = await fetch(
                "/api/projects/files/upload-storage",
                {
                  method: "POST",
                  body: formData,
                }
              );

              const data = await response.json();

              const uploadedFile = data.file;

              if (!response.ok) {

                if (
                  response.status === 403 &&
                  data.upgrade
                ) {
                  setSelectedFiles((prev) =>
                    prev.filter((item) => item.file !== file)
                  );

                  window.dispatchEvent(
                    new CustomEvent(
                      "open-upgrade-modal",
                      {
                        detail: {
                          type:
                            data.type ??
                            "pdf",
                        },
                      }
                    )
                  );

                  return;
                }

                throw new Error(
                  data.error
                );
              }

              // Keep attachment card visible until user sends the message.
              // Don't reload chat after upload.
              // The file will appear when the user sends the message.

              // Upload successful

              setSelectedFiles((prev) =>
                prev.map((item) =>
                  item.file.name === file.name &&
                    item.file.size === file.size
                    ? {
                      ...item,
                      status: "ready",
                    }
                    : item
                )
              );

              // Upload completed successfully.
              // Keep attachment card visible until user sends a message.

            } catch (error) {

              console.error(error);

              setSelectedFiles((prev) =>
                prev.filter((item) => item.file !== file)
              );

            } finally {
              setUploading(false);
            }
          }}
          onImageUpload={onImageUpload}
        />
      </>
    </div>
  );
}