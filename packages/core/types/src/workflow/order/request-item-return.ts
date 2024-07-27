import { BigNumberInput } from "../../totals"
import { CreateReturnItem } from "./create-return-order"

export interface RequestItemReturnWorkflowInput {
  return_id: string
  claim_id?: string
  exchange_id?: string
  items: CreateReturnItem[]
}
export interface DeleteRequestItemReturnWorkflowInput {
  return_id: string
  action_id: string
}

export interface UpdateRequestItemReturnWorkflowInput {
  return_id: string
  claim_id?: string
  exchange_id?: string
  action_id: string
  data: {
    quantity?: BigNumberInput
    internal_note?: string | null
    reason_id?: string | null
  }
}

export interface OrderExchangeRequestItemReturnWorkflowInput {
  return_id: string
  exchange_id: string
  items: CreateReturnItem[]
}
export interface DeleteOrderExchangeRequestItemReturnWorkflowInput {
  return_id: string
  action_id: string
}

export interface OrderClaimRequestItemReturnWorkflowInput {
  return_id: string
  claim_id: string
  items: CreateReturnItem[]
}
export interface DeleteOrderClaimRequestItemReturnWorkflowInput {
  return_id: string
  action_id: string
}
