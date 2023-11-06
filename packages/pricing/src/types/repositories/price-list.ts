import { PriceListStatus } from "@medusajs/types"

export interface CreatePriceListDTO {
  title: string
  starts_at?: Date
  ends_at?: Date
  status?: PriceListStatus
  number_rules?: number
}
