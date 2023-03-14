import { Connection } from "typeorm"
import { ProductCategory } from "@medusajs/medusa"

export const simpleProductCategoryFactory = async (
  connection: Connection,
  data: Partial<ProductCategory> = {}
): Promise<ProductCategory> => {
  const manager = connection.manager
  const category = manager.create(ProductCategory, data)

  return await manager.save(category)
}
