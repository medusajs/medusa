/**
 * The data to create a product tag.
 */
export interface AdminCreateProductTag {
  /**
   * The tag's value.
   */
  value: string
  /**
   * An external ID for the tag.
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
 * The data to update a product tag.
 */
export interface AdminUpdateProductTag {
  /**
   * The tag's value.
   */
  value?: string
  /**
   * An external ID for the tag.
   *
   * @since 2.13.7
   */
  external_id?: string | null
  /**
   * Key-value pairs of custom data.
   */
  metadata?: Record<string, unknown> | null
}
