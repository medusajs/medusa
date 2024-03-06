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

  const { moneyAmountsData, priceSetsData, priceSetMoneyAmountsData } =
    await import(resolve(process.cwd(), path)).catch((e) => {
      logger?.error(
        `Failed to load seed data from ${path}. Please, provide a relative path and check that you export the following: priceSetsData, moneyAmountsData and priceSetMoneyAmountsData.${EOL}${e}`
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
    logger.info("Inserting price_sets & money_amounts")

    await createMoneyAmounts(manager as any, moneyAmountsData)
    await createPriceSets(manager as any, priceSetsData)
    await createPriceSetMoneyAmounts(manager as any, priceSetMoneyAmountsData)
  } catch (e) {
    logger.error(
      `Failed to insert the seed data in the PostgreSQL database ${dbData.clientUrl}.${EOL}${e}`
    )
  }

  await orm.close(true)
}

async function createMoneyAmounts(
  manager: SqlEntityManager<PostgreSqlDriver>,
  data: RequiredEntityData<PricingModels.MoneyAmount>[]
) {
  const moneyAmounts = data.map((moneyAmountData) => {
    return manager.create(PricingModels.MoneyAmount, moneyAmountData)
  })

  await manager.persistAndFlush(moneyAmounts)

  return moneyAmounts
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

async function createPriceSetMoneyAmounts(
  manager: SqlEntityManager<PostgreSqlDriver>,
  data: RequiredEntityData<PricingModels.PriceSetMoneyAmount>[]
) {
  const priceSetMoneyAmounts = data.map((priceSetMoneyAmountData) => {
    return manager.create(
      PricingModels.PriceSetMoneyAmount,
      priceSetMoneyAmountData
    )
  })

  await manager.persistAndFlush(priceSetMoneyAmounts)

  return priceSetMoneyAmounts
}
