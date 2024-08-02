import {
  createStep,
  createWorkflow,
  StepResponse,
} from "@medusajs/workflows-sdk"
import { isObject, MedusaError, promiseAll } from "@medusajs/utils"
import { SchedulerOptions } from "@medusajs/orchestration"
import { MedusaContainer } from "@medusajs/types"
import { logger } from "../logger"
import { access, readdir } from "fs/promises"
import { join } from "path"

type CronJobConfig = {
  name: string
  schedule: string
  numberOfExecutions?: SchedulerOptions["numberOfExecutions"]
}

type CronJobHandler = (container: MedusaContainer) => Promise<any>

export class JobLoader {
  /**
   * The directory from which to load the jobs
   * @private
   */
  #sourceDir: string | string[]

  /**
   * The list of file names to exclude from the subscriber scan
   * @private
   */
  #excludes: RegExp[] = [
    /index\.js/,
    /index\.ts/,
    /\.DS_Store/,
    /(\.ts\.map|\.js\.map|\.d\.ts|\.md)/,
    /^_[^/\\]*(\.[^/\\]+)?$/,
  ]

  constructor(sourceDir: string | string[]) {
    this.#sourceDir = sourceDir
  }

  /**
   * Validate cron job configuration
   * @param config
   * @protected
   */
  protected validateConfig(config: {
    schedule: string | SchedulerOptions
    name: string
  }) {
    if (!config) {
      throw new MedusaError(
        MedusaError.Types.INVALID_ARGUMENT,
        "Config is required for scheduled jobs."
      )
    }

    if (!config.schedule) {
      throw new MedusaError(
        MedusaError.Types.INVALID_ARGUMENT,
        "Cron schedule definition is required for scheduled jobs."
      )
    }

    if (!config.name) {
      throw new MedusaError(
        MedusaError.Types.INVALID_ARGUMENT,
        "Job name is required for scheduled jobs."
      )
    }
  }

  /**
   * Create a workflow to register a new cron job
   * @param config
   * @param handler
   * @protected
   */
  protected registerJob({
    config,
    handler,
  }: {
    config: CronJobConfig
    handler: CronJobHandler
  }) {
    const workflowName = `job-${config.name}`
    const step = createStep(
      `${config.name}-as-step`,
      async (_, stepContext) => {
        const { container } = stepContext
        try {
          const res = await handler(container)
          return new StepResponse(res, res)
        } catch (error) {
          logger.error(
            `Scheduled job ${config.name} failed with error: ${error.message}`
          )
          throw error
        }
      }
    )

    const workflowConfig = {
      name: workflowName,
      schedule: isObject(config.schedule)
        ? config.schedule
        : {
            cron: config.schedule,
            numberOfExecutions: config.numberOfExecutions,
          },
    }

    createWorkflow(workflowConfig, () => {
      step()
    })
  }

  /**
   * Load cron jobs from one or multiple source paths
   */
  async load() {
    const normalizedSourcePath = Array.isArray(this.#sourceDir)
      ? this.#sourceDir
      : [this.#sourceDir]

    const promises = normalizedSourcePath.map(async (sourcePath) => {
      try {
        await access(sourcePath)
      } catch {
        logger.info(`No job to load from ${sourcePath}. skipped.`)
        return
      }

      return await readdir(sourcePath, {
        recursive: true,
        withFileTypes: true,
      }).then(async (entries) => {
        const fileEntries = entries.filter((entry) => {
          return (
            !entry.isDirectory() &&
            !this.#excludes.some((exclude) => exclude.test(entry.name))
          )
        })

        logger.debug(`Registering jobs from ${sourcePath}.`)

        return await promiseAll(
          fileEntries.map(async (entry) => {
            const fullPath = join(entry.path, entry.name)

            const module_ = await import(fullPath)

            const input = {
              config: module_.config,
              handler: module_.default,
            }

            this.validateConfig(input.config)
            return input
          })
        )
      })
    })

    const jobsInputs = await promiseAll(promises)
    const flatJobsInput = jobsInputs.flat(1).filter(
      (
        job
      ): job is {
        config: CronJobConfig
        handler: CronJobHandler
      } => !!job
    )

    flatJobsInput.map(this.registerJob)

    logger.debug(`Job registered.`)
  }
}
