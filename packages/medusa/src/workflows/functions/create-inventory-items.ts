import {
  IInventoryService,
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

  return await Promise.all(
    variants.map(async (variant) => {
      if (!variant.manage_inventory) {
        return
      }

      const inventoryItem = await inventoryService!.createInventoryItem(
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
        context
      )

      return { variant, inventoryItem }
    })
  )
}
