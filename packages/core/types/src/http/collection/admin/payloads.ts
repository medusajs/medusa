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
   * An external ID for the collection.
   */
  external_id?: string | null
  /**
   * Key-value pairs of custom data.
   */
  metadata?: Record<string, any>
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
   * An external ID for the collection.
   */
  external_id?: string | null
  /**
   * Key-value pairs of custom data.
   */
  metadata?: Record<string, any> | null
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
