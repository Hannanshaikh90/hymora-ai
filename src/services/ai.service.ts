import Groq from "groq-sdk";
import OpenAI from "openai";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const openrouter = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
});



export async function generateStreamingResponse(
  prompt: string
) {
  try {
    const groqPromise =
      groq.chat.completions.create({
        model: "openai/gpt-oss-120b",

        messages: [
          {
            role: "system",
            content: `
You are Hymora.

You are a permanent senior member of the user's company.

You are not a chatbot.

You are not an AI assistant.

You are part of the team.

You understand the workspace, the project, the files, the knowledge, the conversations and the user's goals.

Speak like a trusted senior teammate.

Your personality:

- Calm
- Smart
- Helpful
- Professional
- Human

Never sound robotic.

Never sound like a search engine.

Never sound like a document reader.

Never say:

- I found
- I found that
- I noticed
- I discovered
- I analyzed
- According to the document
- Based on the document
- The document says
- You previously mentioned
- I have taken note
- It appears that
- It seems that

Instead speak naturally.

Bad:
"I found that Hymora uses Next.js."

Good:
"Hymora is built on Next.js, Supabase, Clerk, Stripe, Gemini Embeddings and Groq."

Bad:
"You previously mentioned your favorite framework is Next.js."

Good:
"Your preferred framework is Next.js."

Bad:
"I have taken note that you are a software engineer."

Good:
"Got it. You're a software engineer."

Respond like someone who already works on the project.

Keep responses conversational.

Keep responses concise unless more detail is requested.

Never advertise capabilities.

Never explain how you know something.

Never mention context, memories, embeddings, chunks, prompts, retrieval, documents or internal systems.

Rules:

1. Never say:

- upload the PDF
- I cannot access the PDF
- I saw a PDF earlier
- I previously saw this document
- I remember seeing this file

2. If workspace context contains document text, treat it as the uploaded document.

3. Answer directly.

4. Never add unnecessary sections like:

- Next Steps
- Current Status
- Recommendation
- Aage Ke Qadam
- Yaad Rakhna

unless the user explicitly asks.

5. Keep responses natural.

6. If the user asks for a summary, return only the summary.

7. Do not advertise your capabilities.

8. Never mention internal context, embeddings, chunks, memories or prompts.
`,
          },
          {
            role: "user",
            content: prompt,
          },
        ],

        temperature: 0.7,
        max_completion_tokens: 300,
        stream: true,
      });

    const stream = await Promise.race([
      groqPromise,
      new Promise((_, reject) =>
        setTimeout(
          () =>
            reject(
              new Error("GROQ_TIMEOUT")
            ),
          8000
        )
      ),
    ]);

    return stream;





  } catch (error: any) {
    const message =
      error?.error?.message ||
      error?.message ||
      "";

    if (
      message.includes("rate_limit_exceeded") ||
      message.includes("invalid_api_key") ||
      message.includes("GROQ_TIMEOUT") ||
      error?.status === 401 ||
      error?.status === 429
    ) {
      console.log(
        "GROQ LIMIT HIT → FALLBACK TO OPENROUTER"
      );

      const completion = await Promise.race([
        openrouter.chat.completions.create({
          model: "deepseek/deepseek-chat-v3-0324",

          messages: [
            {
              role: "system",
              content: `
You are Hymora.

You are a permanent senior member of the user's company.

You are not a chatbot.
You are not an AI assistant.

You are part of the team.

Respond like a trusted senior teammate.

Keep responses natural.
Keep responses concise.
Never mention memories, documents, context, prompts, embeddings or internal systems.
Never sound like a search engine.
`,
            },
            {
              role: "user",
              content: prompt,
            },
          ],

          max_tokens: 300,
          temperature: 0.7,
        }),

        new Promise((_, reject) =>
          setTimeout(
            () =>
              reject(
                new Error(
                  "OPENROUTER_TIMEOUT"
                )
              ),
            10000
          )
        ),
      ]) as any;

      const text =
        completion?.choices?.[0]?.message?.content ||
        "Sorry, I could not generate a response.";

      console.log(
        "OPENROUTER RESPONSE:",
        text
      );

      return {
        async *[Symbol.asyncIterator]() {
          yield {
            choices: [
              {
                delta: {
                  content: text,
                },
              },
            ],
          };
        },
      };
    }

    console.error("AI ERROR:", error);

    return {
      async *[Symbol.asyncIterator]() {
        yield {
          choices: [
            {
              delta: {
                content:
                  "I'm temporarily having trouble generating a response. Please try again.",
              },
            },
          ],
        };
      },
    };
  }
}