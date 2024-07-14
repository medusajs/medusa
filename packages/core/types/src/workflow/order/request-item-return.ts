import { CreateReturnItem } from "./create-return-order"

export interface RequestItemReturnWorkflowInput {
  return_id: string
  items: CreateReturnItem[]
}

export interface OrderExchangeRequestItemReturnWorkflowInput {
  exchange_id: string
  items: CreateReturnItem[]
}

export interface OrderClaimRequestItemReturnWorkflowInput {
  claim_id: string
  items: CreateReturnItem[]
}
