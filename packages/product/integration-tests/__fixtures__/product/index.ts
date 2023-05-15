import { Product, ProductCollection } from "@models"
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
