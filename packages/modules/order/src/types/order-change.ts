import { OrderTypes } from "@medusajs/types"
import { OrderChangeType } from "@medusajs/utils"

export interface CreateOrderChangeDTO extends OrderTypes.CreateOrderChangeDTO {
  change_type?: OrderChangeType
}
