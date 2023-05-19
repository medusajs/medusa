import { RepositoryService } from "./dal/repository-service"
import { Constructor } from "@medusajs/types"

export type ProductServiceInitializeOptions = {
  database: {
    clientUrl: string
    schema?: string
    driverOptions?: Record<string, unknown>
  }
  injectedDependencies?: { [key: string]: any }
}

export type ProductServiceInitializeCustomDataLayerOptions = {
  manager?: any
  repositories?: { [key: string]: Constructor<RepositoryService> }
  injectedDependencies?: { [key: string]: any }
}

export { RepositoryService, FindOptions } from "./dal/repository-service"
