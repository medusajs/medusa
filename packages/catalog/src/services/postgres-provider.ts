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
import { EntityRepository, GetRepository } from "@mikro-orm/core"

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

  protected readonly catalogRepository_: GetRepository<
    Catalog,
    EntityRepository<Catalog>
  >
  protected readonly catalogRelationRepository_: GetRepository<
    CatalogRelation,
    EntityRepository<CatalogRelation>
  >

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
    this.catalogRepository_ = this.container_.manager.getRepository(Catalog)
    this.catalogRelationRepository_ =
      this.container_.manager.getRepository(CatalogRelation)
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
    schemaObjectRepresentation: SchemaObjectRepresentation[0]
  ): Subscriber {
    return async (data: unknown, eventName: string) => {
      const data_ = data as Record<string, unknown>
      let ids: string[] = []

      if ("id" in data_) {
        ids = [data_.id as string]
      } else if ("ids" in data_) {
        ids = data_.ids as string[]
      }

      const { fields, alias } = schemaObjectRepresentation
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

      // Call the appropriate method based on the event name
      console.log(JSON.stringify(entityData, null, 2))

      const argument = {
        entity: schemaObjectRepresentation.entity,
        data: entityData,
        schemaObjectRepresentation,
      }

      const action = eventName.split(".").pop()

      switch (action) {
        case "created":
          await this.onCreate(argument)
      }
    }
  }

  protected async onCreate({
    entity,
    data,
    schemaObjectRepresentation,
  }: {
    entity: string
    data: { id: string; [key: string]: unknown }[]
    schemaObjectRepresentation: SchemaObjectRepresentation[0]
  }) {
    const data_ = Array.isArray(data) ? data : [data]

    const entityProperties: string[] = []
    const parentsProperties: string[] = []

    schemaObjectRepresentation.fields.forEach((field) => {
      if (field.includes(".")) {
        parentsProperties.push(field)
      } else {
        entityProperties.push(field)
      }
    })

    const catalogEntries: Catalog[] = []
    const catalogRelationEntries: CatalogRelation[] = []

    data_.forEach((entityData) => {
      const catalogEntry = this.catalogRepository_.create({
        id: entityData.id as string,
        name: entity,
        data: entityData,
      })

      catalogEntries.push(catalogEntry)
    })

    /*const parentsToAttachTo = parentsProperties.map((parentProperty) => {
      const [parent, property] = parentProperty.split(".")
      const parentData = data_[0][parent]

      return {
        parent,
        property,
        parentData,
      }
    }*/
  }

  protected async onUpdate() {}

  protected async onDelete() {}

  protected async onAttach() {}

  protected async onDetach() {}
}
