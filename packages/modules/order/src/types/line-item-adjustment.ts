import { OrderTypes } from "@zjedene-medusa/framework/types"

export type CreateOrderLineItemAdjustmentDTO =
  OrderTypes.CreateOrderLineItemAdjustmentDTO

export interface UpdateOrderLineItemAdjustmentDTO
  extends Partial<CreateOrderLineItemAdjustmentDTO> {
  id: string
}
