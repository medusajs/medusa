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

export interface UpdatePriceSetInput extends PricingTypes.UpdatePriceSetDTO {
  id: string
}

export interface UpsertPriceDTO
  extends Omit<PricingTypes.CreatePriceDTO, "rules"> {
  id?: string
  price_list_id?: string
  price_rules: PricingTypes.CreatePriceRuleDTO[]
}

export interface UpdatePricePreferenceInput
  extends PricingTypes.UpdatePricePreferenceDTO {
  id: string
}
