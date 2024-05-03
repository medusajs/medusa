/**
 * The fields returned in the response of a DELETE request.
 */
export type DeleteResponse<T = string> = {
  /**
   * The ID of the item that was deleted.
   */
  id: string

  /**
   * The type of the item that was deleted.
   */
  object: string

  /**
   * Whether the item was deleted successfully.
   */
  deleted: boolean
}
