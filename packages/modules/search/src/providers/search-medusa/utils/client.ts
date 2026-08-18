import { MedusaError } from "@medusajs/framework/utils"
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
import type { MedusaSearchProviderOptions } from "./options"

/**
 * Cloud proxy error envelope — same shape as Medusa payments.
 */
export class CloudServiceError extends Error {
  type: string
  originalType: string
  data: any
  message: string
  status?: number

  constructor(
    type: string,
    originalType: string,
    data: any,
    message: string,
    status?: number
  ) {
    super(message)
    this.name = "CloudServiceError"
    this.type = type
    this.originalType = originalType
    this.data = data
    this.message = message
    this.status = status
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
  protected readonly options_: MedusaSearchProviderOptions

  constructor(options: MedusaSearchProviderOptions) {
    this.options_ = options
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

    const response = await fetch(`${this.options_.endpoint}${path}`, {
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
        response.status
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

export function validateMedusaSearchOptions(
  options: MedusaSearchProviderOptions
): void {
  if (!options?.api_key) {
    throw new MedusaError(
      MedusaError.Types.INVALID_ARGUMENT,
      'Medusa search requires an explicit "api_key" provider option'
    )
  }
  if (!options.endpoint) {
    throw new MedusaError(
      MedusaError.Types.INVALID_ARGUMENT,
      'Medusa search requires an explicit "endpoint" provider option'
    )
  }
  if (!options.environment_handle) {
    throw new MedusaError(
      MedusaError.Types.INVALID_ARGUMENT,
      'Medusa search requires an explicit "environment_handle" provider option'
    )
  }
}
