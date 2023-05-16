import { RepositoryService } from "./dal/repository-service"
import { Constructor } from "@medusajs/types"

export type ProductServiceInitializeOptions = {
  database?: {
    clientUrl: string
    schema?: string
    driverOptions?: Record<string, unknown>
  }
  customDataLayer?: {
    manager?: any
    repositories?: {
      productRepository: Constructor<RepositoryService<any>>
      productTagRepository: Constructor<RepositoryService<any>>
      productCollectionRepository: Constructor<RepositoryService<any>>
      productVariantRepository: Constructor<RepositoryService<any>>
    }
  }
}

export { RepositoryService, FindOptions } from "./dal/repository-service"
