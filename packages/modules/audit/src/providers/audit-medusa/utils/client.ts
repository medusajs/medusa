import {
  AuditLogDTO,
  AuditLogFindConfig,
  FilterableAuditLogProps,
} from "@medusajs/framework/types"
import { MedusaError } from "@medusajs/framework/utils"
import type { MedusaAuditProviderOptions } from "./options"

/**
 * The wire contract with the Medusa Cloud audit service lives only in this
 * file. The service is write and read only, so there is no update or delete.
 *
 * - `POST /records` with `{ records }` stores a batch.
 * - `GET /records` with filter and pagination query parameters answers
 *   `{ records, count }`.
 * - `GET /records/:id` answers `{ record }`, or 404.
 */
export class MedusaAuditCloudError extends Error {
  status?: number
  type?: string

  constructor(message: string, status?: number, type?: string) {
    super(message)
    this.name = "MedusaAuditCloudError"
    this.status = status
    this.type = type
  }
}

type WireAuditLog = Omit<AuditLogDTO, "started_at" | "ended_at"> & {
  started_at: string
  ended_at: string
}

export class MedusaAuditClient {
  protected readonly options_: MedusaAuditProviderOptions
  protected readonly endpoint_: string
  protected readonly fetch_: typeof fetch

  constructor(options: MedusaAuditProviderOptions) {
    this.options_ = resolveMedusaAuditOptions(options)
    this.endpoint_ = this.options_.endpoint.replace(/\/+$/, "")
    this.fetch_ =
      options.fetch ?? ((input, init) => globalThis.fetch(input, init))
  }

  async write(records: AuditLogDTO[]): Promise<void> {
    await this.request("POST", "/records", { records })
  }

  async list(
    filters: FilterableAuditLogProps,
    config: AuditLogFindConfig
  ): Promise<{ records: AuditLogDTO[]; count: number }> {
    const query = buildListQuery(filters, config).toString()
    const body = await this.request<{
      records?: WireAuditLog[]
      count?: number
    }>("GET", `/records${query ? `?${query}` : ""}`)

    const records = (body.records ?? []).map(fromWire)
    return { records, count: body.count ?? records.length }
  }

  async retrieve(
    id: string,
    config: AuditLogFindConfig
  ): Promise<AuditLogDTO | null> {
    const query = new URLSearchParams()
    if (config.select?.length) {
      query.set("fields", config.select.join(","))
    }
    const suffix = query.toString() ? `?${query.toString()}` : ""

    try {
      const body = await this.request<{ record?: WireAuditLog }>(
        "GET",
        `/records/${encodeURIComponent(id)}${suffix}`
      )
      return body.record ? fromWire(body.record) : null
    } catch (error) {
      if (error instanceof MedusaAuditCloudError && error.status === 404) {
        return null
      }
      throw error
    }
  }

  protected async request<T = unknown>(
    method: "GET" | "POST",
    path: string,
    body?: object
  ): Promise<T> {
    const response = await this.fetch_(`${this.endpoint_}${path}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${this.options_.api_key}`,
        "x-medusa-environment-handle": this.options_.environment_handle,
      },
      body: body ? JSON.stringify(body) : undefined,
    })

    const payload = await response.json().catch(() => ({}))

    if (!response.ok) {
      throw new MedusaAuditCloudError(
        payload?.message ??
          `Medusa Cloud audit service answered ${response.status}`,
        response.status,
        payload?.type
      )
    }

    return payload as T
  }
}

export function resolveMedusaAuditOptions(
  options: Partial<MedusaAuditProviderOptions> = {}
): MedusaAuditProviderOptions {
  for (const key of ["endpoint", "api_key", "environment_handle"] as const) {
    if (!options[key]) {
      throw new MedusaError(
        MedusaError.Types.INVALID_ARGUMENT,
        `Medusa Cloud audit storage requires the "${key}" option`
      )
    }
  }

  return options as MedusaAuditProviderOptions
}

export function buildListQuery(
  filters: FilterableAuditLogProps,
  config: AuditLogFindConfig
): URLSearchParams {
  const query = new URLSearchParams()

  for (const key of [
    "id",
    "actor_type",
    "actor_id",
    "action",
    "resource_type",
    "resource_id",
    "outcome",
  ] as const) {
    const value = filters[key]
    if (value === undefined || value === null) {
      continue
    }
    for (const item of Array.isArray(value) ? value : [value]) {
      query.append(key, item)
    }
  }

  for (const [operator, value] of Object.entries(filters.started_at ?? {})) {
    if (value !== undefined && value !== null) {
      query.set(
        `started_at[${operator}]`,
        value instanceof Date ? value.toISOString() : String(value)
      )
    }
  }

  if (filters.q) {
    query.set("q", filters.q)
  }

  if (typeof config.skip === "number") {
    query.set("offset", String(config.skip))
  }

  if (typeof config.take === "number") {
    query.set("limit", String(config.take))
  }

  const direction = config.order?.started_at?.toUpperCase()
  if (direction) {
    query.set("order", direction === "ASC" ? "started_at" : "-started_at")
  }

  if (config.select?.length) {
    query.set("fields", config.select.join(","))
  }

  return query
}

function fromWire(record: WireAuditLog): AuditLogDTO {
  return {
    ...record,
    ...(record.started_at !== undefined && {
      started_at: new Date(record.started_at),
    }),
    ...(record.ended_at !== undefined && {
      ended_at: new Date(record.ended_at),
    }),
  } as AuditLogDTO
}
