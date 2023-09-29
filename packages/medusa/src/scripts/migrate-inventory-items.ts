import {
  IInventoryService,
  IStockLocationService,
  StockLocationDTO,
} from "@medusajs/types"
import {
  ProductVariantInventoryService,
  ProductVariantService,
} from "../services"

import { AwilixContainer } from "awilix"
import dotenv from "dotenv"
import express from "express"
import { EntityManager } from "typeorm"
import loaders from "../loaders"
import { ProductVariant } from "../models"

dotenv.config()

const BATCH_SIZE = 100

const migrateProductVariant = async (
  variant: ProductVariant,
  locationId: string,
  {
    container,
    transactionManager,
  }: { container: AwilixContainer; transactionManager: EntityManager }
) => {
  const productVariantInventoryService: ProductVariantInventoryService =
    container.resolve("productVariantInventoryService")

  const productVariantInventoryServiceTx =
    productVariantInventoryService.withTransaction(transactionManager)

  const existingVariantInventoryItems =
    await productVariantInventoryServiceTx.listByVariant(variant.id)

  if (existingVariantInventoryItems.length) {
    return
  }

  const inventoryService: IInventoryService =
    container.resolve("inventoryService")

  if (!variant.manage_inventory) {
    return
  }

  const context = { transactionManager }
  const inventoryItem = await inventoryService.createInventoryItem(
    {
      sku: variant.sku,
      material: variant.material,
      width: variant.width,
      length: variant.length,
      height: variant.height,
      weight: variant.weight,
      origin_country: variant.origin_country,
      hs_code: variant.hs_code,
      mid_code: variant.mid_code,
      requires_shipping: true,
    },
    context
  )

  await productVariantInventoryServiceTx.attachInventoryItem(
    variant.id,
    inventoryItem.id,
    1
  )

  await inventoryService.createInventoryLevel(
    {
      location_id: locationId,
      inventory_item_id: inventoryItem.id,
      stocked_quantity: variant.inventory_quantity,
      incoming_quantity: 0,
    },
    context
  )
}

const migrateStockLocation = async (container: AwilixContainer) => {
  const stockLocationService: IStockLocationService = container.resolve(
    "stockLocationService"
  )

  let location: StockLocationDTO | StockLocationDTO[] =
    await stockLocationService.list({}, { take: 1 })

  if (location.length) {
    location = location[0]
  }

  location = await stockLocationService.create({ name: "Default" })

  const salesChannelService = container.resolve("salesChannelService")
  const defaultSalesChannel = await salesChannelService.retrieveDefault()

  await salesChannelService.associateLocation(
    defaultSalesChannel.id,
    location.id
  )

  return location.id
}

const processBatch = async (
  variants: ProductVariant[],
  locationId: string,
  container: AwilixContainer
) => {
  const manager = container.resolve("manager")
  return await manager.transaction(async (transactionManager) => {
    await Promise.all(
      variants.map(async (variant) => {
        await migrateProductVariant(variant, locationId, {
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

  const defaultLocationId = await migrateStockLocation(container)

  const [variants, totalCount] = await variantService.listAndCount(
    {},
    { take: BATCH_SIZE, order: { id: "ASC" } }
  )

  await processBatch(variants, defaultLocationId, container)

  let processedCount = variants.length
  console.log(`Processed ${processedCount} of ${totalCount}`)
  while (processedCount < totalCount) {
    const nextBatch = await variantService.list(
      {},
      {
        skip: processedCount,
        take: BATCH_SIZE,
        order: { id: "ASC" },
      }
    )

    await processBatch(nextBatch, defaultLocationId, container)

    processedCount += nextBatch.length
    console.log(`Processed ${processedCount} of ${totalCount}`)
  }

  console.log("Done")
  process.exit(0)
}

migrate({ directory: process.cwd() })
