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
      fileId,
    } = await req.json();

    const {
      data: file,
      error: fileError,
    } = await supabase
      .from("project_files")
      .select("*")
      .eq("id", fileId)
      .single();

    if (fileError || !file) {
      return NextResponse.json(
        {
          error: "File not found",
        },
        {
          status: 404,
        }
      );
    }

    const knowledgeId =
      file.knowledge_id;

    if (knowledgeId) {

      await supabase
        .from(
          "project_embeddings"
        )
        .delete()
        .eq(
          "knowledge_id",
          knowledgeId
        );

      await supabase
        .from(
          "project_chunks"
        )
        .delete()
        .eq(
          "knowledge_id",
          knowledgeId
        );

      await supabase
        .from(
          "project_knowledge"
        )
        .delete()
        .eq(
          "id",
          knowledgeId
        );
    }

    const {
      error: deleteFileError,
    } = await supabase
      .from("project_files")
      .delete()
      .eq(
        "id",
        fileId
      );

    if (deleteFileError) {
      throw deleteFileError;
    }

    return NextResponse.json({
      success: true,
    });

  } catch (error) {

    console.error(
      "DELETE_FILE_ERROR",
      error
    );

    return NextResponse.json(
      {
        error:
          "Failed to delete file",
      },
      {
        status: 500,
      }
    );
  }
}