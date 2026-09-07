import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,

  baseURL:
    "https://api.groq.com/openai/v1",
});

export async function POST(
  req: Request
) {
  try {
    const body = await req.json();

    const { message } = body;

    if (!message) {
      return new Response(
        "Message is required",
        {
          status: 400,
        }
      );
    }

    const completion =
      await openai.chat.completions.create(
        {
          model:
            "llama-3.3-70b-versatile",

          messages: [
            {
              role: "user",
              content: message,
            },
          ],

          stream: true,
        }
      );

    const encoder =
      new TextEncoder();

    const stream =
      new ReadableStream({
        async start(controller) {
          for await (const chunk of completion) {
            const text =
              chunk.choices[0]?.delta
                ?.content || "";

            controller.enqueue(
              encoder.encode(text)
            );
          }

          controller.close();
        },
      });

    return new Response(stream);
  } catch (error: any) {
    console.log(
      "[CONVERSATION_ERROR]",
      error
    );

    return new Response(
      "Groq API Error",
      {
        status: 500,
      }
    );
  }
}