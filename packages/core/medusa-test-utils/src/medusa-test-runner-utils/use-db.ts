import type { MedusaAppLoader } from "@medusajs/framework"

/**
 * Initiates the database connection
 */
export async function initDb() {
  const { pgConnectionLoader, featureFlagsLoader } = await import(
    "@medusajs/framework"
  )

  const pgConnection = pgConnectionLoader()
  await featureFlagsLoader()

  return pgConnection
}

/**
 * Migrates the database
 */
export async function migrateDatabase(appLoader: MedusaAppLoader) {
  try {
    await appLoader.runModulesMigrations()
  } catch (err) {
    console.error("Something went wrong while running the migrations")
    throw err
  }
}

/**
 * Syncs links with the databse
 */
export async function syncLinks(appLoader: MedusaAppLoader) {
  try {
    const planner = await appLoader.getLinksExecutionPlanner()
    const actionPlan = await planner.createPlan()
    actionPlan.forEach((action) => {
      console.log(`Sync links: "${action.action}" ${action.tableName}`)
    })
    await planner.executePlan(actionPlan)
  } catch (err) {
    console.error("Something went wrong while syncing links")
    throw err
  }
}
