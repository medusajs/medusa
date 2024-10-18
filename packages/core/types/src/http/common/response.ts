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
} & T

export type BatchResponse<T> = {
  created: T[]
  updated: T[]
  deleted: {
    ids: string[]
    object: string
    deleted: boolean
  }
}
