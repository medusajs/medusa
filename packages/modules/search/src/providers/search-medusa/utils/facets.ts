import { SearchTypes } from "@medusajs/framework/types"
import { MedusaError } from "@medusajs/framework/utils"
import type {
  AggregationGroup,
  Filter,
  IndexQuery,
  IndexQueryResult,
} from "./api-types"
import { mergeFilters } from "./filters"
import { IndexPlan, PlannedField } from "./plan"
import { buildQueryFilters } from "./query"

type RangeFacetRequest = Extract<
  SearchTypes.SearchFacetRequest,
  { type: "range" }
>
type StatsFacetRequest = Extract<
  SearchTypes.SearchFacetRequest,
  { type: "stats" }
>
type ValueFacetRequest = {
  field: string
  type?: "value"
  limit?: number
  sort?: "count" | "alpha"
  query?: string
}

export type FacetQuery = {
  field: string
  request: RangeFacetRequest | ValueFacetRequest | StatsFacetRequest
  range?: RangeFacetRequest["ranges"][number]
  /**
   * Medusa Search has no Min/Max aggregates yet, so a stats facet is three
   * sub-queries: attribute order for min and max, then Count/Sum.
   */
  stats?: "min" | "max" | "agg"
  is_date?: boolean
  query: IndexQuery
}

function fail(message: string): never {
  throw new MedusaError(MedusaError.Types.NOT_ALLOWED, message)
}

function aggregationGroupValue(group: AggregationGroup, field: string): string {
  const raw = group.value ?? group[field]
  if (Array.isArray(raw)) {
    return String(raw[0] ?? "")
  }
  return String(raw ?? "")
}

function assertStatsField(field: PlannedField, path: string): void {
  const numeric =
    field.type === "int" || field.type === "float" || field.is_date
  if (!numeric || field.is_array) {
    fail(`Stats facets require a scalar numeric field ("${path}")`)
  }
}

function toStatsNumber(value: unknown, isDate?: boolean): number {
  if (value == null || value === "") {
    return 0
  }
  if (isDate) {
    if (typeof value === "number") {
      return value
    }
    const ms =
      value instanceof Date ? value.getTime() : Date.parse(String(value))
    return Number.isNaN(ms) ? 0 : ms
  }
  const n = Number(value)
  return Number.isNaN(n) ? 0 : n
}

function emptyStatsResult(): Extract<
  SearchTypes.SearchFacetResult,
  { type: "stats" }
> {
  return { type: "stats", min: 0, max: 0, count: 0 }
}

export function buildFacetQueries(
  input: SearchTypes.ProviderSearchQuery,
  plan: IndexPlan
): FacetQuery[] {
  const requests = (input.search_options?.facets ?? []) as
    | SearchTypes.SearchFacetRequest[]
  const base = buildQueryFilters(input, plan)
  const result: FacetQuery[] = []

  for (const request of requests) {
    const field = plan.fields.get(request.field)
    if (!field) {
      fail(`Unknown facet field "${request.field}"`)
    }
    if (request.type === "stats") {
      assertStatsField(field, request.field)
      const present = mergeFilters([base, [request.field, "NotEq", null]])
      result.push({
        field: request.field,
        request,
        stats: "min",
        is_date: field.is_date,
        query: {
          rank_by: [request.field, "asc"],
          limit: 1,
          include_attributes: [request.field],
          filters: present,
        },
      })
      result.push({
        field: request.field,
        request,
        stats: "max",
        is_date: field.is_date,
        query: {
          rank_by: [request.field, "desc"],
          limit: 1,
          include_attributes: [request.field],
          filters: present,
        },
      })
      result.push({
        field: request.field,
        request,
        stats: "agg",
        is_date: field.is_date,
        query: {
          // Sum is scalar numeric only. Dates get Count so the result still
          // has a document total; min/max come from the rank_by queries.
          aggregate_by: field.is_date
            ? { count: ["Count"] }
            : { count: ["Count"], sum: ["Sum", request.field] },
          filters: base,
        },
      })
      continue
    }

    if (request.type === "range") {
      for (const range of request.ranges) {
        const bounds: Filter[] = []
        if (range.from !== undefined) {
          bounds.push([
            request.field,
            "Gte",
            field.is_date
              ? new Date(range.from).toISOString()
              : Number(range.from),
          ])
        }
        if (range.to !== undefined) {
          bounds.push([
            request.field,
            "Lt",
            field.is_date ? new Date(range.to).toISOString() : Number(range.to),
          ])
        }
        result.push({
          field: request.field,
          request,
          range,
          query: {
            aggregate_by: { count: ["Count"] },
            filters: mergeFilters([base, ...bounds]),
          },
        })
      }
      continue
    }

    result.push({
      field: request.field,
      request,
      query: {
        aggregate_by: { count: ["Count"] },
        // Untagged enum: a field name, or `{ alias: ["ForEachUnique", field] }`
        // for array attributes. `{ value: "field" }` matches neither variant.
        group_by: field.is_array
          ? [{ value: ["ForEachUnique", request.field] }]
          : [request.field],
        filters: base,
        // Groups are returned by key, not count. Fetch all available groups
        // before applying count sorting or a facet-value query locally.
        // Cloud's aggregation schema rejects `limit`; `top_k` is the
        // documented alias for `limit.total` (max 10,000).
        top_k:
          request.sort === "alpha" && !request.query
            ? Math.min(Math.max(request.limit ?? 10, 1), 10000)
            : 10000,
      },
    })
  }

  return result
}

export function parseFacetResults(
  queries: FacetQuery[],
  responses: IndexQueryResult[]
): Record<string, SearchTypes.SearchFacetResult> | undefined {
  if (!queries.length) {
    return undefined
  }

  const result: Record<string, SearchTypes.SearchFacetResult> = {}

  queries.forEach((query, index) => {
    const response = responses[index]

    if (query.request.type === "range") {
      const current = (result[query.field] ?? {
        type: "range",
        ranges: [],
      }) as Extract<SearchTypes.SearchFacetResult, { type: "range" }>
      current.ranges.push({
        key:
          query.range?.key ??
          `${query.range?.from ?? "*"}-${query.range?.to ?? "*"}`,
        from: query.range?.from,
        to: query.range?.to,
        count: Number(response?.aggregations?.count ?? 0),
      })
      result[query.field] = current
      return
    }

    if (query.request.type === "stats") {
      const current = (result[query.field] ?? emptyStatsResult()) as Extract<
        SearchTypes.SearchFacetResult,
        { type: "stats" }
      >

      if (query.stats === "min" || query.stats === "max") {
        current[query.stats] = toStatsNumber(
          response?.rows?.[0]?.[query.field],
          query.is_date
        )
      } else {
        current.count = Number(response?.aggregations?.count ?? 0)
        const sum = response?.aggregations?.sum
        if (sum !== undefined && sum !== null) {
          current.sum = Number(sum)
        }
      }

      result[query.field] = current
      return
    }

    let values = (response?.aggregation_groups ?? []).map((group) => ({
      value: aggregationGroupValue(group, query.field),
      count: Number(group.count ?? 0),
    }))

    if (query.request.query) {
      const needle = query.request.query.toLocaleLowerCase()
      values = values.filter(({ value }) =>
        value.toLocaleLowerCase().includes(needle)
      )
    }
    values.sort(
      query.request.sort === "alpha"
        ? (a, b) => a.value.localeCompare(b.value)
        : (a, b) => b.count - a.count || a.value.localeCompare(b.value)
    )
    values = values.slice(0, query.request.limit ?? 10)

    result[query.field] = { type: "value", values }
  })

  return result
}
