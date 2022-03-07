import { LineItem } from "../models/line-item"
import {
  IPriceSelectionStrategy,
  PriceSelectionContext,
  PriceSelectionResult,
} from "../interfaces/price-selection-strategy"
import { Cart } from "../models/cart"
import { Customer } from "../models/customer"
import { ProductVariant } from "../models/product-variant"
import { ProductVariantService } from "../services"
import { MedusaError } from "medusa-core-utils"

class PriceSelectionStrategy implements IPriceSelectionStrategy {
  private productVariantService_: ProductVariantService

  constructor({ ProductVariantService }) {
    this.productVariantService_ = ProductVariantService
  }

  async calculateVariantPrice(
    variant: string | ProductVariant,
    context: PriceSelectionContext
  ): Promise<PriceSelectionResult> {
    let variantEntity: ProductVariant
    if (typeof variant === "string") {
      variantEntity = await this.productVariantService_.retrieve(variant)
    } else {
      variantEntity = variant
    }

    const prices = []

    const result: PriceSelectionResult = {
      originalPrice: NaN,
      calculatedPrice: NaN,
      prices: [],
    }

    const customerPrice = NaN

    let groupMoneyAmount

    // get customer specific prices
    if (context.customer?.groups?.length) {
      // for (const cGroup in context.customer.groups) {
      //   for(const pGroup in variantEntity.prices)
      // }
    }

    const regionMoneyAmount = variantEntity.prices.find(
      (ma) => ma.region_id === context.region?.id
    )

    // If no price could be find based on region id, we try to fetch
    // based on the region currency code
    const currencyMoneyAmount = variantEntity.prices.find(
      (ma) => ma.currency_code === context.region?.currency_code
    )

    // Still, if no price is found, we throw
    if (!regionMoneyAmount && !currencyMoneyAmount && !groupMoneyAmount) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `A price for region: ${context.region?.name} could not be found`
      )
    }

    // format result
    if (regionMoneyAmount) {
      result.originalPrice = isNaN(result.originalPrice)
        ? regionMoneyAmount.amount
        : result.originalPrice
      result.prices = [...result.prices, regionMoneyAmount]
    }

    if (currencyMoneyAmount) {
      result.originalPrice = isNaN(result.originalPrice)
        ? currencyMoneyAmount.amount
        : result.originalPrice
      result.prices = [...result.prices, currencyMoneyAmount]
    }

    if (regionMoneyAmount?.sale_amount) {
      console.log("here")
    }

    if (isNaN(result.calculatedPrice)) {
      result.calculatedPrice = result.originalPrice
    }

    return result
  }
}

export default PriceSelectionStrategy
