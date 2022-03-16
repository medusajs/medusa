import {
  IPriceSelectionStrategy,
  PriceSelectionContext,
  PriceSelectionResult,
} from "../interfaces/price-selection-strategy"
import { MedusaError } from "medusa-core-utils"
import { MoneyAmountRepository } from "../repositories/money-amount"
import { EntityManager } from "typeorm"

class PriceSelectionStrategy implements IPriceSelectionStrategy {
  private moneyAmountRepository_: typeof MoneyAmountRepository
  private manager_: EntityManager

  constructor({ manager, moneyAmountRepository }) {
    this.manager_ = manager
    this.moneyAmountRepository_ = moneyAmountRepository
  }

  withTransaction(manager: EntityManager): IPriceSelectionStrategy {
    if (!manager) {
      return this
    }

    return new PriceSelectionStrategy({
      manager: manager,
      moneyAmountRepository: this.moneyAmountRepository_,
    })
  }

  async calculateVariantPrice(
    variant_id: string,
    context: PriceSelectionContext
  ): Promise<PriceSelectionResult> {
    const moneyRepo = this.manager_.getCustomRepository(
      this.moneyAmountRepository_
    )

    const prices = await moneyRepo.findManyForVariantInRegion(
      variant_id,
      context.region_id,
      context.currency_code,
      context.customer_id,
      context.includeDiscountPrices
    )

    if (!prices.length) {
      return {
        originalPrice: null,
        calculatedPrice: null,
        prices: [],
      }
    }

    let defaultMoneyAmount

    if (context.region_id || context.currency_code) {
      defaultMoneyAmount = prices.find(
        (p) =>
          p.price_list_id === null &&
          context.region_id &&
          p.max_quantity === null &&
          p.max_quantity === null &&
          p.region_id === context.region_id
      )

      if (!defaultMoneyAmount) {
        defaultMoneyAmount = prices.find(
          (p) =>
            p.price_list_id === null &&
            context.currency_code &&
            p.max_quantity === null &&
            p.max_quantity === null &&
            p.currency_code === context.currency_code
        )
      }
    }

    if (!defaultMoneyAmount) {
      defaultMoneyAmount = prices.find(
        (p) =>
          p.price_list_id === null &&
          p.max_quantity === null &&
          p.max_quantity === null
      )
    }

    if (!defaultMoneyAmount) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `Default money amount for variant with id ${variant_id} in region ${context.region_id} does not exist`
      )
    }

    const result: PriceSelectionResult = {
      originalPrice: defaultMoneyAmount.amount,
      calculatedPrice: NaN,
      prices: prices,
    }

    const validPrices = prices.filter((price) =>
      isValidQuantity(price, context.quantity)
    )

    result.calculatedPrice = validPrices.reduce(
      (prev, curr) =>
        prev === null || (curr.amount < prev && !isNaN(curr.amount))
          ? curr.amount
          : prev,
      validPrices[0]?.amount || result.originalPrice // if array is empty calculated price will be original price
    )

    return result
  }
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
