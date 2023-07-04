import { FindOptions } from "./index"
import { RepositoryTransformOptions } from "../common"
import { Context } from "../shared-context"

/**
 * Data access layer (DAL) interface to implements for any repository service.
 * This layer helps to separate the business logic (service layer) from accessing the
 * ORM directly and allows to switch to another ORM without changing the business logic.
 */
export interface RepositoryService<T = any> {
  [key: string]: any

  transaction(
    task: (transactionManager: unknown) => Promise<T[]>,
    context?: {
      isolationLevel?: string
      transaction?: unknown
      enableNestedTransactions?: boolean
    }
  ): Promise<T[]>

  find(options?: FindOptions<T>, context?: Context): Promise<T[]>

  findAndCount(
    options?: FindOptions<T>,
    context?: Context
  ): Promise<[T[], number]>

  upsert(data: any, context?: Context): Promise<T[]>
}

export interface TreeRepositoryService<T = any> {
  [key: string]: any

  transaction(
    task: (transactionManager: unknown) => Promise<T[]>,
    context?: {
      isolationLevel?: string
      transaction?: unknown
      enableNestedTransactions?: boolean
    }
  ): Promise<T[]>

  find(
    options?: FindOptions<T>,
    transformOptions?: RepositoryTransformOptions
  ): Promise<T[]>

  findAndCount(
    options?: FindOptions<T>,
    transformOptions?: RepositoryTransformOptions
  ): Promise<[T[], number]>
}
