import { Context, DAL, FindConfig, PricingTypes } from "@medusajs/types"
import {
  InjectManager,
  InjectTransactionManager,
  MedusaContext,
  ModulesSdkUtils,
  retrieveEntity,
} from "@medusajs/utils"
import { Currency } from "@models"
import { CurrencyRepository } from "@repositories"

type InjectedDependencies = {
  currencyRepository: DAL.RepositoryService
}

export default class CurrencyService<TEntity extends Currency = Currency> {
  protected readonly currencyRepository_: DAL.RepositoryService

  constructor({ currencyRepository }: InjectedDependencies) {
    this.currencyRepository_ = currencyRepository
  }

  @InjectManager("currencyRepository_")
  async retrieve(
    currencyCode: string,
    config: FindConfig<PricingTypes.CurrencyDTO> = {},
    @MedusaContext() sharedContext: Context = {}
  ): Promise<TEntity> {
    return (await retrieveEntity<Currency, PricingTypes.CurrencyDTO>({
      id: currencyCode,
      identifierColumn: "code",
      entityName: Currency.name,
      repository: this.currencyRepository_,
      config,
      sharedContext,
    })) as TEntity
  }

  @InjectManager("currencyRepository_")
  async list(
    filters: PricingTypes.FilterableCurrencyProps = {},
    config: FindConfig<PricingTypes.CurrencyDTO> = {},
    @MedusaContext() sharedContext: Context = {}
  ): Promise<TEntity[]> {
    return (await this.currencyRepository_.find(
      this.buildQueryForList(filters, config),
      sharedContext
    )) as TEntity[]
  }

  @InjectManager("currencyRepository_")
  async listAndCount(
    filters: PricingTypes.FilterableCurrencyProps = {},
    config: FindConfig<PricingTypes.CurrencyDTO> = {},
    @MedusaContext() sharedContext: Context = {}
  ): Promise<[TEntity[], number]> {
    return (await this.currencyRepository_.findAndCount(
      this.buildQueryForList(filters, config),
      sharedContext
    )) as [TEntity[], number]
  }

  private buildQueryForList(
    filters: PricingTypes.FilterableCurrencyProps = {},
    config: FindConfig<PricingTypes.CurrencyDTO> = {}
  ) {
    const queryOptions = ModulesSdkUtils.buildQuery<Currency>(filters, config)

    if (filters.code) {
      queryOptions.where["code"] = { $in: filters.code }
    }

    return queryOptions
  }

  @InjectTransactionManager("currencyRepository_")
  async create(
    data: PricingTypes.CreateCurrencyDTO[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<TEntity[]> {
    return (await (this.currencyRepository_ as CurrencyRepository).create(
      data,
      sharedContext
    )) as TEntity[]
  }

  @InjectTransactionManager("currencyRepository_")
  async update(
    data: PricingTypes.UpdateCurrencyDTO[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<TEntity[]> {
    return (await (this.currencyRepository_ as CurrencyRepository).update(
      data,
      sharedContext
    )) as TEntity[]
  }

  @InjectTransactionManager("currencyRepository_")
  async delete(
    ids: string[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<void> {
    await this.currencyRepository_.delete(ids, sharedContext)
  }
}
