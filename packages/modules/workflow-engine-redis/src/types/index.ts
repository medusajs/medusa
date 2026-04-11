import { Logger } from "@medusajs/framework/types"
import { QueueOptions, WorkerOptions } from "bullmq"
import { RedisOptions } from "ioredis"

export type InitializeModuleInjectableDependencies = {
  logger?: Logger
}

/**
 * Module config type for the Redis Workflow Engine.
 *
 * The workflow engine uses three queues internally:
 * - **Main queue**: Handles workflow retries, step timeouts, and transaction timeouts
 * - **Job queue**: Handles scheduled workflow job execution
 * - **Cleaner queue**: Handles periodic cleanup of expired workflow executions
 *
 * You can configure shared options that apply to all queues/workers, or provide
 * per-queue overrides for fine-grained control.
 *
 * @example
 * ```ts
 * // Simple configuration - same options for all queues
 * {
 *   redisUrl: "redis://localhost:6379",
 *   queueOptions: { defaultJobOptions: { removeOnComplete: 1000 } },
 *   workerOptions: { concurrency: 10 }
 * }
 * ```
 *
 * @example
 * ```ts
 * // Advanced configuration - per-queue overrides
 * {
 *   redisUrl: "redis://localhost:6379",
 *   // Shared defaults
 *   workerOptions: { concurrency: 10 },
 *   // Override for job queue (scheduled workflows)
 *   jobWorkerOptions: { concurrency: 5 },
 *   // Override for cleaner (low priority)
 *   cleanerWorkerOptions: { concurrency: 1 }
 * }
 * ```
 */
export type RedisWorkflowsOptions = {
  /**
   * Redis connection string
   * @deprecated Use `redisUrl` instead for consistency with other modules
   */
  url?: string

  /**
   * Redis connection string
   */
  redisUrl?: string

  /**
   * Name for the main workflow queue that handles retries, step timeouts,
   * and transaction timeouts.
   * @default "medusa-workflows"
   */
  queueName?: string

  /**
   * Name for the job queue that handles scheduled workflow execution.
   * @default "medusa-workflows-jobs"
   */
  jobQueueName?: string

  /**
   * Redis client options
   * @deprecated Use `redisOptions` instead for consistency with other modules
   */
  options?: RedisOptions

  /**
   * Redis client options passed to ioredis
   * @see https://github.com/redis/ioredis#connect-to-redis
   */
  redisOptions?: RedisOptions

  /*
   * =========================================================================
   * Shared Queue/Worker Options
   * =========================================================================
   * These options apply to all queues and workers unless overridden by
   * per-queue specific options below.
   */

  /**
   * Default options for all BullMQ Queue instances.
   * Can be overridden per-queue using `mainQueueOptions`, `jobQueueOptions`,
   * or `cleanerQueueOptions`.
   * @see https://api.docs.bullmq.io/interfaces/v5.QueueOptions.html
   */
  queueOptions?: Omit<QueueOptions, "connection">

  /**
   * Default options for all BullMQ Worker instances.
   * Can be overridden per-worker using `mainWorkerOptions`, `jobWorkerOptions`,
   * or `cleanerWorkerOptions`.
   * @see https://api.docs.bullmq.io/interfaces/v5.WorkerOptions.html
   */
  workerOptions?: Omit<WorkerOptions, "connection">

  /*
   * =========================================================================
   * Per-Queue Options (Main Queue)
   * =========================================================================
   * The main queue handles workflow retries, step timeouts, and transaction
   * timeouts. These are critical real-time operations.
   */

  /**
   * Options specific to the main workflow queue.
   * Overrides `queueOptions` for this queue only.
   * @see https://api.docs.bullmq.io/interfaces/v5.QueueOptions.html
   */
  mainQueueOptions?: Omit<QueueOptions, "connection">

  /**
   * Options specific to the main workflow worker.
   * Overrides `workerOptions` for this worker only.
   * @see https://api.docs.bullmq.io/interfaces/v5.WorkerOptions.html
   */
  mainWorkerOptions?: Omit<WorkerOptions, "connection">

  /*
   * =========================================================================
   * Per-Queue Options (Job Queue)
   * =========================================================================
   * The job queue handles scheduled workflow execution. You may want different
   * concurrency settings for scheduled vs real-time workflows.
   */

  /**
   * Options specific to the job queue (scheduled workflows).
   * Overrides `queueOptions` for this queue only.
   * @see https://api.docs.bullmq.io/interfaces/v5.QueueOptions.html
   */
  jobQueueOptions?: Omit<QueueOptions, "connection">

  /**
   * Options specific to the job worker (scheduled workflows).
   * Overrides `workerOptions` for this worker only.
   * @see https://api.docs.bullmq.io/interfaces/v5.WorkerOptions.html
   */
  jobWorkerOptions?: Omit<WorkerOptions, "connection">

  /*
   * =========================================================================
   * Per-Queue Options (Cleaner Queue)
   * =========================================================================
   * The cleaner queue runs periodically (every 30 minutes) to remove expired
   * workflow executions. This is a low-priority background task.
   */

  /**
   * Options specific to the cleaner queue.
   * Overrides `queueOptions` for this queue only.
   * @see https://api.docs.bullmq.io/interfaces/v5.QueueOptions.html
   */
  cleanerQueueOptions?: Omit<QueueOptions, "connection">

  /**
   * Options specific to the cleaner worker.
   * Overrides `workerOptions` for this worker only.
   * @see https://api.docs.bullmq.io/interfaces/v5.WorkerOptions.html
   */
  cleanerWorkerOptions?: Omit<WorkerOptions, "connection">

  /**
   * Optional separate connection string and options for pub/sub.
   * If not provided, uses the main Redis connection.
   */
  pubsub?: {
    url: string
    options?: RedisOptions
  }
}

declare module "@medusajs/types" {
  interface ModuleOptions {
    "@medusajs/workflow-engine-redis": RedisWorkflowsOptions
    "@medusajs/medusa/workflow-engine-redis": RedisWorkflowsOptions
  }
}
