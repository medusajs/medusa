import { AwilixContainer } from "awilix"
import { Logger as _Logger } from "winston"
import { LoggerOptions } from "typeorm"
import { Customer, User } from "../models"

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: User | Customer
      scope: MedusaContainer
    }
  }
}

export type ClassConstructor<T> = {
  new (...args: unknown[]): T
}

export type MedusaContainer = AwilixContainer & {
  registerAdd: <T>(name: string, registration: T) => MedusaContainer
}

export type Logger = _Logger & {
  progress: (activityId: string, msg: string) => void
}

export type sslInterface =
{
  ca:string|undefined
  rejectUnauthorized:boolean|undefined
}

export type ConfigModule = {
  projectConfig: {
    redis_url?: string

    jwt_secret?: string
    cookie_secret?: string
    database_host?:string|undefined
    database_port?:number|undefined
    database_ssl?:sslInterface|undefined,
    database_username?:string|undefined,
    database_password?: string | (() => string) | (() => Promise<string>),
    

    database_url?: string|undefined
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
