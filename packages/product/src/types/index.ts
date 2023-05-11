export type ProductServiceInitializeOptions = {
  database: {
    clientUrl: string
    schema?: string
    driverOptions?: Record<string, unknown>
  }
}

export { RepositoryService, FindOptions } from "./dal/repository-service"
