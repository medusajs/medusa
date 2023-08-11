/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

export interface AdminPostShippingOptionsOptionReq {
  /**
   * The name of the Shipping Option
   */
  name?: string
  /**
   * The amount to charge for the Shipping Option. If the `price_type` of the shipping option is `calculated`, this amount will not actually be used.
   */
  amount?: number
  /**
   * If set to `true`, the shipping option can only be used when creating draft orders.
   */
  admin_only?: boolean
  /**
   * An optional set of key-value pairs with additional information.
   */
  metadata?: Record<string, any>
  /**
   * The requirements that must be satisfied for the Shipping Option to be available.
   */
  requirements: Array<{
    /**
     * The ID of an existing requirement. If an ID is passed, the existing requirement's details are updated. Otherwise, a new requirement is created.
     */
    id?: string
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
   * Tax included in prices of shipping option
   */
  includes_tax?: boolean
}
