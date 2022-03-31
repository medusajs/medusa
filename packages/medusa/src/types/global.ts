import { AwilixContainer } from "awilix"
import { Logger as _Logger } from "winston"

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

    jwtSecret: string
    cookieSecret: string

    database_url?: string
    database_type: string
    database_extra?: Record<string, unknown> & {
      ssl: { rejectUnauthorized: false }
    }
    store_cors: string
    admin_cors: string
  }
  plugins: {
    resolve: string
    options: Record<string, unknown>
  }[]
}
