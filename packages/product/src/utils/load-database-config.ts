import {
  ProductServiceInitializeCustomDataLayerOptions,
  ProductServiceInitializeOptions,
} from "../types"
import { Modules } from "@medusajs/modules-sdk"

function getEnv(key: string): string {
  const value =
    process.env[`${Modules.PRODUCT}_${key}`] ?? process.env[`${key}`]
  return value ?? ""
}

function isProductServiceInitializeOptions(
  obj: unknown
): obj is ProductServiceInitializeOptions {
  return (obj as ProductServiceInitializeOptions).database !== undefined
}

export function loadDatabaseConfig(
  options?:
    | ProductServiceInitializeOptions
    | ProductServiceInitializeCustomDataLayerOptions
): ProductServiceInitializeOptions["database"] {
  const database: ProductServiceInitializeOptions["database"] = {
    clientUrl: getEnv("POSTGRES_URL"),
    schema: getEnv("POSTGRES_SCHEMA"),
    driverOptions: JSON.parse(getEnv("POSTGRES_DRIVER_OPTIONS") || "{}"),
  }

  if (isProductServiceInitializeOptions(options)) {
    database.clientUrl = options.database.clientUrl ?? database.clientUrl
    database.schema = options.database.schema ?? database.schema
    database.driverOptions = options.database.driverOptions ?? {}
  }

  return database
}
