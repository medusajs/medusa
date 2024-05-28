import { OrderDTO } from "../../order"
import { CreateFulfillmentAddressDTO } from "./fulfillment-address"
import { CreateFulfillmentItemDTO } from "./fulfillment-item"
import { CreateFulfillmentLabelDTO } from "./fulfillment-label"

/**
 * The fulfillment to be created.
 */
export interface CreateFulfillmentDTO {
  /**
   * The associated location's ID.
   */
  location_id: string

  /**
   * The date the fulfillment was packed.
   */
  packed_at?: Date | null

  /**
   * The date the fulfillment was shipped.
   */
  shipped_at?: Date | null

  /**
   * The date the fulfillment was delivered.
   */
  delivered_at?: Date | null

  /**
   * The date the fulfillment was canceled.
   */
  canceled_at?: Date | null

  /**
   * The data necessary for the associated fulfillment provider to process the fulfillment.
   */
  data?: Record<string, unknown> | null

  /**
   * The associated fulfillment provider's ID.
   */
  provider_id: string

  /**
   * The associated shipping option's ID.
   */
  shipping_option_id?: string | null

  /**
   * Holds custom data in key-value pairs.
   */
  metadata?: Record<string, unknown> | null

  /**
   * The address associated with the fulfillment. It's used for delivery.
   */
  delivery_address: Omit<CreateFulfillmentAddressDTO, "fulfillment_id">

  /**
   * The items associated with the fulfillment.
   */
  items: Omit<CreateFulfillmentItemDTO, "fulfillment_id">[]

  /**
   * The labels associated with the fulfillment.
   */
  labels: Omit<CreateFulfillmentLabelDTO, "fulfillment_id">[]

  /**
   * The associated order to be sent to the provider.
   */
  order?: Partial<OrderDTO>
}

/**
 * The attributes to update in the fulfillment.
 */
export interface UpdateFulfillmentDTO {
  /**
   * The associated location's ID.
   */
  location_id?: string

  /**
   * The date the fulfillment was packed.
   */
  packed_at?: Date | null

  /**
   * The date the fulfillment was shipped.
   */
  shipped_at?: Date | null

  /**
   * The date the fulfillment was delivered.
   */
  delivered_at?: Date | null

  /**
   * The data necessary for the associated fulfillment provider to process the fulfillment.
   */
  data?: Record<string, unknown> | null

  /**
   * Holds custom data in key-value pairs.
   */
  metadata?: Record<string, unknown> | null

  /**
   * The labels associated with the fulfillment.
   */
  labels?: Omit<CreateFulfillmentLabelDTO, "fulfillment_id">[]
}
