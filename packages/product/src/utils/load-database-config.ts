import {
  ProductServiceInitializeCustomDataLayerOptions,
  ProductServiceInitializeOptions,
} from "../types"

function getEnv(key: string): string {
  const value = process.env[`PRODUCT_${key}`] ?? process.env[`${key}`]
  return value ?? ""
}

function isProductServiceInitializeOptions(
  obj: unknown
): obj is ProductServiceInitializeOptions {
  return !!(obj as ProductServiceInitializeOptions).database
}

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
    database.driverOptions = options.database.driverOptions ?? {}
  }

  return database
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
