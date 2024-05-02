import { BigNumberInput } from "@medusajs/types"

export interface CreateShippingMethodDTO {
  name: string
  shippingMethod_id: string
  amount: BigNumberInput
  data?: Record<string, unknown>
}

export interface UpdateShippingMethodDTO {
  id: string
  name?: string
  amount?: BigNumberInput
  data?: Record<string, unknown>
}
