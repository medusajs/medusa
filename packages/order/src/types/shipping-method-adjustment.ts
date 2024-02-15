import { BigNumberInput } from "@medusajs/types"

export interface CreateOrderShippingMethodAdjustmentDTO {
  shipping_method_id: string
  code: string
  amount: BigNumberInput
  description?: string
  promotion_id?: string
  provider_id?: string
}

export interface UpdateOrderShippingMethodAdjustmentDTO {
  id: string
  code?: string
  amount?: BigNumberInput
  description?: string
  promotion_id?: string
  provider_id?: string
}
