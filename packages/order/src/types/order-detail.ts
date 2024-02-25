import { BigNumberInput } from "@medusajs/types"

export interface CreateOrderDetailsDTO {
  order_id: string
  version: number
  item_id: string
  quantity: BigNumberInput
}
