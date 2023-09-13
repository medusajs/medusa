import { LoaderOptions, Logger, ModulesSdkTypes } from "@medusajs/types"
import { DALUtils, ModulesSdkUtils } from "@medusajs/utils"
import { EntitySchema, RequiredEntityData } from "@mikro-orm/core"
import { SqlEntityManager } from "@mikro-orm/postgresql"
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

  const {
    currenciesData,
    moneyAmountsData,
    priceSetsData,
    priceSetMoneyAmountsData,
  } = await import(resolve(process.cwd(), path)).catch((e) => {
    logger?.error(
      `Failed to load seed data from ${path}. Please, provide a relative path and check that you export the following: priceSetsData, currenciesData, moneyAmountsData and priceSetMoneyAmountsData.${EOL}${e}`
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
    logger.info("Inserting price_sets, currencies & money_amounts")

    await createCurrencies(manager, currenciesData)
    await createMoneyAmounts(manager, moneyAmountsData)
    await createPriceSets(manager, priceSetsData)
    await createPriceSetMoneyAmounts(manager, priceSetMoneyAmountsData)
  } catch (e) {
    logger.error(
      `Failed to insert the seed data in the PostgreSQL database ${dbData.clientUrl}.${EOL}${e}`
    )
  }

  await orm.close(true)
}

async function createCurrencies(
  manager: SqlEntityManager,
  data: RequiredEntityData<PricingModels.Currency>[]
) {
  const currencies = data.map((currencyData) => {
    return manager.create(PricingModels.Currency, currencyData)
  })

  await manager.persistAndFlush(currencies)

  return currencies
}

async function createMoneyAmounts(
  manager: SqlEntityManager,
  data: RequiredEntityData<PricingModels.MoneyAmount>[]
) {
  const moneyAmounts = data.map((moneyAmountData) => {
    return manager.create(PricingModels.MoneyAmount, moneyAmountData)
  })

  await manager.persistAndFlush(moneyAmounts)

  return moneyAmounts
}

async function createPriceSets(
  manager: SqlEntityManager,
  data: RequiredEntityData<PricingModels.PriceSet>[]
) {
  const priceSets = data.map((priceSetData) => {
    return manager.create(PricingModels.PriceSet, priceSetData)
  })

  await manager.persistAndFlush(priceSets)

  return priceSets
}

async function createPriceSetMoneyAmounts(
  manager: SqlEntityManager,
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
