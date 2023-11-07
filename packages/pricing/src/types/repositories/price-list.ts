import { PriceListStatus, PriceListType } from "@medusajs/types"

export interface CreatePriceListDTO {
  title: string
  description: string
  starts_at?: Date
  ends_at?: Date
  status?: PriceListStatus
  type?: PriceListType
  number_rules?: number
}
