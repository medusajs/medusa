import { BaseFilterable } from "../../dal"
import { CreateMoneyAmountDTO, MoneyAmountDTO, UpdateMoneyAmountDTO } from "./money-amount"
import { PriceListUtils } from "@medusajs/utils"

export interface PriceListDTO {
  id: string
  name: string
  description: string
  starts_at?: Date
  ends_at?: Date
  type: PriceListUtils.PriceListType
  status: PriceListUtils.PriceListStatus
  prices?: MoneyAmountDTO
}

export interface CreatePriceListDTO {
  name: string
  description: string
  type?: PriceListUtils.PriceListType
  status?: PriceListUtils.PriceListStatus
  starts_at?: Date
  ends_at?: Date
  prices?: CreateMoneyAmountDTO[]
}

export interface UpdatePriceListDTO {
  id: string
  name?: string
  description?: string
  type?: PriceListUtils.PriceListType
  status?: PriceListUtils.PriceListStatus
  starts_at?: Date
  ends_at?: Date
  prices?: (UpdateMoneyAmountDTO | CreateMoneyAmountDTO)[]
}

export interface FilterablePriceListProps
  extends BaseFilterable<FilterablePriceListProps> {
  id?: string[]
}
