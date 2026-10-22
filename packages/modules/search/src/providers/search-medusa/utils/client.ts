import { MedusaError } from "@medusajs/framework/utils"
import { parseRetryAfter } from "../../../utils/rate-limit"
import type {
  IndexCreateParams,
  IndexMetadata,
  IndexMultiQueryParams,
  IndexMultiQueryResponse,
  IndexQuery,
  IndexQueryResult,
  IndexSummary,
  IndexWriteParams,
  IndexWriteResponse,
  AttributeSchema,
} from "./api-types"
import type {
  MedusaSearchProviderOptions,
  ResolvedMedusaSearchProviderOptions,
} from "./options"

/**
 * Cloud proxy error envelope — same shape as Medusa payments.
 */
export class CloudServiceError extends Error {
  type: string
  originalType: string
  data: any
  message: string
  status?: number
  /** How long Cloud asked the caller to wait, in milliseconds. */
  retry_after?: number

  constructor(
    type: string,
    originalType: string,
    data: any,
    message: string,
    status?: number,
    retryAfter?: number
  ) {
    super(message)
    this.name = "CloudServiceError"
    this.type = type
    this.originalType = originalType
    this.data = data
    this.message = message
    this.status = status
    this.retry_after = retryAfter
  }

  get isNotFound(): boolean {
    return this.status === 404
  }
}

type RequestInitWithBody = Omit<RequestInit, "body"> & { body?: object }

/**
 * Thin HTTP client for the Medusa Cloud search proxy. The provider passes
 * Medusa index names; Cloud maps them to upstream storage for the environment.
 */
export class MedusaSearchClient {
  protected readonly options_: ResolvedMedusaSearchProviderOptions
  protected readonly fetch_: typeof fetch

  constructor(
    options: ResolvedMedusaSearchProviderOptions,
    { fetchImpl }: { fetchImpl?: typeof fetch } = {}
  ) {
    this.options_ = options
    this.fetch_ = fetchImpl ?? ((input, init) => globalThis.fetch(input, init))
  }

  index(name: string): MedusaSearchIndex {
    return new MedusaSearchIndex(this, name)
  }

  createIndex(body: IndexCreateParams): Promise<unknown> {
    return this.request("POST", "/indexes", { body })
  }

  async *indexes(): AsyncGenerator<IndexSummary> {
    let cursor: string | undefined

    do {
      const query = new URLSearchParams()
      if (cursor) {
        query.set("cursor", cursor)
      }

      const suffix = query.toString() ? `?${query.toString()}` : ""
      const page = await this.request<{
        indexes: IndexSummary[]
        next_cursor?: string
      }>("GET", `/indexes${suffix}`)

      for (const entry of page.indexes ?? []) {
        yield entry
      }

      cursor = page.next_cursor || undefined
    } while (cursor)
  }

  async request<T>(
    method: string,
    path: string,
    options: RequestInitWithBody = {}
  ): Promise<T> {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      Authorization: `Basic ${this.options_.api_key}`,
      "x-medusa-environment-handle": this.options_.environment_handle,
    }

    const response = await this.fetch_(`${this.options_.endpoint}${path}`, {
      method,
      headers: {
        ...options.headers,
        ...headers,
      },
      body: options.body ? JSON.stringify(options.body) : undefined,
    })

    const body = await response.json().catch(() => ({}))

    if (!response.ok) {
      throw new CloudServiceError(
        body.type,
        body.originalType,
        body.data,
        body.message,
        response.status,
        parseRetryAfter(response.headers.get("retry-after"))
      )
    }

    return body as T
  }
}

export class MedusaSearchIndex {
  constructor(
    protected readonly client_: MedusaSearchClient,
    protected readonly name_: string
  ) {}

  protected path(suffix = ""): string {
    return `/indexes/${encodeURIComponent(this.name_)}${suffix}`
  }

  schema(): Promise<Record<string, AttributeSchema>> {
    return this.client_.request("GET", this.path("/schema"))
  }

  metadata(): Promise<IndexMetadata> {
    return this.client_.request("GET", this.path("/metadata"))
  }

  updateSchema(body: {
    schema: Record<string, AttributeSchema>
  }): Promise<unknown> {
    return this.client_.request("POST", this.path("/schema"), {
      body: body.schema,
    })
  }

  write(body: IndexWriteParams): Promise<IndexWriteResponse> {
    return this.client_.request("POST", this.path(), { body })
  }

  async deleteAll(): Promise<void> {
    await this.client_.request("DELETE", this.path())
  }

  query(body: IndexQuery): Promise<IndexQueryResult> {
    return this.client_.request("POST", this.path("/query"), { body })
  }

  multiQuery(body: IndexMultiQueryParams): Promise<IndexMultiQueryResponse> {
    return this.client_.request("POST", this.path("/query/multi"), { body })
  }
}

export function resolveMedusaSearchOptions(
  options: MedusaSearchProviderOptions
): ResolvedMedusaSearchProviderOptions {
  if (!options?.endpoint) {
    throw new MedusaError(
      MedusaError.Types.INVALID_ARGUMENT,
      'Medusa search requires an explicit "endpoint" provider option'
    )
  }

  const endpoint = parseEndpoint(options.endpoint)

  if (endpoint.credentials && options.api_key) {
    throw new MedusaError(
      MedusaError.Types.INVALID_ARGUMENT,
      'Medusa search received credentials both in the "endpoint" provider option and in the "api_key" provider option. Pass only one of them'
    )
  }

  if (endpoint.credentials && options.environment_handle) {
    throw new MedusaError(
      MedusaError.Types.INVALID_ARGUMENT,
      'Medusa search received an environment handle both in the "endpoint" provider option and in the "environment_handle" provider option. Pass only one of them'
    )
  }

  const apiKey = endpoint.credentials?.api_key || options.api_key
  const environmentHandle =
    endpoint.credentials?.environment_handle || options.environment_handle

  if (!apiKey) {
    throw new MedusaError(
      MedusaError.Types.INVALID_ARGUMENT,
      'Medusa search requires an explicit "api_key" provider option, or basic auth credentials on the "endpoint" provider option'
    )
  }

  if (!environmentHandle) {
    throw new MedusaError(
      MedusaError.Types.INVALID_ARGUMENT,
      'Medusa search requires an explicit "environment_handle" provider option, or basic auth credentials on the "endpoint" provider option'
    )
  }

  return {
    ...options,
    api_key: apiKey,
    environment_handle: environmentHandle,
    endpoint: endpoint.endpoint,
  }
}

/**
 * Whether the options carry credentials at all, so the module can skip
 * registering Cloud search for an app that is not configured for it.
 */
export function hasMedusaSearchCredentials(
  options: Partial<MedusaSearchProviderOptions> = {}
): boolean {
  if (!options.endpoint) {
    return false
  }

  if (options.api_key && options.environment_handle) {
    return true
  }

  try {
    return !!parseEndpoint(options.endpoint).credentials
  } catch {
    return false
  }
}

function parseEndpoint(endpoint: string): {
  endpoint: string
  credentials?: { api_key: string; environment_handle: string }
} {
  let url: URL
  try {
    url = new URL(endpoint)
  } catch {
    throw new MedusaError(
      MedusaError.Types.INVALID_ARGUMENT,
      `Medusa search could not parse the "endpoint" provider option: ${endpoint}`
    )
  }

  if (!url.username && !url.password) {
    return { endpoint }
  }

  // Cloud hands out an endpoint carrying the environment handle as the basic
  // auth user and the key as the password, so a local setup only has to copy
  // a single value. Requests keep them apart: the key is the auth header, the
  // handle its own header.
  const environmentHandle = decodeURIComponent(url.username)
  const token = decodeURIComponent(url.password)

  if (!environmentHandle || !token) {
    throw new MedusaError(
      MedusaError.Types.INVALID_ARGUMENT,
      'Medusa search expects the "endpoint" provider option to carry both the environment handle and the token as basic auth credentials'
    )
  }

  url.username = ""
  url.password = ""

  return {
    credentials: {
      api_key: token,
      environment_handle: environmentHandle,
    },
    // The client appends paths that already start with a slash.
    endpoint: url.toString().replace(/\/+$/, ""),
  }
}
