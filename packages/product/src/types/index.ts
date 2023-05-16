import { RepositoryService } from "./dal/repository-service"
import { Constructor } from "@medusajs/types"

export type ProductServiceInitializeOptions = {
  database: {
    clientUrl: string
    schema?: string
    driverOptions?: Record<string, unknown>
  }
}

export type ProductServiceInitializeCustomDataLayerOptions = {
  manager?: any
  repositories?: { [key: string]: Constructor<RepositoryService<any>> }
}

export { RepositoryService, FindOptions } from "./dal/repository-service"
