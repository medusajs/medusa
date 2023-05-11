import { Product } from "@models"
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
