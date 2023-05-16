export type ProductServiceInitializeOptions = {
  database?: {
    clientUrl: string
    schema?: string
    driverOptions?: Record<string, unknown>
  }
  customDataLayer: {
    manager?: any
    repositories?: {
      productRepository: any
      productTagRepository: any
      productCollectionRepository: any
      productVariantRepository: any
    }
  }
}

export { RepositoryService, FindOptions } from "./dal/repository-service"
