import { BigNumberInput } from "@medusajs/types"

export interface UpdateOrderShippingMethodDTO {
  id: string
  name?: string
  amount?: BigNumberInput
  data?: Record<string, unknown>
}
