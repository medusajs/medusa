import { Context, DAL, FindConfig } from "@medusajs/types"
import {
  InjectManager,
  InjectTransactionManager,
  MedusaContext,
  ModulesSdkUtils,
  retrieveEntity,
} from "@medusajs/utils"
import { PriceSetMoneyAmountRules } from "@models"
import { ServiceTypes } from "@types"

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
    config: FindConfig<ServiceTypes.PriceSetMoneyAmountRulesDTO> = {},
    @MedusaContext() sharedContext: Context = {}
  ): Promise<TEntity> {
    return (await retrieveEntity<
      PriceSetMoneyAmountRules,
      ServiceTypes.PriceSetMoneyAmountRulesDTO
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
    filters: ServiceTypes.FilterablePriceSetMoneyAmountRulesProps = {},
    config: FindConfig<ServiceTypes.PriceSetMoneyAmountRulesDTO> = {},
    @MedusaContext() sharedContext: Context = {}
  ): Promise<TEntity[]> {
    return (await this.priceSetMoneyAmountRulesRepository_.find(
      this.buildQueryForList(filters, config),
      sharedContext
    )) as TEntity[]
  }

  @InjectManager("priceSetMoneyAmountRulesRepository_")
  async listAndCount(
    filters: ServiceTypes.FilterablePriceSetMoneyAmountRulesProps = {},
    config: FindConfig<ServiceTypes.PriceSetMoneyAmountRulesDTO> = {},
    @MedusaContext() sharedContext: Context = {}
  ): Promise<[TEntity[], number]> {
    return (await this.priceSetMoneyAmountRulesRepository_.findAndCount(
      this.buildQueryForList(filters, config),
      sharedContext
    )) as [TEntity[], number]
  }

  private buildQueryForList(
    filters: ServiceTypes.FilterablePriceSetMoneyAmountRulesProps = {},
    config: FindConfig<ServiceTypes.PriceSetMoneyAmountRulesDTO> = {}
  ) {
    const queryOptions = ModulesSdkUtils.buildQuery<PriceSetMoneyAmountRules>(
      filters,
      config
    )

    return queryOptions
  }

  @InjectTransactionManager("priceSetMoneyAmountRulesRepository_")
  async create(
    data: ServiceTypes.CreatePriceSetMoneyAmountRulesDTO[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<TEntity[]> {
    return (await this.priceSetMoneyAmountRulesRepository_.create(
      data,
      sharedContext
    )) as TEntity[]
  }

  @InjectTransactionManager("priceSetMoneyAmountRulesRepository_")
  async update(
    data: ServiceTypes.UpdatePriceSetMoneyAmountRulesDTO[],
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
