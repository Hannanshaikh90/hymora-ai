import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

import {
  generateStreamingResponse,
} from "@/services/ai.service";

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

    const body =
      await req.json();

    const {
      prompt,
      history = [],
    } = body;

    const stream =
      await generateStreamingResponse(
        prompt
      ) as AsyncIterable<any>;

    let responseText = "";

    for await (const chunk of stream) {
      responseText +=
        chunk?.choices?.[0]
          ?.delta?.content || "";
    }

    console.log(
      "AI RESPONSE:",
      responseText
    );

    return NextResponse.json({
      success: true,
      response: responseText,
    });

  } catch (error) {
    console.error(
      "PROJECT_CHAT_ERROR",
      error
    );

    return NextResponse.json(
      {
        error:
          "Failed to generate response",
      },
      {
        status: 500,
      }
    );
  }
}