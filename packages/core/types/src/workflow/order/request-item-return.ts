import { CreateReturnItem } from "./create-return-order"

export interface RequestItemReturnWorkflowInput {
  return_id: string
  items: CreateReturnItem[]
}
export interface DeleteRequestItemReturnWorkflowInput {
  return_id: string
  action_id: string
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
