import { SqlEntityManager } from "@mikro-orm/postgresql"
import {
  Product,
  ProductCategory,
  ProductCollection,
  ProductVariant,
} from "@models"
import ProductOption from "../../../src/models/product-option"

export async function createProductAndTags(
  manager: SqlEntityManager,
  data: any[]
) {
  const products: any[] = data.map((productData) => {
    return manager.create(Product, productData)
  })

  await manager.persistAndFlush(products)

  return products
}

export async function createProductVariants(
  manager: SqlEntityManager,
  data: any[]
) {
  const variants: any[] = data.map((variantsData) => {
    return manager.create(ProductVariant, variantsData)
  })

  await manager.persistAndFlush(variants)

  return variants
}

export async function createCollections(
  manager: SqlEntityManager,
  collectionData: any[]
) {
  const collections: any[] = collectionData.map((collectionData) => {
    return manager.create(ProductCollection, collectionData)
  })

  await manager.persistAndFlush(collections)

  return collections
}

export async function createOptions(
  manager: SqlEntityManager,
  optionsData: any[]
) {
  const options: any[] = optionsData.map((o) => {
    return manager.create(ProductOption, o)
  })

  await manager.persistAndFlush(options)

  return options
}

export async function assignCategoriesToProduct(
  manager: SqlEntityManager,
  product: Product,
  categories: ProductCategory[]
) {
  product.categories.add(categories)

  await manager.persistAndFlush(product)

  return product
}
