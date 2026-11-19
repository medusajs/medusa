"use client"

import { useEffect, useRef } from "react"
import { DocsTrackingEvents } from "../../constants"
import { useAnalytics } from "../../providers/Analytics"
import { useSiteConfig } from "../../providers/SiteConfig"

type ToolResult = {
  content: { type: "text"; text: string }[]
  isError?: boolean
}

type ModelContextTool = {
  name: string
  description: string
  inputSchema: Record<string, unknown>
  annotations?: { readOnlyHint?: boolean }
  execute: (input: Record<string, unknown>) => Promise<ToolResult>
}

type ModelContext = {
  registerTool: (
    tool: ModelContextTool,
    options?: { signal?: AbortSignal }
  ) => Promise<void> | void
}

// The spec moved the API from navigator to document, and browsers ship both.
const getModelContext = () =>
  (document as Document & { modelContext?: ModelContext }).modelContext ??
  (navigator as Navigator & { modelContext?: ModelContext }).modelContext

const textResult = (text: string, isError = false): ToolResult => ({
  content: [{ type: "text", text }],
  isError,
})

const urlInputSchema = {
  type: "object",
  properties: {
    url: {
      type: "string",
      description:
        "The page's URL or path, for example `/learn/fundamentals/workflows`.",
    },
  },
  required: ["url"],
}

export const WebMcpTools = () => {
  const {
    config: { baseUrl },
  } = useSiteConfig()
  const { track } = useAnalytics()
  const trackRef = useRef(track)

  useEffect(() => {
    trackRef.current = track
  }, [track])

  useEffect(() => {
    const modelContext = getModelContext()
    if (!modelContext) {
      return
    }

    const origin = new URL(baseUrl || window.location.origin).origin

    const toDocsUrl = (input: unknown) => {
      if (typeof input !== "string") {
        return null
      }
      try {
        const url = new URL(input, origin)
        return url.origin === origin ? url : null
      } catch {
        return null
      }
    }

    const fetchText = async (url: string) => {
      const res = await fetch(url, { headers: { accept: "text/markdown" } })
      return res.ok
        ? textResult(await res.text())
        : textResult(
            `Request to ${url} failed with status ${res.status}.`,
            true
          )
    }

    const tools: ModelContextTool[] = [
      {
        name: "search_medusa_docs",
        description:
          "Search the Medusa documentation and get the most relevant content for a question, with the URL of each source page.",
        inputSchema: {
          type: "object",
          properties: {
            query: {
              type: "string",
              description: "The question or keywords to search for.",
            },
            limit: {
              type: "number",
              description: "Number of results, from 1 to 15. Defaults to 5.",
            },
          },
          required: ["query"],
        },
        annotations: { readOnlyHint: true },
        execute: async ({ query, limit }) => {
          const params = new URLSearchParams({ q: String(query ?? "") })
          if (limit !== undefined) {
            params.set("limit", String(limit))
          }
          return fetchText(`${origin}/agents/search?${params}`)
        },
      },
      {
        name: "get_medusa_docs_page",
        description:
          "Get the Markdown content of a Medusa documentation page by its URL or path.",
        inputSchema: urlInputSchema,
        annotations: { readOnlyHint: true },
        execute: async ({ url }) => {
          const docsUrl = toDocsUrl(url)
          if (!docsUrl) {
            return textResult(`The URL must be a page under ${origin}.`, true)
          }
          const path = docsUrl.pathname.replace(/(\/|\.md)$/, "")
          return fetchText(`${origin}${path || "/index"}.md`)
        },
      },
      {
        name: "navigate_medusa_docs",
        description:
          "Open a Medusa documentation page in the browser by its URL or path.",
        inputSchema: urlInputSchema,
        execute: async ({ url }) => {
          const docsUrl = toDocsUrl(url)
          if (!docsUrl) {
            return textResult(`The URL must be a page under ${origin}.`, true)
          }
          window.location.assign(docsUrl.href)
          return textResult(`Navigating to ${docsUrl.href}.`)
        },
      },
    ]

    const withTracking = (tool: ModelContextTool): ModelContextTool => ({
      ...tool,
      execute: async (input) => {
        const result = await tool.execute(input)
        trackRef.current({
          event: {
            event: DocsTrackingEvents.WEBMCP_TOOL_CALL,
            options: {
              tool: tool.name,
              input: JSON.stringify(input).slice(0, 500),
              is_error: !!result.isError,
              user_agent: navigator.userAgent,
            },
          },
        })
        return result
      },
    })

    const controller = new AbortController()
    const register = async (tool: ModelContextTool) => {
      try {
        await modelContext.registerTool(withTracking(tool), {
          signal: controller.signal,
        })
      } catch {
        // registration rejects once the signal aborts on unmount
      }
    }
    tools.forEach((tool) => void register(tool))

    return () => controller.abort()
  }, [baseUrl])

  return null
}
