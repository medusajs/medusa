export interface CreateLineItemAdjustmentDTO {
  item_id: string
  amount: number
  code?: string
  description?: string
  promotion_id?: string
  provider_id?: string
}

export interface UpdateLineItemAdjustmentDTO
  extends Partial<CreateLineItemAdjustmentDTO> {
  id: string
}
