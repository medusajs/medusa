/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

export interface AdminGetShippingOptionsParams {
  /**
   * Region ID to fetch options from
   */
  region_id?: string
  /**
   * Flag for fetching return options only
   */
  is_return?: boolean
  /**
   * Flag for fetching admin specific options
   */
  admin_only?: boolean
}
