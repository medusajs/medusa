import { BaseFilterable } from "@medusajs/types"
import { AbstractService } from "@medusajs/utils"
import { ICurrencyRepository } from "../repositories"
import { Currency } from "@models"

export interface ICurrencyService<TEntity extends Currency = Currency>
  extends AbstractService<
    TEntity,
    {
      currencyRepository: ICurrencyRepository<TEntity>
    },
    {
      create: CreateCurrencyDTO
      update: UpdateCurrencyDTO
    }
  > {}

export interface CreateCurrencyDTO {
  code: string
  symbol: string
  symbol_native: string
  name: string
}

export interface UpdateCurrencyDTO {
  code: string
  symbol?: string
  symbol_native?: string
  name?: string
}

export interface FilterableCurrencyProps
  extends BaseFilterable<FilterableCurrencyProps> {
  code?: string[]
}

export interface CurrencyDTO {
  code: string
  symbol?: string
  symbol_native?: string
  name?: string
}
