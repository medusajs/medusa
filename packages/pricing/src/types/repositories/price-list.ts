import { PriceListStatus, PriceListType } from "@medusajs/utils"

export interface CreatePriceListDTO {
  title: string
  description: string
  starts_at?: Date | null
  ends_at?: Date | null
  status?: PriceListStatus
  type?: PriceListType
  number_rules?: number
}
