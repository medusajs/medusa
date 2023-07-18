import {
  CreateInventoryItemInput,
  IInventoryService,
  InventoryItemDTO,
  MedusaContainer,
  ProductTypes,
} from "@medusajs/types"
import { EntityManager } from "typeorm"

export async function createInventoryItems({
  container,
  manager,
  data,
}: {
  container: MedusaContainer
  manager: EntityManager
  data: ProductTypes.ProductDTO[]
}) {
  const inventoryService: IInventoryService =
    container.resolve("inventoryService")
  const context = { transactionManager: manager }

  const variants = data.reduce(
    (
      acc: ProductTypes.ProductVariantDTO[],
      product: ProductTypes.ProductDTO
    ) => {
      return acc.concat(product.variants)
    },
    []
  )

  const inventoryDataMap = new Map<
    string,
    CreateInventoryItemInput | InventoryItemDTO
  >(
    variants
      .filter((variant) => {
        return variant.manage_inventory
      })
      .map((variant) => {
        /* */

        return [
          variant.sku!,
          {
            sku: variant.sku!,
            origin_country: variant.origin_country!,
            hs_code: variant.hs_code!,
            mid_code: variant.mid_code!,
            material: variant.material!,
            weight: variant.weight!,
            length: variant.length!,
            height: variant.height!,
            width: variant.width!,
          },
        ]
      })
  )

  const inventoryItems = await inventoryService!.createInventoryItems(
    [...inventoryDataMap.values()] as CreateInventoryItemInput[],
    context
  )

  return inventoryItems.map((item) => {
    inventoryDataMap.set(item.sku!, item)
  })
}
