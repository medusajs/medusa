import { ShippingOptionDTO } from "./shipping-option"
import { FulfillmentProviderDTO } from "./fulfillment-provider"
import { FulfillmentAddressDTO } from "./address"
import { FulfillmentItemDTO } from "./fulfillment-item"
import { FulfillmentLabelDTO } from "./fulfillment-label"
import { BaseFilterable, OperatorMap } from "../../dal"

/**
 * The fulfillment details.
 */
export interface FulfillmentDTO {
  /**
   * The ID of the fulfillment.
   */
  id: string

  /**
   * The associated location's ID.
   */
  location_id: string

  /**
   * The date the fulfillment was packed.
   */
  packed_at: Date | null

  /**
   * The date the fulfillment was shipped.
   */
  shipped_at: Date | null

  /**
   * The date the fulfillment was delivered.
   */
  delivered_at: Date | null

  /**
   * The date the fulfillment was canceled.
   */
  canceled_at: Date | null

  /**
   * The data necessary for the fulfillment provider to process
   * the fulfillment.
   */
  data: Record<string, unknown> | null

  /**
   * The associated fulfillment provider's ID.
   */
  provider_id: string

  /**
   * The associated shipping option's ID.
   */
  shipping_option_id: string | null

  /**
   * Holds custom data in key-value pairs.
   */
  metadata: Record<string, unknown> | null

  /**
   * The associated shipping option.
   */
  shipping_option: ShippingOptionDTO | null

  /**
   * The associated fulfillment provider.
   */
  provider: FulfillmentProviderDTO

  /**
   * The associated fulfillment address used for delivery.
   */
  delivery_address: FulfillmentAddressDTO

  /**
   * The items of the fulfillment.
   */
  items: FulfillmentItemDTO[]

  /**
   * The labels of the fulfillment.
   */
  labels: FulfillmentLabelDTO[]

  /**
   * The creation date of the fulfillment.
   */
  created_at: Date

  /**
   * The update date of the fulfillment.
   */
  updated_at: Date

  /**
   * The deletion date of the fulfillment.
   */
  deleted_at: Date | null
}

/**
 * The filters to apply on the retrieved fulfillments.
 */
export interface FilterableFulfillmentProps
  extends BaseFilterable<FilterableFulfillmentProps> {
  /**
   * The IDs to filter the fulfillments by.
   */
  id?: string | string[] | OperatorMap<string | string[]>

  /**
   * Filter the fulfillments by the ID of their associated location.
   */
  location_id?: string | string[] | OperatorMap<string | string[]>

  /**
   * Filter the fulfillments by their packing date.
   */
  packed_at?: Date | OperatorMap<string | string[]>

  /**
   * Filter the fulfillments by their shipping date.
   */
  shipped_at?: Date | OperatorMap<string | string[]>

  /**
   * Filter the fulfillments by their delivery date.
   */
  delivered_at?: Date | OperatorMap<string | string[]>

  /**
   * Filter the fulfillments by their cancelation date.
   */
  canceled_at?: Date | OperatorMap<string | string[]>

  /**
   * Filter the fulfillments by the ID of their associated fulfillment provider.
   */
  provider_id?: string | string[] | OperatorMap<string | string[]>

  /**
   * Filter the fulfillments by the ID of their associated shipping option.
   */
  shipping_option_id?: string | null

  /**
   * Filter the fulfillments by their creation date.
   */
  created_at?: Date | OperatorMap<string | string[]>

  /**
   * Filter the fulfillments by their update date.
   */
  updated_at?: Date | OperatorMap<string | string[]>
}
