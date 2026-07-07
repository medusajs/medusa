import {
  Context,
  Event,
  ILockingModule,
  IndexTypes,
  QueryGraphFunction,
  RemoteQueryFunction,
  Subscriber,
} from "@medusajs/framework/types"
import {
  MikroOrmBaseRepository as BaseRepository,
  CommonEvents,
  ContainerRegistrationKeys,
  deepMerge,
  InjectManager,
  InjectTransactionManager,
  isDefined,
  MedusaContext,
  Modules,
  toMikroORMEntity,
  unflattenObjectKeys,
} from "@medusajs/framework/utils"
import {
  EntityManager,
  EntityRepository,
  SqlEntityManager,
} from "@medusajs/framework/mikro-orm/postgresql"
import { IndexData, IndexRelation } from "@models"
import { createPartitions, QueryBuilder } from "../utils"
import { flattenObjectKeys } from "../utils/flatten-object-keys"
import { normalizeFieldsSelection } from "../utils/normalize-fields-selection"

type InjectedDependencies = {
  manager: EntityManager
  [ContainerRegistrationKeys.QUERY]: RemoteQueryFunction
  baseRepository: BaseRepository
  [Modules.LOCKING]?: ILockingModule
}

const CREATE_PARTITIONS_LOCK_KEY = "index-module:create-partitions"
const CREATE_PARTITIONS_LOCK_TIMEOUT = 300

export class PostgresProvider implements IndexTypes.StorageProvider {
  #isReady_: Promise<void>

  protected readonly eventActionToMethodMap_ = {
    created: "onCreate",
    updated: "onUpdate",
    deleted: "onDelete",
    restored: "onCreate",
    attached: "onAttach",
    detached: "onDetach",
  }

  protected container_: InjectedDependencies
  protected readonly schemaObjectRepresentation_: IndexTypes.SchemaObjectRepresentation
  protected readonly schemaEntitiesMap_: Record<string, any>
  protected readonly moduleOptions_: IndexTypes.IndexModuleOptions
  protected readonly manager_: SqlEntityManager
  protected readonly query_: RemoteQueryFunction
  protected baseRepository_: BaseRepository

  constructor(
    container: InjectedDependencies,
    options: {
      schemaObjectRepresentation: IndexTypes.SchemaObjectRepresentation
      entityMap: Record<string, any>
    },
    moduleOptions: IndexTypes.IndexModuleOptions
  ) {
    this.container_ = container
    this.manager_ = container.manager
    this.query_ = container.query
    this.moduleOptions_ = moduleOptions
    this.baseRepository_ = container.baseRepository

    this.schemaObjectRepresentation_ = options.schemaObjectRepresentation
    this.schemaEntitiesMap_ = options.entityMap
  }

  async onApplicationStart() {
    let initalizedOk: (value: any) => void = () => {}
    let initalizedNok: (value: any) => void = () => {}
    this.#isReady_ = new Promise((resolve, reject) => {
      initalizedOk = resolve
      initalizedNok = reject
    })

    const locking = this.container_[Modules.LOCKING]

    const run = () =>
      createPartitions(this.schemaObjectRepresentation_, this.manager_.fork())

    // Serialize partition DDL across instances
    const work = locking
      ? locking.execute(CREATE_PARTITIONS_LOCK_KEY, run, {
          timeout: CREATE_PARTITIONS_LOCK_TIMEOUT,
        })
      : run()

    await work.then(initalizedOk).catch(initalizedNok)
  }

  protected static parseData<
    TData extends { id: string; [key: string]: unknown }
  >(
    data: TData | TData[],
    schemaEntityObjectRepresentation: IndexTypes.SchemaObjectEntityRepresentation
  ) {
    const data_ = Array.isArray(data) ? data : [data]

    // Always keep the id in the entity properties
    const entityProperties: string[] = ["id"]
    const parentsProperties: { [entity: string]: string[] } = {}

    /**
     * Split fields into entity properties and parents properties
     */

    schemaEntityObjectRepresentation.fields.forEach((field) => {
      if (field.includes(".")) {
        const parentAlias = field.split(".")[0]
        const parentSchemaObjectRepresentation =
          schemaEntityObjectRepresentation.parents.find(
            (parent) => parent.inverseSideProp === parentAlias
          )

        if (!parentSchemaObjectRepresentation) {
          throw new Error(
            `IndexModule error, unable to parse data for ${schemaEntityObjectRepresentation.entity}. The parent schema object representation could not be found for the alias ${parentAlias} for the entity ${schemaEntityObjectRepresentation.entity}.`
          )
        }

        parentsProperties[parentSchemaObjectRepresentation.ref.entity] ??= []
        parentsProperties[parentSchemaObjectRepresentation.ref.entity].push(
          field
        )
      } else {
        entityProperties.push(field)
      }
    })

    return {
      data: data_,
      entityProperties,
      parentsProperties,
    }
  }

  protected static parseMessageData<TData extends { id: string | string[] }>(
    message?: Event
  ): {
    action: string
    data: TData[]
    ids: string[]
  } | void {
    const isExpectedFormat =
      isDefined(message?.data) && isDefined(message?.metadata?.action)

    if (!isExpectedFormat) {
      return
    }

    const result: {
      action: string
      data: TData[]
      ids: string[]
    } = {
      action: "",
      data: [],
      ids: [],
    }

    result.action = message!.metadata!.action as string
    result.data = message!.data as TData[]
    result.data = Array.isArray(result.data) ? result.data : [result.data]
    result.ids = result.data.flatMap((d) =>
      Array.isArray(d.id) ? d.id : [d.id]
    )

    return result
  }

  consumeEvent(
    schemaEntityObjectRepresentation: IndexTypes.SchemaObjectEntityRepresentation
  ): Subscriber<{ id: string | string[] }> {
    return async (event: Event) => {
      await this.#isReady_

      const data_: { id: string }[] = Array.isArray(event.data)
        ? event.data
        : [event.data]
      let ids: string[] = data_.flatMap((d) =>
        Array.isArray(d.id) ? d.id : [d.id]
      )
      let action = event.name.split(".").pop() || ""

      const parsedMessage = PostgresProvider.parseMessageData(event)
      if (parsedMessage) {
        action = parsedMessage.action
        ids = parsedMessage.ids
      }

      const targetMethod = this.eventActionToMethodMap_[action]

      if (!targetMethod) {
        return
      }

      const { fields, alias } = schemaEntityObjectRepresentation

      let withDeleted: boolean | undefined
      if (action === CommonEvents.DELETED || action === CommonEvents.DETACHED) {
        withDeleted = true
      }

      // Process ids in batches of 100
      const batchSize = 100
      const idsBatches: string[][] = []

      for (let i = 0; i < ids.length; i += batchSize) {
        idsBatches.push(ids.slice(i, i + batchSize))
      }

      for (const idsBatch of idsBatches) {
        const graphConfig: Parameters<QueryGraphFunction>[0] = {
          entity: alias,
          filters: {
            id: idsBatch,
          },
          fields: [...new Set(["id", ...fields])],
          withDeleted,
        }

        const { data: entityData } = await this.query_.graph(graphConfig)

        const argument = {
          entity: schemaEntityObjectRepresentation.entity,
          data: entityData,
          schemaEntityObjectRepresentation,
        }

        await this[targetMethod](argument)
      }
    }
  }

  @InjectManager()
  async query<const TEntry extends string>(
    config: IndexTypes.IndexQueryConfig<TEntry>,
    @MedusaContext() sharedContext: Context = {}
  ): Promise<IndexTypes.QueryResultSet<TEntry>> {
    await this.#isReady_

    const { fields = [], filters = {}, joinFilters = {}, idsOnly } = config
    const { take, skip, order: inputOrderBy = {} } = config.pagination ?? {}

    const select = normalizeFieldsSelection(fields)
    const where = flattenObjectKeys(unflattenObjectKeys(filters))

    const inputOrderByObj = unflattenObjectKeys(inputOrderBy)
    const joinWhere = flattenObjectKeys(unflattenObjectKeys(joinFilters))
    const orderBy = flattenObjectKeys(inputOrderByObj)

    const { manager } = sharedContext as { manager: SqlEntityManager }
    let hasPagination = false
    let hasCount = false
    if (isDefined(skip) || isDefined(take)) {
      hasPagination = true

      if (isDefined(skip)) {
        hasCount = true
      }
    }

    const requestedFields = deepMerge(
      deepMerge(select, filters),
      inputOrderByObj
    )

    const connection = manager.getConnection()
    const qb = new QueryBuilder({
      schema: this.schemaObjectRepresentation_,
      entityMap: this.schemaEntitiesMap_,
      knex: connection.getKnex(),
      selector: {
        select,
        where,
        joinWhere,
      },
      options: {
        skip,
        take,
        orderBy,
      },
      rawConfig: config,
      requestedFields,
      idsOnly,
    })

    const { sql, sqlCount } = qb.buildQuery({
      hasPagination,
      hasCount,
    })

    const [resultSet, countResult] = await Promise.all([
      manager.execute(sql),
      hasCount ? manager.execute(sqlCount!) : null,
    ])

    const resultMetadata: IndexTypes.QueryFunctionReturnPagination | undefined =
      hasPagination
        ? ({
            estimate_count: hasCount
              ? parseInt(countResult![0]?.estimate_count ?? 0)
              : undefined,
            skip,
            take,
          } as IndexTypes.QueryFunctionReturnPagination)
        : undefined

    return {
      data: qb.buildObjectFromResultset(
        resultSet
      ) as IndexTypes.QueryResultSet<TEntry>["data"],
      metadata: resultMetadata,
    }
  }

  /**
   * Create the index entry and the index relation entry when this event is emitted.
   * @param entity
   * @param data
   * @param schemaEntityObjectRepresentation
   * @param sharedContext
   * @protected
   */
  @InjectTransactionManager()
  async onCreate<TData extends { id: string; [key: string]: unknown }>(
    {
      entity,
      data,
      schemaEntityObjectRepresentation,
    }: {
      entity: string
      data: TData | TData[]
      schemaEntityObjectRepresentation: IndexTypes.SchemaObjectEntityRepresentation
    },
    @MedusaContext() sharedContext: Context<SqlEntityManager> = {}
  ) {
    const { transactionManager: em } = sharedContext
    const indexRepository = em!.getRepository(
      toMikroORMEntity(IndexData)
    ) as EntityRepository<any>
    const indexRelationRepository: EntityRepository<any> = em!.getRepository(
      toMikroORMEntity(IndexRelation)
    )

    const {
      data: data_,
      entityProperties,
      parentsProperties,
    } = PostgresProvider.parseData(data, schemaEntityObjectRepresentation)

    /**
     * Clean the entity data to only keep the properties that are defined in the schema
     */
    const cleanedData = data_.map((entityData) => {
      return entityProperties.reduce((acc, property) => {
        acc[property] = entityData[property]
        return acc
      }, {}) as TData
    })

    /**
     * Loop through the data and create index entries for each entity as well as the
     * index relation entries if the entity has parents
     */

    const entitiesToUpsert: Set<string> = new Set()
    const relationsToUpsert: Set<string> = new Set()

    cleanedData.forEach((entityData, index) => {
      entitiesToUpsert.add(
        JSON.stringify({
          id: entityData.id,
          name: entity,
          data: entityData,
          staled_at: null,
        })
      )

      /**
       * Retrieve the parents to attach it to the index entry.
       */

      for (const [parentEntity, parentProperties] of Object.entries(
        parentsProperties
      )) {
        const parentAlias = parentProperties[0].split(".")[0]
        const parentData = data_[index][parentAlias] as TData[]

        if (!parentData) {
          continue
        }

        const parentDataCollection = Array.isArray(parentData)
          ? parentData
          : [parentData]

        for (const parentData_ of parentDataCollection) {
          relationsToUpsert.add(
            JSON.stringify({
              parent_id: parentData_.id,
              parent_name: parentEntity,
              child_id: entityData.id,
              child_name: entity,
              pivot: `${parentEntity}-${entity}`,
              staled_at: null,
            })
          )
        }
      }
    })

    if (entitiesToUpsert.size) {
      await indexRepository.upsertMany(
        Array.from(entitiesToUpsert).map((entity) => JSON.parse(entity)),
        {
          onConflictAction: "merge",
          onConflictFields: ["id", "name"],
          onConflictMergeFields: ["data", "staled_at"],
        }
      )
    }

    if (relationsToUpsert.size) {
      await indexRelationRepository.upsertMany(
        Array.from(relationsToUpsert).map((relation) => JSON.parse(relation)),
        {
          onConflictAction: "merge",
          onConflictFields: [
            "pivot",
            "parent_id",
            "child_id",
            "parent_name",
            "child_name",
          ],
          onConflictMergeFields: ["staled_at"],
        }
      )
    }
  }

  /**
   * Update the index entry when this event is emitted.
   * @param entity
   * @param data
   * @param schemaEntityObjectRepresentation
   * @param sharedContext
   * @protected
   */
  @InjectTransactionManager()
  async onUpdate<TData extends { id: string; [key: string]: unknown }>(
    {
      entity,
      data,
      schemaEntityObjectRepresentation,
    }: {
      entity: string
      data: TData | TData[]
      schemaEntityObjectRepresentation: IndexTypes.SchemaObjectEntityRepresentation
    },
    @MedusaContext() sharedContext: Context<SqlEntityManager> = {}
  ) {
    const { transactionManager: em } = sharedContext
    const indexRepository = em!.getRepository(
      toMikroORMEntity(IndexData)
    ) as EntityRepository<any>

    const { data: data_, entityProperties } = PostgresProvider.parseData(
      data,
      schemaEntityObjectRepresentation
    )

    await indexRepository.upsertMany(
      data_.map((entityData) => {
        return {
          id: entityData.id,
          name: entity,
          data: entityProperties.reduce((acc, property) => {
            acc[property] = entityData[property]
            return acc
          }, {}),
          staled_at: null,
        }
      }),
      {
        onConflictAction: "merge",
        onConflictFields: ["id", "name"],
        onConflictMergeFields: ["data", "staled_at"],
      }
    )
  }

  /**
   * Delete the index entry when this event is emitted.
   * @param entity
   * @param data
   * @param schemaEntityObjectRepresentation
   * @param sharedContext
   * @protected
   */
  @InjectTransactionManager()
  async onDelete<TData extends { id: string; [key: string]: unknown }>(
    {
      entity,
      data,
      schemaEntityObjectRepresentation,
    }: {
      entity: string
      data: TData | TData[]
      schemaEntityObjectRepresentation: IndexTypes.SchemaObjectEntityRepresentation
    },
    @MedusaContext() sharedContext: Context<SqlEntityManager> = {}
  ) {
    const { transactionManager: em } = sharedContext
    const indexRepository = em!.getRepository(toMikroORMEntity(IndexData))
    const indexRelationRepository = em!.getRepository(
      toMikroORMEntity(IndexRelation)
    )

    const { data: data_ } = PostgresProvider.parseData(
      data,
      schemaEntityObjectRepresentation
    )

    const ids = data_.map((entityData) => entityData.id)

    await indexRepository.nativeDelete({
      id: { $in: ids },
      name: entity,
    })

    await indexRelationRepository.nativeDelete({
      $or: [
        {
          parent_id: { $in: ids },
          parent_name: entity,
        },
        {
          child_id: { $in: ids },
          child_name: entity,
        },
      ],
    })
  }

  /**
   * event emitted from the link modules to attach a link entity to its parent and child entities from the linked modules.
   * @param entity
   * @param data
   * @param schemaEntityObjectRepresentation
   * @protected
   */
  @InjectTransactionManager()
  async onAttach<TData extends { id: string; [key: string]: unknown }>(
    {
      entity,
      data,
      schemaEntityObjectRepresentation,
    }: {
      entity: string
      data: TData | TData[]
      schemaEntityObjectRepresentation: IndexTypes.SchemaObjectEntityRepresentation
    },
    @MedusaContext() sharedContext: Context<SqlEntityManager> = {}
  ) {
    const { transactionManager: em } = sharedContext
    const indexRepository = em!.getRepository(toMikroORMEntity(IndexData))
    const indexRelationRepository = em!.getRepository(
      toMikroORMEntity(IndexRelation)
    ) as EntityRepository<any>

    const { data: data_, entityProperties } = PostgresProvider.parseData(
      data,
      schemaEntityObjectRepresentation
    )

    /**
     * Retrieve the property that represent the foreign key related to the parent entity of the link entity.
     * Then from the service name of the parent entity, retrieve the entity name using the linkable keys.
     */

    const parentPropertyId =
      schemaEntityObjectRepresentation.moduleConfig.relationships![0].foreignKey
    const parentServiceName =
      schemaEntityObjectRepresentation.moduleConfig.relationships![0]
        .serviceName
    const parentEntityName = (
      this.schemaObjectRepresentation_._serviceNameModuleConfigMap[
        parentServiceName
      ] as IndexTypes.EntityNameModuleConfigMap[0]
    ).linkableKeys?.[parentPropertyId]

    if (!parentEntityName) {
      throw new Error(
        `IndexModule error, unable to handle attach event for ${entity}. The parent entity name could not be found using the linkable keys from the module ${parentServiceName}.`
      )
    }

    /**
     * Retrieve the property that represent the foreign key related to the child entity of the link entity.
     * Then from the service name of the child entity, retrieve the entity name using the linkable keys.
     */

    const childPropertyId =
      schemaEntityObjectRepresentation.moduleConfig.relationships![1].foreignKey
    const childServiceName =
      schemaEntityObjectRepresentation.moduleConfig.relationships![1]
        .serviceName
    const childEntityName = (
      this.schemaObjectRepresentation_._serviceNameModuleConfigMap[
        childServiceName
      ] as IndexTypes.EntityNameModuleConfigMap[0]
    ).linkableKeys?.[childPropertyId]

    if (!childEntityName) {
      throw new Error(
        `IndexModule error, unable to handle attach event for ${entity}. The child entity name could not be found using the linkable keys from the module ${childServiceName}.`
      )
    }

    /**
     * Clean the link entity data to only keep the properties that are defined in the schema
     */

    const cleanedData = data_.map((entityData) => {
      return entityProperties.reduce((acc, property) => {
        acc[property] = entityData[property]
        return acc
      }, {}) as TData
    })

    let relationsToUpsert: any[] = []
    const entitiesToUpsert = cleanedData.map((entityData) => {
      relationsToUpsert.push(
        {
          parent_id: entityData[parentPropertyId] as string,
          parent_name: parentEntityName,
          child_id: entityData.id,
          child_name: entity,
          pivot: `${parentEntityName}-${entity}`,
          staled_at: null,
        },
        {
          parent_id: entityData.id,
          parent_name: entity,
          child_id: entityData[childPropertyId] as string,
          child_name: childEntityName,
          pivot: `${entity}-${childEntityName}`,
          staled_at: null,
        }
      )

      return {
        id: entityData.id,
        name: entity,
        data: entityData,
        staled_at: null,
      }
    })

    if (entitiesToUpsert.length) {
      await indexRepository.upsertMany(entitiesToUpsert, {
        onConflictAction: "merge",
        onConflictFields: ["id", "name"],
        onConflictMergeFields: ["data", "staled_at"],
      })
    }

    if (relationsToUpsert.length) {
      await indexRelationRepository.upsertMany(relationsToUpsert, {
        onConflictAction: "merge",
        onConflictFields: [
          "pivot",
          "parent_id",
          "child_id",
          "parent_name",
          "child_name",
        ],
        onConflictMergeFields: ["staled_at"],
      })
    }
  }

  /**
   * Event emitted from the link modules to detach a link entity from its parent and child entities from the linked modules.
   * @param entity
   * @param data
   * @param schemaEntityObjectRepresentation
   * @param sharedContext
   * @protected
   */
  @InjectTransactionManager()
  async onDetach<TData extends { id: string; [key: string]: unknown }>(
    {
      entity,
      data,
      schemaEntityObjectRepresentation,
    }: {
      entity: string
      data: TData | TData[]
      schemaEntityObjectRepresentation: IndexTypes.SchemaObjectEntityRepresentation
    },
    @MedusaContext() sharedContext: Context<SqlEntityManager> = {}
  ) {
    const { transactionManager: em } = sharedContext
    const indexRepository = em!.getRepository(toMikroORMEntity(IndexData))
    const indexRelationRepository = em!.getRepository(
      toMikroORMEntity(IndexRelation)
    )

    const { data: data_ } = PostgresProvider.parseData(
      data,
      schemaEntityObjectRepresentation
    )

    const ids = data_.map((entityData) => entityData.id)

    await indexRepository.nativeDelete({
      id: { $in: ids },
      name: entity,
    })

    await indexRelationRepository.nativeDelete({
      $or: [
        {
          parent_id: { $in: ids },
          parent_name: entity,
        },
        {
          child_id: { $in: ids },
          child_name: entity,
        },
      ],
    })
  }
}
