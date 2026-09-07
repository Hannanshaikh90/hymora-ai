import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

import { isProUser } from "@/lib/subscription";
import { FREE_LIMITS } from "@/config/usage";

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
      title,
      description,
      goal,
    } = await req.json();

    const proUser = await isProUser();

    if (!proUser) {
      const { count, error: countError } = await supabase
        .from("projects")
        .select("*", {
          count: "exact",
          head: true,
        })
        .eq("user_id", userId);

      if (countError) {
        throw countError;
      }

      if ((count ?? 0) >= FREE_LIMITS.workspaces) {
        return NextResponse.json(
          {
            error: "Workspace limit reached.",
            code: "WORKSPACE_LIMIT_REACHED",
          },
          {
            status: 403,
          }
        );
      }
    }

    const {
      data: project,
      error,
    } = await supabase
      .from("projects")
      .insert({
        user_id: userId,
        title,
        description,
        project_goal: goal,
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json({
      success: true,
      project,
    });
  } catch (error) {
    console.error(
      "CREATE_PROJECT_ERROR",
      error
    );

    return NextResponse.json(
      {
        error:
          "Failed to create project",
      },
      {
        status: 500,
      }
    );
  }
}