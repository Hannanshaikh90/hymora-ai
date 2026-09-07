export function detectWebMode(
  prompt: string
) {

  const trimmed =
    prompt.trim();

  // Manual mode

  if (
    trimmed.startsWith("/web")
  ) {
    return {
      enabled: true,

      query: trimmed
        .replace("/web", "")
        .trim(),
    };
  }

  // Auto detection keywords

 const webKeywords = [
  "latest",
  "today",
  "news",
  "price",
  "weather",
  "bitcoin",
  "btc",
  "stock",
  "current",
  "live",
  "breaking",

  // Currency
  "usd",
  "pkr",
  "eur",
  "gbp",
  "inr",
  "exchange",
  "rate",

  // Crypto
  "ethereum",
  "eth",
  "crypto",
  "coin",

  // Markets
  "gold",
  "silver",
  "oil",
  "market",
  "forex",

  // Time-sensitive
  "now",
  "today's",
  "currently",
];

  const lowerPrompt =
    trimmed.toLowerCase();

 const shouldSearch =
  webKeywords.some(
    (keyword) =>
      lowerPrompt.includes(
        keyword
      )
  ) ||

  /\$/.test(trimmed) ||

  /usd|pkr|eur|gbp|inr/i.test(
    trimmed
  );

 let optimizedQuery =
  trimmed;

// Currency queries

if (
  /\$/.test(trimmed) ||
  /usd|pkr|eur|gbp|inr/i.test(
    trimmed
  )
) {
  optimizedQuery =
    `${trimmed} exchange rate today`;
}

// Gold queries

if (
  /gold/i.test(trimmed)
) {
  optimizedQuery =
    `current ${trimmed}`;
}

return {
  enabled: shouldSearch,

  query:
    optimizedQuery,
};
}