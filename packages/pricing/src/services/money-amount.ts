import { Context, DAL, FindConfig } from "@medusajs/types"
import {
  InjectManager,
  InjectTransactionManager,
  MedusaContext,
  ModulesSdkUtils,
  retrieveEntity,
} from "@medusajs/utils"
import { MoneyAmount } from "@models"
import { MoneyAmountRepository } from "@repositories"
import { ServiceTypes } from "@types"

type InjectedDependencies = {
  moneyAmountRepository: DAL.RepositoryService
}

export default class MoneyAmountService<
  TEntity extends MoneyAmount = MoneyAmount
> {
  protected readonly moneyAmountRepository_: DAL.RepositoryService

  constructor({ moneyAmountRepository }: InjectedDependencies) {
    this.moneyAmountRepository_ = moneyAmountRepository
  }

  @InjectManager("moneyAmountRepository_")
  async retrieve(
    moneyAmountId: string,
    config: FindConfig<ServiceTypes.MoneyAmountDTO> = {},
    @MedusaContext() sharedContext: Context = {}
  ): Promise<TEntity> {
    return (await retrieveEntity<MoneyAmount, ServiceTypes.MoneyAmountDTO>({
      id: moneyAmountId,
      entityName: MoneyAmount.name,
      repository: this.moneyAmountRepository_,
      config,
      sharedContext,
    })) as TEntity
  }

  @InjectManager("moneyAmountRepository_")
  async list(
    filters: ServiceTypes.FilterableMoneyAmountProps = {},
    config: FindConfig<ServiceTypes.MoneyAmountDTO> = {},
    @MedusaContext() sharedContext: Context = {}
  ): Promise<TEntity[]> {
    const queryOptions = ModulesSdkUtils.buildQuery<MoneyAmount>(
      filters,
      config
    )

    return (await this.moneyAmountRepository_.find(
      queryOptions,
      sharedContext
    )) as TEntity[]
  }

  @InjectManager("moneyAmountRepository_")
  async listAndCount(
    filters: ServiceTypes.FilterableMoneyAmountProps = {},
    config: FindConfig<ServiceTypes.MoneyAmountDTO> = {},
    @MedusaContext() sharedContext: Context = {}
  ): Promise<[TEntity[], number]> {
    const queryOptions = ModulesSdkUtils.buildQuery<MoneyAmount>(
      filters,
      config
    )

    return (await this.moneyAmountRepository_.findAndCount(
      queryOptions,
      sharedContext
    )) as [TEntity[], number]
  }

  @InjectTransactionManager("moneyAmountRepository_")
  async create(
    data: ServiceTypes.CreateMoneyAmountDTO[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<TEntity[]> {
    return (await (this.moneyAmountRepository_ as MoneyAmountRepository).create(
      data,
      sharedContext
    )) as TEntity[]
  }

  @InjectTransactionManager("moneyAmountRepository_")
  async update(
    data: ServiceTypes.UpdateMoneyAmountDTO[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<TEntity[]> {
    return (await (this.moneyAmountRepository_ as MoneyAmountRepository).update(
      data,
      sharedContext
    )) as TEntity[]
  }

  @InjectTransactionManager("moneyAmountRepository_")
  async delete(
    ids: string[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<void> {
    await this.moneyAmountRepository_.delete(ids, sharedContext)
  }
}
