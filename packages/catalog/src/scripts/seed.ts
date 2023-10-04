import { LoaderOptions, Logger } from "@medusajs/types"
import { DALUtils, ModulesSdkUtils } from "@medusajs/utils"
import { EntitySchema } from "@mikro-orm/core"
import { SqlEntityManager } from "@mikro-orm/postgresql"
import * as CatalogModels from "@models"
import { Catalog } from "@models"
import { EOL } from "os"
import { resolve } from "path"
import { CatalogModuleOptions } from "../types"

export async function run({
  options,
  logger,
  path,
}: Partial<Pick<LoaderOptions<CatalogModuleOptions>, "options" | "logger">> & {
  path: string
}) {
  logger?.info(`Loading seed data from ${path}...`)
  const { catalogData } = await import(resolve(process.cwd(), path)).catch(
    (e) => {
      logger?.warn(
        `Failed to load seed data from ${path}. Please, provide a relative path and check that you export the following catalogData.${EOL}${e}`
      )
      logger?.warn(
        `Fallback to the default seed data from ${__dirname}/seed-data/index.ts`
      )
      throw e
    }
  )

  logger ??= console as unknown as Logger

  const dbData = ModulesSdkUtils.loadDatabaseConfig(
    "catalog",
    options?.defaultAdapterOptions
  )!
  const entities = Object.values(CatalogModels) as unknown as EntitySchema[]
  const pathToMigrations = __dirname + "/../migrations"

  const orm = await DALUtils.mikroOrmCreateConnection(
    dbData,
    entities,
    pathToMigrations
  )
  const manager = orm.em.fork()

  try {
    logger?.info("Inserting catalog data...")
    await createCatalogData(manager, catalogData)
  } catch (e) {
    logger?.error(
      `Failed to insert the seed data in the PostgreSQL database ${dbData.clientUrl}.${EOL}${e}`
    )
  }

  await orm.close(true)
}

async function createCatalogData(
  manager: SqlEntityManager,
  catalogData: any[]
): Promise<Catalog[]> {
  const catalog: Catalog[] = []

  for (const catalogItem of catalogData) {
    const catalogObj = manager.create(Catalog, catalogItem)
    catalog.push(catalogObj)
  }

  await manager.persistAndFlush(catalog)

  return catalog
}
