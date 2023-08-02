import {
  IInventoryService,
  InventoryItemDTO,
  ProductTypes,
} from "@medusajs/types"

import { InputAlias } from "../definitions"
import { PipelineHandlerResult, WorkflowArguments } from "../helper"

export async function createInventoryItems<
  T = { variant: any; inventoryItem: InventoryItemDTO }[]
>({
  container,
  data,
}: WorkflowArguments & {
  data: {
    [InputAlias.Products]: ProductTypes.ProductDTO[]
  }
}): Promise<PipelineHandlerResult<T>> {
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

  return (await Promise.all(
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
  )) as PipelineHandlerResult<T>
}
