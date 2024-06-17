export type DeleteResponse<TObject extends string, TParent = {}> = {
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

  /**
   * The parent resource of the item that was deleted, if applicable.
   */
  parent?: TParent
}

export type PaginatedResponse<T> = {
  limit: number
  offset: number
  count: number
} & T
