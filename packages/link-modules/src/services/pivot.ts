import { Context, DAL, FindConfig } from "@medusajs/types"
import {
  InjectTransactionManager,
  MedusaContext,
  MedusaError,
  ModulesSdkUtils,
} from "@medusajs/utils"
import { doNotForceTransaction } from "../utils"

type InjectedDependencies = {
  pivotRepository: DAL.RepositoryService
}

export default class PivotService<TEntity> {
  protected readonly pivotRepository_: DAL.RepositoryService

  constructor({ pivotRepository }: InjectedDependencies) {
    this.pivotRepository_ = pivotRepository
  }

  async retrieve(productId: string, sharedContext?: Context): Promise<TEntity> {
    const queryOptions = ModulesSdkUtils.buildQuery<unknown>({
      id: productId,
    })
    const product = await this.pivotRepository_.find(
      queryOptions,
      sharedContext
    )

    if (!product?.length) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `Product with id: ${productId} was not found`
      )
    }

    return product[0]
  }

  async list(
    filters = {},
    config: FindConfig<unknown> = {},
    sharedContext?: Context
  ): Promise<TEntity[]> {
    const queryOptions = ModulesSdkUtils.buildQuery<unknown>(filters, config)
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
  ): Promise<void> {
    await this.pivotRepository_.delete(ids, {
      transactionManager: sharedContext.transactionManager,
    })
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
