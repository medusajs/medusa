import { CatalogModuleOptions, StorageProvider } from "../types"
import {
  DAL,
  IEventBusModuleService,
  RemoteJoinerQuery,
  Subscriber,
} from "@medusajs/types"
import { remoteQueryObjectFromString } from "@medusajs/utils"

type InjectedDependencies = {
  baseRepository: DAL.RepositoryService
  eventBusModuleService: IEventBusModuleService
  storageProviderCtr: StorageProvider
  storageProviderOptions: any
  remoteQuery: (
    query: string | RemoteJoinerQuery | object,
    variables?: Record<string, unknown>
  ) => Promise<any>
}

export class PostgresProvider {
  protected container_: InjectedDependencies
  protected readonly schemaConfigurationObject_: any
  protected readonly moduleOptions_: CatalogModuleOptions

  protected get remoteQuery_(): (
    query: string | RemoteJoinerQuery | object,
    variables?: Record<string, unknown>
  ) => Promise<any> {
    return this.container_.remoteQuery
  }

  constructor(
    container,
    options: { schemaConfigurationObject: any },
    moduleOptions: CatalogModuleOptions
  ) {
    this.container_ = container
    this.moduleOptions_ = moduleOptions
    this.schemaConfigurationObject_ = options.schemaConfigurationObject
  }

  consumeEvent(configurationObject: any): Subscriber {
    return async (data: any, eventName: string) => {
      const { fields, alias } = configurationObject
      const entityData = await this.remoteQuery_(
        remoteQueryObjectFromString({
          entryPoint: alias,
          variables: {
            filters: {
              id: data.id,
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
