import {
  IEventBusModuleService,
  RemoteJoinerQuery,
  Subscriber,
} from "@medusajs/types"
import { remoteQueryObjectFromString } from "@medusajs/utils"
import { EntityManager } from "@mikro-orm/postgresql"
import { Catalog } from "@models"
import {
  CatalogModuleOptions,
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

      const action = eventName.split(".").pop()

      switch (action) {
        case "created":
          await this.onCreate(argument)
          break
        case "attached":
          await this.onAttach(argument)
      }
    }
  }

  protected async onCreate<
    TData extends { id: string; [key: string]: unknown }
  >({
    entity,
    data,
    schemaEntityObjectRepresentation,
  }: {
    entity: string
    data: TData[]
    schemaEntityObjectRepresentation: SchemaObjectEntityRepresentation
  }) {
    await this.container_.manager.transactional(async (em) => {
      const catalogRepository = em.getRepository(Catalog)

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

      const catalogEntries: Catalog[] = []

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

        catalogEntries.push(catalogEntry)

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
            return
          }

          for (const parentEntity of parentEntities) {
            const parentCatalogEntry = (await catalogRepository.findOne({
              id: parentEntity.id,
              name: parentSchemaObjectRepresentation.ref.entity,
            })) as Catalog
            catalogEntry.parents.add(parentCatalogEntry)
          }
        }
      }

      catalogRepository.persist(catalogEntries)

      await em.flush()
    })
  }

  protected async onUpdate() {}

  protected async onDelete() {}

  protected async onAttach<
    TData extends { id: string; [key: string]: unknown }
  >({
    entity,
    data,
    schemaEntityObjectRepresentation,
  }: {
    entity: string
    data: TData[]
    schemaEntityObjectRepresentation: SchemaObjectEntityRepresentation
  }) {
    await this.container_.manager.transactional(async (em) => {
      const catalogRepository = em.getRepository(Catalog)

      const data_ = Array.isArray(data) ? data : [data]

      // Always keep the id in the entity properties
      const entityProperties: string[] = ["id"]

      /**
       * Split fields to retrieve the entity properties without its parent or child
       */

      schemaEntityObjectRepresentation.fields.forEach((field) => {
        if (!field.includes(".")) {
          entityProperties.push(field)
        }
      })

      const parentPropertyId =
        schemaEntityObjectRepresentation.moduleConfig.relationships![0]
          .foreignKey
      const childPropertyId =
        schemaEntityObjectRepresentation.moduleConfig.relationships![1]
          .foreignKey

      const catalogEntries: Catalog[] = []

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

        catalogEntries.push(catalogEntry)

        /**
         * Retrieve the parent catalog entry to attach as the parent of the link catalog entry.
         */

        const parentCatalogEntry = (await catalogRepository.findOne({
          id: entityData[parentPropertyId] as string,
        })) as Catalog

        catalogEntry.parents.add(parentCatalogEntry)

        /**
         * Retrieve the child catalog entry to attach the link catalog entry as the parent of the child.
         */

        const childCatalogEntry = (await catalogRepository.findOne({
          id: entityData[childPropertyId] as string,
        })) as Catalog

        childCatalogEntry.parents.add(catalogEntry)
        catalogEntries.push(childCatalogEntry)
      }

      catalogRepository.persist(catalogEntries)
      await em.flush()
    })
  }

  protected async onDetach() {}
}
