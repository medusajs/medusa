import { DataSource } from "typeorm"
import faker from "faker"
import { InventoryItem } from "@medusajs/inventory/dist/models/inventory-item"

export type InventoryItemFactoryData = {
  id?: string
  sku?: string
  metadata?: Record<string, unknown>
}

export const simpleInventoryItemFactory = async (
  dataSource: DataSource,
  data: InventoryItemFactoryData = {},
  seed?: number
): Promise<InventoryItem> => {
  if (typeof seed !== "undefined") {
    faker.seed(seed)
  }

  const manager = dataSource.manager

  const itemData = {
    id: data.id,
    sku: data.sku || faker.commerce.productName(),
    metadata: data.metadata || {},
  }

  const created = manager.create(InventoryItem, itemData)
  return await manager.save(created)
}
