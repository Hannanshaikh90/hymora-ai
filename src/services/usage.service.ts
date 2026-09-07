import { supabase } from "@/lib/supabase";

import { FREE_LIMITS } from "@/config/usage";

async function ensureUserUsage(
  userId: string
) {
  const { data, error } =
    await supabase
      .from("user_usage")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();

  if (
    error &&
    error.code !== "PGRST116"
  ) {
    throw error;
  }

  if (data) {
    return data;
  }

  const now =
    new Date().toISOString();

  const {
    data: created,
    error: insertError,
  } = await supabase
    .from("user_usage")
    .insert({
      user_id: userId,
      chat_count: 0,
      message_count: 0,
      pdf_count: 0,
      search_count: 0,
      last_reset: now,
    })
    .select()
    .single();

  if (insertError) {
    throw insertError;
  }

  return created;
}

export async function checkUserLimit(
  userId: string,
  isPro: boolean
) {
  // Pro users unlimited
  if (isPro) {
    return {
      allowed: true,
      remaining: Infinity,
    };
  }

  // ─────────────────────────────────────────────
  // Get existing usage
  // ─────────────────────────────────────────────

  const { data, error } =
    await supabase
      .from("user_usage")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();

  // Real DB error
  if (
    error &&
    error.code !== "PGRST116"
  ) {
    console.error(
      "Usage fetch error:",
      error
    );

    return {
      allowed: false,
      remaining: 0,
    };
  }

  // ─────────────────────────────────────────────
  // First Message
  // ─────────────────────────────────────────────

  if (!data) {
    const {
      error: insertError,
    } = await supabase
      .from("user_usage")
      .insert([
        {
          user_id: userId,
          message_count: 1,
        },
      ]);

    if (insertError) {
      console.error(
        "Usage insert error:",
        insertError
      );

      return {
        allowed: false,
        remaining: 0,
      };
    }

    return {
      allowed: true,
      remaining:
        FREE_LIMITS.chats - 1,
    };
  }

  // ─────────────────────────────────────────────
  // Daily Reset
  // ─────────────────────────────────────────────

  const now = new Date();

  let chatCount =
    data.chat_count ??
    data.message_count ??
    0;

  const lastReset =
    new Date(data.last_reset);

  const diffHours =
    (now.getTime() -
      lastReset.getTime()) /
    (1000 * 60 * 60);

  let messageCount =
    chatCount;

  // Reset after 24h
  if (diffHours >= 24) {
    messageCount = 0;

    const {
      error: resetError,
    } = await supabase
      .from("user_usage")
      .update({
        chat_count: 0,
        message_count: 0,
        last_reset:
          now.toISOString(),
      })
      .eq("user_id", userId);

    if (resetError) {
      console.error(
        "Usage reset error:",
        resetError
      );
    }
  }

  // ─────────────────────────────────────────────
  // Limit Check
  // ─────────────────────────────────────────────

  if (
    messageCount >=
    FREE_LIMITS.chats
  ) {
    return {
      allowed: false,
      remaining: 0,
    };
  }

  // ─────────────────────────────────────────────
  // Increment Usage
  // ─────────────────────────────────────────────

  const newCount =
    messageCount + 1;

  const {
    error: updateError,
  } = await supabase
    .from("user_usage")
    .update({
      chat_count: newCount,
    })
    .eq("user_id", userId);

  if (updateError) {
    console.error(
      "Usage update error:",
      updateError
    );
  }

  return {
    allowed: true,
    remaining:
      FREE_LIMITS.chats -
      newCount,
  };
}

export async function checkPdfLimit(
  userId: string,
  isPro: boolean
) {
  if (isPro) {
    return {
      allowed: true,
      remaining: Infinity,
    };
  }

  let data;

  try {
    data = await ensureUserUsage(
      userId
    );
  } catch (error) {
    console.error(
      "PDF usage fetch error:",
      error
    );

    return {
      allowed: false,
      remaining: 0,
    };
  }

  const pdfCount =
    data.pdf_count ?? 0;

  console.log("USER USAGE ROW:", data);

  console.log("PDF COUNT:", pdfCount);

  if (
    pdfCount >=
    FREE_LIMITS.pdfs
  ) {
    return {
      allowed: false,
      remaining: 0,
    };
  }

  return {
    allowed: true,
    remaining:
      FREE_LIMITS.pdfs -
      pdfCount,
  };
}

export async function incrementPdfUsage(
  userId: string
) {
  const data =
    await ensureUserUsage(
      userId
    );

  const currentCount =
    data.pdf_count ?? 0;

  const { error } =
    await supabase
      .from("user_usage")
      .update({
        pdf_count:
          currentCount + 1,
      })
      .eq("user_id", userId);

  if (error) {
    console.error(
      "PDF usage update error:",
      error
    );
  }
}

export async function checkSearchLimit(
  userId: string,
  isPro: boolean
) {
  if (isPro) {
    return {
      allowed: true,
      remaining: Infinity,
    };
  }

  const { data } =
    await supabase
      .from("user_usage")
      .select("search_count")
      .eq("user_id", userId)
      .maybeSingle();

  const searchCount =
    data?.search_count ?? 0;

  if (
    searchCount >=
    FREE_LIMITS.searches
  ) {
    return {
      allowed: false,
      remaining: 0,
    };
  }

  return {
    allowed: true,
    remaining:
      FREE_LIMITS.searches -
      searchCount,
  };
}

export async function incrementSearchUsage(
  userId: string
) {
  const { data } =
    await supabase
      .from("user_usage")
      .select("search_count")
      .eq("user_id", userId)
      .maybeSingle();

  const currentCount =
    data?.search_count ?? 0;

  await supabase
    .from("user_usage")
    .update({
      search_count:
        currentCount + 1,
    })
    .eq("user_id", userId);
}
