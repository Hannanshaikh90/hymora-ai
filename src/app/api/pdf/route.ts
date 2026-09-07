import { auth } from "@clerk/nextjs/server";

import { NextResponse } from "next/server";

import {
  extractPdfText,
} from "@/services/pdf.service";

import {
  checkPdfLimit,
  incrementPdfUsage,
} from "@/services/usage.service";

import {
  checkUserSubscription,
} from "@/services/subscription.service";

export async function POST(
  req: Request
) {
try {

  const { userId } =
    await auth();

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
    await checkUserSubscription(
      userId
    );

  const pdfUsage =
    await checkPdfLimit(
      userId,
      isPro
    );

  if (!pdfUsage.allowed) {
    return NextResponse.json(
      {
        success: false,
        error:
          "PDF_LIMIT_REACHED",
      },
      {
        status: 403,
      }
    );
  }

  const formData =
    await req.formData();

    const file =
      formData.get(
        "file"
      ) as File | null;

    if (!file) {
      return NextResponse.json(
        {
          success: false,
          error:
            "No file uploaded",
        },
        {
          status: 400,
        }
      );
    }

    console.log(
  "[PDF RECEIVED]",
  file.name
);

const result =
  await extractPdfText(
    file
  );

await incrementPdfUsage(
  userId
);

return NextResponse.json({
  success: true,
  fileName: file.name,
  result,
});
  } catch (error) {
    console.error(
      "PDF API ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          "Failed to process PDF.",
      },
      {
        status: 500,
      }
    );
  }
}