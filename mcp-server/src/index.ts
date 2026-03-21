#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

// ─── Types ───────────────────────────────────────────────────────────────────

interface PlatformInfo {
  id: string;
  name: string;
  company: string;
  description: string;
  sourceMethod: string;
}

interface CheckResult {
  mentioned: boolean;
  position: number | null;
  context: string;
  sentiment: "positive" | "neutral" | "negative";
  competitors: string[];
}

interface PlatformResult {
  platform: string;
  platformName: string;
  queries: QueryResult[];
  mentionRate: number;
  averagePosition: number | null;
  sentimentBreakdown: { positive: number; neutral: number; negative: number };
  topCompetitors: string[];
}

interface QueryResult {
  query: string;
  mentioned: boolean;
  position: number | null;
  context: string;
  sentiment: "positive" | "neutral" | "negative";
  competitors: string[];
}

// ─── Constants ───────────────────────────────────────────────────────────────

const PLATFORMS: PlatformInfo[] = [
  {
    id: "chatgpt",
    name: "ChatGPT",
    company: "OpenAI",
    description:
      "Conversational AI assistant with web browsing and knowledge synthesis capabilities.",
    sourceMethod:
      "Trained on web data up to cutoff date; can browse the web for real-time information.",
  },
  {
    id: "perplexity",
    name: "Perplexity",
    company: "Perplexity AI",
    description:
      "AI-powered answer engine that searches the web and provides cited responses.",
    sourceMethod:
      "Real-time web search with source citations; indexes and synthesizes multiple web pages.",
  },
  {
    id: "claude",
    name: "Claude",
    company: "Anthropic",
    description:
      "AI assistant focused on safety and helpfulness with strong analytical capabilities.",
    sourceMethod:
      "Trained on web data up to cutoff date; focuses on accurate, well-reasoned responses.",
  },
  {
    id: "gemini",
    name: "Gemini",
    company: "Google",
    description:
      "Multimodal AI model integrated with Google Search and the broader Google ecosystem.",
    sourceMethod:
      "Leverages Google Search index and Knowledge Graph for up-to-date information.",
  },
];

const PLATFORM_IDS = PLATFORMS.map((p) => p.id);

const QUERY_TEMPLATES = [
  "What is {brand}?",
  "Best {keyword} tools",
  "{brand} review",
  "Compare {brand} with competitors",
  "Best alternatives to {brand}",
  "Top {keyword} platforms",
  "Is {brand} good for {keyword}?",
  "{brand} pros and cons",
  "What are the best {keyword} services?",
  "Should I use {brand}?",
];

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
  hosting: [
    "AWS",
    "Google Cloud",
    "Azure",
    "Vercel",
    "Netlify",
    "DigitalOcean",
    "Heroku",
    "Cloudflare",
    "Render",
    "Railway",
  ],
  design: [
    "Figma",
    "Canva",
    "Adobe XD",
    "Sketch",
    "InVision",
    "Framer",
    "Webflow",
    "Penpot",
    "Lunacy",
    "Photopea",
  ],
};

const WELL_KNOWN_BRANDS = new Set([
  "google",
  "apple",
  "microsoft",
  "amazon",
  "meta",
  "facebook",
  "netflix",
  "spotify",
  "slack",
  "notion",
  "figma",
  "canva",
  "shopify",
  "stripe",
  "hubspot",
  "salesforce",
  "ahrefs",
  "semrush",
  "openai",
  "anthropic",
  "vercel",
  "github",
  "gitlab",
  "docker",
  "wordpress",
  "wix",
  "squarespace",
  "mailchimp",
  "zoom",
  "dropbox",
  "trello",
  "asana",
  "linear",
  "datadog",
  "cloudflare",
  "twilio",
  "mongodb",
  "redis",
  "postgres",
  "supabase",
  "firebase",
  "aws",
  "azure",
  "digitalocean",
  "heroku",
  "netlify",
  "render",
  "railway",
]);

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

const RECOMMENDATIONS = [
  {
    category: "Structured Data",
    priority: "high",
    recommendation: "Add comprehensive Schema.org structured data to your website",
    details:
      "AI models parse structured data to understand your brand. Add Organization, Product, FAQ, and HowTo schemas to help AI platforms accurately represent your offerings.",
  },
  {
    category: "FAQ Content",
    priority: "high",
    recommendation: "Create a thorough FAQ page covering common questions about your brand",
    details:
      "AI assistants frequently answer direct questions. Having well-structured FAQ content increases the chance your brand's own answers are used in AI responses.",
  },
  {
    category: "Wikipedia Presence",
    priority: "high",
    recommendation: "Establish or improve your Wikipedia page",
    details:
      "Wikipedia is a primary knowledge source for most AI models. A well-sourced Wikipedia article significantly boosts AI visibility.",
  },
  {
    category: "Original Research",
    priority: "medium",
    recommendation: "Publish original research, studies, and data reports",
    details:
      "AI platforms prioritize authoritative, original content. Publishing industry reports, surveys, and data-driven articles positions your brand as a thought leader.",
  },
  {
    category: "Comparison Content",
    priority: "medium",
    recommendation: "Create honest comparison pages ({brand} vs Competitor)",
    details:
      "When users ask AI to compare tools, having your own comparison content helps shape the narrative. Be honest and factual for best results.",
  },
  {
    category: "Technical Documentation",
    priority: "medium",
    recommendation: "Maintain comprehensive, up-to-date documentation",
    details:
      "AI models reference documentation heavily. Well-organized docs with clear examples improve how AI describes your product's capabilities.",
  },
  {
    category: "Review Presence",
    priority: "medium",
    recommendation: "Build presence on review platforms (G2, Capterra, TrustPilot)",
    details:
      "AI models synthesize review data to form opinions. Strong ratings and detailed reviews on major platforms positively influence AI-generated recommendations.",
  },
  {
    category: "Community Engagement",
    priority: "medium",
    recommendation: "Be active in relevant communities (Reddit, Stack Overflow, Hacker News)",
    details:
      "AI models train on community discussions. Genuine, helpful participation by your team creates positive brand associations in training data.",
  },
  {
    category: "PR & Media",
    priority: "low",
    recommendation: "Get featured in authoritative publications and industry blogs",
    details:
      "Mentions in reputable media outlets (TechCrunch, Wired, industry-specific publications) carry significant weight in AI training data.",
  },
  {
    category: "Social Proof",
    priority: "low",
    recommendation: "Showcase case studies and customer testimonials prominently",
    details:
      "Detailed case studies with real metrics give AI models concrete evidence of your brand's value, leading to more positive AI-generated descriptions.",
  },
  {
    category: "API & Integrations",
    priority: "low",
    recommendation: "Develop and document public APIs and integrations",
    details:
      "Brands with well-documented APIs appear more frequently in technical AI conversations. Integration listings on partner sites also boost visibility.",
  },
  {
    category: "Content Freshness",
    priority: "high",
    recommendation: "Regularly update your website content and blog",
    details:
      "AI platforms with web access prioritize fresh content. Maintain an active blog, update product pages, and keep pricing current to stay visible.",
  },
];

// ─── Utility Functions ───────────────────────────────────────────────────────

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
  if (keywordStr.match(/hosting|cloud|server|deploy/))
    return COMPETITOR_POOLS.hosting;
  if (keywordStr.match(/design|ui|ux|prototype|graphic/))
    return COMPETITOR_POOLS.design;
  return COMPETITOR_POOLS.default;
}

function generateQueries(
  brand: string,
  keywords: string[],
  count: number = 5,
  rng: () => number
): string[] {
  const allQueries: string[] = [];

  for (const template of QUERY_TEMPLATES) {
    if (template.includes("{keyword}")) {
      for (const keyword of keywords.length > 0 ? keywords : ["software"]) {
        allQueries.push(
          template.replace(/{brand}/g, brand).replace(/{keyword}/g, keyword)
        );
      }
    } else {
      allQueries.push(template.replace(/{brand}/g, brand));
    }
  }

  // Shuffle and pick requested count
  const shuffled = [...allQueries].sort(() => rng() - 0.5);
  return shuffled.slice(0, count);
}

function simulateCheck(
  brand: string,
  query: string,
  platform: string,
  keywords: string[],
  rng: () => number
): CheckResult {
  const brandLower = brand.toLowerCase();
  const queryLower = query.toLowerCase();

  // Platform-specific base mention probability
  const platformBias: Record<string, number> = {
    chatgpt: 0.55,
    perplexity: 0.65,
    claude: 0.50,
    gemini: 0.60,
  };

  // Well-known brands get a significant boost
  const knownBoost = WELL_KNOWN_BRANDS.has(brandLower) ? 0.25 : 0;

  // Query type affects mention probability
  let mentionBoost = 0;
  if (queryLower.includes(brandLower)) {
    mentionBoost = 0.3;
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
  const totalProbability = Math.min(
    baseProbability + mentionBoost + knownBoost,
    0.95
  );
  const mentioned = rng() < totalProbability;

  // Get competitors
  const competitorPool = getCompetitorPool(keywords).filter(
    (c) => c.toLowerCase() !== brandLower
  );
  const numCompetitors = Math.floor(rng() * 4) + 2;
  const competitors = pickMultiple(competitorPool, numCompetitors, rng);

  const keyword =
    keywords.length > 0 ? pickRandom(keywords, rng) : "software";

  if (mentioned) {
    const sentimentRoll = rng();
    let sentiment: "positive" | "neutral" | "negative";
    if (WELL_KNOWN_BRANDS.has(brandLower)) {
      // Known brands skew more positive
      if (sentimentRoll < 0.6) sentiment = "positive";
      else if (sentimentRoll < 0.85) sentiment = "neutral";
      else sentiment = "negative";
    } else {
      if (sentimentRoll < 0.45) sentiment = "positive";
      else if (sentimentRoll < 0.80) sentiment = "neutral";
      else sentiment = "negative";
    }

    const templates = SENTIMENT_TEMPLATES[sentiment];
    const template = pickRandom(templates, rng);
    const mainText = template
      .replace(/{brand}/g, brand)
      .replace(/{keyword}/g, keyword);

    const position =
      rng() < 0.4 ? 1 : rng() < 0.7 ? 2 : Math.floor(rng() * 3) + 3;

    // Extract context snippet
    const brandIndex = mainText.indexOf(brand);
    const contextStart = Math.max(0, brandIndex - 50);
    const contextEnd = Math.min(
      mainText.length,
      brandIndex + brand.length + 80
    );
    const context =
      (contextStart > 0 ? "..." : "") +
      mainText.slice(contextStart, contextEnd) +
      (contextEnd < mainText.length ? "..." : "");

    return {
      mentioned: true,
      position,
      context,
      sentiment,
      competitors,
    };
  } else {
    const template = pickRandom(NOT_MENTIONED_TEMPLATES, rng);
    const competitorList = competitors.slice(0, 4).join(", ");
    const context = template
      .replace(/{keyword}/g, keyword)
      .replace(/{competitors}/g, competitorList)
      .replace(/{brand}/g, brand);

    return {
      mentioned: false,
      position: null,
      context,
      sentiment: "neutral",
      competitors,
    };
  }
}

function calculateScore(results: PlatformResult[]): number {
  if (results.length === 0) return 0;

  let totalScore = 0;

  for (const platform of results) {
    // Mention rate contributes 40% of platform score
    const mentionScore = platform.mentionRate * 40;

    // Position contributes 30% (lower is better, scale 1-5 to 0-30)
    const positionScore = platform.averagePosition
      ? Math.max(0, (6 - platform.averagePosition) / 5) * 30
      : 0;

    // Sentiment contributes 30%
    const totalSentiment =
      platform.sentimentBreakdown.positive +
      platform.sentimentBreakdown.neutral +
      platform.sentimentBreakdown.negative;
    const sentimentScore =
      totalSentiment > 0
        ? ((platform.sentimentBreakdown.positive * 1.0 +
            platform.sentimentBreakdown.neutral * 0.5 +
            platform.sentimentBreakdown.negative * 0.1) /
            totalSentiment) *
          30
        : 0;

    totalScore += mentionScore + positionScore + sentimentScore;
  }

  return Math.round(totalScore / results.length);
}

function aggregatePlatformResult(
  platform: string,
  queryResults: QueryResult[]
): PlatformResult {
  const platformInfo = PLATFORMS.find((p) => p.id === platform)!;
  const mentioned = queryResults.filter((q) => q.mentioned);
  const mentionRate =
    queryResults.length > 0 ? mentioned.length / queryResults.length : 0;

  const positions = mentioned
    .map((q) => q.position)
    .filter((p): p is number => p !== null);
  const averagePosition =
    positions.length > 0
      ? Math.round(
          (positions.reduce((a, b) => a + b, 0) / positions.length) * 10
        ) / 10
      : null;

  const sentimentBreakdown = { positive: 0, neutral: 0, negative: 0 };
  for (const q of mentioned) {
    sentimentBreakdown[q.sentiment]++;
  }

  // Aggregate competitors
  const competitorCounts = new Map<string, number>();
  for (const q of queryResults) {
    for (const c of q.competitors) {
      competitorCounts.set(c, (competitorCounts.get(c) || 0) + 1);
    }
  }
  const topCompetitors = [...competitorCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name]) => name);

  return {
    platform,
    platformName: platformInfo.name,
    queries: queryResults,
    mentionRate: Math.round(mentionRate * 100) / 100,
    averagePosition,
    sentimentBreakdown,
    topCompetitors,
  };
}

// ─── MCP Server ──────────────────────────────────────────────────────────────

const server = new McpServer({
  name: "ai-visibility",
  version: "1.0.0",
});

// Tool: check_brand_visibility
server.tool(
  "check_brand_visibility",
  "Check a brand's visibility across AI platforms (ChatGPT, Perplexity, Claude, Gemini). Simulates realistic queries and analyzes mention rates, positions, sentiment, and competitor landscape.",
  {
    brand: z.string().describe("The brand name to check visibility for"),
    keywords: z
      .array(z.string())
      .optional()
      .describe(
        "Industry keywords related to the brand (e.g., ['SEO', 'analytics']). Used to generate relevant queries."
      ),
    platforms: z
      .array(z.enum(["chatgpt", "perplexity", "claude", "gemini"]))
      .optional()
      .describe(
        "Which AI platforms to check. Defaults to all four platforms."
      ),
  },
  async ({ brand, keywords, platforms }) => {
    const targetPlatforms = platforms || PLATFORM_IDS;
    const effectiveKeywords = keywords || [];
    const timeBucket = Math.floor(Date.now() / 3600000);
    const results: PlatformResult[] = [];

    for (const platformId of targetPlatforms) {
      const rng = seededRandom(`${brand}-${platformId}-${timeBucket}`);
      const queries = generateQueries(brand, effectiveKeywords, 5, rng);
      const queryResults: QueryResult[] = [];

      for (const query of queries) {
        const queryRng = seededRandom(
          `${brand}-${query}-${platformId}-${timeBucket}`
        );
        const result = simulateCheck(
          brand,
          query,
          platformId,
          effectiveKeywords,
          queryRng
        );
        queryResults.push({
          query,
          ...result,
        });
      }

      results.push(aggregatePlatformResult(platformId, queryResults));
    }

    const overallScore = calculateScore(results);

    const output = {
      brand,
      keywords: effectiveKeywords,
      overallScore,
      platformResults: results,
      checkedAt: new Date().toISOString(),
      note: "Results are simulated for demonstration. Connect real AI platform APIs for production data.",
    };

    return {
      content: [
        {
          type: "text" as const,
          text: JSON.stringify(output, null, 2),
        },
      ],
    };
  }
);

// Tool: check_single_query
server.tool(
  "check_single_query",
  "Check if a brand is mentioned for a specific query on a specific AI platform. Returns mention status, position, context snippet, sentiment, and competitor mentions.",
  {
    brand: z.string().describe("The brand name to check"),
    query: z
      .string()
      .describe(
        "The exact query to check (e.g., 'What are the best SEO tools?')"
      ),
    platform: z
      .enum(["chatgpt", "perplexity", "claude", "gemini"])
      .describe("The AI platform to check on"),
  },
  async ({ brand, query, platform }) => {
    const timeBucket = Math.floor(Date.now() / 3600000);
    const rng = seededRandom(`${brand}-${query}-${platform}-${timeBucket}`);

    // Infer keywords from query
    const queryWords = query
      .toLowerCase()
      .split(/\s+/)
      .filter((w: string) => w.length > 3);
    const result = simulateCheck(brand, query, platform, queryWords, rng);

    const platformInfo = PLATFORMS.find((p) => p.id === platform)!;

    const output = {
      brand,
      query,
      platform: platformInfo.name,
      mentioned: result.mentioned,
      position: result.position,
      context: result.context,
      sentiment: result.sentiment,
      competitorsFound: result.competitors,
      checkedAt: new Date().toISOString(),
      note: "Result is simulated for demonstration. Connect real AI platform APIs for production data.",
    };

    return {
      content: [
        {
          type: "text" as const,
          text: JSON.stringify(output, null, 2),
        },
      ],
    };
  }
);

// Tool: get_visibility_score
server.tool(
  "get_visibility_score",
  "Calculate an overall AI visibility score (0-100) for a brand across all four AI platforms. Includes per-platform breakdowns and improvement recommendations.",
  {
    brand: z.string().describe("The brand name to score"),
  },
  async ({ brand }) => {
    const timeBucket = Math.floor(Date.now() / 3600000);
    const results: PlatformResult[] = [];

    for (const platformId of PLATFORM_IDS) {
      const rng = seededRandom(`${brand}-score-${platformId}-${timeBucket}`);
      const queries = generateQueries(brand, [], 3, rng);
      const queryResults: QueryResult[] = [];

      for (const query of queries) {
        const queryRng = seededRandom(
          `${brand}-score-${query}-${platformId}-${timeBucket}`
        );
        const result = simulateCheck(brand, query, platformId, [], queryRng);
        queryResults.push({ query, ...result });
      }

      results.push(aggregatePlatformResult(platformId, queryResults));
    }

    const overallScore = calculateScore(results);

    // Generate tier
    let tier: string;
    let tierDescription: string;
    if (overallScore >= 80) {
      tier = "Excellent";
      tierDescription =
        "Your brand has strong visibility across AI platforms. Focus on maintaining and expanding your presence.";
    } else if (overallScore >= 60) {
      tier = "Good";
      tierDescription =
        "Your brand is visible on most platforms but has room for improvement. Targeted optimization can boost your score.";
    } else if (overallScore >= 40) {
      tier = "Moderate";
      tierDescription =
        "Your brand appears in some AI responses but is missing from many. Significant optimization opportunities exist.";
    } else if (overallScore >= 20) {
      tier = "Low";
      tierDescription =
        "Your brand has limited AI visibility. A comprehensive strategy is needed to improve presence across platforms.";
    } else {
      tier = "Very Low";
      tierDescription =
        "Your brand is rarely mentioned by AI platforms. Immediate action is recommended to establish AI visibility.";
    }

    const platformScores = results.map((r) => ({
      platform: r.platformName,
      score: calculateScore([r]),
      mentionRate: `${Math.round(r.mentionRate * 100)}%`,
      averagePosition: r.averagePosition,
      topSentiment:
        r.sentimentBreakdown.positive >= r.sentimentBreakdown.neutral &&
        r.sentimentBreakdown.positive >= r.sentimentBreakdown.negative
          ? "positive"
          : r.sentimentBreakdown.neutral >= r.sentimentBreakdown.negative
          ? "neutral"
          : "negative",
    }));

    // Select relevant recommendations based on score
    const numRecs = overallScore >= 60 ? 4 : overallScore >= 30 ? 6 : 8;
    const rng = seededRandom(`${brand}-recs-${timeBucket}`);
    const selectedRecs = pickMultiple(RECOMMENDATIONS, numRecs, rng).map(
      (r) => ({
        ...r,
        recommendation: r.recommendation.replace(/{brand}/g, brand),
        details: r.details.replace(/{brand}/g, brand),
      })
    );

    const output = {
      brand,
      overallScore,
      tier,
      tierDescription,
      platformScores,
      recommendations: selectedRecs,
      checkedAt: new Date().toISOString(),
      note: "Score is based on simulated data for demonstration. Connect real AI platform APIs for production scoring.",
    };

    return {
      content: [
        {
          type: "text" as const,
          text: JSON.stringify(output, null, 2),
        },
      ],
    };
  }
);

// Tool: compare_brands
server.tool(
  "compare_brands",
  "Compare the AI visibility of multiple brands side by side. Shows per-platform scores, overall rankings, and relative strengths.",
  {
    brands: z
      .array(z.string())
      .min(2)
      .max(10)
      .describe("List of brand names to compare (2-10 brands)"),
    keyword: z
      .string()
      .optional()
      .describe(
        "Optional industry keyword for context (e.g., 'project management')"
      ),
  },
  async ({ brands, keyword }) => {
    const timeBucket = Math.floor(Date.now() / 3600000);
    const keywords = keyword ? [keyword] : [];
    const brandResults: Array<{
      brand: string;
      overallScore: number;
      platformScores: Record<string, number>;
      mentionRates: Record<string, number>;
      topSentiment: string;
    }> = [];

    for (const brand of brands) {
      const platformResults: PlatformResult[] = [];

      for (const platformId of PLATFORM_IDS) {
        const rng = seededRandom(
          `${brand}-compare-${platformId}-${timeBucket}`
        );
        const queries = generateQueries(brand, keywords, 3, rng);
        const queryResults: QueryResult[] = [];

        for (const query of queries) {
          const queryRng = seededRandom(
            `${brand}-compare-${query}-${platformId}-${timeBucket}`
          );
          const result = simulateCheck(
            brand,
            query,
            platformId,
            keywords,
            queryRng
          );
          queryResults.push({ query, ...result });
        }

        platformResults.push(
          aggregatePlatformResult(platformId, queryResults)
        );
      }

      const overallScore = calculateScore(platformResults);

      const platformScores: Record<string, number> = {};
      const mentionRates: Record<string, number> = {};
      let totalPositive = 0;
      let totalNeutral = 0;
      let totalNegative = 0;

      for (const pr of platformResults) {
        platformScores[pr.platformName] = calculateScore([pr]);
        mentionRates[pr.platformName] =
          Math.round(pr.mentionRate * 100);
        totalPositive += pr.sentimentBreakdown.positive;
        totalNeutral += pr.sentimentBreakdown.neutral;
        totalNegative += pr.sentimentBreakdown.negative;
      }

      const topSentiment =
        totalPositive >= totalNeutral && totalPositive >= totalNegative
          ? "positive"
          : totalNeutral >= totalNegative
          ? "neutral"
          : "negative";

      brandResults.push({
        brand,
        overallScore,
        platformScores,
        mentionRates,
        topSentiment,
      });
    }

    // Sort by overall score
    brandResults.sort((a, b) => b.overallScore - a.overallScore);

    const ranking = brandResults.map((br, index) => ({
      rank: index + 1,
      brand: br.brand,
      overallScore: br.overallScore,
      platformScores: br.platformScores,
      mentionRates: br.mentionRates,
      dominantSentiment: br.topSentiment,
    }));

    const output = {
      keyword: keyword || "(general)",
      platformsChecked: PLATFORMS.map((p) => p.name),
      ranking,
      checkedAt: new Date().toISOString(),
      note: "Comparison is based on simulated data for demonstration. Connect real AI platform APIs for production comparisons.",
    };

    return {
      content: [
        {
          type: "text" as const,
          text: JSON.stringify(output, null, 2),
        },
      ],
    };
  }
);

// Tool: get_recommendations
server.tool(
  "get_recommendations",
  "Get actionable recommendations to improve a brand's AI visibility. Prioritized suggestions based on current score and industry best practices.",
  {
    brand: z.string().describe("The brand name to get recommendations for"),
    current_score: z
      .number()
      .min(0)
      .max(100)
      .optional()
      .describe(
        "Current visibility score (0-100) if known. If not provided, a quick check will be performed."
      ),
  },
  async ({ brand, current_score }) => {
    let score = current_score;

    // If no score provided, do a quick check
    if (score === undefined) {
      const timeBucket = Math.floor(Date.now() / 3600000);
      const results: PlatformResult[] = [];

      for (const platformId of PLATFORM_IDS) {
        const rng = seededRandom(
          `${brand}-recscore-${platformId}-${timeBucket}`
        );
        const queries = generateQueries(brand, [], 2, rng);
        const queryResults: QueryResult[] = [];

        for (const query of queries) {
          const queryRng = seededRandom(
            `${brand}-recscore-${query}-${platformId}-${timeBucket}`
          );
          const result = simulateCheck(
            brand,
            query,
            platformId,
            [],
            queryRng
          );
          queryResults.push({ query, ...result });
        }

        results.push(aggregatePlatformResult(platformId, queryResults));
      }

      score = calculateScore(results);
    }

    // Select and prioritize recommendations
    const allRecs = RECOMMENDATIONS.map((r) => ({
      ...r,
      recommendation: r.recommendation.replace(/{brand}/g, brand),
      details: r.details.replace(/{brand}/g, brand),
    }));

    // More recommendations for lower scores
    let selectedRecs;
    if (score >= 70) {
      selectedRecs = allRecs.filter(
        (r) => r.priority === "low" || r.priority === "medium"
      );
    } else if (score >= 40) {
      selectedRecs = allRecs;
    } else {
      // Low score: prioritize high-priority items first
      selectedRecs = [
        ...allRecs.filter((r) => r.priority === "high"),
        ...allRecs.filter((r) => r.priority === "medium"),
        ...allRecs.filter((r) => r.priority === "low"),
      ];
    }

    const output = {
      brand,
      currentScore: score,
      totalRecommendations: selectedRecs.length,
      recommendations: selectedRecs.map((r, i) => ({
        number: i + 1,
        priority: r.priority,
        category: r.category,
        recommendation: r.recommendation,
        details: r.details,
      })),
      summary:
        score >= 70
          ? `${brand} has good AI visibility. Focus on advanced strategies to maintain and extend your lead.`
          : score >= 40
          ? `${brand} has moderate AI visibility. Implementing these recommendations can significantly improve your presence across AI platforms.`
          : `${brand} has low AI visibility. Start with the high-priority recommendations to establish a strong foundation.`,
    };

    return {
      content: [
        {
          type: "text" as const,
          text: JSON.stringify(output, null, 2),
        },
      ],
    };
  }
);

// Tool: list_platforms
server.tool(
  "list_platforms",
  "List all supported AI platforms with details about how each sources and presents brand information.",
  {},
  async () => {
    const output = {
      platforms: PLATFORMS.map((p) => ({
        id: p.id,
        name: p.name,
        company: p.company,
        description: p.description,
        sourceMethod: p.sourceMethod,
      })),
      totalPlatforms: PLATFORMS.length,
      note: "These are the AI platforms tracked by the AI Visibility tool. Each platform has different methods for sourcing brand information, which affects visibility strategies.",
    };

    return {
      content: [
        {
          type: "text" as const,
          text: JSON.stringify(output, null, 2),
        },
      ],
    };
  }
);

// ─── Start Server ────────────────────────────────────────────────────────────

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("AI Visibility MCP server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
