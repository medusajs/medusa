import React from "react"
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest"
import { render, waitFor } from "@testing-library/react"

vi.mock("@/providers/SiteConfig", () => ({
  useSiteConfig: () => ({
    config: { baseUrl: "https://docs.medusajs.com" },
  }),
}))

const track = vi.fn()
vi.mock("@/providers/Analytics", () => ({
  useAnalytics: () => ({ track }),
}))

import { WebMcpTools } from "../../WebMcpTools"

type RegisteredTool = {
  name: string
  execute: (input: Record<string, unknown>) => Promise<{
    content: { text: string }[]
    isError?: boolean
  }>
}

const registerTool = vi.fn()
const fetchMock = vi.fn()

const getTool = (name: string) =>
  registerTool.mock.calls
    .map(([tool]) => tool as RegisteredTool)
    .find((tool) => tool.name === name)!

beforeEach(() => {
  Object.defineProperty(document, "modelContext", {
    value: { registerTool },
    configurable: true,
  })
  vi.stubGlobal("fetch", fetchMock)
  fetchMock.mockResolvedValue({
    ok: true,
    text: async () => "# Page",
  })
})

afterEach(() => {
  delete (document as Document & { modelContext?: unknown }).modelContext
  vi.unstubAllGlobals()
  vi.clearAllMocks()
})

describe("registration", () => {
  test("registers the docs tools", async () => {
    render(<WebMcpTools />)
    await waitFor(() => expect(registerTool).toHaveBeenCalledTimes(3))
    expect(registerTool.mock.calls.map(([tool]) => tool.name)).toEqual([
      "search_medusa_docs",
      "get_medusa_docs_page",
      "navigate_medusa_docs",
    ])
  })

  test("doesn't register tools without WebMCP support", () => {
    delete (document as Document & { modelContext?: unknown }).modelContext
    render(<WebMcpTools />)
    expect(registerTool).not.toHaveBeenCalled()
  })

  test("unregisters tools on unmount", async () => {
    const { unmount } = render(<WebMcpTools />)
    await waitFor(() => expect(registerTool).toHaveBeenCalled())
    const { signal } = registerTool.mock.calls[0][1]
    unmount()
    expect(signal.aborted).toBe(true)
  })
})

describe("tools", () => {
  test("search_medusa_docs calls the retrieval endpoint", async () => {
    render(<WebMcpTools />)
    await waitFor(() => expect(registerTool).toHaveBeenCalledTimes(3))
    await getTool("search_medusa_docs").execute({
      query: "workflows",
      limit: 3,
    })
    expect(fetchMock).toHaveBeenCalledWith(
      "https://docs.medusajs.com/agents/search?q=workflows&source=docs-webmcp&limit=3",
      { headers: { accept: "text/markdown" } }
    )
  })

  test("get_medusa_docs_page fetches the page's Markdown", async () => {
    render(<WebMcpTools />)
    await waitFor(() => expect(registerTool).toHaveBeenCalledTimes(3))
    const result = await getTool("get_medusa_docs_page").execute({
      url: "https://docs.medusajs.com/learn/fundamentals/workflows/",
    })
    expect(fetchMock).toHaveBeenCalledWith(
      "https://docs.medusajs.com/learn/fundamentals/workflows.md",
      expect.anything()
    )
    expect(result.content[0].text).toBe("# Page")
  })

  test("get_medusa_docs_page rejects URLs outside the docs", async () => {
    render(<WebMcpTools />)
    await waitFor(() => expect(registerTool).toHaveBeenCalledTimes(3))
    const result = await getTool("get_medusa_docs_page").execute({
      url: "https://example.com/page",
    })
    expect(result.isError).toBe(true)
    expect(fetchMock).not.toHaveBeenCalled()
  })

  test("navigate_medusa_docs rejects URLs outside the docs", async () => {
    const assign = vi.fn()
    vi.stubGlobal("location", { ...window.location, assign })
    render(<WebMcpTools />)
    await waitFor(() => expect(registerTool).toHaveBeenCalledTimes(3))
    const result = await getTool("navigate_medusa_docs").execute({
      url: "//example.com/page",
    })
    expect(result.isError).toBe(true)
    expect(assign).not.toHaveBeenCalled()
  })

  test("tracks tool calls", async () => {
    render(<WebMcpTools />)
    await waitFor(() => expect(registerTool).toHaveBeenCalledTimes(3))
    await getTool("search_medusa_docs").execute({ query: "workflows" })
    expect(track).toHaveBeenCalledWith({
      event: {
        event: "webmcp_tool_call",
        options: expect.objectContaining({
          tool: "search_medusa_docs",
          input: JSON.stringify({ query: "workflows" }),
          is_error: false,
        }),
      },
    })
  })
})
