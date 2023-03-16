/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

export interface StorePostCartsCartShippingMethodReq {
  /**
   * ID of the shipping option to create the method from
   */
  option_id: string
  /**
   * Used to hold any data that the shipping method may need to process the fulfillment of the order. Look at the documentation for your installed fulfillment providers to find out what to send.
   */
  data?: Record<string, any>
}
