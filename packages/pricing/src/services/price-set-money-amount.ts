import { Context, DAL, FindConfig } from "@medusajs/types"
import { InjectManager, MedusaContext, ModulesSdkUtils } from "@medusajs/utils"
import { PriceSetMoneyAmount } from "@models"
import { ServiceTypes } from "@types"

type InjectedDependencies = {
  priceSetMoneyAmountRepository: DAL.RepositoryService
}

export default class PriceSetMoneyAmountService<
  TEntity extends PriceSetMoneyAmount = PriceSetMoneyAmount
> extends ModulesSdkUtils.abstractServiceFactory<
  InjectedDependencies,
  {
    create: ServiceTypes.CreatePriceSetMoneyAmountDTO
    update: ServiceTypes.UpdatePriceSetMoneyAmountDTO
  }
>(PriceSetMoneyAmount)<TEntity> {
  protected readonly priceSetMoneyAmountRepository_: DAL.RepositoryService<TEntity>

  constructor({ priceSetMoneyAmountRepository }: InjectedDependencies) {
    // @ts-ignore
    super(...arguments)
    this.priceSetMoneyAmountRepository_ = priceSetMoneyAmountRepository
  }

  @InjectManager("priceSetMoneyAmountRepository_")
  async list<TEntityMethod = ServiceTypes.PriceSetMoneyAmountDTO>(
    filters: ServiceTypes.FilterablePriceSetMoneyAmountProps = {},
    config: FindConfig<TEntityMethod> = {},
    @MedusaContext() sharedContext: Context = {}
  ): Promise<TEntity[]> {
    return await this.priceSetMoneyAmountRepository_.find(
      this.buildQueryForList(filters, config),
      sharedContext
    )
  }

  @InjectManager("priceSetMoneyAmountRepository_")
  async listAndCount<TEntityMethod = ServiceTypes.PriceSetMoneyAmountDTO>(
    filters: ServiceTypes.FilterablePriceSetMoneyAmountProps = {},
    config: FindConfig<TEntityMethod> = {},
    @MedusaContext() sharedContext: Context = {}
  ): Promise<[TEntity[], number]> {
    return await this.priceSetMoneyAmountRepository_.findAndCount(
      this.buildQueryForList(filters, config),
      sharedContext
    )
  }

  private buildQueryForList<
    TEntityMethod = ServiceTypes.PriceSetMoneyAmountDTO
  >(
    filters: ServiceTypes.FilterablePriceSetMoneyAmountProps = {},
    config: FindConfig<TEntityMethod> = {}
  ) {
    return ModulesSdkUtils.buildQuery<TEntity>(filters, config)
  }
}
