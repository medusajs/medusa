import { MedusaContainer } from "@medusajs/types"
import { DefaultJobOptions } from "bullmq"

export type ScheduledJobOptions = DefaultJobOptions

export type ScheduledJobConfig<T = unknown> = {
  /**
   * The name of the job
   */
  name: string
  /**
   * The cron schedule of the job, e.g. `0 0 * * *` for running every day at midnight.
   */
  schedule: string
  /**
   * An optional data object to pass to the job handler
   */
  data?: T
  /**
   * The options of the job
   */
  options: ScheduledJobOptions
}

export type ScheduledJobArgs<T = unknown> = {
  container: MedusaContainer
  data?: T
  pluginOptions?: Record<string, unknown>
}
