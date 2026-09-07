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

    const { projectId } =
      await params;

    const {
      data,
      error,
    } = await supabase
      .from("project_files")
      .select("*")
      .eq(
        "project_id",
        projectId
      )
      .order(
        "created_at",
        {
          ascending: false,
        }
      );

    if (error) {
      throw error;
    }

    return NextResponse.json(
      data
    );

  } catch (error) {

    console.error(
      "GET_FILES_ERROR",
      error
    );

    return NextResponse.json(
      {
        error:
          "Failed to load files",
      },
      {
        status: 500,
      }
    );
  }
}