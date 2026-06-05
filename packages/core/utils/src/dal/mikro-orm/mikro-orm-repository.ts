import {
  Context,
  DAL,
  FilterQuery,
  FindOptions,
  InferEntityType,
  InferRepositoryReturnType,
  FilterQuery as InternalFilterQuery,
  PerformedActions,
  RepositoryService,
  RepositoryTransformOptions,
  UpsertWithReplaceConfig,
} from "@medusajs/types"
import {
  EntityClass,
  EntityManager,
  EntityName,
  EntityProperty,
  EntitySchema,
  LoadStrategy,
  FilterQuery as MikroFilterQuery,
  FindOptions as MikroOptions,
  ReferenceKind,
} from "@medusajs/deps/mikro-orm/core"
import { SqlEntityManager } from "@medusajs/deps/mikro-orm/postgresql"
import {
  arrayDifference,
  isString,
  MedusaError,
  promiseAll,
} from "../../common"
import { toMikroORMEntity } from "../../dml"
import { buildQuery } from "../../modules-sdk/build-query"
import { transactionWrapper } from "../utils"
import { dbErrorMapper } from "./db-error-mapper"
import { mikroOrmSerializer } from "./mikro-orm-serializer"
import { mikroOrmUpdateDeletedAtRecursively } from "./utils"

export class MikroOrmBase {
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
    return (transactionManager ?? manager ?? this.getFreshManager()) as TManager
  }

  async transaction<TManager = unknown>(
    task: (transactionManager: TManager) => Promise<any>,
    options: {
      manager?: TManager
      isolationLevel?: string
      enableNestedTransactions?: boolean
      transaction?: TManager
    } = {}
  ): Promise<any> {
    const manager = this.getFreshManager()

    return await transactionWrapper(manager, task, options).catch(dbErrorMapper)
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

export class MikroOrmBaseRepository<const T extends object = object>
  extends MikroOrmBase
  implements RepositoryService<T>
{
  entity: EntityClass<InferEntityType<T>>

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

  /**
   * When using the select-in strategy, the populated fields are not selected by default unlike when using the joined strategy.
   * This method will add the populated fields to the fields array if they are not already specifically selected.
   *
   * TODO: Revisit if this is still needed in v6 as it seems to be a workaround for a bug in v5
   *
   * @param {FindOptions<any>} findOptions
   */
  static compensateRelationFieldsSelectionFromLoadStrategy({
    findOptions,
  }: {
    findOptions: DAL.FindOptions
  }) {
    const loadStrategy = findOptions?.options?.strategy

    if (loadStrategy !== LoadStrategy.SELECT_IN) {
      return
    }

    findOptions.options ??= {}
    const populate = findOptions.options.populate ?? []
    const fields = findOptions.options.fields ?? []
    populate.forEach((populateRelation: string) => {
      if (
        fields.some((field: string) => field.startsWith(populateRelation + "."))
      ) {
        return
      }

      // If there is no specific fields selected for the relation but the relation is populated, we select all fields
      fields.push(populateRelation + ".*")
    })
  }

  create(
    data: unknown[],
    context?: Context
  ): Promise<InferRepositoryReturnType<T>[]> {
    throw new Error("Method not implemented.")
  }

  update(
    data: { entity; update }[],
    context?: Context
  ): Promise<InferRepositoryReturnType<T>[]> {
    throw new Error("Method not implemented.")
  }

  delete(
    idsOrPKs: FindOptions<T>["where"],
    context?: Context
  ): Promise<string[]> {
    throw new Error("Method not implemented.")
  }

  find(
    options?: DAL.FindOptions<T>,
    context?: Context
  ): Promise<InferRepositoryReturnType<T>[]> {
    throw new Error("Method not implemented.")
  }

  findAndCount(
    options?: DAL.FindOptions<T>,
    context?: Context
  ): Promise<[InferRepositoryReturnType<T>[], number]> {
    throw new Error("Method not implemented.")
  }

  upsert(
    data: unknown[],
    context: Context = {}
  ): Promise<InferRepositoryReturnType<T>[]> {
    throw new Error("Method not implemented.")
  }

  upsertWithReplace(
    data: unknown[],
    config: UpsertWithReplaceConfig<InferRepositoryReturnType<T>> = {
      relations: [],
    },
    context: Context = {}
  ): Promise<{
    entities: InferRepositoryReturnType<T>[]
    performedActions: PerformedActions
  }> {
    throw new Error("Method not implemented.")
  }

  async softDelete(
    filters:
      | string
      | string[]
      | DAL.FindOptions<T>["where"]
      | DAL.FindOptions<T>["where"][],
    sharedContext: Context = {}
  ): Promise<[InferRepositoryReturnType<T>[], Record<string, unknown[]>]> {
    const entities = await this.find({ where: filters as any }, sharedContext)
    const date = new Date()

    const manager = this.getActiveManager<SqlEntityManager>(sharedContext)
    const softDeletedEntitiesMap = await mikroOrmUpdateDeletedAtRecursively<T>(
      manager,
      entities as any[],
      date
    )

    return [entities, Object.fromEntries(softDeletedEntitiesMap)]
  }

  async restore(
    idsOrFilter: string[] | InternalFilterQuery,
    sharedContext: Context = {}
  ): Promise<[InferRepositoryReturnType<T>[], Record<string, unknown[]>]> {
    const query = buildQuery<T>(idsOrFilter, {
      withDeleted: true,
    })

    const entities = await this.find(query, sharedContext)

    const manager = this.getActiveManager<SqlEntityManager>(sharedContext)
    const softDeletedEntitiesMap = await mikroOrmUpdateDeletedAtRecursively(
      manager,
      entities as any[],
      null
    )

    return [entities, Object.fromEntries(softDeletedEntitiesMap)]
  }
}

export class MikroOrmBaseTreeRepository<
  const T extends object = object
> extends MikroOrmBase {
  constructor() {
    // @ts-ignore
    super(...arguments)
  }

  find(
    options?: DAL.FindOptions,
    transformOptions?: RepositoryTransformOptions,
    context?: Context
  ): Promise<InferRepositoryReturnType<T>[]> {
    throw new Error("Method not implemented.")
  }

  findAndCount(
    options?: DAL.FindOptions,
    transformOptions?: RepositoryTransformOptions,
    context?: Context
  ): Promise<[InferRepositoryReturnType<T>[], number]> {
    throw new Error("Method not implemented.")
  }

  create(
    data: unknown[],
    context?: Context
  ): Promise<InferRepositoryReturnType<T>[]> {
    throw new Error("Method not implemented.")
  }

  update(
    data: unknown[],
    context?: Context
  ): Promise<InferRepositoryReturnType<T>[]> {
    throw new Error("Method not implemented.")
  }

  delete(ids: string[], context?: Context): Promise<string[]> {
    throw new Error("Method not implemented.")
  }
}

export function mikroOrmBaseRepositoryFactory<const T extends object>(
  entity: T
): {
  new ({ manager }: { manager: any }): MikroOrmBaseRepository<T>
} {
  const mikroOrmEntity = toMikroORMEntity(entity) as EntityClass<
    InferEntityType<T>
  >

  class MikroOrmAbstractBaseRepository_ extends MikroOrmBaseRepository<T> {
    entity = mikroOrmEntity
    tableName = (
      (mikroOrmEntity as unknown as EntitySchema).meta ??
      (mikroOrmEntity as EntityClass<any>).prototype.__meta
    ).collection

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

    async create(
      data: any[],
      context?: Context
    ): Promise<InferRepositoryReturnType<T>[]> {
      const manager = this.getActiveManager<EntityManager>(context)

      const entities = data.map((data_) => {
        return manager.create(this.entity, data_)
      })

      manager.persist(entities)

      return entities as InferRepositoryReturnType<T>[]
    }

    /**
     * On a many to many relation, we expect to detach all the pivot items in case an empty array is provided.
     * In that case, this relation needs to be init as well as its counter part in order to be
     * able to perform the removal action.
     *
     * This action performs the initialization in the provided entity and therefore mutate in place.
     *
     * @param {{entity, update}[]} data
     * @param context
     * @private
     */
    private async initManyToManyToDetachAllItemsIfNeeded(
      data: { entity; update }[],
      context?: Context
    ) {
      const manager = this.getActiveManager<EntityManager>(context)

      const relations = manager
        .getDriver()
        .getMetadata()
        .get(this.entity.name).relations

      // In case an empty array is provided for a collection relation of type m:n, this relation needs to be init in order to be
      // able to perform an application cascade action.
      const collectionsToRemoveAllFrom: Map<
        string,
        { name: string; mappedBy?: string }
      > = new Map()
      data.forEach(({ update }) =>
        Object.keys(update).filter((key) => {
          const relation = relations.find((relation) => relation.name === key)
          const shouldInit =
            relation &&
            relation.kind === ReferenceKind.MANY_TO_MANY &&
            Array.isArray(update[key]) &&
            !update[key].length

          if (shouldInit) {
            collectionsToRemoveAllFrom.set(key, {
              name: key,
              mappedBy: relations.find((r) => r.name === key)?.mappedBy,
            })
          }
        })
      )

      for (const [
        collectionToRemoveAllFrom,
        descriptor,
      ] of collectionsToRemoveAllFrom) {
        await promiseAll(
          data.flatMap(async ({ entity }) => {
            if (!descriptor.mappedBy) {
              return await entity[collectionToRemoveAllFrom].init()
            }

            const promises: Promise<any>[] = []
            await entity[collectionToRemoveAllFrom].init()
            const items = entity[collectionToRemoveAllFrom]

            for (const item of items) {
              promises.push(item[descriptor.mappedBy!].init())
            }

            return promises
          })
        )
      }
    }

    async update(
      data: { entity: any; update: any }[],
      context?: Context
    ): Promise<InferRepositoryReturnType<T>[]> {
      const manager = this.getActiveManager<EntityManager>(context)

      await this.initManyToManyToDetachAllItemsIfNeeded(data, context)

      data.forEach(({ entity, update }) => {
        manager.assign(entity, update, {
          mergeObjectProperties: true,
        })
        manager.persist(entity)
      })

      return data.map((d) => d.entity) as InferRepositoryReturnType<T>[]
    }

    async delete(
      filters: FindOptions<T>["where"],
      context?: Context
    ): Promise<string[]> {
      const manager = this.getActiveManager<SqlEntityManager>(context)

      const whereSqlInfo = manager
        .createQueryBuilder(this.entity.name, this.tableName)
        .where(filters)
        .getKnexQuery()
        .toSQL()

      const builder = (manager.getTransactionContext() ?? manager.getKnex())
        .queryBuilder()
        .from(this.tableName)
        .delete()

      const hasWhere = whereSqlInfo.sql.includes("where ")
      if (hasWhere) {
        const where = [
          whereSqlInfo.sql.split("where ")[1],
          whereSqlInfo.bindings,
        ] as [string, any[]]
        builder.where(manager.getKnex().raw(...where))
      }

      return await builder.returning("id").then((rows: { id: string }[]) => {
        return rows.map((row: { id: string }) => row.id)
      })
    }

    async find(
      options: DAL.FindOptions<T> = { where: {} } as DAL.FindOptions<T>,
      context?: Context
    ): Promise<InferRepositoryReturnType<T>[]> {
      const manager = this.getActiveManager<EntityManager>(context)

      const findOptions_ = { ...options }
      findOptions_.options ??= {}

      if (!("strategy" in findOptions_.options)) {
        if (findOptions_.options.limit != null || findOptions_.options.offset) {
          // TODO: from 7+ it will be the default strategy
          Object.assign(findOptions_.options, {
            strategy: LoadStrategy.SELECT_IN,
          })
        }
      }

      MikroOrmBaseRepository.compensateRelationFieldsSelectionFromLoadStrategy({
        findOptions: findOptions_,
      })

      return (await manager.find(
        this.entity as EntityName<T>,
        findOptions_.where as MikroFilterQuery<T>,
        findOptions_.options as MikroOptions<T>
      )) as InferRepositoryReturnType<T>[]
    }

    async findAndCount(
      findOptions: DAL.FindOptions<T> = { where: {} } as DAL.FindOptions<T>,
      context: Context = {}
    ): Promise<[InferRepositoryReturnType<T>[], number]> {
      const manager = this.getActiveManager<EntityManager>(context)

      const findOptions_ = { ...findOptions }
      findOptions_.options ??= {}

      if (!("strategy" in findOptions_.options)) {
        if (findOptions_.options.limit != null || findOptions_.options.offset) {
          // TODO: from 7+ it will be the default strategy
          Object.assign(findOptions_.options, {
            strategy: LoadStrategy.SELECT_IN,
          })
        }
      }

      MikroOrmBaseRepository.compensateRelationFieldsSelectionFromLoadStrategy({
        findOptions: findOptions_,
      })

      return (await manager.findAndCount(
        this.entity,
        findOptions_.where,
        findOptions_.options as any // MikroOptions<T>
      )) as [InferRepositoryReturnType<T>[], number]
    }

    async upsert(
      data: any[],
      context: Context = {}
    ): Promise<InferRepositoryReturnType<T>[]> {
      const manager = this.getActiveManager<EntityManager>(context)

      const primaryKeys = MikroOrmAbstractBaseRepository_.retrievePrimaryKeys(
        this.entity
      )

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

      let allEntities: InferRepositoryReturnType<T>[][] = []

      if (primaryKeysCriteria.length) {
        allEntities = await promiseAll(
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

      const existingEntitiesMap = new Map<
        string,
        InferRepositoryReturnType<T>
      >()
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

      const upsertedEntities: InferRepositoryReturnType<T>[] = []
      const createdEntities: InferRepositoryReturnType<T>[] = []
      const updatedEntities: InferRepositoryReturnType<T>[] = []

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
          updatedEntities.push(updatedType as any)
        } else {
          const newEntity = manager.create(this.entity, data_)
          createdEntities.push(newEntity as InferRepositoryReturnType<T>)
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
      return upsertedEntities as InferRepositoryReturnType<T>[]
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
      config: UpsertWithReplaceConfig<InferRepositoryReturnType<T>> = {
        relations: [],
      },
      context: Context = {}
    ): Promise<{
      entities: InferRepositoryReturnType<T>[]
      performedActions: PerformedActions
    }> {
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
        .get(this.entity.name).relations

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

        const mainEntity = this.getEntityWithId(
          manager,
          this.entity.name,
          entryCopy
        )
        reconstructedResponse.push({ ...mainEntity, ...reconstructedEntry })
        originalDataMap.set(mainEntity.id, entry)

        return mainEntity
      })

      let {
        orderedEntities: upsertedTopLevelEntities,
        performedActions: performedActions_,
      } = await this.upsertMany_(manager, this.entity.name, toUpsert)

      this.mergePerformedActions(performedActions, performedActions_)

      const relationProcessingPromises: Promise<void>[] = []

      // Group relations by type
      const relationsByType = new Map<
        string,
        { relation: EntityProperty; entities: any[] }
      >()

      config.relations?.forEach((relationName) => {
        const relation = allRelations?.find((r) => r.name === relationName)
        if (!relation) return

        if (
          relation.kind === ReferenceKind.ONE_TO_ONE ||
          relation.kind === ReferenceKind.MANY_TO_ONE
        ) {
          return
        }

        const entitiesForRelation = upsertedTopLevelEntities
          .map((entityEntry, i) => {
            const originalEntry = originalDataMap.get((entityEntry as any).id)!
            return {
              entity: { ...originalEntry, id: (entityEntry as any).id },
              reconstructedEntry: reconstructedResponse[i],
              index: i,
            }
          })
          .filter((item) => item.entity[relationName as string] !== undefined)

        if (entitiesForRelation.length > 0) {
          relationsByType.set(relationName as string, {
            relation,
            entities: entitiesForRelation,
          })
        }
      })

      for (const [relationName, { relation, entities }] of relationsByType) {
        relationProcessingPromises.push(
          this.assignCollectionRelationBatch_(manager, entities, relation).then(
            ({ performedActions: batchPerformedActions, entitiesResults }) => {
              this.mergePerformedActions(
                performedActions,
                batchPerformedActions
              )

              // Update reconstructed response with results
              entitiesResults.forEach(
                ({ entities: relationEntities, index }) => {
                  reconstructedResponse[index][relationName] = relationEntities
                }
              )
            }
          )
        )
      }

      await promiseAll(relationProcessingPromises)

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

    /**
     * Batch processing for multiple entities with same relation
     */
    protected async assignCollectionRelationBatch_(
      manager: SqlEntityManager,
      entitiesData: Array<{ entity: T; index: number }>,
      relation: EntityProperty
    ): Promise<{
      performedActions: PerformedActions
      entitiesResults: Array<{ entities: any[]; index: number }>
    }> {
      const performedActions: PerformedActions = {
        created: {},
        updated: {},
        deleted: {},
      }

      const entitiesResults: Array<{ entities: any[]; index: number }> = []

      if (relation.kind === ReferenceKind.MANY_TO_MANY) {
        await this.assignManyToManyRelationBatch_(
          manager,
          entitiesData,
          relation,
          performedActions,
          entitiesResults
        )
      } else if (relation.kind === ReferenceKind.ONE_TO_MANY) {
        await this.assignOneToManyRelationBatch_(
          manager,
          entitiesData,
          relation,
          performedActions,
          entitiesResults
        )
      } else {
        // For other relation types, fall back to individual processing
        await promiseAll(
          entitiesData.map(async ({ entity, index }) => {
            const { entities, performedActions: individualActions } =
              await this.assignCollectionRelation_(manager, entity, relation)
            this.mergePerformedActions(performedActions, individualActions)
            entitiesResults.push({ entities, index })
          })
        )
      }

      return { performedActions, entitiesResults }
    }

    /**
     * Batch processing for many-to-many relations
     */
    private async assignManyToManyRelationBatch_(
      manager: SqlEntityManager,
      entitiesData: Array<{ entity: T; index: number }>,
      relation: EntityProperty,
      performedActions: PerformedActions,
      entitiesResults: Array<{ entities: any[]; index: number }>
    ): Promise<void> {
      const currentPivotColumn = relation.inverseJoinColumns[0]
      const parentPivotColumn = relation.joinColumns[0]

      // Collect all relation data and normalize it
      const allNormalizedData: any[] = []
      const entityRelationMap = new Map<string, any[]>()
      const entitiesToDeletePivots: string[] = []

      for (const { entity, index } of entitiesData) {
        const dataForRelation = entity[relation.name]

        if (dataForRelation === undefined) {
          entitiesResults.push({ entities: [], index })
          continue
        }

        if (!dataForRelation.length) {
          entitiesToDeletePivots.push((entity as any).id)
          entitiesResults.push({ entities: [], index })
          continue
        }

        const normalizedData = dataForRelation.map((item: any) =>
          this.getEntityWithId(manager, relation.type, item)
        )

        allNormalizedData.push(...normalizedData)
        entityRelationMap.set((entity as any).id, normalizedData)
        entitiesResults.push({ entities: normalizedData, index })
      }

      // Batch delete empty pivot relations
      if (entitiesToDeletePivots.length) {
        await manager.nativeDelete(relation.pivotEntity, {
          [parentPivotColumn]: { $in: entitiesToDeletePivots },
        })
      }

      if (allNormalizedData.length) {
        const { performedActions: upsertActions } = await this.upsertMany_(
          manager,
          relation.type,
          allNormalizedData,
          true
        )
        this.mergePerformedActions(performedActions, upsertActions)

        // Collect all pivot data for batch operations
        const allPivotData: any[] = []
        const allParentIds: string[] = []

        for (const [parentId, normalizedData] of entityRelationMap) {
          allParentIds.push(parentId)
          const pivotData = normalizedData.map((currModel) => ({
            [parentPivotColumn]: parentId,
            [currentPivotColumn]: currModel.id,
          }))
          allPivotData.push(...pivotData)
        }

        // Batch insert and delete pivot table entries
        await promiseAll([
          manager
            .qb(relation.pivotEntity)
            .insert(allPivotData)
            .onConflict()
            .ignore()
            .execute(),
          manager.nativeDelete(relation.pivotEntity, {
            [parentPivotColumn]: { $in: allParentIds },
            [currentPivotColumn]: {
              $nin: allPivotData.map((d) => d[currentPivotColumn]),
            },
          }),
        ])
      }
    }

    /**
     * Batch processing for one-to-many relations
     */
    private async assignOneToManyRelationBatch_(
      manager: SqlEntityManager,
      entitiesData: Array<{ entity: T; index: number }>,
      relation: EntityProperty,
      performedActions: PerformedActions,
      entitiesResults: Array<{ entities: any[]; index: number }>
    ): Promise<void> {
      const joinColumns =
        relation.targetMeta?.properties[relation.mappedBy]?.joinColumns

      // Collect all relation data and constraints
      const allNormalizedData: any[] = []
      const allJoinConstraints: any[] = []
      const allEntityIds: string[] = []

      for (const { entity, index } of entitiesData) {
        const dataForRelation = entity[relation.name]

        if (dataForRelation === undefined) {
          entitiesResults.push({ entities: [], index })
          continue
        }

        const joinColumnsConstraints = {}
        joinColumns?.forEach((joinColumn, index) => {
          const referencedColumnName = relation.referencedColumnNames[index]
          joinColumnsConstraints[joinColumn] = entity[referencedColumnName]
        })

        const normalizedData = dataForRelation.map((item: any) => {
          const normalized = this.getEntityWithId(manager, relation.type, item)
          return { ...normalized, ...joinColumnsConstraints }
        })

        allNormalizedData.push(...normalizedData)
        allJoinConstraints.push(joinColumnsConstraints)
        allEntityIds.push(...normalizedData.map((d: any) => d.id))
        entitiesResults.push({ entities: normalizedData, index })
      }

      // Batch delete orphaned relations
      if (allJoinConstraints.length) {
        const deletedRelations = await (
          manager.getTransactionContext() ?? manager.getKnex()
        )
          .queryBuilder()
          .from(relation.targetMeta!.collection)
          .delete()
          .where((builder) => {
            allJoinConstraints.forEach((constraints, index) => {
              if (index === 0) {
                builder.where(constraints)
              } else {
                builder.orWhere(constraints)
              }
            })
          })
          .whereNotIn("id", allEntityIds)
          .returning("id")

        if (deletedRelations.length) {
          performedActions.deleted[relation.type] ??= []
          performedActions.deleted[relation.type].push(
            ...deletedRelations.map((row) => ({ id: row.id }))
          )
        }
      }

      // Batch upsert all relation entities
      if (allNormalizedData.length) {
        const { performedActions: upsertActions } = await this.upsertMany_(
          manager,
          relation.type,
          allNormalizedData
        )
        this.mergePerformedActions(performedActions, upsertActions)
      }
    }

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

      if (relation.kind === ReferenceKind.MANY_TO_MANY) {
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

        await promiseAll([
          manager
            .qb(relation.pivotEntity)
            .insert(pivotData)
            .onConflict()
            .ignore()
            .execute(),
          manager.nativeDelete(relation.pivotEntity, {
            [parentPivotColumn]: (data as any).id,
            [currentPivotColumn]: {
              $nin: pivotData.map((d) => d[currentPivotColumn]),
            },
          }),
        ])

        return { entities: normalizedData, performedActions }
      }

      if (relation.kind === ReferenceKind.ONE_TO_MANY) {
        const joinColumns =
          relation.targetMeta?.properties[relation.mappedBy]?.joinColumns

        const joinColumnsConstraints = {}
        joinColumns?.forEach((joinColumn, index) => {
          const referencedColumnName = relation.referencedColumnNames[index]
          joinColumnsConstraints[joinColumn] = data[referencedColumnName]
        })

        const deletedRelations = await (
          manager.getTransactionContext() ?? manager.getKnex()
        )
          .queryBuilder()
          .from(relation.targetMeta!.collection)
          .delete()
          .where(joinColumnsConstraints)
          .whereNotIn(
            "id",
            normalizedData.map((d: any) => d.id)
          )
          .returning("id")

        if (deletedRelations.length) {
          performedActions.deleted[relation.type] ??= []
          performedActions.deleted[relation.type].push(
            ...deletedRelations.map((row) => ({ id: row.id }))
          )
        }

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
      if (relation.kind === ReferenceKind.MANY_TO_ONE) {
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
      // We set the id to undefined to make sure the entity isn't fetched from the entity map if it is an update,
      // giving us incorrect data for the bignumberdata field (I though managed: false and persist: false would already do this)
      const created = manager.create(
        entityName,
        { ...data, id: undefined },
        {
          managed: false,
          persist: false,
        }
      )

      const resp = {
        // `create` will omit non-existent fields, but we want to pass the data the user provided through so the correct errors get thrown
        ...data,
        ...(created as any).__helper.__bignumberdata,
        id: data.id ?? (created as any).id,
      }

      // Non-persist relation columns should be removed before we do the upsert.
      Object.entries((created as any).__helper?.__meta.properties ?? {})
        .filter(
          ([_, propDef]: any) =>
            propDef.persist === false &&
            propDef.kind === ReferenceKind.MANY_TO_ONE
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
      if (!entries.length) {
        return {
          orderedEntities: [],
          performedActions: { created: {}, updated: {}, deleted: {} },
        }
      }

      const uniqueEntriesMap = new Map<string, any>()
      const orderedUniqueEntries: any[] = []

      entries.forEach((entry) => {
        if (!uniqueEntriesMap.has(entry.id)) {
          uniqueEntriesMap.set(entry.id, entry)
          orderedUniqueEntries.push(entry)
        }
      })

      const existingEntitiesMap = new Map()

      if (orderedUniqueEntries.some((e) => e.id)) {
        const existingEntities: any[] = await manager
          .qb(entityName)
          .select("id")
          .where({
            id: { $in: orderedUniqueEntries.map((d) => d.id).filter(Boolean) },
          })

        existingEntities.forEach((e) => {
          existingEntitiesMap.set(e.id, e)
        })
      }

      const orderedEntities: T[] = []
      const performedActions = {
        created: {},
        updated: {},
        deleted: {},
      }

      const toInsert: any[] = []
      const toUpdate: any[] = []
      const insertOrderMap = new Map<string, number>()
      const updateOrderMap = new Map<string, number>()

      // Single pass to categorize operations while preserving order
      orderedUniqueEntries.forEach((data, index) => {
        const existingEntity = existingEntitiesMap.get(data.id)
        orderedEntities.push(data)

        if (existingEntity) {
          if (!skipUpdate) {
            toUpdate.push(data)
            updateOrderMap.set(data.id, index)
          }
        } else {
          toInsert.push(data)
          insertOrderMap.set(data.id, index)
        }
      })

      const promises: Promise<any>[] = []

      if (toInsert.length > 0) {
        let insertQb = manager.qb(entityName).insert(toInsert).returning("id")

        if (skipUpdate) {
          insertQb = insertQb.onConflict().ignore()
        }

        promises.push(
          insertQb.execute("all", true).then((res: { id: string }[]) => {
            performedActions.created[entityName] ??= []

            // Sort created entities by their original insertion order
            const sortedCreated = res
              .map((data) => ({
                ...data,
                order: insertOrderMap.get(data.id) ?? Number.MAX_SAFE_INTEGER,
              }))
              .sort((a, b) => a.order - b.order)
              .map(({ order, ...data }) => data)

            performedActions.created[entityName].push(...sortedCreated)
          })
        )
      }

      if (toUpdate.length > 0) {
        // Use batch update but maintain order
        const batchSize = 100 // Process in chunks to avoid query size limits
        const updatePromises: Promise<any>[] = []
        const allUpdatedEntities: Array<{ id: string; order: number }> = []

        for (let i = 0; i < toUpdate.length; i += batchSize) {
          const chunk = toUpdate.slice(i, i + batchSize)

          updatePromises.push(
            manager
              .getDriver()
              .nativeUpdateMany(
                entityName,
                chunk.map((d) => ({ id: d.id })),
                chunk,
                { ctx: manager.getTransactionContext() }
              )
              .then((res) => {
                const updatedRows = res.rows ?? []

                // Add order information for sorting later
                const orderedUpdated = updatedRows.map((d: any) => ({
                  id: d.id,
                  order: updateOrderMap.get(d.id) ?? Number.MAX_SAFE_INTEGER,
                }))

                allUpdatedEntities.push(...orderedUpdated)
              })
          )
        }

        promises.push(
          promiseAll(updatePromises).then(() => {
            // Sort all updated entities by their original order and add to performedActions
            performedActions.updated[entityName] ??= []
            const sortedUpdated = allUpdatedEntities
              .sort((a, b) => a.order - b.order)
              .map(({ order, ...data }) => data)

            performedActions.updated[entityName].push(...sortedUpdated)
          })
        )
      }

      await promiseAll(promises)

      return { orderedEntities, performedActions }
    }

    async restore(
      filters:
        | string
        | string[]
        | DAL.FindOptions<T>["where"]
        | DAL.FindOptions<T>["where"][],
      sharedContext: Context = {}
    ): Promise<[InferRepositoryReturnType<T>[], Record<string, unknown[]>]> {
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
        | DAL.FindOptions<T>["where"]
        | DAL.FindOptions<T>["where"][],
      sharedContext: Context = {}
    ): Promise<[InferRepositoryReturnType<T>[], Record<string, unknown[]>]> {
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
        | DAL.FindOptions<T>["where"]
        | DAL.FindOptions<T>["where"][]
    ): DAL.FindOptions<T>["where"] {
      const primaryKeys = MikroOrmAbstractBaseRepository_.retrievePrimaryKeys(
        this.entity
      )

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

      return normalizedFilters as DAL.FindOptions<T>["where"]
    }
  }

  return MikroOrmAbstractBaseRepository_ as unknown as {
    new ({ manager }: { manager: any }): MikroOrmBaseRepository<T>
  }
}
