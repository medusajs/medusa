import { SearchTypes } from "@medusajs/framework/types"
import { MedusaError } from "@medusajs/framework/utils"
import type {
  Filter,
  IndexQuery,
  IndexQueryResult,
} from "./api-types"
import { toSearchFilter } from "./filters"
import { IndexPlan } from "./plan"

type RangeFacetRequest = Extract<
  SearchTypes.SearchFacetRequest,
  { type: "range" }
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
  request: RangeFacetRequest | ValueFacetRequest
  range?: RangeFacetRequest["ranges"][number]
  query: IndexQuery
}

function fail(message: string): never {
  throw new MedusaError(MedusaError.Types.NOT_ALLOWED, message)
}

function and(filters: (Filter | undefined)[]): Filter | undefined {
  const present = filters.filter((item): item is Filter => !!item)
  if (!present.length) {
    return undefined
  }
  return present.length === 1 ? present[0] : ["And", present]
}

export function buildFacetQueries(
  input: SearchTypes.ProviderSearchQuery,
  plan: IndexPlan
): FacetQuery[] {
  const requests = (input.search_options?.facets ?? []) as
    | SearchTypes.SearchFacetRequest[]
  const base = toSearchFilter(input.filters, plan)
  const result: FacetQuery[] = []

  for (const request of requests) {
    const field = plan.fields.get(request.field)
    if (!field) {
      fail(`Unknown facet field "${request.field}"`)
    }
    if (request.type === "stats") {
      fail('Medusa search does not expose the min/max needed for "stats" facets')
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
            filters: and([base, ...bounds]),
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
        group_by: field.is_array
          ? [{ value: ["ForEachUnique", request.field] }]
          : [{ value: request.field }],
        filters: base,
        // Groups are returned by key, not count. Fetch all available groups
        // before applying count sorting or a facet-value query locally.
        limit:
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

    let values = (response?.aggregation_groups ?? []).map((group) => ({
      value: String(group.value),
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
