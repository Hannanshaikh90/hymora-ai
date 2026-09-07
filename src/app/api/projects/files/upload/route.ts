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
      fileName,
      fileUrl,
    } = await req.json();

    const {
      data,
      error,
    } = await supabase
      .from("project_files")
      .insert({
        project_id: projectId,
        file_name: fileName,
        file_url: fileUrl,
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json(
      data
    );

  } catch (error) {

    console.error(
      "UPLOAD_FILE_ERROR",
      error
    );

    return NextResponse.json(
      {
        error:
          "Failed to upload file",
      },
      {
        status: 500,
      }
    );
  }
}