/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

export interface AdminPostShippingOptionsReq {
  /**
   * The name of the Shipping Option
   */
  name: string
  /**
   * The ID of the Region in which the Shipping Option will be available.
   */
  region_id: string
  /**
   * The ID of the Fulfillment Provider that handles the Shipping Option.
   */
  provider_id: string
  /**
   * The ID of the Shipping Profile to add the Shipping Option to.
   */
  profile_id?: number
  /**
   * The data needed for the Fulfillment Provider to handle shipping with this Shipping Option.
   */
  data: Record<string, any>
  /**
   * The type of the Shipping Option price.
   */
  price_type: "flat_rate" | "calculated"
  /**
   * The amount to charge for the Shipping Option.
   */
  amount?: number
  /**
   * The requirements that must be satisfied for the Shipping Option to be available.
   */
  requirements?: Array<{
    /**
     * The type of the requirement
     */
    type: "max_subtotal" | "min_subtotal"
    /**
     * The amount to compare with.
     */
    amount: number
  }>
  /**
   * Whether the Shipping Option defines a return shipment.
   */
  is_return?: boolean
  /**
   * If true, the option can be used for draft orders
   */
  admin_only?: boolean
  /**
   * An optional set of key-value pairs with additional information.
   */
  metadata?: Record<string, any>
  /**
   * [EXPERIMENTAL] Tax included in prices of shipping option
   */
  includes_tax?: boolean
}
