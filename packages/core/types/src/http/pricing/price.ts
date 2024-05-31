import { BaseHttpEntity } from "../base"

export interface AdminPriceSetPrice extends Omit<BaseHttpEntity, "metadata"> {
  amount: number
  currency_code: string
}
