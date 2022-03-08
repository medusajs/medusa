import {
  IPriceSelectionStrategy,
  PriceSelectionContext,
  PriceSelectionResult,
} from "../interfaces/price-selection-strategy"
import { MedusaError } from "medusa-core-utils"
import { MoneyAmountRepository } from "../repositories/money-amount"
import { MoneyAmountType } from "../types/money-amount"

class PriceSelectionStrategy implements IPriceSelectionStrategy {
  private moneyAmountRepository_: MoneyAmountRepository

  constructor({ moneyAmountRepository }) {
    this.moneyAmountRepository_ = moneyAmountRepository
  }

  async calculateVariantPrice(
    variant_id: string,
    context: PriceSelectionContext
  ): Promise<PriceSelectionResult> {
    if (!context.region_id && !context.currency_code) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `Money amount could not be found`
      )
    }

    const prices = await this.moneyAmountRepository_.findManyForVariantInRegion(
      variant_id,
      context.region_id,
      context.currency_code,
      context.customer_id
    )

    let defaultMoneyAmount = prices.find(
      (p) =>
        p.type === MoneyAmountType.DEFAULT &&
        context.region_id &&
        p.region_id === context.region_id
    )

    if (!defaultMoneyAmount) {
      defaultMoneyAmount = prices.find(
        (p) =>
          p.type === MoneyAmountType.DEFAULT &&
          context.currency_code &&
          p.currency_code === context.currency_code
      )
    }

    if (!defaultMoneyAmount) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `Money amount for variant with id ${variant_id} in region ${context.region_id} does not exist`
      )
    }

    const result: PriceSelectionResult = {
      originalPrice: defaultMoneyAmount.amount,
      calculatedPrice: NaN,
      prices: prices,
    }

    const validPrices = prices.filter(
      (p) =>
        (typeof context.quantity !== "undefined" &&
          (!p.min_quantity || p.min_quantity <= context.quantity) &&
          (!p.max_quantity || p.max_quantity >= context.quantity)) ||
        (typeof context.quantity === "undefined" &&
          isValidPriceWithoutQuantity(p))
    )

    result.calculatedPrice = validPrices.reduce(
      (prev, curr) =>
        curr.amount < prev && !isNaN(curr.amount) ? curr.amount : prev,
      validPrices[0]?.amount || result.originalPrice // if array is empty calculated price will be original price
    )

    return result
  }
}

const isValidPriceWithoutQuantity = (price): boolean =>
  (!price.max_quantity && !price.min_quantity) ||
  ((!price.min_quantity || price.min_quantity === 0) && price.max_quantity)

export default PriceSelectionStrategy
