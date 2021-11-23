import dotenv from "dotenv"
import { getConfigFile } from "medusa-core-utils"
import path from "path"
import Logger from "../loaders/logger"

// Set the NODE_ENV to 'development' by default
process.env.NODE_ENV = process.env.NODE_ENV || "development"

const envFound = dotenv.config()
if (!envFound) {
  // This error should crash whole process
  throw new Error("⚠️  Couldn't find .env file  ⚠️")
}

const { configModule } = getConfigFile(path.resolve("."), `medusa-config`)

const isProd = process.env.NODE_ENV === "production"
if (!configModule?.projectConfig?.jwt_secret && isProd) {
  Logger.warn("jwt_secret in medusa-config.js is required in production")
}

if (!configModule?.projectConfig?.cookie_secret && isProd) {
  Logger.warn("cookie_secret in medusa-config.js is required in production")
}

const jwtSecret = configModule?.projectConfig?.jwt_secret || "test"
const cookieSecret = configModule?.projectConfig?.cookie_secret || "test"

const config = {
  /**
   * Your favorite port
   */
  port: parseInt(process.env.PORT, 10),

  databaseURL: process.env.MONGODB_URI,
  redisURI: process.env.REDIS_URI,

  /**
   * Your secret sauce
   */
  jwtSecret,
  cookieSecret,

  /**
   * Used by winston logger
   */
  logs: {
    level: process.env.LOG_LEVEL || "silly",
  },

  /**
   * API configs
   */
  api: {
    prefix: "/api",
  },
}

export default config
