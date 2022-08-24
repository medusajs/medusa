import {
  AbstractPriceSelectionStrategy,
  IPriceSelectionStrategy,
  PriceSelectionContext,
  PriceSelectionResult,
  PriceType,
} from "../interfaces/price-selection-strategy"
import { MoneyAmountRepository } from "../repositories/money-amount"
import { EntityManager } from "typeorm"
import { FlagRouter } from "../utils/flag-router"
import TaxInclusivePricingFeatureFlag from "../loaders/feature-flags/tax-inclusive-pricing"

class PriceSelectionStrategy extends AbstractPriceSelectionStrategy {
  private moneyAmountRepository_: typeof MoneyAmountRepository
  private featureFlagRouter_: FlagRouter
  private manager_: EntityManager

  constructor({ manager, featureFlagRouter, moneyAmountRepository }) {
    super()
    this.manager_ = manager
    this.moneyAmountRepository_ = moneyAmountRepository
    this.featureFlagRouter_ = featureFlagRouter
  }

  withTransaction(manager: EntityManager): IPriceSelectionStrategy {
    if (!manager) {
      return this
    }

    return new PriceSelectionStrategy({
      manager: manager,
      moneyAmountRepository: this.moneyAmountRepository_,
      featureFlagRouter: this.featureFlagRouter_,
    })
  }

  async calculateVariantPrice(
    variant_id: string,
    context: PriceSelectionContext
  ): Promise<PriceSelectionResult> {
    if (
      this.featureFlagRouter_.isFeatureEnabled(
        TaxInclusivePricingFeatureFlag.key
      )
    ) {
      return this.calculateVariantPrice_new(variant_id, context)
    }
    return this.calculateVariantPrice_old(variant_id, context)
  }

  private async calculateVariantPrice_new(
    variant_id: string,
    context: PriceSelectionContext
  ): Promise<PriceSelectionResult> {
    const moneyRepo = this.manager_.getCustomRepository(
      this.moneyAmountRepository_
    )

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
        originalPriceIncludesTax: null,
        calculatedPriceIncludesTax: null,
        prices: [],
      }
    }

    const result: PriceSelectionResult = {
      originalPrice: null,
      calculatedPrice: null,
      prices,
      originalPriceIncludesTax: null,
      calculatedPriceIncludesTax: null,
    }

    if (!context) {
      return result
    }

    for (const ma of prices) {
      const isTaxInclusive = !!(
        ma.region?.includes_tax ||
        ma.currency?.includes_tax ||
        ma.price_list?.includes_tax
      )

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
        isValidAmount(ma.amount, result, isTaxInclusive, context.tax_rate) &&
        ((context.currency_code &&
          ma.currency_code === context.currency_code) ||
          (context.region_id && ma.region_id === context.region_id))
      ) {
        result.calculatedPrice = ma.amount
        result.calculatedPriceType = ma.price_list?.type || PriceType.DEFAULT
        result.calculatedPriceIncludesTax = isTaxInclusive
      }
    }

    return result
  }

  private async calculateVariantPrice_old(
    variant_id: string,
    context: PriceSelectionContext
  ): Promise<PriceSelectionResult> {
    const moneyRepo = this.manager_.getCustomRepository(
      this.moneyAmountRepository_
    )

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
  (typeof quantity !== "undefined" &&
    isValidPriceWithQuantity(price, quantity)) ||
  (typeof quantity === "undefined" && isValidPriceWithoutQuantity(price))

const isValidPriceWithoutQuantity = (price): boolean =>
  (!price.max_quantity && !price.min_quantity) ||
  ((!price.min_quantity || price.min_quantity === 0) && price.max_quantity)

const isValidPriceWithQuantity = (price, quantity): boolean =>
  (!price.min_quantity || price.min_quantity <= quantity) &&
  (!price.max_quantity || price.max_quantity >= quantity)

export default PriceSelectionStrategy
