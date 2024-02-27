import { MedusaContainer } from "@medusajs/types"

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
}

export type ScheduledJobArgs<T = unknown> = {
  container: MedusaContainer
  data?: T
  pluginOptions?: Record<string, unknown>
}
