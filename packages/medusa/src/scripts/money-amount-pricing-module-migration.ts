import { IPricingModuleService, MedusaContainer } from "@medusajs/types"
import {
  FlagRouter,
  MedusaError,
  MedusaV2Flag,
  promiseAll,
} from "@medusajs/utils"
import dotenv from "dotenv"
import express from "express"
import { EntityManager } from "typeorm"
import loaders from "../loaders"
import loadMedusaApp from "../loaders/medusa-app"
import { ProductVariant } from "../models"
import { ProductVariantService } from "../services"
import { createDefaultRuleTypes } from "./create-default-rule-types"

dotenv.config()

const BATCH_SIZE = 100

const migrateProductVariant = async (
  variant: ProductVariant,
  {
    container,
  }: { container: MedusaContainer; transactionManager: EntityManager }
) => {
  const pricingService: IPricingModuleService = container.resolve(
    "pricingModuleService"
  )

  const configModule = await container.resolve("configModule")
  const { link } = await loadMedusaApp(
    { configModule, container },
    { registerInContainer: false }
  )

  if (!link) {
    throw new MedusaError(
      MedusaError.Types.NOT_ALLOWED,
      "Can't migrate money_amounts: Pricing module is not configured correctly"
    )
  }

  const priceSet = await pricingService.create({
    rules: [{ rule_attribute: "region_id" }],
    prices: variant.prices.map((price) => ({
      rules: {
        ...(price.region_id ? { region_id: price.region_id } : {}),
      },
      currency_code: price.currency_code,
      min_quantity: price.min_quantity,
      max_quantity: price.max_quantity,
      amount: price.amount,
    })),
  })

  await link.create({
    productService: {
      variant_id: variant.id,
    },
    pricingService: {
      price_set_id: priceSet.id,
    },
  })
}

const processBatch = async (
  variants: ProductVariant[],
  container: MedusaContainer
) => {
  const manager = container.resolve("manager")
  return await manager.transaction(async (transactionManager) => {
    await promiseAll(
      variants.map(async (variant) => {
        await migrateProductVariant(variant, {
          container,
          transactionManager,
        })
      })
    )
  })
}

const migrate = async function ({ directory }) {
  const app = express()
  const { container } = await loaders({
    directory,
    expressApp: app,
    isTest: false,
  })

  const variantService: ProductVariantService = await container.resolve(
    "productVariantService"
  )
  const featureFlagRouter: FlagRouter = await container.resolve(
    "featureFlagRouter"
  )

  if (!featureFlagRouter.isFeatureEnabled(MedusaV2Flag.key)) {
    throw new MedusaError(
      MedusaError.Types.NOT_ALLOWED,
      "Pricing module not enabled"
    )
  }

  await createDefaultRuleTypes(container)

  const [variants, totalCount] = await variantService.listAndCount(
    {},
    { take: BATCH_SIZE, order: { id: "ASC" }, relations: ["prices"] }
  )

  await processBatch(variants, container)

  let processedCount = variants.length

  console.log(`Processed ${processedCount} of ${totalCount}`)

  while (processedCount < totalCount) {
    const nextBatch = await variantService.list(
      {},
      {
        skip: processedCount,
        take: BATCH_SIZE,
        order: { id: "ASC" },
        relations: ["prices"],
      }
    )

    await processBatch(nextBatch, container)

    processedCount += nextBatch.length
    console.log(`Processed ${processedCount} of ${totalCount}`)
  }

  console.log("Done")
  process.exit(0)
}

migrate({ directory: process.cwd() })
