/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

export interface StorePostCartsCartShippingMethodReq {
  /**
   * ID of the shipping option to create the method from.
   */
  option_id: string
  /**
   * Used to hold any data that the shipping method may need to process the fulfillment of the order. This depends on the fulfillment provider you're using.
   */
  data?: Record<string, any>
}
