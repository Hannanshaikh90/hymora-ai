import { createClient } from "@supabase/supabase-js";
import { generateEmbedding } from "@/services/embedding.service";
import { cosineSimilarity } from "@/lib/cosine-similarity";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);



export async function retrieveEmbeddingChunks(
  query: string,
  projectId: string,
  limit = 3
) {
  try {

    console.log(
      "VECTOR SEARCH START"
    );

    if (
      !query ||
      !projectId
    ) {

      console.log(
  "VECTOR SEARCH END"
);
      return [];
    }

    /**
     * QUERY EMBEDDING
     */

    console.time("QUERY EMBEDDING");

const queryEmbedding =
  await generateEmbedding(
    query
  );

console.timeEnd("QUERY EMBEDDING");

    if (
      !queryEmbedding ||
      queryEmbedding.length === 0
    ) {
      return [];
    }

    /**
     * LOAD PROJECT EMBEDDINGS
     */

    console.time("LOAD EMBEDDINGS");

const {
  data,
  error,
} = await supabase
      .from(
        "project_embeddings"
      )
      .select(`
  content,
  embedding,
  knowledge_id,
  chunk_id
`)
      .eq(
        "project_id",
        projectId
      );

   if (error) {
  throw error;
}

console.timeEnd("LOAD EMBEDDINGS");

    console.log(
      "PROJECT ID:",
      projectId
    );

    console.log(
      "EMBEDDINGS FOUND:",
      data?.length
    );

    console.log(
      "FIRST EMBEDDING:",
      data?.[0]
    );

    if (
      !data ||
      data.length === 0
    ) {
      return [];
    }

    /**
     * SCORE CHUNKS
     */

   console.time("COSINE SEARCH");

const scoredChunks =
      data
        .filter(
          (item) => item.embedding
        )
        .map((item) => {

          const embedding =
            Array.isArray(item.embedding)
              ? item.embedding
              : [];

          const score =
            cosineSimilarity(
              queryEmbedding,
              embedding
            );



          return {
            content: item.content,
            score,
            knowledge_id: item.knowledge_id,
            chunk_id: item.chunk_id,
          };
        });

    console.log(
      "SCORED CHUNKS:",
      scoredChunks
    );

    console.log("================================");
    console.log("QUERY:", query);

    for (const chunk of scoredChunks) {
      console.log({
        score: chunk.score,
        preview: chunk.content.substring(0, 100),
      });
    }

    console.log("================================");

    /**
     * SORT
     */

    console.timeEnd("COSINE SEARCH");

const sortedChunks =
  scoredChunks.sort(
        (a, b) =>
          b.score - a.score
      );

    const groupedChunks = new Map<
      string,
      typeof scoredChunks
    >();

    for (const chunk of sortedChunks) {
      const key = chunk.knowledge_id ?? "unknown";

      if (!groupedChunks.has(key)) {
        groupedChunks.set(key, []);
      }

      groupedChunks.get(key)!.push(chunk);
    }

    /**
     * REMOVE DUPLICATES
     */

    const results = Array.from(groupedChunks.values())
      .flatMap((chunks) =>
        chunks
          .sort((a, b) => b.score - a.score)
          .slice(0, 3)
      )
      .sort((a, b) => b.score - a.score)
      .slice(0, Math.max(limit, 6))
      .map((item) => item.content);

    console.log(
      "SCORED CHUNKS:",
      scoredChunks
    );

    console.log(
      "PROJECT ID:",
      projectId
    );

    console.log(
      "EMBEDDINGS FOUND:",
      data?.length
    );

    console.log(
      "VECTOR CHUNKS:",
      results
    );

    console.log(
  "VECTOR SEARCH END"
);

return results;

  } catch (error) {

    console.error(
      "VECTOR RETRIEVAL ERROR:",
      error
    );

    return [];
  }
}