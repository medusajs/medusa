/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

export interface StoreGetVariantsVariantParams {
  /**
   * The id of the Cart to set prices based on.
   */
  cart_id?: string
  /**
   * A sales channel id for result configuration.
   */
  sales_channel_id?: string
  /**
   * The id of the Region to set prices based on.
   */
  region_id?: string
  /**
   * The 3 character ISO currency code to set prices based on.
   */
  currency_code?: string
}
