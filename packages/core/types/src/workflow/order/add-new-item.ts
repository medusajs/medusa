import { BigNumberInput } from "../../totals"

export interface OrderExchangeAddNewItemWorkflowInput {
  exchange_id: string
  items: {
    variant_id: string
    quantity: BigNumberInput
    unit_price?: BigNumberInput
    internal_note?: string
    metadata?: Record<string, any> | null
  }[]
}

export interface OrderClaimAddNewItemWorkflowInput {
  claim_id: string
  items: {
    variant_id: string
    quantity: BigNumberInput
    unit_price?: BigNumberInput
    internal_note?: string
    metadata?: Record<string, any> | null
  }[]
}

export interface OrderAddLineItemWorkflowInput {
  order_id: string
  items: {
    variant_id: string
    quantity: BigNumberInput
    unit_price?: BigNumberInput
    internal_note?: string
    metadata?: Record<string, any> | null
  }[]
}
