import {
  ContainerRegistrationKeys,
  createMedusaContainer,
  isObject,
} from "@medusajs/utils"
import { asValue } from "awilix"

export async function initDb({
  cwd,
  env = {},
}: {
  cwd: string
  env?: Record<any, any>
}) {
  if (isObject(env)) {
    Object.entries(env).forEach(([k, v]) => (process.env[k] = v))
  }

  const container = createMedusaContainer()

  const { configManager } = await import("@medusajs/framework/config")
  const configModule = configManager.config

  const pgConnection =
    await require("@medusajs/medusa/dist/loaders/pg-connection").default({
      configModule,
      container,
    })

  const featureFlagRouter =
    require("@medusajs/medusa/dist/loaders/feature-flags").default(configModule)

  container.register({
    [ContainerRegistrationKeys.CONFIG_MODULE]: asValue(configModule),
    [ContainerRegistrationKeys.LOGGER]: asValue(console),
    [ContainerRegistrationKeys.PG_CONNECTION]: asValue(pgConnection),
    [ContainerRegistrationKeys.FEATURE_FLAG_ROUTER]: asValue(featureFlagRouter),
  })

  try {
    const {
      runMedusaAppMigrations,
      getLinksExecutionPlanner,
    } = require("@medusajs/medusa/dist/loaders/medusa-app")
    await runMedusaAppMigrations({ configModule, container })
    const planner = await getLinksExecutionPlanner({
      configModule,
      container,
    })

    const actionPlan = await planner.createPlan()
    await planner.executePlan(actionPlan)

    /**
     * cleanup temporary created resources for the migrations
     * @internal I didnt find a god place to put that, should we eventually add a close function
     * to the planner to handle that part? so that you would do planner.close() and it will handle the cleanup
     * automatically just like we usually do for the classic migrations actions
     */
    const { MedusaModule } = require("@medusajs/modules-sdk")
    MedusaModule.clearInstances()
  } catch (err) {
    console.error("Something went wrong while running the migrations")
    throw err
  }

  return pgConnection
}
