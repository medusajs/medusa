/**
 * The data to create a collection.
 */
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
   *
   * @since 2.13.7
   */
  external_id?: string | null
  /**
   * Key-value pairs of custom data.
   */
  metadata?: Record<string, unknown> | null
}

/**
 * The data to update a collection.
 */
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
   *
   * @since 2.13.7
   */
  external_id?: string | null
  /**
   * Key-value pairs of custom data.
   */
  metadata?: Record<string, unknown> | null
}

/**
 * The data to update the products associated with a collection.
 */
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
