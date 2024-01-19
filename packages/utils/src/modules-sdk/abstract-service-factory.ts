import {
  Context,
  FindConfig,
  FilterQuery as InternalFilterQuery,
} from "@medusajs/types"
import { EntitySchema } from "@mikro-orm/core"
import { EntityClass } from "@mikro-orm/core/typings"
import {
  MedusaError,
  doNotForceTransaction,
  isDefined,
  isString,
  lowerCaseFirst,
  shouldForceTransaction,
  upperCaseFirst,
} from "../common"
import { MedusaContext } from "../decorators"
import { buildQuery } from "./build-query"
import { InjectManager, InjectTransactionManager } from "./decorators"

/**
 * Utility factory and interfaces for internal module services
 */

type FilterableMethods = "list" | "listAndCount"
type Methods = "create" | "update"

export interface AbstractService<
  TEntity extends {},
  TContainer extends object = object,
  TDTOs extends { [K in Methods]?: any } = { [K in Methods]?: any },
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
  create(data: TDTOs["create"][], sharedContext?: Context): Promise<TEntity[]>
  update(data: TDTOs["update"][], sharedContext?: Context): Promise<TEntity[]>
  delete(
    primaryKeyValues: string[] | object[],
    sharedContext?: Context
  ): Promise<void>
  softDelete(
    idsOrFilter: string[] | InternalFilterQuery,
    sharedContext?: Context
  ): Promise<[TEntity[], Record<string, unknown[]>]>
  restore(
    idsOrFilter: string[] | InternalFilterQuery,
    sharedContext?: Context
  ): Promise<[TEntity[], Record<string, unknown[]>]>
  upsert(
    data: (TDTOs["create"] | TDTOs["update"])[],
    sharedContext?: Context
  ): Promise<TEntity[]>
}

export function abstractServiceFactory<
  TContainer extends object = object,
  TDTOs extends { [K in Methods]?: any } = { [K in Methods]?: any },
  TFilters extends { [K in FilterableMethods]?: any } = {
    [K in FilterableMethods]?: any
  }
>(
  model: new (...args: any[]) => any
): {
  new <TEntity extends object = any>(container: TContainer): AbstractService<
    TEntity,
    TContainer,
    TDTOs,
    TFilters
  >
} {
  const injectedRepositoryName = `${lowerCaseFirst(model.name)}Repository`
  const propertyRepositoryName = `__${injectedRepositoryName}__`

  class AbstractService_<TEntity extends {}>
    implements AbstractService<TEntity, TContainer, TDTOs, TFilters>
  {
    readonly __container__: TContainer;
    [key: string]: any

    constructor(container: TContainer) {
      this.__container__ = container
      this[propertyRepositoryName] = container[injectedRepositoryName]
    }

    static retrievePrimaryKeys(entity: EntityClass<any> | EntitySchema<any>) {
      return (
        (entity as EntitySchema<any>).meta?.primaryKeys ??
        (entity as EntityClass<any>).prototype.__meta?.primaryKeys ?? ["id"]
      )
    }

    @InjectManager(propertyRepositoryName)
    async retrieve<TEntityMethod = TEntity>(
      primaryKeyValues: string | string[] | object[],
      config: FindConfig<TEntityMethod> = {},
      @MedusaContext() sharedContext: Context = {}
    ): Promise<TEntity> {
      const primaryKeys = AbstractService_.retrievePrimaryKeys(model)

      if (!isDefined(primaryKeyValues)) {
        throw new MedusaError(
          MedusaError.Types.NOT_FOUND,
          `${
            primaryKeys.length === 1
              ? `"${
                  lowerCaseFirst(model.name) + upperCaseFirst(primaryKeys[0])
                }"`
              : `${lowerCaseFirst(model.name)} ${primaryKeys.join(", ")}`
          } must be defined`
        )
      }

      let primaryKeysCriteria = {}
      if (primaryKeys.length === 1) {
        primaryKeysCriteria[primaryKeys[0]] = primaryKeyValues
      } else {
        primaryKeysCriteria = (primaryKeyValues as string[] | object[]).map(
          (primaryKeyValue) => ({
            $and: primaryKeys.map((key) => ({ [key]: primaryKeyValue[key] })),
          })
        )
      }

      const queryOptions = buildQuery<TEntity>(primaryKeysCriteria, config)

      const entities = await this[propertyRepositoryName].find(
        queryOptions,
        sharedContext
      )

      if (!entities?.length) {
        throw new MedusaError(
          MedusaError.Types.NOT_FOUND,
          `${model.name} with ${primaryKeys.join(", ")}: ${
            Array.isArray(primaryKeyValues)
              ? primaryKeyValues.map((v) =>
                  [isString(v) ? v : Object.values(v)].join(", ")
                )
              : primaryKeyValues
          } was not found`
        )
      }

      return entities[0]
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
      data: TDTOs["create"][],
      @MedusaContext() sharedContext: Context = {}
    ): Promise<TEntity[]> {
      return (await this[propertyRepositoryName].create(
        data,
        sharedContext
      )) as TEntity[]
    }

    @InjectTransactionManager(shouldForceTransaction, propertyRepositoryName)
    async update(
      data: TDTOs["update"][],
      @MedusaContext() sharedContext: Context = {}
    ): Promise<TEntity[]> {
      return (await this[propertyRepositoryName].update(
        data,
        sharedContext
      )) as TEntity[]
    }

    @InjectTransactionManager(doNotForceTransaction, propertyRepositoryName)
    async delete(
      primaryKeyValues: string[] | object[],
      @MedusaContext() sharedContext: Context = {}
    ): Promise<void> {
      await this[propertyRepositoryName].delete(primaryKeyValues, sharedContext)
    }

    @InjectTransactionManager(propertyRepositoryName)
    async softDelete(
      idsOrFilter: string[] | InternalFilterQuery,
      @MedusaContext() sharedContext: Context = {}
    ): Promise<[TEntity[], Record<string, unknown[]>]> {
      return await this[propertyRepositoryName].softDelete(
        idsOrFilter,
        sharedContext
      )
    }

    @InjectTransactionManager(propertyRepositoryName)
    async restore(
      idsOrFilter: string[] | InternalFilterQuery,
      @MedusaContext() sharedContext: Context = {}
    ): Promise<[TEntity[], Record<string, unknown[]>]> {
      return await this[propertyRepositoryName].restore(
        idsOrFilter,
        sharedContext
      )
    }

    @InjectTransactionManager(propertyRepositoryName)
    async upsert(
      data: (TDTOs["create"] | TDTOs["update"])[],
      @MedusaContext() sharedContext: Context = {}
    ): Promise<TEntity[]> {
      return await this[propertyRepositoryName].upsert(data, sharedContext)
    }
  }

  return AbstractService_ as unknown as new <TEntity extends {}>(
    container: TContainer
  ) => AbstractService<TEntity, TContainer, TDTOs, TFilters>
}
