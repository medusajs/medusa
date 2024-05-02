/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

/**
 * The shipping method's details.
 */
export interface AdminPostOrdersOrderShippingMethodsReq {
  /**
   * The price (excluding VAT) that should be charged for the Shipping Method
   */
  price: number
  /**
   * The ID of the Shipping Option to create the Shipping Method from.
   */
  option_id: string
  /**
   * The data required for the Shipping Option to create a Shipping Method. This depends on the Fulfillment Provider.
   */
  data?: Record<string, any>
}
