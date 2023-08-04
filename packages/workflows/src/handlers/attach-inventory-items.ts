import { InventoryItemDTO, ProductTypes } from "@medusajs/types"

import { InputAlias } from "../definitions"
import { WorkflowArguments } from "../helper"
import { ProductVariantInventoryItem } from "@medusajs/medusa/src"

export async function attachInventoryItems({
  container,
  data,
}: WorkflowArguments & {
  data: {
    variant: ProductTypes.ProductVariantDTO
    [InputAlias.InventoryItems]: InventoryItemDTO
  }[]
}): Promise<ProductVariantInventoryItem[]> {
  const manager = container.resolve("manager")
  const productVariantInventoryService = container
    .resolve("productVariantInventoryService")
    .withTransaction(manager)

  return await Promise.all(
    data
      .filter((d) => d)
      .map(async ({ variant, [InputAlias.InventoryItems]: inventoryItem }) => {
        return await productVariantInventoryService.attachInventoryItem(
          variant.id,
          inventoryItem.id
        )
      })
  )
}
