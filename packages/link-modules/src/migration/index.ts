import {
  JoinerRelationship,
  LoaderOptions,
  Logger,
  ModuleJoinerConfig,
  ModuleServiceInitializeCustomDataLayerOptions,
  ModuleServiceInitializeOptions,
} from "@medusajs/types"
import { generateEntity } from "../utils"

import { DALUtils, ModulesSdkUtils } from "@medusajs/utils"

export function getMigration(
  joinerConfig: ModuleJoinerConfig,
  serviceName: string,
  primary: JoinerRelationship,
  foreign: JoinerRelationship
) {
  return async function runMigrations({
    options,
    logger,
  }: Pick<
    LoaderOptions<
      | ModuleServiceInitializeOptions
      | ModuleServiceInitializeCustomDataLayerOptions
    >,
    "options" | "logger"
  > = {}) {
    logger ??= console as unknown as Logger

    const dbData = ModulesSdkUtils.loadDatabaseConfig("link_modules", options)
    const entity = generateEntity(joinerConfig, primary, foreign)

    const orm = await DALUtils.mikroOrmCreateConnection(dbData, [entity])

    const tableName = entity.meta.collection

    let hasTable = false
    try {
      await orm.em.getConnection().execute(`SELECT 1 FROM ${tableName} LIMIT 0`)
      hasTable = true
      logger.info(`Skipping "${tableName}" creation.`)
    } catch {}

    if (!hasTable) {
      try {
        const generator = orm.getSchemaGenerator()

        await generator.createSchema()

        logger.info(`Link module "${serviceName}" migration executed`)
      } catch (error) {
        logger.error(
          `Link module "${serviceName}" migration failed to run - Error: ${error}`
        )
      }
    }

    await orm.close()
  }
}
