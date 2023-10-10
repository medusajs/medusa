import {
  IEventBusModuleService,
  RemoteJoinerQuery,
  Subscriber,
} from "@medusajs/types"
import { remoteQueryObjectFromString } from "@medusajs/utils"
import { EntityManager } from "@mikro-orm/postgresql"
import { CatalogRepository } from "@repositories"
import {
  CatalogModuleOptions,
  QueryFormat,
  QueryOptions,
  SchemaObjectRepresentation,
  StorageProvider,
} from "../types"
import { QueryBuilder } from "../utils"

type InjectedDependencies = {
  catalogRepository: CatalogRepository
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

  consumeEvent(configurationObject: SchemaObjectRepresentation[0]): Subscriber {
    return async (data: unknown, eventName: string) => {
      const data_ = data as Record<string, unknown>
      let ids: string[] = []

      if ("id" in data_) {
        ids = [data_.id as string]
      } else if ("ids" in data_) {
        ids = data_.ids as string[]
      }

      const { fields, alias } = configurationObject
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
    }
  }

  protected async onCreate() {}

  protected async onUpdate() {}

  protected async onDelete() {}

  protected async onAttach() {}

  protected async onDetach() {}
}
