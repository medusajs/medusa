import {
  BaseFilterable,
  Context,
  DAL,
  FilterQuery,
  FilterQuery as InternalFilterQuery,
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
  wrap,
} from "@mikro-orm/core"
import { FindOptions as MikroOptions } from "@mikro-orm/core/drivers/IDatabaseDriver"
import {
  EntityClass,
  EntityName,
  EntityProperty,
  FilterQuery as MikroFilterQuery,
} from "@mikro-orm/core/typings"
import { SqlEntityManager } from "@mikro-orm/postgresql"
import { arrayDifference, deepCopy, isString, promiseAll } from "../../common"
import { buildQuery } from "../../modules-sdk"
import {
  getSoftDeletedCascadedEntitiesIdsMappedBy,
  transactionWrapper,
} from "../utils"
import { mikroOrmUpdateDeletedAtRecursively } from "./utils"
import { mikroOrmSerializer } from "./mikro-orm-serializer"

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
    // @ts-ignore
    return await transactionWrapper.bind(this)(task, options)
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
    upsertConfig: UpsertWithReplaceConfig<T> = {
      relationsToUpsert: [],
      relationsToSkip: [],
    },
    context: Context = {}
  ): Promise<T[]> {
    throw new Error("Method not implemented.")
  }

  async softDelete(
    idsOrFilter: string[] | InternalFilterQuery,
    sharedContext: Context = {}
  ): Promise<[T[], Record<string, unknown[]>]> {
    const isArray = Array.isArray(idsOrFilter)
    // TODO handle composite keys
    const filter =
      isArray || isString(idsOrFilter)
        ? {
            id: {
              $in: isArray ? idsOrFilter : [idsOrFilter],
            },
          }
        : idsOrFilter

    const entities = await this.find({ where: filter as any }, sharedContext)
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
    // TODO handle composite keys
    const isArray = Array.isArray(idsOrFilter)
    const filter =
      isArray || isString(idsOrFilter)
        ? {
            id: {
              $in: isArray ? idsOrFilter : [idsOrFilter],
            },
          }
        : idsOrFilter

    const query = buildQuery(filter, {
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
    }

    static buildUniqueCompositeKeyValue(keys: string[], data: object) {
      return keys.map((k) => data[k]).join("_")
    }

    static retrievePrimaryKeys(entity: EntityClass<T> | EntitySchema<T>) {
      return (
        (entity as EntitySchema<T>).meta?.primaryKeys ??
        (entity as EntityClass<T>).prototype.__meta.primaryKeys ?? ["id"]
      )
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
    // For each entry of your base entity, it will go through all relations, and it will do a diff between what is passed and what is in the database.
    // For each relation, it create new entries (without an ID), it will associate existing entries (with only an ID), and it will update existing entries (with an ID and other fields).
    // Finally, it will delete the relation entries that were omitted in the new data.
    // Limitations: We expect that IDs are used as primary keys, and we don't support composite keys. Also, we only support 1-level depth of upserts
    async upsertWithReplace(
      data: any[],
      upsertConfig: UpsertWithReplaceConfig<T> = {
        relationsToUpsert: [],
        relationsToSkip: [],
      },
      context: Context = {}
    ): Promise<T[]> {
      if (!data.length) {
        return []
      }

      const manager = this.getActiveManager<SqlEntityManager>(context)
      const allRelationsToHandle = [
        ...(upsertConfig.relationsToUpsert ?? []),
        ...(upsertConfig.relationsToSkip ?? []),
      ] as string[]

      // Handle the relations
      const allRelations = manager
        .getDriver()
        .getMetadata()
        .get(entity.name).relations

      const nonexistentRelations = arrayDifference(
        allRelationsToHandle,
        allRelations.map((r) => r.name)
      )

      if (nonexistentRelations.length) {
        throw new Error(
          `Nonexistent relations were passed during upsert: ${nonexistentRelations}`
        )
      }
      const entryUpsertedMap = new Map<string, T>()
      const upsertsPerType: Record<string, any[]> = {}

      // Create only the top-level entity without the relations first
      const toUpsert = data.map((entry) => {
        // Make a copy of the data. We also convert an ORM model to a POJO in case that's what we got passed
        const entryCopy = JSON.parse(JSON.stringify(entry))

        allRelations?.forEach((relation) => {
          this.handleRelationAssignment_(
            manager,
            upsertConfig,
            allRelationsToHandle,
            relation,
            entryCopy,
            upsertsPerType
          )
        })

        const mainEntity = this.getEntityWithId(manager, entity.name, entryCopy)

        entryUpsertedMap.set(mainEntity.id, entry)
        return mainEntity
      })

      // The order of insert is: many-to-one, main entity, one-to-many, many-to-many
      await this.upsertManyToOneRelations_(manager, upsertsPerType)
      const upsertedTopLevelEntities = await this.upsertMany_(
        manager,
        entity.name,
        toUpsert
      )

      await promiseAll(
        upsertedTopLevelEntities.map(async (entityEntry) => {
          const originalEntry = entryUpsertedMap.get((entityEntry as any).id)!

          await promiseAll(
            allRelations?.map(async (relation) => {
              const relationName = relation.name as keyof T
              if (!upsertConfig.relationsToUpsert?.includes(relationName)) {
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

              await this.assignCollectionRelation_(
                manager,
                { ...originalEntry, id: (entityEntry as any).id },
                relation
              )
              return
            })
          )

          return originalEntry
        })
      )

      return upsertedTopLevelEntities
    }

    // TODO: We can make this performant by only aggregating the operations, but only executing them at the end.
    protected async assignCollectionRelation_(
      manager: SqlEntityManager,
      data: T,
      relation: EntityProperty
    ) {
      const dataForRelation = data[relation.name]
      // If the field is not set, we ignore it. Null and empty arrays are a valid input and are handled below
      if (dataForRelation === undefined) {
        return undefined
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

          return normalizedData
        }

        await this.upsertMany_(manager, relation.type, normalizedData)

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

        return normalizedData
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

          await this.upsertMany_(manager, relation.type, normalizedData)
        }

        await manager.nativeDelete(relation.type, {
          ...joinColumnsConstraints,
          id: { $nin: normalizedData.map((d: any) => d.id) },
        })

        return normalizedData
      }

      return normalizedData
    }

    protected handleRelationAssignment_(
      manager: SqlEntityManager,
      upsertConfig: UpsertWithReplaceConfig<T>,
      allRelationsToHandle: string[],
      relation: EntityProperty<any>,
      entryCopy: T,
      upsertsPerType: Record<string, any[]>
    ) {
      if (
        upsertConfig.relationsToUpsert?.includes(relation.name as keyof T) &&
        relation.reference === ReferenceType.MANY_TO_ONE
      ) {
        // If it is undefined (not passed) then just return
        if (entryCopy[relation.name] === undefined) {
          return
        }

        // If null is passed (to be unset) then we need to set that on the join column
        if (entryCopy[relation.name] === null) {
          delete entryCopy[relation.name]
          entryCopy[relation.joinColumns[0]] = null
          return
        }

        const newEntity = this.getEntityWithId(
          manager,
          relation.type,
          entryCopy[relation.name]
        )

        delete entryCopy[relation.name]
        entryCopy[relation.joinColumns[0]] = newEntity.id

        if (!upsertsPerType[relation.type]) {
          upsertsPerType[relation.type] = []
        }
        upsertsPerType[relation.type].push(newEntity)

        return
      }

      if (allRelationsToHandle.includes(relation.name)) {
        delete entryCopy[relation.name]
      }
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

      return { id: (created as any).id, ...data }
    }

    protected async upsertManyToOneRelations_(
      manager: SqlEntityManager,
      upsertsPerType: Record<string, any[]>
    ) {
      const typesToUpsert = Object.entries(upsertsPerType)
      if (!typesToUpsert.length) {
        return []
      }

      return (
        await promiseAll(
          typesToUpsert.map(async ([type, data]) => {
            return await this.upsertMany_(manager, type, data)
          })
        )
      ).flat()
    }

    protected async upsertMany_(
      manager: SqlEntityManager,
      entityName: string,
      entries: any[]
    ) {
      const existingEntities: any[] = await manager.find(
        entityName,
        {
          id: { $in: entries.map((d) => d.id) },
        },
        {
          populate: [],
          disableIdentityMap: true,
        }
      )
      const existingEntitiesMap = new Map(
        existingEntities.map((e) => [e.id, e])
      )

      const createdEntities: T[] = []
      const updatedEntities: T[] = []

      await promiseAll(
        entries.map(async (data) => {
          const existingEntity = existingEntitiesMap.get(data.id)
          if (existingEntity) {
            await manager.nativeUpdate(entityName, { id: data.id }, data)
            updatedEntities.push(data)
          } else {
            await manager.insert(entityName, data)
            createdEntities.push(data)
          }
        })
      )

      return [...createdEntities, ...updatedEntities]
    }
  }

  return MikroOrmAbstractBaseRepository_ as unknown as {
    new ({ manager }: { manager: any }): MikroOrmBaseRepository<T>
  }
}
