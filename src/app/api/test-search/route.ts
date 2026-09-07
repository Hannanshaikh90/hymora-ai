import { NextResponse } from "next/server";
import { searchWeb } from "@/services/search.service";

import { auth } from "@clerk/nextjs/server";

import {
  checkSearchLimit,
  incrementSearchUsage,
} from "@/services/usage.service";

import {
  checkUserSubscription,
} from "@/services/subscription.service";

export async function GET() {

  const { userId } =
    await auth();

  if (!userId) {
    return NextResponse.json(
      {
        error: "Unauthorized",
      },
      {
        status: 401,
      }
    );
  }

  const isPro =
    await checkUserSubscription(
      userId
    );

  const usage =
    await checkSearchLimit(
      userId,
      isPro
    );

  if (!usage.allowed) {
    return NextResponse.json(
      {
        error:
          "Search limit reached.",
        upgrade: true,
        type: "search",
      },
      {
        status: 403,
      }
    );
  }
  try {
    const results =
  await searchWeb(
    "latest AI news"
  );

await incrementSearchUsage(
  userId
);

    return NextResponse.json(
      results
    );
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unknown error",
      },
      {
        status: 500,
      }
    );
  }
}