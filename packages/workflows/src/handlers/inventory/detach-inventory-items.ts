import { InventoryItemDTO } from "@medusajs/types"
import { WorkflowArguments } from "../../helper"

export async function detachInventoryItems({
  container,
  context,
  data,
}: WorkflowArguments<{
  inventoryItems: {
    tag: string
    inventoryItem: InventoryItemDTO
  }[]
}>): Promise<InventoryItemDTO[]> {
  const { manager } = context

  const productVariantInventoryService = container
    .resolve("productVariantInventoryService")
    .withTransaction(manager)

  if (!data?.inventoryItems.length) {
    return []
  }

  await Promise.all(
    data.inventoryItems.map(async ({ tag, inventoryItem }) => {
      return await productVariantInventoryService.detachInventoryItem(
        inventoryItem.id,
        tag
      )
    })
  )

  return data.inventoryItems.map(({ inventoryItem }) => inventoryItem)
}

detachInventoryItems.aliases = {
  inventoryItems: "inventoryItems",
}
