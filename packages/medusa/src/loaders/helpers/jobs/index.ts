import { MedusaContainer } from "@medusajs/types"
import { readdir } from "fs/promises"
import { join } from "path"
import JobSchedulerService from "../../../services/job-scheduler"
import logger from "../../logger"

type ScheduledJobConfig = {
  name: string
  cron_schedule: string
  data?: Record<string, unknown>
  keep_existing?: boolean
}

type ScheduledJobHandler = (
  container: MedusaContainer,
  pluginOptions: Record<string, unknown>
) => Promise<void>

type ScheduledJobModule = {
  config: ScheduledJobConfig
  handler: ScheduledJobHandler
}

export default class ScheduledJobsRegistrar {
  protected container_: MedusaContainer
  protected pluginOptions_: Record<string, unknown>
  protected rootDir_: string
  protected excludes: RegExp[] = [
    /\.DS_Store/,
    /(\.ts\.map|\.js\.map|\.d\.ts)/,
    /^_[^/\\]*(\.[^/\\]+)?$/,
  ]

  protected jobDescriptors_: Map<string, ScheduledJobModule> = new Map()

  constructor(
    rootDir: string,
    container: MedusaContainer,
    options: Record<string, unknown> = {}
  ) {
    this.rootDir_ = rootDir
    this.pluginOptions_ = options
    this.container_ = container
  }

  private validateJob(job: any): job is {
    default: ScheduledJobHandler
    config: ScheduledJobConfig
  } {
    const handler = job.default

    if (!handler || typeof handler !== "function") {
      /**
       * If the handler is not a function, we can't use it
       */
      return false
    }

    const config = job.config

    if (!config) {
      /**
       * If the job is missing a config, we can't use it
       */
      logger.warn(`The job is missing a config. Skipping registration.`)
      return false
    }

    if (!config.cron_schedule) {
      /**
       * If the job is missing a cron_schedule, we can't use it
       */
      logger.warn(`The job is missing a cron_schedule. Skipping registration.`)
      return false
    }

    if (!config.name) {
      /**
       * If the job is missing a name, we can't use it
       */
      logger.warn(`The job is missing a name. Skipping registration.`)
      return false
    }

    return true
  }

  private async createDescriptor(absolutePath: string, entry: string) {
    return await import(absolutePath).then((module_) => {
      const isValid = this.validateJob(module_)

      if (!isValid) {
        return
      }

      this.jobDescriptors_.set(absolutePath, {
        config: module_.config,
        handler: module_.default,
      })
    })
  }

  private async createMap(dirPath: string) {
    await Promise.all(
      await readdir(dirPath, { withFileTypes: true }).then(async (entries) => {
        return entries
          .filter((entry) => {
            if (
              this.excludes.length &&
              this.excludes.some((exclude) => exclude.test(entry.name))
            ) {
              return false
            }

            return true
          })
          .map(async (entry) => {
            const fullPath = join(dirPath, entry.name)

            if (entry.isDirectory()) {
              return this.createMap(fullPath)
            }

            return await this.createDescriptor(fullPath, entry.name)
          })
      })
    )
  }

  private async runJobs() {
    const jobs = Array.from(this.jobDescriptors_.values())

    if (!jobs.length) {
      return
    }

    const jobSchedulerService: JobSchedulerService = this.container_.resolve(
      "jobSchedulerService"
    )

    for (const job of jobs) {
      const {
        name,
        data = {},
        cron_schedule,
        keep_existing = false,
      } = job.config

      const handler = async () => {
        await job.handler(this.container_, this.pluginOptions_)
      }

      await jobSchedulerService.create(name, data, cron_schedule, handler, {
        keepExisting: keep_existing,
      })
    }
  }

  async load(): Promise<void> {
    let hasJobsDir = false

    try {
      await readdir(this.rootDir_)
      hasJobsDir = true
    } catch (_err) {
      hasJobsDir = false
    }

    if (!hasJobsDir) {
      return
    }

    await this.createMap(this.rootDir_)

    await this.runJobs()
  }
}
