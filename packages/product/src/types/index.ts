import { RepositoryService } from "./dal/repository-service"

export type ProductServiceInitializeOptions = {
  database?: {
    clientUrl: string
    schema?: string
    driverOptions?: Record<string, unknown>
  }
  customDataLayer: {
    manager?: any
    repositories?: {
      productRepository: RepositoryService<any>
      productTagRepository: RepositoryService<any>
      productCollectionRepository: RepositoryService<any>
      productVariantRepository: RepositoryService<any>
    }
  }
}

export { RepositoryService, FindOptions } from "./dal/repository-service"
