import { ClaimReason } from "../../order/mutations"
import { BigNumberInput } from "../../totals"

interface NewItem {
  variant_id: string
  quantity: BigNumberInput
  unit_price?: BigNumberInput
  internal_note?: string
  metadata?: Record<string, any> | null
}

interface ExistingItem {
  id: string
  quantity: BigNumberInput
  internal_note?: string
}

export interface OrderExchangeAddNewItemWorkflowInput {
  exchange_id: string
  items: NewItem[]
}

export interface OrderClaimAddNewItemWorkflowInput {
  claim_id: string
  items: NewItem[]
}

export interface OrderExchangeAddNewItemWorkflowInput {
  exchange_id: string
  items: NewItem[]
}

export interface OrderAddLineItemWorkflowInput {
  order_id: string
  items: NewItem[]
}

export interface UpdateExchangeAddNewItemWorkflowInput {
  exchange_id: string
  action_id: string
  data: {
    quantity?: BigNumberInput
    internal_note?: string | null
  }
}

export interface UpdateClaimAddNewItemWorkflowInput {
  claim_id: string
  action_id: string
  data: {
    quantity?: BigNumberInput
    internal_note?: string | null
  }
}

export interface UpdateExchangeAddNewItemWorkflowInput {
  exchange_id: string
  action_id: string
  data: {
    quantity?: BigNumberInput
    internal_note?: string | null
  }
}

export interface OrderExchangeItemWorkflowInput {
  exchange_id: string
  items: ExistingItem[]
}

export interface UpdateExchangeAddItemWorkflowInput {
  exchange_id: string
  action_id: string
  data: {
    quantity?: BigNumberInput
    internal_note?: string | null
  }
}

export interface OrderClaimItemWorkflowInput {
  claim_id: string
  items: (ExistingItem & { reason?: ClaimReason })[]
}

export interface UpdateClaimItemWorkflowInput {
  claim_id: string
  action_id: string
  data: {
    quantity?: BigNumberInput
    reason_id?: ClaimReason
    internal_note?: string | null
  }
}

export interface DeleteOrderExchangeItemActionWorkflowInput {
  exchange_id: string
  action_id: string
}

export interface DeleteOrderClaimItemActionWorkflowInput {
  claim_id: string
  action_id: string
}

export interface DeleteOrderExchangeItemActionWorkflowInput {
  exchange_id: string
  action_id: string
}
