import {
  JoinerRelationship,
  LoaderOptions,
  Logger,
  ModulesSdkTypes,
} from "@medusajs/types"
import { createConnection, generateEntity } from "../utils"

import { ModulesSdkUtils } from "@medusajs/utils"

export function getMigration(
  serviceName: string,
  primary: JoinerRelationship,
  foreign: JoinerRelationship
) {
  return async function runMigrations({
    options,
    logger,
  }: Pick<
    LoaderOptions<
      | ModulesSdkTypes.ModuleServiceInitializeOptions
      | ModulesSdkTypes.ModuleServiceInitializeCustomDataLayerOptions
    >,
    "options" | "logger"
  > = {}) {
    logger ??= console as unknown as Logger

    const dbData = ModulesSdkUtils.loadDatabaseConfig("link_modules", options)
    const entitity = generateEntity(primary, foreign)

    const orm = await createConnection(dbData, [entitity])

    try {
      const generator = orm.getSchemaGenerator()

      await generator.createSchema()

      logger.info(`Link module "${serviceName}" migration executed`)
    } catch (error) {
      logger.error(
        `Link module "${serviceName}" migration failed to run - Error: ${error}`
      )
    }

    await orm.close()
  }
}
