import { OperatorMap } from "../../dal"
import { FindParams } from "../common"
import {
  BaseOrder,
  BaseOrderShippingMethod,
  BaseOrderTransaction,
} from "../order/common"
import { AdminReturn, AdminReturnItem } from "../return"

export interface BaseExchangeItem {
  id: string
  exchange_id: string
  order_id: string
  item_id: string
  quantity: number
  metadata?: Record<string, unknown>
  created_at: string | null
  updated_at: string | null
}

export interface BaseExchange {
  id: string
  order_id: string
  return_id?: string
  display_id?: string
  order_version?: string
  created_by?: string
  created_at: Date | string
  updated_at: Date | string
  canceled_at: Date | string
  deleted_at: Date | string
  additional_items: BaseExchangeItem[]
  return_items: AdminReturnItem[]
  no_notification?: boolean
  difference_due?: number
  return?: AdminReturn
  order?: BaseOrder
  allow_backorder?: boolean
  shipping_methods?: BaseOrderShippingMethod[]
  transactions?: BaseOrderTransaction[]
  metadata?: Record<string, unknown>
}

export interface BaseExchangeListParams extends FindParams {
  q?: string
  id?: string | string[]
  order_id?: string | string[]
  status?: string | string[]
  created_at?: OperatorMap<string>
  updated_at?: OperatorMap<string>
  deleted_at?: OperatorMap<string>
}
