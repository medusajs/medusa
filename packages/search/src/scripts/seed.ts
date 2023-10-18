import { LoaderOptions, Logger } from "@medusajs/types"
import { DALUtils, ModulesSdkUtils } from "@medusajs/utils"
import { EntitySchema } from "@mikro-orm/core"
import { SqlEntityManager } from "@mikro-orm/postgresql"
import * as SearchModels from "@models"
import { EOL } from "os"
import { resolve } from "path"
import { SearchModuleOptions } from "../types"

export async function run({
  options,
  logger,
  path,
}: Partial<Pick<LoaderOptions<SearchModuleOptions>, "options" | "logger">> & {
  path: string
}) {
  logger?.info(`Loading seed data from ${path}...`)
  const { searchData } = await import(resolve(process.cwd(), path)).catch(
    (e) => {
      logger?.warn(
        `Failed to load seed data from ${path}. Please, provide a relative path and check that you export the following searchData.${EOL}${e}`
      )
      logger?.warn(
        `Fallback to the default seed data from ${__dirname}/seed-data/index.ts`
      )
      throw e
    }
  )

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
  const manager = orm.em.fork()

  try {
    logger?.info("Inserting search data...")
    await createSearchData(manager, searchData)
  } catch (e) {
    logger?.error(
      `Failed to insert the seed data in the PostgreSQL database ${dbData.clientUrl}.${EOL}${e}`
    )
  }

  await orm.close(true)
}

async function createSearchData(
  manager: SqlEntityManager,
  searchData: any[]
): Promise<SearchModels.Catalog[]> {
  const catalog: SearchModels.Catalog[] = []

  for (const searchItem of searchData) {
    const searchObj = manager.create(SearchModels.Catalog, searchItem)
    catalog.push(searchObj)
  }

  await manager.persistAndFlush(catalog)

  return catalog
}
