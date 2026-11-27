import { NextRequest, NextResponse } from "next/server"
import { trackAgentRequest } from "./track-agent-request"

const MAX_QUERY_LENGTH = 500
const DEFAULT_LIMIT = 5
const MAX_LIMIT = 15
const MAX_CHARS = 20000

type KapaRetrievalResult = {
  source_url: string
  content: string
}

const corsHeaders = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
}

const errorResponse = (message: string, status: number) =>
  NextResponse.json({ message }, { status, headers: corsHeaders })

const parseLimit = (value: unknown) => {
  const limit = Number(value)
  if (!Number.isInteger(limit) || limit < 1) {
    return DEFAULT_LIMIT
  }
  return Math.min(limit, MAX_LIMIT)
}

const formatMarkdown = (query: string, results: KapaRetrievalResult[]) =>
  [
    `# Medusa documentation results for "${query}"`,
    ...results.map(
      ({ source_url, content }) => `## Source: ${source_url}\n\n${content}`
    ),
  ].join("\n\n---\n\n")

type SearchInput = {
  query?: unknown
  limit?: unknown
  agent?: unknown
  source?: unknown
}

const search = async (
  req: NextRequest,
  query: string,
  limit: number
): Promise<{ res: NextResponse; resultCount?: number }> => {
  if (!query) {
    return { res: errorResponse("The `q` parameter is required.", 400) }
  }

  if (query.length > MAX_QUERY_LENGTH) {
    return {
      res: errorResponse(
        `The query must be at most ${MAX_QUERY_LENGTH} characters.`,
        400
      ),
    }
  }

  const { KAPA_API_KEY, KAPA_PROJECT_ID, NEXT_PUBLIC_INTEGRATION_ID } =
    process.env

  if (!KAPA_API_KEY || !KAPA_PROJECT_ID) {
    return { res: errorResponse("Search is not available.", 503) }
  }

  const kapaRes = await fetch(
    `https://api.kapa.ai/query/v1/projects/${KAPA_PROJECT_ID}/retrieval/`,
    {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": KAPA_API_KEY,
      },
      body: JSON.stringify({
        query,
        integration_id: NEXT_PUBLIC_INTEGRATION_ID || undefined,
        top_k: limit,
        max_chars: MAX_CHARS,
      }),
    }
  )

  if (!kapaRes.ok) {
    return { res: errorResponse("Failed to search the documentation.", 502) }
  }

  const results = (await kapaRes.json()) as KapaRetrievalResult[]

  if ((req.headers.get("accept") || "").includes("text/markdown")) {
    return {
      res: new NextResponse(formatMarkdown(query, results), {
        headers: {
          ...corsHeaders,
          "content-type": "text/markdown; charset=utf-8",
        },
      }),
      resultCount: results.length,
    }
  }

  return {
    res: NextResponse.json(
      {
        query,
        results: results.map(({ source_url, content }) => ({
          url: source_url,
          content,
        })),
      },
      { headers: corsHeaders }
    ),
    resultCount: results.length,
  }
}

type DocsSearchHandlersOptions = {
  /**
   * Overrides the `source` passed in the request when tracking it.
   */
  source?: string
}

/**
 * Creates the route handlers of a docs search endpoint that retrieves the
 * most relevant docs content for a query and tracks the request.
 */
export const createDocsSearchHandlers = ({
  source,
}: DocsSearchHandlersOptions = {}) => {
  const searchAndTrack = async (req: NextRequest, input: SearchInput) => {
    const query = typeof input.query === "string" ? input.query.trim() : ""
    const limit = parseLimit(input.limit)
    const { res, resultCount } = await search(req, query, limit)
    const inputSource = source ?? input.source

    trackAgentRequest(req, "docs_search_requested", {
      query: query.slice(0, MAX_QUERY_LENGTH),
      limit,
      method: req.method,
      status: res.status,
      result_count: resultCount,
      response_format: res.headers.get("content-type")?.split(";")[0],
      reported_agent:
        typeof input.agent === "string" ? input.agent.slice(0, 100) : undefined,
      source:
        typeof inputSource === "string" ? inputSource.slice(0, 100) : undefined,
    })

    return res
  }

  const GET = async (req: NextRequest) => {
    const { searchParams } = new URL(req.url)
    const res = await searchAndTrack(req, {
      query: searchParams.get("q"),
      limit: searchParams.get("limit"),
      agent: searchParams.get("agent"),
      source: searchParams.get("source"),
    })

    if (res.ok) {
      res.headers.set("cache-control", "public, max-age=3600, must-revalidate")
      res.headers.set("vary", "accept")
    }

    return res
  }

  const POST = async (req: NextRequest) => {
    const body: unknown = await req.json().catch(() => null)

    return searchAndTrack(
      req,
      body && typeof body === "object" ? (body as SearchInput) : {}
    )
  }

  const OPTIONS = () =>
    new NextResponse(null, { status: 204, headers: corsHeaders })

  return { GET, POST, OPTIONS }
}
