import { PriceListStatus } from "@medusajs/types"

export interface CreatePriceListDTO {
  starts_at?: Date
  ends_at?: Date
  status?: PriceListStatus
  number_rules?: number
}
