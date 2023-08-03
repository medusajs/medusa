import { InventoryItemDTO, ProductTypes } from "@medusajs/types"

import { InputAlias } from "../../definitions"
import { WorkflowArguments } from "../../helper"

export async function attachInventoryItems<T = any[]>({
  container,
  data,
}: WorkflowArguments & {
  data: {
    variant: ProductTypes.ProductVariantDTO
    [InputAlias.InventoryItems]: InventoryItemDTO
  }[]
}): Promise<any[]> {
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
