import {
  AuditLogDTO,
  AuditLogFindConfig,
  FilterableAuditLogProps,
} from "@medusajs/framework/types"
import { Knex } from "@medusajs/framework/mikro-orm/knex"
import { MedusaError } from "@medusajs/framework/utils"

export const AUDIT_LOG_TABLE = "audit_log"

export const AUDIT_LOG_COLUMNS: readonly (keyof AuditLogDTO)[] = [
  "id",
  "started_at",
  "ended_at",
  "actor_type",
  "actor_id",
  "impersonator_id",
  "action",
  "resource_type",
  "resource_id",
  "outcome",
  "request",
  "request_data",
  "response_data",
  "metadata",
]

const JSON_COLUMNS = new Set<keyof AuditLogDTO>([
  "request",
  "request_data",
  "response_data",
  "metadata",
])

const EQUALITY_FILTERS = [
  "id",
  "actor_type",
  "actor_id",
  "action",
  "resource_type",
  "resource_id",
  "outcome",
] as const

const RANGE_OPERATORS = {
  $gt: ">",
  $gte: ">=",
  $lt: "<",
  $lte: "<=",
} as const

const SEARCH_COLUMNS = ["action", "resource_type", "resource_id", "actor_id"]

/**
 * jsonb values are serialized here rather than left to the driver, which would
 * turn a top-level array into a Postgres array.
 */
export function toRow(entry: AuditLogDTO): Record<string, unknown> {
  const row: Record<string, unknown> = {}

  for (const column of AUDIT_LOG_COLUMNS) {
    const value = entry[column] ?? null
    row[column] =
      JSON_COLUMNS.has(column) && value !== null ? JSON.stringify(value) : value
  }

  return row
}

export function selectColumns(config: AuditLogFindConfig): string[] {
  const requested = (config.select ?? []).filter((column) =>
    AUDIT_LOG_COLUMNS.includes(column)
  )

  if (!requested.length) {
    return [...AUDIT_LOG_COLUMNS]
  }

  return [...new Set<string>(["id", ...requested])]
}

export function applyFilters(
  query: Knex.QueryBuilder,
  filters: FilterableAuditLogProps
): Knex.QueryBuilder {
  for (const key of EQUALITY_FILTERS) {
    const value = filters[key]
    if (value === undefined || value === null) {
      continue
    }

    if (Array.isArray(value)) {
      query.whereIn(key, value)
    } else {
      query.where(key, value)
    }
  }

  for (const [operator, value] of Object.entries(filters.started_at ?? {})) {
    const sqlOperator = RANGE_OPERATORS[operator]
    if (!sqlOperator || value === undefined || value === null) {
      continue
    }

    query.where("started_at", sqlOperator, toDate(value))
  }

  if (filters.q) {
    const pattern = `%${escapeLike(filters.q)}%`
    query.where((builder) => {
      for (const column of SEARCH_COLUMNS) {
        builder.orWhere(column, "ilike", pattern)
      }
    })
  }

  return query
}

export function applyOrderAndPagination(
  query: Knex.QueryBuilder,
  config: AuditLogFindConfig
): Knex.QueryBuilder {
  const direction =
    config.order?.started_at?.toLowerCase() === "asc" ? "asc" : "desc"

  // `id` breaks ties between audit logs that started in the same millisecond.
  query.orderBy([
    { column: "started_at", order: direction },
    { column: "id", order: direction },
  ])

  if (typeof config.skip === "number" && config.skip > 0) {
    query.offset(config.skip)
  }

  if (typeof config.take === "number") {
    query.limit(config.take)
  }

  return query
}

function toDate(value: Date | string): Date {
  const date = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(date.getTime())) {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      `Invalid date in the "started_at" filter: ${value}`
    )
  }
  return date
}

function escapeLike(value: string): string {
  return value.replace(/[\\%_]/g, (character) => `\\${character}`)
}
