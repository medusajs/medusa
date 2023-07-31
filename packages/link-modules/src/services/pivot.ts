import { Context, DAL, FindConfig } from "@medusajs/types"
import {
  InjectTransactionManager,
  MedusaContext,
  MedusaError,
  ModulesSdkUtils,
} from "@medusajs/utils"
import { doNotForceTransaction } from "../utils"

type InjectedDependencies = {
  primaryKey: string | string[]
  foreignKey: string
  pivotRepository: DAL.RepositoryService
}

export default class PivotService<TEntity> {
  protected readonly pivotRepository_: DAL.RepositoryService
  private primaryKey_: string[]
  private foreignKey_: string

  constructor({
    pivotRepository,
    primaryKey,
    foreignKey,
  }: InjectedDependencies) {
    this.pivotRepository_ = pivotRepository
    this.primaryKey_ = !Array.isArray(primaryKey) ? [primaryKey] : primaryKey
    this.foreignKey_ = foreignKey
  }

  async retrieve(
    primaryKeyData: string | string[],
    foreignKeyData: string,
    sharedContext?: Context
  ): Promise<TEntity> {
    const filter = this.primaryKey_.map((key, index) => ({
      [key]: primaryKeyData[index],
    }))
    filter[this.foreignKey_] = foreignKeyData

    const queryOptions = ModulesSdkUtils.buildQuery<unknown>(filter)
    const entry = await this.pivotRepository_.find(queryOptions, sharedContext)

    if (!entry?.length) {
      const errMessage = filter.reduce((acc, curr) => {
        return `${acc} ${Object.keys(curr)[0]}[${Object.values(curr)[0]}]`
      }, "")
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `Entry ${errMessage} was not found`
      )
    }

    return entry[0]
  }

  async list(
    filters: unknown = {},
    config: FindConfig<unknown> = {},
    sharedContext?: Context
  ): Promise<TEntity[]> {
    const queryOptions = ModulesSdkUtils.buildQuery<unknown>(
      filters as any,
      config
    )
    return await this.pivotRepository_.find(queryOptions, sharedContext)
  }

  async listAndCount(
    filters = {},
    config: FindConfig<unknown> = {},
    sharedContext?: Context
  ): Promise<[TEntity[], number]> {
    const queryOptions = ModulesSdkUtils.buildQuery<unknown>(filters, config)
    return await this.pivotRepository_.findAndCount(queryOptions, sharedContext)
  }

  @InjectTransactionManager(doNotForceTransaction, "pivotRepository_")
  async create(
    data: unknown[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<TEntity[]> {
    return await this.pivotRepository_.create(data, {
      transactionManager: sharedContext.transactionManager,
    })
  }

  @InjectTransactionManager(doNotForceTransaction, "pivotRepository_")
  async delete(
    ids: string[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<unknown[]> {
    return (await this.pivotRepository_.delete(ids, {
      transactionManager: sharedContext.transactionManager,
    })) as any
  }

  @InjectTransactionManager(doNotForceTransaction, "pivotRepository_")
  async softDelete(
    productIds: string[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<TEntity[]> {
    return await this.pivotRepository_.softDelete(productIds, {
      transactionManager: sharedContext.transactionManager,
    })
  }

  @InjectTransactionManager(doNotForceTransaction, "pivotRepository_")
  async restore(
    productIds: string[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<TEntity[]> {
    return await this.pivotRepository_.restore(productIds, {
      transactionManager: sharedContext.transactionManager,
    })
  }
}
