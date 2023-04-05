/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

export interface StoreGetShippingOptionsParams {
  /**
   * Whether return Shipping Options should be included. By default all Shipping Options are returned.
   */
  is_return?: boolean
  /**
   * A comma separated list of Product ids to filter Shipping Options by.
   */
  product_ids?: string
  /**
   * the Region to retrieve Shipping Options from.
   */
  region_id?: string
}
