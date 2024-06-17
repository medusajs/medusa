import { LoaderOptions, Logger, ModulesSdkTypes } from "@medusajs/types"
import { EntitySchema } from "@mikro-orm/core"
import { EOL } from "os"
import { resolve } from "path"
import { mikroOrmCreateConnection } from "../../dal"
import { loadDatabaseConfig } from "../load-module-database-config"

/**
 * Utility function to build a seed script that will insert the seed data.
 * @param moduleName
 * @param models
 * @param pathToMigrations
 * @param seedHandler
 */
export function buildSeedScript({
  moduleName,
  models,
  pathToMigrations,
  seedHandler,
}: {
  moduleName: string
  models: Record<string, unknown>
  pathToMigrations: string
  seedHandler: (args: {
    manager: any
    logger: Logger
    data: any
  }) => Promise<void>
}) {
  return async function ({
    options,
    logger,
    path,
  }: Partial<
    Pick<
      LoaderOptions<ModulesSdkTypes.ModuleServiceInitializeOptions>,
      "options" | "logger"
    >
  > & {
    path: string
  }) {
    const logger_ = (logger ?? console) as unknown as Logger

    logger_.info(`Loading seed data from ${path}...`)
    const dataSeed = await import(resolve(process.cwd(), path)).catch((e) => {
      logger_.error(
        `Failed to load seed data from ${path}. Please, provide a relative path and check that you export the following productCategoriesData, productsData, variantsData.${EOL}${e}`
      )
      throw e
    })

    const dbData = loadDatabaseConfig(moduleName, options)!
    const entities = Object.values(models) as unknown as EntitySchema[]

    const orm = await mikroOrmCreateConnection(
      dbData,
      entities,
      pathToMigrations
    )
    const manager = orm.em.fork()

    try {
      logger_.info(`Inserting ${moduleName} data...`)
      seedHandler({ manager, logger: logger_, data: dataSeed })
    } catch (e) {
      logger_.error(
        `Failed to insert the seed data in the PostgreSQL database ${dbData.clientUrl}.${EOL}${e}`
      )
    }

    await orm.close(true)
  }
}
