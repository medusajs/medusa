import { InventoryItemDTO, ProductTypes } from "@medusajs/types"

import { InputAlias } from "../definitions"
import { WorkflowArguments } from "../helper"

export async function attachInventoryItems({
  container,
  data,
}: WorkflowArguments & {
  data: {
    variant: ProductTypes.ProductVariantDTO
    [InputAlias.InventoryItems]: InventoryItemDTO
  }[]
}) {
  const manager = container.resolve("manager")
  const productVariantInventoryService = container
    .resolve("productVariantInventoryService")
    .withTransaction(manager)

  const value = await Promise.all(
    data
      .filter((d) => d)
      .map(async ({ variant, [InputAlias.InventoryItems]: inventoryItem }) => {
        return await productVariantInventoryService.attachInventoryItem(
          variant.id,
          inventoryItem.id
        )
      })
  )

  return {
    alias: InputAlias.AttachedInventoryItems,
    value,
  }
}
