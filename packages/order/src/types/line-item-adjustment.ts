import { BigNumberInput } from "@medusajs/types"

export interface CreateOrderLineItemAdjustmentDTO {
  item_id: string
  amount: BigNumberInput
  code?: string
  description?: string
  promotion_id?: string
  provider_id?: string
}

export interface UpdateOrderLineItemAdjustmentDTO
  extends Partial<CreateOrderLineItemAdjustmentDTO> {
  id: string
}
