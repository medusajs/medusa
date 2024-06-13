import {
  BaseFilterable,
  Context,
  FilterQuery,
  FilterQuery as InternalFilterQuery,
  FindConfig,
  ModulesSdkTypes,
  PerformedActions,
  UpsertWithReplaceConfig,
} from "@medusajs/types"
import { EntitySchema } from "@mikro-orm/core"
import { EntityClass } from "@mikro-orm/core/typings"
import {
  doNotForceTransaction,
  isDefined,
  isObject,
  isPresent,
  isString,
  lowerCaseFirst,
  MedusaError,
  shouldForceTransaction,
} from "../common"
import { FreeTextSearchFilterKey } from "../dal"
import { buildQuery } from "./build-query"
import {
  InjectManager,
  InjectTransactionManager,
  MedusaContext,
} from "./decorators"

type SelectorAndData = {
  selector: FilterQuery<any> | BaseFilterable<FilterQuery<any>>
  data: any
}

export function MedusaInternalService<TContainer extends object = object>(
  model: any
): {
  new <TEntity extends object = any>(
    container: TContainer
  ): ModulesSdkTypes.IMedusaInternalService<TEntity, TContainer>
} {
  const injectedRepositoryName = `${lowerCaseFirst(model.name)}Repository`
  const propertyRepositoryName = `__${injectedRepositoryName}__`

  class AbstractService_<TEntity extends object>
    implements ModulesSdkTypes.IMedusaInternalService<TEntity, TContainer>
  {
    readonly __container__: TContainer;
    [key: string]: any

    constructor(container: TContainer) {
      this.__container__ = container
      this[propertyRepositoryName] = container[injectedRepositoryName]
    }

    static applyFreeTextSearchFilter(
      filters: FilterQuery,
      config: FindConfig<any>
    ): void {
      if (isDefined(filters?.q)) {
        config.filters ??= {}
        config.filters[FreeTextSearchFilterKey] = {
          value: filters.q,
          fromEntity: model.name,
        }
        delete filters.q
      }
    }

    static retrievePrimaryKeys(entity: EntityClass<any> | EntitySchema<any>) {
      return (
        (entity as EntitySchema<any>).meta?.primaryKeys ??
        (entity as EntityClass<any>).prototype.__meta?.primaryKeys ?? ["id"]
      )
    }

    static buildUniqueCompositeKeyValue(keys: string[], data: object) {
      return keys.map((k) => data[k]).join(":")
    }

    /**
     * Only apply top level default ordering as the relation
     * default ordering is already applied through the foreign key
     * @param config
     */
    static applyDefaultOrdering(config: FindConfig<any>) {
      if (isPresent(config.order)) {
        return
      }

      config.order = {}

      const primaryKeys = AbstractService_.retrievePrimaryKeys(model)
      primaryKeys.forEach((primaryKey) => {
        config.order![primaryKey] = "ASC"
      })
    }

    @InjectManager(propertyRepositoryName)
    async retrieve(
      idOrObject: string | object,
      config: FindConfig<TEntity> = {},
      @MedusaContext() sharedContext: Context = {}
    ): Promise<TEntity> {
      const primaryKeys = AbstractService_.retrievePrimaryKeys(model)

      if (
        !isDefined(idOrObject) ||
        (isString(idOrObject) && primaryKeys.length > 1) ||
        ((!isString(idOrObject) ||
          (isObject(idOrObject) && !idOrObject[primaryKeys[0]])) &&
          primaryKeys.length === 1)
      ) {
        throw new MedusaError(
          MedusaError.Types.NOT_FOUND,
          `${
            primaryKeys.length === 1
              ? `${lowerCaseFirst(model.name) + " - " + primaryKeys[0]}`
              : `${lowerCaseFirst(model.name)} - ${primaryKeys.join(", ")}`
          } must be defined`
        )
      }

      let primaryKeysCriteria = {}
      if (primaryKeys.length === 1) {
        primaryKeysCriteria[primaryKeys[0]] = idOrObject
      } else {
        const idOrObject_ = Array.isArray(idOrObject)
          ? idOrObject
          : [idOrObject]
        primaryKeysCriteria = idOrObject_.map((primaryKeyValue) => ({
          $and: primaryKeys.map((key) => ({ [key]: primaryKeyValue[key] })),
        }))
      }

      const queryOptions = buildQuery(primaryKeysCriteria, config)

      const entities = await this[propertyRepositoryName].find(
        queryOptions,
        sharedContext
      )

      if (!entities?.length) {
        throw new MedusaError(
          MedusaError.Types.NOT_FOUND,
          `${model.name} with ${primaryKeys.join(", ")}: ${
            Array.isArray(idOrObject)
              ? idOrObject.map((v) =>
                  [isString(v) ? v : Object.values(v)].join(", ")
                )
              : idOrObject
          } was not found`
        )
      }

      return entities[0]
    }

    @InjectManager(propertyRepositoryName)
    async list(
      filters: FilterQuery<any> | BaseFilterable<FilterQuery<any>> = {},
      config: FindConfig<any> = {},
      @MedusaContext() sharedContext: Context = {}
    ): Promise<TEntity[]> {
      AbstractService_.applyDefaultOrdering(config)
      AbstractService_.applyFreeTextSearchFilter(filters, config)

      const queryOptions = buildQuery(filters, config)

      return await this[propertyRepositoryName].find(
        queryOptions,
        sharedContext
      )
    }

    @InjectManager(propertyRepositoryName)
    async listAndCount(
      filters: FilterQuery<any> | BaseFilterable<FilterQuery<any>> = {},
      config: FindConfig<any> = {},
      @MedusaContext() sharedContext: Context = {}
    ): Promise<[TEntity[], number]> {
      AbstractService_.applyDefaultOrdering(config)
      AbstractService_.applyFreeTextSearchFilter(filters, config)

      const queryOptions = buildQuery(filters, config)

      return await this[propertyRepositoryName].findAndCount(
        queryOptions,
        sharedContext
      )
    }

    create(data: any, sharedContext?: Context): Promise<TEntity>
    create(data: any[], sharedContext?: Context): Promise<TEntity[]>

    @InjectTransactionManager(shouldForceTransaction, propertyRepositoryName)
    async create(
      data: any | any[],
      @MedusaContext() sharedContext: Context = {}
    ): Promise<TEntity | TEntity[]> {
      if (!isDefined(data) || (Array.isArray(data) && data.length === 0)) {
        return (Array.isArray(data) ? [] : void 0) as TEntity | TEntity[]
      }

      const data_ = Array.isArray(data) ? data : [data]
      const entities = await this[propertyRepositoryName].create(
        data_,
        sharedContext
      )

      return Array.isArray(data) ? entities : entities[0]
    }

    update(data: any[], sharedContext?: Context): Promise<TEntity[]>
    update(data: any, sharedContext?: Context): Promise<TEntity>
    update(
      selectorAndData: SelectorAndData,
      sharedContext?: Context
    ): Promise<TEntity[]>
    update(
      selectorAndData: SelectorAndData[],
      sharedContext?: Context
    ): Promise<TEntity[]>

    @InjectTransactionManager(shouldForceTransaction, propertyRepositoryName)
    async update(
      input: any | any[] | SelectorAndData | SelectorAndData[],
      @MedusaContext() sharedContext: Context = {}
    ): Promise<TEntity | TEntity[]> {
      if (!isDefined(input) || (Array.isArray(input) && input.length === 0)) {
        return (Array.isArray(input) ? [] : void 0) as TEntity | TEntity[]
      }

      const primaryKeys = AbstractService_.retrievePrimaryKeys(model)
      const inputArray = Array.isArray(input) ? input : [input]

      const toUpdateData: { entity; update }[] = []

      // Only used when we receive data and no selector
      const keySelectorForDataOnly: any = {
        $or: [],
      }
      const keySelectorDataMap = new Map<string, any>()

      for (const input_ of inputArray) {
        if (input_.selector) {
          const entitiesToUpdate = await this.list(
            input_.selector,
            {
              take: null,
            },
            sharedContext
          )
          // Create a pair of entity and data to update
          entitiesToUpdate.forEach((entity) => {
            toUpdateData.push({
              entity,
              update: input_.data,
            })
          })
        } else {
          // in case we are manipulating the data, then extract the primary keys as a selector and the rest as the data to update
          const selector = {}

          primaryKeys.forEach((key) => {
            selector[key] = input_[key]
          })

          const uniqueCompositeKey =
            AbstractService_.buildUniqueCompositeKeyValue(primaryKeys, input_)
          keySelectorDataMap.set(uniqueCompositeKey, input_)

          keySelectorForDataOnly.$or.push(selector)
        }
      }

      if (keySelectorForDataOnly.$or.length) {
        const entitiesToUpdate = await this.list(
          keySelectorForDataOnly,
          {},
          sharedContext
        )

        // Create a pair of entity and data to update
        entitiesToUpdate.forEach((entity) => {
          const uniqueCompositeKey =
            AbstractService_.buildUniqueCompositeKeyValue(primaryKeys, entity)
          toUpdateData.push({
            entity,
            update: keySelectorDataMap.get(uniqueCompositeKey)!,
          })
        })

        // Only throw for missing entities when we dont have selectors involved as selector by design can return 0 entities
        if (entitiesToUpdate.length !== keySelectorDataMap.size) {
          const entityName = (model as EntityClass<TEntity>).name ?? model

          const compositeKeysValuesForFoundEntities = new Set(
            entitiesToUpdate.map((entity) => {
              return AbstractService_.buildUniqueCompositeKeyValue(
                primaryKeys,
                entity
              )
            })
          )

          const missingEntityValues: any[] = []

          ;[...keySelectorDataMap.keys()].filter((key) => {
            if (!compositeKeysValuesForFoundEntities.has(key)) {
              const value = key.replace(/:/gi, " - ")
              missingEntityValues.push(value)
            }
          })

          throw new MedusaError(
            MedusaError.Types.NOT_FOUND,
            `${entityName} with ${primaryKeys.join(
              ", "
            )} "${missingEntityValues.join(", ")}" not found`
          )
        }
      }

      return await this[propertyRepositoryName].update(
        toUpdateData,
        sharedContext
      )
    }

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

    @InjectTransactionManager(doNotForceTransaction, propertyRepositoryName)
    async delete(
      idOrSelector:
        | string
        | string[]
        | object
        | object[]
        | {
            selector: FilterQuery<any> | BaseFilterable<FilterQuery<any>>
          },
      @MedusaContext() sharedContext: Context = {}
    ): Promise<void> {
      if (
        !isDefined(idOrSelector) ||
        (Array.isArray(idOrSelector) && !idOrSelector.length)
      ) {
        return
      }

      const primaryKeys = AbstractService_.retrievePrimaryKeys(model)

      if (
        (Array.isArray(idOrSelector) && idOrSelector.length === 0) ||
        ((isString(idOrSelector) ||
          (Array.isArray(idOrSelector) && isString(idOrSelector[0]))) &&
          primaryKeys.length > 1)
      ) {
        throw new MedusaError(
          MedusaError.Types.NOT_FOUND,
          `${
            primaryKeys.length === 1
              ? `"${lowerCaseFirst(model.name) + " - " + primaryKeys[0]}"`
              : `${lowerCaseFirst(model.name)} - ${primaryKeys.join(", ")}`
          } must be defined`
        )
      }

      const deleteCriteria: any = {
        $or: [],
      }

      if (isObject(idOrSelector) && "selector" in idOrSelector) {
        const entitiesToDelete = await this.list(
          idOrSelector.selector as FilterQuery<any>,
          {
            select: primaryKeys,
          },
          sharedContext
        )

        for (const entity of entitiesToDelete) {
          const criteria = {}
          primaryKeys.forEach((key) => {
            criteria[key] = entity[key]
          })
          deleteCriteria.$or.push(criteria)
        }
      } else {
        const primaryKeysValues = Array.isArray(idOrSelector)
          ? idOrSelector
          : [idOrSelector]

        deleteCriteria.$or = primaryKeysValues.map((primaryKeyValue) => {
          const criteria = {}

          if (isObject(primaryKeyValue)) {
            Object.entries(primaryKeyValue).forEach(([key, value]) => {
              criteria[key] = value
            })
          } else {
            criteria[primaryKeys[0]] = primaryKeyValue
          }

          // TODO: Revisit
          /*primaryKeys.forEach((key) => {
            /!*if (
              isObject(primaryKeyValue) &&
              !isDefined(primaryKeyValue[key]) &&
              // primaryKeys.length > 1
            ) {
              throw new MedusaError(
                MedusaError.Types.INVALID_DATA,
                `Composite key must contain all primary key fields: ${primaryKeys.join(
                  ", "
                )}. Found: ${Object.keys(primaryKeyValue)}`
              )
            }*!/

            criteria[key] = isObject(primaryKeyValue)
              ? primaryKeyValue[key]
              : primaryKeyValue
          })*/
          return criteria
        })
      }

      await this[propertyRepositoryName].delete(deleteCriteria, sharedContext)
    }

    @InjectTransactionManager(propertyRepositoryName)
    async softDelete(
      idsOrFilter:
        | string
        | string[]
        | InternalFilterQuery
        | InternalFilterQuery[],
      @MedusaContext() sharedContext: Context = {}
    ): Promise<[TEntity[], Record<string, unknown[]>]> {
      if (
        (Array.isArray(idsOrFilter) && !idsOrFilter.length) ||
        (!Array.isArray(idsOrFilter) && !idsOrFilter)
      ) {
        return [[], {}]
      }

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

    upsert(data: any[], sharedContext?: Context): Promise<TEntity[]>
    upsert(data: any, sharedContext?: Context): Promise<TEntity>

    @InjectTransactionManager(propertyRepositoryName)
    async upsert(
      data: any | any[],
      @MedusaContext() sharedContext: Context = {}
    ): Promise<TEntity | TEntity[]> {
      const data_ = Array.isArray(data) ? data : [data]
      const entities = await this[propertyRepositoryName].upsert(
        data_,
        sharedContext
      )
      return Array.isArray(data) ? entities : entities[0]
    }

    upsertWithReplace(
      data: any[],
      config?: UpsertWithReplaceConfig<TEntity>,
      sharedContext?: Context
    ): Promise<{ entities: TEntity[]; performedActions: PerformedActions }>
    upsertWithReplace(
      data: any,
      config?: UpsertWithReplaceConfig<TEntity>,
      sharedContext?: Context
    ): Promise<{ entities: TEntity; performedActions: PerformedActions }>

    @InjectTransactionManager(propertyRepositoryName)
    async upsertWithReplace(
      data: any | any[],
      config: UpsertWithReplaceConfig<TEntity> = {
        relations: [],
      },
      @MedusaContext() sharedContext: Context = {}
    ): Promise<{
      entities: TEntity | TEntity[]
      performedActions: PerformedActions
    }> {
      const data_ = Array.isArray(data) ? data : [data]
      const { entities, performedActions } = await this[
        propertyRepositoryName
      ].upsertWithReplace(data_, config, sharedContext)
      return {
        entities: Array.isArray(data) ? entities : entities[0],
        performedActions,
      }
    }
  }

  return AbstractService_ as unknown as new <TEntity extends {}>(
    container: TContainer
  ) => ModulesSdkTypes.IMedusaInternalService<TEntity, TContainer>
}
