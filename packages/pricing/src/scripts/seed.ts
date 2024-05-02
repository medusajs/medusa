import { LoaderOptions, Logger, ModulesSdkTypes } from "@medusajs/types"
import { DALUtils, ModulesSdkUtils } from "@medusajs/utils"
import { EntitySchema, RequiredEntityData } from "@mikro-orm/core"
import { PostgreSqlDriver, SqlEntityManager } from "@mikro-orm/postgresql"
import * as PricingModels from "@models"
import { EOL } from "os"
import { resolve } from "path"

export async function run({
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
  logger ??= console as unknown as Logger

  logger.info(`Loading seed data from ${path}...`)

  const { priceSetsData, pricesData } = await import(
    resolve(process.cwd(), path)
  ).catch((e) => {
    logger?.error(
      `Failed to load seed data from ${path}. Please, provide a relative path and check that you export the following: priceSetsData and pricesData.${EOL}${e}`
    )
    throw e
  })

  const dbData = ModulesSdkUtils.loadDatabaseConfig("pricing", options)!
  const entities = Object.values(PricingModels) as unknown as EntitySchema[]
  const pathToMigrations = __dirname + "/../migrations"

  const orm = await DALUtils.mikroOrmCreateConnection(
    dbData,
    entities,
    pathToMigrations
  )

  const manager = orm.em.fork()

  try {
    logger.info("Inserting price_sets & prices")

    await createPriceSets(manager, priceSetsData)
    await createPrices(manager, pricesData)
  } catch (e) {
    logger.error(
      `Failed to insert the seed data in the PostgreSQL database ${dbData.clientUrl}.${EOL}${e}`
    )
  }

  await orm.close(true)
}

async function createPriceSets(
  manager: SqlEntityManager<PostgreSqlDriver>,
  data: RequiredEntityData<PricingModels.PriceSet>[]
) {
  const priceSets = data.map((priceSetData) => {
    return manager.create(PricingModels.PriceSet, priceSetData)
  })

  await manager.persistAndFlush(priceSets)

  return priceSets
}

async function createPrices(
  manager: SqlEntityManager<PostgreSqlDriver>,
  data: RequiredEntityData<PricingModels.Price>[]
) {
  const prices = data.map((priceData) => {
    return manager.create(PricingModels.Price, priceData)
  })

  await manager.persistAndFlush(prices)

  return prices
}
