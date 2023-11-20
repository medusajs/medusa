import { IPricingModuleService, PricingTypes } from "@medusajs/types"
import { AwilixContainer } from "awilix"
import dotenv from "dotenv"
import express from "express"
import loaders from "../loaders"
import Logger from "../loaders/logger"
import { PriceListService } from "../services"

dotenv.config()

const BATCH_SIZE = 1000

export const migratePriceLists = async (container: AwilixContainer) => {
  const pricingModuleService: IPricingModuleService = container.resolve(
    "pricingModuleService"
  )

  const priceListCoreService: PriceListService =
    container.resolve("priceListService")

  const remoteQuery = container.resolve("remoteQuery")

  const existingRuleTypes = await pricingModuleService.listRuleTypes(
    { rule_attribute: ["customer_group_id"] },
    { take: 2 }
  )

  if (existingRuleTypes.length === 0) {
    Logger.info(
      `Run default rules migration before running this migration - node node_modules/@medusajs/medusa/dist/scripts/create-default-rule-types.js`
    )

    return
  }

  let offset = 0
  let arePriceListsAvailable = true

  while (arePriceListsAvailable) {
    const priceLists = await priceListCoreService.list(
      {},
      {
        take: BATCH_SIZE,
        skip: offset,
        relations: ["customer_groups"],
      }
    )

    if (priceLists.length === 0) {
      break
    }

    offset += BATCH_SIZE

    await pricingModuleService.update(
      priceLists.map((priceList) => {
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

    for (const priceList of priceLists) {
      let productsOffset = 0
      let areVariantsAvailable = true

      while (areVariantsAvailable) {
        const [priceListVariants, variantsCount] =
          await priceListCoreService.listVariants(
            priceList.id,
            {},
            {
              skip: productsOffset,
              take: BATCH_SIZE,
            }
          )

        if (variantsCount === 0) {
          break
        }

        productsOffset += BATCH_SIZE

        const query = {
          product_variant_price_set: {
            __args: {
              variant_id: priceListVariants.map((plv) => plv.id),
            },
            fields: ["variant_id", "price_set_id"],
          },
        }

        const variantPriceSets = await remoteQuery(query)
        const variantPriceSetMap = new Map<string, string>(
          variantPriceSets.map((mps) => [mps.variant_id, mps.price_set_id])
        )

        const variantPrices = priceListVariants
          .map((plv) => plv.prices || [])
          .flat()

        await pricingModuleService.addPriceListPrices([
          {
            priceListId: priceList.id,
            prices: variantPrices.map((vp) => {
              return {
                id: vp.id,
                price_set_id: variantPriceSetMap.get(vp.variant_id)!,
                currency_code: vp.currency_code,
                amount: vp.amount,
              }
            }),
          },
        ])
      }
    }
  }
}

const migrate = async function ({ directory }) {
  const app = express()
  const { container } = await loaders({
    directory,
    expressApp: app,
    isTest: false,
  })

  return await migratePriceLists(container)
}

migrate({ directory: process.cwd() })
  .then(() => {
    console.log("Migrated price lists")
  })
  .catch(() => {
    console.log("Failed to migrate price lists")
  })
