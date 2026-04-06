export interface AdminCreateCollection {
  /**
   * The collection's title.
   */
  title: string
  /**
   * The collection's handle.
   */
  handle?: string
  /**
   * Key-value pairs of custom data.
   */
  metadata?: Record<string, unknown> | null
}

export interface AdminUpdateCollection {
  /**
   * The collection's title.
   */
  title?: string
  /**
   * The collection's handle.
   */
  handle?: string
  /**
   * Key-value pairs of custom data.
   */
  metadata?: Record<string, unknown> | null
}

export interface AdminUpdateCollectionProducts {
  /**
   * IDs of products to add to the collection.
   */
  add?: string[]
  /**
   * IDs of products to remove from the collection.
   */
  remove?: string[]
}
