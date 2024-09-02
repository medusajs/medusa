import { OperatorMap } from "../../../dal"
import { FindParams } from "../../common"
import { BaseOrderFilters } from "../common"
import { BaseOrderChangesFilters } from "../common"

export interface AdminOrderFilters extends FindParams, BaseOrderFilters {
  id?: string[] | string
  name?: string[] | string
  sales_channel_id?: string[]
  fulfillment_status?: string[]
  payment_status?: string[]
  region_id?: string[]
  q?: string
  created_at?: OperatorMap<string>
  updated_at?: OperatorMap<string>
}


export interface AdminOrderChangesFilters extends BaseOrderChangesFilters {}
