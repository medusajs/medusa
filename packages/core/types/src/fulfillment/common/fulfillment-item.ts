import { FulfillmentDTO } from "./fulfillment"

/**
 * The fulfillment item details.
 */
export interface FulfillmentItemDTO {
  /**
   * The ID of the fulfillment item.
   */
  id: string

  /**
   * The title of the fulfillment item.
   */
  title: string

  /**
   * The quantity of the fulfillment item.
   */
  quantity: number

  /**
   * The required quantity of the inventory item backing this fulfillment item,
   * snapshotted when the fulfillment was created. Used to derive the delivered
   * line item quantity even if the variant's inventory kit later changes.
   */
  required_quantity: number | null

  /**
   * The sku of the fulfillment item.
   */
  sku: string

  /**
   * The barcode of the fulfillment item.
   */
  barcode: string

  /**
   * The associated line item's ID.
   */
  line_item_id: string | null

  /**
   * The associated inventory item's ID.
   */
  inventory_item_id: string | null

  /**
   * The associated fulfillment's ID.
   */
  fulfillment_id: string

  /**
   * The associated fulfillment.
   */
  fulfillment: FulfillmentDTO

  /**
   * The creation date of the fulfillment item.
   */
  created_at: Date

  /**
   * The update date of the fulfillment item.
   */
  updated_at: Date

  /**
   * The deletion date of the fulfillment item.
   */
  deleted_at: Date | null
}
