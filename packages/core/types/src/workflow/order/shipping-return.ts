import { BigNumberInput } from "../../totals"

export interface UpdateReturnShippingMethodWorkflowInput {
  return_id: string
  action_id: string
  data: {
    custom_price?: BigNumberInput
    internal_note?: string | null
    metadata?: Record<string, any> | null
  }
}

export interface DeleteReturnShippingMethodWorkflowInput {
  return_id: string
  action_id: string
}
