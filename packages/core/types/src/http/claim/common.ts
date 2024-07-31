import { OperatorMap } from "../../dal"
import { FindParams } from "../common"
import { ClaimReason, ReturnDTO } from "../../order"
import { BaseOrder } from "../order/common"
import { BigNumberRawValue } from "../../totals"

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

export interface BaseClaim
  extends Omit<BaseOrder, "status" | "version" | "items"> {
  order_id: string
  claim_items: BaseClaimItem
  additional_items: any[]
  return?: ReturnDTO
  return_id?: string
  no_notification?: boolean
  refund_amount?: number
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
