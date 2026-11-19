const AGENT_PATTERNS: [RegExp, string][] = [
  [/claude-code/i, "Claude Code"],
  [/Claude-User/i, "Claude"],
  [/Claude-SearchBot/i, "Claude-SearchBot"],
  [/ClaudeBot/i, "ClaudeBot"],
  [/ChatGPT-User/i, "ChatGPT"],
  [/OAI-SearchBot/i, "OAI-SearchBot"],
  [/GPTBot/i, "GPTBot"],
  [/codex/i, "Codex"],
  [/Cursor/i, "Cursor"],
  [/Windsurf|Codeium/i, "Windsurf"],
  [/Copilot/i, "GitHub Copilot"],
  [/Gemini|Google-Extended/i, "Gemini"],
  [/Perplexity/i, "Perplexity"],
  [/Devin/i, "Devin"],
  [/Bytespider/i, "Bytespider"],
  [/^curl\//i, "curl"],
  [/python-requests|python-httpx|aiohttp/i, "Python HTTP client"],
  [/node-fetch|undici|axios|^node$/i, "Node.js HTTP client"],
  [/Go-http-client/i, "Go HTTP client"],
  [/Mozilla\//i, "Browser"],
]

/**
 * Returns a readable name for the agent that sent a request, based on its
 * user agent, or `unknown` when it isn't recognized.
 */
export const getAgentName = (userAgent?: string | null) => {
  if (!userAgent) {
    return "unknown"
  }

  return (
    AGENT_PATTERNS.find(([pattern]) => pattern.test(userAgent))?.[1] ??
    "unknown"
  )
}
