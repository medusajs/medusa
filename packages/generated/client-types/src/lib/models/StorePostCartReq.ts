/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

/**
 * The details of the cart to be created.
 */
export interface StorePostCartReq {
  /**
   * The ID of the Region to create the Cart in. Setting the cart's region can affect the pricing of the items in the cart as well as the used currency. If this parameter is not provided, the first region in the store is used by default.
   */
  region_id?: string
  /**
   * The ID of the Sales channel to create the Cart in. The cart's sales channel affects which products can be added to the cart. If a product does not exist in the cart's sales channel, it cannot be added to the cart. If you add a publishable API key in the header of this request and specify a sales channel ID, the specified sales channel must be within the scope of the publishable API key's resources. If you add a publishable API key in the header of this request, you don't specify a sales channel ID, and the publishable API key is associated with one sales channel, that sales channel will be attached to the cart. If no sales channel is passed and no publishable API key header is passed or the publishable API key isn't associated with any sales channel, the cart will not be associated with any sales channel.
   */
  sales_channel_id?: string
  /**
   * The two character ISO country code to create the Cart in. Setting this parameter will set the country code of the shipping address.
   */
  country_code?: string
  /**
   * An array of product variants to generate line items from.
   */
  items?: Array<{
    /**
     * The ID of the Product Variant.
     */
    variant_id: string
    /**
     * The quantity to add into the cart.
     */
    quantity: number
  }>
  /**
   * An object to provide context to the Cart. The `context` field is automatically populated with `ip` and `user_agent`
   */
  context?: Record<string, any>
}
