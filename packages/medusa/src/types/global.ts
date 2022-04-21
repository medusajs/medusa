import { AwilixContainer } from "awilix"
import { Logger as _Logger } from "winston"
import { LoggerOptions } from "typeorm"

export type ClassConstructor<T> = {
  new (...args: unknown[]): T
}

export type MedusaContainer = AwilixContainer & {
  registerAdd: <T>(name: string, registration: T) => MedusaContainer
}

export type Logger = _Logger & {
  progress: (activityId: string, msg: string) => void
}

export type ConfigModule = {
  projectConfig: {
    redis_url?: string
    /**
     * The redis options for the version 4.28.2 can be found [here](https://github.com/luin/ioredis/blob/v4.28.2/API.md#new_Redis)
     */
    redis_options?: Record<string, unknown>

    jwt_secret?: string
    cookie_secret?: string

    database_url?: string
    database_type: string
    database_database?: string
    database_logging: LoggerOptions

    database_extra?: Record<string, unknown> & {
      ssl: { rejectUnauthorized: false }
    }
    store_cors?: string
    admin_cors?: string
  }
  plugins: (
    | {
        resolve: string
        options: Record<string, unknown>
      }
    | string
  )[]
}
