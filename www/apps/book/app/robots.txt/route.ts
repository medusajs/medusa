import { config } from "../../config"

const sitemapPaths = ["", "/resources", "/api", "/ui", "/user-guide", "/cloud"]

const aiCrawlers = [
  "OAI-SearchBot",
  "ChatGPT-User",
  "GPTBot",
  "Claude-SearchBot",
  "Claude-User",
  "ClaudeBot",
  "PerplexityBot",
  "Perplexity-User",
  "Google-Extended",
  "Applebot-Extended",
  "CCBot",
]

const groupRules = [
  "Content-Signal: ai-train=yes, search=yes, ai-input=yes",
  "Allow: /",
  "Disallow: /md-content/",
  "Disallow: /llms-content/",
]

const headers = {
  "content-type": "text/plain; charset=utf-8",
  "cache-control": "public, max-age=3600, must-revalidate",
}

const getRobots = () =>
  [
    ["User-agent: *", ...groupRules].join("\n"),
    [...aiCrawlers.map((agent) => `User-agent: ${agent}`), ...groupRules].join(
      "\n"
    ),
    sitemapPaths
      .map((path) => `Sitemap: ${config.baseUrl}${path}/sitemap.xml`)
      .join("\n"),
  ].join("\n\n") + "\n"

export function GET() {
  return new Response(getRobots(), { headers })
}

export function HEAD() {
  return new Response(null, { headers })
}
