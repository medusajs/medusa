import { Context } from "@medusajs/types"

export interface PricingRepositoryService {
  calculatePrices(
    pricingFilters: PricingFilters,
    pricingContext: PricingContext,
    context: Context
  ): Promise<CalculatedPriceSetDTO[]>
}

export interface PricingFilters {
  id: string[]
}

export interface PricingContext {
  context?: Record<string, string | number>
}

export interface CalculatedPriceSetDTO {
  id: string
  price_set_id: string
  amount: string | null
  currency_code: string | null
  min_quantity: string | null
  max_quantity: string | null
  price_list_type: string | null
  price_list_id: string | null
}
