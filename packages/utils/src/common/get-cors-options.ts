import type { ConfigModule } from "@medusajs/types"

import getConfigFile from "./get-config-file"

type CorsOptions = {
  origin: string[]
  credentials: boolean
}

const getCorsOptions = (rootDir: string) => {
  const { configModule, configFilePath, error } = getConfigFile<ConfigModule>(
    rootDir,
    "medusa-config.js"
  )

  const corsOptions: {
    admin?: CorsOptions
    store?: CorsOptions
    error?: any
  } = {}

  if (error) {
    return {
      error,
    }
  }

  if (configModule.projectConfig.admin_cors) {
    corsOptions.admin = {
      origin: configModule.projectConfig.admin_cors.split(","),
      credentials: true,
    }
  }

  if (configModule.projectConfig.store_cors) {
    corsOptions.store = {
      origin: configModule.projectConfig.store_cors.split(","),
      credentials: true,
    }
  }

  return corsOptions
}

export default getCorsOptions
