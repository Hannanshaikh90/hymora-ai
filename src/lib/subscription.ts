import { auth } from "@clerk/nextjs/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function isProUser() {
  try {
    const { userId } = await auth();

    console.log("PRO CHECK USER:", userId);

    if (!userId) {
      return false;
    }

    const { data, error } = await supabase
      .from("subscriptions")
      .select("*")
      .eq("clerk_user_id", userId)
      .eq("stripe_status", "active")
      .single();

    console.log("PRO CHECK RESULT:", data);
    console.log("PRO CHECK ERROR:", error);

    if (error || !data) {
      return false;
    }

    return true;
  } catch (error) {
    console.error(
      "SUBSCRIPTION_CHECK_ERROR",
      error
    );

    return false;
  }
}