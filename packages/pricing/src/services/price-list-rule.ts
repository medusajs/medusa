import { Context, DAL, FindConfig, PricingTypes } from "@medusajs/types"
import {
  InjectManager,
  InjectTransactionManager,
  MedusaContext,
  ModulesSdkUtils,
  doNotForceTransaction,
  retrieveEntity,
  shouldForceTransaction,
} from "@medusajs/utils"
import { PriceListRule } from "@models"
import { PriceListRuleRepository } from "@repositories"

type InjectedDependencies = {
  priceListRuleRepository: DAL.RepositoryService
}

export default class PriceListRuleService<
  TEntity extends PriceListRule = PriceListRule
> {
  protected readonly priceListRuleRepository_: DAL.RepositoryService

  constructor({ priceListRuleRepository }: InjectedDependencies) {
    this.priceListRuleRepository_ = priceListRuleRepository
  }

  @InjectManager("priceListRuleRepository_")
  async retrieve(
    priceSetId: string,
    config: FindConfig<PricingTypes.PriceListRuleDTO> = {},
    @MedusaContext() sharedContext: Context = {}
  ): Promise<TEntity> {
    return (await retrieveEntity<PriceListRule, PricingTypes.PriceListRuleDTO>({
      id: priceSetId,
      entityName: PriceListRule.name,
      repository: this.priceListRuleRepository_,
      config,
      sharedContext,
    })) as TEntity
  }

  @InjectManager("priceListRuleRepository_")
  async list(
    filters: PricingTypes.FilterablePriceListRuleProps = {},
    config: FindConfig<PricingTypes.PriceListRuleDTO> = {},
    @MedusaContext() sharedContext: Context = {}
  ): Promise<TEntity[]> {
    const queryOptions = ModulesSdkUtils.buildQuery<PriceListRule>(
      filters,
      config
    )

    return (await this.priceListRuleRepository_.find(
      queryOptions,
      sharedContext
    )) as TEntity[]
  }

  @InjectManager("priceListRuleRepository_")
  async listAndCount(
    filters: PricingTypes.FilterablePriceListRuleProps = {},
    config: FindConfig<PricingTypes.PriceListRuleDTO> = {},
    @MedusaContext() sharedContext: Context = {}
  ): Promise<[TEntity[], number]> {
    const queryOptions = ModulesSdkUtils.buildQuery<PriceListRule>(
      filters,
      config
    )

    return (await this.priceListRuleRepository_.findAndCount(
      queryOptions,
      sharedContext
    )) as [TEntity[], number]
  }

  @InjectTransactionManager(shouldForceTransaction, "priceListRuleRepository_")
  async create(
    data: PricingTypes.CreatePriceListRuleDTO[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<TEntity[]> {
    return (await (
      this.priceListRuleRepository_ as PriceListRuleRepository
    ).create(data, sharedContext)) as TEntity[]
  }

  @InjectTransactionManager(shouldForceTransaction, "priceListRuleRepository_")
  async update(
    data: PricingTypes.UpdatePriceListRuleDTO[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<TEntity[]> {
    return (await (
      this.priceListRuleRepository_ as PriceListRuleRepository
    ).update(data, sharedContext)) as TEntity[]
  }

  @InjectTransactionManager(doNotForceTransaction, "priceListRuleRepository_")
  async delete(
    ids: string[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<void> {
    await this.priceListRuleRepository_.delete(ids, sharedContext)
  }
}
