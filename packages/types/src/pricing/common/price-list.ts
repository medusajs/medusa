import { BaseFilterable } from "../../dal"
import { CreateMoneyAmountDTO, MoneyAmountDTO, UpdateMoneyAmountDTO } from "./money-amount"

export interface PriceListDTO {
  id: string
  name: string
  description: string
  starts_at?: Date
  ends_at?: Date
  type: PriceListType
  status: PriceListStatus
  prices?: MoneyAmountDTO
}

export interface CreatePriceListDTO {
  name: string
  description: string
  type?: PriceListType
  status?: PriceListStatus
  starts_at?: Date
  ends_at?: Date
  prices?: CreateMoneyAmountDTO[]
}

export interface UpdatePriceListDTO {
  id: string
  name?: string
  description?: string
  type?: PriceListType
  status?: PriceListStatus
  starts_at?: Date
  ends_at?: Date
  prices?: (UpdateMoneyAmountDTO | CreateMoneyAmountDTO)[]
}

export interface FilterablePriceListProps
  extends BaseFilterable<FilterablePriceListProps> {
  id?: string[]
}

export enum PriceListType {
  SALE = "sale",
  OVERRIDE = "override",
}

export enum PriceListStatus {
  ACTIVE = "active",
  DRAFT = "draft",
}