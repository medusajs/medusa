import { PriceListStatus, PriceListType } from "@medusajs/types"

export interface CreatePriceListDTO {
  title: string
  description: string
  starts_at?: string
  ends_at?: string
  status?: PriceListStatus
  type?: PriceListType
  number_rules?: number
}
