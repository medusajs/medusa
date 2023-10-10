import { MoneyAmountDTO } from "./money-amount"
import { PriceSetDTO } from "./price-set"

/**
 * @interface
 * 
 * An object representing a price set money amount, which holds the data related to the association between a price set and a money amount.
 * 
 * @prop id - a string indicating the ID of a price set money amount.
 * @prop title - a string indicating the title of the price set money amount.
 * @prop price_set - an object of type {@link PriceSetDTO} holding the data of the associated price set.
 * @prop money_amount - an object of type {@link MoneyAmountDTO} holding the data of the associated money amount.
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
