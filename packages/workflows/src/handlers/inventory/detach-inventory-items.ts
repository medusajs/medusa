import { InventoryItemDTO, ProductTypes } from "@medusajs/types"
import { WorkflowArguments } from "../../helper"

export async function detachInventoryItems({
  container,
  context,
  data,
}: Omit<WorkflowArguments, "data"> & {
  data: {
    inventoryItems: {
      variant: ProductTypes.ProductVariantDTO
      inventoryItem: InventoryItemDTO
    }[]
  }
}) {
  const { manager } = context

  const productVariantInventoryService = container
    .resolve("productVariantInventoryService")
    .withTransaction(manager)

  const data_ = data.inventoryItems

  if (!data_?.length) {
    return
  }

  return await Promise.all(
    data_.map(async ({ variant, inventoryItem }) => {
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
