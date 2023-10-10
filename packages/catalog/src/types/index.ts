import {
  ModuleJoinerConfig,
  ModulesSdkTypes,
  Subscriber,
} from "@medusajs/types"

export type ObjectsPartialTree = {
  [key: string]: {
    parents?: string[]
    __joinerConfig: ModuleJoinerConfig
    alias: string
    entity: string
    fields: string[]
    listeners: string[]
  }
}

export interface CatalogModuleOptions {
  customAdapter?: {
    constructor: new (...args: any[]) => any
    options: any
  }
  defaultAdapterOptions?: ModulesSdkTypes.ModuleServiceInitializeOptions
  schema: string
}

export interface StorageProvider {
  new (
    container: { [key: string]: any },
    storageProviderOptions: unknown & { schemaConfigurationObject: any },
    moduleOptions: CatalogModuleOptions
  ): StorageProvider

  query(...args: any[]): unknown
  consumeEvent(configurationObject: any): Subscriber
}
