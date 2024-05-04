#!/usr/bin/env node

import { ModulesSdkUtils } from "@medusajs/utils"
import { Modules } from "@medusajs/modules-sdk"
import * as ProductModels from "@models"
import {
  createProductCategories,
  createProducts,
  createProductVariants,
} from "../seed-utils"
import { EOL } from "os"

const args = process.argv
const path = args.pop() as string

export default (async () => {
  const { config } = await import("dotenv")
  config()
  if (!path) {
    throw new Error(
      `filePath is required.${EOL}Example: medusa-product-seed <filePath>`
    )
  }

  const run = ModulesSdkUtils.buildSeedScript({
    moduleName: Modules.PRODUCT,
    models: ProductModels,
    pathToMigrations: __dirname + "/../../migrations",
    seedHandler: async ({ manager, data }) => {
      const { productCategoriesData, productsData, variantsData } = data
      await createProductCategories(manager, productCategoriesData)
      await createProducts(manager, productsData)
      await createProductVariants(manager, variantsData)
    },
  })
  await run({ path })
})()
