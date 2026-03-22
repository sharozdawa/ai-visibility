<p align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=0:4F46E5,100:7C3AED&height=220&section=header&text=AI%20Visibility%20Tracker&fontSize=42&fontColor=ffffff&animation=fadeIn&fontAlignY=35&desc=Track%20your%20brand%20across%20ChatGPT%2C%20Perplexity%2C%20Claude%20%26%20Gemini&descSize=18&descAlignY=55" width="100%" />
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/ai-visibility-mcp"><img src="https://img.shields.io/npm/v/ai-visibility-mcp?style=flat-square&color=4F46E5" alt="npm version" /></a>
  <a href="https://github.com/sharozdawa/ai-visibility/stargazers"><img src="https://img.shields.io/github/stars/sharozdawa/ai-visibility?style=flat-square&color=7C3AED" alt="GitHub stars" /></a>
  <a href="https://github.com/sharozdawa/ai-visibility/blob/main/LICENSE"><img src="https://img.shields.io/github/license/sharozdawa/ai-visibility?style=flat-square&color=6366F1" alt="License" /></a>
  <a href="https://github.com/sharozdawa/ai-visibility/pulls"><img src="https://img.shields.io/badge/PRs-welcome-brightgreen?style=flat-square" alt="PRs Welcome" /></a>
  <a href="https://glama.ai/mcp/servers/sharozdawa/ai-visibility"><img src="https://glama.ai/mcp/servers/sharozdawa/ai-visibility/badges/score.svg" alt="AI Visibility MCP server" /></a>
</p>

<p align="center">
  <strong>Know exactly how AI platforms talk about your brand.</strong><br/>
  Track mentions, sentiment, position, and competitors across the AI platforms that shape buying decisions.
</p>

---

## Features

- **Multi-Platform Tracking** — Monitor visibility across ChatGPT, Perplexity, Claude, and Gemini simultaneously
- **Visibility Scoring** — Get a 0-100 score with tier ratings (Excellent / Good / Moderate / Low / Very Low)
- **Sentiment Analysis** — Understand whether AI platforms describe your brand positively, neutrally, or negatively
- **Competitor Intelligence** — See which competitors appear alongside your brand in AI responses
- **Brand Comparison** — Compare up to 10 brands side by side with per-platform breakdowns
- **Actionable Recommendations** — Get prioritized steps to improve your AI visibility
- **MCP Server** — Works with Claude Desktop, Cursor, and any MCP-compatible client
- **Consistent Results** — Seeded randomness ensures reproducible results for the same brand

## MCP Server Installation

### Claude Desktop

Add to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "ai-visibility": {
      "command": "npx",
      "args": ["-y", "ai-visibility-mcp"]
    }
  }
}
```

### Cursor

Add to your Cursor MCP settings (`.cursor/mcp.json`):

```json
{
  "mcpServers": {
    "ai-visibility": {
      "command": "npx",
      "args": ["-y", "ai-visibility-mcp"]
    }
  }
}
```

### npx (standalone)

```bash
npx ai-visibility-mcp
```

## MCP Tools

| Tool | Description |
|------|-------------|
| `check_brand_visibility` | Check a brand's visibility across AI platforms with detailed per-platform results, mention rates, positions, sentiment, and competitor analysis |
| `check_single_query` | Check brand mention for a specific query on a specific platform — get mention status, position, context snippet, and sentiment |
| `get_visibility_score` | Calculate overall AI visibility score (0-100) with tier rating, per-platform breakdowns, and improvement recommendations |
| `compare_brands` | Compare visibility of 2-10 brands side by side with ranked results and per-platform scores |
| `get_recommendations` | Get prioritized, actionable recommendations to improve AI visibility based on current score |
| `list_platforms` | List all supported AI platforms with details on how each sources and presents brand information |

## How Scoring Works

The visibility score (0-100) is calculated from three components:

| Component | Weight | What It Measures |
|-----------|--------|-----------------|
| Mention Rate | 40% | How often the brand appears in AI responses |
| Position Quality | 30% | Where the brand is mentioned (1st = best, 5th = worst) |
| Sentiment | 30% | Whether mentions are positive, neutral, or negative |

**Score Tiers:**
- **80-100** Excellent — Strong presence across platforms
- **60-79** Good — Visible but room to improve
- **40-59** Moderate — Appears in some responses
- **20-39** Low — Limited visibility
- **0-19** Very Low — Rarely mentioned

## Self-Hosting

Clone the repo and build the MCP server:

```bash
git clone https://github.com/sharozdawa/ai-visibility.git
cd ai-visibility/mcp-server
npm install
npm run build
```

Run the MCP server directly:

```bash
node dist/index.js
```

Or point your MCP client to the local build:

```json
{
  "mcpServers": {
    "ai-visibility": {
      "command": "node",
      "args": ["/path/to/ai-visibility/mcp-server/dist/index.js"]
    }
  }
}
```

### Run the Web Dashboard

The project includes a Next.js dashboard for visual tracking:

```bash
cd ai-visibility
cp .env.example .env
# Set your DATABASE_URL in .env
npm install
npx prisma db push
npm run dev
```

## Platforms Tracked

| Platform | Company | How It Sources Information |
|----------|---------|--------------------------|
| ChatGPT | OpenAI | Trained on web data; optional web browsing for real-time info |
| Perplexity | Perplexity AI | Real-time web search with source citations |
| Claude | Anthropic | Trained on web data; focuses on accurate, well-reasoned responses |
| Gemini | Google | Leverages Google Search index and Knowledge Graph |

## Why AI Visibility vs Paid Alternatives

| Feature | ai-visibility | Otterly | AthenaHQ |
|---------|--------------|---------|----------|
| Platforms tracked | 4 | 3 | 2 |
| Visibility score | Yes | Yes | Yes |
| Competitor analysis | Yes | Yes | Limited |
| Sentiment analysis | Yes | No | No |
| Self-hostable | Yes | No | No |
| Open source | Yes | No | No |
| Price | Free | $100-300/mo | $200-500/mo |

## More Open Source SEO Tools

| Tool | Description |
|------|-------------|
| [awesome-seo-mcp-servers](https://github.com/sharozdawa/awesome-seo-mcp-servers) | Curated list of SEO MCP servers and agent skills |
| [robotstxt-ai](https://github.com/sharozdawa/robotstxt-ai) | Visual robots.txt manager for AI crawlers |
| [indexnow-mcp](https://github.com/sharozdawa/indexnow-mcp) | Instant URL indexing via IndexNow |
| [schema-gen](https://github.com/sharozdawa/schema-gen) | Schema.org JSON-LD markup generator |

## License

MIT

---

<p align="center">
  Built by <a href="https://github.com/sharozdawa"><strong>Sharoz Dawa</strong></a>
  <br/>
  <a href="https://github.com/sharozdawa"><img src="https://img.shields.io/badge/GitHub-sharozdawa-181717?style=flat-square&logo=github" alt="GitHub" /></a>
</p>

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:4F46E5,100:7C3AED&height=120&section=footer" width="100%" />
