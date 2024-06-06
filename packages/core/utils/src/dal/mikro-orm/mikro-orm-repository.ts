import {
  BaseFilterable,
  Context,
  DAL,
  FilterQuery,
  FilterQuery as InternalFilterQuery,
  PerformedActions,
  RepositoryService,
  RepositoryTransformOptions,
  UpsertWithReplaceConfig,
} from "@medusajs/types"
import {
  EntityManager,
  EntitySchema,
  LoadStrategy,
  ReferenceType,
  RequiredEntityData,
} from "@mikro-orm/core"
import { FindOptions as MikroOptions } from "@mikro-orm/core/drivers/IDatabaseDriver"
import {
  EntityClass,
  EntityName,
  EntityProperty,
  FilterQuery as MikroFilterQuery,
} from "@mikro-orm/core/typings"
import { SqlEntityManager } from "@mikro-orm/postgresql"
import {
  arrayDifference,
  isString,
  MedusaError,
  promiseAll,
} from "../../common"
import { buildQuery } from "../../modules-sdk"
import {
  getSoftDeletedCascadedEntitiesIdsMappedBy,
  transactionWrapper,
} from "../utils"
import { dbErrorMapper } from "./db-error-mapper"
import { mikroOrmSerializer } from "./mikro-orm-serializer"
import { mikroOrmUpdateDeletedAtRecursively } from "./utils"

export class MikroOrmBase<T = any> {
  readonly manager_: any

  protected constructor({ manager }) {
    this.manager_ = manager
  }

  getFreshManager<TManager = unknown>(): TManager {
    return (this.manager_.fork
      ? this.manager_.fork()
      : this.manager_) as unknown as TManager
  }

  getActiveManager<TManager = unknown>({
    transactionManager,
    manager,
  }: Context = {}): TManager {
    return (transactionManager ?? manager ?? this.manager_) as TManager
  }

  async transaction<TManager = unknown>(
    task: (transactionManager: TManager) => Promise<any>,
    options: {
      isolationLevel?: string
      enableNestedTransactions?: boolean
      transaction?: TManager
    } = {}
  ): Promise<any> {
    const freshManager = this.getFreshManager
      ? this.getFreshManager()
      : this.manager_

    return await transactionWrapper(freshManager, task, options).catch(
      dbErrorMapper
    )
  }

  async serialize<TOutput extends object | object[]>(
    data: any,
    options?: any
  ): Promise<TOutput> {
    return await mikroOrmSerializer<TOutput>(data, options)
  }
}

/**
 * Privileged extends of the abstract classes unless most of the methods can't be implemented
 * in your repository. This base repository is also used to provide a base repository
 * injection if needed to be able to use the common methods without being related to an entity.
 * In this case, none of the method will be implemented except the manager and transaction
 * related ones.
 */

export class MikroOrmBaseRepository<T extends object = object>
  extends MikroOrmBase<T>
  implements RepositoryService<T>
{
  constructor(...args: any[]) {
    // @ts-ignore
    super(...arguments)
  }

  static buildUniqueCompositeKeyValue(keys: string[], data: object) {
    return keys.map((k) => data[k]).join("_")
  }

  static retrievePrimaryKeys(entity: EntityClass<any> | EntitySchema) {
    return (
      (entity as EntitySchema).meta?.primaryKeys ??
      (entity as EntityClass<any>).prototype.__meta.primaryKeys ?? ["id"]
    )
  }

  create(data: unknown[], context?: Context): Promise<T[]> {
    throw new Error("Method not implemented.")
  }

  update(data: { entity; update }[], context?: Context): Promise<T[]> {
    throw new Error("Method not implemented.")
  }

  delete(
    idsOrPKs: FilterQuery<T> & BaseFilterable<FilterQuery<T>>,
    context?: Context
  ): Promise<void> {
    throw new Error("Method not implemented.")
  }

  find(options?: DAL.FindOptions<T>, context?: Context): Promise<T[]> {
    throw new Error("Method not implemented.")
  }

  findAndCount(
    options?: DAL.FindOptions<T>,
    context?: Context
  ): Promise<[T[], number]> {
    throw new Error("Method not implemented.")
  }

  upsert(data: unknown[], context: Context = {}): Promise<T[]> {
    throw new Error("Method not implemented.")
  }

  upsertWithReplace(
    data: unknown[],
    config: UpsertWithReplaceConfig<T> = {
      relations: [],
    },
    context: Context = {}
  ): Promise<{ entities: T[]; performedActions: PerformedActions }> {
    throw new Error("Method not implemented.")
  }

  async softDelete(
    filters:
      | string
      | string[]
      | (FilterQuery<T> & BaseFilterable<FilterQuery<T>>)
      | (FilterQuery<T> & BaseFilterable<FilterQuery<T>>)[],
    sharedContext: Context = {}
  ): Promise<[T[], Record<string, unknown[]>]> {
    const entities = await this.find({ where: filters as any }, sharedContext)
    const date = new Date()

    const manager = this.getActiveManager<SqlEntityManager>(sharedContext)
    await mikroOrmUpdateDeletedAtRecursively<T>(
      manager,
      entities as any[],
      date
    )

    const softDeletedEntitiesMap = getSoftDeletedCascadedEntitiesIdsMappedBy({
      entities,
    })

    return [entities, softDeletedEntitiesMap]
  }

  async restore(
    idsOrFilter: string[] | InternalFilterQuery,
    sharedContext: Context = {}
  ): Promise<[T[], Record<string, unknown[]>]> {
    const query = buildQuery(idsOrFilter, {
      withDeleted: true,
    })

    const entities = await this.find(query, sharedContext)

    const manager = this.getActiveManager<SqlEntityManager>(sharedContext)
    await mikroOrmUpdateDeletedAtRecursively(manager, entities as any[], null)

    const softDeletedEntitiesMap = getSoftDeletedCascadedEntitiesIdsMappedBy({
      entities,
      restored: true,
    })

    return [entities, softDeletedEntitiesMap]
  }

  applyFreeTextSearchFilters<T>(
    findOptions: DAL.FindOptions<T & { q?: string }>,
    retrieveConstraintsToApply: (q: string) => any[]
  ): void {
    if (!("q" in findOptions.where) || !findOptions.where.q) {
      delete findOptions.where.q

      return
    }

    const q = findOptions.where.q as string
    delete findOptions.where.q

    findOptions.where = {
      $and: [findOptions.where, { $or: retrieveConstraintsToApply(q) }],
    } as unknown as DAL.FilterQuery<T & { q?: string }>
  }
}

export class MikroOrmBaseTreeRepository<
  T extends object = object
> extends MikroOrmBase<T> {
  constructor() {
    // @ts-ignore
    super(...arguments)
  }

  find(
    options?: DAL.FindOptions,
    transformOptions?: RepositoryTransformOptions,
    context?: Context
  ): Promise<T[]> {
    throw new Error("Method not implemented.")
  }

  findAndCount(
    options?: DAL.FindOptions,
    transformOptions?: RepositoryTransformOptions,
    context?: Context
  ): Promise<[T[], number]> {
    throw new Error("Method not implemented.")
  }

  create(data: unknown, context?: Context): Promise<T> {
    throw new Error("Method not implemented.")
  }

  delete(id: string, context?: Context): Promise<void> {
    throw new Error("Method not implemented.")
  }
}

export function mikroOrmBaseRepositoryFactory<T extends object = object>(
  entity: any
): {
  new ({ manager }: { manager: any }): MikroOrmBaseRepository<T>
} {
  class MikroOrmAbstractBaseRepository_ extends MikroOrmBaseRepository<T> {
    // @ts-ignore
    constructor(...args: any[]) {
      // @ts-ignore
      super(...arguments)

      return new Proxy(this, {
        get: (target, prop) => {
          if (typeof target[prop] === "function") {
            return (...args) => {
              const res = target[prop].bind(target)(...args)
              if (res instanceof Promise) {
                return res.catch(dbErrorMapper)
              }

              return res
            }
          }

          return target[prop]
        },
      })
    }

    async create(data: any[], context?: Context): Promise<T[]> {
      const manager = this.getActiveManager<EntityManager>(context)

      const entities = data.map((data_) => {
        return manager.create(
          entity as EntityName<T>,
          data_ as RequiredEntityData<T>
        )
      })

      manager.persist(entities)

      return entities
    }

    async update(data: { entity; update }[], context?: Context): Promise<T[]> {
      const manager = this.getActiveManager<EntityManager>(context)
      const entities = data.map((data_) => {
        return manager.assign(data_.entity, data_.update)
      })

      manager.persist(entities)

      return entities
    }

    async delete(
      filters: FilterQuery<T> & BaseFilterable<FilterQuery<T>>,
      context?: Context
    ): Promise<void> {
      const manager = this.getActiveManager<EntityManager>(context)
      await manager.nativeDelete<T>(entity as EntityName<T>, filters as any)
    }

    async find(options?: DAL.FindOptions<T>, context?: Context): Promise<T[]> {
      const manager = this.getActiveManager<EntityManager>(context)

      const findOptions_ = { ...options }
      findOptions_.options ??= {}

      if (!("strategy" in findOptions_.options)) {
        if (findOptions_.options.limit != null || findOptions_.options.offset) {
          Object.assign(findOptions_.options, {
            strategy: LoadStrategy.SELECT_IN,
          })
        } else {
          Object.assign(findOptions_.options, {
            strategy: LoadStrategy.JOINED,
          })
        }
      }

      return await manager.find(
        entity as EntityName<T>,
        findOptions_.where as MikroFilterQuery<T>,
        findOptions_.options as MikroOptions<T>
      )
    }

    async findAndCount(
      findOptions: DAL.FindOptions<T> = { where: {} },
      context: Context = {}
    ): Promise<[T[], number]> {
      const manager = this.getActiveManager<EntityManager>(context)

      const findOptions_ = { ...findOptions }
      findOptions_.options ??= {}

      Object.assign(findOptions_.options, {
        strategy: LoadStrategy.SELECT_IN,
      })

      return await manager.findAndCount(
        entity as EntityName<T>,
        findOptions_.where as MikroFilterQuery<T>,
        findOptions_.options as MikroOptions<T>
      )
    }

    async upsert(data: any[], context: Context = {}): Promise<T[]> {
      const manager = this.getActiveManager<EntityManager>(context)

      const primaryKeys =
        MikroOrmAbstractBaseRepository_.retrievePrimaryKeys(entity)

      let primaryKeysCriteria: { [key: string]: any }[] = []
      if (primaryKeys.length === 1) {
        const primaryKeyValues = data
          .map((d) => d[primaryKeys[0]])
          .filter(Boolean)

        if (primaryKeyValues.length) {
          primaryKeysCriteria.push({
            [primaryKeys[0]]: primaryKeyValues,
          })
        }
      } else {
        primaryKeysCriteria = data.map((d) => ({
          $and: primaryKeys.map((key) => ({ [key]: d[key] })),
        }))
      }

      let allEntities: T[][] = []

      if (primaryKeysCriteria.length) {
        allEntities = await Promise.all(
          primaryKeysCriteria.map(
            async (criteria) =>
              await this.find(
                { where: criteria } as DAL.FindOptions<T>,
                context
              )
          )
        )
      }

      const existingEntities = allEntities.flat()

      const existingEntitiesMap = new Map<string, T>()
      existingEntities.forEach((entity) => {
        if (entity) {
          const key =
            MikroOrmAbstractBaseRepository_.buildUniqueCompositeKeyValue(
              primaryKeys,
              entity
            )
          existingEntitiesMap.set(key, entity)
        }
      })

      const upsertedEntities: T[] = []
      const createdEntities: T[] = []
      const updatedEntities: T[] = []

      data.forEach((data_) => {
        // In case the data provided are just strings, then we build an object with the primary key as the key and the data as the valuecd -
        const key =
          MikroOrmAbstractBaseRepository_.buildUniqueCompositeKeyValue(
            primaryKeys,
            data_
          )

        const existingEntity = existingEntitiesMap.get(key)
        if (existingEntity) {
          const updatedType = manager.assign(existingEntity, data_)
          updatedEntities.push(updatedType)
        } else {
          const newEntity = manager.create<T>(entity, data_)
          createdEntities.push(newEntity)
        }
      })

      if (createdEntities.length) {
        manager.persist(createdEntities)
        upsertedEntities.push(...createdEntities)
      }

      if (updatedEntities.length) {
        manager.persist(updatedEntities)
        upsertedEntities.push(...updatedEntities)
      }

      // TODO return the all, created, updated entities
      return upsertedEntities
    }

    // UpsertWithReplace does several things to simplify module implementation.
    // For each entry of your base entity, it will go through all one-to-many and many-to-many relations, and it will do a diff between what is passed and what is in the database.
    // For each relation, it create new entries (without an ID), it will associate existing entries (with only an ID), and it will update existing entries (with an ID and other fields).
    // Finally, it will delete the relation entries that were omitted in the new data.
    // The response is a POJO of the data that was written to the DB, including all new IDs. The order is preserved with the input.
    // Limitations: We expect that IDs are used as primary keys, and we don't support composite keys.
    // We only support 1-level depth of upserts. We don't support custom fields on the many-to-many pivot tables for now
    async upsertWithReplace(
      data: any[],
      config: UpsertWithReplaceConfig<T> = {
        relations: [],
      },
      context: Context = {}
    ): Promise<{ entities: T[]; performedActions: PerformedActions }> {
      const performedActions: PerformedActions = {
        created: {},
        updated: {},
        deleted: {},
      }

      if (!data.length) {
        return { entities: [], performedActions }
      }

      // We want to convert a potential ORM model to a POJO
      const normalizedData: any[] = await this.serialize(data)

      const manager = this.getActiveManager<SqlEntityManager>(context)
      // Handle the relations
      const allRelations = manager
        .getDriver()
        .getMetadata()
        .get(entity.name).relations

      const nonexistentRelations = arrayDifference(
        (config.relations as any) ?? [],
        allRelations.map((r) => r.name)
      )

      if (nonexistentRelations.length) {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          `Nonexistent relations were passed during upsert: ${nonexistentRelations}`
        )
      }

      // We want to response with all the data including the IDs in the same order as the input. We also include data that was passed but not processed.
      const reconstructedResponse: any[] = []
      const originalDataMap = new Map<string, T>()

      // Create only the top-level entity without the relations first
      const toUpsert = normalizedData.map((entry) => {
        // Make a copy of the data and remove undefined fields. The data is already a POJO due to the serialization above
        const entryCopy = JSON.parse(JSON.stringify(entry))
        const reconstructedEntry: any = {}

        allRelations?.forEach((relation) => {
          reconstructedEntry[relation.name] = this.handleRelationAssignment_(
            relation,
            entryCopy
          )
        })

        const mainEntity = this.getEntityWithId(manager, entity.name, entryCopy)
        reconstructedResponse.push({ ...mainEntity, ...reconstructedEntry })
        originalDataMap.set(mainEntity.id, entry)

        return mainEntity
      })

      let {
        orderedEntities: upsertedTopLevelEntities,
        performedActions: performedActions_,
      } = await this.upsertMany_(manager, entity.name, toUpsert)

      this.mergePerformedActions(performedActions, performedActions_)

      await promiseAll(
        upsertedTopLevelEntities
          .map((entityEntry, i) => {
            const originalEntry = originalDataMap.get((entityEntry as any).id)!
            const reconstructedEntry = reconstructedResponse[i]

            return allRelations?.map(async (relation) => {
              const relationName = relation.name as keyof T
              if (!config.relations?.includes(relationName)) {
                return
              }

              // TODO: Handle ONE_TO_ONE
              // One to one and Many to one are handled outside of the assignment as they need to happen before the main entity is created
              if (
                relation.reference === ReferenceType.ONE_TO_ONE ||
                relation.reference === ReferenceType.MANY_TO_ONE
              ) {
                return
              }

              const { entities, performedActions: performedActions_ } =
                await this.assignCollectionRelation_(
                  manager,
                  { ...originalEntry, id: (entityEntry as any).id },
                  relation
                )

              this.mergePerformedActions(performedActions, performedActions_)
              reconstructedEntry[relationName] = entities
              return
            })
          })
          .flat()
      )

      // // We want to populate the identity map with the data that was written to the DB, and return an entity object
      // return reconstructedResponse.map((r) =>
      //   manager.create(entity, r, { persist: false })
      // )

      return { entities: reconstructedResponse, performedActions }
    }

    private mergePerformedActions(
      performedActions: PerformedActions,
      newPerformedActions: PerformedActions
    ) {
      Object.entries(newPerformedActions).forEach(([action, entities]) => {
        Object.entries(entities as Record<string, any[]>).forEach(
          ([entityName, entityData]) => {
            performedActions[action][entityName] ??= []
            performedActions[action][entityName].push(...entityData)
          }
        )
      })
    }

    // FUTURE: We can make this performant by only aggregating the operations, but only executing them at the end.
    protected async assignCollectionRelation_(
      manager: SqlEntityManager,
      data: T,
      relation: EntityProperty
    ): Promise<{ entities: any[]; performedActions: PerformedActions }> {
      const dataForRelation = data[relation.name]

      const performedActions: PerformedActions = {
        created: {},
        updated: {},
        deleted: {},
      }

      // If the field is not set, we ignore it. Null and empty arrays are a valid input and are handled below
      if (dataForRelation === undefined) {
        return { entities: [], performedActions }
      }

      // Make sure the data is correctly initialized with IDs before using it
      const normalizedData = dataForRelation.map((normalizedItem) => {
        return this.getEntityWithId(manager, relation.type, normalizedItem)
      })

      if (relation.reference === ReferenceType.MANY_TO_MANY) {
        const currentPivotColumn = relation.inverseJoinColumns[0]
        const parentPivotColumn = relation.joinColumns[0]

        if (!normalizedData.length) {
          await manager.nativeDelete(relation.pivotEntity, {
            [parentPivotColumn]: (data as any).id,
          })

          return { entities: normalizedData, performedActions }
        }

        const { performedActions: performedActions_ } = await this.upsertMany_(
          manager,
          relation.type,
          normalizedData,
          true
        )
        this.mergePerformedActions(performedActions, performedActions_)

        const pivotData = normalizedData.map((currModel) => {
          return {
            [parentPivotColumn]: (data as any).id,
            [currentPivotColumn]: currModel.id,
          }
        })

        const qb = manager.qb(relation.pivotEntity)
        await qb.insert(pivotData).onConflict().ignore().execute()

        await manager.nativeDelete(relation.pivotEntity, {
          [parentPivotColumn]: (data as any).id,
          [currentPivotColumn]: {
            $nin: pivotData.map((d) => d[currentPivotColumn]),
          },
        })

        return { entities: normalizedData, performedActions }
      }

      if (relation.reference === ReferenceType.ONE_TO_MANY) {
        const joinColumns =
          relation.targetMeta?.properties[relation.mappedBy]?.joinColumns

        const joinColumnsConstraints = {}
        joinColumns?.forEach((joinColumn, index) => {
          const referencedColumnName = relation.referencedColumnNames[index]
          joinColumnsConstraints[joinColumn] = data[referencedColumnName]
        })

        if (normalizedData.length) {
          normalizedData.forEach((normalizedDataItem: any) => {
            Object.assign(normalizedDataItem, {
              ...joinColumnsConstraints,
            })
          })

          const { performedActions: performedActions_ } =
            await this.upsertMany_(manager, relation.type, normalizedData)
          this.mergePerformedActions(performedActions, performedActions_)
        }

        const toDeleteEntities = await manager.find<any>(
          relation.type,
          {
            id: { $nin: normalizedData.map((d: any) => d.id) },
          },
          {
            fields: ["id"],
          }
        )
        const toDeleteIds = toDeleteEntities.map((d: any) => d.id)

        await manager.nativeDelete(relation.type, {
          ...joinColumnsConstraints,
          id: { $in: toDeleteIds },
        })

        if (toDeleteEntities.length) {
          performedActions.deleted[relation.type] ??= []
          performedActions.deleted[relation.type].push(
            ...toDeleteEntities.map((d) => ({ id: d.id }))
          )
        }

        return { entities: normalizedData, performedActions }
      }

      return { entities: normalizedData, performedActions }
    }

    protected handleRelationAssignment_(
      relation: EntityProperty<any>,
      entryCopy: T
    ) {
      const originalData = entryCopy[relation.name]
      delete entryCopy[relation.name]

      if (originalData === undefined) {
        return undefined
      }

      // If it is a many-to-one we ensure the ID is set for when we want to set/unset an association
      if (relation.reference === ReferenceType.MANY_TO_ONE) {
        if (originalData === null) {
          entryCopy[relation.joinColumns[0]] = null
          return null
        }

        // The relation can either be a primitive or the entity object, depending on how it's defined on the model
        let relationId
        if (isString(originalData)) {
          relationId = originalData
        } else if ("id" in originalData) {
          relationId = originalData.id
        }

        // We don't support creating many-to-one relations, so we want to throw if someone doesn't pass the ID
        if (!relationId) {
          throw new MedusaError(
            MedusaError.Types.INVALID_DATA,
            `Many-to-one relation ${relation.name} must be set with an ID`
          )
        }

        entryCopy[relation.joinColumns[0]] = relationId
        return originalData
      }

      return undefined
    }

    // Returns a POJO object with the ID populated from the entity model hooks
    protected getEntityWithId(
      manager: SqlEntityManager,
      entityName: string,
      data: any
    ): Record<string, any> & { id: string } {
      const created = manager.create(entityName, data, {
        managed: false,
        persist: false,
      })

      const resp = {
        // `create` will omit non-existent fields, but we want to pass the data the user provided through so the correct errors get thrown
        ...data,
        ...(created as any).__helper.__bignumberdata,
        id: (created as any).id,
      }

      // Non-persist relation columns should be removed before we do the upsert.
      Object.entries((created as any).__helper?.__meta.properties ?? {})
        .filter(
          ([_, propDef]: any) =>
            propDef.persist === false &&
            propDef.reference === ReferenceType.MANY_TO_ONE
        )
        .forEach(([key]) => {
          delete resp[key]
        })

      return resp
    }

    protected async upsertMany_(
      manager: SqlEntityManager,
      entityName: string,
      entries: any[],
      skipUpdate: boolean = false
    ): Promise<{ orderedEntities: any[]; performedActions: PerformedActions }> {
      const selectQb = manager.qb(entityName)
      const existingEntities: any[] = await selectQb.select("*").where({
        id: { $in: entries.map((d) => d.id) },
      })

      const existingEntitiesMap = new Map(
        existingEntities.map((e) => [e.id, e])
      )

      const orderedEntities: T[] = []

      const performedActions = {
        created: {},
        updated: {},
        deleted: {},
      }

      await promiseAll(
        entries.map(async (data) => {
          const existingEntity = existingEntitiesMap.get(data.id)
          orderedEntities.push(data)
          if (existingEntity) {
            if (skipUpdate) {
              return
            }
            await manager.nativeUpdate(entityName, { id: data.id }, data)
            performedActions.updated[entityName] ??= []
            performedActions.updated[entityName].push({ id: data.id })
          } else {
            const qb = manager.qb(entityName)
            if (skipUpdate) {
              const res = await qb
                .insert(data)
                .onConflict()
                .ignore()
                .execute("all", true)
              if (res) {
                performedActions.created[entityName] ??= []
                performedActions.created[entityName].push({ id: data.id })
              }
            } else {
              await manager.insert(entityName, data)
              performedActions.created[entityName] ??= []
              performedActions.created[entityName].push({ id: data.id })
              // await manager.insert(entityName, data)
            }
          }
        })
      )

      return { orderedEntities, performedActions }
    }

    async restore(
      filters:
        | string
        | string[]
        | (FilterQuery<T> & BaseFilterable<FilterQuery<T>>)
        | (FilterQuery<T> & BaseFilterable<FilterQuery<T>>)[],
      sharedContext: Context = {}
    ): Promise<[T[], Record<string, unknown[]>]> {
      if (Array.isArray(filters) && !filters.filter(Boolean).length) {
        return [[], {}]
      }

      if (!filters) {
        return [[], {}]
      }

      const normalizedFilters = this.normalizeFilters(filters)

      return await super.restore(normalizedFilters, sharedContext)
    }

    async softDelete(
      filters:
        | string
        | string[]
        | (FilterQuery<T> & BaseFilterable<FilterQuery<T>>)
        | (FilterQuery<T> & BaseFilterable<FilterQuery<T>>)[],
      sharedContext: Context = {}
    ): Promise<[T[], Record<string, unknown[]>]> {
      if (Array.isArray(filters) && !filters.filter(Boolean).length) {
        return [[], {}]
      }

      if (!filters) {
        return [[], {}]
      }

      const normalizedFilters = this.normalizeFilters(filters)

      return await super.softDelete(normalizedFilters, sharedContext)
    }

    private normalizeFilters(
      filters:
        | string
        | string[]
        | (FilterQuery<T> & BaseFilterable<FilterQuery<T>>)
        | (FilterQuery<T> & BaseFilterable<FilterQuery<T>>)[]
    ) {
      const primaryKeys =
        MikroOrmAbstractBaseRepository_.retrievePrimaryKeys(entity)

      const filterArray = Array.isArray(filters) ? filters : [filters]
      const normalizedFilters: FilterQuery = {
        $or: filterArray.map((filter) => {
          // TODO: add support for composite keys
          if (isString(filter)) {
            return { [primaryKeys[0]]: filter }
          }

          return filter
        }),
      }

      return normalizedFilters
    }
  }

  return MikroOrmAbstractBaseRepository_ as unknown as {
    new ({ manager }: { manager: any }): MikroOrmBaseRepository<T>
  }
}
