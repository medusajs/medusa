import { OperatorMap } from "../../dal"
import { ClaimReason, OrderClaimType } from "../../order"
import { BigNumberRawValue } from "../../totals"
import { FindParams } from "../common"
import {
  BaseOrder,
  BaseOrderShippingMethod,
  BaseOrderTransaction,
} from "../order/common"
import { BaseReturn } from "../return/common"

export interface BaseClaimItem {
  id: string
  claim_id: string
  order_id: string
  item_id: string
  quantity: number
  reason: ClaimReason
  raw_quantity: BigNumberRawValue
  metadata?: Record<string, unknown> | null
  created_at?: Date | string
  updated_at?: Date | string
}

export interface BaseClaim {
  id: string
  type: OrderClaimType
  order_id: string
  return_id?: string
  display_id: string
  order_version: string
  refund_amount?: number
  created_by?: string
  created_at: Date | string
  updated_at: Date | string
  canceled_at: Date | string
  deleted_at?: Date | string
  additional_items: BaseClaimItem[]
  claim_items: BaseClaimItem[]
  no_notification?: boolean
  order?: BaseOrder
  return?: BaseReturn
  shipping_methods?: BaseOrderShippingMethod[]
  transactions?: BaseOrderTransaction[]
  metadata?: Record<string, unknown> | null
}

export interface BaseClaimListParams extends FindParams {
  q?: string
  id?: string | string[]
  order_id?: string | string[]
  status?: string | string[]
  created_at?: OperatorMap<string>
  updated_at?: OperatorMap<string>
  deleted_at?: OperatorMap<string>
}
