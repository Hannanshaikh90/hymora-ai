import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createClient } from "@supabase/supabase-js";
import { chunkText } from "@/lib/chunk-text";
import { generateEmbedding } from "@/services/embedding.service";

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
      content,
    } = await req.json();

    if (
      !projectId ||
      !content
    ) {
      return NextResponse.json(
        {
          error:
            "Project ID and content are required",
        },
        {
          status: 400,
        }
      );
    }

    /**
     * SAVE KNOWLEDGE
     */

    const {
      data: knowledge,
      error: knowledgeError,
    } = await supabase
      .from("project_knowledge")
      .insert({
        project_id:
          projectId,
        content,
      })
      .select()
      .single();

    if (knowledgeError) {
      throw knowledgeError;
    }

    /**
     * CREATE CHUNKS
     */

    const chunks =
  chunkText(content);

let chunksCreated = 0;

if (
  chunks.length > 0
) {
  const chunkRows =
    chunks.map(
      (chunk) => ({
        project_id:
          projectId,

        knowledge_id:
          knowledge.id,

        content:
          chunk,
      })
    );

  const {
    data: savedChunks,
    error: chunkError,
  } = await supabase
    .from(
      "project_chunks"
    )
    .insert(
      chunkRows
    )
    .select();

  if (chunkError) {
    throw chunkError;
  }

  chunksCreated =
    savedChunks?.length || 0;

  /**
   * BACKGROUND EMBEDDINGS
   */

  setTimeout(
    async () => {
      for (const chunk of savedChunks) {
        try {
          const embedding =
            await generateEmbedding(
              chunk.content
            );

          await supabase
            .from(
              "project_embeddings"
            )
            .insert({
              project_id:
                projectId,

              knowledge_id:
                knowledge.id,

              chunk_id:
                chunk.id,

              content:
                chunk.content,

              embedding,
            });
        } catch (
          embeddingError
        ) {
          console.error(
            "BACKGROUND EMBEDDING ERROR:",
            embeddingError
          );
        }
      }
    },
    0
  );
}

return NextResponse.json({
  success: true,
  knowledgeId:
    knowledge.id,
  chunksCreated,
});

  } catch (error) {

    console.error(
      "CREATE_KNOWLEDGE_ERROR",
      error
    );

    return NextResponse.json(
      {
        error:
          "Failed to create knowledge",
      },
      {
        status: 500,
      }
    );
  }
}