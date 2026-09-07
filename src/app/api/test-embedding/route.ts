import { NextResponse } from "next/server";
import { generateEmbedding } from "@/services/embedding.service";

export async function GET() {
  try {
    const embedding =
      await generateEmbedding(
        "Nike targets Gen Z consumers"
      );

    return NextResponse.json({
      success: true,
      dimensions: embedding.length,
      sample: embedding.slice(0, 5),
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message,
    });
  }
}