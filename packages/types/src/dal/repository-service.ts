import { FindOptions } from "./index"
import { RepositoryTransformOptions } from "../common"
import { Context } from "../shared-context"

/**
 * Data access layer (DAL) interface to implements for any repository service.
 * This layer helps to separate the business logic (service layer) from accessing the
 * ORM directly and allows to switch to another ORM without changing the business logic.
 */
export interface RepositoryService<T = any> {
  transaction(
    task: (transactionManager: unknown) => Promise<any>,
    context?: {
      isolationLevel?: string
      transaction?: unknown
      enableNestedTransactions?: boolean
    }
  ): Promise<any>

  serialize<TOutput extends object | object[]>(
    data: any,
    options?: any
  ): Promise<TOutput>

  find(options?: FindOptions<T>, context?: Context): Promise<T[]>

  findAndCount(
    options?: FindOptions<T>,
    context?: Context
  ): Promise<[T[], number]>

  // Only required for some repositories
  upsert?(data: any, context?: Context): Promise<T[]>

  create(data: unknown[], context?: Context): Promise<T[]>

  delete(ids: string[], context?: Context): Promise<void>

  softDelete(ids: string[], context?: Context): Promise<T[]>

  restore(ids: string[], context?: Context): Promise<T[]>
}

export interface TreeRepositoryService<T = any> extends RepositoryService<T> {
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
}
