import { Logger } from "@medusajs/types"
import { RedisOptions } from "ioredis"

export type InitializeModuleInjectableDependencies = {
  logger?: Logger
}

/**
 * Module config type
 */
export type RedisWorkflowsOptions = {
  /**
   * Redis connection string
   */
  url?: string

  /**
   * Queue name used for retries and timeouts
   */
  queueName?: string

  /**
   * Redis client options
   */
  options?: RedisOptions

  /**
   * Optiona connection string and options to pub/sub
   */
  pubsub?: {
    url: string
    options?: RedisOptions
  }
}
