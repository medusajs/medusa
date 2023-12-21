import { MoneyAmountDTO, PriceListDTO, PriceSetDTO } from "../services"

export interface UpdatePriceSetMoneyAmountDTO {
  id: string
  title?: string
  price_set?: PriceSetDTO
  money_amount?: MoneyAmountDTO
}

export interface CreatePriceSetMoneyAmountDTO {
  title?: string
  price_set?: PriceSetDTO | string
  price_list?: PriceListDTO | string
  money_amount?: MoneyAmountDTO | string
}
