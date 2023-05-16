import { Product, ProductCollection, ProductCategory } from "@models"
import { SqlEntityManager } from "@mikro-orm/postgresql"

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

export async function createCategories(
  manager: SqlEntityManager,
  categoriesData: any[]
) {
  const categories: any[] = categoriesData.map((categoriesData) => {
    return manager.create(ProductCategory, categoriesData)
  })

  await manager.persistAndFlush(categories)

  return categories
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
