export type ProductServiceInitializeOptions = {
  database: {
    clientUrl: string
    schema?: string
    driverOptions?: Record<string, unknown>
  }
}

export { RepositoryService, GenericFindOptions } from "./dal/repository-service"
