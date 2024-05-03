import { BaseFilterable, OperatorMap } from "../../dal"
import { ShippingOptionDTO } from "./shipping-option"

/**
 * The fulfillment provider details.
 */
export interface FulfillmentProviderDTO {
  /**
   * The ID of the fulfillment provider.
   */
  id: string

  /**
   * The name of the fulfillment provider.
   */
  name: string

  /**
   * Holds custom data in key-value pairs.
   */
  metadata: Record<string, unknown> | null

  /**
   * The shipping options associated with the fulfillment provider.
   */
  shipping_options: ShippingOptionDTO[]

  /**
   * The creation date of the fulfillment provider.
   */
  created_at: Date

  /**
   * The update date of the fulfillment provider.
   */
  updated_at: Date

  /**
   * The deletion date of the fulfillment provider.
   */
  deleted_at: Date | null
}

/**
 * The filters to apply on the retrieved fulfillment providers.
 */
export interface FilterableFulfillmentProviderProps
  extends BaseFilterable<FilterableFulfillmentProviderProps> {
  /**
   * The IDs to filter the provider by.
   */
  id?: string | string[] | OperatorMap<string | string[]>
}
