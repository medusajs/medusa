import { InventoryItemDTO, ProductTypes } from "@medusajs/types"
import { WorkflowArguments } from "../../helper"

export async function detachInventoryItems({
  container,
  context,
  data,
}: WorkflowArguments<{
  inventoryItems: {
    variant: ProductTypes.ProductVariantDTO
    inventoryItem: InventoryItemDTO
  }[]
}>): Promise<void> {
  const { manager } = context

  const productVariantInventoryService = container
    .resolve("productVariantInventoryService")
    .withTransaction(manager)

  if (!data?.inventoryItems.length) {
    return
  }

  await Promise.all(
    data.inventoryItems.map(async ({ variant, inventoryItem }) => {
      return await productVariantInventoryService.detachInventoryItem(
        inventoryItem.id,
        variant.id
      )
    })
  )
}

detachInventoryItems.aliases = {
  inventoryItems: "inventoryItems",
}
