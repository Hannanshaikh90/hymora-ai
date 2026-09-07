import { supabase } from "@/lib/supabase";

export async function getUserMemories(
  clerkUserId: string,
  projectId?: string
) {
  let query = supabase
    .from("user_memories")
    .select("*")
    .eq(
      "clerk_user_id",
      clerkUserId
    );

  if (projectId) {
    query = query.eq(
      "project_id",
      projectId
    );
  }

  const { data, error } =
    await query.order(
      "created_at",
      {
        ascending: false,
      }
    );

  if (error) {
    console.error(
      "Get memories error:",
      error
    );

    return [];
  }

  return data;
}

export async function saveMemory(
  clerkUserId: string,
  projectId: string,
  memory: string
) {
  console.log(
    "SAVE MEMORY CALLED:",
    clerkUserId,
    projectId,
    memory
  );

  const cleanedMemory =
    memory.trim();

  const { data: existing } =
    await supabase
      .from("user_memories")
      .select("id")
      .eq(
        "clerk_user_id",
        clerkUserId
      )
      .eq(
        "project_id",
        projectId
      )
      .eq(
        "memory",
        cleanedMemory
      )
      .maybeSingle();

  if (existing) {
    return;
  }

  const { error } =
    await supabase
      .from("user_memories")
      .insert([
        {
          clerk_user_id:
            clerkUserId,

          project_id:
            projectId,

          memory:
            cleanedMemory,
        },
      ]);



  if (error) {
    console.error(
      "Save memory error:",
      error
    );

    console.error(
      "SUPABASE INSERT ERROR:",
      error
    );
  }
}
export async function deleteMemory(
  memoryId: string
) {
  const { error } =
    await supabase
      .from("user_memories")
      .delete()
      .eq("id", memoryId);

  if (error) {
    console.error(
      "Delete memory error:",
      error
    );

    throw error;
  }
}

export async function deleteMemoryByText(
  clerkUserId: string,
  memoryText: string
) {
  console.log(
    "DELETE MEMORY CALLED:",
    clerkUserId,
    memoryText
  );

  const cleanedText =
    memoryText
      .trim()
      .toLowerCase();

  const { data, error } =
    await supabase
      .from("user_memories")
      .select("id, memory")
      .eq(
        "clerk_user_id",
        clerkUserId
      );

  console.log(
    "[DELETE REQUEST]",
    cleanedText
  );

  console.log(
    "[ALL MEMORIES]",
    data?.map(m => m.memory)
  );

  if (error) {
    console.error(
      "Find memory error:",
      error
    );

    throw error;
  }

  const memoryToDelete =
    data?.find(
      (memory) =>
        memory.memory
          .trim()
          .toLowerCase() ===
        cleanedText
    );

  if (!memoryToDelete) {
    console.log(
      "[MEMORY NOT FOUND]",
      cleanedText
    );

    return;
  }

  console.log(
    "[MEMORY FOUND]",
    memoryToDelete
  );

  const deleteResult =
    await supabase
      .from("user_memories")
      .delete()
      .eq(
        "id",
        memoryToDelete.id
      );

  console.log(
    "[DELETE RESULT]",
    deleteResult
  );

  const { data: verifyData } =
    await supabase
      .from("user_memories")
      .select("id, memory")
      .eq(
        "clerk_user_id",
        clerkUserId
      );

  console.log(
    "[AFTER DELETE]",
    verifyData?.map(
      (m) => m.memory
    )
  );
} 