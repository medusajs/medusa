import { ProductStatus } from "@medusajs/utils"
import { SqlEntityManager } from "@mikro-orm/postgresql"
import {
  Image,
  Product,
  ProductCategory,
  ProductCollection,
  ProductType,
  ProductVariant,
} from "@models"

import ProductOption from "../../../src/models/product-option"

export * from "./data/create-product"

export async function createProductAndTags(
  manager: SqlEntityManager,
  data: {
    id?: string
    title: string
    status: ProductStatus
    tags?: { id: string; value: string }[]
    collection_id?: string
  }[]
) {
  const products: any[] = data.map((productData) => {
    return manager.create(Product, productData)
  })

  await manager.persistAndFlush(products)

  return products
}

export async function createProductAndTypes(
  manager: SqlEntityManager,
  data: {
    id?: string
    title: string
    status: ProductStatus
    type?: { id: string; value: string }
  }[]
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
  collectionData: {
    id?: string
    title: string
    handle?: string
  }[]
) {
  const collections: any[] = collectionData.map((collectionData) => {
    return manager.create(ProductCollection, collectionData)
  })

  await manager.persistAndFlush(collections)

  return collections
}

export async function createTypes(
  manager: SqlEntityManager,
  typesData: {
    id?: string
    value: string
  }[]
) {
  const types: any[] = typesData.map((typesData) => {
    return manager.create(ProductType, typesData)
  })

  await manager.persistAndFlush(types)

  return types
}

export async function createOptions(
  manager: SqlEntityManager,
  optionsData: {
    id?: string
    product: { id: string }
    title: string
    value?: string
    values?: {
      id?: string
      value: string
      variant?: { id: string } & any
    }[]
    variant?: { id: string } & any
  }[]
) {
  const options: any[] = optionsData.map((option) => {
    return manager.create(ProductOption, option)
  })

  await manager.persistAndFlush(options)

  return options
}

export async function createImages(
  manager: SqlEntityManager,
  imagesData: string[]
) {
  const images: any[] = imagesData.map((img) => {
    return manager.create(Image, { url: img })
  })

  await manager.persistAndFlush(images)

  return images
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
