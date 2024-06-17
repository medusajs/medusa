import { FindConfig } from "../common"
import { Context } from "../shared-context"
import {
  BaseFilterable,
  FilterQuery as InternalFilterQuery,
  FilterQuery,
  PerformedActions,
  UpsertWithReplaceConfig,
} from "../dal"

export interface IMedusaInternalService<
  TEntity extends {},
  TContainer extends object = object
> {
  get __container__(): TContainer

  retrieve(
    idOrObject: string,
    config?: FindConfig<any>,
    sharedContext?: Context
  ): Promise<TEntity>
  retrieve(
    idOrObject: object,
    config?: FindConfig<any>,
    sharedContext?: Context
  ): Promise<TEntity>

  list(
    filters?: FilterQuery<any> | BaseFilterable<FilterQuery<any>>,
    config?: FindConfig<any>,
    sharedContext?: Context
  ): Promise<TEntity[]>

  listAndCount(
    filters?: FilterQuery<any> | BaseFilterable<FilterQuery<any>>,
    config?: FindConfig<any>,
    sharedContext?: Context
  ): Promise<[TEntity[], number]>

  create(data: any[], sharedContext?: Context): Promise<TEntity[]>
  create(data: any, sharedContext?: Context): Promise<TEntity>

  update(data: any[], sharedContext?: Context): Promise<TEntity[]>
  update(data: any, sharedContext?: Context): Promise<TEntity>
  update(
    selectorAndData: {
      selector: FilterQuery<any> | BaseFilterable<FilterQuery<any>>
      data: any
    },
    sharedContext?: Context
  ): Promise<TEntity[]>
  update(
    selectorAndData: {
      selector: FilterQuery<any> | BaseFilterable<FilterQuery<any>>
      data: any
    }[],
    sharedContext?: Context
  ): Promise<TEntity[]>

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
  ): Promise<[TEntity[], Record<string, unknown[]>]>

  restore(
    idsOrFilter: string[] | InternalFilterQuery,
    sharedContext?: Context
  ): Promise<[TEntity[], Record<string, unknown[]>]>

  upsert(data: any[], sharedContext?: Context): Promise<TEntity[]>
  upsert(data: any, sharedContext?: Context): Promise<TEntity>

  upsertWithReplace(
    data: any[],
    config?: UpsertWithReplaceConfig<TEntity>,
    sharedContext?: Context
  ): Promise<{ entities: TEntity[]; performedActions: PerformedActions }>
}
