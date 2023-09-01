
import { Context, DAL, FindConfig, PricingTypes } from "@medusajs/types"
import {
  InjectManager,
  InjectTransactionManager,
  MedusaContext,
  ModulesSdkUtils,
  retrieveEntity,
} from "@medusajs/utils"
import { PriceList } from "@models"
import { MoneyAmountRepository } from "@repositories"

import { doNotForceTransaction, shouldForceTransaction } from "@medusajs/utils"
import { PriceListRepository } from "src/repositories/price-list"

type InjectedDependencies = {
  priceListRepository: PriceListRepository
}

export default class PriceListService<
  TEntity extends PriceList = PriceList
> {
  protected readonly priceListRepository_: PriceListRepository

  constructor({ priceListRepository }: InjectedDependencies) {
    this.priceListRepository_ = priceListRepository
  }

  @InjectManager("priceListRepository_")
  async retrieve(
    priceListId: string,
    config: FindConfig<PricingTypes.PriceListDTO> = {},
    @MedusaContext() sharedContext: Context = {}
  ): Promise<TEntity> {
    return (await retrieveEntity<PriceList, PricingTypes.PriceListDTO>({
      id: priceListId,
      entityName: PriceList.name,
      repository: this.priceListRepository_ as unknown as DAL.RepositoryService,
      config,
      sharedContext,
    })) as TEntity
  }

  @InjectManager("priceListRepository_")
  async list(
    filters: PricingTypes.FilterablePriceListProps = {},
    config: FindConfig<PricingTypes.PriceListDTO> = {},
    @MedusaContext() sharedContext: Context = {}
  ): Promise<TEntity[]> {
    return (await this.priceListRepository_.find(
      this.buildQueryForList(filters, config),
      sharedContext
    )) as TEntity[]
  }

  @InjectManager("priceListRepository_")
  async listAndCount(
    filters: PricingTypes.FilterablePriceListProps = {},
    config: FindConfig<PricingTypes.PriceListDTO> = {},
    @MedusaContext() sharedContext: Context = {}
  ): Promise<[TEntity[], number]> {
    return (await this.priceListRepository_.findAndCount(
      this.buildQueryForList(filters, config),
      sharedContext
    )) as [TEntity[], number]
  }

  private buildQueryForList(
    filters: PricingTypes.FilterablePriceListProps = {},
    config: FindConfig<PricingTypes.PriceListDTO> = {}
  ) {
    const queryOptions = ModulesSdkUtils.buildQuery<PriceList>(
      filters,
      config
    )

    if (filters.id) {
      queryOptions.where["id"] = { $in: filters.id }
    }

    return queryOptions
  }

  @InjectTransactionManager(shouldForceTransaction, "priceListRepository_")
  async create(
    data: Omit<PricingTypes.CreatePriceListDTO, "prices">[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<TEntity[]> {
    return (await (this.priceListRepository_ as PriceListRepository).create(
      data,
      sharedContext
    )) as TEntity[]
  }

  @InjectTransactionManager(shouldForceTransaction, "priceListRepository_")
  async update(
    data: PricingTypes.UpdatePriceListDTO[],
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
