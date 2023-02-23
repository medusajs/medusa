import { Job, JobsOptions, QueueOptions, WorkerOptions } from "bullmq"
import { RedisOptions } from "ioredis"


export type BullJob<T> = {
  data: {
    eventName: string
    data: T
    completedSubscriberIds: string[] | undefined
  }
} & Job

export type EmitOptions = {
  delay?: number
  attempts: number
  backoff?: {
    type: "fixed" | "exponential"
    delay: number
  }
} & JobsOptions

export type EventBusRedisModuleOptions = {
  queueName?: string
  queueOptions?: QueueOptions
  workerName?: string
  workerOptions?: WorkerOptions
  redisUrl?: string
  redisOptions?: RedisOptions
}
