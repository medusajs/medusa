import readline from "node:readline"
import { DOCS_ORIGIN, replacePreviewHosts, toPreviewUrl } from "./routes.js"

// Minimal stdio MCP server exposing one `fetch_url` tool. Requests to
// docs.medusajs.com are served from the branch previews so the agent sees the
// changes under the production URLs it would normally use.
const MAX_CHARS = 60000

const TOOL = {
  name: "fetch_url",
  description:
    "Fetch a URL from the web and return its content. HTML is returned as plain text. Use this to read websites and documentation.",
  inputSchema: {
    type: "object",
    properties: {
      url: { type: "string", description: "Absolute URL to fetch" },
    },
    required: ["url"],
  },
}

const htmlToText = (html: string) =>
  html
    .replace(/<(script|style|noscript|svg)[\s\S]*?<\/\1>/gi, "")
    .replace(/<a [^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/gi, "[$2]($1)")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/\s{2,}/g, " ")
    .trim()

const fetchUrl = async (url: string, redirects = 0): Promise<string> => {
  const target = toPreviewUrl(url)
  if (!target) {
    return `Error: only ${DOCS_ORIGIN} URLs are reachable in this environment.`
  }
  const res = await fetch(target, {
    headers: { accept: "text/markdown, text/html, */*" },
    redirect: "manual",
  })
  const location = res.headers.get("location")
  if (location && redirects < 5) {
    return fetchUrl(new URL(location, target).href, redirects + 1)
  }
  const type = res.headers.get("content-type") || ""
  let text = replacePreviewHosts(await res.text(), DOCS_ORIGIN)
  if (type.includes("html")) {
    text = htmlToText(text)
  }
  const truncated = text.length > MAX_CHARS
  return `HTTP ${res.status} (${type})\n\n${text.slice(0, MAX_CHARS)}${
    truncated ? `\n\n[truncated at ${MAX_CHARS} characters]` : ""
  }`
}

const send = (msg: object) => process.stdout.write(`${JSON.stringify(msg)}\n`)

readline.createInterface({ input: process.stdin }).on("line", async (line) => {
  const msg = JSON.parse(line)
  const reply = (result: object) => send({ jsonrpc: "2.0", id: msg.id, result })

  switch (msg.method) {
    case "initialize":
      return reply({
        protocolVersion: msg.params?.protocolVersion || "2025-06-18",
        capabilities: { tools: {} },
        serverInfo: { name: "web", version: "1.0.0" },
      })
    case "tools/list":
      return reply({ tools: [TOOL] })
    case "tools/call":
      try {
        const text = await fetchUrl(msg.params.arguments.url)
        return reply({ content: [{ type: "text", text }] })
      } catch (e) {
        return reply({
          content: [{ type: "text", text: `Error: ${(e as Error).message}` }],
          isError: true,
        })
      }
    default:
      if (msg.id !== undefined) {
        send({
          jsonrpc: "2.0",
          id: msg.id,
          error: { code: -32601, message: "Method not found" },
        })
      }
  }
})
