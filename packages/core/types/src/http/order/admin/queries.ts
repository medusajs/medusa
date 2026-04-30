import { OperatorMap } from "../../../dal"
import { FindParams, SelectParams } from "../../common"
import { BaseOrderChangesFilters, BaseOrderFilters } from "../common"

export interface AdminOrderFilters extends FindParams, BaseOrderFilters {
  /**
   * Filter by order ID(s).
   */
  id?: string[] | string
  /**
   * Filter by sales channel IDs to retrieve their associated orders.
   */
  sales_channel_id?: string[]
  /**
   * Filter by region IDs to retrieve their associated orders.
   */
  region_id?: string[] | string
  /**
   * Filter by customer IDs to retrieve their associated orders.
   */
  customer_id?: string[] | string
  /**
   * Query or keywords to filter the order's searchable fields.
   */
  q?: string
  /**
   * Apply filters on the fulfillment's creation date.
   */
  created_at?: OperatorMap<string>
  /**
   * Apply filters on the fulfillment's update date.
   */
  updated_at?: OperatorMap<string>
}

export interface AdminOrderItemsFilters extends SelectParams {
  /**
   * Filter by order item ID(s).
   */
  id?: string[] | string
  /**
   * Filter by the associated line item ID(s).
   */
  item_id?: string[] | string
  /**
   * Filter by order version(s).
   */
  version?: number[] | number
}

export interface AdminOrderChangesFilters
  extends BaseOrderChangesFilters,
    SelectParams {
  /**
   * Apply filters on the change's creation date.
   */
  created_at?: OperatorMap<string>
  /**
   * Apply filters on the change's update date.
   */
  updated_at?: OperatorMap<string>
  /**
   * Apply filters on the change's deletion date.
   */
  deleted_at?: OperatorMap<string>
}

export interface AdminGetOrderParams extends SelectParams {
  /**
   * The version of the order to retrieve.
   */
  version?: number
}
export interface AdminGetOrderDetailsParams extends SelectParams {
  /**
   * The version of the order to retrieve details for.
   */
  version?: number
}

/**
 * The filters to apply when retrieving order changes.
 */
export interface AdminOrderChangeParams extends SelectParams {
  /**
   * Filter by change status(es).
   */
  status?: string | string[] | undefined
  /**
   * Apply filters on the change's creation date.
   */
  created_at?: any
  /**
   * Filter by change ID(s).
   */
  id?: string | string[] | undefined
  /**
   * Apply filters on the change's update date.
   */
  updated_at?: any
  /**
   * Apply filters on the change's deletion date.
   */
  deleted_at?: any
  /**
   * Filter by change type(s).
   */
  change_type?: string | string[] | undefined
}

/**
 * The filters to apply when retrieving order shipping options.
 */
export interface AdminGetOrderShippingOptionList {}
