import {
  IEventBusModuleService,
  RemoteJoinerQuery,
  Subscriber,
} from "@medusajs/types"
import { remoteQueryObjectFromString } from "@medusajs/utils"
import { EntityManager } from "@mikro-orm/postgresql"
import { Catalog, CatalogRelation } from "@models"
import {
  EntityNameModuleConfigMap,
  QueryFormat,
  QueryOptions,
  SchemaObjectEntityRepresentation,
  SchemaObjectRepresentation,
  SchemaPropertiesMap,
  SearchModuleOptions,
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
  protected readonly schemaEntitiesMap_: Record<string, any>
  protected readonly moduleOptions_: SearchModuleOptions
  protected readonly isReady_: Promise<boolean>

  protected get remoteQuery_(): (
    query: string | RemoteJoinerQuery | object,
    variables?: Record<string, unknown>
  ) => Promise<any> {
    return this.container_.remoteQuery
  }

  constructor(
    container,
    options: {
      schemaObjectRepresentation: SchemaObjectRepresentation
      entityMap: Record<string, any>
    },
    moduleOptions: SearchModuleOptions
  ) {
    this.container_ = container
    this.moduleOptions_ = moduleOptions

    this.schemaObjectRepresentation_ = options.schemaObjectRepresentation
    this.schemaEntitiesMap_ = options.entityMap

    let initalizedOk: (value: any) => void = () => {}
    let initalizedNok: (value: any) => void = () => {}
    this.isReady_ = new Promise((resolve, reject) => {
      initalizedOk = resolve
      initalizedNok = reject
    })
    this.createPartitions().then(initalizedOk).catch(initalizedNok)

    // Add a new column for each key that can be found in the jsonb data column to perform indexes and query on it.
    // So far, the execution time is about the same
    /*;(async () => {
      const query = [
        ...new Set(
          Object.keys(this.schemaObjectRepresentation_)
            .filter(
              (key) =>
                ![
                  "_serviceNameModuleConfigMap",
                  "_schemaPropertiesMap",
                ].includes(key)
            )
            .map((key) => {
              return this.schemaObjectRepresentation_[key].fields.filter(
                (field) => !field.includes(".")
              )
            })
            .flat()
        ),
      ].map(
        (field) =>
          "ALTER TABLE catalog ADD IF NOT EXISTS " +
          field +
          " text GENERATED ALWAYS AS (NEW.data->>'" +
          field +
          "') STORED"
      )
      await this.container_.manager.execute(query.join(";"))
    })()*/
  }

  private async createPartitions() {
    const partitions = Object.keys(this.schemaObjectRepresentation_)
      .filter(
        (key) =>
          !["_serviceNameModuleConfigMap", "_schemaPropertiesMap"].includes(key)
      )
      .map((key) => {
        const cName = key.toLowerCase()
        const part: string[] = []
        part.push(
          `CREATE TABLE IF NOT EXISTS cat_${cName} PARTITION OF catalog FOR VALUES IN ('${key}')`
        )

        for (const parent of this.schemaObjectRepresentation_[key].parents) {
          const pKey = `${parent.ref.entity}-${key}`
          const pName = `${parent.ref.entity}${key}`.toLowerCase()
          part.push(
            `CREATE TABLE IF NOT EXISTS cat_pivot_${pName} PARTITION OF catalog_relation FOR VALUES IN ('${pKey}')`
          )
        }
        return part
      })
      .flat()

    partitions.push("analyse catalog")
    partitions.push("analyse catalog_relation")

    return await this.container_.manager.execute(partitions.join("; "))
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
    await this.isReady_

    let hasPagination = false
    if (
      typeof options?.take === "number" ||
      typeof options?.skip === "number"
    ) {
      hasPagination = true
    }

    const connection = this.container_.manager.getConnection()
    const qb = new QueryBuilder({
      schema: this.schemaObjectRepresentation_,
      entityMap: this.schemaEntitiesMap_,
      knex: connection.getKnex(),
      selector: selection,
      options,
    })

    const sql = qb.buildQuery(hasPagination, !!options?.keepFilteredEntities)

    let resultset = await connection.execute(sql)

    if (options?.keepFilteredEntities) {
      const mainEntity = Object.keys(selection.select)[0]

      const ids = resultset.map((r) => r[`${mainEntity}.id`])
      if (ids.length) {
        const selection_ = {
          select: selection.select,
          joinWhere: selection.joinWhere,
          where: {
            [`${mainEntity}.id`]: ids,
          },
        }
        return await this.query(selection_)
      }
    }

    return qb.buildObjectFromResultset(resultset)
  }

  async queryAndCount(selection: QueryFormat, options?: QueryOptions) {
    await this.isReady_

    const connection = this.container_.manager.getConnection()
    const qb = new QueryBuilder({
      schema: this.schemaObjectRepresentation_,
      entityMap: this.schemaEntitiesMap_,
      knex: connection.getKnex(),
      selector: selection,
      options,
    })

    const sql = qb.buildQuery(true, !!options?.keepFilteredEntities)
    let resultset = await connection.execute(sql)

    const count = +(resultset[0]?.count ?? 0)

    if (options?.keepFilteredEntities) {
      const mainEntity = Object.keys(selection.select)[0]

      const ids = resultset.map((r) => r[`${mainEntity}.id`])
      if (ids.length) {
        const selection_ = {
          select: selection.select,
          joinWhere: selection.joinWhere,
          where: {
            [`${mainEntity}.id`]: ids,
          },
        }
        return [await this.query(selection_), count]
      }
    }

    return [qb.buildObjectFromResultset(resultset), count]
  }

  consumeEvent(
    schemaEntityObjectRepresentation: SchemaObjectEntityRepresentation
  ): Subscriber {
    return async (data: unknown, eventName: string) => {
      await this.isReady_

      const data_ = Array.isArray(data) ? data : [data]
      let ids: string[] = data_.map((d) => d.id)

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
              `SearchModule error, unable to find the parent entity representation from the alias ${parentAlias}.`
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
      const catalogRelationRepository = em.getRepository(CatalogRelation)

      const { data: data_ } = PostgresProvider.parseData(
        data,
        schemaEntityObjectRepresentation
      )

      const ids = data_.map((entityData) => entityData.id)

      await catalogRepository.nativeDelete({
        id: { $in: ids },
        name: entity,
      })

      await catalogRelationRepository.nativeDelete({
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
          `SearchModule error, unable to handle attach event for ${entity}. The parent entity name could not be found using the linkable keys from the module ${parentServiceName}.`
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
          `SearchModule error, unable to handle attach event for ${entity}. The child entity name could not be found using the linkable keys from the module ${childServiceName}.`
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
          pivot: `${parentEntityName}-${entity}`,
        })

        const childCatalogRelationEntry = catalogRelationRepository.create({
          parent_id: cleanedEntityData.id,
          parent_name: entity,
          child_id: entityData[childPropertyId] as string,
          child_name: childEntityName,
          pivot: `${entity}-${childEntityName}`,
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
      const catalogRelationRepository = em.getRepository(CatalogRelation)

      const { data: data_ } = PostgresProvider.parseData(
        data,
        schemaEntityObjectRepresentation
      )

      const ids = data_.map((entityData) => entityData.id)

      await catalogRepository.nativeDelete({
        id: { $in: ids },
        name: entity,
      })

      await catalogRelationRepository.nativeDelete({
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
    })
  }
}
