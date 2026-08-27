import {
  DEFAULT_SEARCH_PATH,
  InstantSearchAdapterOptions,
  PUBLISHABLE_KEY_HEADER,
  SearchQuery,
  SearchRequester,
  SearchResult,
} from "./types"

function isAbsoluteUrl(value?: string): boolean {
  return !!value && /^https?:\/\//i.test(value)
}

export function resolveSearchUrl(
  baseUrl: string | undefined,
  path: string
): string {
  if (isAbsoluteUrl(path)) {
    return path
  }
  if (!baseUrl) {
    throw new Error(
      "@medusajs/instantsearch-adapter: `baseUrl` is required when `path` is relative"
    )
  }
  const origin = baseUrl.replace(/\/$/, "")
  const suffix = path.startsWith("/") ? path : `/${path}`
  return `${origin}${suffix}`
}

function isSearchResult(value: unknown): value is SearchResult {
  return (
    !!value &&
    typeof value === "object" &&
    "hits" in value &&
    "metadata" in value
  )
}

function extractResults(payload: unknown): SearchResult[] {
  if (Array.isArray(payload)) {
    return payload as SearchResult[]
  }

  if (payload && typeof payload === "object") {
    if ("results" in payload && Array.isArray(payload.results)) {
      return payload.results as SearchResult[]
    }
    if (isSearchResult(payload)) {
      return [payload]
    }
  }

  throw new Error(
    "@medusajs/instantsearch-adapter: unexpected search response shape. Expected `{ results: SearchResult[] }`, an array of results, or a single SearchResult."
  )
}

export function unwrapSearchResults(
  payload: unknown,
  expected: number
): SearchResult[] {
  const results = extractResults(payload)
  if (results.length !== expected) {
    throw new Error(
      `@medusajs/instantsearch-adapter: expected ${expected} search result(s), received ${results.length}`
    )
  }
  return results
}

async function postJson(
  url: string,
  body: unknown,
  options: InstantSearchAdapterOptions
): Promise<unknown> {
  const headers: Record<string, string> = {
    "content-type": "application/json",
    accept: "application/json",
    ...options.headers,
  }

  if (options.publishableApiKey) {
    headers[PUBLISHABLE_KEY_HEADER] = options.publishableApiKey
  }

  const response = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  })

  const payload = await response.json().catch(() => ({}))

  if (!response.ok) {
    const message =
      payload &&
      typeof payload === "object" &&
      "message" in payload &&
      typeof payload.message === "string"
        ? payload.message
        : response.statusText ||
          `Search request failed with status ${response.status}`
    throw new Error(message)
  }

  return payload
}

export function assertAdapterTransport(
  options: InstantSearchAdapterOptions
): void {
  const path = options.path ?? DEFAULT_SEARCH_PATH
  if (
    !options.requester &&
    !options.sdk &&
    !options.baseUrl &&
    !isAbsoluteUrl(path)
  ) {
    throw new Error(
      "@medusajs/instantsearch-adapter: provide `sdk`, `requester`, or `baseUrl`"
    )
  }
}

export function createSearchRequester(
  options: InstantSearchAdapterOptions
): SearchRequester {
  if (options.requester) {
    return options.requester
  }

  const path = options.path ?? DEFAULT_SEARCH_PATH
  const batch = options.batch !== false

  if (options.sdk) {
    const sdk = options.sdk
    return async (queries: SearchQuery[]) => {
      if (!batch) {
        const payloads = await Promise.all(
          queries.map((query) =>
            sdk.client.fetch(path, {
              method: "POST",
              body: query,
              headers: options.headers,
            })
          )
        )
        return payloads.map((payload) => unwrapSearchResults(payload, 1)[0])
      }

      const payload = await sdk.client.fetch(path, {
        method: "POST",
        body: { queries },
        headers: options.headers,
      })
      return unwrapSearchResults(payload, queries.length)
    }
  }

  const url = resolveSearchUrl(options.baseUrl, path)

  return async (queries: SearchQuery[]) => {
    if (!batch) {
      const payloads = await Promise.all(
        queries.map((query) => postJson(url, query, options))
      )
      return payloads.map((payload) => unwrapSearchResults(payload, 1)[0])
    }

    const payload = await postJson(url, { queries }, options)
    return unwrapSearchResults(payload, queries.length)
  }
}
