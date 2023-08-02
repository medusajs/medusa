import { Context, FindConfig } from "@medusajs/types"
import {
  InjectTransactionManager,
  MedusaContext,
  ModulesSdkUtils,
} from "@medusajs/utils"
import { doNotForceTransaction } from "../utils"

type InjectedDependencies = {
  pivotRepository: any
}

export default class PivotService<TEntity> {
  protected readonly pivotRepository_: any

  constructor({ pivotRepository }: InjectedDependencies) {
    this.pivotRepository_ = pivotRepository
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
    data: unknown,
    @MedusaContext() sharedContext: Context = {}
  ): Promise<unknown[]> {
    return (await this.pivotRepository_.delete(data, {
      transactionManager: sharedContext.transactionManager,
    })) as any
  }

  @InjectTransactionManager(doNotForceTransaction, "pivotRepository_")
  async softDelete(
    data: unknown,
    returnLinkableKeys?: string[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<Record<string, string[]> | void> {
    return await this.pivotRepository_.softDelete(data, returnLinkableKeys, {
      transactionManager: sharedContext.transactionManager,
    })
  }

  @InjectTransactionManager(doNotForceTransaction, "pivotRepository_")
  async restore(
    data: unknown,
    returnLinkableKeys?: string[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<Record<string, string[]> | void> {
    return await this.pivotRepository_.restore(data, returnLinkableKeys, {
      transactionManager: sharedContext.transactionManager,
    })
  }
}
