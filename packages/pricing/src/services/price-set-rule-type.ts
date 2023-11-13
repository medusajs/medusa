import { Context, DAL, FindConfig } from "@medusajs/types"
import {
  InjectManager,
  InjectTransactionManager,
  MedusaContext,
  ModulesSdkUtils,
  retrieveEntity,
} from "@medusajs/utils"
import { PriceSet, PriceSetRuleType } from "@models"
import { PriceSetRuleTypeRepository } from "src/repositories/price-set-rule-type"
import {
  CreatePriceSetRuleTypeDTO,
  FilterablePriceSetRuleTypeProps,
  PriceSetDTO,
  PriceSetRuleTypeDTO,
  UpdatePriceSetRuleTypeDTO,
} from "../types"

type InjectedDependencies = {
  priceSetRuleTypeRepository: DAL.RepositoryService
}

export default class PriceSetRuleTypeService<
  TEntity extends PriceSetRuleType = PriceSetRuleType
> {
  protected readonly priceSetRuleTypeRepository_: DAL.RepositoryService

  constructor({ priceSetRuleTypeRepository }: InjectedDependencies) {
    this.priceSetRuleTypeRepository_ = priceSetRuleTypeRepository
  }

  @InjectManager("priceSetRuleTypeRepository_")
  async retrieve(
    priceSetId: string,
    config: FindConfig<PriceSetRuleTypeDTO> = {},
    @MedusaContext() sharedContext: Context = {}
  ): Promise<TEntity> {
    return (await retrieveEntity<PriceSetRuleType, PriceSetRuleTypeDTO>({
      id: priceSetId,
      entityName: PriceSet.name,
      repository: this.priceSetRuleTypeRepository_,
      config,
      sharedContext,
    })) as TEntity
  }

  @InjectManager("priceSetRuleTypeRepository_")
  async list(
    filters: FilterablePriceSetRuleTypeProps = {},
    config: FindConfig<PriceSetDTO> = {},
    @MedusaContext() sharedContext: Context = {}
  ): Promise<TEntity[]> {
    return (await this.priceSetRuleTypeRepository_.find(
      this.buildQueryForList(filters, config),
      sharedContext
    )) as TEntity[]
  }

  @InjectManager("priceSetRuleTypeRepository_")
  async listAndCount(
    filters: FilterablePriceSetRuleTypeProps = {},
    config: FindConfig<PriceSetDTO> = {},
    @MedusaContext() sharedContext: Context = {}
  ): Promise<[TEntity[], number]> {
    return (await this.priceSetRuleTypeRepository_.findAndCount(
      this.buildQueryForList(filters, config),
      sharedContext
    )) as [TEntity[], number]
  }

  private buildQueryForList(
    filters: FilterablePriceSetRuleTypeProps = {},
    config: FindConfig<PriceSetDTO> = {}
  ) {
    const queryOptions = ModulesSdkUtils.buildQuery<PriceSet>(filters, config)

    if (filters.id) {
      queryOptions.where.id = { $in: filters.id }
    }

    return queryOptions
  }

  @InjectTransactionManager("priceSetRuleTypeRepository_")
  async create(
    data: CreatePriceSetRuleTypeDTO[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<TEntity[]> {
    return (await (
      this.priceSetRuleTypeRepository_ as PriceSetRuleTypeRepository
    ).create(data, sharedContext)) as TEntity[]
  }

  @InjectTransactionManager("priceSetRuleTypeRepository_")
  async update(
    data: UpdatePriceSetRuleTypeDTO[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<TEntity[]> {
    return (await (
      this.priceSetRuleTypeRepository_ as PriceSetRuleTypeRepository
    ).update(data, sharedContext)) as TEntity[]
  }

  @InjectTransactionManager("priceSetRuleTypeRepository_")
  async delete(
    ids: string[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<void> {
    await this.priceSetRuleTypeRepository_.delete(ids, sharedContext)
  }
}
