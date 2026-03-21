# AI Visibility MCP Server

MCP server for tracking brand visibility across AI platforms — ChatGPT, Perplexity, Claude, and Gemini.

## Installation

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

Add to your Cursor MCP settings:

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

### Manual / npx

```bash
npx ai-visibility-mcp
```

### Build from source

```bash
cd mcp-server
npm install
npm run build
node dist/index.js
```

## Tools

| Tool | Description |
|------|-------------|
| `check_brand_visibility` | Check a brand's visibility across AI platforms with detailed per-platform results |
| `check_single_query` | Check brand mention for a specific query on a specific platform |
| `get_visibility_score` | Calculate overall AI visibility score (0-100) with tier rating |
| `compare_brands` | Compare visibility of multiple brands side by side |
| `get_recommendations` | Get prioritized recommendations to improve AI visibility |
| `list_platforms` | List all supported AI platforms with sourcing details |

## Example Usage

### Check brand visibility

```
Check the AI visibility of "Ahrefs" with keywords ["SEO", "backlinks"]
```

Returns per-platform mention rates, positions, sentiment breakdown, and competitor landscape.

### Get visibility score

```
What's the AI visibility score for "HubSpot"?
```

Returns a 0-100 score with tier rating (Excellent/Good/Moderate/Low/Very Low) and recommendations.

### Compare brands

```
Compare the AI visibility of "Ahrefs", "SEMrush", and "Moz" for the keyword "SEO"
```

Returns a ranked comparison table with per-platform scores.

### Check specific query

```
Check if "Notion" is mentioned when asking ChatGPT "What are the best project management tools?"
```

Returns mention status, position, context snippet, sentiment, and competitors.

### Get recommendations

```
How can "MyStartup" improve its AI visibility?
```

Returns prioritized, actionable recommendations based on the brand's current score.

## How It Works

The server simulates realistic AI platform responses using:

- **Seeded randomness** — Results are consistent for the same brand within a time window
- **Platform-specific biases** — Perplexity cites more sources, ChatGPT has moderate mention rates
- **Brand recognition** — Well-known brands get higher visibility scores
- **Query-type awareness** — Direct brand queries yield higher mention rates than generic ones
- **Industry-aware competitors** — Competitor pools match the brand's industry vertical

For production use, replace the simulation layer with real API calls to each platform.

## License

MIT
