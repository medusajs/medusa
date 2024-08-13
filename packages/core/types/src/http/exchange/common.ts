import { BaseOrder } from "../order/common";
import { AdminBaseReturnItem, AdminReturn } from "../return";

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

export interface BaseExchange extends Omit<BaseOrder, "status" | "version" | "items"> {
  order_id: string
  return_items: AdminBaseReturnItem[]
  additional_items: BaseExchangeItem[]
  no_notification?: boolean
  difference_due?: number
  return?: AdminReturn
  return_id?: string
}