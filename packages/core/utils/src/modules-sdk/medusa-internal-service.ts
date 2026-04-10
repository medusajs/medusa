import {
  BaseFilterable,
  Context,
  FilterQuery,
  FindConfig,
  InferEntityType,
  FilterQuery as InternalFilterQuery,
  ModulesSdkTypes,
  PerformedActions,
  UpsertWithReplaceConfig,
} from "@medusajs/types"
import {
  EventType,
  type EntityClass,
  type EntityManager,
  type EntitySchema,
} from "@medusajs/deps/mikro-orm/core"
import {
  isDefined,
  isObject,
  isPresent,
  isString,
  lowerCaseFirst,
  MedusaError,
  mergeMetadata,
} from "../common"
import { FreeTextSearchFilterKeyPrefix } from "../dal"
import { DmlEntity, toMikroORMEntity } from "../dml"
import { buildQuery } from "./build-query"
import {
  InjectManager,
  InjectTransactionManager,
  MedusaContext,
} from "./decorators"
import { MedusaMikroOrmEventSubscriber } from "./create-medusa-mikro-orm-event-subscriber"

type InternalService = {
  new <TContainer extends object = object, TEntity extends object = any>(
    container: TContainer
  ): ModulesSdkTypes.IMedusaInternalService<TEntity, TContainer>

  setEventSubscriber(subscriber: MedusaMikroOrmEventSubscriber): void
}

type SelectorAndData = {
  selector: FilterQuery<any> | BaseFilterable<FilterQuery<any>>
  data: any
}

export function registerInternalServiceEventSubscriber(
  context: Context,
  subscriber?: MedusaMikroOrmEventSubscriber
) {
  const manager = (context.transactionManager ??
    context.manager) as EntityManager
  if (manager && subscriber) {
    const subscriberInstance = new subscriber(context)
    const hasListeners = Array.from(
      manager.getEventManager().getSubscribers()
    ).some((s) => s.constructor.name === subscriberInstance.constructor.name)
    if (!hasListeners) {
      manager.getEventManager().registerSubscriber(subscriberInstance)
    }
  }
}

export const MedusaInternalServiceSymbol = Symbol.for(
  "MedusaInternalServiceSymbol"
)

/**
 * Check if a value is a Medusa internal service
 * @param value
 */
export function isMedusaInternalService(value: any): value is InternalService {
  return (
    !!value?.[MedusaInternalServiceSymbol] ||
    !!value?.prototype?.[MedusaInternalServiceSymbol]
  )
}

export function MedusaInternalService<
  TContainer extends object = object,
  TEntity extends object = any
>(rawModel: any): InternalService {
  const model = DmlEntity.isDmlEntity(rawModel)
    ? toMikroORMEntity(rawModel)
    : rawModel

  const injectedRepositoryName = `${lowerCaseFirst(model.name)}Repository`
  const propertyRepositoryName = `__${injectedRepositoryName}__`

  class AbstractService_
    implements ModulesSdkTypes.IMedusaInternalService<TEntity, TContainer>
  {
    [MedusaInternalServiceSymbol] = true

    #eventSubscriber?: MedusaMikroOrmEventSubscriber

    readonly __container__: TContainer;
    [key: string]: any

    constructor(container: TContainer) {
      this.__container__ = container
      this[propertyRepositoryName] = container[injectedRepositoryName]
    }

    setEventSubscriber(subscriber: MedusaMikroOrmEventSubscriber) {
      this.#eventSubscriber = subscriber
    }

    static applyFreeTextSearchFilter(
      filters: FilterQuery & { q?: string },
      config: FindConfig<any>
    ): void {
      if (isDefined(filters?.q)) {
        config.filters ??= {}
        config.filters[FreeTextSearchFilterKeyPrefix + model.name] = {
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
      config: FindConfig<InferEntityType<TEntity>> = {},
      @MedusaContext() sharedContext: Context = {}
    ): Promise<InferEntityType<TEntity>> {
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
        primaryKeysCriteria = {
          $or: idOrObject_.map((primaryKeyValue) => ({
            $and: primaryKeys.map((key) => ({ [key]: primaryKeyValue[key] })),
          })),
        }
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
              : isObject(idOrObject)
              ? Object.values(idOrObject).join(", ")
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
    ): Promise<InferEntityType<TEntity>[]> {
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
    ): Promise<[InferEntityType<TEntity>[], number]> {
      AbstractService_.applyDefaultOrdering(config)
      AbstractService_.applyFreeTextSearchFilter(filters, config)

      const queryOptions = buildQuery(filters, config)

      return await this[propertyRepositoryName].findAndCount(
        queryOptions,
        sharedContext
      )
    }

    create(
      data: any,
      sharedContext?: Context
    ): Promise<InferEntityType<TEntity>>
    create(
      data: any[],
      sharedContext?: Context
    ): Promise<InferEntityType<TEntity>[]>

    @InjectTransactionManager(propertyRepositoryName)
    async create(
      data: any | any[],
      @MedusaContext() sharedContext: Context = {}
    ): Promise<InferEntityType<TEntity> | InferEntityType<TEntity>[]> {
      if (!isDefined(data) || (Array.isArray(data) && data.length === 0)) {
        return (Array.isArray(data) ? [] : void 0) as
          | InferEntityType<TEntity>
          | InferEntityType<TEntity>[]
      }

      registerInternalServiceEventSubscriber(
        sharedContext,
        this.#eventSubscriber
      )

      const data_ = Array.isArray(data) ? data : [data]
      const entities = await this[propertyRepositoryName].create(
        data_,
        sharedContext
      )

      return Array.isArray(data) ? entities : entities[0]
    }

    update(
      data: any[],
      sharedContext?: Context
    ): Promise<InferEntityType<TEntity>[]>
    update(
      data: any,
      sharedContext?: Context
    ): Promise<InferEntityType<TEntity>>
    update(
      selectorAndData: SelectorAndData,
      sharedContext?: Context
    ): Promise<InferEntityType<TEntity>[]>
    update(
      selectorAndData: SelectorAndData[],
      sharedContext?: Context
    ): Promise<InferEntityType<TEntity>[]>

    @InjectTransactionManager(propertyRepositoryName)
    async update(
      input: any | any[] | SelectorAndData | SelectorAndData[],
      @MedusaContext() sharedContext: Context = {}
    ): Promise<InferEntityType<TEntity> | InferEntityType<TEntity>[]> {
      if (!isDefined(input) || (Array.isArray(input) && input.length === 0)) {
        return (Array.isArray(input) ? [] : void 0) as
          | InferEntityType<TEntity>
          | InferEntityType<TEntity>[]
      }

      registerInternalServiceEventSubscriber(
        sharedContext,
        this.#eventSubscriber
      )

      let shouldReturnArray = false
      if (Array.isArray(input)) {
        shouldReturnArray = true
      } else if (isObject(input) && "selector" in input) {
        shouldReturnArray = true
      }

      const primaryKeys = AbstractService_.retrievePrimaryKeys(model)
      const inputArray = Array.isArray(input) ? input : [input]

      const toUpdateData: { entity: TEntity; update: Partial<TEntity> }[] = []

      // Only used when we receive data and no selector
      const keySelectorForDataOnly: any = {
        $or: [],
      }
      const keySelectorDataMap = new Map<string, any>()

      for (const input_ of inputArray) {
        if (input_.selector) {
          const entitiesToUpdate = await this.list(
            input_.selector,
            {},
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
          const entityName =
            (model as EntityClass<InferEntityType<TEntity>>).name ?? model

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

      if (!toUpdateData.length) {
        return (shouldReturnArray ? [] : void 0) as
          | InferEntityType<TEntity>
          | InferEntityType<TEntity>[]
      }

      // Manage metadata if needed
      toUpdateData.forEach(({ entity, update }) => {
        const update_ = update as (typeof toUpdateData)[number]["update"] & {
          metadata: Record<string, unknown>
        }
        const entity_ = entity as InferEntityType<TEntity> & {
          metadata?: Record<string, unknown>
        }

        if (isPresent(update_.metadata)) {
          entity_.metadata = update_.metadata = mergeMetadata(
            entity_.metadata ?? {},
            update_.metadata
          )
        }
      })

      const entities = await this[propertyRepositoryName].update(
        toUpdateData,
        sharedContext
      )

      return shouldReturnArray ? entities : entities[0]
    }

    delete(idOrSelector: string, sharedContext?: Context): Promise<string[]>
    delete(idOrSelector: string[], sharedContext?: Context): Promise<string[]>
    delete(idOrSelector: object, sharedContext?: Context): Promise<string[]>
    delete(idOrSelector: object[], sharedContext?: Context): Promise<string[]>
    delete(
      idOrSelector: {
        selector: FilterQuery<any> | BaseFilterable<FilterQuery<any>>
      },
      sharedContext?: Context
    ): Promise<string[]>

    @InjectTransactionManager(propertyRepositoryName)
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
    ): Promise<string[]> {
      if (
        !isDefined(idOrSelector) ||
        (Array.isArray(idOrSelector) && !idOrSelector.length)
      ) {
        return []
      }

      registerInternalServiceEventSubscriber(
        sharedContext,
        this.#eventSubscriber
      )

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
        deleteCriteria.$or.push(idOrSelector.selector)
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

          return criteria
        })
      }

      if (!deleteCriteria.$or.length) {
        return []
      }

      const deletedIds = await this[propertyRepositoryName].delete(
        deleteCriteria,
        sharedContext
      )

      // Delete are handled a bit differently since we are going to the DB directly, therefore
      // just like upsert with replace, we need to dispatch the events manually.
      if (deletedIds.length) {
        const manager = (sharedContext.transactionManager ??
          sharedContext.manager) as EntityManager
        const eventManager = manager.getEventManager()

        deletedIds.forEach((id) => {
          eventManager.dispatchEvent(EventType.afterDelete, {
            entity: { id },
            meta: {
              className: model.name,
            } as Parameters<typeof eventManager.dispatchEvent>[2],
          })
        })
      }

      return deletedIds
    }

    @InjectTransactionManager(propertyRepositoryName)
    async softDelete(
      idsOrFilter:
        | string
        | string[]
        | InternalFilterQuery
        | InternalFilterQuery[],
      @MedusaContext() sharedContext: Context = {}
    ): Promise<[InferEntityType<TEntity>[], Record<string, unknown[]>]> {
      if (
        (Array.isArray(idsOrFilter) && !idsOrFilter.length) ||
        (!Array.isArray(idsOrFilter) && !idsOrFilter)
      ) {
        return [[], {}]
      }

      registerInternalServiceEventSubscriber(
        sharedContext,
        this.#eventSubscriber
      )

      return await this[propertyRepositoryName].softDelete(
        idsOrFilter,
        sharedContext
      )
    }

    @InjectTransactionManager(propertyRepositoryName)
    async restore(
      idsOrFilter: string[] | InternalFilterQuery,
      @MedusaContext() sharedContext: Context = {}
    ): Promise<[InferEntityType<TEntity>[], Record<string, unknown[]>]> {
      return await this[propertyRepositoryName].restore(
        idsOrFilter,
        sharedContext
      )
    }

    upsert(
      data: any[],
      sharedContext?: Context
    ): Promise<InferEntityType<TEntity>[]>
    upsert(
      data: any,
      sharedContext?: Context
    ): Promise<InferEntityType<TEntity>>

    @InjectTransactionManager(propertyRepositoryName)
    async upsert(
      data: any | any[],
      @MedusaContext() sharedContext: Context = {}
    ): Promise<InferEntityType<TEntity> | InferEntityType<TEntity>[]> {
      registerInternalServiceEventSubscriber(
        sharedContext,
        this.#eventSubscriber
      )

      const data_ = Array.isArray(data) ? data : [data]
      const entities = await this[propertyRepositoryName].upsert(
        data_,
        sharedContext
      )
      return Array.isArray(data) ? entities : entities[0]
    }

    upsertWithReplace(
      data: any[],
      config?: UpsertWithReplaceConfig<InferEntityType<TEntity>>,
      sharedContext?: Context
    ): Promise<{
      entities: InferEntityType<TEntity>[]
      performedActions: PerformedActions
    }>
    upsertWithReplace(
      data: any,
      config?: UpsertWithReplaceConfig<InferEntityType<TEntity>>,
      sharedContext?: Context
    ): Promise<{
      entities: InferEntityType<TEntity>
      performedActions: PerformedActions
    }>

    @InjectTransactionManager(propertyRepositoryName)
    async upsertWithReplace(
      data: any | any[],
      config: UpsertWithReplaceConfig<InferEntityType<TEntity>> = {
        relations: [],
      },
      @MedusaContext() sharedContext: Context = {}
    ): Promise<{
      entities: InferEntityType<TEntity> | InferEntityType<TEntity>[]
      performedActions: PerformedActions
    }> {
      registerInternalServiceEventSubscriber(
        sharedContext,
        this.#eventSubscriber
      )

      const data_ = Array.isArray(data) ? data : [data]
      const { entities, performedActions } = await this[
        propertyRepositoryName
      ].upsertWithReplace(data_, config, sharedContext)

      const manager = (sharedContext.transactionManager ??
        sharedContext.manager) as EntityManager
      const eventManager = manager.getEventManager()

      /**
       * Since the upsertWithReplace method is not emitting events, we need to do it manually
       * by dispatching the events manually.
       */

      const createdEntities = !!Object.keys(performedActions.created).length
      const updatedEntities = !!Object.keys(performedActions.updated).length
      const deletedEntities = !!Object.keys(performedActions.deleted).length

      if (createdEntities) {
        Object.entries(
          performedActions.created as Record<string, any[]>
        ).forEach(([modelName, entities]) => {
          entities.forEach((entity) => {
            eventManager.dispatchEvent(EventType.afterCreate, {
              entity,
              meta: {
                className: modelName,
              } as Parameters<typeof eventManager.dispatchEvent>[2],
            })
          })
        })
      }

      if (updatedEntities) {
        Object.entries(
          performedActions.updated as Record<string, any[]>
        ).forEach(([modelName, entities]) => {
          entities.forEach((entity) => {
            eventManager.dispatchEvent(EventType.afterUpdate, {
              entity,
              meta: {
                className: modelName,
              } as Parameters<typeof eventManager.dispatchEvent>[2],
            })
          })
        })
      }

      if (deletedEntities) {
        Object.entries(
          performedActions.deleted as Record<string, any[]>
        ).forEach(([modelName, entities]) => {
          entities.forEach((entity) => {
            eventManager.dispatchEvent(EventType.afterDelete, {
              entity,
              meta: {
                className: modelName,
              } as Parameters<typeof eventManager.dispatchEvent>[2],
            })
          })
        })
      }

      return {
        entities: Array.isArray(data) ? entities : entities[0],
        performedActions,
      }
    }
  }

  // We hide away the setEventSubscriber method from the public interface
  // as it is not meant to be used by the user.
  return AbstractService_ as unknown as InternalService
}
