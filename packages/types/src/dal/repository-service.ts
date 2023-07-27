import { FindOptions } from "./index"
import { RepositoryTransformOptions } from "../common"
import { Context } from "../shared-context"

/**
 * Data access layer (DAL) interface to implements for any repository service.
 * This layer helps to separate the business logic (service layer) from accessing the
 * ORM directly and allows to switch to another ORM without changing the business logic.
 */
interface BaseRepositoryService<T = any> {
  transaction<TManager = unknown>(
    task: (transactionManager: TManager) => Promise<any>,
    context?: {
      isolationLevel?: string
      transaction?: TManager
      enableNestedTransactions?: boolean
    }
  ): Promise<any>

  getFreshManager<TManager = unknown>(): TManager

  getActiveManager<TManager = unknown>(): TManager

  serialize<TOutput extends object | object[]>(
    data: any,
    options?: any
  ): Promise<TOutput>
}

export interface RepositoryService<T = any> extends BaseRepositoryService<T> {
  find(options?: FindOptions<T>, context?: Context): Promise<T[]>

  findAndCount(
    options?: FindOptions<T>,
    context?: Context
  ): Promise<[T[], number]>

  // Only required for some repositories
  upsert?(data: any, context?: Context): Promise<T[]>

  create(data: unknown[], context?: Context): Promise<T[]>

  // TODO: remove optionality when all the other repositories have an update
  update?(data: unknown[], context?: Context): Promise<T[]>

  delete(ids: string[], context?: Context): Promise<void>

  softDelete(ids: string[], context?: Context): Promise<T[]>

  restore(ids: string[], context?: Context): Promise<T[]>
}

export interface TreeRepositoryService<T = any> extends BaseRepositoryService<T> {
  find(
    options?: FindOptions<T>,
    transformOptions?: RepositoryTransformOptions,
    context?: Context
  ): Promise<T[]>

  findAndCount(
    options?: FindOptions<T>,
    transformOptions?: RepositoryTransformOptions,
    context?: Context
  ): Promise<[T[], number]>

  create(data: unknown, context?: Context): Promise<T>

  delete(id: string, context?: Context): Promise<void>
}
