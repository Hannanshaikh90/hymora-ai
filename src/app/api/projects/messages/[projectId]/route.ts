import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

interface RouteProps {
  params: Promise<{
    projectId: string;
  }>;
}

export async function GET(
  req: Request,
  { params }: RouteProps
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { projectId } = await params;

    const { data, error } = await supabase
      .from("project_messages")
      .select(`
        id,
        role,
        content,
        attachments,
        created_at
      `)
      .eq("project_id", projectId)
      .order("created_at", {
        ascending: true,
      });

    if (error) {
      throw error;
    }

    return NextResponse.json(
      (data ?? []).map((message) => ({
        ...message,
        attachments: message.attachments ?? [],
      }))
    );
  } catch (error) {
    console.error(
      "LOAD_MESSAGES_ERROR",
      error
    );

    return NextResponse.json(
      {
        error: "Failed to load messages",
      },
      {
        status: 500,
      }
    );
  }
}