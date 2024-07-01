import { PricingTypes } from "@medusajs/types"

export interface UpsertPriceDTO
  extends Omit<PricingTypes.CreatePriceDTO, "rules"> {
  id?: string
  price_list_id?: string
  price_rules: PricingTypes.CreatePriceRuleDTO[]
}
