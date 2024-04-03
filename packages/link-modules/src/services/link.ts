import { Context, FindConfig } from "@medusajs/types"
import {
  InjectManager,
  InjectTransactionManager,
  MedusaContext,
  ModulesSdkUtils,
} from "@medusajs/utils"
import { doNotForceTransaction } from "../utils"

type InjectedDependencies = {
  linkRepository: any
}

export default class LinkService<TEntity> {
  protected readonly linkRepository_: any

  constructor({ linkRepository }: InjectedDependencies) {
    this.linkRepository_ = linkRepository
  }

  @InjectManager("linkRepository_")
  async list(
    filters: unknown = {},
    config: FindConfig<unknown> = {},
    @MedusaContext() sharedContext: Context = {}
  ): Promise<TEntity[]> {
    const queryOptions = ModulesSdkUtils.buildQuery<unknown>(
      filters as any,
      config
    )
    return await this.linkRepository_.find(queryOptions, sharedContext)
  }

  @InjectManager("linkRepository_")
  async listAndCount(
    filters = {},
    config: FindConfig<unknown> = {},
    @MedusaContext() sharedContext: Context = {}
  ): Promise<[TEntity[], number]> {
    const queryOptions = ModulesSdkUtils.buildQuery<unknown>(filters, config)
    return await this.linkRepository_.findAndCount(queryOptions, sharedContext)
  }

  @InjectTransactionManager(doNotForceTransaction, "linkRepository_")
  async create(
    data: unknown[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<TEntity[]> {
    return await this.linkRepository_.create(data, {
      transactionManager: sharedContext.transactionManager,
    })
  }

  @InjectTransactionManager(doNotForceTransaction, "linkRepository_")
  async dismiss(
    data: unknown[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<TEntity[]> {
    const filter: any = []
    for (const pair of data) {
      filter.push({
        $and: Object.entries(pair as object).map(([key, value]) => ({
          [key]: value,
        })),
      })
    }

    const [rows] = await this.linkRepository_.softDelete(
      { $or: filter },
      {
        transactionManager: sharedContext.transactionManager,
      }
    )

    return rows
  }

  @InjectTransactionManager(doNotForceTransaction, "linkRepository_")
  async delete(
    data: unknown,
    @MedusaContext() sharedContext: Context = {}
  ): Promise<void> {
    await this.linkRepository_.delete(data, {
      transactionManager: sharedContext.transactionManager,
    })
  }

  @InjectTransactionManager(doNotForceTransaction, "linkRepository_")
  async softDelete(
    data: any[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<[object[], Record<string, string[]>]> {
    const deleteFilters = {
      $or: data.map((dataEntry) => {
        const filter = {}
        for (const key in dataEntry) {
          filter[key] = {
            $in: Array.isArray(dataEntry[key])
              ? dataEntry[key]
              : [dataEntry[key]],
          }
        }
        return filter
      }),
    }

    return await this.linkRepository_.softDelete(deleteFilters, {
      transactionManager: sharedContext.transactionManager,
    })
  }

  @InjectTransactionManager(doNotForceTransaction, "linkRepository_")
  async restore(
    data: any,
    @MedusaContext() sharedContext: Context = {}
  ): Promise<[object[], Record<string, string[]>]> {
    const restoreFilters = {
      $or: data.map((dataEntry) => {
        const filter = {}
        for (const key in dataEntry) {
          filter[key] = {
            $in: Array.isArray(dataEntry[key])
              ? dataEntry[key]
              : [dataEntry[key]],
          }
        }
        return filter
      }),
    }

    return await this.linkRepository_.restore(restoreFilters, {
      transactionManager: sharedContext.transactionManager,
    })
  }
}
