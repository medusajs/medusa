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

    const sql = qb.buildQuery()
    const resultset = await connection.execute(sql)
    return qb.buildObjectFromResultset(resultset)
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
      const catalogRelationRepository = em.getRepository(CatalogRelation)

      const data_ = Array.isArray(data) ? data : [data]

      const entityProperties: string[] = []
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
         * Retrieve the parents and create catalog relation entries to attach the entity to its parents.
         * The entity can have multiple parents, but we need to ensure that we have the data of the parent
         * we find before creating the catalog relation entry. Theoratically, at this moment
         * the parent catalog entry should be present in the catalog table.
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

  protected async onAttach() {
    /**
     * Get the module config
     * find the modules primary and foreign
     * look at the linkable keys and grab the entity.
     */
  }

  protected async onDetach() {}
}
