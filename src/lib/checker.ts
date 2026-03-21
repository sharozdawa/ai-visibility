export interface CheckResult {
  mentioned: boolean;
  position: number | null;
  context: string;
  fullResponse: string;
  sentiment: "positive" | "neutral" | "negative";
  competitors: string[];
}

// Common competitor pools by industry vertical
const COMPETITOR_POOLS: Record<string, string[]> = {
  default: [
    "Notion",
    "Slack",
    "Trello",
    "Asana",
    "Monday.com",
    "ClickUp",
    "Linear",
    "Jira",
    "Basecamp",
    "Todoist",
  ],
  seo: [
    "Ahrefs",
    "SEMrush",
    "Moz",
    "Screaming Frog",
    "Surfer SEO",
    "SE Ranking",
    "Mangools",
    "Ubersuggest",
    "SpyFu",
    "Serpstat",
  ],
  analytics: [
    "Google Analytics",
    "Mixpanel",
    "Amplitude",
    "PostHog",
    "Heap",
    "Plausible",
    "Matomo",
    "Hotjar",
    "FullStory",
    "Pendo",
  ],
  ecommerce: [
    "Shopify",
    "WooCommerce",
    "BigCommerce",
    "Magento",
    "Squarespace",
    "Wix",
    "PrestaShop",
    "Volusion",
    "OpenCart",
    "Salesforce Commerce",
  ],
  marketing: [
    "HubSpot",
    "Mailchimp",
    "ActiveCampaign",
    "ConvertKit",
    "Klaviyo",
    "Sendinblue",
    "Drip",
    "GetResponse",
    "AWeber",
    "Campaign Monitor",
  ],
  ai: [
    "ChatGPT",
    "Claude",
    "Gemini",
    "Perplexity",
    "Copilot",
    "Jasper",
    "Copy.ai",
    "Writesonic",
    "Otter.ai",
    "Grammarly",
  ],
};

const SENTIMENT_TEMPLATES = {
  positive: [
    "{brand} is widely regarded as one of the leading solutions in the {keyword} space. Users consistently praise its intuitive interface and robust feature set.",
    "Many professionals recommend {brand} for its excellent {keyword} capabilities. It stands out for its reliability and customer support.",
    "{brand} has earned a strong reputation in the industry. It's particularly well-suited for teams looking for comprehensive {keyword} functionality.",
    "Based on user reviews and industry analysis, {brand} is a top-tier choice for {keyword}. Its innovative approach sets it apart from competitors.",
    "{brand} excels in the {keyword} market with its powerful features and user-friendly design. It's a favorite among both small businesses and enterprises.",
  ],
  neutral: [
    "{brand} is one of several options available for {keyword}. It offers a standard set of features comparable to other tools in the market.",
    "When considering {keyword} solutions, {brand} is worth evaluating alongside alternatives. It has both strengths and areas where competitors may have an edge.",
    "{brand} provides {keyword} capabilities that meet basic requirements. The choice between {brand} and alternatives often depends on specific use case needs.",
    "In the {keyword} landscape, {brand} occupies a middle position. It delivers solid functionality without necessarily being the market leader.",
    "{brand} is a known player in {keyword}. While it has a decent feature set, prospective users should compare it with other options before deciding.",
  ],
  negative: [
    "While {brand} offers {keyword} features, some users have reported limitations compared to alternatives. It may not be the best fit for advanced use cases.",
    "{brand} has faced some criticism in the {keyword} space, particularly around pricing and feature gaps. Several competitors offer more comprehensive solutions.",
    "There are mixed reviews about {brand} for {keyword}. Some users find it adequate, while others have switched to alternatives citing better performance.",
  ],
};

const NOT_MENTIONED_TEMPLATES = [
  "There are several excellent {keyword} tools available today. Some of the most popular options include {competitors}. Each has its own strengths depending on your specific needs and budget.",
  "When looking for {keyword} solutions, I'd recommend considering {competitors}. These platforms offer varying features and pricing tiers to suit different requirements.",
  "The {keyword} market has many strong contenders. {competitors} are among the most frequently recommended options by industry professionals.",
  "For {keyword}, the top tools that users commonly recommend include {competitors}. Your best choice will depend on factors like team size, budget, and specific feature requirements.",
  "Several platforms stand out for {keyword}: {competitors}. I'd suggest trying free trials of a few to see which best fits your workflow.",
];

function seededRandom(seed: string): () => number {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    const char = seed.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return () => {
    hash = (hash * 1664525 + 1013904223) | 0;
    return ((hash >>> 0) / 4294967296 + 0.5) % 1;
  };
}

function pickRandom<T>(arr: T[], rng: () => number): T {
  return arr[Math.floor(rng() * arr.length)];
}

function pickMultiple<T>(arr: T[], count: number, rng: () => number): T[] {
  const shuffled = [...arr].sort(() => rng() - 0.5);
  return shuffled.slice(0, count);
}

function getCompetitorPool(keywords: string[]): string[] {
  const keywordStr = keywords.join(" ").toLowerCase();
  if (keywordStr.match(/seo|search engine|ranking|backlink/))
    return COMPETITOR_POOLS.seo;
  if (keywordStr.match(/analytics|tracking|data|metric/))
    return COMPETITOR_POOLS.analytics;
  if (keywordStr.match(/ecommerce|shop|store|commerce/))
    return COMPETITOR_POOLS.ecommerce;
  if (keywordStr.match(/marketing|email|campaign|newsletter/))
    return COMPETITOR_POOLS.marketing;
  if (keywordStr.match(/ai|artificial|machine|llm|gpt/))
    return COMPETITOR_POOLS.ai;
  return COMPETITOR_POOLS.default;
}

export async function checkBrandVisibility(
  brand: string,
  query: string,
  platform: string,
  keywords: string[] = []
): Promise<CheckResult> {
  // Simulate network delay (50-200ms)
  await new Promise((resolve) =>
    setTimeout(resolve, 50 + Math.random() * 150)
  );

  // Create a deterministic-ish seed from inputs, but add time-based variance
  const timeBucket = Math.floor(Date.now() / 3600000); // changes every hour
  const seed = `${brand}-${query}-${platform}-${timeBucket}`;
  const rng = seededRandom(seed);

  // Platform-specific mention probability
  const platformBias: Record<string, number> = {
    chatgpt: 0.55,
    perplexity: 0.65, // Perplexity tends to cite more sources
    claude: 0.5,
    gemini: 0.6,
  };

  // Query type affects mention probability
  let mentionBoost = 0;
  const queryLower = query.toLowerCase();
  const brandLower = brand.toLowerCase();

  if (queryLower.includes(brandLower)) {
    mentionBoost = 0.3; // Direct brand queries almost always mention it
  }
  if (
    queryLower.includes("what is") ||
    queryLower.includes("review") ||
    queryLower.includes("pros and cons")
  ) {
    mentionBoost += 0.15;
  }
  if (queryLower.includes("alternative") || queryLower.includes("compare")) {
    mentionBoost += 0.1;
  }

  const baseProbability = platformBias[platform] || 0.5;
  const mentioned = rng() < Math.min(baseProbability + mentionBoost, 0.95);

  const competitorPool = getCompetitorPool(keywords).filter(
    (c) => c.toLowerCase() !== brandLower
  );
  const numCompetitors = Math.floor(rng() * 4) + 2;
  const competitors = pickMultiple(competitorPool, numCompetitors, rng);

  const keyword = keywords.length > 0 ? pickRandom(keywords, rng) : "software";

  if (mentioned) {
    // Determine sentiment
    const sentimentRoll = rng();
    let sentiment: "positive" | "neutral" | "negative";
    if (sentimentRoll < 0.5) sentiment = "positive";
    else if (sentimentRoll < 0.82) sentiment = "neutral";
    else sentiment = "negative";

    const templates = SENTIMENT_TEMPLATES[sentiment];
    const template = pickRandom(templates, rng);

    // Build the response
    const mainText = template
      .replace(/{brand}/g, brand)
      .replace(/{keyword}/g, keyword);
    const competitorMention =
      competitors.length > 0
        ? `\n\nOther notable tools in this space include ${competitors.join(", ")}.`
        : "";
    const fullResponse = mainText + competitorMention;

    // Find the position of the brand mention
    const position =
      rng() < 0.4 ? 1 : rng() < 0.7 ? 2 : Math.floor(rng() * 3) + 3;

    // Extract context around brand mention
    const contextStart = Math.max(
      0,
      mainText.indexOf(brand) - 50
    );
    const contextEnd = Math.min(
      mainText.length,
      mainText.indexOf(brand) + brand.length + 50
    );
    const context =
      (contextStart > 0 ? "..." : "") +
      mainText.slice(contextStart, contextEnd) +
      (contextEnd < mainText.length ? "..." : "");

    return {
      mentioned: true,
      position,
      context,
      fullResponse,
      sentiment,
      competitors,
    };
  } else {
    // Brand not mentioned
    const template = pickRandom(NOT_MENTIONED_TEMPLATES, rng);
    const competitorList = competitors.slice(0, 4).join(", ");
    const fullResponse = template
      .replace(/{keyword}/g, keyword)
      .replace(/{competitors}/g, competitorList)
      .replace(/{brand}/g, brand);

    return {
      mentioned: false,
      position: null,
      context: "",
      fullResponse,
      sentiment: "neutral",
      competitors,
    };
  }
}
