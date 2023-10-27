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
import { PriceListRepository } from "@repositories"
import PriceList from "src/models/price-list"

type InjectedDependencies = {
  priceListRepository: DAL.RepositoryService
}

export default class PriceListService<TEntity extends PriceList = PriceList> {
  protected readonly priceListRepository_: DAL.RepositoryService

  constructor({ priceListRepository }: InjectedDependencies) {
    this.priceListRepository_ = priceListRepository
  }

  @InjectManager("priceListRepository_")
  async retrieve(
    priceSetId: string,
    config: FindConfig<PricingTypes.PriceSetDTO> = {},
    @MedusaContext() sharedContext: Context = {}
  ): Promise<TEntity> {
    return (await retrieveEntity<PriceList, PricingTypes.PriceSetDTO>({
      id: priceSetId,
      entityName: PriceSet.name,
      repository: this.priceListRepository_,
      config,
      sharedContext,
    })) as TEntity
  }

  @InjectManager("priceListRepository_")
  async list(
    filters: PricingTypes.FilterablePriceSetProps = {},
    config: FindConfig<PricingTypes.PriceSetDTO> = {},
    @MedusaContext() sharedContext: Context = {}
  ): Promise<TEntity[]> {
    const queryOptions = ModulesSdkUtils.buildQuery<PriceList>(filters, config)

    return (await this.priceListRepository_.find(
      queryOptions,
      sharedContext
    )) as TEntity[]
  }

  @InjectManager("priceListRepository_")
  async listAndCount(
    filters: PricingTypes.FilterablePriceSetProps = {},
    config: FindConfig<PricingTypes.PriceSetDTO> = {},
    @MedusaContext() sharedContext: Context = {}
  ): Promise<[TEntity[], number]> {
    const queryOptions = ModulesSdkUtils.buildQuery<PriceList>(filters, config)

    return (await this.priceListRepository_.findAndCount(
      queryOptions,
      sharedContext
    )) as [TEntity[], number]
  }

  @InjectTransactionManager(shouldForceTransaction, "priceListRepository_")
  async create(
    data: Omit<PricingTypes.CreatePriceListDTO, "rules">[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<TEntity[]> {
    return (await (this.priceListRepository_ as PriceListRepository).create(
      data,
      sharedContext
    )) as TEntity[]
  }

  @InjectTransactionManager(shouldForceTransaction, "priceListRepository_")
  async update(
    data: Omit<PricingTypes.UpdatePriceListDTO, "rules">[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<TEntity[]> {
    return (await (this.priceListRepository_ as PriceListRepository).update(
      data,
      sharedContext
    )) as TEntity[]
  }

  @InjectTransactionManager(doNotForceTransaction, "priceListRepository_")
  async delete(
    ids: string[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<void> {
    await this.priceListRepository_.delete(ids, sharedContext)
  }
}
