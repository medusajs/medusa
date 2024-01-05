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

type FilterableMethods = "list" | "listAndCount"
type Methods = FilterableMethods | "retrieve" | "create" | "update"

interface AbstractService<
  TEntity extends {},
  TDTos extends { [K in Methods]?: any } = { [K in Methods]?: any },
  TFilters extends { [K in FilterableMethods]?: any } = {
    [K in FilterableMethods]?: any
  }
> {
  retrieve(
    id: string,
    config?: FindConfig<TDTos["retrieve"]>,
    sharedContext?: Context
  ): Promise<TEntity>
  list(
    filters?: TFilters["list"],
    config?: FindConfig<TDTos["list"]>,
    sharedContext?: Context
  ): Promise<TEntity[]>
  listAndCount(
    filters?: TFilters["listAndCount"],
    config?: FindConfig<TDTos["listAndCount"]>,
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

type AbstractServiceClass<
  TEntity extends {},
  TContainer extends object = object,
  TDTos extends { [K in Methods]?: any } = { [K in Methods]?: any },
  TFilters extends { [K in FilterableMethods]?: any } = {
    [K in FilterableMethods]?: any
  }
> = { new (...args: any[]): AbstractService<TEntity, TDTos, TFilters> }

export function abstractServiceFactory<
  TEntity extends {},
  TContainer extends object = object,
  TDTos extends { [K in Methods]?: any } = { [K in Methods]?: any },
  TFilters extends { [K in FilterableMethods]?: any } = {
    [K in FilterableMethods]?: any
  }
>(
  model: new () => any
): AbstractServiceClass<TEntity, TContainer, TDTos, TFilters> {
  const injectedRepositoryName = `${lowerCaseFirst(model.name)}Repository`
  const propertyRepositoryName = `__${injectedRepositoryName}__`

  class AbstractService_ implements AbstractService<TEntity, TDTos, TFilters> {
    constructor(protected readonly __container__: TContainer) {
      this[propertyRepositoryName] = this.__container__[injectedRepositoryName]
    }

    @InjectManager(propertyRepositoryName)
    async retrieve(
      id: string,
      config: FindConfig<TDTos["retrieve"]> = {},
      @MedusaContext() sharedContext: Context = {}
    ): Promise<TEntity> {
      return (await retrieveEntity<TEntity, TDTos["retrieve"]>({
        id: id,
        entityName: model.name,
        repository: this[propertyRepositoryName],
        config,
        sharedContext,
      })) as TEntity
    }

    @InjectManager(propertyRepositoryName)
    async list(
      filters: TFilters["list"] = {},
      config: FindConfig<TDTos["list"]> = {},
      @MedusaContext() sharedContext: Context = {}
    ): Promise<TEntity[]> {
      const queryOptions = buildQuery<TEntity>(filters, config)

      return (await this[propertyRepositoryName].find(
        queryOptions,
        sharedContext
      )) as TEntity[]
    }

    @InjectManager(propertyRepositoryName)
    async listAndCount(
      filters: TFilters["listAndCount"] = {},
      config: FindConfig<TDTos["listAndCount"]> = {},
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
      productIds: string[],
      @MedusaContext() sharedContext: Context = {}
    ): Promise<[TEntity[], Record<string, unknown[]>]> {
      return await this[propertyRepositoryName].softDelete(productIds, {
        transactionManager: sharedContext.transactionManager,
      })
    }

    @InjectTransactionManager(propertyRepositoryName)
    async restore(
      productIds: string[],
      @MedusaContext() sharedContext: Context = {}
    ): Promise<[TEntity[], Record<string, unknown[]>]> {
      return await this[propertyRepositoryName].restore(productIds, {
        transactionManager: sharedContext.transactionManager,
      })
    }
  }

  return AbstractService_ as unknown as AbstractServiceClass<
    TEntity,
    TContainer,
    TDTos,
    TFilters
  >
}
