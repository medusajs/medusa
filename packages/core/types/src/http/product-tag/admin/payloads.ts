export interface AdminCreateProductTag {
  /**
   * The tag's value.
   */
  value: string
  /**
   * An external ID for the tag.
   */
  external_id?: string | null
  /**
   * Key-value pairs of custom data.
   */
  metadata?: Record<string, unknown> | null
}

export interface AdminUpdateProductTag {
  /**
   * The tag's value.
   */
  value?: string
  /**
   * An external ID for the tag.
   */
  external_id?: string | null
  /**
   * Key-value pairs of custom data.
   */
  metadata?: Record<string, unknown> | null
}
