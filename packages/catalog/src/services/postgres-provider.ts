import {
  IEventBusModuleService,
  RemoteJoinerQuery,
  Subscriber,
} from "@medusajs/types"
import { remoteQueryObjectFromString } from "@medusajs/utils"
import { EntityManager } from "@mikro-orm/postgresql"
import {
  CatalogModuleOptions,
  QueryFormat,
  QueryOptions,
  SchemaObjectRepresentation,
  StorageProvider,
} from "../types"
import { QueryBuilder } from "../utils"
import { Catalog, CatalogRelation } from "@models"

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
    options: { schemaConfigurationObject: SchemaObjectRepresentation },
    moduleOptions: CatalogModuleOptions
  ) {
    this.container_ = container
    this.moduleOptions_ = moduleOptions
    this.schemaObjectRepresentation_ = options.schemaConfigurationObject
  }

  async query(param: { selection: QueryFormat; options?: QueryOptions }) {
    const { selection, options } = param

    const connection = this.container_.manager.getConnection()
    const qb = new QueryBuilder({
      schema: this.schemaObjectRepresentation_,
      knex: connection.getKnex(),
      selector: selection,
      options,
    })

    const sql = qb.buildQuery()
    const resultset = await connection.execute(sql)
    return qb.buildObjectFromResultset(resultset)
  }

  consumeEvent(
    entitySchemaObjectRepresentation: SchemaObjectRepresentation[0]
  ): Subscriber {
    return async (data: unknown, eventName: string) => {
      const data_ = data as Record<string, unknown>
      let ids: string[] = []

      if ("id" in data_) {
        ids = [data_.id as string]
      } else if ("ids" in data_) {
        ids = data_.ids as string[]
      }

      const { fields, alias } = entitySchemaObjectRepresentation
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
        entity: entitySchemaObjectRepresentation.entity,
        data: entityData,
        entitySchemaObjectRepresentation,
      }

      const action = eventName.split(".").pop()

      switch (action) {
        case "created":
          await this.onCreate(argument)
      }
    }
  }

  protected async onCreate<
    TData extends { id: string; [key: string]: unknown }
  >({
    entity,
    data,
    entitySchemaObjectRepresentation,
  }: {
    entity: string
    data: TData[]
    entitySchemaObjectRepresentation: SchemaObjectRepresentation[0]
  }) {
    await this.container_.manager.transactional(async (em) => {
      const catalogRepository = em.getRepository(Catalog)
      const catalogRelationRepository = em.getRepository(CatalogRelation)

      const data_ = Array.isArray(data) ? data : [data]

      const entityProperties: string[] = []
      const parentsProperties: string[] = []

      /**
       * Split fields into entity properties and parents properties
       */

      entitySchemaObjectRepresentation.fields.forEach((field) => {
        if (field.includes(".")) {
          parentsProperties.push(field)
        } else {
          entityProperties.push(field)
        }
      })

      const catalogEntries: Catalog[] = []
      const catalogRelationEntries: CatalogRelation[] = []

      /**
       * Loop through the data and create catalog entries for each entity as well as the
       * catalog relation entries if the entity has parents
       */

      data_.forEach((entityData) => {
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
         * Retrieve the parents and create catalog relation entries to attach the entity to its parents.
         * The entity can have multiple parents, but we need to ensure that we have the data of the parent
         * we find before creating the catalog relation entry. Theoratically, at this moment
         * the parent catalog entry should be present in the catalog table.
         */

        parentsProperties.forEach((parentProperty) => {
          const parentAlias = parentProperty.split(".")[0]
          const parentEntities = entityData[parentAlias] as TData[]

          if (!parentEntities) {
            return
          }

          const parentSchemaObjectRepresentation =
            entitySchemaObjectRepresentation.parents.find((object) => {
              return object.ref.alias === parentAlias
            })!

          if (!parentSchemaObjectRepresentation) {
            return
          }

          parentEntities.forEach((parentEntity) => {
            catalogRelationEntries.push(
              catalogRelationRepository.create({
                parent_id: parentEntity.id,
                parent_name: parentSchemaObjectRepresentation.ref.entity,
                child_id: cleanedEntityData.id,
                child_name: entity,
              })
            )
          })
        })
      })

      catalogRepository.persist(catalogEntries)

      if (catalogRelationEntries.length) {
        catalogRelationRepository.persist(catalogRelationEntries)
      }

      await em.flush()
    })
  }

  protected async onUpdate() {}

  protected async onDelete() {}

  protected async onAttach() {}

  protected async onDetach() {}
}
