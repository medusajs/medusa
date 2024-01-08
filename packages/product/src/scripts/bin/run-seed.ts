#!/usr/bin/env node

import { ModulesSdkUtils } from "@medusajs/utils"
import { Modules } from "@medusajs/modules-sdk"
import * as ProductModels from "@models"
import {
  createProductCategories,
  createProducts,
  createProductVariants,
} from "../seed-utils"

export default ModulesSdkUtils.buildSeedScript({
  moduleName: Modules.PRODUCT,
  models: ProductModels,
  pathToMigrations: __dirname + "/../../migrations",
  executorFn: async (manager, data) => {
    const { productCategoriesData, productsData, variantsData } = data
    await createProductCategories(manager, productCategoriesData)
    await createProducts(manager, productsData)
    await createProductVariants(manager, variantsData)
  },
})()
