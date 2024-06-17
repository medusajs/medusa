export interface UpdateInventoryItemInput
  extends Partial<CreateInventoryItemInput> {
  id: string
}
/**
 * @interface
 *
 * The details of the inventory item to be created.
 */
export interface CreateInventoryItemInput {
  /**
   * The SKU of the inventory item.
   */
  sku?: string | null
  /**
   * The origin country of the inventory item.
   */
  origin_country?: string | null
  /**
   * The MID code of the inventory item.
   */
  mid_code?: string | null
  /**
   * The material of the inventory item.
   */
  material?: string | null
  /**
   * The weight of the inventory item.
   */
  weight?: number | null
  /**
   * The length of the inventory item.
   */
  length?: number | null
  /**
   * The height of the inventory item.
   */
  height?: number | null
  /**
   * The width of the inventory item.
   */
  width?: number | null
  /**
   * The title of the inventory item.
   */
  title?: string | null
  /**
   * The description of the inventory item.
   */
  description?: string | null
  /**
   * The thumbnail of the inventory item.
   */
  thumbnail?: string | null
  /**
   * Holds custom data in key-value pairs.
   */
  metadata?: Record<string, unknown> | null
  /**
   * The HS code of the inventory item.
   */
  hs_code?: string | null
  /**
   * Whether the inventory item requires shipping.
   */
  requires_shipping?: boolean
}
