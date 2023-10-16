import { LoaderOptions, Logger, ModulesSdkTypes } from "@medusajs/types"
import { DALUtils, ModulesSdkUtils } from "@medusajs/utils"
import { EntitySchema } from "@mikro-orm/core"
import { SqlEntityManager } from "@mikro-orm/postgresql"
import * as ProductModels from "@models"
import { Product, ProductCategory, ProductVariant } from "@models"
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
  logger?.info(`Loading seed data from ${path}...`)
  const { productCategoriesData, productsData, variantsData } = await import(
    resolve(process.cwd(), path)
  ).catch((e) => {
    logger?.error(
      `Failed to load seed data from ${path}. Please, provide a relative path and check that you export the following productCategoriesData, productsData, variantsData.${EOL}${e}`
    )
    throw e
  })

  logger ??= console as unknown as Logger

  const dbData = ModulesSdkUtils.loadDatabaseConfig("product", options)!
  const entities = Object.values(ProductModels) as unknown as EntitySchema[]
  const pathToMigrations = __dirname + "/../migrations"

  const orm = await DALUtils.mikroOrmCreateConnection(
    dbData,
    entities,
    pathToMigrations
  )
  const manager = orm.em.fork()

  try {
    logger?.info("Inserting product categories, products and variants...")
    await createProductCategories(manager, productCategoriesData)
    await createProducts(manager, productsData)
    await createProductVariants(manager, variantsData)
  } catch (e) {
    logger?.error(
      `Failed to insert the seed data in the PostgreSQL database ${dbData.clientUrl}.${EOL}${e}`
    )
  }

  await orm.close(true)
}

async function createProductCategories(
  manager: SqlEntityManager,
  categoriesData: any[]
): Promise<ProductCategory[]> {
  const categories: ProductCategory[] = []

  for (let categoryData of categoriesData) {
    let categoryDataClone = { ...categoryData }
    let parentCategory: ProductCategory | null = null
    const parentCategoryId = categoryDataClone.parent_category_id as string
    delete categoryDataClone.parent_category_id

    if (parentCategoryId) {
      parentCategory = await manager.findOne(ProductCategory, parentCategoryId)
    }

    const category = manager.create(ProductCategory, {
      ...categoryDataClone,
      parent_category: parentCategory,
    })

    categories.push(category)
  }

  await manager.persistAndFlush(categories)

  return categories
}

async function createProducts(manager: SqlEntityManager, data: any[]) {
  const products: any[] = data.map((productData) => {
    return manager.create(Product, productData)
  })

  await manager.persistAndFlush(products)

  return products
}

async function createProductVariants(manager: SqlEntityManager, data: any[]) {
  const variants: any[] = data.map((variantsData) => {
    return manager.create(ProductVariant, variantsData)
  })

  await manager.persistAndFlush(variants)

  return variants
}
