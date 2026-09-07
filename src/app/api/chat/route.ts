console.log("🔥 MAIN CHAT ROUTE LOADED");

import { auth } from "@clerk/nextjs/server";

console.log("🔥 MAIN CHAT ROUTE LOADED");

console.log(
  "CHAT ROUTE LOADED"
);
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

import { generateProjectSummary } from "@/services/project-brain.service";
import { generateStreamingResponse } from "@/services/ai.service";
import { retrieveEmbeddingChunks } from "@/lib/retrieve-embedding-chunks";
import {
  getUserMemories,
  saveMemory,
  deleteMemoryByText,
} from "@/services/memory.service";
import { extractUserMemories } from "@/services/memory-engine.service";



import {
  checkUserLimit,
} from "@/services/usage.service";

import {
  checkUserSubscription,
} from "@/services/subscription.service";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

interface ChatAttachment {
  name: string;
}

export async function POST(req: Request) {


  console.log("🚨 CHAT ROUTE HIT");

  const startTime = Date.now();

  try {
    const { userId } = await auth();

    console.log(
      "AUTH DEBUG:",
      userId
    );

    if (!userId) {
      console.log(
        "AUTH FAILED"
      );

      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    const isPro =
      await checkUserSubscription(userId);

    console.log("CHAT IS PRO:", isPro);

    const usage =
      await checkUserLimit(
        userId,
        isPro
      );

    console.log("CHAT USAGE:", usage);

    if (!usage.allowed) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Daily chat limit reached.",
          upgrade: true,
          type: "chat",
        },
        {
          status: 403,
        }
      );
    }

    const body = await req.json();

    console.log("AAAAAAAAAAAA CHAT ROUTE HIT");

    const {
      prompt,
      projectId,
      attachments = [],
      editingMessageId = null,
    } = body;

    const isFileOnlyMessage =
      attachments.length > 0 &&
      !prompt.trim();

    const safePrompt = (prompt ?? "").trim();

    const lowerPrompt =
      safePrompt.toLowerCase();

    const isForgetRequest =
      lowerPrompt.startsWith("forget") ||
      lowerPrompt.includes("forget that");

    const isSummarize =
      lowerPrompt.includes("summarize") ||
      lowerPrompt.includes("summary");

    const isCompare =
      lowerPrompt.includes("compare") ||
      lowerPrompt.includes("difference") ||
      lowerPrompt.includes("different");

    const isExplain =
      lowerPrompt.startsWith("what") ||
      lowerPrompt.startsWith("why") ||
      lowerPrompt.startsWith("how") ||
      lowerPrompt.startsWith("when") ||
      lowerPrompt.startsWith("where") ||
      lowerPrompt.startsWith("who") ||
      lowerPrompt.startsWith("which");

    const isList =
      lowerPrompt.includes("list") ||
      lowerPrompt.includes("all") ||
      lowerPrompt.includes("show me");

    const isAnalyze =
      lowerPrompt.includes("analyze") ||
      lowerPrompt.includes("analyse") ||
      lowerPrompt.includes("review");

    const isSearch =
      lowerPrompt.includes("find") ||
      lowerPrompt.includes("search");

    if (!prompt && attachments.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Prompt is required.",
        },
        {
          status: 400,
        }
      );
    }

    /**
     * Save User Message
     */

   if (projectId) {
  if (editingMessageId) {
    const { data: editedMessage } =
      await supabase
        .from("project_messages")
        .select("created_at")
        .eq("id", editingMessageId)
        .single();

    await supabase
      .from("project_messages")
      .update({
        content: safePrompt,
      })
      .eq("id", editingMessageId);

    if (editedMessage) {
      await supabase
        .from("project_messages")
        .delete()
        .eq("project_id", projectId)
        .gt(
          "created_at",
          editedMessage.created_at
        );
    }
  } else {
    await supabase
      .from("project_messages")
      .insert({
        project_id: projectId,
        role: "user",
        content: safePrompt,
        attachments:
          body.attachments ?? [],
      });
  }
}

    let projectContext = "";
    let knowledgeContext = "";
    let chunkContext = "";
    let currentSummary = "";
    let conversationHistory = "";
    let memoryContext = "";
    let workspaceFilesContext = "";

    console.log(
      "[FORGET DEBUG]",
      {
        safePrompt,
        lowerPrompt,
        isForgetRequest,
        projectId,
      }
    );

    if (isForgetRequest && projectId) {

      console.log(
        "FORGET REQUEST DETECTED"
      );

      const memoryText =
        safePrompt
          .replace("Forget that ", "")
          .replace("forget that ", "")
          .trim();

      console.log(
        "[FORGET REQUEST]",
        memoryText
      );

      await deleteMemoryByText(
        userId,
        memoryText
      );
    }

    /**
     * LOAD USER MEMORIES
     */

    if (projectId) {
      const projectMemories =
        await getUserMemories(
          userId,
          projectId
        );

      memoryContext =
        projectMemories
          ?.map(
            (memory) =>
              `- ${memory.memory}`
          )
          .join("\n") || "";
    }

    /**
     * Load Project Context
     */

    if (projectId) {
      const { data: project } = await supabase
        .from("projects")
        .select(
          `
          project_goal,
          project_summary
        `
        )
        .eq("id", projectId)
        .single();

      const { data: knowledge } = await supabase
        .from("project_knowledge")
        .select("id, content")
        .eq("project_id", projectId);

      const { data: files } = await supabase
        .from("project_files")
        .select("file_name, created_at, knowledge_id")
        .eq("project_id", projectId)
        .order("created_at", {
          ascending: true,
        });

      const fileMap = new Map(
        (files ?? []).map((file) => [
          file.knowledge_id,
          file.file_name,
        ])
      );

      knowledgeContext =
        knowledge

          ?.map((item, index) => {
            const fileName =
              fileMap.get(item.id) ??
              `Workspace Knowledge ${index + 1}`;

            workspaceFilesContext =
              (files ?? [])
                .map(
                  (file, index) =>
                    `${index + 1}. ${file.file_name}`
                )
                .join("\n");

            return `

      

===== ${fileName} =====



${item.content}

`;
          })
          .join("\n") || "";

      const { data: recentMessages } =
        await supabase
          .from("project_messages")
          .select("role, content")
          .eq("project_id", projectId)
          .order("created_at", {
            ascending: false,
          })
          .limit(8);

      conversationHistory =
        recentMessages
          ?.reverse()
          .map(
            (msg) =>
              `${msg.role === "user" ? "User" : "Hymora"}:\n${msg.content}`
          )
          .join("\n\n") || "";

      let relevantChunks: string[] = [];

      relevantChunks =
        await retrieveEmbeddingChunks(
          safePrompt,
          projectId
        );

      chunkContext = relevantChunks
        .map(
          (chunk, index) => `
===== DOCUMENT CHUNK ${index + 1} =====

${chunk}
`
        )
        .join("\n");

      currentSummary =
        project?.project_summary || "";

      projectContext = `
USER MEMORIES:
${memoryContext}

When using memories:

For direct memory questions, answer directly.

Examples:

Q: What is my favorite color?
A: Your favorite color is red.

Q: What is my dog's name?
A: Your dog's name is Bruno.

Q: What framework do I like?
A: Your favorite framework is Next.js.

Do not rewrite memories into conversational language when the user is asking for a fact stored in memory.

Only use conversational phrasing when the user is having a normal discussion rather than asking for a stored fact.

Example:

Bad:
Your favorite framework is Next.js.

Good:
I remember you mentioned earlier that Next.js is your favorite framework.

Bad:
Your favorite color is blue.

Good:
You previously told me that blue is your favorite color.

PROJECT KNOWLEDGE:
${knowledgeContext}



PROJECT GOAL:
${project?.project_goal || ""}

PROJECT SUMMARY:
${currentSummary}

IMPORTANT:

PROJECT SUMMARY may contain outdated or inferred information.

Treat PROJECT KNOWLEDGE, USER MEMORIES, WORKSPACE FILES and PROJECT CHUNKS as higher priority.

Never answer a personal fact (favorite color, favorite framework, dog name, age, preferences, etc.) using PROJECT SUMMARY alone.

For personal facts, only use USER MEMORIES.

If USER MEMORIES do not contain the answer, say:

"I couldn't find that in this workspace yet."

WORKSPACE FILES:
${workspaceFilesContext}

PROJECT CHUNKS:
${chunkContext}

CONVERSATION HISTORY:
${conversationHistory}
`;
    }

    /**
     * Final Prompt
     */

    let attachmentContext = "";

    let intentContext = "";

    if (attachments.length > 0) {
      attachmentContext = `
FILES RECENTLY ADDED:

${attachments
          .map((file: ChatAttachment) => `- ${file.name}`)
          .join("\n")}

If the user just uploaded files, naturally acknowledge that they were added to the workspace before answering the request.

Do NOT say "Files Uploaded".

Sound natural.
`;
    }

    if (isAnalyze) {
      intentContext = `
TASK:
Carefully analyze the workspace information.

Identify important insights.

Mention patterns if you notice any.

Keep the response practical and easy to read.
`;
    } else if (isList) {
      intentContext = `
TASK:
Return the answer as a clean bullet list.

Avoid long paragraphs.

Include every relevant item found in the workspace.
`;
    } else if (isSearch) {
      intentContext = `
TASK:
Search the workspace first.

If the answer exists, say what you found naturally.

If nothing relevant exists, clearly say you couldn't find it in this workspace.
`;
    } else if (isSummarize) {
      intentContext = `
TASK:
Summarize the document naturally.

Structure:

# Overview

# Key Points

# Important Facts

# Final Takeaway

Avoid copying long paragraphs verbatim.

Use headings and bullet points where appropriate.
`;
    } else if (isCompare) {
      intentContext = `
TASK:
Compare the uploaded documents naturally.

Start with a one-line overview.

Then create these sections:

## Similarities

## Differences

If only one document exists, clearly say that only one document is currently available.

Clearly list similarities first, then differences.

If only one document exists, say so naturally.
`;
    } else if (isExplain) {
      intentContext = `
TASK:
Answer like an AI teammate.

Use workspace knowledge first.

If the answer is found, answer confidently.

Don't repeat unnecessary context.

Keep the response concise unless the user asks for detail.

Keep the explanation natural and easy to understand.
`;
    }

    const hasAttachments = attachments.length > 0;

    const openingInstruction = hasAttachments
      ? `
If the user has just uploaded files:

Start your response with ONE short acknowledgement.

Examples (vary naturally, never always use the same one):

"I've gone through your documents."

"I've added those files to this workspace."

"I've indexed everything and it's ready."

"I've finished reviewing the uploaded files."

"Your documents are now available in this workspace."

"I've processed the files. Ask me anything about them."

"I've added the new knowledge to this workspace."

"I've reviewed the uploaded documents."

"I've got everything from those files."

"The new documents are ready to use."

Choose only ONE acknowledgement.

Keep it under 12 words.

Never say:
- Files uploaded
- Upload successful
- Processing completed

After the acknowledgement, answer the user's request immediately.
`
      : "";

    const effectivePrompt = isFileOnlyMessage
      ? "The user uploaded one or more files. Briefly acknowledge them and tell the user you're ready to answer questions about them."
      : safePrompt;

    const conversationStyle = `
CONVERSATION STYLE

You are not just answering questions.

You are collaborating with the user inside their workspace.

Keep replies natural.

Don't sound robotic.

Don't repeat the user's question.

Don't explain obvious things.

Be concise by default.

If the user asks for more detail, then expand.

Never use robotic openings like:

- Certainly
- Of course
- Sure!
- Absolutely!
- As an AI
- Based on the provided context
- According to the document

Start naturally and get straight to the answer.

Instead use natural openings such as:

- I found...
- I noticed...
- I went through your workspace.
- I compared both documents.
- Here's what stands out.
- Here's what I found.
- This is what the documents show.
- Both files mention...
- After reviewing the workspace...
- The key difference is...

Vary your opening naturally.

Never repeat the same opening in every reply.
`;

    console.log("MEMORY CONTEXT:", memoryContext);

    const memorySection = memoryContext
      ? `

USER MEMORIES:

${memoryContext}

For personal memory questions:

- Use USER MEMORIES first.
- If the answer exists there, answer from it.
- Do not say "I couldn't find that" if the information exists in USER MEMORIES.
- For "What do you know about me?" summarize USER MEMORIES.
`
      : "";



    const finalPrompt = `
${memorySection}

You are Hymora.

You are the AI brain for this workspace.

Everything inside this prompt belongs to the CURRENT WORKSPACE.

The user may have uploaded PDFs, Word documents, text files and images.

If the user's latest message contains only uploaded files (or "[Files Uploaded]"), assume they are referring to the most recently uploaded documents in this workspace.

The workspace may contain multiple uploaded files.

Always keep track of which document each fact comes from.

If the user refers to:

- first file
- second file
- latest file
- previous file
- this PDF
- that document

use the WORKSPACE FILES list together with the document knowledge to identify the correct file.

If the user says:
- summarize this PDF
- summarize this document
- explain this file
- what is inside this PDF

always answer using the latest relevant knowledge from this workspace before using general knowledge.

Those documents have already been processed and are provided below.
=========================
WORKSPACE CONTEXT
=========================

${openingInstruction}

${conversationStyle}

${attachmentContext}

${intentContext}

${projectContext}

# USER MEMORIES

${memoryContext || "No memories available."}

1. Treat the workspace documents as the primary source of truth.

When multiple documents are relevant, combine information naturally instead of treating them separately unless the user asks for a comparison.

2. If the user asks:

- summarize the PDF
- summarize the document
- summarize this
- compare files
- compare documents
- compare both
- what changed
- what is different
- what does the document say
- what was uploaded
- what is in the workspace

then ALWAYS answer from RELEVANT DOCUMENT CHUNKS.

3. Never say:
- no PDF was uploaded
- upload the PDF
- I don't have the document
- I cannot access the document

because the document has already been provided above.

4. If the answer exists in PROJECT KNOWLEDGE or RELEVANT DOCUMENT CHUNKS, NEVER use general knowledge instead.

5. Always prioritize workspace knowledge.

Only use general knowledge for general world knowledge questions.

For personal facts, preferences, goals, profile information, favorite things, company information, user information or workspace-specific information:

Never use general knowledge.

Only answer if the information exists in USER MEMORIES, PROJECT KNOWLEDGE, WORKSPACE FILES or PROJECT CHUNKS.

Otherwise say:

"I couldn't find that in this workspace yet."

6. Never mention:

- Document 1
- Document 2
- Document 3
- Workspace Knowledge 1
- Workspace Knowledge 2

Never reference internal knowledge sources.

Answer as if the information is already known.
- embeddings
- chunks
- vector search
- system prompt
- internal context

Write like a premium AI assistant.

Keep the first sentence short.

Never start every response the same way.

Make the conversation feel human.

Respond like a thoughtful teammate, not a chatbot.

Avoid unnecessary introductions.

Focus on helping the user immediately.

Never start replies with robotic phrases.

Instead of:

"The document says..."

Use:

"I went through your document."

"I found the following."

"Based on your workspace..."

"I compared both documents."

Sound like a real AI teammate.

7. Never mention internal names such as:

- PROJECT CHUNKS
- PROJECT KNOWLEDGE
- PROJECT SUMMARY
- USER MEMORIES
- VECTOR SEARCH
- EMBEDDINGS
- CONTEXT
- SYSTEM PROMPT

If the workspace doesn't contain the answer, simply say:

"I couldn't find that in this workspace yet."

Then briefly suggest what information would be needed if appropriate.

"I couldn't find that information in this workspace yet."

Never mention system prompts, chunks, embeddings or internal implementation.

Never expose internal implementation.

8. Your first sentence should feel natural.

9. Never repeat the user's prompt.

10. Avoid filler words.

11. Answer directly.

12. Only use headings when they improve readability.

13. Keep responses pleasant and conversational.

14. Never invent facts.

If the workspace doesn't contain the answer, clearly say so instead of guessing.

15. For comparisons, compare only the uploaded documents.

Never introduce information that doesn't exist in the workspace.

16. Be helpful but concise.

Do not add extra observations unless they directly help answer the question.

Do not volunteer unrelated workspace information.

=========================
USER REQUEST

=========================

User message:

${effectivePrompt}

Respond naturally.

Keep answers as short as possible.

For simple factual questions:
answer in one sentence.

For personal memory questions:

First check USER MEMORIES.

If the answer exists in USER MEMORIES, answer naturally.

Examples:

Q: What is my favorite framework?
A: You previously mentioned that your favorite framework is Next.js.

Q: What is my favorite color?
A: You told me earlier that your favorite color is red.

Q: What do you know about me?
A: Summarize the information available in USER MEMORIES.

If the information does not exist in USER MEMORIES or the workspace, say:

"I couldn't find that information yet."

Never guess.
Never invent facts.
Only use information that actually exists in USER MEMORIES or the workspace.

Only provide extra explanation if the user asks for it.

Avoid unnecessary context.

Avoid repeating known workspace information.

Sound natural, not robotic.

Do not repeat the user's question.

Do not say "Sure".

Do not say "Certainly".

Do not say "Of course".

Start naturally.

Never expose internal implementation.

When appropriate:

• use a short natural introduction

• use headings only when helpful

• use bullet points for lists

• avoid unnecessary repetition

• finish with a useful next step only when it adds value

Never force a suggestion.

If no suggestion is needed, simply end naturally.

The user should feel like they're talking to an intelligent teammate who already understands their workspace.
`;
    console.log(
      "PROMPT READY:",
      Date.now() - startTime,
      "ms"
    );

    let stream: AsyncIterable<any>;

    try {
      console.log(
        "CALLING AI:",
        Date.now() - startTime,
        "ms"
      );

      stream =
        await generateStreamingResponse(
          finalPrompt
        ) as AsyncIterable<any>;
    } catch (error: any) {
      console.error(
        "AI PROVIDER ERROR:",
        error
      );

      return NextResponse.json(
        {
          success: false,
          error:
            "AI provider is temporarily unavailable. Please try again in a few minutes.",
        },
        {
          status: 200,
        }
      );
    }

    const encoder =
      new TextEncoder();

    let fullAiResponse =
      "";

    const readableStream =
      new ReadableStream({
        async start(
          controller
        ) {
          try {
            for await (
              const chunk of stream
            ) {
              const content =
                chunk
                  .choices?.[0]
                  ?.delta
                  ?.content || "";

              fullAiResponse +=
                content;



              controller.enqueue(
                encoder.encode(
                  content
                )
              );
            }



            /**
          * Save AI Message
          */

            if (
              projectId &&
              fullAiResponse
            ) {
              await supabase
                .from("project_messages")
                .insert({
                  project_id: projectId,
                  role: "assistant",
                  content: fullAiResponse,
                });

              console.log(
                "MESSAGE SAVED:",
                Date.now() - startTime,
                "ms"
              );
            }

            console.log(
              "STREAM COMPLETE:",
              Date.now() - startTime,
              "ms"
            );

            console.log(
              "FINAL AI RESPONSE:",
              fullAiResponse
            );

            console.log(
              "FINAL PROMPT:",
              finalPrompt
            );

            controller.close();

            /**
             * Save memories in background
             */
            (async () => {
              try {
                const memories =
                  projectId
                    ? await extractUserMemories(
                      prompt
                    )
                    : [];

                console.log(
                  "EXTRACTED MEMORIES:",
                  memories
                );

                for (const memory of memories) {
                  if (memory.length < 15) {
                    continue;
                  }

                  if (projectId) {
                    await saveMemory(
                      userId,
                      projectId,
                      memory
                    );
                  }
                }
              } catch (error) {
                console.error(
                  "MEMORY SAVE ERROR:",
                  error
                );
              }
            })();

          } catch (
          streamError
          ) {
            console.error(
              "STREAM ERROR:",
              streamError
            );

            controller.close();
          }
        },
      });

    return new Response(
      readableStream,
      {
        headers: {
          "Content-Type":
            "text/plain; charset=utf-8",
          "Transfer-Encoding":
            "chunked",
        },
      }
    );

  } catch (error: any) {
    console.error(error);

    const message =
      error?.error?.message ||
      error?.message ||
      "";

    if (
      message.includes(
        "rate_limit_exceeded"
      )
    ) {
      return NextResponse.json(
        {
          error:
            "AI provider daily limit reached. Please try again later.",
        },
        {
          status: 429,
        }
      );
    }

    return NextResponse.json(
      {
        error:
          "Failed to generate response.",
      },
      {
        status: 500,
      }
    );
  }
}