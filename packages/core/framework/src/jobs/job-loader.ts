import type { SchedulerOptions } from "@medusajs/orchestration"
import { MedusaContainer } from "@medusajs/types"
import {
  dynamicImport,
  isFileSkipped,
  isObject,
  MedusaError,
  registerDevServerResource,
} from "@medusajs/utils"
import {
  createStep,
  createWorkflow,
  StepResponse,
} from "@medusajs/workflows-sdk"
import { ResourceLoader } from "../utils/resource-loader"

type CronJobConfig = {
  name: string
  schedule: string | SchedulerOptions
  numberOfExecutions?: SchedulerOptions["numberOfExecutions"]
}

type CronJobHandler = (container: MedusaContainer) => Promise<any>

export class JobLoader extends ResourceLoader {
  protected resourceName = "job"

  constructor(sourceDir: string | string[], container: MedusaContainer) {
    super(sourceDir, container)
  }

  async loadFile(path: string) {
    const exports = await dynamicImport(path)
    await this.onFileLoaded(path, exports)
  }

  protected async onFileLoaded(
    path: string,
    fileExports: {
      default: CronJobHandler
      config: CronJobConfig
    }
  ) {
    if (isFileSkipped(fileExports)) {
      return
    }

    this.validateConfig(fileExports.config)
    this.logger.debug(`Registering job from ${path}.`)
    this.register({
      path,
      config: fileExports.config,
      handler: fileExports.default,
    })
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
  protected register({
    path,
    config,
    handler,
  }: {
    path: string
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
          this.logger.error(
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

    registerDevServerResource({
      sourcePath: path,
      id: workflowName,
      type: "job",
      config: config,
    })
  }

  /**
   * Load cron jobs from one or multiple source paths
   */
  async load() {
    await super.discoverResources()

    this.logger.debug(`Jobs registered.`)
  }
}
