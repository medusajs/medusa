import { OperatorMap } from "../../../dal"
import { FulfillmentStatus, PaymentStatus } from "../../../order"
import { FindParams } from "../../common"
import { BaseOrderChangesFilters, BaseOrderFilters } from "../common"

export interface AdminOrderFilters extends FindParams, BaseOrderFilters {
  id?: string[] | string
  sales_channel_id?: string[]
  fulfillment_status?: FulfillmentStatus[]
  payment_status?: PaymentStatus[]
  region_id?: string[]
  q?: string
  created_at?: OperatorMap<string>
  updated_at?: OperatorMap<string>
}

export interface AdminOrderItemsFilters extends FindParams {
  id?: string[] | string
  item_id?: string[] | string
  order_id?: string[] | string
  version?: number[] | number
}

export interface AdminOrderChangesFilters extends BaseOrderChangesFilters {}

export interface AdminOrderItemsFilters extends FindParams {
  id?: string[] | string
  item_id?: string[] | string
  order_id?: string[] | string
  version?: number[] | number
}
