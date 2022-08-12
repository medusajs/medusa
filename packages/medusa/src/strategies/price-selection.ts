import {
  AbstractPriceSelectionStrategy,
  IPriceSelectionStrategy,
  PriceSelectionContext,
  PriceSelectionResult,
  PriceType,
} from "../interfaces/price-selection-strategy"
import { MoneyAmountRepository } from "../repositories/money-amount"
import { EntityManager } from "typeorm"
import { isDefined } from "../utils"

class PriceSelectionStrategy extends AbstractPriceSelectionStrategy {
  private moneyAmountRepository_: typeof MoneyAmountRepository
  private manager_: EntityManager

  constructor({ manager, moneyAmountRepository }) {
    super()
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
