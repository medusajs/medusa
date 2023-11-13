import {
  Context,
  DAL,
  FilterablePriceListRuleValueProps,
  FindConfig,
} from "@medusajs/types"
import {
  doNotForceTransaction,
  InjectManager,
  InjectTransactionManager,
  MedusaContext,
  ModulesSdkUtils,
  retrieveEntity,
  shouldForceTransaction,
} from "@medusajs/utils"
import { PriceListRuleValue } from "@models"
import { PriceListRuleValueRepository } from "@repositories"

import {
  CreatePriceListRuleValueDTO,
  PriceListRuleValueDTO,
  UpdatePriceListRuleValueDTO,
} from "../types"

type InjectedDependencies = {
  priceListRuleValueRepository: DAL.RepositoryService
}

export default class PriceListRuleValueService<
  TEntity extends PriceListRuleValue = PriceListRuleValue
> {
  protected readonly priceListRuleValueRepository_: DAL.RepositoryService

  constructor({ priceListRuleValueRepository }: InjectedDependencies) {
    this.priceListRuleValueRepository_ = priceListRuleValueRepository
  }

  @InjectManager("priceListRuleValueRepository_")
  async retrieve(
    priceSetId: string,
    config: FindConfig<PriceListRuleValueDTO> = {},
    @MedusaContext() sharedContext: Context = {}
  ): Promise<TEntity> {
    return (await retrieveEntity<PriceListRuleValue, PriceListRuleValueDTO>({
      id: priceSetId,
      entityName: PriceListRuleValue.name,
      repository: this.priceListRuleValueRepository_,
      config,
      sharedContext,
    })) as TEntity
  }

  @InjectManager("priceListRuleValueRepository_")
  async list(
    filters: FilterablePriceListRuleValueProps = {},
    config: FindConfig<PriceListRuleValueDTO> = {},
    @MedusaContext() sharedContext: Context = {}
  ): Promise<TEntity[]> {
    const queryOptions = ModulesSdkUtils.buildQuery<PriceListRuleValue>(
      filters,
      config
    )

    return (await this.priceListRuleValueRepository_.find(
      queryOptions,
      sharedContext
    )) as TEntity[]
  }

  @InjectManager("priceListRuleValueRepository_")
  async listAndCount(
    filters: FilterablePriceListRuleValueProps = {},
    config: FindConfig<PriceListRuleValueDTO> = {},
    @MedusaContext() sharedContext: Context = {}
  ): Promise<[TEntity[], number]> {
    const queryOptions = ModulesSdkUtils.buildQuery<PriceListRuleValue>(
      filters,
      config
    )

    return (await this.priceListRuleValueRepository_.findAndCount(
      queryOptions,
      sharedContext
    )) as [TEntity[], number]
  }

  @InjectTransactionManager(
    shouldForceTransaction,
    "priceListRuleValueRepository_"
  )
  async create(
    data: CreatePriceListRuleValueDTO[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<TEntity[]> {
    return (await (
      this.priceListRuleValueRepository_ as PriceListRuleValueRepository
    ).create(data, sharedContext)) as TEntity[]
  }

  @InjectTransactionManager(
    shouldForceTransaction,
    "priceListRuleValueRepository_"
  )
  async update(
    data: UpdatePriceListRuleValueDTO[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<TEntity[]> {
    return (await (
      this.priceListRuleValueRepository_ as PriceListRuleValueRepository
    ).update(data, sharedContext)) as TEntity[]
  }

  @InjectTransactionManager(
    doNotForceTransaction,
    "priceListRuleValueRepository_"
  )
  async delete(
    ids: string[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<void> {
    await this.priceListRuleValueRepository_.delete(ids, sharedContext)
  }
}
