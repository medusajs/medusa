import { RepositoryTransformOptions } from "../common"
import { Context } from "../shared-context"
import {
  BaseFilterable,
  FilterQuery,
  FilterQuery as InternalFilterQuery,
  FindOptions,
  UpsertWithReplaceConfig,
} from "./index"

type EntityClassName = string
type EntityValues = { id: string }[]

export type PerformedActions = {
  created: Record<EntityClassName, EntityValues>
  updated: Record<EntityClassName, EntityValues>
  deleted: Record<EntityClassName, EntityValues>
}

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

  create(data: any[], context?: Context): Promise<T[]>

  update(data: { entity; update }[], context?: Context): Promise<T[]>

  delete(
    idsOrPKs: FilterQuery<T> & BaseFilterable<FilterQuery<T>>,
    context?: Context
  ): Promise<void>

  /**
   * Soft delete entities and cascade to related entities if configured.
   *
   * @param idsOrFilter
   * @param context
   *
   * @returns [T[], Record<string, string[]>] the second value being the map of the entity names and ids that were soft deleted
   */
  softDelete(
    idsOrFilter:
      | string
      | string[]
      | InternalFilterQuery
      | InternalFilterQuery[],
    context?: Context
  ): Promise<[T[], Record<string, unknown[]>]>

  restore(
    idsOrFilter: string[] | InternalFilterQuery,
    context?: Context
  ): Promise<[T[], Record<string, unknown[]>]>

  upsert(data: any[], context?: Context): Promise<T[]>

  upsertWithReplace(
    data: any[],
    config?: UpsertWithReplaceConfig<T>,
    context?: Context
  ): Promise<{ entities: T[]; performedActions: PerformedActions }>
}

export interface TreeRepositoryService<T = any>
  extends BaseRepositoryService<T> {
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

  create(data: unknown[], context?: Context): Promise<T[]>

  delete(ids: string[], context?: Context): Promise<void>
}

/**
 * @interface
 *
 * An object that is used to specify an entity's related entities that should be soft-deleted when the main entity is soft-deleted.
 */
export type SoftDeleteReturn<TReturnableLinkableKeys = string> = {
  /**
   * An array of strings, each being the ID attribute names of the entity's relations.
   */
  returnLinkableKeys?: TReturnableLinkableKeys[]
}

/**
 * @interface
 *
 * An object that is used to specify an entity's related entities that should be restored when the main entity is restored.
 */
export type RestoreReturn<TReturnableLinkableKeys = string> = {
  /**
   * An array of strings, each being the ID attribute names of the entity's relations.
   */
  returnLinkableKeys?: TReturnableLinkableKeys[]
}
