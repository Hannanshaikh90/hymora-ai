"use server";

import { auth } from "@clerk/nextjs/server";

import { revalidatePath } from "next/cache";

import {
  deleteMemory,
} from "@/services/memory.service";

export async function deleteMemoryAction(
  memoryId: string
) {
  const { userId } =
    await auth();

  if (!userId) {
    throw new Error(
      "Unauthorized"
    );
  }

  await deleteMemory(
    memoryId
  );

  revalidatePath(
    "/dashboard/memory"
  );
}