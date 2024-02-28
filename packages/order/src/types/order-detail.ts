import { BigNumberInput } from "@medusajs/types"

export interface PartialUpsertOrderItemDTO {
  order_id?: string
  version?: number
  item_id?: string

  quantity?: BigNumberInput
  fulfilled_quantity?: BigNumberInput
  return_requested_quantity?: BigNumberInput
  return_received_quantity?: BigNumberInput
  return_dismissed_quantity?: BigNumberInput
  written_off_quantity?: BigNumberInput

  metadata?: Record<string, unknown>
}

export interface CreateOrderItemDTO extends PartialUpsertOrderItemDTO {
  order_id: string
  version: number
  item_id: string
  quantity: BigNumberInput
}

export interface UpdateOrderItemDTO
  extends PartialUpsertOrderItemDTO,
    Partial<CreateOrderItemDTO> {
  id: string
}
