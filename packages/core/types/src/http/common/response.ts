export type DeleteResponse<TObject extends string> = {
  /**
   * The ID of the item that was deleted.
   */
  id: string

  /**
   * The type of the item that was deleted.
   */
  object: TObject

  /**
   * Whether the item was deleted successfully.
   */
  deleted: boolean
}

export type DeleteResponseWithParent<
  TObject extends string,
  TParent = {}
> = DeleteResponse<TObject> & {
  /**
   * The parent resource of the item that was deleted, if applicable.
   */
  parent?: TParent
}

export type PaginatedResponse<T> = {
  /**
   * The maximum number of items retrieved.
   */
  limit: number
  /**
   * The number of items to skip before retrieving the returned items.
   */
  offset: number
  /**
   * The total number of items.
   */
  count: number
  /**
   * The estimated count retrieved from the PostgreSQL query planner, which may be inaccurate.
   * 
   * @featureFlag index_engine
   * @since 2.8.0
   * @deprecated Use `count` instead. This property will be removed in the next minor release.
   */
  estimate_count?: number
} & T

export type BatchResponse<T> = {
  /**
   * The items that were created.
   */
  created: T[]
  /**
   * The items that were updated.
   */
  updated: T[]
  /**
   * Details of the items that were deleted.
   */
  deleted: {
    /**
     * The IDs of the items that were deleted.
     */
    ids: string[]
    /**
     * The type of the items that were deleted.
     *
     * @example
     * "product"
     */
    object: string
    /**
     * Whether the items were deleted successfully.
     */
    deleted: boolean
  }
}
