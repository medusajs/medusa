import {
  ProductServiceInitializeCustomDataLayerOptions,
  ProductServiceInitializeOptions,
} from "../types"
import { MedusaError } from "@medusajs/utils"

function getEnv(key: string): string {
  const value = process.env[`PRODUCT_${key}`] ?? process.env[`${key}`]
  return value ?? ""
}

function isProductServiceInitializeOptions(
  obj: unknown
): obj is ProductServiceInitializeOptions {
  return !!(obj as ProductServiceInitializeOptions)?.database
}

function getDefaultDriverOptions(
  clientUrl: string
): ProductServiceInitializeOptions["database"]["driverOptions"] {
  const localOptions = {
    connection: {
      ssl: false,
    },
  }

  const remoteOptions = {
    connection: {
      ssl: {
        rejectUnauthorized: false,
      },
    },
  }

  if (clientUrl) {
    return clientUrl.match(/localhost/i) ? localOptions : remoteOptions
  }

  return process.env.NODE_ENV?.match(/prod/i)
    ? remoteOptions
    : process.env.NODE_ENV?.match(/dev/i)
    ? localOptions
    : {}
}

/**
 * Load the config for the database connection. The options can be retrieved
 * through PRODUCT_* (e.g PRODUCT_POSTGRES_URL) or * (e.g POSTGRES_URL) environment variables or the options object.
 * @param options
 */
export function loadDatabaseConfig(
  options?:
    | ProductServiceInitializeOptions
    | ProductServiceInitializeCustomDataLayerOptions
): ProductServiceInitializeOptions["database"] {
  const clientUrl = getEnv("POSTGRES_URL")

  const database: ProductServiceInitializeOptions["database"] = {
    clientUrl: getEnv("POSTGRES_URL"),
    schema: getEnv("POSTGRES_SCHEMA") ?? "public",
    driverOptions: JSON.parse(
      getEnv("POSTGRES_DRIVER_OPTIONS") ||
        JSON.stringify(getDefaultDriverOptions(clientUrl))
    ),
  }

  if (isProductServiceInitializeOptions(options)) {
    database.clientUrl = options.database.clientUrl ?? database.clientUrl
    database.schema = options.database.schema ?? database.schema
    database.driverOptions =
      options.database.driverOptions ??
      getDefaultDriverOptions(database.clientUrl)
  }

  if (!database.clientUrl) {
    throw new MedusaError(
      MedusaError.Types.INVALID_ARGUMENT,
      "No database clientUrl provided. Please provide the clientUrl through the PRODUCT_POSTGRES_URL or POSTGRES_URL environment variable or the options object in the initialize function."
    )
  }
  return database
}
