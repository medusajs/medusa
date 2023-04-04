import { ICacheService } from "@medusajs/types"
import { isDefined } from "medusa-core-utils"
import { EntityManager } from "typeorm"
import {
  AbstractPriceSelectionStrategy,
  PriceSelectionContext,
  PriceSelectionResult,
  PriceType,
} from "../interfaces"
import TaxInclusivePricingFeatureFlag from "../loaders/feature-flags/tax-inclusive-pricing"
import { MoneyAmountRepository } from "../repositories/money-amount"
import { TaxServiceRate } from "../types/tax-service"
import { FlagRouter } from "../utils/flag-router"

class PriceSelectionStrategy extends AbstractPriceSelectionStrategy {
  protected manager_: EntityManager
  protected readonly featureFlagRouter_: FlagRouter
  protected moneyAmountRepository_: typeof MoneyAmountRepository
  protected cacheService_: ICacheService

  constructor({
    manager,
    featureFlagRouter,
    moneyAmountRepository,
    cacheService,
  }) {
    // @ts-ignore
    // eslint-disable-next-line prefer-rest-params
    super(...arguments)
    this.manager_ = manager
    this.moneyAmountRepository_ = moneyAmountRepository
    this.featureFlagRouter_ = featureFlagRouter
    this.cacheService_ = cacheService
  }

  async calculateVariantPrice(
    data: { variantId: string; taxRates?: TaxServiceRate[] }[],
    context: PriceSelectionContext
  ): Promise<Map<string, PriceSelectionResult>> {
    const dataMap = new Map(data.map((d) => [d.variantId, d]))

    const nonCachedData: {
      variantId: string
      taxRates?: TaxServiceRate[]
    }[] = []

    const cacheKeysMap = new Map(
      data.map(({ variantId }) => [
        variantId,
        this.getCacheKey(variantId, context),
      ])
    )

    const variantPricesMap = new Map<string, PriceSelectionResult>()
    await Promise.all(
      [...cacheKeysMap].map(async ([id, cacheKey]) => {
        let cacheHit: PriceSelectionResult | undefined | null
        if (!context.ignore_cache) {
          cacheHit = await this.cacheService_.get<PriceSelectionResult>(
            cacheKey
          )
        }

        if (!cacheHit) {
          nonCachedData.push(dataMap.get(id)!)
          return
        }

        variantPricesMap.set(id, cacheHit)
      })
    )

    let results
    if (
      this.featureFlagRouter_.isFeatureEnabled(
        TaxInclusivePricingFeatureFlag.key
      )
    ) {
      results = await this.calculateVariantPrice_new(nonCachedData, context)
    } else {
      /* result = await this.calculateVariantPrice_old(variantId, context)*/
    }

    /* await Promise.all(
      nonCachedData.map(async ({ variantId, context }) => {
        const cacheKey = cacheKeysMap.get(variantId)!

        let result: PriceSelectionResult
        if (
          this.featureFlagRouter_.isFeatureEnabled(
            TaxInclusivePricingFeatureFlag.key
          )
        ) {
          result = await this.calculateVariantPrice_new(variantId, context)
        } else {
          result = await this.calculateVariantPrice_old(variantId, context)
        }

        await this.cacheService_.set(cacheKey, result)

        variantPricesMap.set(variantId, result)
      })
    )*/

    return variantPricesMap
  }

  private async calculateVariantPrice_new(
    data: { variantId: string; taxRates?: TaxServiceRate[] }[],
    context: PriceSelectionContext
  ): Promise<Map<string, PriceSelectionResult>> {
    const moneyRepo = this.manager_.withRepository(this.moneyAmountRepository_)

    const [variantsPrices] = await moneyRepo.findManyForVariantInRegion(
      data.map((d) => d.variantId),
      context.region_id,
      context.currency_code,
      context.customer_id,
      context.include_discount_prices,
      true
    )

    const variantPricesMap = new Map<string, PriceSelectionResult>()

    for (const [variantId, prices] of Object.entries(variantsPrices)) {
      const result: PriceSelectionResult = {
        originalPrice: null,
        calculatedPrice: null,
        prices,
        originalPriceIncludesTax: null,
        calculatedPriceIncludesTax: null,
      }

      if (!prices.length || !context) {
        variantPricesMap.set(variantId, result)
      }

      const taxRate = context.tax_rates?.reduce(
        (accRate: number, nextTaxRate: TaxServiceRate) => {
          return accRate + (nextTaxRate.rate || 0) / 100
        },
        0
      )

      for (const ma of prices) {
        let isTaxInclusive = ma.currency?.includes_tax || false

        if (ma.price_list?.includes_tax) {
          // PriceList specific price so use the PriceList tax setting
          isTaxInclusive = ma.price_list.includes_tax
        } else if (ma.region?.includes_tax) {
          // Region specific price so use the Region tax setting
          isTaxInclusive = ma.region.includes_tax
        }

        delete ma.currency
        delete ma.region

        if (
          context.region_id &&
          ma.region_id === context.region_id &&
          ma.price_list_id === null &&
          ma.min_quantity === null &&
          ma.max_quantity === null
        ) {
          result.originalPriceIncludesTax = isTaxInclusive
          result.originalPrice = ma.amount
        }

        if (
          context.currency_code &&
          ma.currency_code === context.currency_code &&
          ma.price_list_id === null &&
          ma.min_quantity === null &&
          ma.max_quantity === null &&
          result.originalPrice === null // region prices take precedence
        ) {
          result.originalPriceIncludesTax = isTaxInclusive
          result.originalPrice = ma.amount
        }

        if (
          isValidQuantity(ma, context.quantity) &&
          isValidAmount(ma.amount, result, isTaxInclusive, taxRate) &&
          ((context.currency_code &&
            ma.currency_code === context.currency_code) ||
            (context.region_id && ma.region_id === context.region_id))
        ) {
          result.calculatedPrice = ma.amount
          result.calculatedPriceType = ma.price_list?.type || PriceType.DEFAULT
          result.calculatedPriceIncludesTax = isTaxInclusive
        }
      }

      variantPricesMap.set(variantId, result)
    }

    return variantPricesMap
  }

  /* private async calculateVariantPrice_old(
    variant_id: string,
    context: PriceSelectionContext
  ): Promise<PriceSelectionResult> {
    const moneyRepo = this.manager_.withRepository(this.moneyAmountRepository_)

    const [prices, count] = await moneyRepo.findManyForVariantInRegion(
      variant_id,
      context.region_id,
      context.currency_code,
      context.customer_id,
      context.include_discount_prices
    )

    if (!count) {
      return {
        originalPrice: null,
        calculatedPrice: null,
        prices: [],
      }
    }

    const result: PriceSelectionResult = {
      originalPrice: null,
      calculatedPrice: null,
      prices,
    }

    if (!context) {
      return result
    }

    for (const ma of prices) {
      delete ma.currency
      delete ma.region

      if (
        context.region_id &&
        ma.region_id === context.region_id &&
        ma.price_list_id === null &&
        ma.min_quantity === null &&
        ma.max_quantity === null
      ) {
        result.originalPrice = ma.amount
      }

      if (
        context.currency_code &&
        ma.currency_code === context.currency_code &&
        ma.price_list_id === null &&
        ma.min_quantity === null &&
        ma.max_quantity === null &&
        result.originalPrice === null // region prices take precedence
      ) {
        result.originalPrice = ma.amount
      }

      if (
        isValidQuantity(ma, context.quantity) &&
        (result.calculatedPrice === null ||
          ma.amount < result.calculatedPrice) &&
        ((context.currency_code &&
          ma.currency_code === context.currency_code) ||
          (context.region_id && ma.region_id === context.region_id))
      ) {
        result.calculatedPrice = ma.amount
        result.calculatedPriceType = ma.price_list?.type || PriceType.DEFAULT
      }
    }

    return result
  }*/

  public async onVariantsPricesUpdate(variantIds: string[]): Promise<void> {
    await Promise.all(
      variantIds.map(
        async (id: string) => await this.cacheService_.invalidate(`ps:${id}:*`)
      )
    )
  }

  private getCacheKey(
    variantId: string,
    context: PriceSelectionContext
  ): string {
    const taxRate =
      context.tax_rates?.reduce(
        (accRate: number, nextTaxRate: TaxServiceRate) => {
          return accRate + (nextTaxRate.rate || 0) / 100
        },
        0
      ) || 0

    return `ps:${variantId}:${context.region_id}:${context.currency_code}:${context.customer_id}:${context.quantity}:${context.include_discount_prices}:${taxRate}`
  }
}

const isValidAmount = (
  amount: number,
  result: PriceSelectionResult,
  isTaxInclusive: boolean,
  taxRate?: number
): boolean => {
  if (result.calculatedPrice === null) {
    return true
  }

  if (isTaxInclusive === result.calculatedPriceIncludesTax) {
    // if both or neither are tax inclusive compare equally
    return amount < result.calculatedPrice
  }

  if (typeof taxRate !== "undefined") {
    return isTaxInclusive
      ? amount < (1 + taxRate) * result.calculatedPrice
      : (1 + taxRate) * amount < result.calculatedPrice
  }

  // if we dont have a taxrate we can't compare mixed prices
  return false
}

const isValidQuantity = (price, quantity): boolean =>
  (isDefined(quantity) && isValidPriceWithQuantity(price, quantity)) ||
  (typeof quantity === "undefined" && isValidPriceWithoutQuantity(price))

const isValidPriceWithoutQuantity = (price): boolean =>
  (!price.max_quantity && !price.min_quantity) ||
  ((!price.min_quantity || price.min_quantity === 0) && price.max_quantity)

const isValidPriceWithQuantity = (price, quantity): boolean =>
  (!price.min_quantity || price.min_quantity <= quantity) &&
  (!price.max_quantity || price.max_quantity >= quantity)

export default PriceSelectionStrategy
