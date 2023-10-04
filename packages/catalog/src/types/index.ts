import { ModuleJoinerConfig, ModulesSdkTypes } from "@medusajs/types"

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
  objects: {
    parents?: string[]
    entity: string
    fields: string[]
    listeners: string[]
  }[]
}

export interface StorageProvider {
  store: (objects: object) => Promise<void>
}
