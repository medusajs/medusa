import { Context, DAL, FindConfig, PricingTypes } from "@medusajs/types"
import {
  InjectManager,
  InjectTransactionManager,
  MedusaContext,
  ModulesSdkUtils,
  retrieveEntity,
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
    const queryOptions = ModulesSdkUtils.buildQuery<PriceSet>(filters, config)

    return (await this.priceSetRepository_.find(
      queryOptions,
      sharedContext
    )) as TEntity[]
  }

  @InjectManager("priceSetRepository_")
  async listAndCount(
    filters: PricingTypes.FilterablePriceSetProps = {},
    config: FindConfig<PricingTypes.PriceSetDTO> = {},
    @MedusaContext() sharedContext: Context = {}
  ): Promise<[TEntity[], number]> {
    const queryOptions = ModulesSdkUtils.buildQuery<PriceSet>(filters, config)

    return (await this.priceSetRepository_.findAndCount(
      queryOptions,
      sharedContext
    )) as [TEntity[], number]
  }

  @InjectTransactionManager("priceSetRepository_")
  async create(
    data: Omit<PricingTypes.CreatePriceSetDTO, "rules">[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<TEntity[]> {
    return (await (this.priceSetRepository_ as PriceSetRepository).create(
      data,
      sharedContext
    )) as TEntity[]
  }

  @InjectTransactionManager("priceSetRepository_")
  async update(
    data: Omit<PricingTypes.UpdatePriceSetDTO, "rules">[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<TEntity[]> {
    return (await (this.priceSetRepository_ as PriceSetRepository).update(
      data,
      sharedContext
    )) as TEntity[]
  }

  @InjectTransactionManager("priceSetRepository_")
  async delete(
    ids: string[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<void> {
    await this.priceSetRepository_.delete(ids, sharedContext)
  }
}
