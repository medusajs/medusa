import { InventoryItemDTO, ProductTypes } from "@medusajs/types"
import { WorkflowArguments } from "../../helper"

export async function attachInventoryItems({
  container,
  context,
  data,
}: WorkflowArguments<{
  inventoryItems: {
    variant: ProductTypes.ProductVariantDTO
    inventoryItem: InventoryItemDTO
  }[]
}>) {
  const { manager } = context

  const productVariantInventoryService = container
    .resolve("productVariantInventoryService")
    .withTransaction(manager)

  if (!data?.inventoryItems?.length) {
    return
  }

  const inventoryData = data.inventoryItems.map(
    ({ variant, inventoryItem }) => ({
      variantId: variant.id,
      inventoryItemId: inventoryItem.id,
    })
  )

  return await productVariantInventoryService.attachInventoryItem(inventoryData)
}

attachInventoryItems.aliases = {
  inventoryItems: "inventoryItems",
}
