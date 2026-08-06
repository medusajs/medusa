export interface AdminSearchParams {
  /** Applied to every entity searched. */
  q?: string

  /** The indexes to search, comma-separated. Defaults to every registered one. */
  entity?: string | string[]

  /** Per entity, not across the response — each group paginates on its own. */
  limit?: number
  offset?: number
}
