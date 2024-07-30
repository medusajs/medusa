import { ContainerRegistrationKeys, isObject } from "@medusajs/utils"
import { asValue } from "awilix"

export async function initDb({ env = {} }: { env?: Record<any, any> }) {
  if (isObject(env)) {
    Object.entries(env).forEach(([k, v]) => (process.env[k] = v))
  }

  const {
    configManager,
    pgConnectionLoader,
    logger,
    container,
    featureFlagsLoader,
  } = await import("@medusajs/framework")

  const configModule = configManager.config

  const pgConnection = pgConnectionLoader()
  await featureFlagsLoader()

  container.register({
    [ContainerRegistrationKeys.LOGGER]: asValue(logger),
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
