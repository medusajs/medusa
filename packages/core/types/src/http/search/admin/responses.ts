/**
 * One entity's results. Grouped rather than merged into a single list, because
 * relevance is only comparable within an index.
 */
export interface AdminSearchResultGroup<T = Record<string, unknown>> {
  entity: string
  /** The documents the index holds, in relevance order. */
  data: T[]
  /** Treat as an estimate — most engines only approximate a total. */
  count: number
  offset: number
  limit: number
}

export interface AdminSearchResponse<T = Record<string, unknown>> {
  /** In the order the entities were requested. */
  results: AdminSearchResultGroup<T>[]
}
