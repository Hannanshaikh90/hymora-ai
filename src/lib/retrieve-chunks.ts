export function retrieveChunks(
  query: string,
  chunks: string[],
  limit = 8

  
  
)
 {
  const stopWords = [
    "who",
    "is",
    "the",
    "a",
    "an",
    "what",
    "where",
    "when",
    "why",
    "how",
    "are",
    "was",
    "were",
    "do",
    "does",
    "did",
    "of",
    "to",
    "in",
    "for",
    "on",
    "with",
    "and",
    "or",
    "at",
    "by",
    "from",
    "about",
    "into",
    "over",
    "after",
    "before",
    "under",
    "again",
    "further",
    "then",
    "once",
  ];

  const queryWords = query
    .toLowerCase()
    .replace(
      /[^\w\s]/g,
      ""
    )
    .split(/\s+/)
    .filter(
      (word) =>
        word.length > 1 &&
        !stopWords.includes(word)
    );

  const scoredChunks =
    chunks.map((chunk) => {
      const lowerChunk =
        chunk.toLowerCase();

      let score = 0;

      queryWords.forEach(
        (word) => {

          const escapedWord =
            word.replace(
              /[.*+?^${}()|[\]\\]/g,
              "\\$&"
            );

          const matches =
            lowerChunk.match(
              new RegExp(
                escapedWord,
                "g"
              )
            );

          if (matches) {
            score +=
              matches.length * 10;
          }
        }
      );

      return {
        chunk,
        score,
      };
    });

  return scoredChunks
    .filter(
      (item) =>
        item.score > 0
    )
    .sort(
      (a, b) =>
        b.score - a.score
    )
    .slice(0, limit)
    .map(
      (item) =>
        item.chunk
    );
}