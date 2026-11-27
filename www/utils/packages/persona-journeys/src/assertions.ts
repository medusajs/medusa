import type { AssertionValueFunctionContext, GradingResult } from "promptfoo"

type ToolCall = {
  name: string
  input?: { url?: string }
  output?: unknown
}

type Context = AssertionValueFunctionContext & {
  config?: { paths?: string[]; budget?: number }
}

const toolCalls = (context: Context): ToolCall[] =>
  context.providerResponse?.metadata?.toolCalls || []

const outputText = (call: ToolCall) => {
  const output = call.output as
    | string
    | { text?: string }[]
    | { content?: { text?: string }[] }
    | undefined
  if (typeof output === "string") {
    return output
  }
  const items = Array.isArray(output) ? output : output?.content || []
  return items.map((item) => item.text || "").join("\n")
}

const fetchCalls = (context: Context) =>
  toolCalls(context).filter((call) => call.name === "mcp__web__fetch_url")

const pathOf = (url = "") => {
  try {
    return (
      new URL(url, "https://docs.medusajs.com").pathname
        .replace(/\/index(\.html)?\.md$/, "")
        .replace(/\.md$/, "")
        .replace(/\/$/, "") || "/"
    )
  } catch {
    return url
  }
}

const fetchedPaths = (context: Context) =>
  fetchCalls(context).map((call) => pathOf(call.input?.url))

// Playwright MCP prints the current URL in each tool result.
const visitedPaths = (context: Context) =>
  toolCalls(context)
    .filter((call) => call.name.startsWith("mcp__playwright__"))
    .flatMap((call) =>
      [...outputText(call).matchAll(/Page URL: (\S+)/g)].map((match) =>
        pathOf(match[1])
      )
    )
    .filter((path, index, all) => path !== all[index - 1])

const matchesAny = (paths: string[], targets: string[]) =>
  paths.some((path) =>
    targets.some((target) => path === target || path.startsWith(`${target}/`))
  )

const result = (pass: boolean, reason: string): GradingResult => ({
  pass,
  score: pass ? 1 : 0,
  reason,
})

export const fetchedAny = (output: string, context: Context) => {
  const targets = context.config?.paths || []
  const paths = fetchedPaths(context)
  return result(
    matchesAny(paths, targets),
    `Expected a fetch of one of ${targets.join(", ")}. Fetched: ${
      paths.join(", ") || "nothing"
    }`
  )
}

export const usedAgentEntryPoints = (output: string, context: Context) => {
  const entryPoints = ["/SKILL", "/llms.txt", "/agents/search", "/.well-known"]
  const urls = fetchCalls(context).map((call) => call.input?.url || "")
  const used = urls.filter((url) =>
    entryPoints.some((entry) => url.includes(entry))
  )
  return result(
    used.length > 0,
    used.length
      ? `Used agent entry points: ${used.join(", ")}`
      : `No agent entry point used. Fetched: ${urls.join(", ")}`
  )
}

export const gotMarkdown = (output: string, context: Context) => {
  const pages = fetchCalls(context).filter(
    (call) =>
      !/llms\.txt|\/agents\/|\.well-known|\.json/.test(call.input?.url || "")
  )
  const html = pages.filter(
    (call) => !/^HTTP \d+ \(text\/markdown/.test(outputText(call))
  )
  return result(
    pages.length > 0 && html.length === 0,
    `${pages.length - html.length}/${pages.length} page fetches returned Markdown. Not Markdown: ${
      html.map((call) => call.input?.url).join(", ") || "none"
    }`
  )
}

export const noBrokenFetches = (output: string, context: Context) => {
  const broken = fetchCalls(context).filter((call) =>
    /^(HTTP [45]\d\d|Error)/.test(outputText(call))
  )
  return result(
    broken.length === 0,
    broken.length
      ? `Broken fetches: ${broken
          .map(
            (call) => `${call.input?.url} (${outputText(call).split("\n")[0]})`
          )
          .join(", ")}`
      : "All fetches succeeded"
  )
}

export const visitedAny = (output: string, context: Context) => {
  const targets = context.config?.paths || []
  const paths = visitedPaths(context)
  return result(
    matchesAny(paths, targets),
    `Expected to reach one of ${targets.join(", ")}. Path: ${
      paths.join(" -> ") || "nothing"
    }`
  )
}

export const withinPageBudget = (output: string, context: Context) => {
  const paths = visitedPaths(context)
  const budget = context.config?.budget || 1
  return {
    pass: paths.length <= budget,
    score: Math.min(1, budget / Math.max(paths.length, 1)),
    reason: `${paths.length} pages visited (budget ${budget}): ${paths.join(" -> ")}`,
  }
}

export const browsedByClicking = (output: string, context: Context) => {
  const typed = toolCalls(context).filter(
    (call) => call.name === "mcp__playwright__browser_navigate"
  )
  return result(
    typed.length <= 1,
    `${typed.length} typed-URL navigations (only the start page is allowed): ${typed
      .map((call) => call.input?.url)
      .join(", ")}`
  )
}
