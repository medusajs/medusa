import { PriceListStatus, PricingTypes } from "@medusajs/types"

export interface CreatePriceListDTO extends PricingTypes.CreatePriceListDTO {
  rules_count?: number
  price_list_rules?: {
    attribute: string
    value: string
  }[]
  prices?: PricingTypes.CreatePriceListPriceDTO[]
}

export interface UpdatePriceListDTO {
  id: string
  title?: string
  description?: string | null
  starts_at?: string | null
  ends_at?: string | null
  status?: PriceListStatus
  number_rules?: number
}
