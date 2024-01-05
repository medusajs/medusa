import { Modules } from "@medusajs/modules-sdk"
import { LoaderOptions, Logger, ModulesSdkTypes } from "@medusajs/types"
import { DALUtils, ModulesSdkUtils } from "@medusajs/utils"
import { EntitySchema } from "@mikro-orm/core"
import * as PromotionModels from "@models"

/**
 * This script is only valid for mikro orm managers. If a user provide a custom manager
 * he is in charge of running the migrations.
 * @param options
 * @param logger
 * @param moduleDeclaration
 */
export async function runMigrations(
  {
    options,
    logger,
  }: Pick<
    LoaderOptions<ModulesSdkTypes.ModuleServiceInitializeOptions>,
    "options" | "logger"
  > = {} as any
) {
  logger ??= console as unknown as Logger

  const dbData = ModulesSdkUtils.loadDatabaseConfig(
    Modules.WORKFLOW_ORCHESTRATOR,
    options
  )!
  const entities = Object.values(PromotionModels) as unknown as EntitySchema[]
  const pathToMigrations = __dirname + "/../migrations"

  const orm = await DALUtils.mikroOrmCreateConnection(
    dbData,
    entities,
    pathToMigrations
  )

  try {
    const migrator = orm.getMigrator()

    const pendingMigrations = await migrator.getPendingMigrations()
    logger.info(
      `Running pending migrations: ${JSON.stringify(
        pendingMigrations,
        null,
        2
      )}`
    )

    await migrator.up({
      migrations: pendingMigrations.map((m) => m.name),
    })

    logger.info("Workflow orchestrator module migration executed")
  } catch (error) {
    logger.error(
      `Workflow orchestrator module migration failed to run - Error: ${error}`
    )
  }

  await orm.close()
}
