import { Context, DAL, FindConfig } from "@medusajs/types"
import { InjectManager, MedusaContext, ModulesSdkUtils } from "@medusajs/utils"
import { Currency } from "@models"
import { ServiceTypes } from "@types"

type InjectedDependencies = {
  currencyRepository: DAL.RepositoryService
}

export default class CurrencyService<
  TEntity extends Currency = Currency
> extends ModulesSdkUtils.abstractServiceFactory<
  InjectedDependencies,
  {
    create: ServiceTypes.CreateCurrencyDTO
    update: ServiceTypes.UpdateCurrencyDTO
  }
>(Currency)<TEntity> {
  protected readonly currencyRepository_: DAL.RepositoryService<TEntity>

  constructor({ currencyRepository }: InjectedDependencies) {
    // @ts-ignore
    super(...arguments)
    this.currencyRepository_ = currencyRepository
  }

  @InjectManager("currencyRepository_")
  async list<TEntityMethod = ServiceTypes.CurrencyDTO>(
    filters: ServiceTypes.FilterableCurrencyProps = {},
    config: FindConfig<TEntityMethod> = {},
    @MedusaContext() sharedContext: Context = {}
  ): Promise<TEntity[]> {
    return await this.currencyRepository_.find(
      this.buildQueryForList(filters, config),
      sharedContext
    )
  }

  @InjectManager("currencyRepository_")
  async listAndCount<TEntityMethod = ServiceTypes.CurrencyDTO>(
    filters: ServiceTypes.FilterableCurrencyProps = {},
    config: FindConfig<TEntityMethod> = {},
    @MedusaContext() sharedContext: Context = {}
  ): Promise<[TEntity[], number]> {
    return await this.currencyRepository_.findAndCount(
      this.buildQueryForList(filters, config),
      sharedContext
    )
  }

  private buildQueryForList<TEntityMethod = ServiceTypes.CurrencyDTO>(
    filters: ServiceTypes.FilterableCurrencyProps = {},
    config: FindConfig<TEntityMethod> = {}
  ) {
    const queryOptions = ModulesSdkUtils.buildQuery<TEntity>(filters, config)

    if (filters.code) {
      queryOptions.where.code = {
        $in: filters.code,
      } as DAL.FindOptions<TEntity>[`where`][`code`]
    }

    return queryOptions
  }
}
