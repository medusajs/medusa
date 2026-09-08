import { RepositoryTransformOptions } from "../common"
import { Context } from "../shared-context"
import {
  FilterQuery as InternalFilterQuery,
  FindOptions,
  UpsertWithReplaceConfig,
} from "./index"
import type { EntityClass } from "@medusajs/deps/mikro-orm/core"
import { IDmlEntity, InferTypeOf } from "../dml"

type EntityClassName = string
type EntityValues = { id: string }[]

/**
 * Either infer the properties from a DML object or from a Mikro orm class prototype.
 */
export type InferRepositoryReturnType<T> = T extends IDmlEntity<any, any>
  ? InferTypeOf<T>
  : EntityClass<T>["prototype"]

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
interface BaseRepositoryService {
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

export interface RepositoryService<T = any> extends BaseRepositoryService {
  find(
    options?: FindOptions<T>,
    context?: Context
  ): Promise<InferRepositoryReturnType<T>[]>

  findAndCount(
    options?: FindOptions<T>,
    context?: Context
  ): Promise<[InferRepositoryReturnType<T>[], number]>

  create(
    data: any[],
    context?: Context
  ): Promise<InferRepositoryReturnType<T>[]>

  update(
    data: { entity; update }[],
    context?: Context
  ): Promise<InferRepositoryReturnType<T>[]>

  delete(
    idsOrPKs: FindOptions<T>["where"],
    context?: Context
  ): Promise<string[] | Record<string, any>[]>

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
  ): Promise<[InferRepositoryReturnType<T>[], Record<string, unknown[]>]>

  restore(
    idsOrFilter: string[] | InternalFilterQuery,
    context?: Context
  ): Promise<[InferRepositoryReturnType<T>[], Record<string, unknown[]>]>

  upsert(
    data: any[],
    context?: Context
  ): Promise<InferRepositoryReturnType<T>[]>

  upsertWithReplace(
    data: any[],
    config?: UpsertWithReplaceConfig<InferRepositoryReturnType<T>>,
    context?: Context
  ): Promise<{
    entities: InferRepositoryReturnType<T>[]
    performedActions: PerformedActions
  }>
}

export interface TreeRepositoryService<T = any> extends BaseRepositoryService {
  find(
    options?: FindOptions<T>,
    transformOptions?: RepositoryTransformOptions,
    context?: Context
  ): Promise<InferRepositoryReturnType<T>[]>

  findAndCount(
    options?: FindOptions<T>,
    transformOptions?: RepositoryTransformOptions,
    context?: Context
  ): Promise<[InferRepositoryReturnType<T>[], number]>

  create(
    data: unknown[],
    context?: Context
  ): Promise<InferRepositoryReturnType<T>[]>

  delete(
    ids: string[],
    context?: Context
  ): Promise<string[] | Record<string, any>[]>
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
