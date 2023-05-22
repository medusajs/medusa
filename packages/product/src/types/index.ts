import { Constructor, DAL } from "@medusajs/types"

export type ProductServiceInitializeOptions = {
  database: {
    clientUrl: string
    schema?: string
    driverOptions?: Record<string, unknown>
  }
}

export type ProductServiceInitializeCustomDataLayerOptions = {
  manager?: any
  repositories?: { [key: string]: Constructor<DAL.RepositoryService> }
}
