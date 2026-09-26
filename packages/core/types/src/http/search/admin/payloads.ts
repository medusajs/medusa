/**
 * The details to reindex a search index. Everything is optional — an empty
 * body triggers a full rebuild, same as today.
 */
export interface AdminReindexSearchIndex {
  /**
   * Rebuilds only documents that changed at or after this date (ISO 8601).
   * Always runs in place, same as `filters` — a version built from a subset
   * is never swapped in.
   */
  since?: string

  /**
   * Filters passed to the index definition's `seed` function to rebuild only
   * a subset of the index's documents. The shape is index-defined — e.g.
   * `{ ids: ["prod_1", "prod_2"] }` if the index supports it.
   */
  filters?: Record<string, unknown>

  /**
   * How to rebuild. Ignored — always in place — when `filters` or `since`
   * is set.
   *
   * @default "swap"
   */
  strategy?: "swap" | "in_place"
}
