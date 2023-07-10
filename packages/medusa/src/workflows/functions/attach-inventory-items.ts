import {
  InventoryItemDTO,
  MedusaContainer,
  ProductTypes,
} from "@medusajs/types"
import { EntityManager } from "typeorm"

export async function attachInventoryItems({
  container,
  manager,
  data,
}: {
  container: MedusaContainer
  manager: EntityManager
  data: {
    variant: ProductTypes.ProductVariantDTO
    inventoryItem: InventoryItemDTO
  }[]
}) {
  const productVariantInventoryService = container
    .resolve("productVariantInventoryService")
    .withTransaction(manager)

  return await Promise.all(
    data
      .filter((d) => d)
      .map(async ({ variant, inventoryItem }) => {
        return await productVariantInventoryService.attachInventoryItem(
          variant.id,
          inventoryItem.id
        )
      })
  )
}
