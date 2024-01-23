import { BaseFilterable, DAL } from "@medusajs/types"
import { AbstractService } from "@medusajs/utils"

export interface ICurrencyService<TEntity extends object>
  extends AbstractService<
    TEntity,
    {
      currencyRepository: DAL.RepositoryService
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
