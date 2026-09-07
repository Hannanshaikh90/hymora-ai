import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

type ResponseStyle =
  | "concise"
  | "balanced"
  | "detailed";

type MemoryMode =
  | "off"
  | "passive"
  | "active";

type Theme =
  | "dark"
  | "system";

type Accent =
  | "purple"
  | "blue"
  | "teal"
  | "amber"
  | "rose"
  | "slate";

interface SettingsBody {
  responseStyle: ResponseStyle;
  memoryMode: MemoryMode;
  creativity: number;

  theme: Theme;
  accent: Accent;

  autoSaveMemory: boolean;
  autoKnowledgeExtraction: boolean;

  defaultWorkspace: string;
}

function validate(body: SettingsBody) {
  if (
    ![
      "concise",
      "balanced",
      "detailed",
    ].includes(body.responseStyle)
  ) {
    return "Invalid response style";
  }

  if (
    ![
      "off",
      "passive",
      "active",
    ].includes(body.memoryMode)
  ) {
    return "Invalid memory mode";
  }

  if (
    body.creativity < 0 ||
    body.creativity > 100
  ) {
    return "Creativity must be between 0 and 100";
  }

  if (
    ![
      "dark",
      "system",
    ].includes(body.theme)
  ) {
    return "Invalid theme";
  }

  if (
    ![
      "purple",
      "blue",
      "teal",
      "amber",
      "rose",
      "slate",
    ].includes(body.accent)
  ) {
    return "Invalid accent";
  }

  return null;
}

export async function GET() {
  try {
    const { userId } = await auth();

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

   const [{ data, error }, { data: workspaces }] =
  await Promise.all([
    supabase
      .from("user_settings")
      .select("*")
      .eq("clerk_user_id", userId)
      .single(),

    supabase
      .from("projects")
      .select("id,title")
      .eq("user_id", userId)
      .order("updated_at", {
        ascending: false,
      }),
  ]);

    if (
      error &&
      error.code !== "PGRST116"
    ) {
      return NextResponse.json(
        {
          success: false,
          error: error.message,
        },
        {
          status: 500,
        }
      );
    }

   return NextResponse.json({
  success: true,

  workspaces:
    workspaces ?? [],

  settings:
        data ?? {
          response_style:
            "balanced",

          memory_mode:
            "active",

          creativity: 60,

          theme: "dark",

          accent: "purple",

          auto_save_memory:
            true,

          auto_knowledge_extraction:
            true,

          default_workspace:
            "",
        },
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        error:
          "Internal Server Error",
      },
      {
        status: 500,
      }
    );
  }
}

export async function PUT(
  request: Request
) {
  try {
    const { userId } = await auth();

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

    const body: SettingsBody =
      await request.json();

    const validation =
      validate(body);

    if (validation) {
      return NextResponse.json(
        {
          success: false,
          error: validation,
        },
        {
          status: 400,
        }
      );
    }

    const { error } =
      await supabase
        .from("user_settings")
        .upsert(
          {
            clerk_user_id:
              userId,

            response_style:
              body.responseStyle,

            memory_mode:
              body.memoryMode,

            creativity:
              body.creativity,

            theme:
              body.theme,

            accent:
              body.accent,

            auto_save_memory:
              body.autoSaveMemory,

            auto_knowledge_extraction:
              body.autoKnowledgeExtraction,

            default_workspace:
              body.defaultWorkspace,

            updated_at:
              new Date().toISOString(),
          },
          {
            onConflict:
              "clerk_user_id",
          }
        );

    if (error) {
      return NextResponse.json(
        {
          success: false,
          error: error.message,
        },
        {
          status: 500,
        }
      );
    }

    return NextResponse.json({
      success: true,
      message:
        "Settings updated successfully",
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        error:
          "Internal Server Error",
      },
      {
        status: 500,
      }
    );
  }
}