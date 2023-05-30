import { InternalModuleDeclaration, LoaderOptions } from "@medusajs/types"
import {
  ProductServiceInitializeCustomDataLayerOptions,
  ProductServiceInitializeOptions,
} from "../types"
import connectionLoader from "../loaders/connection"
import { createMedusaContainer } from "@medusajs/utils"
import { SqlEntityManager } from "@mikro-orm/postgresql"

/**
 * This script is only valid for mikro orm managers. If a user provide a custom manager
 * he is in charge of reverting the migrations.
 * @param options
 * @param logger
 * @param moduleDeclaration
 */
export async function revertMigrations(
  {
    options,
    logger,
  }: Pick<
    LoaderOptions<
      | ProductServiceInitializeOptions
      | ProductServiceInitializeCustomDataLayerOptions
    >,
    "options" | "logger"
  >,
  moduleDeclaration?: InternalModuleDeclaration
) {
  const container = createMedusaContainer()
  await connectionLoader({ options, logger, container }, moduleDeclaration)

  const manager: SqlEntityManager = container.resolve("manager")

  try {
    const migrator = manager.getPlatform().getMigrator(manager)
    await migrator.down()

    logger?.info("Product module migration executed")
  } catch (error) {
    logger?.error(`Product module migration failed to run - Error: ${error}`)
  }
}
