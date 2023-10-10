import { ModulesSdkTypes, Subscriber } from "@medusajs/types"

/**
 * Represents the module options that can be provided
 */
export interface CatalogModuleOptions {
  customAdapter?: {
    constructor: new (...args: any[]) => any
    options: any
  }
  defaultAdapterOptions?: ModulesSdkTypes.ModuleServiceInitializeOptions
  schema: string
}

/**
 * Represents the schema object representation once the schema has been processed
 */
export type SchemaObjectRepresentation = {
  [key: string]: {
    fields: string[]
    listeners: string[]
    alias: string
  }
}

/**
 * Represents the storage provider interface, TODO: move this to @medusajs/types once we are settled on the interface
 */
export interface StorageProvider {
  new (
    container: { [key: string]: any },
    storageProviderOptions: unknown & {
      schemaConfigurationObject: SchemaObjectRepresentation
    },
    moduleOptions: CatalogModuleOptions
  ): StorageProvider

  query(...args: any[]): unknown
  consumeEvent(configurationObject: any): Subscriber
}
