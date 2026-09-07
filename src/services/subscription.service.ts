import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function checkUserSubscription(
  clerkUserId: string
) {
  const { data, error } =
    await supabase
      .from("subscriptions")
      .select("*")
      .eq(
        "clerk_user_id",
        clerkUserId
      )
      .eq(
        "stripe_status",
        "active"
      )
      .maybeSingle();

  console.log(
    "SUB CHECK USER:",
    clerkUserId
  );

  console.log(
    "SUB CHECK DATA:",
    data
  );

  console.log(
    "SUB CHECK ERROR:",
    error
  );

  if (error) {
    return false;
  }

  return !!data;
}