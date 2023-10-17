import {
  IEventBusModuleService,
  RemoteJoinerQuery,
  Subscriber,
} from "@medusajs/types"
import { remoteQueryObjectFromString } from "@medusajs/utils"
import { EntityManager } from "@mikro-orm/postgresql"
import { Catalog, CatalogRelation } from "@models"
import {
  CatalogModuleOptions,
  EntityNameModuleConfigMap,
  QueryFormat,
  QueryOptions,
  SchemaObjectEntityRepresentation,
  SchemaObjectRepresentation,
  SchemaPropertiesMap,
  StorageProvider,
} from "../types"
import { QueryBuilder } from "../utils"

type InjectedDependencies = {
  manager: EntityManager
  eventBusModuleService: IEventBusModuleService
  storageProviderCtr: StorageProvider
  storageProviderOptions: unknown
  remoteQuery: (
    query: string | RemoteJoinerQuery | object,
    variables?: Record<string, unknown>
  ) => Promise<any>
}

export class PostgresProvider {
  protected readonly eventActionToMethodMap_ = {
    created: "onCreate",
    updated: "onUpdate",
    deleted: "onDelete",
    attached: "onAttach",
    detached: "onDetach",
  }

  protected container_: InjectedDependencies
  protected readonly schemaObjectRepresentation_: SchemaObjectRepresentation
  protected readonly moduleOptions_: CatalogModuleOptions

  protected get remoteQuery_(): (
    query: string | RemoteJoinerQuery | object,
    variables?: Record<string, unknown>
  ) => Promise<any> {
    return this.container_.remoteQuery
  }

  constructor(
    container,
    options: { schemaObjectRepresentation: SchemaObjectRepresentation },
    moduleOptions: CatalogModuleOptions
  ) {
    this.container_ = container
    this.moduleOptions_ = moduleOptions

    this.schemaObjectRepresentation_ = options.schemaObjectRepresentation
  }

  protected static parseData<
    TData extends { id: string; [key: string]: unknown }
  >(
    data: TData | TData[],
    schemaEntityObjectRepresentation: SchemaObjectEntityRepresentation
  ) {
    const data_ = Array.isArray(data) ? data : [data]

    // Always keep the id in the entity properties
    const entityProperties: string[] = ["id"]
    const parentsProperties: string[] = []

    /**
     * Split fields into entity properties and parents properties
     */

    schemaEntityObjectRepresentation.fields.forEach((field) => {
      if (field.includes(".")) {
        parentsProperties.push(field)
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

  async query(selection: QueryFormat, options?: QueryOptions) {
    const connection = this.container_.manager.getConnection()

    const qb = new QueryBuilder({
      schema: this.schemaObjectRepresentation_,
      knex: connection.getKnex(),
      selector: selection,
      options,
    })

    let hasPagination = false
    if (
      typeof options?.take === "number" ||
      (typeof options?.skip === "number" && options?.skip > 0)
    ) {
      hasPagination = true
    }

    if (hasPagination) {
      const [rs] = await this.queryAndCount_(selection, options, false)
      return rs
    }

    const sql = qb.buildQuery()

    const resultset = await connection.execute(sql)
    return qb.buildObjectFromResultset(resultset)
  }

  async queryAndCount(selection: QueryFormat, options?: QueryOptions) {
    return this.queryAndCount_(selection, options)
  }

  private async queryAndCount_(
    selection: QueryFormat,
    options?: QueryOptions,
    countWhenPaginating = true
  ) {
    const connection = this.container_.manager.getConnection()

    const qbCount = new QueryBuilder({
      schema: this.schemaObjectRepresentation_,
      knex: connection.getKnex(),
      selector: selection,
      options,
    })

    const countSql = qbCount.buildDistinctQuery(countWhenPaginating)
    const countRs = await connection.execute(countSql)

    const ids = countRs.map((r) => r.id)
    const totalCount = countRs[0]?.count ?? 0

    selection.where = {
      ids: ids,
      ...(selection.where ?? {}),
    }

    const qb = new QueryBuilder({
      schema: this.schemaObjectRepresentation_,
      knex: connection.getKnex(),
      selector: selection,
      options,
    })
    const sql = qb.buildQuery()

    const resultset = await connection.execute(sql)
    return [qb.buildObjectFromResultset(resultset), +totalCount]
  }

  consumeEvent(
    schemaEntityObjectRepresentation: SchemaObjectEntityRepresentation
  ): Subscriber {
    return async (data: unknown, eventName: string) => {
      const data_ = data as Record<string, unknown>
      let ids: string[] = []

      if ("id" in data_) {
        ids = [data_.id as string]
      } else if ("ids" in data_) {
        ids = data_.ids as string[]
      }

      const { fields, alias } = schemaEntityObjectRepresentation
      const entityData = await this.remoteQuery_(
        remoteQueryObjectFromString({
          entryPoint: alias,
          variables: {
            filters: {
              id: ids,
            },
          },
          fields,
        })
      )

      const argument = {
        entity: schemaEntityObjectRepresentation.entity,
        data: entityData,
        schemaEntityObjectRepresentation,
      }

      const action = eventName.split(".").pop() || ""
      const targetMethod = this.eventActionToMethodMap_[action]

      if (!targetMethod) {
        return
      }

      await this[targetMethod](argument)
    }
  }

  /**
   * Create the catalog entry and the catalog relation entry when this event is emitted.
   * @param entity
   * @param data
   * @param schemaEntityObjectRepresentation
   * @protected
   */
  protected async onCreate<
    TData extends { id: string; [key: string]: unknown }
  >({
    entity,
    data,
    schemaEntityObjectRepresentation,
  }: {
    entity: string
    data: TData | TData[]
    schemaEntityObjectRepresentation: SchemaObjectEntityRepresentation
  }) {
    await this.container_.manager.transactional(async (em) => {
      const catalogRepository = em.getRepository(Catalog)

      const {
        data: data_,
        entityProperties,
        parentsProperties,
      } = PostgresProvider.parseData(data, schemaEntityObjectRepresentation)

      /**
       * Loop through the data and create catalog entries for each entity as well as the
       * catalog relation entries if the entity has parents
       */

      for (const entityData of data_) {
        /**
         * Clean the entity data to only keep the properties that are defined in the schema
         */

        const cleanedEntityData = entityProperties.reduce((acc, property) => {
          acc[property] = entityData[property]
          return acc
        }, {}) as TData

        const catalogEntry = catalogRepository.create({
          id: cleanedEntityData.id,
          name: entity,
          data: cleanedEntityData,
        })

        /**
         * Retrieve the parents to attach it to the catalog entry.
         */

        for (const parentProperty of parentsProperties) {
          const parentAlias = parentProperty.split(".")[0]
          const parentEntities = entityData[parentAlias] as TData[]

          if (!parentEntities) {
            return
          }

          const parentSchemaObjectRepresentation = this
            .schemaObjectRepresentation_._schemaPropertiesMap[
            parentAlias
          ] as SchemaPropertiesMap[0]

          if (!parentSchemaObjectRepresentation) {
            throw new Error(
              `CatalogModule error, unable to find the parent entity representation from the alias ${parentAlias}.`
            )
          }

          for (const parentEntity of parentEntities) {
            const parentCatalogEntry = (await catalogRepository.findOne({
              id: parentEntity.id,
              name: parentSchemaObjectRepresentation.ref.entity,
            })) as Catalog
            catalogEntry.parents.add(parentCatalogEntry)
          }
        }

        catalogRepository.persist(catalogEntry)
      }

      await em.flush()
    })
  }

  /**
   * Update the catalog entry when this event is emitted.
   * @param entity
   * @param data
   * @param schemaEntityObjectRepresentation
   * @protected
   */
  protected async onUpdate<
    TData extends { id: string; [key: string]: unknown }
  >({
    entity,
    data,
    schemaEntityObjectRepresentation,
  }: {
    entity: string
    data: TData | TData[]
    schemaEntityObjectRepresentation: SchemaObjectEntityRepresentation
  }) {
    await this.container_.manager.transactional(async (em) => {
      const catalogRepository = em.getRepository(Catalog)

      const { data: data_, entityProperties } = PostgresProvider.parseData(
        data,
        schemaEntityObjectRepresentation
      )

      await catalogRepository.upsertMany(
        data_.map((entityData) => {
          return {
            id: entityData.id,
            name: entity,
            data: entityProperties.reduce((acc, property) => {
              acc[property] = entityData[property]
              return acc
            }, {}),
          }
        })
      )
    })
  }

  /**
   * Delete the catalog entry when this event is emitted.
   * @param entity
   * @param data
   * @param schemaEntityObjectRepresentation
   * @protected
   */
  protected async onDelete<
    TData extends { id: string; [key: string]: unknown }
  >({
    entity,
    data,
    schemaEntityObjectRepresentation,
  }: {
    entity: string
    data: TData | TData[]
    schemaEntityObjectRepresentation: SchemaObjectEntityRepresentation
  }) {
    await this.container_.manager.transactional(async (em) => {
      const catalogRepository = em.getRepository(Catalog)

      const { data: data_ } = PostgresProvider.parseData(
        data,
        schemaEntityObjectRepresentation
      )

      const ids = data_.map((entityData) => entityData.id)

      await catalogRepository.nativeDelete({
        id: { $in: ids },
        name: entity,
      })
    })
  }

  /**
   * event emitted from the link modules to attach a link entity to its parent and child entities from the linked modules.
   * @param entity
   * @param data
   * @param schemaEntityObjectRepresentation
   * @protected
   */
  protected async onAttach<
    TData extends { id: string; [key: string]: unknown }
  >({
    entity,
    data,
    schemaEntityObjectRepresentation,
  }: {
    entity: string
    data: TData | TData[]
    schemaEntityObjectRepresentation: SchemaObjectEntityRepresentation
  }) {
    await this.container_.manager.transactional(async (em) => {
      const catalogRepository = em.getRepository(Catalog)
      const catalogRelationRepository = em.getRepository(CatalogRelation)

      const { data: data_, entityProperties } = PostgresProvider.parseData(
        data,
        schemaEntityObjectRepresentation
      )

      /**
       * Retrieve the property that represent the foreign key related to the parent entity of the link entity.
       * Then from the service name of the parent entity, retrieve the entity name using the linkable keys.
       */

      const parentPropertyId =
        schemaEntityObjectRepresentation.moduleConfig.relationships![0]
          .foreignKey
      const parentServiceName =
        schemaEntityObjectRepresentation.moduleConfig.relationships![0]
          .serviceName
      const parentEntityName = (
        this.schemaObjectRepresentation_._serviceNameModuleConfigMap[
          parentServiceName
        ] as EntityNameModuleConfigMap[0]
      ).linkableKeys?.[parentPropertyId]

      if (!parentEntityName) {
        throw new Error(
          `CatalogModule error, unable to handle attach event for ${entity}. The parent entity name could not be found using the linkable keys from the module ${parentServiceName}.`
        )
      }

      /**
       * Retrieve the property that represent the foreign key related to the child entity of the link entity.
       * Then from the service name of the child entity, retrieve the entity name using the linkable keys.
       */

      const childPropertyId =
        schemaEntityObjectRepresentation.moduleConfig.relationships![1]
          .foreignKey
      const childServiceName =
        schemaEntityObjectRepresentation.moduleConfig.relationships![1]
          .serviceName
      const childEntityName = (
        this.schemaObjectRepresentation_._serviceNameModuleConfigMap[
          childServiceName
        ] as EntityNameModuleConfigMap[0]
      ).linkableKeys?.[childPropertyId]

      if (!childEntityName) {
        throw new Error(
          `CatalogModule error, unable to handle attach event for ${entity}. The child entity name could not be found using the linkable keys from the module ${childServiceName}.`
        )
      }

      for (const entityData of data_) {
        /**
         * Clean the link entity data to only keep the properties that are defined in the schema
         */

        const cleanedEntityData = entityProperties.reduce((acc, property) => {
          acc[property] = entityData[property]
          return acc
        }, {}) as TData

        const catalogEntry = catalogRepository.create({
          id: cleanedEntityData.id,
          name: entity,
          data: cleanedEntityData,
        })

        catalogRepository.persist(catalogEntry)

        /**
         * Create the catalog relation entries for the parent entity and the child entity
         */

        const parentCatalogRelationEntry = catalogRelationRepository.create({
          parent_id: entityData[parentPropertyId] as string,
          parent_name: parentEntityName,
          child_id: cleanedEntityData.id,
          child_name: entity,
        })

        const childCatalogRelationEntry = catalogRelationRepository.create({
          parent_id: cleanedEntityData.id,
          parent_name: entity,
          child_id: entityData[childPropertyId] as string,
          child_name: childEntityName,
        })

        catalogRelationRepository.persist([
          parentCatalogRelationEntry,
          childCatalogRelationEntry,
        ])
      }

      await em.flush()
    })
  }

  /**
   * Event emitted from the link modules to detach a link entity from its parent and child entities from the linked modules.
   * @param entity
   * @param data
   * @param schemaEntityObjectRepresentation
   * @protected
   */
  protected async onDetach<
    TData extends { id: string; [key: string]: unknown }
  >({
    entity,
    data,
    schemaEntityObjectRepresentation,
  }: {
    entity: string
    data: TData | TData[]
    schemaEntityObjectRepresentation: SchemaObjectEntityRepresentation
  }) {
    await this.container_.manager.transactional(async (em) => {
      const catalogRepository = em.getRepository(Catalog)

      const { data: data_ } = PostgresProvider.parseData(
        data,
        schemaEntityObjectRepresentation
      )

      const ids = data_.map((entityData) => entityData.id)

      await catalogRepository.nativeDelete({
        id: { $in: ids },
        name: entity,
      })
    })
  }
}
