import { BigNumberInput } from "@medusajs/types"

export interface CreateOrderShippingMethodDTO {
  name: string
  shipping_option_id?: string
  order_id: string
  version?: number
  amount: BigNumberInput
  data?: Record<string, unknown>
}

export interface UpdateOrderShippingMethodDTO {
  id: string
  shipping_option_id?: string
  name?: string
  amount?: BigNumberInput
  data?: Record<string, unknown>
}
