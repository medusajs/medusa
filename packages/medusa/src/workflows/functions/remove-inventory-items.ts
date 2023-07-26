import { InventoryItemDTO, MedusaContainer } from "@medusajs/types"
import { EntityManager } from "typeorm"

export async function removeInventoryItems({
  container,
  manager,
  data,
}: {
  container: MedusaContainer
  manager: EntityManager
  data: {
    inventoryItem: InventoryItemDTO
  }[]
}) {
  const inventoryService = container.resolve("inventoryService")
  const context = { transactionManager: manager }

  return await inventoryService!.deleteInventoryItem(
    data.map(({ inventoryItem }) => inventoryItem.id),
    context
  )
}
