import { MoneyAmountDTO } from "./money-amount"
import { PriceSetDTO } from "./price-set"

export interface PriceSetMoneyAmountDTO {
  id: string
  title?: string
  price_set?: PriceSetDTO
  rule_type?: MoneyAmountDTO
}
