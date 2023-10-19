import * as SearchModels from "@models"

import { LoaderOptions, Logger } from "@medusajs/types"

import { DALUtils, ModulesSdkUtils } from "@medusajs/utils"
import { EntitySchema } from "@mikro-orm/core"
import { SearchModuleOptions } from "../types"

/**
 * This script is only valid for mikro orm managers. If a user provide a custom manager
 * he is in charge of reverting the migrations.
 * @param options
 * @param logger
 * @param moduleDeclaration
 */
export async function revertMigration({
  options,
  logger,
}: Pick<LoaderOptions<SearchModuleOptions>, "options" | "logger"> = {}) {
  logger ??= console as unknown as Logger

  const dbData = ModulesSdkUtils.loadDatabaseConfig(
    "search",
    options?.defaultAdapterOptions
  )!
  const entities = Object.values(SearchModels) as unknown as EntitySchema[]
  const pathToMigrations = __dirname + "/../migrations"

  const orm = await DALUtils.mikroOrmCreateConnection(
    dbData,
    entities,
    pathToMigrations
  )

  try {
    const migrator = orm.getMigrator()
    await migrator.down()

    logger?.info("Search module migration executed")
  } catch (error) {
    logger?.error(`Search module migration failed to run - Error: ${error}`)
  }

  await orm.close()
}
