export interface AdminCreateProductType {
  /**
   * The type's value.
   */
  value: string
  /**
   * An external ID for the product type.
   */
  external_id?: string | null
  /**
   * Key-value pairs of custom data.
   */
  metadata?: Record<string, unknown> | null
}

export interface AdminUpdateProductType {
  /**
   * The type's value.
   */
  value?: string
  /**
   * An external ID for the product type.
   */
  external_id?: string | null
  /**
   * Key-value pairs of custom data.
   */
  metadata?: Record<string, unknown> | null
}
