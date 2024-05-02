import { WorkflowArguments } from "@medusajs/workflows-sdk"
import { IInventoryService, ProductVariantDTO } from "@medusajs/types"

export async function useVariantsInventoryItems({
  data,
  container,
}: WorkflowArguments<{
  updateProductsExtractDeletedVariantsOutput: { variants: ProductVariantDTO[] }
}>) {
  const inventoryService: IInventoryService =
    container.resolve("inventoryService")

  if (!inventoryService) {
    const logger = container.resolve("logger")
    logger.warn(
      `Inventory service not found. You should install the @medusajs/inventory package to use inventory. The 'useVariantsInventoryItems' will be skipped.`
    )
    return {
      alias: useVariantsInventoryItems.aliases.output,
      value: null,
    }
  }

  const [inventoryItems] = await inventoryService!.listInventoryItems({
    sku: data.updateProductsExtractDeletedVariantsOutput.variants.map(
      (v) => v.id
    ),
  })

  const variantItems = inventoryItems.map((item) => ({
    inventoryItem: item,
    tag: data.updateProductsExtractDeletedVariantsOutput.variants.find(
      (variant) => variant.sku === item.sku
    )!.id,
  }))

  return {
    alias: useVariantsInventoryItems.aliases.output,
    value: { inventoryItems: variantItems },
  }
}

useVariantsInventoryItems.aliases = {
  variants: "variants",
  output: "useVariantsInventoryItemsOutput",
}
