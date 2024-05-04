/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

export interface StoreGetShippingOptionsParams {
  /**
   * Whether return shipping options should be included. By default, all shipping options are returned.
   */
  is_return?: boolean
  /**
   * "Comma-separated list of Product IDs to filter Shipping Options by. If provided, only shipping options that can be used with the provided products are retrieved."
   */
  product_ids?: string
  /**
   * "The ID of the region that the shipping options belong to. If not provided, all shipping options are retrieved."
   */
  region_id?: string
}
