import { SearchTypes } from "@medusajs/framework/types"
import { MedusaError } from "@medusajs/framework/utils"
import { IndexPlan, PlannedField } from "./plan"

function fail(message: string): never {
  throw new MedusaError(MedusaError.Types.NOT_ALLOWED, message)
}

export type SqlFragment = {
  sql: string
  params: unknown[]
}

/**
 * Builds a JSONB path expression against the `indexed` column for a dotted
 * field path. `variants.color` becomes `indexed->'variants'->'color'`.
 */
export function jsonbPath(path: string, asText = false): string {
  const segments = path.split(".")
  let expr = "indexed"

  for (let i = 0; i < segments.length; i++) {
    const segment = segments[i].replace(/'/g, "''")
    const isLast = i === segments.length - 1
    if (isLast && asText) {
      expr += `->>'${segment}'`
    } else {
      expr += `->'${segment}'`
    }
  }

  return expr
}

function castScalar(
  planned: PlannedField,
  value: unknown
): string | number | boolean | null {
  if (value === null || value === undefined) {
    return null
  }

  switch (planned.kind) {
    case "number": {
      const num =
        planned.is_date && value instanceof Date
          ? value.getTime()
          : typeof value === "number"
          ? value
          : Number(value)
      if (Number.isNaN(num)) {
        fail(`Cannot cast filter value for "${planned.path}" to a number`)
      }
      return num
    }
    case "boolean":
      if (typeof value === "boolean") {
        return value
      }
      if (value === "true" || value === "false") {
        return value === "true"
      }
      return Boolean(value)
    default:
      return typeof value === "string" ? value : String(value)
  }
}

function nextParam(params: unknown[], value: unknown): string {
  params.push(value)
  return `?`
}

/**
 * Builds `"indexed" @> '{"a":{"b":<leaf>}}'` for a dotted path. Containment is
 * the one predicate the `jsonb_path_ops` GIN index accelerates, it compares
 * numbers and booleans natively (unlike `?|`, which only matches string array
 * elements), and on a collapsed leaf array it means "array contains".
 */
function containmentSql(
  path: string,
  leaf: unknown,
  params: unknown[]
): string {
  const doc = path
    .split(".")
    .reduceRight<unknown>((acc, segment) => ({ [segment]: acc }), leaf)
  return `"indexed" @> ${nextParam(params, JSON.stringify(doc))}::jsonb`
}

function existsSql(planned: PlannedField, exists: boolean): string {
  const expr = jsonbPath(planned.path)
  return exists
    ? `(${expr} IS NOT NULL AND ${expr} <> 'null'::jsonb)`
    : `(${expr} IS NULL OR ${expr} = 'null'::jsonb)`
}

function equalitySql(
  planned: PlannedField,
  value: unknown,
  params: unknown[]
): string {
  const cast = castScalar(planned, value)
  if (cast === null) {
    // `indexed` never stores nulls, so equality with null means absence.
    return existsSql(planned, false)
  }
  const leaf = planned.is_array ? [cast] : cast
  return containmentSql(planned.path, leaf, params)
}

/** Matches when the field equals (or, on arrays, contains) any of the values. */
function anyOfSql(
  planned: PlannedField,
  values: unknown[],
  params: unknown[]
): string {
  if (!values.length) {
    return "FALSE"
  }
  const parts = values.map((value) => equalitySql(planned, value, params))
  return parts.length === 1 ? parts[0] : `(${parts.join(" OR ")})`
}

function comparisonSql(
  planned: PlannedField,
  operator: string,
  value: unknown,
  params: unknown[]
): string {
  if (planned.is_array) {
    fail(
      `Operator "${operator}" is not supported on array field "${planned.path}"`
    )
  }

  const cast = castScalar(planned, value)

  if (planned.kind === "number") {
    return `(${jsonbPath(planned.path, true)})::float8 ${operator} ${nextParam(
      params,
      cast
    )}`
  }

  if (planned.kind === "boolean") {
    return `(${jsonbPath(planned.path, true)})::boolean ${operator} ${nextParam(
      params,
      cast
    )}`
  }

  return `${jsonbPath(planned.path, true)} ${operator} ${nextParam(
    params,
    cast
  )}`
}

function arrayContainsSql(
  planned: PlannedField,
  values: unknown[],
  mode: "all" | "any",
  params: unknown[]
): string {
  if (!planned.is_array) {
    fail(
      `Operator $${
        mode === "all" ? "contains" : "overlaps"
      } on "${planned.path}" needs an array field`
    )
  }

  if (mode === "any") {
    return anyOfSql(planned, values, params)
  }

  // Contains-all is a single containment with every value in the leaf array.
  const castValues = values.map((value) => castScalar(planned, value))
  return containmentSql(planned.path, castValues, params)
}

function fieldPredicate(
  path: string,
  raw: unknown,
  plan: IndexPlan,
  params: unknown[]
): string {
  const planned = plan.fields.get(path)

  if (!planned) {
    fail(`Unknown filter field "${path}" on the postgres search provider`)
  }

  // Shorthand: bare value or list of values. On array fields this means
  // membership ("array contains the value"), matching the local provider.
  if (raw === null || typeof raw !== "object" || Array.isArray(raw)) {
    const values = Array.isArray(raw) ? raw : [raw]
    return anyOfSql(planned, values, params)
  }

  const operators = raw as Record<string, unknown>
  const keys = Object.keys(operators).filter((key) => key.startsWith("$"))

  if (!keys.length) {
    fail(`Empty operator map on filter field "${path}"`)
  }

  const parts: string[] = []

  for (const operator of keys) {
    const value = operators[operator]

    switch (operator) {
      case "$eq":
        parts.push(equalitySql(planned, value, params))
        break
      case "$ne":
        // Documents missing the field satisfy "not equal".
        parts.push(
          value === null || value === undefined
            ? existsSql(planned, true)
            : `NOT ${equalitySql(planned, value, params)}`
        )
        break
      case "$in":
        parts.push(
          anyOfSql(planned, Array.isArray(value) ? value : [value], params)
        )
        break
      case "$nin":
        parts.push(
          `NOT ${anyOfSql(
            planned,
            Array.isArray(value) ? value : [value],
            params
          )}`
        )
        break
      case "$gt":
        parts.push(comparisonSql(planned, ">", value, params))
        break
      case "$gte":
        parts.push(comparisonSql(planned, ">=", value, params))
        break
      case "$lt":
        parts.push(comparisonSql(planned, "<", value, params))
        break
      case "$lte":
        parts.push(comparisonSql(planned, "<=", value, params))
        break
      case "$exists":
        parts.push(existsSql(planned, Boolean(value)))
        break
      case "$contains":
        parts.push(
          arrayContainsSql(
            planned,
            Array.isArray(value) ? value : [value],
            "all",
            params
          )
        )
        break
      case "$overlaps":
        parts.push(
          arrayContainsSql(
            planned,
            Array.isArray(value) ? value : [value],
            "any",
            params
          )
        )
        break
      case "$prefix":
      case "$like": {
        if (planned.is_array) {
          fail(
            `Operator "${operator}" is not supported on array field "${path}"`
          )
        }
        const pattern =
          operator === "$prefix" ? `${String(value)}%` : String(value)
        parts.push(
          `${jsonbPath(planned.path, true)} LIKE ${nextParam(params, pattern)}`
        )
        break
      }
      default:
        fail(
          `The postgres search provider does not support operator "${operator}" on "${path}"`
        )
    }
  }

  return parts.length === 1 ? parts[0] : `(${parts.join(" AND ")})`
}

/**
 * Compiles the filter tree into a SQL boolean expression. Unlike the local
 * provider, `$or` and `$not` are supported — Postgres can express them.
 */
export function toWhereClause(
  filters: SearchTypes.SearchFilters | undefined,
  plan: IndexPlan
): SqlFragment | undefined {
  if (!filters) {
    return undefined
  }

  const params: unknown[] = []

  const compile = (branch: SearchTypes.SearchFilters): string => {
    const parts: string[] = []

    for (const [key, value] of Object.entries(branch)) {
      if (key === "q") {
        continue
      }

      if (key === "$and") {
        const nested = ((value ?? []) as SearchTypes.SearchFilters[])
          .map(compile)
          .filter(Boolean)
        if (nested.length) {
          parts.push(`(${nested.join(" AND ")})`)
        }
        continue
      }

      if (key === "$or") {
        const nested = ((value ?? []) as SearchTypes.SearchFilters[])
          .map(compile)
          .filter(Boolean)
        if (nested.length) {
          parts.push(`(${nested.join(" OR ")})`)
        }
        continue
      }

      if (key === "$not") {
        const nested = compile(value as SearchTypes.SearchFilters)
        if (nested) {
          parts.push(`NOT (${nested})`)
        }
        continue
      }

      parts.push(fieldPredicate(key, value, plan, params))
    }

    return parts.join(" AND ")
  }

  const sql = compile(filters)
  return sql ? { sql, params } : undefined
}
