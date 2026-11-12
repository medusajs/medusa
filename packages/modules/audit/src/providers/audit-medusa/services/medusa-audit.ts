import {
  AuditLogDTO,
  AuditLogFindConfig,
  FilterableAuditLogProps,
} from "@medusajs/framework/types"
import {
  AbstractAuditProviderService,
  MedusaError,
} from "@medusajs/framework/utils"

export type MedusaAuditProviderOptions = {
  /**
   * The Medusa Cloud API key.
   */
  api_key: string
  /**
   * The base URL of the Medusa Cloud audit service.
   */
  endpoint: string
  /**
   * The handle of the Medusa Cloud environment the audit logs belong to.
   */
  environment_handle: string
  /**
   * @ignore
   *
   * Replaces the HTTP transport. It receives the requests that would go to the
   * Cloud audit service and must answer as the service would.
   */
  fetch?: typeof fetch
}

const FILTER_KEYS = [
  "id",
  "actor_type",
  "actor_id",
  "action",
  "resource_type",
  "resource_id",
  "outcome",
] as const

/**
 * Stores audit logs in the Medusa Cloud audit service. Registered by the module
 * itself from its `cloud` option.
 *
 * The service is write and read only, so there is no update or delete:
 *
 * - `POST /records` with `{ records }` stores a batch.
 * - `GET /records` with filter and pagination query parameters answers
 *   `{ records, count }`.
 * - `GET /records/:id` answers `{ record }`, or 404.
 */
export class MedusaAuditService extends AbstractAuditProviderService {
  static identifier = "audit-medusa"

  protected readonly options_: MedusaAuditProviderOptions
  protected readonly endpoint_: string

  constructor(_: unknown, options: MedusaAuditProviderOptions) {
    super()

    for (const key of ["endpoint", "api_key", "environment_handle"] as const) {
      if (!options?.[key]) {
        throw new MedusaError(
          MedusaError.Types.INVALID_ARGUMENT,
          `Medusa Cloud audit storage requires the "${key}" option`
        )
      }
    }

    this.options_ = options
    this.endpoint_ = options.endpoint.replace(/\/+$/, "")
  }

  async write(entries: AuditLogDTO[]): Promise<void> {
    await this.request_("POST", "/records", { records: entries })
  }

  async list(
    filters: FilterableAuditLogProps,
    config: AuditLogFindConfig
  ): Promise<AuditLogDTO[]> {
    return (await this.listAndCount(filters, config))[0]
  }

  async listAndCount(
    filters: FilterableAuditLogProps,
    config: AuditLogFindConfig
  ): Promise<[AuditLogDTO[], number]> {
    const query = new URLSearchParams()

    for (const key of FILTER_KEYS) {
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

    const { body } = await this.request_("GET", `/records?${query}`)
    const records = ((body.records as AuditLogDTO[]) ?? []).map(parseDates)

    return [records, body.count ?? records.length]
  }

  async retrieve(
    id: string,
    config: AuditLogFindConfig
  ): Promise<AuditLogDTO | null> {
    const fields = config.select?.length
      ? `?fields=${encodeURIComponent(config.select.join(","))}`
      : ""

    const { status, body } = await this.request_(
      "GET",
      `/records/${encodeURIComponent(id)}${fields}`,
      undefined,
      [404]
    )

    return status === 404 || !body.record ? null : parseDates(body.record)
  }

  protected async request_(
    method: "GET" | "POST",
    path: string,
    payload?: object,
    acceptedStatuses: number[] = []
  ): Promise<{ status: number; body: Record<string, any> }> {
    const response = await (this.options_.fetch ?? fetch)(
      `${this.endpoint_}${path}`,
      {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${this.options_.api_key}`,
          "x-medusa-environment-handle": this.options_.environment_handle,
        },
        body: payload ? JSON.stringify(payload) : undefined,
      }
    )

    const body = await response.json().catch(() => ({}))

    if (!response.ok && !acceptedStatuses.includes(response.status)) {
      throw new MedusaError(
        MedusaError.Types.UNEXPECTED_STATE,
        `Medusa Cloud audit service answered ${response.status}${
          body?.message ? `: ${body.message}` : ""
        }`
      )
    }

    return { status: response.status, body }
  }
}

function parseDates(record: AuditLogDTO): AuditLogDTO {
  return {
    ...record,
    started_at: new Date(record.started_at),
    ended_at: new Date(record.ended_at),
  }
}
