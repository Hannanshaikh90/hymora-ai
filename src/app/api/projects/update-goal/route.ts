import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(
  req: Request
) {
  try {
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

    const {
      projectId,
      goal,
    } = await req.json();

    const { error } =
      await supabase
        .from("projects")
        .update({
          project_goal: goal,
        })
        .eq("id", projectId)
        .eq("user_id", userId);

    if (error) {
      throw error;
    }

    return NextResponse.json({
      success: true,
    });

  } catch (error) {

    console.error(
      "UPDATE_GOAL_ERROR",
      error
    );

    return NextResponse.json(
      {
        error:
          "Failed to update goal",
      },
      {
        status: 500,
      }
    );
  }
}