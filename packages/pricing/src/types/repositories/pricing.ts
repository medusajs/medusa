import {
  CalculatedPriceSetDTO,
  Context,
  PricingContext,
  PricingFilters,
} from "@medusajs/types"

export interface PricingRepositoryService {
  calculatePrices(
    pricingFilters: PricingFilters,
    pricingContext: PricingContext,
    context: Context
  ): Promise<CalculatedPriceSetDTO[]>
}
