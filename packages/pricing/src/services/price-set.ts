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
import { PriceSet } from "@models"
import { PriceSetRepository } from "@repositories"

type InjectedDependencies = {
  priceSetRepository: DAL.RepositoryService
}

export default class PriceSetService<TEntity extends PriceSet = PriceSet> {
  protected readonly priceSetRepository_: DAL.RepositoryService

  constructor({ priceSetRepository }: InjectedDependencies) {
    this.priceSetRepository_ = priceSetRepository
  }

  @InjectManager("priceSetRepository_")
  async retrieve(
    priceSetId: string,
    config: FindConfig<PricingTypes.PriceSetDTO> = {},
    @MedusaContext() sharedContext: Context = {}
  ): Promise<TEntity> {
    return (await retrieveEntity<PriceSet, PricingTypes.PriceSetDTO>({
      id: priceSetId,
      entityName: PriceSet.name,
      repository: this.priceSetRepository_,
      config,
      sharedContext,
    })) as TEntity
  }

  @InjectManager("priceSetRepository_")
  async list(
    filters: PricingTypes.FilterablePriceSetProps = {},
    config: FindConfig<PricingTypes.PriceSetDTO> = {},
    @MedusaContext() sharedContext: Context = {}
  ): Promise<TEntity[]> {
    return (await this.priceSetRepository_.find(
      this.buildQueryForList(filters, config),
      sharedContext
    )) as TEntity[]
  }

  @InjectManager("priceSetRepository_")
  async listAndCount(
    filters: PricingTypes.FilterablePriceSetProps = {},
    config: FindConfig<PricingTypes.PriceSetDTO> = {},
    @MedusaContext() sharedContext: Context = {}
  ): Promise<[TEntity[], number]> {
    return (await this.priceSetRepository_.findAndCount(
      this.buildQueryForList(filters, config),
      sharedContext
    )) as [TEntity[], number]
  }

  private buildQueryForList(
    filters: PricingTypes.FilterablePriceSetProps = {},
    config: FindConfig<PricingTypes.PriceSetDTO> = {}
  ) {
    const queryOptions = ModulesSdkUtils.buildQuery<PriceSet>(filters, config)

    if (filters.id) {
      queryOptions.where.id = { $in: filters.id }
    }

    return queryOptions
  }

  @InjectTransactionManager(shouldForceTransaction, "priceSetRepository_")
  async create(
    data: PricingTypes.CreatePriceSetDTO[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<TEntity[]> {
    return (await (this.priceSetRepository_ as PriceSetRepository).create(
      data,
      sharedContext
    )) as TEntity[]
  }

  @InjectTransactionManager(shouldForceTransaction, "priceSetRepository_")
  async update(
    data: PricingTypes.UpdatePriceSetDTO[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<TEntity[]> {
    return (await (this.priceSetRepository_ as PriceSetRepository).update(
      data,
      sharedContext
    )) as TEntity[]
  }

  @InjectTransactionManager(doNotForceTransaction, "priceSetRepository_")
  async delete(
    ids: string[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<void> {
    await this.priceSetRepository_.delete(ids, sharedContext)
  }
}
