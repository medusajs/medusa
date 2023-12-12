import { PriceListStatus, PriceListType } from "@medusajs/utils"

export interface CreatePriceListDTO {
  title: string
  description: string
  starts_at?: string
  ends_at?: string
  status?: PriceListStatus
  type?: PriceListType
  rules_count?: number
}
