import {
  IPriceSelectionStrategy,
  PriceSelectionContext,
  PriceSelectionResult,
} from "../interfaces/price-selection-strategy"
import { ProductVariant } from "../models/product-variant"
import { ProductVariantService } from "../services"
import { MedusaError } from "medusa-core-utils"
import { MoneyAmountRepository } from "../repositories/money-amount"
import { MoneyAmountType } from "../types/money-amount"
import { hasIn } from "lodash"

class PriceSelectionStrategy implements IPriceSelectionStrategy {
  private moneyAmountRepository_: MoneyAmountRepository

  constructor({ moneyAmountRepository }) {
    this.moneyAmountRepository_ = moneyAmountRepository
  }

  async calculateVariantPrice(
    variant_id: string,
    context: PriceSelectionContext
  ): Promise<PriceSelectionResult> {
    const defaultMoneyAmount =
      await this.moneyAmountRepository_.findDefaultForVariantInRegion(
        variant_id,
        context.region.id,
        context.region?.currency_code
      )

    if (!defaultMoneyAmount) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `Money amount for variant with id ${variant_id} in region ${context.region.name} does not exist`
      )
    }

    const prices = await this.moneyAmountRepository_.findManyForVariantInRegion(
      variant_id,
      context.region.id,
      context.region.currency_code,
      context.customer?.groups?.map((g) => g.id)
    )

    const result: PriceSelectionResult = {
      originalPrice: defaultMoneyAmount?.amount,
      calculatedPrice: NaN,
      prices: prices,
    }

    const validPrices = prices.filter(
      (p) =>
        (typeof context.quantity !== "undefined" &&
          (!p.min_quantity || p.min_quantity < context.quantity) &&
          (!p.max_quantity || p.max_quantity > context.quantity)) ||
        (typeof context.quantity === "undefined" &&
          p.max_quantity === null &&
          p.min_quantity === null)
    )

    result.calculatedPrice = validPrices.reduce(
      (prev, curr) =>
        curr.amount < prev && !isNaN(curr.amount) ? curr.amount : prev,
      Infinity
    )

    if (result.calculatedPrice === Infinity) {
      result.calculatedPrice = result.originalPrice
    }

    return result
  }
}

export default PriceSelectionStrategy
