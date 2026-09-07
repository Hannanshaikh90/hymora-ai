import { auth } from "@clerk/nextjs/server";
import { createClient } from "@supabase/supabase-js";

import { isProUser } from "./subscription";

const FREE_DAILY_LIMIT = 5;

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function checkMessageLimit() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return false;
    }

    const proUser = await isProUser();

    if (proUser) {
      return true;
    }

    const today = new Date()
      .toISOString()
      .split("T")[0];

    const { data } = await supabase
      .from("message_usage")
      .select("*")
      .eq("clerk_user_id", userId)
      .single();

    // First usage ever
    if (!data) {
      await supabase
        .from("message_usage")
        .insert({
          clerk_user_id: userId,
          message_count: 1,
          last_reset: today,
        });

      return true;
    }

    // Reset next day
    if (data.last_reset !== today) {
      await supabase
        .from("message_usage")
        .update({
          message_count: 1,
          last_reset: today,
        })
        .eq("clerk_user_id", userId);

      return true;
    }

    // Limit reached
    if (
      data.message_count >=
      FREE_DAILY_LIMIT
    ) {
      return false;
    }

    // Increment usage
    await supabase
      .from("message_usage")
      .update({
        message_count:
          data.message_count + 1,
      })
      .eq("clerk_user_id", userId);

    return true;
  } catch (error) {
    console.error(
      "MESSAGE_LIMIT_ERROR",
      error
    );

    return false;
  }
}