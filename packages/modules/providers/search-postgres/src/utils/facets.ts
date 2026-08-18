import { SearchTypes } from "@medusajs/framework/types"
import { MedusaError } from "@medusajs/framework/utils"
import { jsonbPath } from "./filters"
import { IndexPlan, isFacetable } from "./plan"

function fail(message: string): never {
  throw new MedusaError(MedusaError.Types.NOT_ALLOWED, message)
}

export type NormalizedFacetRequest = {
  field: string
  type: "value" | "range" | "stats"
  limit?: number
  sort?: "count" | "alpha"
  query?: string
  ranges?: {
    key: string
    from?: number
    to?: number
  }[]
}

export function normalizeFacetRequests(
  requests: (string | SearchTypes.SearchFacetRequest)[] | undefined,
  plan: IndexPlan
): NormalizedFacetRequest[] {
  if (!requests?.length) {
    return []
  }

  return requests.map((request) => {
    if (typeof request === "string") {
      const planned = plan.fields.get(request)
      if (!planned || !isFacetable(planned.field)) {
        fail(`Field "${request}" is not facetable on the postgres search provider`)
      }
      return { field: request, type: "value" as const }
    }

    const planned = plan.fields.get(request.field)
    if (!planned || !isFacetable(planned.field)) {
      fail(
        `Field "${request.field}" is not facetable on the postgres search provider`
      )
    }

    if (request.type === "stats") {
      if (planned.kind !== "number") {
        fail(`Stats facets require a numeric field ("${request.field}")`)
      }
      return { field: request.field, type: "stats" }
    }

    if (request.type === "range") {
      if (planned.kind !== "number") {
        fail(`Range facets require a numeric field ("${request.field}")`)
      }
      return {
        field: request.field,
        type: "range",
        ranges: request.ranges.map((range) => ({
          key: range.key ?? `${range.from ?? "*"}-${range.to ?? "*"}`,
          from:
            range.from === undefined
              ? undefined
              : typeof range.from === "number"
              ? range.from
              : Number(range.from),
          to:
            range.to === undefined
              ? undefined
              : typeof range.to === "number"
              ? range.to
              : Number(range.to),
        })),
      }
    }

    return {
      field: request.field,
      type: "value",
      limit: request.limit,
      sort: request.sort,
      query: request.query,
    }
  })
}

/**
 * Builds a SELECT that returns facet rows for a single request, scoped by the
 * same WHERE clause as the main search (passed in as a pre-built fragment).
 */
export function buildFacetQuery(input: {
  table: string
  whereSql?: string
  whereParams: unknown[]
  request: NormalizedFacetRequest
  plan: IndexPlan
}): { sql: string; params: unknown[] } {
  const { table, whereSql, whereParams, request, plan } = input
  const planned = plan.fields.get(request.field)!
  const params = [...whereParams]
  const where = whereSql ? `WHERE ${whereSql}` : ""

  if (request.type === "stats") {
    const expr = `(${jsonbPath(request.field, true)})::float8`
    return {
      sql: `
        SELECT
          MIN(${expr}) AS min,
          MAX(${expr}) AS max,
          AVG(${expr}) AS avg,
          SUM(${expr}) AS sum,
          COUNT(*)::int AS count
        FROM "${table}"
        ${where}
      `,
      params,
    }
  }

  if (request.type === "range") {
    const expr = `(${jsonbPath(request.field, true)})::float8`
    // The range bounds sit in the SELECT list, ahead of the WHERE clause, so
    // their params must precede whereParams.
    const rangeParams: unknown[] = []
    const selects = (request.ranges ?? [])
      .map((range, index) => {
        const conditions: string[] = []
        if (range.from !== undefined) {
          rangeParams.push(range.from)
          conditions.push(`${expr} >= ?`)
        }
        if (range.to !== undefined) {
          rangeParams.push(range.to)
          conditions.push(`${expr} < ?`)
        }
        const predicate = conditions.length
          ? conditions.join(" AND ")
          : "TRUE"
        return `COUNT(*) FILTER (WHERE ${predicate})::int AS r${index}`
      })
      .join(",\n")

    return {
      sql: `SELECT ${selects} FROM "${table}" ${where}`,
      params: [...rangeParams, ...whereParams],
    }
  }

  // value facet
  const valueExpr = planned.is_array
    ? `jsonb_array_elements_text(${jsonbPath(request.field)})`
    : jsonbPath(request.field, true)

  const limit = request.limit ?? 10
  params.push(limit)

  let valueFilter = ""
  if (request.query) {
    params.splice(params.length - 1, 0, `${request.query}%`)
    valueFilter = planned.is_array
      ? `AND value LIKE ?`
      : `AND ${valueExpr} LIKE ?`
  }

  const order =
    request.sort === "alpha" ? "value ASC" : "count DESC, value ASC"

  if (planned.is_array) {
    return {
      sql: `
        SELECT value, COUNT(*)::int AS count
        FROM (
          SELECT ${valueExpr} AS value
          FROM "${table}"
          ${where}
        ) AS exploded
        WHERE value IS NOT NULL
        ${valueFilter}
        GROUP BY value
        ORDER BY ${order}
        LIMIT ?
      `,
      params,
    }
  }

  const nullGuard = `${valueExpr} IS NOT NULL`
  const facetWhere = whereSql
    ? `WHERE ${whereSql} AND ${nullGuard}`
    : `WHERE ${nullGuard}`

  return {
    sql: `
      SELECT ${valueExpr} AS value, COUNT(*)::int AS count
      FROM "${table}"
      ${facetWhere}
      ${valueFilter}
      GROUP BY 1
      ORDER BY ${order}
      LIMIT ?
    `,
    params,
  }
}

export function mapFacetResult(
  request: NormalizedFacetRequest,
  rows: Record<string, unknown>[]
): SearchTypes.SearchFacetResult {
  if (request.type === "stats") {
    const row = rows[0] ?? {}
    return {
      type: "stats",
      min: Number(row.min ?? 0),
      max: Number(row.max ?? 0),
      avg: row.avg === null || row.avg === undefined ? undefined : Number(row.avg),
      sum: row.sum === null || row.sum === undefined ? undefined : Number(row.sum),
      count: Number(row.count ?? 0),
    }
  }

  if (request.type === "range") {
    const row = rows[0] ?? {}
    return {
      type: "range",
      ranges: (request.ranges ?? []).map((range, index) => ({
        key: range.key,
        from: range.from,
        to: range.to,
        count: Number(row[`r${index}`] ?? 0),
      })),
    }
  }

  return {
    type: "value",
    values: rows.map((row) => ({
      value: String(row.value),
      count: Number(row.count ?? 0),
    })),
  }
}
