import { Cart, Customer, MoneyAmount, ProductVariant, Region } from ".."

export interface IPriceSelectionStrategy {
  /**
   * Calculates the tax amount for a given set of line items under applicable
   * tax conditions and calculation contexts.
   * @param items - the line items to calculate the tax total for
   * @param taxLines - the tax lines that applies to the calculation
   * @param calculationContext - other details relevant for the calculation
   * @return the tax total
   */

  calculateVariantPrice(
    variant: string | ProductVariant,
    context: PriceSelectionContext
  ): Promise<PriceSelectionResult>
}

export function isPriceSelectionStrategy(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  object: any
): object is IPriceSelectionStrategy {
  return typeof object.calculateVariantPrice === "function"
}

export type PriceSelectionContext = {
  cart_id?: string
  customer_id?: string
  quantity?: number
  region_id?: string
  currency_code?: string
}

export type PriceSelectionResult = {
  originalPrice: number
  calculatedPrice: number
  prices: MoneyAmount[] // prices is an array of all possible price for the input customer and region prices
}
