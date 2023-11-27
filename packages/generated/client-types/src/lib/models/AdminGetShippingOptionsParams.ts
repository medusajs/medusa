/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

export interface AdminGetShippingOptionsParams {
  /**
   * Filter by a region ID.
   */
  region_id?: string
  /**
   * Filter by whether the shipping option is used for returns or orders.
   */
  is_return?: boolean
  /**
   * Filter by whether the shipping option is used only by admins or not.
   */
  admin_only?: boolean
}
