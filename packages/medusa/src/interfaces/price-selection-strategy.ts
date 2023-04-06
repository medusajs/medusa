import { EntityManager } from "typeorm"
import { MoneyAmount } from "../models"
import { PriceListType } from "../types/price-list"
import { TaxServiceRate } from "../types/tax-service"

export interface IPriceSelectionStrategy {
  /**
   * Instantiate a new price selection strategy with the active transaction in
   * order to ensure reads are accurate.
   * @param manager EntityManager with the query runner of the active transaction
   * @returns a new price selection strategy
   */
  withTransaction(manager: EntityManager): IPriceSelectionStrategy

  /**
   * Calculate the original and discount price for a given variant in a set of
   * circumstances described in the context.
   * @param variantId The variant id of the variant for which to retrieve prices
   * @param context Details relevant to determine the correct pricing of the variant
   * @return pricing details in an object containing the calculated lowest price,
   * the default price an all valid prices for the given variant
   */
  calculateVariantPrice(
    variantId: string,
    context: PriceSelectionContext
  ): Promise<PriceSelectionResult>

  /**
   * Notify price selection strategy that variants prices have been updated.
   * @param variantIds The ids of the updated variants
   */
  onVariantsPricesUpdate(variantIds: string[]): Promise<void>
}

export abstract class AbstractPriceSelectionStrategy
  implements IPriceSelectionStrategy
{
  public abstract withTransaction(
    manager: EntityManager
  ): IPriceSelectionStrategy

  public abstract calculateVariantPrice(
    variantId: string,
    context: PriceSelectionContext
  ): Promise<PriceSelectionResult>

  public async onVariantsPricesUpdate(variantIds: string[]): Promise<void> {
    return void 0
  }
}

export function isPriceSelectionStrategy(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  object: any
): object is IPriceSelectionStrategy {
  return (
    typeof object.calculateVariantPrice === "function" &&
    typeof object.withTransaction === "function"
  )
}

export type PriceSelectionContext = {
  cart_id?: string
  customer_id?: string
  quantity?: number
  region_id?: string
  currency_code?: string
  include_discount_prices?: boolean
  tax_rates?: TaxServiceRate[]
  ignore_cache?: boolean
}

enum DefaultPriceType {
  DEFAULT = "default",
}

// both exports are needed in order to get proper typing of the calculatedPriceType field.
export type PriceType = DefaultPriceType | PriceListType
export const PriceType = { ...DefaultPriceType, ...PriceListType }

export type PriceSelectionResult = {
  originalPrice: number | null
  originalPriceIncludesTax?: boolean | null
  calculatedPrice: number | null
  calculatedPriceIncludesTax?: boolean | null
  calculatedPriceType?: PriceType
  prices: MoneyAmount[] // prices is an array of all possible price for the input customer and region prices
}
