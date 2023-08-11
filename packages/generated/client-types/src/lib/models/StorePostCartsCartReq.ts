/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

import type { AddressPayload } from "./AddressPayload"

export interface StorePostCartsCartReq {
  /**
   * The ID of the Region to create the Cart in. Setting the cart's region can affect the pricing of the items in the cart as well as the used currency.
   */
  region_id?: string
  /**
   * The 2 character ISO country code to create the Cart in. Setting this parameter will set the country code of the shipping address.
   */
  country_code?: string
  /**
   * An email to be used on the Cart.
   */
  email?: string
  /**
   * The ID of the Sales channel to create the Cart in. The cart's sales channel affects which products can be added to the cart. If a product does not exist in the cart's sales channel, it cannot be added to the cart. If you add a publishable API key in the header of this request and specify a sales channel ID, the specified sales channel must be within the scope of the publishable API key's resources.
   */
  sales_channel_id?: string
  /**
   * The Address to be used for billing purposes.
   */
  billing_address?: AddressPayload | string
  /**
   * The Address to be used for shipping purposes.
   */
  shipping_address?: AddressPayload | string
  /**
   * An array of Gift Card codes to add to the Cart.
   */
  gift_cards?: Array<{
    /**
     * The code of a gift card.
     */
    code: string
  }>
  /**
   * An array of Discount codes to add to the Cart.
   */
  discounts?: Array<{
    /**
     * The code of the discount.
     */
    code: string
  }>
  /**
   * The ID of the Customer to associate the Cart with.
   */
  customer_id?: string
  /**
   * An object to provide context to the Cart. The `context` field is automatically populated with `ip` and `user_agent`
   */
  context?: Record<string, any>
}
