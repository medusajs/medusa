import { FindConfig } from "../common"
import { Context } from "../shared-context"
import {
  BaseFilterable,
  FilterQuery as InternalFilterQuery,
  FilterQuery,
  PerformedActions,
  UpsertWithReplaceConfig,
} from "../dal"
import { InferEntityType } from "../dml"

export interface IMedusaInternalService<
  TEntity extends {},
  TContainer extends object = object
> {
  get __container__(): TContainer

  retrieve(
    idOrObject: string,
    config?: FindConfig<any>,
    sharedContext?: Context
  ): Promise<InferEntityType<TEntity>>
  retrieve(
    idOrObject: object,
    config?: FindConfig<any>,
    sharedContext?: Context
  ): Promise<InferEntityType<TEntity>>

  list(
    filters?: FilterQuery<any> | BaseFilterable<FilterQuery<any>>,
    config?: FindConfig<any>,
    sharedContext?: Context
  ): Promise<InferEntityType<TEntity>[]>

  listAndCount(
    filters?: FilterQuery<any> | BaseFilterable<FilterQuery<any>>,
    config?: FindConfig<any>,
    sharedContext?: Context
  ): Promise<[InferEntityType<TEntity>[], number]>

  create(
    data: any[],
    sharedContext?: Context
  ): Promise<InferEntityType<TEntity>[]>
  create(data: any, sharedContext?: Context): Promise<InferEntityType<TEntity>>

  update(
    data: any[],
    sharedContext?: Context
  ): Promise<InferEntityType<TEntity>[]>
  update(data: any, sharedContext?: Context): Promise<InferEntityType<TEntity>>
  update(
    selectorAndData: {
      selector: FilterQuery<any> | BaseFilterable<FilterQuery<any>>
      data: any
    },
    sharedContext?: Context
  ): Promise<InferEntityType<TEntity>[]>
  update(
    selectorAndData: {
      selector: FilterQuery<any> | BaseFilterable<FilterQuery<any>>
      data: any
    }[],
    sharedContext?: Context
  ): Promise<InferEntityType<TEntity>[]>

  delete(idOrSelector: string, sharedContext?: Context): Promise<void>
  delete(idOrSelector: string[], sharedContext?: Context): Promise<void>
  delete(idOrSelector: object, sharedContext?: Context): Promise<void>
  delete(idOrSelector: object[], sharedContext?: Context): Promise<void>
  delete(
    idOrSelector: {
      selector: FilterQuery<any> | BaseFilterable<FilterQuery<any>>
    },
    sharedContext?: Context
  ): Promise<void>

  softDelete(
    idsOrFilter:
      | string
      | string[]
      | InternalFilterQuery
      | InternalFilterQuery[],
    sharedContext?: Context
  ): Promise<[InferEntityType<TEntity>[], Record<string, unknown[]>]>

  restore(
    idsOrFilter: string[] | InternalFilterQuery,
    sharedContext?: Context
  ): Promise<[InferEntityType<TEntity>[], Record<string, unknown[]>]>

  upsert(
    data: any[],
    sharedContext?: Context
  ): Promise<InferEntityType<TEntity>[]>
  upsert(data: any, sharedContext?: Context): Promise<InferEntityType<TEntity>>

  upsertWithReplace(
    data: any[],
    config?: UpsertWithReplaceConfig<InferEntityType<TEntity>>,
    sharedContext?: Context
  ): Promise<{
    entities: InferEntityType<TEntity>[]
    performedActions: PerformedActions
  }>
}
