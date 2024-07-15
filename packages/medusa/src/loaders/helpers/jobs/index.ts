import { MedusaContainer } from "@medusajs/types"
import { readdir } from "fs/promises"
import { join } from "path"
import JobSchedulerService from "../../../services/job-scheduler"
import {
  ScheduledJobArgs,
  ScheduledJobConfig,
} from "../../../types/scheduled-jobs"
import logger from "../../logger"

type ScheduledJobHandler = (args: ScheduledJobArgs) => Promise<void>

type ScheduledJobModule = {
  config: ScheduledJobConfig
  handler: ScheduledJobHandler
}

export default class ScheduledJobsLoader {
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

  private validateJob(
    job: any,
    path: string
  ): job is {
    default: ScheduledJobHandler
    config: ScheduledJobConfig
  } {
    const handler = job.default

    if (!handler || typeof handler !== "function") {
      logger.warn(`The job in ${path} is not a function.`)
      return false
    }

    const config = job.config

    if (!config) {
      logger.warn(`The job in ${path} is missing a config.`)
      return false
    }

    if (!config.schedule) {
      logger.warn(`The job in ${path} is missing a schedule.`)
      return false
    }

    if (!config.name) {
      logger.warn(`The job in ${path} is missing a name.`)
      return false
    }

    if (config.data && typeof config.data !== "object") {
      logger.warn(`The job data in ${path} is not an object.`)
      return false
    }

    return true
  }

  private async createDescriptor(absolutePath: string, entry: string) {
    return await import(absolutePath).then((module_) => {
      const isValid = this.validateJob(module_, absolutePath)

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

  private async createScheduledJobs() {
    const jobs = Array.from(this.jobDescriptors_.values())

    if (!jobs.length) {
      return
    }

    const jobSchedulerService: JobSchedulerService = this.container_.resolve(
      "jobSchedulerService"
    )

    for (const job of jobs) {
      try {
        const { name, data, schedule, options } = job.config

        const handler = async () => {
          await job.handler({
            container: this.container_,
            data,
            pluginOptions: this.pluginOptions_,
          })
        }

        await jobSchedulerService.create(name, data, schedule, handler, {
          keepExisting: false, // For now, we do not support changing this flag
          ...options,
        })
      } catch (err) {
        logger.error(
          `An error occurred while registering job ${job.config.name}`,
          err
        )
      }
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

    await this.createScheduledJobs()
  }
}
