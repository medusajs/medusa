import { InventoryItemDTO } from "@medusajs/types"
import { WorkflowArguments } from "@medusajs/workflows-sdk"
import { promiseAll } from "@medusajs/utils"

export async function detachInventoryItems({
  container,
  context,
  data,
}: WorkflowArguments<{
  inventoryItems: {
    tag: string
    inventoryItem: InventoryItemDTO
  }[]
}>) {
  const { manager } = context

  const productVariantInventoryService = container
    .resolve("productVariantInventoryService")
    .withTransaction(manager)

  if (!data?.inventoryItems?.length) {
    return []
  }

  await promiseAll(
    data.inventoryItems.map(async ({ tag, inventoryItem }) => {
      return await productVariantInventoryService.detachInventoryItem(
        inventoryItem.id,
        tag
      )
    })
  )

  return data.inventoryItems
}

detachInventoryItems.aliases = {
  inventoryItems: "inventoryItems",
}
