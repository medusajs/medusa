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
import { PriceRule, PriceSet } from "@models"
import { PriceRuleRepository } from "@repositories"

type InjectedDependencies = {
  priceRuleRepository: DAL.RepositoryService
}

export default class PriceRuleService<TEntity extends PriceRule = PriceRule> {
  protected readonly priceRuleRepository_: DAL.RepositoryService

  constructor({ priceRuleRepository }: InjectedDependencies) {
    this.priceRuleRepository_ = priceRuleRepository
  }

  @InjectManager("priceRuleRepository_")
  async retrieve(
    priceRuleId: string,
    config: FindConfig<PricingTypes.PriceRuleDTO> = {},
    @MedusaContext() sharedContext: Context = {}
  ): Promise<TEntity> {
    return (await retrieveEntity<PriceRule, PricingTypes.PriceRuleDTO>({
      id: priceRuleId,
      entityName: PriceRule.name,
      repository: this.priceRuleRepository_,
      config,
      sharedContext,
    })) as TEntity
  }

  @InjectManager("priceRuleRepository_")
  async list(
    filters: PricingTypes.FilterablePriceRuleProps = {},
    config: FindConfig<PricingTypes.PriceRuleDTO> = {},
    @MedusaContext() sharedContext: Context = {}
  ): Promise<TEntity[]> {
    return (await this.priceRuleRepository_.find(
      this.buildQueryForList(filters, config),
      sharedContext
    )) as TEntity[]
  }

  @InjectManager("priceRuleRepository_")
  async listAndCount(
    filters: PricingTypes.FilterablePriceRuleProps = {},
    config: FindConfig<PricingTypes.PriceRuleDTO> = {},
    @MedusaContext() sharedContext: Context = {}
  ): Promise<[TEntity[], number]> {
    return (await this.priceRuleRepository_.findAndCount(
      this.buildQueryForList(filters, config),
      sharedContext
    )) as [TEntity[], number]
  }

  private buildQueryForList(
    filters: PricingTypes.FilterablePriceRuleProps = {},
    config: FindConfig<PricingTypes.PriceRuleDTO> = {}
  ) {
    const queryOptions = ModulesSdkUtils.buildQuery<PriceRule>(filters, config)

    if (filters.id) {
      queryOptions.where.id = { $in: filters.id }
    }

    return queryOptions
  }

  @InjectTransactionManager(shouldForceTransaction, "priceRuleRepository_")
  async create(
    data: PricingTypes.CreatePriceRuleDTO[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<TEntity[]> {
    return (await (this.priceRuleRepository_ as PriceRuleRepository).create(
      data,
      sharedContext
    )) as TEntity[]
  }

  @InjectTransactionManager(shouldForceTransaction, "priceRuleRepository_")
  async update(
    data: PricingTypes.UpdatePriceRuleDTO[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<TEntity[]> {
    return (await (this.priceRuleRepository_ as PriceRuleRepository).update(
      data,
      sharedContext
    )) as TEntity[]
  }

  @InjectTransactionManager(doNotForceTransaction, "priceRuleRepository_")
  async delete(
    ids: string[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<void> {
    await this.priceRuleRepository_.delete(ids, sharedContext)
  }
}
