import { BaseFilterable, OperatorMap } from "../../../dal"
import { FindParams, SelectParams } from "../../common"

export interface AdminDraftOrderParams extends SelectParams {}

export interface AdminDraftOrderListParams
  extends FindParams, BaseFilterable<AdminDraftOrderListParams> {
  /**
   * Filter by draft order ID(s).
   */
  id?: string | string[]
  /**
   * Query or keywords to filter the draft order's searchable fields.
   */
  q?: string
  /**
   * Filter by region IDs to retrieve their associated draft orders.
   */
  region_id?: string[] | string
  /**
   * Filter by customer IDs to retrieve their associated draft orders.
   */
  customer_id?: string[] | string
  /**
   * Filter by sales channel IDs to retrieve their associated draft orders.
   */
  sales_channel_id?: string[]
  /**
   * Apply filters on the draft order's creation date.
   */
  created_at?: OperatorMap<string>
  /**
   * Apply filters on the draft order's update date.
   */
  updated_at?: OperatorMap<string>
}
