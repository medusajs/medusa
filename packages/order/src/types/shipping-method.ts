import { BigNumberInput } from "@medusajs/types"

export interface CreateOrderShippingMethodDTO {
  name: string
  shipping_method_id: string
  amount: BigNumberInput
  data?: Record<string, unknown>
}

export interface UpdateOrderShippingMethodDTO {
  id: string
  name?: string
  amount?: BigNumberInput
  data?: Record<string, unknown>
}
