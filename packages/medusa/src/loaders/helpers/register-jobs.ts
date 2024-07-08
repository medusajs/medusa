import {
  StepResponse,
  createStep,
  createWorkflow,
} from "@medusajs/workflows-sdk"
import { glob } from "glob"
import logger from "../logger"
import { MedusaError } from "@medusajs/utils"

export const registerJobs = async (plugins) => {
  await Promise.all(
    plugins.map(async (pluginDetails) => {
      const files = glob.sync(
        `${pluginDetails.resolve}/jobs/*.{ts,js,mjs,mts}`,
        {
          ignore: ["**/*.d.ts", "**/*.map"],
        }
      )

      logger.debug(
        `Registering ${files.length} jobs from ${pluginDetails.resolve}`
      )

      const jobs = await Promise.all(
        files.map(async (file) => {
          const module_ = await import(file)
          const input = {
            config: module_.config,
            handler: module_.default,
          }

          validateConfig(input.config)
          return input
        })
      )

      const res = await Promise.all(jobs.map(createJob))

      logger.debug(
        `Registered ${res.length} jobs from ${pluginDetails.resolve}`
      )
      return res
    })
  )
}

const createJob = async ({ config, handler }) => {
  const workflowName = `job-${config.name}`
  const step = createStep(
    `${config.name}-as-step`,
    async (stepInput, stepContext) => {
      const { container } = stepContext
      const res = await handler(container)
      return new StepResponse(res, res)
    }
  )

  createWorkflow(
    {
      name: workflowName,
      schedule: {
        cron: config.schedule,
        numberOfExecutions: config.numberOfExecutions,
      },
    },
    () => {
      return step()
    }
  )
}

const validateConfig = (config) => {
  if (!config) {
    throw new MedusaError(
      MedusaError.Types.INVALID_ARGUMENT,
      "Config is required for scheduled"
    )
  }

  if (!config.schedule) {
    throw new MedusaError(
      MedusaError.Types.INVALID_ARGUMENT,
      "Cron schedule definition is required for scheduled jobs"
    )
  }

  if (!config.name) {
    throw new MedusaError(
      MedusaError.Types.INVALID_ARGUMENT,
      "Job name is required for scheduled jobs"
    )
  }
}
