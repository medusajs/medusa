import { OperatorMap } from "../../../dal";
import { BaseOrderFilters } from "../common";

export interface AdminOrderFilters extends BaseOrderFilters {
  sales_channel_id?: string[]
  fulfillment_status?: string[]
  payment_status?: string[]
  region_id?: string[]
  q?: string
  created_at?: OperatorMap<string>
  updated_at?: OperatorMap<string>
}