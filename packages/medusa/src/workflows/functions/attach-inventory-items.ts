import {
  InventoryItemDTO,
  MedusaContainer,
  ProductTypes,
} from "@medusajs/types"
import { EntityManager } from "typeorm"
import { ProductVariantInventoryService } from "../../services"

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
  const productVariantInventoryService: ProductVariantInventoryService =
    container.resolve("productVariantInventoryService").withTransaction(manager)

  const inventoryData = data.map(({ variant, inventoryItem }) => ({
    variantId: variant.id,
    inventoryItemId: inventoryItem.id,
  }))

  return await productVariantInventoryService.attachInventoryItem(inventoryData)
}
