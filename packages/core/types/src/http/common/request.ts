export interface SelectParams {
  /**
   * The fields and relations to retrieve separated by commas.
   * 
   * Learn more in the [API reference](https://docs.medusajs.com/api/store/select-fields-and-relations).
   */
  fields?: string
}

export interface FindParams extends SelectParams {
  /**
   * The maximum number of items to retrieve.
   */
  limit?: number
  /**
   * The number of items to skip before retrieving the returned items.
   */
  offset?: number
  /**
   * The field to sort by and in which order.
   * 
   * @example
   * -created_at
   */
  order?: string
  /**
   * Whether to include soft-deleted items in the results.
   */
  with_deleted?: boolean
}

export interface AdminBatchLink {
  /**
   * The IDs of the items to create an association to.
   */
  add?: string[]
  /**
   * The IDs of the items to remove the association from.
   */
  remove?: string[]
}
