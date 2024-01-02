import { Context, DAL, FindConfig } from "@medusajs/types"
import {
  doNotForceTransaction,
  InjectManager,
  InjectTransactionManager,
  MedusaContext,
  ModulesSdkUtils,
  retrieveEntity,
  shouldForceTransaction,
} from "@medusajs/utils"
import { PriceList } from "@models"
import { PriceListRepository } from "@repositories"
import { ServiceTypes } from "@types"

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
    priceListId: string,
    config: FindConfig<ServiceTypes.PriceListDTO> = {},
    @MedusaContext() sharedContext: Context = {}
  ): Promise<TEntity> {
    return (await retrieveEntity<PriceList, ServiceTypes.PriceListDTO>({
      id: priceListId,
      entityName: PriceList.name,
      repository: this.priceListRepository_,
      config,
      sharedContext,
    })) as TEntity
  }

  @InjectManager("priceListRepository_")
  async list(
    filters: ServiceTypes.FilterablePriceListProps = {},
    config: FindConfig<ServiceTypes.PriceListDTO> = {},
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
    filters: ServiceTypes.FilterablePriceListProps = {},
    config: FindConfig<ServiceTypes.PriceListDTO> = {},
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
    data: ServiceTypes.CreatePriceListDTO[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<TEntity[]> {
    return (await (this.priceListRepository_ as PriceListRepository).create(
      data,
      sharedContext
    )) as TEntity[]
  }

  @InjectTransactionManager(shouldForceTransaction, "priceListRepository_")
  async update(
    data: Omit<ServiceTypes.UpdatePriceListDTO, "rules">[],
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
