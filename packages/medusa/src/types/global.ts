import { CommonTypes } from "@medusajs/types"
import { Request } from "express"
import { MedusaContainer as coreMedusaContainer } from "medusa-core-utils"
import { Customer, User } from "../models"
import { FindConfig, RequestQueryFields } from "./common"

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: (User | Customer) & { customer_id?: string; userId?: string }
      scope: MedusaContainer
      validatedQuery: RequestQueryFields & Record<string, unknown>
      validatedBody: unknown
      listConfig: FindConfig<unknown>
      retrieveConfig: FindConfig<unknown>
      filterableFields: Record<string, unknown>
      allowedProperties: string[]
      includes?: Record<string, boolean>
      errors: string[]
    }
  }
}

export type ExtendedRequest<TEntity> = Request & { resource: TEntity }

export type ClassConstructor<T> = {
  new (...args: unknown[]): T
}

export type MedusaContainer = coreMedusaContainer

export type Logger = {
  panic: (data) => void
  shouldLog: (level: string) => void
  setLogLevel: (level: string) => void
  unsetLogLevel: () => void
  activity: (message: string, config?) => void
  progress: (activityId, message) => void
  error: (messageOrError, error?) => void
  failure: (activityId, message) => void
  success: (activityId, message) => void
  debug: (message) => void
  info: (message) => void
  warn: (message) => void
  log: (...args) => void
}

export type Constructor<T> = new (...args: any[]) => T

export type ConfigModule = CommonTypes.ConfigModule
