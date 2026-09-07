import { tavily } from "@tavily/core";

import { getSearchProfile } from "./search-profile";

const client = tavily({
  apiKey: process.env.TAVILY_API_KEY!,
});

export async function searchWeb(
  query: string
) {
  try {

    const profile =
      getSearchProfile(
        query
      );

    if (process.env.NODE_ENV === "development") {
      console.log("[HYMORA SEARCH PROFILE]", {
        query,
        topic: profile.topic,
        domains: profile.domains,
      });
    }

    const response =
      await client.search(
        query,
        {
          searchDepth:
            "advanced",

          topic:
            profile.topic,

          maxResults: 5,

          includeAnswer:
            true,

          includeDomains:
            profile.domains,
        }
      );

    return response.results.map(
      (item) => ({
        title: item.title,
        url: item.url,
        content:
          item.content,
      })
    );

  } catch (error) {

    console.error(
      "Web Search Error:",
      error
    );

    return [];
  }
}