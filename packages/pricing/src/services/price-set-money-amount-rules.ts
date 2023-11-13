import { Context, DAL, FindConfig } from "@medusajs/types"
import {
  InjectManager,
  InjectTransactionManager,
  MedusaContext,
  ModulesSdkUtils,
  retrieveEntity,
} from "@medusajs/utils"
import { PriceSetMoneyAmountRules } from "@models"
import {
  CreatePriceSetMoneyAmountRulesDTO,
  FilterablePriceSetMoneyAmountRulesProps,
  PriceSetMoneyAmountRulesDTO,
  UpdatePriceSetMoneyAmountRulesDTO,
} from "../types"

type InjectedDependencies = {
  priceSetMoneyAmountRulesRepository: DAL.RepositoryService
}

export default class PriceSetMoneyAmountRulesService<
  TEntity extends PriceSetMoneyAmountRules = PriceSetMoneyAmountRules
> {
  protected readonly priceSetMoneyAmountRulesRepository_: DAL.RepositoryService

  constructor({ priceSetMoneyAmountRulesRepository }: InjectedDependencies) {
    this.priceSetMoneyAmountRulesRepository_ =
      priceSetMoneyAmountRulesRepository
  }

  @InjectManager("priceSetMoneyAmountRulesRepository_")
  async retrieve(
    priceSetMoneyAmountRulesId: string,
    config: FindConfig<PriceSetMoneyAmountRulesDTO> = {},
    @MedusaContext() sharedContext: Context = {}
  ): Promise<TEntity> {
    return (await retrieveEntity<
      PriceSetMoneyAmountRules,
      PriceSetMoneyAmountRulesDTO
    >({
      id: priceSetMoneyAmountRulesId,
      identifierColumn: "id",
      entityName: PriceSetMoneyAmountRules.name,
      repository: this.priceSetMoneyAmountRulesRepository_,
      config,
      sharedContext,
    })) as TEntity
  }

  @InjectManager("priceSetMoneyAmountRulesRepository_")
  async list(
    filters: FilterablePriceSetMoneyAmountRulesProps = {},
    config: FindConfig<PriceSetMoneyAmountRulesDTO> = {},
    @MedusaContext() sharedContext: Context = {}
  ): Promise<TEntity[]> {
    return (await this.priceSetMoneyAmountRulesRepository_.find(
      this.buildQueryForList(filters, config),
      sharedContext
    )) as TEntity[]
  }

  @InjectManager("priceSetMoneyAmountRulesRepository_")
  async listAndCount(
    filters: FilterablePriceSetMoneyAmountRulesProps = {},
    config: FindConfig<PriceSetMoneyAmountRulesDTO> = {},
    @MedusaContext() sharedContext: Context = {}
  ): Promise<[TEntity[], number]> {
    return (await this.priceSetMoneyAmountRulesRepository_.findAndCount(
      this.buildQueryForList(filters, config),
      sharedContext
    )) as [TEntity[], number]
  }

  private buildQueryForList(
    filters: FilterablePriceSetMoneyAmountRulesProps = {},
    config: FindConfig<PriceSetMoneyAmountRulesDTO> = {}
  ) {
    const queryOptions = ModulesSdkUtils.buildQuery<PriceSetMoneyAmountRules>(
      filters,
      config
    )

    return queryOptions
  }

  @InjectTransactionManager("priceSetMoneyAmountRulesRepository_")
  async create(
    data: CreatePriceSetMoneyAmountRulesDTO[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<TEntity[]> {
    return (await this.priceSetMoneyAmountRulesRepository_.create(
      data,
      sharedContext
    )) as TEntity[]
  }

  @InjectTransactionManager("priceSetMoneyAmountRulesRepository_")
  async update(
    data: UpdatePriceSetMoneyAmountRulesDTO[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<TEntity[]> {
    return (await this.priceSetMoneyAmountRulesRepository_.update(
      data,
      sharedContext
    )) as TEntity[]
  }

  @InjectTransactionManager("priceSetMoneyAmountRulesRepository_")
  async delete(
    ids: string[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<void> {
    await this.priceSetMoneyAmountRulesRepository_.delete(ids, sharedContext)
  }
}
