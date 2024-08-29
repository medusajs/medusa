import {
  BulkJobOptions,
  Job,
  JobsOptions,
  QueueOptions,
  WorkerOptions,
} from "bullmq"
import { RedisOptions } from "ioredis"

export type JobData<T> = {
  eventName: string
  data: T
  completedSubscriberIds?: string[] | undefined
}

export type Options = BulkJobOptions & {
  groupedEventsTTL?: number
  internal?: boolean
}

export type BullJob<T> = {
  data: JobData<T>
  opts: Job["opts"] & Options
} & Job

export type EmitOptions = JobsOptions

export type EventBusRedisModuleOptions = {
  queueName?: string
  queueOptions?: QueueOptions

  workerOptions?: WorkerOptions

  redisUrl?: string
  redisOptions?: RedisOptions

  /**
   * Global options passed to all `EventBusService.emit` in the core as well as your own emitters. The options are forwarded to Bull's `Queue.add` method.
   *
   * The global options can be overridden by passing options to `EventBusService.emit` directly.
   *
   * Example
   * ```js
   * {
   *    removeOnComplete: { age: 10 },
   * }
   * ```
   *
   * @see https://api.docs.bullmq.io/interfaces/BaseJobOptions.html
   */
  jobOptions?: EmitOptions
}
