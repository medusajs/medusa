import { MoneyAmount, PriceList, PriceSet } from "@models"

export interface UpdatePriceSetMoneyAmountDTO {
  id: string
  title?: string
  price_set?: PriceSet
  money_amount?: MoneyAmount
}

export interface CreatePriceSetMoneyAmountDTO {
  title?: string
  price_set?: PriceSet | string
  price_list?: PriceList | string
  money_amount?: MoneyAmount | string
}
