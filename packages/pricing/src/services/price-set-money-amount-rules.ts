import { Context, DAL, FindConfig, PricingTypes } from "@medusajs/types"
import {
  InjectManager,
  InjectTransactionManager,
  MedusaContext,
  ModulesSdkUtils,
  retrieveEntity,
} from "@medusajs/utils"
import { PriceSetMoneyAmountRules } from "@models"

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
    config: FindConfig<PricingTypes.PriceSetMoneyAmountRulesDTO> = {},
    @MedusaContext() sharedContext: Context = {}
  ): Promise<TEntity> {
    return (await retrieveEntity<
      PriceSetMoneyAmountRules,
      PricingTypes.PriceSetMoneyAmountRulesDTO
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
    filters: PricingTypes.FilterablePriceSetMoneyAmountRulesProps = {},
    config: FindConfig<PricingTypes.PriceSetMoneyAmountRulesDTO> = {},
    @MedusaContext() sharedContext: Context = {}
  ): Promise<TEntity[]> {
    return (await this.priceSetMoneyAmountRulesRepository_.find(
      this.buildQueryForList(filters, config),
      sharedContext
    )) as TEntity[]
  }

  @InjectManager("priceSetMoneyAmountRulesRepository_")
  async listAndCount(
    filters: PricingTypes.FilterablePriceSetMoneyAmountRulesProps = {},
    config: FindConfig<PricingTypes.PriceSetMoneyAmountRulesDTO> = {},
    @MedusaContext() sharedContext: Context = {}
  ): Promise<[TEntity[], number]> {
    return (await this.priceSetMoneyAmountRulesRepository_.findAndCount(
      this.buildQueryForList(filters, config),
      sharedContext
    )) as [TEntity[], number]
  }

  private buildQueryForList(
    filters: PricingTypes.FilterablePriceSetMoneyAmountRulesProps = {},
    config: FindConfig<PricingTypes.PriceSetMoneyAmountRulesDTO> = {}
  ) {
    const queryOptions = ModulesSdkUtils.buildQuery<PriceSetMoneyAmountRules>(
      filters,
      config
    )

    return queryOptions
  }

  @InjectTransactionManager("priceSetMoneyAmountRulesRepository_")
  async create(
    data: PricingTypes.CreatePriceSetMoneyAmountRulesDTO[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<TEntity[]> {
    return (await this.priceSetMoneyAmountRulesRepository_.create(
      data,
      sharedContext
    )) as TEntity[]
  }

  @InjectTransactionManager("priceSetMoneyAmountRulesRepository_")
  async update(
    data: PricingTypes.UpdatePriceSetMoneyAmountRulesDTO[],
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
