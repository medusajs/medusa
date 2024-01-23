import {
  BaseFilterable,
  CreateCurrencyDTO,
  CurrencyDTO,
  DAL,
  PriceSetMoneyAmountDTO,
} from "@medusajs/types"
import { AbstractService } from "@medusajs/utils"

export interface IMoneyAmountService<TEntity extends object>
  extends AbstractService<
    TEntity,
    { moneyAmountRepository: DAL.RepositoryService },
    {
      create: CreateMoneyAmountDTO
      update: UpdateMoneyAmountDTO
    },
    {
      list: FilterableMoneyAmountProps
      listAndCount: FilterableMoneyAmountProps
    }
  > {}

export interface CreateMoneyAmountDTO {
  id?: string
  currency_code: string
  currency?: CreateCurrencyDTO
  amount: number
  min_quantity?: number | null
  max_quantity?: number | null
}

export interface UpdateMoneyAmountDTO {
  id: string
  currency_code?: string
  amount?: number
  min_quantity?: number
  max_quantity?: number
}

export interface MoneyAmountDTO {
  id: string
  currency_code?: string
  currency?: CurrencyDTO
  amount?: number
  min_quantity?: number
  max_quantity?: number
  price_set_money_amount?: PriceSetMoneyAmountDTO
  created_at: Date
  updated_at: Date
  deleted_at: Date | null
}

export interface FilterableMoneyAmountProps
  extends BaseFilterable<FilterableMoneyAmountProps> {
  id?: string[]
  currency_code?: string | string[]
}
