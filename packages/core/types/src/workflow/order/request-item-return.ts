import { BigNumberInput } from "../../totals"
import { CreateReturnItem } from "./create-return-order"

export interface RequestItemReturnWorkflowInput {
  return_id: string
  items: CreateReturnItem[]
}
export interface DeleteRequestItemReturnWorkflowInput {
  return_id: string
  action_id: string
}

export interface UpdateRequestItemReturnWorkflowInput {
  return_id: string
  action_id: string
  data: {
    quantity?: BigNumberInput
    internal_note?: string | null
    reason_id?: string | null
    metadata?: Record<string, any> | null
  }
}

export interface OrderExchangeRequestItemReturnWorkflowInput {
  exchange_id: string
  items: CreateReturnItem[]
}
export interface DeleteOrderExchangeRequestItemReturnWorkflowInput {
  return_id: string
  action_id: string
}

export interface OrderClaimRequestItemReturnWorkflowInput {
  claim_id: string
  items: CreateReturnItem[]
}
export interface DeleteOrderClaimRequestItemReturnWorkflowInput {
  return_id: string
  action_id: string
}
