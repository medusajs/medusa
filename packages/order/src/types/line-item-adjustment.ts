export interface CreateOrderLineItemAdjustmentDTO {
  item_id: string
  amount: number
  code?: string
  description?: string
  promotion_id?: string
  provider_id?: string
}

export interface UpdateOrderLineItemAdjustmentDTO
  extends Partial<CreateOrderLineItemAdjustmentDTO> {
  id: string
}
