import {
  InventoryItemDTO,
  MedusaContainer,
  ProductTypes,
} from "@medusajs/types"
import { EntityManager } from "typeorm"
import { ProductVariantInventoryService } from "../../services"

export async function detachInventoryItems({
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

  return await Promise.all(
    data.map(async ({ variant, inventoryItem }) => {
      return await productVariantInventoryService.detachInventoryItem(
        inventoryItem.id,
        variant.id
      )
    })
  )
}
