import type { IndexQuery, IndexQueryResult } from "./api-types"

export const MAX_AGGREGATIONS_PER_QUERY = 8

/**
 * Where a query's result lives once packed. `labels` maps the query's own
 * aggregation labels to the ones it was given in a shared query.
 */
export type PackedSlot = {
  index: number
  labels?: Record<string, string>
}

export type PackedQueries = {
  queries: IndexQuery[]
  slots: PackedSlot[]
}

type AggregationQuery = IndexQuery & {
  aggregate_by: Record<string, unknown>
}

function isPackable(query: IndexQuery): query is AggregationQuery {
  return (
    !!query.aggregate_by &&
    Object.keys(query).every(
      (key) => key === "aggregate_by" || key === "filters"
    )
  )
}

/**
 * Merges ungrouped aggregations over the same filters into one query, so the
 * total count and every stats facet's Count and Sum cost one sub-query
 * instead of one each. Identical aggregations are computed once.
 */
export function packAggregations(queries: IndexQuery[]): PackedQueries {
  const packed: IndexQuery[] = []
  const slots: PackedSlot[] = []
  const open = new Map<
    string,
    {
      index: number
      aggregateBy: Record<string, unknown>
      byAggregation: Map<string, string>
    }
  >()

  for (const query of queries) {
    if (!isPackable(query)) {
      slots.push({ index: packed.length })
      packed.push(query)
      continue
    }

    const filterKey = JSON.stringify(query.filters ?? null)
    const aggregations = Object.entries(query.aggregate_by)
    let target = open.get(filterKey)

    const added = aggregations.filter(
      ([, aggregation]) =>
        !target?.byAggregation.has(JSON.stringify(aggregation))
    ).length

    if (
      !target ||
      target.byAggregation.size + added > MAX_AGGREGATIONS_PER_QUERY
    ) {
      target = {
        index: packed.length,
        aggregateBy: {},
        byAggregation: new Map(),
      }
      open.set(filterKey, target)
      packed.push({ aggregate_by: target.aggregateBy, filters: query.filters })
    }

    const labels: Record<string, string> = {}
    for (const [label, aggregation] of aggregations) {
      const key = JSON.stringify(aggregation)
      let shared = target.byAggregation.get(key)
      if (!shared) {
        shared =
          label in target.aggregateBy
            ? `${label}_${target.byAggregation.size}`
            : label
        target.byAggregation.set(key, shared)
        target.aggregateBy[shared] = aggregation
      }
      labels[label] = shared
    }

    slots.push({ index: target.index, labels })
  }

  return { queries: packed, slots }
}

/**
 * Gives every query passed to `packAggregations` its own result back, in the
 * order the queries were passed.
 */
export function unpackResults(
  results: IndexQueryResult[],
  slots: PackedSlot[]
): IndexQueryResult[] {
  return slots.map(({ index, labels }) => {
    const result = results[index]
    if (!labels) {
      return result
    }

    return {
      aggregations: Object.fromEntries(
        Object.entries(labels).map(([own, shared]) => [
          own,
          result?.aggregations?.[shared],
        ])
      ),
    }
  })
}
