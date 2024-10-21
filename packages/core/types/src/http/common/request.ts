export interface SelectParams {
  /**
   * The fields and relations to retrieve.
   * 
   * Learn more in the [API reference](https://docs.medusajs.com/v2/api/store#select-fields-and-relations).
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
}

export interface AdminBatchLink {
  add?: string[]
  remove?: string[]
}
