import { Context, DAL, FindConfig } from "@medusajs/types"
import {
  InjectManager,
  InjectTransactionManager,
  MedusaContext,
  ModulesSdkUtils,
  retrieveEntity,
} from "@medusajs/utils"
import { Currency } from "@models"
import { CurrencyRepository } from "@repositories"
import { ServiceTypes } from "@types"

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
    config: FindConfig<ServiceTypes.CurrencyDTO> = {},
    @MedusaContext() sharedContext: Context = {}
  ): Promise<TEntity> {
    return (await retrieveEntity<Currency, ServiceTypes.CurrencyDTO>({
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
    filters: ServiceTypes.FilterableCurrencyProps = {},
    config: FindConfig<ServiceTypes.CurrencyDTO> = {},
    @MedusaContext() sharedContext: Context = {}
  ): Promise<TEntity[]> {
    return (await this.currencyRepository_.find(
      this.buildQueryForList(filters, config),
      sharedContext
    )) as TEntity[]
  }

  @InjectManager("currencyRepository_")
  async listAndCount(
    filters: ServiceTypes.FilterableCurrencyProps = {},
    config: FindConfig<ServiceTypes.CurrencyDTO> = {},
    @MedusaContext() sharedContext: Context = {}
  ): Promise<[TEntity[], number]> {
    return (await this.currencyRepository_.findAndCount(
      this.buildQueryForList(filters, config),
      sharedContext
    )) as [TEntity[], number]
  }

  private buildQueryForList(
    filters: ServiceTypes.FilterableCurrencyProps = {},
    config: FindConfig<ServiceTypes.CurrencyDTO> = {}
  ) {
    const queryOptions = ModulesSdkUtils.buildQuery<Currency>(filters, config)

    if (filters.code) {
      queryOptions.where["code"] = { $in: filters.code }
    }

    return queryOptions
  }

  @InjectTransactionManager("currencyRepository_")
  async create(
    data: ServiceTypes.CreateCurrencyDTO[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<TEntity[]> {
    return (await (this.currencyRepository_ as CurrencyRepository).create(
      data,
      sharedContext
    )) as TEntity[]
  }

  @InjectTransactionManager("currencyRepository_")
  async update(
    data: ServiceTypes.UpdateCurrencyDTO[],
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
