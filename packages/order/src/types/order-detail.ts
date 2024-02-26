import { BigNumberInput } from "@medusajs/types"

export interface PartialUpsertOrderDetailDTO {
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

export interface CreateOrderDetailDTO extends PartialUpsertOrderDetailDTO {
  order_id: string
  version: number
  item_id: string
  quantity: BigNumberInput
}

export interface UpdateOrderDetailDTO
  extends PartialUpsertOrderDetailDTO,
    Partial<CreateOrderDetailDTO> {
  id: string
}
