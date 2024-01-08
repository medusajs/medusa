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
 * @param executorFn
 */
export function buildSeedScript({
  moduleName,
  models,
  pathToMigrations,
  executorFn,
}) {
  async function run({
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
    logger?.info(`Loading seed data from ${path}...`)
    const dataSeed = await import(resolve(process.cwd(), path)).catch((e) => {
      logger?.error(
        `Failed to load seed data from ${path}. Please, provide a relative path and check that you export the following productCategoriesData, productsData, variantsData.${EOL}${e}`
      )
      throw e
    })

    logger ??= console as unknown as Logger

    const dbData = loadDatabaseConfig(moduleName, options)!
    const entities = Object.values(models) as unknown as EntitySchema[]

    const orm = await mikroOrmCreateConnection(
      dbData,
      entities,
      pathToMigrations
    )
    const manager = orm.em.fork()

    try {
      logger?.info(`Inserting ${moduleName} data...`)
      executorFn(manager, dataSeed)
    } catch (e) {
      logger?.error(
        `Failed to insert the seed data in the PostgreSQL database ${dbData.clientUrl}.${EOL}${e}`
      )
    }

    await orm.close(true)
  }

  return async () => {
    const args = process.argv
    const path = args.pop() as string

    const { config } = await import("dotenv")
    config()
    if (!path) {
      throw new Error(
        `filePath is required.${EOL}Example: medusa-product-seed <filePath>`
      )
    }

    await run({ path })
  }
}
