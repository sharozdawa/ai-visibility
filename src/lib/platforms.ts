export const AI_PLATFORMS = [
  {
    id: "chatgpt",
    name: "ChatGPT",
    color: "#10a37f",
    icon: "🤖",
    company: "OpenAI",
  },
  {
    id: "perplexity",
    name: "Perplexity",
    color: "#20b2aa",
    icon: "🔍",
    company: "Perplexity AI",
  },
  {
    id: "claude",
    name: "Claude",
    color: "#d97706",
    icon: "🧠",
    company: "Anthropic",
  },
  {
    id: "gemini",
    name: "Gemini",
    color: "#4285f4",
    icon: "✨",
    company: "Google",
  },
];

export const QUERY_TEMPLATES = [
  "What is {brand}?",
  "Best alternatives to {brand}",
  "Is {brand} good?",
  "{brand} review",
  "Best {keyword} tools",
  "Top {keyword} platforms",
  "What are the best {keyword} services?",
  "Compare {brand} with competitors",
  "{brand} pros and cons",
  "Should I use {brand}?",
];

export function getPlatform(id: string) {
  return AI_PLATFORMS.find((p) => p.id === id);
}

export function generateQueries(
  brandName: string,
  keywords: string[]
): string[] {
  const queries: string[] = [];
  for (const template of QUERY_TEMPLATES) {
    if (template.includes("{keyword}")) {
      for (const keyword of keywords) {
        queries.push(
          template.replace("{brand}", brandName).replace("{keyword}", keyword)
        );
      }
    } else {
      queries.push(template.replace("{brand}", brandName));
    }
  }
  return queries;
}
