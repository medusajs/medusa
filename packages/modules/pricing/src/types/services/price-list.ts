import { PriceListStatus, PriceListType } from "@medusajs/types"

export interface CreatePriceListDTO {
  title: string
  description: string
  starts_at?: string | null
  ends_at?: string | null
  status?: PriceListStatus
  type?: PriceListType
  number_rules?: number
}

export interface UpdatePriceListDTO {
  id: string
  title?: string
  starts_at?: string | null
  ends_at?: string | null
  status?: PriceListStatus
  number_rules?: number
}
