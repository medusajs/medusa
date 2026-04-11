import { MedusaContainer } from "@medusajs/framework/types"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"

export async function ensureDbExists(container: MedusaContainer) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const pgConnection = container.resolve(
    ContainerRegistrationKeys.PG_CONNECTION
  )

  try {
    await pgConnection.raw("SELECT 1 + 1;")
  } catch (error) {
    if (error.code === "3D000") {
      logger.error(`Cannot sync links. ${error.message.replace("error: ", "")}`)
      logger.info(`Run command "db:create" to create the database`)
    } else {
      logger.error(error)
    }
    process.exit(1)
  }
}

export async function isPgstreamEnabled(
  container: MedusaContainer
): Promise<boolean> {
  const pgConnection = container.resolve(
    ContainerRegistrationKeys.PG_CONNECTION
  )

  try {
    const result = await pgConnection.raw(
      "SELECT schema_name FROM information_schema.schemata WHERE schema_name = 'pgstream'"
    )
    return result.rows.length > 0
  } catch (error) {
    // If there's an error checking, assume pgstream is not enabled
    return false
  }
}
