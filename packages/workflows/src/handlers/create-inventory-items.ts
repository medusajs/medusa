import { IInventoryService, ProductTypes } from "@medusajs/types"

import { InputAlias } from "../definitions"
import { WorkflowArguments } from "../helper"

export async function createInventoryItems({
  container,
  data,
}: WorkflowArguments & {
  data: {
    [InputAlias.Products]: ProductTypes.ProductDTO[]
  }
}) {
  const manager = container.resolve("manager")
  const inventoryService: IInventoryService =
    container.resolve("inventoryService")
  const context = { transactionManager: manager }

  const products = data[InputAlias.Products]
  const variants = products.reduce(
    (
      acc: ProductTypes.ProductVariantDTO[],
      product: ProductTypes.ProductDTO
    ) => {
      return acc.concat(product.variants)
    },
    []
  )

  const value = await Promise.all(
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

  return {
    alias: InputAlias.InventoryItems,
    value,
  }
}
