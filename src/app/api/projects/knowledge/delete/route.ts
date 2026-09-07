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
      knowledgeId,
    } = await req.json();

    if (!knowledgeId) {
      return NextResponse.json(
        {
          error:
            "Knowledge ID is required",
        },
        {
          status: 400,
        }
      );
    }

    const {
      error,
    } = await supabase
      .from("project_knowledge")
      .delete()
      .eq(
        "id",
        knowledgeId
      );

    if (error) {
      throw error;
    }

    return NextResponse.json({
      success: true,
    });

  } catch (error) {

    console.error(
      "DELETE_KNOWLEDGE_ERROR",
      error
    );

    return NextResponse.json(
      {
        error:
          "Failed to delete knowledge",
      },
      {
        status: 500,
      }
    );

  }
}