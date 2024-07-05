import { IPricingModuleService, PricingTypes } from "@medusajs/types"
import { promiseAll } from "@medusajs/utils"
import { AwilixContainer } from "awilix"
import dotenv from "dotenv"
import express from "express"
import loaders from "../loaders"
import Logger from "../loaders/logger"
import { PriceList } from "../models"
import { PriceListService } from "../services"
import { createDefaultRuleTypes } from "./utils/create-default-rule-types"
import { migrateProductVariantPricing } from "./utils/migrate-money-amounts-to-pricing-module"

dotenv.config()

const BATCH_SIZE = 1000

const migratePriceLists = async (container: AwilixContainer) => {
  const pricingModuleService: IPricingModuleService = container.resolve(
    "pricingModuleService"
  )
  let offset = 0

  const priceListCoreService: PriceListService =
    container.resolve("priceListService")

  const remoteQuery = container.resolve("remoteQuery")

  const [_, totalCount] = await priceListCoreService.listAndCount(
    {},
    { select: ["id"] }
  )

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
      { id: corePriceLists.map(({ id }) => id) },
      {
        take: BATCH_SIZE,
        skip: offset,
        select: ["id"],
      }
    )

    const priceListIdsToUpdateSet = new Set<string>(
      pricingModulePriceLists.map(({ id }) => id)
    )

    const priceListsToCreate: PriceList[] = []
    const priceListsToUpdate: PriceList[] = []
    const variantIds: string[] = []

    for (const corePriceList of corePriceLists) {
      if (priceListIdsToUpdateSet.has(corePriceList.id)) {
        priceListsToUpdate.push(corePriceList)
      } else {
        priceListsToCreate.push(corePriceList)
      }

      const corePrices = corePriceList.prices || []

      variantIds.push(
        ...corePrices.map((corePrice) => corePrice.variants?.[0]?.id)
      )
    }

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
      variantPriceSets.map((vps) => [vps.variant_id, vps.price_set_id])
    )

    const promises: Promise<any>[] = []

    if (priceListsToUpdate.length) {
      await pricingModuleService.updatePriceLists(
        priceListsToUpdate.map((priceList) => {
          const updateData: PricingTypes.UpdatePriceListDTO = {
            id: priceList.id,
          }

          if (priceList?.customer_groups?.length) {
            updateData.rules = {
              customer_group_id: priceList.customer_groups.map(({ id }) => id),
            }
          }

          return updateData
        })
      )

      promises.push(
        pricingModuleService.addPriceListPrices(
          priceListsToUpdate.map((priceList) => {
            return {
              price_list_id: priceList.id,
              prices: priceList.prices
                .filter((price) =>
                  variantIdPriceSetIdMap.has(price.variants?.[0]?.id)
                )
                .map((price) => {
                  return {
                    price_set_id: variantIdPriceSetIdMap.get(
                      price.variants?.[0]?.id
                    )!,
                    currency_code: price.currency_code,
                    amount: price.amount,
                    min_quantity: price.min_quantity,
                    max_quantity: price.max_quantity,
                  }
                }),
            }
          })
        )
      )
    }

    if (priceListsToCreate.length) {
      promises.push(
        pricingModuleService.createPriceLists(
          priceListsToCreate.map(
            ({ name: title, prices, customer_groups, ...priceList }) => {
              const createData: any = {
                ...priceList,
                title,
              }

              if (customer_groups?.length) {
                createData.rules = {
                  customer_group_id: customer_groups.map(({ id }) => id),
                }
              }

              if (prices?.length) {
                createData.prices = prices.map((price) => {
                  return {
                    price_set_id: variantIdPriceSetIdMap.get(
                      price.variants?.[0]?.id
                    )!,
                    currency_code: price.currency_code,
                    amount: price.amount,
                    min_quantity: price.min_quantity,
                    max_quantity: price.max_quantity,
                  }
                })
              }

              return createData
            }
          )
        )
      )
    }

    await promiseAll(promises)

    offset += corePriceLists.length

    Logger.info(`Processed ${offset} of ${totalCount}`)
  }
}

const migrate = async function ({ directory }) {
  const app = express()

  const { container } = await loaders({
    directory,
    expressApp: app,
    isTest: false,
  })

  Logger.info("-----------------------------------------------")
  Logger.info("--------- Creating default rule types ---------")
  Logger.info("-----------------------------------------------")
  await createDefaultRuleTypes(container)

  Logger.info("-----------------------------------------------")
  Logger.info("---------- Migrating Variant Prices -----------")
  Logger.info("-----------------------------------------------")

  await migrateProductVariantPricing(container)

  Logger.info("-----------------------------------------------")
  Logger.info("----------- Migrating Price Lists -------------")
  Logger.info("-----------------------------------------------")

  return await migratePriceLists(container)
}

migrate({ directory: process.cwd() })
  .then(() => {
    Logger.info("Migrated price lists")
    process.exit(0)
  })
  .catch((error) => {
    console.warn(error)
    Logger.info("Failed to migrate price lists")
    process.exit(1)
  })
