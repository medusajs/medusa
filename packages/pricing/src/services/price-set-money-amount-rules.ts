import { Context, DAL, FindConfig } from "@medusajs/types"
import { InjectManager, MedusaContext, ModulesSdkUtils } from "@medusajs/utils"
import { PriceSetMoneyAmountRules } from "@models"
import { ServiceTypes } from "@types"

type InjectedDependencies = {
  priceSetMoneyAmountRulesRepository: DAL.RepositoryService
}

export default class PriceSetMoneyAmountRulesService<
  TEntity extends PriceSetMoneyAmountRules = PriceSetMoneyAmountRules
> extends ModulesSdkUtils.abstractServiceFactory<
  InjectedDependencies,
  {
    create: ServiceTypes.CreatePriceSetMoneyAmountRulesDTO
    update: ServiceTypes.UpdatePriceSetMoneyAmountRulesDTO
  }
>(PriceSetMoneyAmountRules)<TEntity> {
  protected readonly priceSetMoneyAmountRulesRepository_: DAL.RepositoryService<TEntity>

  constructor({ priceSetMoneyAmountRulesRepository }: InjectedDependencies) {
    // @ts-ignore
    super(...arguments)
    this.priceSetMoneyAmountRulesRepository_ =
      priceSetMoneyAmountRulesRepository
  }

  @InjectManager("priceSetMoneyAmountRulesRepository_")
  async list<TEntityMethod = ServiceTypes.PriceSetMoneyAmountRulesDTO>(
    filters: ServiceTypes.FilterablePriceSetMoneyAmountRulesProps = {},
    config: FindConfig<TEntityMethod> = {},
    @MedusaContext() sharedContext: Context = {}
  ): Promise<TEntity[]> {
    return await this.priceSetMoneyAmountRulesRepository_.find(
      this.buildQueryForList(filters, config),
      sharedContext
    )
  }

  @InjectManager("priceSetMoneyAmountRulesRepository_")
  async listAndCount<TEntityMethod = ServiceTypes.PriceSetMoneyAmountRulesDTO>(
    filters: ServiceTypes.FilterablePriceSetMoneyAmountRulesProps = {},
    config: FindConfig<TEntityMethod> = {},
    @MedusaContext() sharedContext: Context = {}
  ): Promise<[TEntity[], number]> {
    return await this.priceSetMoneyAmountRulesRepository_.findAndCount(
      this.buildQueryForList(filters, config),
      sharedContext
    )
  }

  private buildQueryForList<
    TEntityMethod = ServiceTypes.PriceSetMoneyAmountRulesDTO
  >(
    filters: ServiceTypes.FilterablePriceSetMoneyAmountRulesProps = {},
    config: FindConfig<TEntityMethod> = {}
  ) {
    const queryOptions = ModulesSdkUtils.buildQuery<TEntity>(filters, config)

    return queryOptions
  }
}
