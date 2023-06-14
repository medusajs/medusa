import { ProductTag } from "@medusajs/medusa"
import faker from "faker"
import { Connection } from "typeorm"

type ProductTagFactoryData = {
  id?: string
  value?: string
  metadata?: Record<string, unknown>
}

export const simpleProductTagFactory = async (
  connection: Connection,
  data: ProductTagFactoryData = {},
  seed?: number
): Promise<ProductTag | undefined> => {
  if (typeof seed !== "undefined") {
    faker.seed(seed)
  }

  const manager = connection.manager

  const productTag = manager.create(ProductTag, {
    id: data.id || faker.datatype.uuid(),
    value: data.value || faker.commerce.productAdjective(),
    metadata: data.metadata || {},
  })

  return await manager.save(productTag)
}
