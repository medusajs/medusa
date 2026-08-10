/**
 * The parameters to pass when searching across admin entities.
 */
export interface AdminSearchParams {
  /** Applied to every entity searched. */
  q?: string

  /**
   * The entities / indexes to search, comma-separated.
   * When the Search Module is enabled, defaults to every registered index.
   * Otherwise defaults to the admin fallback entity set.
   */
  entity?: string | string[]

  /** Per entity, not across the response — each group paginates on its own. */
  limit?: number
  offset?: number
}
