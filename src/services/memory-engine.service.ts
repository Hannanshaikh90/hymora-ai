import OpenAI from "openai";

const openrouter = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
});

export async function extractUserMemories(
  userMessage: string
): Promise<string[]> {
  try {
    const completion =
      await openrouter.chat.completions.create({
        model: "openai/gpt-oss-20b",

        messages: [
          {
            role: "system",
            content: `
You are Hymora's Memory Engine.

Your job is to extract ONLY long-term user memories.

Save ONLY information that will still be useful in future conversations.

Good memories:

- Stable personal preferences
- Communication preferences
- Long-term goals
- Favorite tools explicitly stated by the user
- Company or product names explicitly stated by the user
- Personal profile information
- Business profile information

Only save information if:

1. The user explicitly states it.
2. It is likely to remain true for months.
3. It would be useful in future conversations.
4. It is not already implied by the current workspace.

Do NOT save:

- Information inferred by the AI
- Workspace summaries
- Project summaries
- Technologies mentioned in uploaded files
- Technologies mentioned in project knowledge
- Technologies mentioned by the AI
- Reworded versions of existing memories
- Temporary project details
- Repeated information
- Anything that can be derived from project files or knowledge

Return ONLY valid JSON.

Example:

[
  "User prefers TypeScript.",
  "User is building Hymora.",
  "User prefers concise responses."
]

CRITICAL RULES:

Never save questions.

Never save requests for information.

Never save "I don't know".

Never save AI responses.

Never save temporary conversation content.

Never save anything that starts with:

- What
- Why
- How
- When
- Where
- Who
- Can you
- Could you
- Would you
- Do you
- Is it
- Are you
- I don't know

If the message is not an explicit user fact, return:

[]
            `,
          },
          {
            role: "user",
            content: userMessage,
          },
        ],
      });

    const content =
      completion.choices?.[0]?.message?.content || "[]";

    console.log(
      "MEMORY ENGINE RAW:",
      content
    );

    let memories: unknown = [];

    try {
      memories = JSON.parse(content);
    } catch {
      return [];
    }

    if (!Array.isArray(memories)) {
      return [];
    }

    return memories
      .filter(
        (memory): memory is string =>
          typeof memory === "string"
      )
      .map((memory) => memory.trim())
      .filter(Boolean);
  } catch (error) {
    console.error(
      "MEMORY_ENGINE_ERROR",
      error
    );

    return [];
  }
}