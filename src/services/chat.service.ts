import { supabase } from "@/lib/supabase";

export interface ChatMessage {
  role: "user" | "assistant";

  content: string;
}

export interface ChatConversation {
  id: string;

  user_id: string;

  title: string;

  messages: ChatMessage[];

  created_at: string;

  updated_at: string;
}

// ─────────────────────────────────────────────
// Create Chat
// ─────────────────────────────────────────────

export async function createChat(
  clerkUserId: string,
  title: string,
  messages: ChatMessage[]
) {
  const { data, error } =
    await supabase
      .from("chats")
      .insert([
        {
  user_id:
    clerkUserId,

  title:
    title
      .replace(
        /\n/g,
        " "
      )
      .trim()
      .slice(0, 45),

  messages,
}
      ])
      .select()
      .single();

  if (error) {
    console.error(
      "Create chat error:",
      error
    );

    return null;
  }

  return data;
}

// ─────────────────────────────────────────────
// Update Chat
// ─────────────────────────────────────────────

export async function updateChat(
  chatId: string,
  messages: ChatMessage[]
) {

  console.log(
    "UPDATING CHAT:",
    chatId
  );

  console.log(
    "MESSAGES COUNT:",
    messages.length
  );

  const { data, error } =
    await supabase
      .from("chats")
     .update({
  messages:
    JSON.parse(
      JSON.stringify(
        messages
      )
    )
})
      .eq(
        "id",
        chatId
      )
      .select();

  if (error) {

  console.error(
    "UPDATE FULL ERROR:"
  );

  console.log(
    JSON.stringify(
      error,
      null,
      2
    )
  );

  return null;
}

  console.log(
    "UPDATE SUCCESS:",
    data
  );

  return data;
}

// ─────────────────────────────────────────────
// Get User Chats
// ─────────────────────────────────────────────

export async function getUserChats(
  clerkUserId: string
) {
  const { data, error } =
    await supabase
      .from("chats")
      .select("*")
      .eq(
        "user_id",
        clerkUserId
      )
     .order(
  "created_at",
  {
    ascending: false,
  }
)

  if (error) {
    console.error(
      "Get chats error:",
      error
    );

    return [];
  }

  return data;
}