/**
 * The data to create a product type.
 */
export interface AdminCreateProductType {
  /**
   * The type's value.
   */
  value: string
  /**
   * An external ID for the product type.
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
 * The data to update a product type.
 */
export interface AdminUpdateProductType {
  /**
   * The type's value.
   */
  value?: string
  /**
   * An external ID for the product type.
   *
   * @since 2.13.7
   */
  external_id?: string | null
  /**
   * Key-value pairs of custom data.
   */
  metadata?: Record<string, unknown> | null
}
