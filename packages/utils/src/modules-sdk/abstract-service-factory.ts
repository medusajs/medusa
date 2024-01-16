import {
  doNotForceTransaction,
  lowerCaseFirst,
  shouldForceTransaction,
} from "../common"
import { InjectManager, InjectTransactionManager } from "./decorators"
import { Context, FindConfig } from "@medusajs/types"
import { MedusaContext } from "../decorators"
import { retrieveEntity } from "./retrieve-entity"
import { buildQuery } from "./build-query"

/**
 * Utility factory and interfaces for internal module services
 */

type FilterableMethods = "list" | "listAndCount"
type Methods = "create" | "update"

export interface AbstractService<
  TEntity extends {},
  TContainer extends object = object,
  TDTos extends { [K in Methods]?: any } = { [K in Methods]?: any },
  TFilters extends { [K in FilterableMethods]?: any } = {
    [K in FilterableMethods]?: any
  }
> {
  get __container__(): TContainer

  retrieve<TEntityMethod = TEntity>(
    id: string,
    config?: FindConfig<TEntityMethod>,
    sharedContext?: Context
  ): Promise<TEntity>
  list<TEntityMethod = TEntity>(
    filters?: TFilters["list"],
    config?: FindConfig<TEntityMethod>,
    sharedContext?: Context
  ): Promise<TEntity[]>
  listAndCount<TEntityMethod = TEntity>(
    filters?: TFilters["listAndCount"],
    config?: FindConfig<TEntityMethod>,
    sharedContext?: Context
  ): Promise<[TEntity[], number]>
  create(data: any, sharedContext?: Context): Promise<TEntity[]>
  update(data: any, sharedContext?: Context): Promise<TEntity[]>
  delete(ids: string[], sharedContext?: Context): Promise<void>
  softDelete(
    ids: string[],
    sharedContext?: Context
  ): Promise<[TEntity[], Record<string, unknown[]>]>
  restore(
    ids: string[],
    sharedContext?: Context
  ): Promise<[TEntity[], Record<string, unknown[]>]>
}

export function abstractServiceFactory<
  TContainer extends object = object,
  TDTos extends { [K in Methods]?: any } = { [K in Methods]?: any },
  TFilters extends { [K in FilterableMethods]?: any } = {
    [K in FilterableMethods]?: any
  }
>(
  model: new (...args: any[]) => any
): {
  new <TEntity extends {}>(container: TContainer): AbstractService<
    TEntity,
    TContainer,
    TDTos,
    TFilters
  >
} {
  const injectedRepositoryName = `${lowerCaseFirst(model.name)}Repository`
  const propertyRepositoryName = `__${injectedRepositoryName}__`

  class AbstractService_<TEntity extends {}>
    implements AbstractService<TEntity, TContainer, TDTos, TFilters>
  {
    readonly __container__: TContainer;
    [key: string]: any

    constructor(container: TContainer) {
      this.__container__ = container
      this[propertyRepositoryName] = container[injectedRepositoryName]
    }

    @InjectManager(propertyRepositoryName)
    async retrieve<TEntityMethod = TEntity>(
      id: string,
      config: FindConfig<TEntityMethod> = {},
      @MedusaContext() sharedContext: Context = {}
    ): Promise<TEntity> {
      return (await retrieveEntity({
        id: id,
        entityName: model.name,
        repository: this[propertyRepositoryName],
        config,
        sharedContext,
      })) as TEntity
    }

    @InjectManager(propertyRepositoryName)
    async list<TEntityMethod = TEntity>(
      filters: TFilters["list"] = {},
      config: FindConfig<TEntityMethod> = {},
      @MedusaContext() sharedContext: Context = {}
    ): Promise<TEntity[]> {
      const queryOptions = buildQuery<TEntity>(filters, config)

      return (await this[propertyRepositoryName].find(
        queryOptions,
        sharedContext
      )) as TEntity[]
    }

    @InjectManager(propertyRepositoryName)
    async listAndCount<TEntityMethod = TEntity>(
      filters: TFilters["listAndCount"] = {},
      config: FindConfig<TEntityMethod> = {},
      @MedusaContext() sharedContext: Context = {}
    ): Promise<[TEntity[], number]> {
      const queryOptions = buildQuery<TEntity>(filters, config)

      return (await this[propertyRepositoryName].findAndCount(
        queryOptions,
        sharedContext
      )) as [TEntity[], number]
    }

    @InjectTransactionManager(shouldForceTransaction, propertyRepositoryName)
    async create(
      data: TDTos["create"][],
      @MedusaContext() sharedContext: Context = {}
    ): Promise<TEntity[]> {
      return (await this[propertyRepositoryName].create(
        data,
        sharedContext
      )) as TEntity[]
    }

    @InjectTransactionManager(shouldForceTransaction, propertyRepositoryName)
    async update(
      data: TDTos["update"][],
      @MedusaContext() sharedContext: Context = {}
    ): Promise<TEntity[]> {
      return (await this[propertyRepositoryName].update(
        data,
        sharedContext
      )) as TEntity[]
    }

    @InjectTransactionManager(doNotForceTransaction, propertyRepositoryName)
    async delete(
      ids: string[],
      @MedusaContext() sharedContext: Context = {}
    ): Promise<void> {
      await this[propertyRepositoryName].delete(ids, sharedContext)
    }

    @InjectTransactionManager(propertyRepositoryName)
    async softDelete(
      ids: string[],
      @MedusaContext() sharedContext: Context = {}
    ): Promise<[TEntity[], Record<string, unknown[]>]> {
      return await this[propertyRepositoryName].softDelete(ids, {
        transactionManager: sharedContext.transactionManager,
      })
    }

    @InjectTransactionManager(propertyRepositoryName)
    async restore(
      ids: string[],
      @MedusaContext() sharedContext: Context = {}
    ): Promise<[TEntity[], Record<string, unknown[]>]> {
      return await this[propertyRepositoryName].restore(ids, {
        transactionManager: sharedContext.transactionManager,
      })
    }
  }

  return AbstractService_ as unknown as new <TEntity extends {}>(
    container: TContainer
  ) => AbstractService<TEntity, TContainer, TDTos, TFilters>
}
