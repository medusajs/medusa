import { ClaimReason } from "../../order/mutations"
import { BigNumberInput } from "../../totals"

interface NewItem {
  variant_id: string
  quantity: BigNumberInput
  unit_price?: BigNumberInput | null
  compare_at_unit_price?: BigNumberInput | null
  internal_note?: string | null
  metadata?: Record<string, any> | null
}

interface ExistingItem {
  id: string
  quantity: BigNumberInput
  unit_price?: BigNumberInput | null
  compare_at_unit_price?: BigNumberInput | null
  internal_note?: string | null
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

export interface OrderEditAddNewItemWorkflowInput {
  order_id: string
  items: NewItem[]
}

export interface OrderEditUpdateItemQuantityWorkflowInput {
  order_id: string
  items: ExistingItem[]
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

export interface UpdateOrderEditAddNewItemWorkflowInput {
  order_id: string
  action_id: string
  data: {
    quantity?: BigNumberInput
    unit_price?: BigNumberInput | null
    compare_at_unit_price?: BigNumberInput | null
    internal_note?: string | null
  }
}

export interface UpdateOrderEditItemQuantityWorkflowInput
  extends UpdateOrderEditAddNewItemWorkflowInput {}

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
    reason_id?: string | null
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

export interface DeleteOrderEditItemActionWorkflowInput {
  order_id: string
  action_id: string
}
