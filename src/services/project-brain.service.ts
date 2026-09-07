import OpenAI from "openai";

const openrouter = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
});

export async function generateProjectSummary(
  currentSummary: string,
  userMessage: string,
  aiResponse: string
) {
  try {
    const completion =
      await openrouter.chat.completions.create({
        model: "openai/gpt-oss-20b:free",

        messages: [
          {
            role: "system",
            content: `
You are a project memory engine.

Update the project summary.

Keep only important information.

Maximum 300 words.

Remove duplicates.

Output ONLY the summary.
            `,
          },
          {
            role: "user",
            content: `
CURRENT SUMMARY:

${currentSummary}

NEW USER MESSAGE:

${userMessage}

AI RESPONSE:

${aiResponse}
            `,
          },
        ],
      });

    return (
      completion.choices?.[0]?.message?.content || ""
    );
  } catch (error) {
    console.error(
      "PROJECT SUMMARY ERROR:",
      error
    );

    return currentSummary || "";
  }
}