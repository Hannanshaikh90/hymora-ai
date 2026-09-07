import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createClient } from "@supabase/supabase-js";

import {
  FREE_LIMITS,
} from "@/config/usage";

import { checkUserSubscription } from "@/services/subscription.service";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        {
          allowed: false,
        },
        {
          status: 401,
        }
      );
    }

    console.log(
  "CHECK LIMIT USER:",
  userId
);



    const isPro =
      await checkUserSubscription(userId);

    if (isPro) {
      return NextResponse.json({
        allowed: true,
        current: 0,
        limit: "Unlimited",
      });
    }

    const { count, error } =
      await supabase
        .from("projects")
        .select("*", {
          count: "exact",
          head: true,
        })
        .eq("user_id", userId);

    if (error) {
      throw error;
    }

    return NextResponse.json({
      allowed:
        (count ?? 0) <
        FREE_LIMITS.workspaces,

      current:
        count ?? 0,

      limit:
        FREE_LIMITS.workspaces,
    });
  } catch (error) {
    console.error(
      "CHECK_WORKSPACE_LIMIT_ERROR",
      error
    );

    return NextResponse.json(
      {
        allowed: false,
        error: "Unable to verify workspace limit.",
      },
      {
        status: 500,
      }
    );
  }
}