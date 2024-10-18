export interface SelectParams {
  /**
   * The fields and relations to retrieve of the returned item(s).
   */
  fields?: string
}

export interface FindParams extends SelectParams {
  limit?: number
  offset?: number
  order?: string
}

export interface AdminBatchLink {
  /**
   * The items to create an association to.
   */
  add?: string[]
  /**
   * The items to remove association from.
   */
  remove?: string[]
}
