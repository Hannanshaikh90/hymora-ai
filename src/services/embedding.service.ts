import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});
console.log(
  "GEMINI KEY EXISTS:",
  !!process.env.GEMINI_API_KEY
);

export async function generateEmbedding(
  text: string
) {
  try {

    console.time("GEMINI API");

    const result =
      await ai.models.embedContent({
        model: "gemini-embedding-001",
        contents: text,
      });

    console.timeEnd("GEMINI API");

    console.log(
      "EMBEDDING GENERATED"
    );

    return (
      result.embeddings?.[0]?.values || []
    );

  } catch (error) {

    console.error(
      "EMBEDDING ERROR:",
      error
    );

    console.timeEnd("GEMINI API");

    return [];
  }
}