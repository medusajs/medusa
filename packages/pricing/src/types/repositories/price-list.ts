import { PriceListStatus, PriceListType } from "@medusajs/utils"

export interface CreatePriceListDTO {
  title: string
  description: string
  starts_at?: Date | string | null
  ends_at?: Date | string | null
  status?: PriceListStatus
  type?: PriceListType
  rules_count?: number
}
