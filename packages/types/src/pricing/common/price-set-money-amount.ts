import { MoneyAmountDTO } from "./money-amount"
import { PriceSetDTO } from "./price-set"

/**
 * @interface
 * 
 * A price set money amount's data.
 * 
 * @prop id - The ID of a price set money amount.
 * @prop title - The title of the price set money amount.
 * @prop price_set - The price set associated with the price set money amount. It may only be available if the relation `price_set` is expanded.
 * @prop money_amount - The money amount associated with the price set money amount. It may only be available if the relation `money_amount` is expanded.
 */
export interface PriceSetMoneyAmountDTO {
  id: string
  title?: string
  price_set?: PriceSetDTO
  money_amount?: MoneyAmountDTO
}

export interface UpdatePriceSetMoneyAmountDTO {
  id: string
  title?: string
  price_set?: PriceSetDTO
  money_amount?: MoneyAmountDTO
}

export interface CreatePriceSetMoneyAmountDTO {
  title?: string
  price_set?: PriceSetDTO | string
  money_amount?: MoneyAmountDTO | string
}
