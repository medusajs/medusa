import { Context, FindConfig } from "@medusajs/types"
import {
  InjectManager,
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

  @InjectManager("pivotRepository_")
  async list(
    filters: unknown = {},
    config: FindConfig<unknown> = {},
    @MedusaContext() sharedContext: Context = {}
  ): Promise<TEntity[]> {
    const queryOptions = ModulesSdkUtils.buildQuery<unknown>(
      filters as any,
      config
    )
    return await this.pivotRepository_.find(queryOptions, sharedContext)
  }

  @InjectManager("pivotRepository_")
  async listAndCount(
    filters = {},
    config: FindConfig<unknown> = {},
    @MedusaContext() sharedContext: Context = {}
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
    data: any,
    @MedusaContext() sharedContext: Context = {}
  ): Promise<[string[], Record<string, string[]>]> {
    const filter = {}
    for (const key in data) {
      filter[key] = { $in: data[key] }
    }

    return await this.pivotRepository_.softDelete(filter, {
      transactionManager: sharedContext.transactionManager,
    })
  }

  @InjectTransactionManager(doNotForceTransaction, "pivotRepository_")
  async restore(
    data: unknown,
    @MedusaContext() sharedContext: Context = {}
  ): Promise<string[]> {
    return await this.pivotRepository_.restore(data, {
      transactionManager: sharedContext.transactionManager,
    })
  }
}
