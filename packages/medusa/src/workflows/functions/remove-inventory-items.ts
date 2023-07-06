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

  return await Promise.all(
    data.map(async ({ inventoryItem }) => {
      return await inventoryService!.deleteInventoryItem(
        inventoryItem.id,
        context
      )
    })
  )
}
