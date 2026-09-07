import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createClient } from "@supabase/supabase-js";
import { extractText } from "unpdf";
import mammoth from "mammoth";
import { checkUserSubscription } from "@/services/subscription.service";
import { chunkText } from "@/lib/chunk-text";
import { generateEmbedding } from "@/services/embedding.service";
import {
  checkPdfLimit,
  incrementPdfUsage,
} from "@/services/usage.service";


const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(
  req: Request
) {
  try {
    const authResult = await auth();

    console.log("AUTH RESULT:", authResult);

    const userId = authResult.userId;

    console.log("CLERK USER ID:", userId);

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

    const formData =
      await req.formData();

    const file =
      formData.get(
        "file"
      ) as File;

    const projectId =
      formData.get(
        "projectId"
      ) as string;

    if (!file) {
      return NextResponse.json(
        {
          error:
            "File is required",
        },
        {
          status: 400,
        }
      );
    }

    console.log("LOOKING FOR USER:", userId);

    const isPro =
      await checkUserSubscription(userId);

    console.log("UPLOAD IS PRO:", isPro);
    console.log("UPLOAD USER ID:", userId);

    const pdfLimit = await checkPdfLimit(
      userId,
      isPro
    );

    console.log("PDF LIMIT RESULT:", pdfLimit);

    if (!pdfLimit.allowed) {
      return NextResponse.json(
        {
          error: "PDF upload limit reached.",
          upgrade: true,
          type: "pdf",
        },
        {
          status: 403,
        }
      );
    }

    const bytes =
      await file.arrayBuffer();

    const fileBuffer =
      new Uint8Array(bytes);

    const filePath = `${projectId}/${Date.now()}-${file.name}`;

    /**
     * STORAGE UPLOAD
     */

    const {
      error: uploadError,
    } = await supabase.storage
      .from("project-files")
      .upload(
        filePath,
        fileBuffer,
        {
          contentType:
            file.type,
          upsert: false,
        }
      );

    if (uploadError) {
      throw uploadError;
    }

    /**
     * PUBLIC URL
     */

    const {
      data: publicUrlData,
    } = supabase.storage
      .from("project-files")
      .getPublicUrl(
        filePath
      );

    const fileUrl =
      publicUrlData.publicUrl;

    /**
     * SAVE FILE RECORD
     */

    const {
      data: savedFile,
      error: fileError,
    } = await supabase
      .from("project_files")
      .insert({
        project_id:
          projectId,
        file_name:
          file.name,
        file_url:
          fileUrl,
      })
      .select()
      .single();

    if (fileError) {
      throw fileError;
    }

    /**
 * EXTRACT TEXT
 */

    let extractedText = "";

    const extension = file.name
      .split(".")
      .pop()
      ?.toLowerCase();

    try {
      if (extension === "txt") {
        extractedText = new TextDecoder().decode(
          fileBuffer
        );
      } else if (extension === "pdf") {
        const result = await extractText(
          new Uint8Array(fileBuffer)
        );

        extractedText = Array.isArray(result.text)
          ? result.text.join("\n").trim()
          : String(result.text ?? "").trim();

        console.log(
          "PDF Characters:",
          extractedText.length
        );
      } else if (extension === "docx") {
        const result =
          await mammoth.extractRawText({
            buffer: Buffer.from(fileBuffer),
          });

        extractedText = result.value.trim();
      }
    } catch (extractionError) {
      console.error(
        "TEXT EXTRACTION ERROR:",
        extractionError
      );
    }
    /**
     * MEMORY PIPELINE
     */

    let chunksCreated = 0;

    let embeddingsCreated = 0;

    let knowledgeId: string | null =
      null;

    if (
      extractedText &&
      extractedText.trim()
        .length > 0
    ) {

      const {
        data: knowledge,
        error: knowledgeError,
      } = await supabase
        .from(
          "project_knowledge"
        )
        .insert({
          project_id:
            projectId,
          content:
            extractedText,
        })
        .select()
        .single();

      if (knowledgeError) {
        throw knowledgeError;
      }

      knowledgeId =
        knowledge.id;
      const chunks =
        chunkText(
          extractedText
        );

      for (const chunk of chunks) {
        try {

          /**
           * SAVE CHUNK
           */

          const {
            data:
            savedChunk,
            error:
            chunkError,
          } = await supabase
            .from(
              "project_chunks"
            )
            .insert({
              project_id:
                projectId,

              knowledge_id:
                knowledgeId,

              content:
                chunk,
            })
            .select()
            .single();

          if (
            chunkError
          ) {
            console.error(
              chunkError
            );
            continue;
          }

          chunksCreated++;

          /**
           * EMBEDDING
           */

          const embedding =
            await generateEmbedding(chunk);

          console.log(
            "Embedding Length:",
            embedding.length
          );

          if (embedding.length === 0) {
            console.error(
              "Embedding generation failed for chunk:",
              chunk.substring(0, 100)
            );

            continue;
          }

          const {
            error:
            embeddingError,
          } = await supabase
            .from(
              "project_embeddings"
            )
            .insert({
              project_id:
                projectId,

              knowledge_id:
                knowledgeId,

              chunk_id:
                savedChunk.id,

              content:
                chunk,

              embedding,
            });

          if (
            embeddingError
          ) {
            console.error(
              embeddingError
            );
          } else {
            embeddingsCreated++;
          }

        } catch (
        chunkError
        ) {
          console.error(
            "CHUNK ERROR:",
            chunkError
          );
        }
      }
    }

    if (knowledgeId) {
      await supabase
        .from("project_files")
        .update({
          knowledge_id: knowledgeId,
        })
        .eq("id", savedFile.id);
    }

    await incrementPdfUsage(userId);

    return NextResponse.json({
      success: true,
      file: {
        id: savedFile.id,
        name: file.name,
        size: file.size,
        type: file.type,
      },
      knowledgeId,
    });

  } catch (error) {

    console.error(
      "UPLOAD_STORAGE_ERROR",
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