/**
 * @interface
 *
 * The product option value's data.
 */
export interface UpdateProductOptionValueDTO {
  /**
   * The ID of the product option value.
   */
  id: string
  /**
   * The value of the product option value.
   */
  value: string
  /**
   * The associated product option.
   *
   * @expandable
   */
  option: string
  /**
   * Holds custom data in key-value pairs.
   */
  metadata?: Record<string, unknown> | null
}

export interface CreateProductOptionValueDTO {
  /**
   * The ID of the product option value.
   */
  id?: string
  /**
   * The value of the product option value.
   */
  value: string
  /**
   * The associated product option.
   *
   * @expandable
   */
  option: string
  /**
   * The associated product option.
   *
   * @expandable
   */
  variant: string
  /**
   * Holds custom data in key-value pairs.
   */
  metadata?: Record<string, unknown> | null
}
