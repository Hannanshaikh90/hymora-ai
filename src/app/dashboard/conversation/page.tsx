"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Trash2, PanelLeft } from "lucide-react";
import { useUser } from "@clerk/nextjs";

import { supabase } from "@/lib/supabase";

import { ConversationSidebar } from "@/components/dashboard/ConversationSidebar";
import { TypingIndicator } from "@/components/dashboard/TypingIndicator";
import { ConversationInput } from "@/components/dashboard/ConversationInput";
import { MessageBubble } from "@/components/dashboard/MessageBubble";
import { EmptyConversation } from "@/components/dashboard/EmptyConversation";

// ─────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface Chat {
  id?: string;
  title: string;
  messages: Message[];
}

// ─────────────────────────────────────────────────────────────
// Default Chat
// ─────────────────────────────────────────────────────────────

const DEFAULT_CHAT: Chat = {
  title: "Welcome Chat",
  messages: [
    {
      role: "assistant",
      content:
        "Hello! I’m Nexus AI. How can I help you today?",
    },
  ],
};

// ─────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────

export default function ConversationPage() {
  const { user } = useUser();

  const [chats, setChats] = useState<Chat[]>([
    DEFAULT_CHAT,
  ]);

  const [activeChat, setActiveChat] =
    useState(0);

  const [isLoading, setIsLoading] =
    useState(false);

  const [isFetchingChats, setIsFetchingChats] =
    useState(true);

  const [sidebarOpen, setSidebarOpen] =
    useState(true);

  const [hydrated, setHydrated] =
    useState(false);

  const bottomRef =
    useRef<HTMLDivElement | null>(null);

  const currentChat =
    chats[activeChat] ?? chats[0];

  const messages =
    currentChat?.messages ?? [];

  // ───────────────────────────────────────────────────────────
  // Hydrate Local Storage
  // ───────────────────────────────────────────────────────────

  useEffect(() => {
    if (typeof window === "undefined")
      return;

    try {
      const stored =
        localStorage.getItem("nexus-chats");

      if (stored) {
        const parsed: Chat[] =
          JSON.parse(stored);

        if (
          Array.isArray(parsed) &&
          parsed.length > 0
        ) {
          setChats(parsed);
        }
      }
    } catch (error) {
      console.error(
        "Failed to parse local chats:",
        error
      );
    }

    setHydrated(true);
  }, []);

  // ───────────────────────────────────────────────────────────
  // Persist Local Storage
  // ───────────────────────────────────────────────────────────

  useEffect(() => {
    if (!hydrated) return;

    localStorage.setItem(
      "nexus-chats",
      JSON.stringify(chats)
    );
  }, [chats, hydrated]);

  // ───────────────────────────────────────────────────────────
  // Load Chats From Supabase
  // ───────────────────────────────────────────────────────────

  useEffect(() => {
    if (!user?.id) {
      setIsFetchingChats(false);
      return;
    }

    const loadChats = async () => {
      try {
        const { data, error } =
          await supabase
            .from("chats")
            .select("*")
            .eq("user_id", user.id)
            .order("created_at", {
              ascending: true,
            });

        if (error) {
          console.error(
            "Failed to load chats:",
            error
          );
          return;
        }

        if (data && data.length > 0) {
          const formattedChats: Chat[] =
            data.map((chat) => ({
              id: chat.id,
              title: chat.title,
              messages: chat.messages,
            }));

          setChats(formattedChats);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsFetchingChats(false);
      }
    };

    loadChats();
  }, [user?.id]);

  // ───────────────────────────────────────────────────────────
  // Keep Active Chat Valid
  // ───────────────────────────────────────────────────────────

  useEffect(() => {
    if (chats.length === 0) {
      setChats([
        {
          title: "New Chat",
          messages: [],
        },
      ]);

      setActiveChat(0);
    }

    if (activeChat >= chats.length) {
      setActiveChat(chats.length - 1);
    }
  }, [chats, activeChat]);

  // ───────────────────────────────────────────────────────────
  // Auto Scroll
  // ───────────────────────────────────────────────────────────

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, isLoading]);

  // ───────────────────────────────────────────────────────────
  // Clear Chat
  // ───────────────────────────────────────────────────────────

  const handleClear = async () => {
    const updatedChats = [...chats];

    updatedChats[activeChat] = {
      ...updatedChats[activeChat],
      messages: [],
    };

    setChats(updatedChats);

    const current =
      updatedChats[activeChat];

    if (current?.id) {
      await supabase
        .from("chats")
        .update({
          messages: [],
        })
        .eq("id", current.id);
    }
  };

  // ───────────────────────────────────────────────────────────
  // Send Message
  // ───────────────────────────────────────────────────────────

  const handleSend = async (
    message: string
  ) => {
    if (!message.trim() || isLoading)
      return;

    const userMessage: Message = {
      role: "user",
      content: message,
    };

    const updatedChats = structuredClone(chats);

    updatedChats[activeChat].messages.push(userMessage);

    // Auto Title
    if (updatedChats[activeChat].messages.length === 1) {
      updatedChats[activeChat].title =
        message.length > 30
          ? message.slice(0, 30) + "..."
          : message;
    }

    setChats(updatedChats);

    setIsLoading(true);

    try {
      const response = await fetch(
        "/api/chat",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            prompt: message,
          }),
        }
      );

      if (!response.body) {
        throw new Error(
          "No response body."
        );
      }

      const reader =
        response.body.getReader();

      const decoder =
        new TextDecoder();

      let streamedText = "";

      const assistantMessage: Message =
      {
        role: "assistant",
        content: "",
      };

      const streamingChats = structuredClone(updatedChats);

      streamingChats[activeChat] = {
        ...streamingChats[activeChat],

        messages: [
          ...streamingChats[activeChat]
            .messages,

          assistantMessage,
        ],
      };

      setChats(streamingChats);

      while (true) {
        const { done, value } =
          await reader.read();

        if (done) break;

        const chunk =
          decoder.decode(value);

        streamedText += chunk;

        streamingChats[activeChat]
          .messages[
          streamingChats[activeChat]
            .messages.length - 1
        ].content = streamedText;

        setChats([
          ...streamingChats,
        ]);
      }

      // Save To Supabase

      const currentChat =
        streamingChats[activeChat];

      if (currentChat.id) {
        await supabase
          .from("chats")
          .update({
            title: currentChat.title,
            messages:
              currentChat.messages,
          })
          .eq("id", currentChat.id);
      } else {
        const { data: insertedChat } =
          await supabase
            .from("chats")
            .insert([
              {
                user_id: user?.id,
                title: currentChat.title,
                messages:
                  currentChat.messages,
              },
            ])
            .select()
            .single();

        if (insertedChat) {
          streamingChats[activeChat].id =
            insertedChat.id;

          setChats([...streamingChats]);
        }
      }
    } catch (error) {
      console.error(
        "Conversation error:",
        error
      );

      const failedChats = [...updatedChats];

      failedChats[activeChat] = {
        ...failedChats[activeChat],
        messages: [
          ...failedChats[activeChat]
            .messages,
          {
            role: "assistant",
            content:
              "Something went wrong. Please try again.",
          },
        ],
      };

      setChats(failedChats);
    } finally {
      setIsLoading(false);
    }
  };

  // ───────────────────────────────────────────────────────────
  // Delete Chat
  // ───────────────────────────────────────────────────────────

  const handleDeleteChat = async (
    index: number
  ) => {
    const chatToDelete =
      chats[index];

    if (chatToDelete?.id) {
      await supabase
        .from("chats")
        .delete()
        .eq("id", chatToDelete.id);
    }

    const updatedChats =
      chats.filter((_, i) => i !== index);

    if (updatedChats.length === 0) {
      setChats([
        {
          title: "New Chat",
          messages: [],
        },
      ]);

      setActiveChat(0);

      return;
    }

    setChats(updatedChats);

    setActiveChat((prev) =>
      Math.min(
        prev,
        updatedChats.length - 1
      )
    );
  };

  // ───────────────────────────────────────────────────────────
  // New Chat
  // ───────────────────────────────────────────────────────────

  const handleNewChat = async () => {
    const newChat: Chat = {
      title: `Chat ${chats.length + 1}`,
      messages: [],
    };

    let chatId:
      | string
      | undefined;

    if (user?.id) {
      const { data } =
        await supabase
          .from("chats")
          .insert([
            {
              user_id: user.id,
              title: newChat.title,
              messages: [],
            },
          ])
          .select()
          .single();

      if (data) {
        chatId = data.id;
      }
    }

    const updatedChats = [
      ...chats,
      {
        ...newChat,
        id: chatId,
      },
    ];

    setChats(updatedChats);

    setActiveChat(
      updatedChats.length - 1
    );
  };

  // ───────────────────────────────────────────────────────────
  // Loading Screen
  // ───────────────────────────────────────────────────────────

  if (isFetchingChats) {
    return (
      <div className="flex items-center justify-center h-screen bg-black">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 rounded-full border-2 border-white/10 border-t-violet-500 animate-spin" />

          <p className="text-sm text-white/40">
            Loading conversations...
          </p>
        </div>
      </div>
    );
  }

  // ───────────────────────────────────────────────────────────
  // Render
  // ───────────────────────────────────────────────────────────

  return (
    <div className="flex h-screen overflow-hidden bg-black">
      {/* Sidebar */}

      <AnimatePresence>
        {sidebarOpen && (
          <>
            {/* Mobile Overlay */}

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() =>
                setSidebarOpen(false)
              }
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
            />

            {/* Sidebar */}

            <motion.div
              initial={{
                width: 0,
                opacity: 0,
                x: -40,
              }}
              animate={{
                width: 280,
                opacity: 1,
                x: 0,
              }}
              exit={{
                width: 0,
                opacity: 0,
                x: -40,
              }}
              transition={{
                duration: 0.25,
              }}
              className="overflow-hidden shrink-0 fixed lg:relative z-50 h-screen bg-black"
            >
              <ConversationSidebar
                chats={chats.map(
                  (chat) => chat.title
                )}
                activeChat={activeChat}
                onSelect={(index) => {
                  setActiveChat(index);

                  if (
                    window.innerWidth <
                    1024
                  ) {
                    setSidebarOpen(false);
                  }
                }}
                onNewChat={
                  handleNewChat
                }
                onDelete={
                  handleDeleteChat
                }
                sidebarOpen={
                  sidebarOpen
                }
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}

      <div className="flex-1 min-h-0 overflow-hidden">
        <div className="flex flex-col h-full w-full">

          {/* Header */}

          <div className="flex items-center justify-between px-6 md:px-10 py-6 border-b border-white/[0.05] shrink-0">
            <div className="flex items-center gap-4">
              <button
                onClick={() =>
                  setSidebarOpen(
                    (prev) => !prev
                  )
                }
                className="flex items-center justify-center w-10 h-10 rounded-xl border border-white/10 bg-white/[0.03] text-white/70 hover:bg-white/[0.06] transition-all"
              >
                <PanelLeft className="w-5 h-5" />
              </button>

              <div>
                <h1 className="text-2xl font-semibold text-white">
                  Conversation
                </h1>

                <p className="text-sm text-white/40 mt-1">
                  Ask anything and get
                  intelligent responses.
                </p>
              </div>
            </div>

            <button
              onClick={handleClear}
              disabled={
                messages.length === 0
              }
              className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.02] px-3 py-2 text-sm text-white/60 hover:bg-white/[0.05] hover:text-white transition-all disabled:opacity-40 disabled:pointer-events-none"
            >
              <Trash2 className="w-4 h-4" />
              Clear
            </button>
          </div>

          {/* Messages */}

          <div className="flex-1 overflow-y-auto">
            <div className="flex flex-col gap-6 max-w-4xl mx-auto w-full px-6 md:px-10 py-8">

              {messages.length === 0 &&
                !isLoading && (
                  <EmptyConversation />
                )}

              {messages.map(
                (
                  message,
                  index
                ) => (
                  <MessageBubble
                    key={`${message.role}-${index}`}
                    content={
                      message.content
                    }
                    isUser={
                      message.role ===
                      "user"
                    }
                  />
                )
              )}

              {isLoading && (
                <TypingIndicator />
              )}

              <div ref={bottomRef} />
            </div>
          </div>

          {/* Input */}

          <div className="shrink-0 border-t border-white/[0.05] px-6 md:px-10 py-4 bg-black/80 backdrop-blur-xl">
            <div className="max-w-4xl mx-auto w-full">
              <ConversationInput
                onSend={handleSend}
                isLoading={isLoading}
              />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}