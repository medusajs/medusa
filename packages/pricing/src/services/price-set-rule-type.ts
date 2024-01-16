import { Context, DAL, FindConfig } from "@medusajs/types"
import { InjectManager, MedusaContext, ModulesSdkUtils } from "@medusajs/utils"
import { PriceSetRuleType } from "@models"
import { ServiceTypes } from "@types"

type InjectedDependencies = {
  priceSetRuleTypeRepository: DAL.RepositoryService
}

export default class PriceSetRuleTypeService<
  TEntity extends PriceSetRuleType = PriceSetRuleType
> extends ModulesSdkUtils.abstractServiceFactory<
  InjectedDependencies,
  {
    create: ServiceTypes.CreatePriceSetRuleTypeDTO
    update: ServiceTypes.UpdatePriceSetRuleTypeDTO
  }
>(PriceSetRuleType)<TEntity> {
  protected readonly priceSetRuleTypeRepository_: DAL.RepositoryService<TEntity>

  constructor({ priceSetRuleTypeRepository }: InjectedDependencies) {
    // @ts-ignore
    super(...arguments)
    this.priceSetRuleTypeRepository_ = priceSetRuleTypeRepository
  }

  @InjectManager("priceSetRuleTypeRepository_")
  async list<TEntityMethod = ServiceTypes.PriceSetMoneyAmountDTO>(
    filters: ServiceTypes.FilterablePriceSetRuleTypeProps = {},
    config: FindConfig<TEntityMethod> = {},
    @MedusaContext() sharedContext: Context = {}
  ): Promise<TEntity[]> {
    return await this.priceSetRuleTypeRepository_.find(
      this.buildQueryForList(filters, config),
      sharedContext
    )
  }

  @InjectManager("priceSetRuleTypeRepository_")
  async listAndCount<TEntityMethod = ServiceTypes.PriceSetMoneyAmountDTO>(
    filters: ServiceTypes.FilterablePriceSetRuleTypeProps = {},
    config: FindConfig<TEntityMethod> = {},
    @MedusaContext() sharedContext: Context = {}
  ): Promise<[TEntity[], number]> {
    return await this.priceSetRuleTypeRepository_.findAndCount(
      this.buildQueryForList(filters, config),
      sharedContext
    )
  }

  private buildQueryForList<
    TEntityMethod = ServiceTypes.PriceSetMoneyAmountDTO
  >(
    filters: ServiceTypes.FilterablePriceSetRuleTypeProps = {},
    config: FindConfig<TEntityMethod> = {}
  ) {
    const queryOptions = ModulesSdkUtils.buildQuery<TEntity>(filters, config)

    if (filters.id) {
      queryOptions.where.id = {
        $in: filters.id,
      } as DAL.FindOptions<TEntity>[`where`][`id`]
    }

    return queryOptions
  }
}
