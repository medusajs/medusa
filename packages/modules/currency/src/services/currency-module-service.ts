import {
  BaseFilterable,
  Context,
  CurrencyTypes,
  DAL,
  FilterableCurrencyProps,
  FindConfig,
  ICurrencyModuleService,
  InternalModuleDeclaration,
  ModuleJoinerConfig,
  ModulesSdkTypes,
} from "@medusajs/types"
import { ModulesSdkUtils } from "@medusajs/utils"

import { Currency } from "@models"
import { entityNameToLinkableKeysMap, joinerConfig } from "../joiner-config"

const generateMethodForModels = {}

type InjectedDependencies = {
  baseRepository: DAL.RepositoryService
  currencyService: ModulesSdkTypes.InternalModuleService<any>
}

export default class CurrencyModuleService<TEntity extends Currency = Currency>
  extends ModulesSdkUtils.MedusaService<
    CurrencyTypes.CurrencyDTO,
    {
      Currency: { dto: CurrencyTypes.CurrencyDTO }
    }
  >(Currency, generateMethodForModels, entityNameToLinkableKeysMap)
  implements ICurrencyModuleService
{
  protected baseRepository_: DAL.RepositoryService
  protected readonly currencyService_: ModulesSdkTypes.InternalModuleService<TEntity>

  constructor(
    { baseRepository, currencyService }: InjectedDependencies,
    protected readonly moduleDeclaration: InternalModuleDeclaration
  ) {
    // @ts-ignore
    super(...arguments)
    this.baseRepository_ = baseRepository
    this.currencyService_ = currencyService
  }

  __joinerConfig(): ModuleJoinerConfig {
    return joinerConfig
  }

  retrieve(
    code: string,
    config?: FindConfig<CurrencyTypes.CurrencyDTO>,
    sharedContext?: Context
  ): Promise<CurrencyTypes.CurrencyDTO> {
    return this.currencyService_.retrieve(
      code?.toLowerCase(),
      config,
      sharedContext
    )
  }

  list(
    filters?: FilterableCurrencyProps,
    config?: FindConfig<CurrencyTypes.CurrencyDTO>,
    sharedContext?: Context
  ): Promise<CurrencyTypes.CurrencyDTO[]> {
    return this.currencyService_.list(
      CurrencyModuleService.normalizeFilters(filters),
      config,
      sharedContext
    )
  }

  listAndCount(
    filters?: FilterableCurrencyProps,
    config?: FindConfig<CurrencyTypes.CurrencyDTO>,
    sharedContext?: Context
  ): Promise<[CurrencyTypes.CurrencyDTO[], number]> {
    return this.currencyService_.listAndCount(
      CurrencyModuleService.normalizeFilters(filters),
      config,
      sharedContext
    )
  }

  protected static normalizeFilters(
    filters: FilterableCurrencyProps | undefined
  ): FilterableCurrencyProps | undefined {
    return normalizeFilterable<
      CurrencyTypes.CurrencyDTO,
      FilterableCurrencyProps
    >(filters, (fieldName, value) => {
      if (fieldName === "code" && !!value) {
        return value.toLowerCase()
      }

      return value
    })
  }
}

// TODO: Move normalizer support to `buildQuery` so we don't even need to override the list/retrieve methods just for normalization
const normalizeFilterable = <TModel, TFilter extends BaseFilterable<TFilter>>(
  filters: TFilter | undefined,
  normalizer: (fieldName: keyof TModel, value: any) => any
): TFilter | undefined => {
  if (!filters) {
    return filters
  }

  const normalizedFilters = {} as TFilter
  for (const key in filters) {
    if (key === "$and" || key === "$or") {
      normalizedFilters[key] = (filters[key] as any).map((filter) =>
        normalizeFilterable(filter, normalizer)
      )
    } else if (filters[key] !== undefined) {
      if (Array.isArray(filters[key])) {
        normalizedFilters[key] = (filters[key] as any).map((val) =>
          normalizer(key as any, val)
        )
      } else {
        normalizedFilters[key] = normalizer(key as any, filters[key])
      }
    }
  }

  return normalizedFilters
}
