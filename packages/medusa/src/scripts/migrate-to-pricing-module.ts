import { CurrencyService, PriceListService } from "../services"
import { IPricingModuleService, PricingTypes } from "@medusajs/types"

import { AwilixContainer } from "awilix"
import { PriceList } from "../models"
import { createDefaultRuleTypes } from "./utils/create-default-rule-types"
import dotenv from "dotenv"
import express from "express"
import loaders from "../loaders"
import { migrateProductVariantPricing } from "./utils/migrate-money-amounts-to-pricing-module"

dotenv.config()

const BATCH_SIZE = 10

const migratePriceLists = async (container: AwilixContainer) => {
  const pricingModuleService: IPricingModuleService = container.resolve(
    "pricingModuleService"
  )
  let offset = 0

  const priceListCoreService: PriceListService =
    container.resolve("priceListService")

  const remoteQuery = container.resolve("remoteQuery")

  const [_, totalCount] = await priceListCoreService.listAndCount({})

  while (offset < totalCount) {
    const corePriceLists = await priceListCoreService.list(
      {},
      {
        take: BATCH_SIZE,
        skip: offset,
        relations: ["customer_groups", "prices", "prices.variants"],
      }
    )

    const pricingModulePriceLists = await pricingModuleService.listPriceLists(
      { id: corePriceLists.map((pl) => pl.id) },
      {
        take: BATCH_SIZE,
        skip: offset,
        select: ["id"],
      }
    )

    const priceListIdsToUpdateSet = new Set<string>(
      pricingModulePriceLists.map(({ id }) => id)
    )

    const priceListsToCreate: PriceList[] = corePriceLists.filter(
      ({ id }) => !priceListIdsToUpdateSet.has(id)
    )

    const priceListsToUpdate: PriceList[] = corePriceLists.filter(({ id }) =>
      priceListIdsToUpdateSet.has(id)
    )

    const variantIds = corePriceLists
      .map(({ prices }) => prices.map(({ variants }) => variants[0]?.id))
      .flat()

    const query = {
      product_variant_price_set: {
        __args: {
          variant_id: variantIds,
        },
        fields: ["variant_id", "price_set_id"],
      },
    }

    const variantPriceSets = await remoteQuery(query)

    const variantIdPriceSetIdMap = new Map<string, string>(
      variantPriceSets.map((mps) => [mps.variant_id, mps.price_set_id])
    )

    if (priceListsToUpdate.length) {
      await pricingModuleService.updatePriceLists(
        priceListsToUpdate.map((priceList) => {
          const updateData: PricingTypes.UpdatePriceListDTO = {
            id: priceList.id,
            title: priceList.name,
          }

          if (priceList?.customer_groups?.length) {
            updateData.rules = {
              customer_group_id: priceList.customer_groups.map((cg) => cg.id),
            }
          }

          return updateData
        })
      )

      await pricingModuleService.addPriceListPrices(
        priceListsToUpdate.map((priceList) => {
          return {
            priceListId: priceList.id,
            prices: priceList.prices
              .map((vp) => {
                return {
                  price_set_id: variantIdPriceSetIdMap.get(
                    vp.variants?.[0]?.id
                  )!,
                  currency_code: vp.currency_code,
                  amount: vp.amount,
                  min_quantity: vp.min_quantity,
                  max_quantity: vp.max_quantity,
                }
              })
              .filter((vp) => vp.price_set_id),
          }
        })
      )
    }

    if (priceListsToCreate.length) {
      await pricingModuleService.createPriceLists(
        priceListsToCreate.map(
          ({ name: title, prices, customer_groups, ...priceList }) => {
            const createData: PricingTypes.CreatePriceListDTO = {
              ...priceList,
              starts_at: priceList.starts_at?.toISOString(),
              ends_at: priceList.ends_at?.toISOString(),
              title,
            }

            if (customer_groups?.length) {
              createData.rules = {
                customer_group_id: customer_groups.map((cg) => cg.id),
              }
            }

            if (prices?.length) {
              createData.prices = prices.map((vp) => {
                return {
                  price_set_id: variantIdPriceSetIdMap.get(
                    vp.variants?.[0]?.id
                  )!,
                  currency_code: vp.currency_code,
                  amount: vp.amount,
                  min_quantity: vp.min_quantity,
                  max_quantity: vp.max_quantity,
                }
              })
            }

            return createData
          }
        )
      )
    }

    offset += corePriceLists.length

    console.log(`Processed ${offset} of ${totalCount}`)
  }
}

const ensureCurrencies = async (container: AwilixContainer) => {
  const currenciesService: CurrencyService =
    container.resolve("currencyService")

  const pricingModuleService: IPricingModuleService = container.resolve(
    "pricingModuleService"
  )

  const [coreCurrencies, totalCurrencies] =
    await currenciesService.listAndCount({}, {})

  const moduleCurrencies = await pricingModuleService.listCurrencies(
    {},
    { take: 100000 }
  )

  const moduleCurrenciesMap = new Map(
    moduleCurrencies.map((c) => [c.code, null])
  )

  const currenciesToCreate = coreCurrencies
    .filter(({ code }) => {
      return !moduleCurrenciesMap.has(code)
    })
    .map(({ includes_tax, ...currency }) => currency)

  await pricingModuleService.createCurrencies(currenciesToCreate)
}

const migrate = async function ({ directory }) {
  const app = express()

  const { container } = await loaders({
    directory,
    expressApp: app,
    isTest: false,
  })

  console.log("-----------------------------------------------")
  console.log("------------- Creating currencies -------------")
  console.log("-----------------------------------------------")
  await ensureCurrencies(container)

  console.log("-----------------------------------------------")
  console.log("--------- Creating default rule types ---------")
  console.log("-----------------------------------------------")
  await createDefaultRuleTypes(container)

  console.log("-----------------------------------------------")
  console.log("---------- Migrating Variant Prices -----------")
  console.log("-----------------------------------------------")

  await migrateProductVariantPricing(container)

  console.log("-----------------------------------------------")
  console.log("----------- Migrating Price Lists -------------")
  console.log("-----------------------------------------------")

  return await migratePriceLists(container)
}

migrate({ directory: process.cwd() })
  .then(() => {
    console.log("Migrated price lists")
    process.exit(0)
  })
  .catch((error) => {
    console.warn(error)
    console.log("Failed to migrate price lists")
    process.exit(1)
  })
