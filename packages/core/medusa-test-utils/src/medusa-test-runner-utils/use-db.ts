import { ContainerRegistrationKeys } from "@medusajs/utils"
import { asValue } from "awilix"

/**
 * Initiates the database connection
 */
export async function initDb() {
  const { pgConnectionLoader, logger, container, featureFlagsLoader } =
    await import("@medusajs/framework")

  const pgConnection = pgConnectionLoader()
  await featureFlagsLoader()

  container.register({
    [ContainerRegistrationKeys.LOGGER]: asValue(logger),
  })

  return pgConnection
}

/**
 * Migrates the database and also sync links
 */
export async function migrateDatabase() {
  const { MedusaAppLoader } = await import("@medusajs/framework")

  try {
    const medusaAppLoader = new MedusaAppLoader()
    await medusaAppLoader.runModulesMigrations()
    const planner = await medusaAppLoader.getLinksExecutionPlanner()

    const actionPlan = await planner.createPlan()
    actionPlan.forEach((action) => {
      console.log(`Sync links: "${action.action}" ${action.tableName}`)
    })
    await planner.executePlan(actionPlan)
  } catch (err) {
    console.error("Something went wrong while running the migrations")
    throw err
  }
}
