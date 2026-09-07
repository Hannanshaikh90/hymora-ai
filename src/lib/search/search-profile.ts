export function getSearchProfile(
  query: string
) {

  const lower =
    query.toLowerCase();

    if (
  lower.includes("bitcoin") ||
  lower.includes("btc") ||
  lower.includes("crypto") ||
  lower.includes("stock") ||
  lower.includes("market") ||
  lower.includes("gold") ||
  lower.includes("price")
) {
  return {
    topic:
      "general" as const,

    domains: [
      "coindesk.com",
      "coinmarketcap.com",
      "tradingview.com",
      "finance.yahoo.com",
      "wsj.com",
      "bloomberg.com",
      "reuters.com",
    ],
  };
}

  if (
    lower.includes(
      "weather"
    )
  ) {
    return {
      topic:
        "general" as const,

      domains: [
        "weather.com",
        "accuweather.com",
      ],
    };
  }

  return {
    topic:
      "news" as const,

    domains: [
      "techcrunch.com",
      "reuters.com",
      "theverge.com",
      "openai.com",
      "anthropic.com",
      "googleblog.com",
      "businessinsider.com",
      "wired.com",
      "wsj.com",
    ],
  };
}