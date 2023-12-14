import { Context, DAL, FindConfig, PricingTypes } from "@medusajs/types"
import {
  InjectManager,
  InjectTransactionManager,
  MedusaContext,
  ModulesSdkUtils,
  retrieveEntity,
} from "@medusajs/utils"
import { PriceSet, PriceSetMoneyAmount } from "@models"
import { PriceSetMoneyAmountRepository } from "@repositories"

type InjectedDependencies = {
  priceSetMoneyAmountRepository: DAL.RepositoryService
}

export default class PriceSetMoneyAmountService<
  TEntity extends PriceSetMoneyAmount = PriceSetMoneyAmount
> {
  protected readonly priceSetMoneyAmountRepository_: DAL.RepositoryService

  constructor({ priceSetMoneyAmountRepository }: InjectedDependencies) {
    this.priceSetMoneyAmountRepository_ = priceSetMoneyAmountRepository
  }

  @InjectManager("priceSetMoneyAmountRepository_")
  async retrieve(
    priceSetId: string,
    config: FindConfig<PricingTypes.PriceSetRuleTypeDTO> = {},
    @MedusaContext() sharedContext: Context = {}
  ): Promise<TEntity> {
    return (await retrieveEntity<
      PriceSetMoneyAmount,
      PricingTypes.PriceSetRuleTypeDTO
    >({
      id: priceSetId,
      entityName: PriceSet.name,
      repository: this.priceSetMoneyAmountRepository_,
      config,
      sharedContext,
    })) as TEntity
  }

  @InjectManager("priceSetMoneyAmountRepository_")
  async list(
    filters: PricingTypes.FilterablePriceSetRuleTypeProps = {},
    config: FindConfig<PricingTypes.PriceSetDTO> = {},
    @MedusaContext() sharedContext: Context = {}
  ): Promise<TEntity[]> {
    return (await this.priceSetMoneyAmountRepository_.find(
      this.buildQueryForList(filters, config),
      sharedContext
    )) as TEntity[]
  }

  @InjectManager("priceSetMoneyAmountRepository_")
  async listAndCount(
    filters: PricingTypes.FilterablePriceSetRuleTypeProps = {},
    config: FindConfig<PricingTypes.PriceSetDTO> = {},
    @MedusaContext() sharedContext: Context = {}
  ): Promise<[TEntity[], number]> {
    return (await this.priceSetMoneyAmountRepository_.findAndCount(
      this.buildQueryForList(filters, config),
      sharedContext
    )) as [TEntity[], number]
  }

  private buildQueryForList(
    filters: PricingTypes.FilterablePriceSetRuleTypeProps = {},
    config: FindConfig<PricingTypes.PriceSetDTO> = {}
  ) {
    const queryOptions = ModulesSdkUtils.buildQuery<PriceSet>(filters, config)

    if (filters.id) {
      queryOptions.where.id = { $in: filters.id }
    }

    return queryOptions
  }

  @InjectTransactionManager("priceSetMoneyAmountRepository_")
  async create(
    data: PricingTypes.CreatePriceSetMoneyAmountDTO[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<TEntity[]> {
    return (await (
      this
        .priceSetMoneyAmountRepository_ as unknown as PriceSetMoneyAmountRepository
    ).create(data, sharedContext)) as TEntity[]
  }

  @InjectTransactionManager("priceSetMoneyAmountRepository_")
  async update(
    data: PricingTypes.UpdatePriceSetMoneyAmountDTO[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<TEntity[]> {
    return (await (
      this
        .priceSetMoneyAmountRepository_ as unknown as PriceSetMoneyAmountRepository
    ).update(data, sharedContext)) as TEntity[]
  }

  @InjectTransactionManager("priceSetMoneyAmountRepository_")
  async delete(
    ids: string[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<void> {
    await this.priceSetMoneyAmountRepository_.delete(ids, sharedContext)
  }
}
